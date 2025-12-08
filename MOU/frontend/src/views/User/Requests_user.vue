<template>
    <div class="requests-page">
        
        <div class="main-nav-bar">
            <div class="logo">LOGO</div>
            <div class="nav-links">
                <router-link to="/User" class="nav-link">Dashboard</router-link>
                <router-link to="/requests" class="nav-link active">Request MOU</router-link>
                <router-link to="/history" class="nav-link">History</router-link>
                <router-link to="/profile" class="nav-link">Profile</router-link>
            </div>
            <button @click="logout" class="btn-logout">Logout</button>
        </div>

        <div class="content-container">
            
            <div class="left-menu-container">
                
                <a href="https://docs.google.com/spreadsheets/d/1s7JFXI6Dv0Qb1oI31fqgrSmmmZh-wV5_SaQDy4iUfn8/edit?gid=0#gid=0" 
                   target="_blank" class="mou-menu-card active">
                    <div class="icon-text-group">
                        <span class="icon">📝</span>
                        <p>ติดตามสถานะการพิจารณา<br>MOU/MOA/Agreement</p>
                    </div>
                </a>

                <a href="https://docs.google.com/spreadsheets/d/1qdHKwis6YsZ5DZzrHT6eABCsRTLeKoexpMuA-LfvINk/edit?gid=1132496529#gid=1132496529" 
                   target="_blank" class="mou-menu-card">
                    <div class="icon-text-group">
                        <span class="icon">🌐</span>
                        <p>รายชื่อ MOU/MOA/<br>Agreement</p>
                    </div>
                </a>
                
                <a href="https://sites.google.com/mfu.ac.th/global/mou/%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%81%E0%B8%B2%E0%B8%A3-mou" 
                   target="_blank" class="mou-menu-card">
                    <div class="icon-text-group">
                        <span class="icon">✍️</span>
                        <p>คณะกรรมการพิจารณาบันทึก<br>ความร่วมมือระหว่าง<br>มหาวิทยาลัยแม่ฟ้าหลวงกับ<br>หน่วยงานต่างประเทศ</p>
                    </div>
                </a>
                
                <a href="https://drive.google.com/drive/folders/1y3PtSE3fT4RbunulHBcd7ISsE8BGa6kH" 
                   target="_blank" class="mou-menu-card">
                    <div class="icon-text-group">
                        <span class="icon">✅</span>
                        <p>แบบฟอร์มเสนอส่วนพัฒนา<br>ความสัมพันธ์ระหว่างประเทศ<br>และผู้เชี่ยวชาญการใช้ภาษาต่างประเทศ<br>และข้อความทางกฎหมาย</p>
                    </div>
                </a>
            </div>

            <div class="right-content-area">
                
                <div class="request-list-header">
                    <h2>คำขอทั้งหมด (Requests)</h2>
                    <a href="https://docs.google.com/document/d/1Gczs8STzLvuXc93VIayjYBDtZnAWzsGp/edit" target="_blank"
                        class="btn-create-request">
                        + สร้างคำขอใหม่
                    </a>
                </div>

                <div class="filters">
                    <select v-model="filterStatus">
                        <option value="">ทุกสถานะ</option>
                        <option value="PENDING">รอดำเนินการ</option>
                        <option value="APPROVED">อนุมัติแล้ว</option>
                        <option value="REJECTED">ปฏิเสธ</option>
                    </select>
                </div>

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

                        <div v-if="req.related_mou" class="related">
                            <strong>MoU:</strong> {{ req.related_mou.mou_title }} ({{ req.related_mou.mou_number }})
                        </div>

                        <div v-if="req.status === 'PENDING' && isApprover" class="action-buttons">
                            <button @click="approveRequest(req._id, 'APPROVED')" class="btn-approve">อนุมัติ</button>
                            <button @click="openRejectModal(req._id)" class="btn-reject">ปฏิเสธ</button>
                        </div>

                        <div v-if="req.status === 'REJECTED' && req.rejected_reason" class="reject-reason">
                            <strong>เหตุผล:</strong> {{ req.rejected_reason }}
                        </div>

                    </div>
                </div>

                <div v-else class="empty-state">
                    <p>ยังไม่มีคำขอในระบบ</p>
                </div>

            </div>
        </div>

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

        <div class="main-footer">
            <div class="footer-content-wrapper">
                
                <div class="footer-section contact-info">
                    <h3>Contact</h3>
                    <div class="info-item">
                        <span class="icon">📍</span>
                        <p>Mae Fah Luang, Mueang Chiang Rai District, Chiang Rai 57100</p>
                    </div>
                    <div class="info-item">
                        <span class="icon">📧</span>
                        <p>reg@mfu.ac.th</p>
                    </div>
                </div>

                <div class="footer-section follow-us">
                    <h3>Follow</h3>
                    <div class="social-item">
                        <span class="icon">📘</span>
                        <a href="#">Facebook</a>
                    </div>
                    <div class="social-item">
                        <span class="icon">🌐</span>
                        <a href="#">Website</a>
                    </div>
                    <div class="social-item">
                        <span class="icon">▶️</span>
                        <a href="#">Youtube</a>
                    </div>
                </div>
            </div>
            <div class="copyright">
                <p>Created by: GUS.GAN.CHAT Computer engineer, Mae Fah Luang University</p>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
