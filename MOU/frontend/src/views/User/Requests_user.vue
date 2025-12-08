<!-- frontend/src/views/User/RequestsUser.vue -->
<template>
    <div class="requests-page">

        <!-- Topbar + Title + ปุ่มสร้างคำขอใหม่ (Google Form) -->
        <div class="topbar">
            <div class="left-menu">
                <router-link to="/User" class="nav-btn">Home</router-link>
                <router-link to="/requests" class="nav-btn active">Requests</router-link>
                <button class="nav-btn">History</button>
                <button @click="logout" class="nav-btn logout">Logout</button>
            </div>

            <div class="center-title">
                คำขอทั้งหมด (Requests)
            </div>

            <a href="https://docs.google.com/document/d/1Gczs8STzLvuXc93VIayjYBDtZnAWzsGp/edit" target="_blank"
                class="btn-create">
                + สร้างคำขอใหม่
            </a>
        </div>

        <!-- ตัวกรองสถานะ -->
        <div class="filters">
            <select v-model="filterStatus">
                <option value="">ทุกสถานะ</option>
                <option value="PENDING">รอดำเนินการ</option>
                <option value="APPROVED">อนุมัติแล้ว</option>
                <option value="REJECTED">ปฏิเสธ</option>
            </select>
        </div>

        <!-- รายการคำขอ -->
        <div class="requests-grid" v-if="requests.length > 0">
            <div v-for="req in filteredRequests" :key="req._id" class="request-card" :class="{
                pending: req.status === 'PENDING',
                approved: req.status === 'APPROVED',
                rejected: req.status === 'REJECTED'
            }">

                <div class="card-header">
                    <span class="type-badge" :class="req.request_type">
                        {{ req.request_type.replace('_', ' ') }}
                    </span>
                    <span class="status" :class="req.status.toLowerCase()">
                        {{ statusText(req.status) }}
                    </span>
                </div>

                <h3>{{ req.title }}</h3>
                <p>{{ req.description || 'ไม่มีรายละเอียด' }}</p>

                <div class="meta">
                    <small>ผู้ขอ: {{ req.requester?.fullname || req.requester?.username || 'ไม่ระบุ' }}</small><br>
                    <small>วันที่: {{ formatDate(req.createdAt) }}</small>
                </div>

                <!-- แสดง MoU ที่เกี่ยวข้อง -->
                <div v-if="req.related_mou" class="related">
                    <strong>MoU:</strong> {{ req.related_mou.mou_title }} ({{ req.related_mou.mou_number }})
                </div>

                <!-- ปุ่มอนุมัติ/ปฏิเสธ -->
                <div v-if="req.status === 'PENDING' && isApprover" class="action-buttons">
                    <button @click="approveRequest(req._id, 'APPROVED')" class="btn-approve">อนุมัติ</button>
                    <button @click="openRejectModal(req._id)" class="btn-reject">ปฏิเสธ</button>
                </div>

                <!-- เหตุผลปฏิเสธ -->
                <div v-if="req.status === 'REJECTED' && req.rejected_reason" class="reject-reason">
                    <strong>เหตุผล:</strong> {{ req.rejected_reason }}
                </div>

            </div>
        </div>

        <!-- ถ้ายังไม่มีคำขอ -->
        <div v-else class="empty-state">
            <p>ยังไม่มีคำขอในระบบ</p>
        </div>

        <!-- Modal ปฏิเสธ -->
        <div v-if="showRejectModal" class="modal-overlay" @click="showRejectModal = false">
            <div class="modal" @click.stop>
                <h3>ระบุเหตุผลการปฏิเสธ</h3>
                <textarea v-model="rejectReason" placeholder="กรุณาระบุเหตุผล..." required></textarea>
                <div class="modal-actions">
                    <button @click="approveRequest(currentRejectId, 'REJECTED')"
                        class="btn-reject">ยืนยันปฏิเสธ</button>
                    <button @click="showRejectModal = false">ยกเลิก</button>
                </div>
            </div>
        </div>

        <!-- ส่วน MOU Section -->
        <div class="mou-section">
            <div class="mou-header">
                <span class="arrow">➤</span>
                <h1>ติดตามสถานะการพิจารณา<br>MOU/MOA/Agreement</h1>
                <span class="arrow">➤</span>
            </div>
            <div class="mou-grid">
                <div class="mou-card">
                    <img src="https://cdn-icons-png.flaticon.com/512/2914/2914564.png" class="icon">
                    <p>คณะกรรมการพิจารณาบันทึกความร่วมมือกับหน่วยงานต่างประเทศ</p>
                </div>
                <div class="mou-card">
                    <img src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png" class="icon">
                    <p>แบบฟอร์มเสนอส่วนพัฒนาความสัมพันธ์ระหว่างประเทศและข้อกฎหมาย</p>
                </div>
                <div class="mou-card">
                    <img src="https://cdn-icons-png.flaticon.com/512/2838/2838912.png" class="icon">
                    <p>รายชื่อ MOU/MOA/Agreement ที่ลงนามตามปีงบประมาณ</p>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const token = localStorage.getItem('token')

