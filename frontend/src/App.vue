<template>
  <div>
    <h1>ประกาศข่าวสาร</h1>
    <input v-model="title" placeholder="Title">
    <input v-model="content" placeholder="Content">
    <button @click="addNews">Add</button>
    <ul>
      <li v-for="ann in store.announcements" :key="ann.id">
        {{ ann.title }} - {{ ann.content }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAnnouncementStore } from "./stores/announcement.js";

const store = useAnnouncementStore();
const title = ref("");
const content = ref("");

const addNews = async () => {
  if(title.value && content.value){
    await store.addAnnouncement(title.value, content.value);
    title.value = "";
    content.value = "";
  }
}

onMounted(() => {
  store.fetchAnnouncements();
});
</script>
