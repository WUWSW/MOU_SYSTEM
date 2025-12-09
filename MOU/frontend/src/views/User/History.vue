<!-- src/views/History.vue -->
<template>
  <div class="history-page">

    <!-- Navbar เดียวกับหน้า Requests -->
    <div class="main-nav-bar">
      <div class="logo">LOGO</div>
      <div class="nav-links">
        <router-link to="/User" class="nav-link">Dashboard</router-link>
        <router-link to="/requests" class="nav-link">Request MOU</router-link>
        <router-link to="/history" class="nav-link active">History</router-link>
      </div>
      <button @click="logout" class="btn-logout">Logout</button>
    </div>

    <!-- เนื้อหาหลัก: เฉพาะรายการ History -->
    <div class="content">
      <h1 class="page-title">ประวัติคำขอที่ดำเนินการแล้ว</h1>

      <div class="history-list" v-if="history.length > 0">
        <div v-for="req in history" :key="req._id" class="history-card" 
             :class="req.status === 'APPROVED' ? 'approved' : 'rejected'">

          <div class="card-top">
            <div class="type-badge" :class="req.request_type">
              {{ formatType(req.request_type) }}
            </div>
            <div class="status-badge" :class="req.status.toLowerCase()">
              {{ req.status === 'APPROVED' ? 'อนุมัติแล้ว' : 'ปฏิเสธแล้ว' }}
            </div>
          </div>

          <h3>{{ req.title }}</h3>
          <p class="desc">{{ req.description || 'ไม่มีรายละเอียด' }}</p>

          <div class="details">
            <span><strong>ผู้ขอ:</strong> {{ req.requester?.fullname || 'ไม่ระบุ' }}</span>
            <span><strong>วันที่ขอ:</strong> {{ formatDate(req.createdAt) }}</span>
            <span><strong>ตัดสินเมื่อ:</strong> {{ formatDate(req.approved_at) }}</span>
            <span v-if="req.approved_by"><strong>โดย:</strong> {{ req.approved_by.fullname || 'ระบบ' }}</span>
          </div>

          <!-- เหตุผลปฏิเสธ -->
          <div v-if="req.status === 'REJECTED' && req.rejected_reason" class="reject-box">
            <strong>เหตุผลที่ปฏิเสธ:</strong> {{ req.rejected_reason }}
          </div>
        </div>
      </div>

      <div v-else class="empty">
        <p>ยังไม่มีคำขอที่ได้รับการอนุมัติหรือปฏิเสธ</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const history = ref([])

const formatType = (type) => {
  const map = {
    MOU_CREATE: 'สร้าง MoU ใหม่',
    MOU_RENEW: 'ต่ออายุ MoU',
    ACTIVITY: 'กิจกรรม',
    OTHER: 'อื่น ๆ'
  }
  return map[type] || type
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}


const loadHistory = async () => {
  try {
    const res = await axios.get('http://localhost:3000/requests')
    
    if (res.data.success) {
      // กรองเฉพาะที่ตัดสินแล้ว
      let filtered = res.data.data.filter(req => 
        req.status === 'APPROVED' || req.status === 'REJECTED'
      )

      // เรียงล่าสุดก่อน (ใช้ approved_at ถ้ามี ถ้าไม่มีใช้ createdAt)
      filtered.sort((a, b) => {
        const dateA = a.approved_at ? new Date(a.approved_at) : new Date(a.createdAt)
        const dateB = b.approved_at ? new Date(b.approved_at) : new Date(b.createdAt)
        return dateB - dateA
      })

      history.value = filtered
    }
  } catch (err) {
    console.error('โหลดประวัติไม่สำเร็จ:', err)
    history.value = []
  }
}

const logout = () => {
  localStorage.clear()
  router.replace('/login')
}

onMounted(loadHistory)
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Navbar เดียวกับ Requests */
.main-nav-bar {
  background: white;
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}
.logo { font-size: 26px; font-weight: bold; color: #B20000; }
.nav-links { display: flex; gap: 35px; margin-left: auto; margin-right: 30px; }
.nav-link { color: #333; text-decoration: none; font-size: 16px; font-weight: 500; position: relative; padding: 5px 0; }
.nav-link:hover { color: #B20000; }
.nav-link.active { color: #B20000; font-weight: bold; }
.nav-link.active::after { content: ''; position: absolute; bottom: -6px; left: 0; width: 100%; height: 3px; background: #B20000; border-radius: 2px; }
.btn-logout { background: #B20000; color: white; padding: 9px 24px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-logout:hover { background: #900000; }

.content {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
}

.page-title {
  text-align: center;
  font-size: 28px;
  color: #B20000;
  margin-bottom: 30px;
  font-weight: bold;
}

.history-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 20px;
}

.history-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-left: 6px solid #ddd;
}

.history-card.approved { border-left-color: #4CAF50; }
.history-card.rejected { border-left-color: #F44336; }

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.type-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: white;
  font-weight: bold;
}
.type-badge.MOU_CREATE { background: #B20000; }
.type-badge.MOU_RENEW { background: #E91E63; }
.type-badge.ACTIVITY { background: #2196F3; }

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  color: white;
  font-weight: bold;
}
.status-badge.approved { background: #4CAF50; }
.status-badge.rejected { background: #F44336; }

h3 {
  margin: 8px 0;
  color: #B20000;
  font-size: 17px;
}

.desc {
  color: #555;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.details {
  font-size: 13.5px;
  color: #444;
  line-height: 1.7;
}

.reject-box {
  margin-top: 15px;
  padding: 12px;
  background: #ffebee;
  border-radius: 8px;
  border-left: 4px solid #f44336;
  color: #c62828;
  font-size: 14px;
}

.empty {
  text-align: center;
  padding: 100px 20px;
  color: #777;
  font-size: 18px;
}
</style>