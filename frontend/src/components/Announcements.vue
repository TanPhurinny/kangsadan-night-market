<template>
  <!-- ⭐ Navbar -->
  <TopNavbar />
  <main class="container">
    <!-- ===== Header Section ===== -->
    <div class="header-section">
      <h1>ประกาศข่าวสาร</h1>
      <button class="create-btn" @click="toggleForm">
        <span v-if="!showForm">+ สร้างประกาศใหม่</span>
        <span v-else>✕ ปิดฟอร์ม</span>
      </button>
    </div>

    <!-- ===== Inline Create Form ===== -->
    <div v-if="showForm" class="form-box">
      <h2>รายละเอียดประกาศ</h2>

      <label>หัวข้อประกาศ</label>
      <input v-model="form.title" type="text" placeholder="กรอกหัวข้อประกาศ" />

      <label>สถานะ</label>
      <select v-model="form.status">
        <option value="">ไม่ระบุ</option>
        <option value="active">ใช้งาน</option>
        <option value="inactive">ปิดใช้งาน</option>
      </select>

      <label>อัปโหลดรูปภาพ</label>
      <input type="file" accept="image/*" @change="onFileChange" />

      <!-- 🔍 Image Preview -->
      <div v-if="previewImage" style="margin-top:12px">
        <img
          :src="previewImage"
          alt="preview"
          style="
            max-width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #ddd;
          "
        />
      </div>

      <label>รายละเอียด</label>
      <textarea v-model="form.content" rows="4" placeholder="กรอกรายละเอียดประกาศ"></textarea>

      <div class="form-actions">
        <button class="cancel-btn" @click="resetForm">ยกเลิก</button>
        <button
          class="save-btn"
          @click="isEditMode ? updateAnnouncement() : createAnnouncement()"
        >
          {{ isEditMode ? 'แก้ไข' : 'บันทึก' }}
        </button>
      </div>
    </div>

    <p v-if="loading" class="loading-text">กำลังโหลดข้อมูล...</p>

    <!-- ===== Announcement Cards ===== -->
    <div class="cards-container">
      <div
        class="card"
        v-for="item in announcements"
        :key="item.id"
      >
        <div class="card-image">
          <img
            v-if="item.imageUrl"
            :src="getImageUrl(item.imageUrl)"
            alt="announcement"
          />
          <div v-else class="no-image">
            <span>ไม่มีรูปภาพ</span>
          </div>
        </div>

        <div class="card-body">
          <div class="card-header">
            <h2>{{ item.title }}</h2>
            <span class="badge" :class="item.status === 'active' ? 'badge-active' : 'badge-inactive'">
              {{ item.status === 'active' ? 'ใช้งานอยู่' : 'ปิดใช้งาน' }}
            </span>
          </div>

          <p class="card-description">{{ item.content }}</p>

          <div class="card-footer">
            <p class="expire">
              อัปเดตล่าสุด {{ new Date(item.updatedAt).toLocaleString('th-TH') }}
            </p>

            <div class="action-buttons">
              <button class="edit-btn" @click="editAnnouncement(item)">
                แก้ไข
              </button>
              <button class="delete-btn" @click="deleteAnnouncement(item.id)">
                ลบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TopNavbar from '@/components/top_navbar.vue'

const previewImage = ref(null)

const API_URL = '/announcements'

const announcements = ref([])
const loading = ref(true)
const showForm = ref(false)

/* 🔑 เพิ่ม state สำหรับแก้ไข */
const isEditMode = ref(false)
const editId = ref(null)

const form = ref({
  title: '',
  content: '',
  status: '',
  image: null
})

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

const resetForm = () => {
  showForm.value = false
  isEditMode.value = false
  editId.value = null
  previewImage.value = null
  form.value = {
    title: '',
    content: '',
    status: '',
    image: null
  }
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.value.image = file
  previewImage.value = URL.createObjectURL(file)
}

onMounted(async () => {
  const res = await fetch(API_URL)
  announcements.value = await res.json()
  loading.value = false
})

const getImageUrl = (url) => {
  if (!url) return ''
  return `http://localhost:3000${url}`
}

/* =============================== CREATE ================================ */
const createAnnouncement = async () => {
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('content', form.value.content)
    formData.append('status', form.value.status)
    if (form.value.image) {
      formData.append('image', form.value.image)
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      body: formData
    })

    const newItem = await res.json()
    announcements.value.unshift(newItem)
    resetForm()
  } catch (err) {
    alert('เพิ่มประกาศไม่สำเร็จ')
  }
}

