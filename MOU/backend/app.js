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
const Request = require('./models/request');

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
// Get all users
app.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, data: users });
});

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
//////////////////////////Request////////////////////////////

app.get("/requests", async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// สร้างคำขอใหม่
app.post("/requests", async (req, res) => {
  try {
    const request = new Request(req.body);
    await request.save();
    
    // เพิ่ม Log
    await new Log({
      user_id: req.body.requester,
      action: `สร้างคำขอ: ${request.title}`,
    }).save();

    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});



app.get("/requests/pending", async (req, res) => {
  try {
    const requests = await Request.find({ status: "PENDING" })
      .populate("requester", "fullname username")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.get("/requests/history", async (req, res) => {
  try {
    const requests = await Request.find({
      status: { $in: ["APPROVED", "REJECTED"] }
    })
      .populate("requester", "fullname username")
      .populate("approved_by", "fullname username")
      .sort({ approved_at: -1 }); // ล่าสุดที่ตัดสินก่อน

    res.json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// อนุมัติ / ปฏิเสธคำขอ
app.put("/requests/:id/approve", async (req, res) => {
  try {
    const { status, rejected_reason } = req.body; // APPROVED or REJECTED
    const updateData = {
      status,
      approved_by: req.body.approved_by,
      approved_at: new Date(),
    };
    if (status === 'REJECTED') updateData.rejected_reason = rejected_reason;

    const request = await Request.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('requester');

    // Log
    await new Log({
      user_id: req.body.approved_by,
      action: `${status === 'APPROVED' ? 'อนุมัติ' : 'ปฏิเสธ'}คำขอ: ${request.title}`,
    }).save();

    res.json({ success: true, data: request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//////////////////////////PARTNERS//////////////////////////
app.get("/partners", async (req, res) => {
  const partners = await Partner.find();
  res.json({ success: true, data: partners });
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
app.get("/mou", async (req, res) => {
  const mou = await Mou.find();
  res.json({ success: true, data: mou });
});

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
app.get("/activities", async (req, res) => {
  const activities = await Activity.find();
  res.json({ success: true, data: activities });
});

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
app.get("/notifications", async (req, res) => {
  const noti = await Notification.find();
  res.json({ success: true, data: noti });
});

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
app.get("/logs", async (req, res) => {
  const logs = await Log.find();
  res.json({ success: true, data: logs });
});

app.post("/logs", async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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