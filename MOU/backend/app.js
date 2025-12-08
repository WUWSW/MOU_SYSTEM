// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Partner = require('./models/Partner');
const User = require("./models/user");
const Mou = require("./models/mou");
const MouPartner = require("./models/mou_partner");
const Activity = require("./models/activities");
const Notification = require("./models/notifications");
const Log = require("./models/logs");

const app = express();
app.use(express.json());
const PORT = 3000;
const SECRET_KEY = 'mou-secret-key-2025'; // เปลี่ยนได้ใน production

const MONGO_URI = 'mongodb+srv://user:1111@cluster0.lbtbl38.mongodb.net/'

// Middleware
app.use(cors());
app.use(express.json());

//MongoDB Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

//Routes

//////////////////////////USERS//////////////////////////
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

//////////////////////////PARTNERS//////////////////////////
app.get("/partners", (req, res) => {
  res.send("MOU system running...");
});

app.post("/partners", async (req, res) => {
  try {
    const partner = new Partner(req.body);
    await partner.save();
    res.json({ success: true, data: partner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//////////////////////////MOUS//////////////////////////

app.post("/mou", async (req, res) => {
  try {
    const mou = new Mou(req.body);
    await mou.save();
    res.json({ success: true, data: mou });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//////////////////////////MOUS_PARTNERS//////////////////////////
app.post("/mou_partner", async (req, res) => {
  try {
    const mouPartner = new MouPartner(req.body);
    await mouPartner.save();
    res.json({ success: true, data: mouPartner });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//////////////////////////ACTIVITIES//////////////////////////
app.post("/activities", async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.json({ success: true, data: activity });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//////////////////////////NOTIFICATIONS//////////////////////////
app.post("/notifications", async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//////////////////////////LOGS//////////////////////////
app.post("/logs", async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



// const users = [
//   { id: 1, username: 'admin', password: '$2b$10$z5f5j5Qz5j5Qz5j5Qz5j5uabc123', role: 'ADMIN' },
//   { id: 2, username: 'officer', password: '$2b$10$z5f5j5Qz5j5Qz5j5Qz5j5uabc123', role: 'OFFICER' },
//   { id: 3, username: 'user01', password: '$2b$10$z5f5j5Qz5j5Qz5j5Qz5j5uabc123', role: 'USER' },
//   { id: 4, username: 'guest', password: '$2b$10$z5f5j5Qz5j5Qz5j5Qz5j5uabc123', role: 'GUEST' }
// ];

// หน้าแรก
app.get('/', (req, res) => {
  res.json({ message: 'MOU Backend ทำงานเรียบร้อย!', status: 'OK' });
});

// API Login (ใช้ MongoDB จริง)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // ค้นหาผู้ใช้จาก MongoDB
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });
    }

    // ตรวจสอบรหัสผ่าน
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'รหัสผ่านผิด' });
    }

    // สร้าง Token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      SECRET_KEY,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      token,
      user: {
        username: user.username,
        role: user.role
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
  }
});


app.listen(PORT, () => {
  console.log(`Backend รันที่ http://localhost:${PORT}`);
});