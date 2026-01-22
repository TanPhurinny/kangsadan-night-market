import { defineStore } from "pinia";
import axios from "axios";

export const useAnnouncementStore = defineStore("announcement", {
  state: () => ({
    announcements: []
  }),
  actions: {
    async fetchAnnouncements() {
      const res = await axios.get("http://localhost:3000/announcements");
      this.announcements = res.data;
    },
    async addAnnouncement(title, content) {
      const res = await axios.post("http://localhost:3000/announcements", { title, content });
      this.announcements.unshift(res.data);
    }
  }
});