/* =============================== EDIT (ดึงข้อมูลขึ้นฟอร์ม) ================================ */
const editAnnouncement = (item) => {
  showForm.value = true
  isEditMode.value = true
  editId.value = item.id

  form.value = {
    title: item.title,
    content: item.content,
    status: item.status,
    image: null
  }

  // 🔑 แสดงรูปเดิม
  previewImage.value = item.imageUrl ? getImageUrl(item.imageUrl) : null
}

/* =============================== UPDATE ================================ */
const updateAnnouncement = async () => {
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('content', form.value.content)
    formData.append('status', form.value.status)
    if (form.value.image) {
      formData.append('image', form.value.image)
    }

    const res = await fetch(`${API_URL}/${editId.value}`, {
      method: 'PUT',
      body: formData
    })

    const updated = await res.json()
    const index = announcements.value.findIndex(i => i.id === editId.value)
    if (index !== -1) {
      announcements.value[index] = updated
    }

    resetForm()
  } catch (err) {
    alert('แก้ไขไม่สำเร็จ')
  }
}

/* =============================== DELETE ================================ */
const deleteAnnouncement = async (id) => {
  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?')) return
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
  announcements.value = announcements.value.filter(i => i.id !== id)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 120px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}


/* ===== Header Section ===== */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  background: #fff;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.header-section h1 {
  margin: 0;
  font-size: 28px;
  color: #000000;
}

.create-btn {
  background: linear-gradient(135deg, #ffd400 0%, #ffb700 100%);
  color: #000000;
  border: none;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 212, 0, 0.3);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 212, 0, 0.4);
}

.create-btn:active {
  transform: translateY(0);
}

/* ===== Loading ===== */
.loading-text {
  text-align: center;
  padding: 40px;
  color: #aaaaaa;
  font-size: 16px;
}

/* ===== Cards Container - 2 Cards per Row ===== */
.cards-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* ===== Card ===== */
.card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  transform: translateY(-2px);
}

.card-image {
  width: 100%;
  height: 200px;
  flex-shrink: 0;
  overflow: hidden;
  background: #ecf0f1;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaaaaa;
  font-size: 14px;
}

.card-body {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.card-header h2 {
  margin: 0;
  font-size: 18px;
  color: #000000;
  flex: 1;
  line-height: 1.4;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-active {
  background: #d4edda;
  color: #000000;
}

.badge-inactive {
  background: #f8d7da;
  color: #000000;
}

.card-description {
  color: #aaaaaa;
  line-height: 1.6;
  margin: 0 0 16px 0;
  flex: 1;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #ecf0f1;
}

.expire {
  font-size: 12px;
  color: #aaaaaa;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  color: #000000;
}

.edit-btn {
  background: #febc2f;
  box-shadow: 0 2px 6px rgba(254, 188, 47, 0.35);
}

.edit-btn:hover {
  background: #ffd400;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(254, 188, 47, 0.45);
}

.delete-btn {
  background: #ff292e;
  box-shadow: 0 2px 6px rgba(255, 41, 46, 0.35);
}

.delete-btn:hover {
  background: #ff6b6f;
  box-shadow: 0 4px 10px rgba(255, 41, 46, 0.45);
  transform: translateY(-1px);
}

/* ===== Inline Form ===== */
.form-box {
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 4px 16px rgba(0,0,0,.12);
  margin-bottom: 24px;
  border: 2px solid #ffd400;
}

.form-box h2 {
  margin: 0 0 20px 0;
  color: #000000;
  font-size: 22px;
}

.form-box label {
  display: block;
  margin-top: 16px;
  margin-bottom: 6px;
  font-weight: 600;
  color: #000000;
  font-size: 14px;
}

.form-box input,
.form-box textarea,
.form-box select {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: border-color 0.2s ease;
  color: #000000;
}

.form-box input::placeholder,
.form-box textarea::placeholder {
  color: #aaaaaa;
}

.form-box input:focus,
.form-box textarea:focus,
.form-box select:focus {
  outline: none;
  border-color: #ffd400;
}

.form-box input[type="file"] {
  padding: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}

.cancel-btn,
.save-btn {
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: #ecf0f1;
  color: #000000;
}

.cancel-btn:hover {
  background: #d5dbdb;
}

.save-btn {
  background: linear-gradient(135deg, #ffd400 0%, #ffb700 100%);
  color: #000000;
  box-shadow: 0 2px 8px rgba(255, 212, 0, 0.3);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 212, 0, 0.4);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 16px;
  }

  .create-btn {
    width: 100%;
  }

  .cards-container {
    grid-template-columns: 1fr;
  }
}
</style>
