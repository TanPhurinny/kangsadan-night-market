<template>
  <div id="app" class="container mt-4">
    

    <!-- Component ประกาศ -->
    <Announcements />

    <!-- ตัวอย่างส่วนอื่น ๆ ของหน้า -->
    <div class="mt-5">
    </div>
  </div>
</template>

<script>
// import Bootstrap CSS/JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// import component ของเรา
import Announcements from './components/Announcements.vue'; // <-- แก้ path ให้ตรงกับโฟลเดอร์จริง

export default {
  name: 'App',
  components: {
    Announcements
  }
}
</script>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
}
</style>