// ตรวจสอบ user ว่ามีค่าหรือไม่ ป้องกัน error
const userStr = localStorage.getItem('user')
const user = ref(userStr ? JSON.parse(userStr) : {})
const token = localStorage.getItem('token')

const requests = ref([])
const filterStatus = ref('')
const showRejectModal = ref(false)
const currentRejectId = ref(null)
const rejectReason = ref('')

// จำลองการเป็น Approver
const isApprover = computed(() => {
    return user.value && ['admin', 'approve'].includes(user.value.role)
})

// const isApprover = computed(() => {
//     return true 
// })


const filteredRequests = computed(() => {
    if (!filterStatus.value) return requests.value
    return requests.value.filter(r => r.status === filterStatus.value)
})

const statusText = (s) => {
    const map = { PENDING: 'รอดำเนินการ', APPROVED: 'อนุมัติแล้ว', REJECTED: 'ปฏิเสธ' }
    return map[s] || s
}

const formatDate = (d) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('th-TH')
}

const loadRequests = async () => {
    // 1. ประกาศ Mock Data ไว้บนสุด เพื่อให้เรียกใช้ได้เสมอเมื่อเกิด Error
    const mockRequest = {
        _id: "693733cbfdec21eb1938f4e9",
        request_type: "MOU_CREATE",
        title: "ขอสร้าง MoU ใหม่กับมหาวิทยาลัยญี่ปุ่น (จำลอง)",
        description: "ขอความร่วมมือด้านวิศวกรรมศาสตร์ (Backend Error)",
        requester: { fullname: "ผู้ขอคำขอ (User)", username: "req_user" }, 
        status: "PENDING",
        related_mou: null,
        createdAt: new Date().toISOString(),
    };

    try {
        // 2. พยายามดึงข้อมูลจาก Backend
        const res = await axios.get('http://localhost:3000/requests', {
            headers: { Authorization: `Bearer ${token}` } 
        })

        if (res.data.success) {
            requests.value = res.data.data
        } else {
            // กรณี Backend ตอบกลับมาแต่ success: false
            requests.value = [mockRequest];
        }
    } catch (err) {
        console.error('โหลดคำขอไม่สำเร็จ (แสดงข้อมูลจำลอง):', err)
        // 3. เมื่อเกิด Error (เช่น 500) ให้ใช้ Mock Data ทันที
        requests.value = [mockRequest];
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
            approved_by: user.value._id || 'mock_approver_id', 
            rejected_reason: status === 'REJECTED' ? rejectReason.value : undefined
        }

        await axios.put(`http://localhost:3000/requests/${id}/approve`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        })

        if (status === 'REJECTED') showRejectModal.value = false
        loadRequests()
    } catch (err) {
        alert('ไม่สามารถดำเนินการได้: ' + (err.response?.data?.message || err.message))
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
/* Define MFLU Colors */
.requests-page {
    --mflu-red-dark: #B20000;
    --mflu-red-light: #E84B4B;
    --mflu-gray-dark: #333333;
    --mflu-gray-light: #F8F8F8;
    /* --mflu-approved: #4CAF50;
    /* --mflu-rejected: #F44336; */
    /* --mflu-pending: #FF9800; */ 
}

/* Reset page padding */
.requests-page {
    padding: 0;
    margin: 0;
    min-height: 100vh;
    background-color: #f0f2f5; /* Light background for the whole page */
}

/* 1. TOP NAVIGATION BAR (Dashboard Style) */
.main-nav-bar {
    background: white;
    padding: 15px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 0; 
    position: sticky;
    top: 0;
    z-index: 10;
}

.logo {
    font-size: 24px;
    font-weight: bold;
    color: var(--mflu-red-dark); 
}

.nav-links {
    display: flex;
    gap: 30px;
    margin-left: auto; 
    padding-right: 40px;
}

.nav-link {
    color: #333;
    text-decoration: none;
    font-size: 16px;
    padding: 5px 0;
    position: relative;
    transition: color 0.2s;
}

.nav-link:hover {
    color: var(--mflu-red-dark);
}

.nav-link.active {
    color: var(--mflu-red-dark);
    font-weight: bold;
}

.nav-link.active::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--mflu-red-dark);
    border-radius: 2px;
}

