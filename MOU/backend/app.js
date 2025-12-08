// backend/app.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'mou-secret-key-2025'; // เปลี่ยนได้ใน production
const hashPassword = (pwd) => bcrypt.hashSync(pwd, 10);
// Middleware
app.use(cors());
app.use(express.json());

// ข้อมูลผู้ใช้ตัวอย่าง (ในของจริงจะอยู่ใน Database)
const users = [
  { id: 1, username: 'admin',   password: hashPassword('1234'), role: 'ADMIN' },
  { id: 2, username: 'officer', password: hashPassword('1234'), role: 'OFFICER' },
  { id: 3, username: 'user01',  password: hashPassword('1234'), role: 'USER' },
  { id: 4, username: 'guest',   password: hashPassword('1234'), role: 'GUEST' }
];

// หน้าแรก
app.get('/', (req, res) => {
  res.json({ message: 'MOU Backend ทำงานเรียบร้อย!', status: 'OK' });
});

// API Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // หาผู้ใช้
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ success: false, message: 'ไม่พบผู้ใช้' });
  }

  // ตรวจสอบรหัสผ่าน (ในตัวอย่างใช้รหัสผ่าน "1234" ทุกคน)
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ success: false, message: 'รหัสผ่านผิด' });
  }

  // สร้าง Token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
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
});

app.listen(PORT, () => {
  console.log(`Backend รันที่ http://localhost:${PORT}`);
});