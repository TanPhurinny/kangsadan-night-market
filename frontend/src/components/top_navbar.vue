
<template>
  <header class="navbar">
    <div class="navbar-left">
      <span class="brand">ตลาดกังสดาลไนท์</span>
    </div>

    <button class="hamburger" @click="toggleMenu">
      ☰
    </button>

    <nav :class="['navbar-menu', { open: isOpen }]">
      <a v-for="menu in menus"
         :key="menu"
         href="#"
         :class="{ active: menu === activeMenu }">
        {{ menu }}
      </a>
    </nav>
  </header>
</template>

<script setup>


import { ref } from 'vue'

const isOpen = ref(false)

const menus = [
  'แดชบอร์ด',
  'พื้นตลาด',
  'การแจ้งคำร้อง',
  'รายการอนุมัติ',
  'สิทธิการใช้งาน',
  'คะแนนร้านค้า',
  'โปรโมชั่นและคูปอง',
  'สรุปผลการประเมินร้านค้า',
  'ประกาศ'
]

const activeMenu = 'ประกาศ'

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}
</script>

<style scoped>
.navbar {
  position: fixed;        /* ⭐ สำคัญ */
  top: 0;
  left: 0;
  width: 100vw;           /* ⭐ กินเต็มจอ */
  height: 56px;
  background: #ffd400;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
}

.brand {
  font-weight: bold;
  font-size: 18px;
}

.navbar-menu {
  display: flex;
  gap: 16px;
}
.navbar-menu a {
  text-decoration: none;
  color: #000;
  font-size: 14px;
}

.navbar-menu a.active {
  font-weight: bold;
  border-bottom: 2px solid #000;
}

.hamburger {
  display: none;
  font-size: 22px;
  background: none;
  border: none;
  cursor: pointer;
}

/* ===== Mobile ===== */
@media (max-width: 768px) {
  .navbar-menu {
    position: absolute;
    top: 56px;
    left: 0;
    right: 0;
    background: #ffd400;
    flex-direction: column;
    display: none;
    padding: 10px 20px;
  }

  .navbar-menu.open {
    display: flex;
  }
}
</style>