.btn-logout {
    background: var(--mflu-red-dark); 
    color: white;
    padding: 8px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: 0.2s;
    font-weight: 500;
}

.btn-logout:hover {
    background: #8F0000;
}

/* 2. MAIN CONTENT GRID (2 COLUMNS) */
.content-container {
    display: flex;
    padding: 25px 30px; 
    gap: 20px; 
}

/* 2.1 LEFT MENU CARDS (MOU Menu) */
.left-menu-container {
    min-width: 300px; 
    max-width: 300px; 
    display: flex;
    flex-direction: column;
    gap: 12px; 
}

.mou-menu-card {
    text-decoration: none; 
    color: inherit; 
    background: white;
    border-radius: 8px; 
    padding: 15px; 
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07); 
    border: 1px solid #eee;
    cursor: pointer;
    transition: box-shadow 0.2s, background 0.2s;
}

.mou-menu-card:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}



.icon-text-group {
    display: flex;
    align-items: flex-start; 
    gap: 15px; 
}

.mou-menu-card .icon {
    font-size: 30px; 
    min-width: 30px;
    text-align: center;
}

.mou-menu-card p {
    margin: 0;
    font-size: 14px; 
    font-weight: 500;
    line-height: 1.4;
    color: #333;
}

/* 2.2 RIGHT CONTENT AREA (Requests List) */
.right-content-area {
    flex-grow: 1;
    background: white;
    padding: 25px; 
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.request-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.request-list-header h2 {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin: 0;
}

.btn-create-request {
    color: rgb(223, 10, 10);
    padding: 8px 15px;
    border-radius: 6px;
    text-decoration: none;
    font-size: 14px;
    transition: 0.2s;
    font-weight: 500;
}

.btn-create-request:hover {
    background: #8F0000;
}

/* Filters */
.filters {
    margin-bottom: 20px;
}

.filters select {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 14px;
    border: 1px solid #ddd;
}

/* Requests Grid & Cards */
.requests-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px; 
}

.request-card {
    background: #fdfdfd;
    border-radius: 8px;
    padding: 12px; 
    border-left: 5px solid #ccc;
    transition: 0.1s;
}

