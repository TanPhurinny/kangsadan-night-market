import { defineStore } from "pinia";
import axios from "axios";

export const useAnnouncementStore = defineStore("announcement", {
  state: () => ({
    announcements: [],
  }),
  actions: {
    async fetchAll() {
      const res = await axios.get("http://localhost:3000/announcements");
      this.announcements = res.data;
    },
    async create(title, content, status) {
      const res = await axios.post("http://localhost:3000/announcements", { title, content, status });
      this.announcements.unshift(res.data);
    },
    async update(id, title, content, status) {
      const res = await axios.put(`http://localhost:3000/announcements/${id}`, { title, content, status });
      const index = this.announcements.findIndex(a => a.id === id);
      if (index !== -1) this.announcements[index] = res.data;
    },
    async remove(id) {
      await axios.delete(`http://localhost:3000/announcements/${id}`);
      this.announcements = this.announcements.filter(a => a.id !== id);
    }
  }
});
