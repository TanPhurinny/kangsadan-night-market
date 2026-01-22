<template>
  <div class="announcements container mt-4">
    <h2 class="text-center text-primary mb-4">📢 ประกาศล่าสุด</h2>

    <!-- Form เพิ่มประกาศ -->
    <div class="card p-3 mb-4 shadow-sm">
      <h5 class="card-title mb-3">เพิ่มประกาศใหม่</h5>
      <form @submit.prevent="addAnnouncement">
        <div class="mb-2">
          <input
            v-model="newTitle"
            type="text"
            class="form-control"
            placeholder="หัวข้อประกาศ"
            required
          />
        </div>
        <div class="mb-2">
          <textarea
            v-model="newContent"
            class="form-control"
            placeholder="รายละเอียดประกาศ"
            required
          ></textarea>
        </div>
        <div class="mb-2">
          <select v-model="newStatus" class="form-select">
            <option value="">สถานะ</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit" class="btn btn-success w-100">เพิ่มประกาศ</button>
      </form>
    </div>

    <!-- แสดงประกาศเป็น card -->
    <div class="row">
      <div
        v-for="announcement in announcements"
        :key="announcement.id"
        class="col-md-6 mb-3"
      >
        <div class="card shadow-sm h-100">
          <div class="card-body d-flex flex-column justify-content-between">
            <div>
              <h5 class="card-title">{{ announcement.title }}</h5>
              <p class="card-text">{{ announcement.content }}</p>
              <small class="text-muted">
                สถานะ: {{ announcement.status || 'N/A' }} |
                สร้างเมื่อ: {{ formatDate(announcement.createdAt) }}
              </small>
            </div>
            <div class="mt-2 d-flex justify-content-end gap-2">
              <button
                class="btn btn-sm btn-primary"
                @click="editAnnouncement(announcement)"
              >
                แก้ไข
              </button>
              <button
                class="btn btn-sm btn-danger"
                @click="deleteAnnouncement(announcement.id)"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal แก้ไขประกาศ -->
    <div
      class="modal fade"
      id="editModal"
      tabindex="-1"
      aria-hidden="true"
      ref="editModalRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">แก้ไขประกาศ</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <input v-model="editTitle" type="text" class="form-control mb-2" />
            <textarea v-model="editContent" class="form-control mb-2"></textarea>
            <select v-model="editStatus" class="form-select">
              <option value="">สถานะ</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              ปิด
            </button>
            <button type="button" class="btn btn-primary" @click="saveEdit">
              บันทึก
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  name: "Announcements",
  setup() {
    const announcements = ref([]);
    const newTitle = ref("");
    const newContent = ref("");
    const newStatus = ref("");

    const editId = ref(null);
    const editTitle = ref("");
    const editContent = ref("");
    const editStatus = ref("");

    const editModalRef = ref(null);
    let bootstrapModal;

    const API_URL = "http://localhost:3000/announcements"; // เปลี่ยนตาม backend ของคุณ

    onMounted(async () => {
      bootstrapModal = new bootstrap.Modal(editModalRef.value);
      await fetchAnnouncements();
    });

    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get(API_URL);
        announcements.value = res.data;
      } catch (err) {
        console.error(err);
      }
    };

    const addAnnouncement = async () => {
      try {
        const newAnn = {
          title: newTitle.value,
          content: newContent.value,
          status: newStatus.value,
        };
        const res = await axios.post(API_URL, newAnn);
        announcements.value.push(res.data);
        newTitle.value = "";
        newContent.value = "";
        newStatus.value = "";
      } catch (err) {
        console.error(err);
      }
    };

    const deleteAnnouncement = async (id) => {
      if (!confirm("ต้องการลบประกาศนี้ใช่หรือไม่?")) return;
      try {
        await axios.delete(`${API_URL}/${id}`);
        announcements.value = announcements.value.filter(a => a.id !== id);
      } catch (err) {
        console.error(err);
      }
    };

    const editAnnouncement = (announcement) => {
      editId.value = announcement.id;
      editTitle.value = announcement.title;
      editContent.value = announcement.content;
      editStatus.value = announcement.status;
      bootstrapModal.show();
    };

    const saveEdit = async () => {
      try {
        const updated = {
          title: editTitle.value,
          content: editContent.value,
          status: editStatus.value,
        };
        await axios.put(`${API_URL}/${editId.value}`, updated);
        const index = announcements.value.findIndex(a => a.id === editId.value);
        if (index !== -1) announcements.value[index] = { id: editId.value, ...updated, createdAt: announcements.value[index].createdAt };
        bootstrapModal.hide();
      } catch (err) {
        console.error(err);
      }
    };

    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString();
    };

    return {
      announcements,
      newTitle,
      newContent,
      newStatus,
      addAnnouncement,
      deleteAnnouncement,
      editAnnouncement,
      editTitle,
      editContent,
      editStatus,
      saveEdit,
      editModalRef,
      formatDate,
    };
  },
};
</script>

<style scoped>
.announcements {
  max-width: 900px;
  margin: 20px auto;
}
</style>