const requests = ref([])
const filterStatus = ref('')
const showRejectModal = ref(false)
const currentRejectId = ref(null)
const rejectReason = ref('')

const isApprover = computed(() => ['admin', 'approve'].includes(user.value.role))

const filteredRequests = computed(() => {
    if (!filterStatus.value) return requests.value
    return requests.value.filter(r => r.status === filterStatus.value)
})

const statusText = (s) => {
    const map = { PENDING: 'รอดำเนินการ', APPROVED: 'อนุมัติแล้ว', REJECTED: 'ปฏิเสธ' }
    return map[s] || s
}

const formatDate = (d) => new Date(d).toLocaleDateString('th-TH')

const loadRequests = async () => {
    try {
        const res = await axios.get('http://localhost:3000/requests')
        if (res.data.success) {
            requests.value = res.data.data
        }
    } catch (err) {
        console.error('โหลดคำขอไม่สำเร็จ:', err)
    }
}

const openRejectModal = (id) => {
    currentRejectId.value = id
    rejectReason.value = ''
    showRejectModal.value = true
}

const approveRequest = async (id, status) => {
    try {
        const payload = {
            status,
            approved_by: user.value._id,
            rejected_reason: status === 'REJECTED' ? rejectReason.value : undefined
        }

        await axios.put(`http://localhost:3000/requests/${id}/approve`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        })

        if (status === 'REJECTED') showRejectModal.value = false
        loadRequests()
    } catch (err) {
        alert('ไม่สามารถดำเนินการได้')
    }
}

const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
}

onMounted(() => {
    loadRequests()
})
</script>

<style scoped>
/* Topbar */
.topbar {
    width: 100%;
    background: #ffffff;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    margin-bottom: 25px;
}

.left-menu {
    display: flex;
    gap: 12px;
    align-items: center;
}

.nav-btn {
    background: #b20000;
    color: white;
    padding: 10px 18px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 15px;
    text-decoration: none;
    transition: 0.2s;
}

.nav-btn:hover {
    background: #8f0000;
}

.nav-btn.active,
.router-link-active {
    background: #7f0000 !important;
    font-weight: bold;
}

.logout {
    background: #555;
}

.logout:hover {
    background: #333;
}

.center-title {
    font-size: 22px;
    font-weight: bold;
    color: #b20000;
    flex-grow: 1;
    text-align: center;
}

.btn-create {
    background: #b20000;
    color: white;
    padding: 10px 20px;
    border-radius: 12px;
    text-decoration: none;
    font-size: 15px;
    transition: 0.2s;
}

.btn-create:hover {
    background: #8f0000;
}

/* Filters & Grid */
.filters {
    margin-bottom: 20px;
}

.filters select {
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 15px;
}

.requests-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 22px;
    margin-bottom: 40px;
}

.request-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-left: 6px solid #ccc;
    transition: transform 0.2s;
}

.request-card:hover {
    transform: translateY(-5px);
}

.request-card.pending {
    border-left-color: #ff9800;
}

.request-card.approved {
    border-left-color: #4caf50;
}

.request-card.rejected {
    border-left-color: #f44336;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.type-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: bold;
    color: white;
}

.type-badge.MOU_CREATE {
    background: #b80000;
}

.type-badge.MOU_RENEW {
    background: #e91e63;
}

.type-badge.ACTIVITY {
    background: #1976d2;
}

.type-badge.OTHER {
    background: #9c27b0;
}

.status {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: bold;
}

.status.pending {
    background: #ff9800;
    color: white;
}

.status.approved {
    background: #4caf50;
    color: white;
}

.status.rejected {
    background: #f44336;
    color: white;
}

.action-buttons button {
    margin: 8px 4px 0 0;
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
}

.btn-approve {
    background: #4caf50;
    color: white;
}

.btn-reject {
    background: #f44336;
    color: white;
}

.reject-reason {
    margin-top: 15px;
    padding: 12px;
    background: #ffebee;
    border-radius: 8px;
    font-size: 14px;
    color: #c62828;
}

.empty-state {
    text-align: center;
    padding: 60px;
    color: #666;
    font-size: 18px;
}

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal h3 {
    margin-top: 0;
    color: #b20000;
}

.modal textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    min-height: 100px;
    font-family: inherit;
}

.modal-actions {
    margin-top: 20px;
    text-align: right;
}

/* MOU Section */
.mou-section {
    margin: 50px 0;
    text-align: center;
}

.mou-header {
    background: #5d8de4;
    color: white;
    padding: 25px 10px;
    border-radius: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 30px;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.mou-header h1 {
    font-size: 26px;
    line-height: 1.4;
    margin: 0;
}

.mou-header .arrow {
    font-size: 40px;
}

.mou-grid {
    margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
}

.mou-card {
    background: #5d8de4;
    color: white;
    padding: 30px 20px;
    border-radius: 12px;
    text-align: center;
    font-size: 16px;
    line-height: 1.6;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s;
}

.mou-card:hover {
    transform: translateY(-8px);
}

.mou-card .icon {
    width: 70px;
    margin-bottom: 15px;
}
</style>