.request-card.pending { border-left-color: var(--mflu-pending); }
.request-card.approved { border-left-color: var(--mflu-approved); }
.request-card.rejected { border-left-color: var(--mflu-rejected); }

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.type-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    color: white;
}
.type-badge.MOU_CREATE { background: #b80000; }
.type-badge.MOU_RENEW { background: #e91e63; }
.type-badge.ACTIVITY { background: #1976d2; }
.type-badge.OTHER { background: #9c27b0; }


.status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: bold;
    color: white;
}
.status.pending {color: blue; background: var(--mflu-pending); }
.status.approved { color: #2e7d32; background:  var(--mflu-approved); }
.status.rejected {color: red; background: var(--mflu-rejected); }

.request-card h3 {
    font-size: 15px; 
    color: var(--mflu-red-dark);
    margin: 0 0 5px 0;
}

.request-card p {
    font-size: 13px;
    color: #555;
    margin-bottom: 10px;
}

.meta small {
    font-size: 11px;
    color: #777;
}

.action-buttons button {
    margin: 8px 4px 0 0;
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    font-weight: bold;
}
.btn-approve { background: var(--mflu-approved); color: white; }
.btn-reject { background: var(--mflu-rejected); color: white; }

.reject-reason {
    margin-top: 10px;
    padding: 8px;
    background: #fef1f1;
    border-radius: 6px;
    font-size: 12px;
    color: #c62828;
    border: 1px solid #f44336;
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
    padding: 25px;
    border-radius: 10px;
    width: 90%;
    max-width: 450px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal h3 {
    margin-top: 0;
    color: var(--mflu-red-dark);
    font-size: 18px;
}

.modal textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    min-height: 80px;
    font-family: inherit;
}

.modal-actions {
    margin-top: 15px;
    text-align: right;
}

.modal-actions button {
    padding: 8px 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-left: 8px;
}


/* Footer Section (Tab Bar) */
.main-footer {
    background: var(--mflu-red-dark); 
    color: white;
    padding: 30px 40px 10px 40px;
    margin-top: 40px; 
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
}

.footer-content-wrapper {
    display: flex;
    justify-content: space-between;
    max-width: 1000px; 
    margin: 0 auto;
    padding-bottom: 20px;
}

.footer-section {
    flex-basis: 45%;
}

.footer-section h3 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 15px;
    border-bottom: 2px solid white;
    padding-bottom: 5px;
}

/* Contact Info Styling */
.info-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
    gap: 15px;
}

.info-item .icon {
    font-size: 20px;
    min-width: 20px;
    color: white; 
}

.info-item p {
    margin: 0;
    font-size: 15px;
    line-height: 1.5;
}

/* Follow Us Styling */
.social-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    gap: 15px;
}

.social-item .icon {
    font-size: 20px;
    min-width: 20px;
}

.social-item a {
    color: white;
    text-decoration: none;
    font-size: 15px;
    transition: text-decoration 0.2s;
}

.social-item a:hover {
    text-decoration: underline;
}

/* Copyright Bar */
.copyright {
    text-align: right;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    padding-top: 10px;
}

.copyright p {
    margin: 0;
    font-size: 12px;
    opacity: 0.8;
}

/* Media Query for smaller screens (optional but recommended) */
@media (max-width: 768px) {
    .content-container {
        flex-direction: column;
        padding: 20px;
    }
    .left-menu-container {
        min-width: 100%;
        max-width: 100%;
    }
    .right-content-area {
        padding: 20px;
    }
    .main-nav-bar {
        padding: 15px 20px;
        flex-wrap: wrap;
    }
    .nav-links {
        padding-right: 0;
        margin-top: 10px;
        justify-content: space-around;
        width: 100%;
        gap: 10px;
    }
    .footer-content-wrapper {
        flex-direction: column;
        gap: 30px;
    }
    .footer-section {
        flex-basis: 100%;
    }
}
</style>