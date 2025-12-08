<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'กรุณากรอกข้อมูลให้ครบ'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (data.success) {
      // เก็บ Token และ Role
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      alert(`ยินดีต้อนรับ ${data.user.username} (${data.user.role})`)

      // ไปหน้าตาม Role
      switch (data.user.role) {
        case 'ADMIN':
          router.push('/Admin')
          break
        case 'OFFICER':
          router.push('/Approve')
          break
        case 'USER':
          router.push('/User')
          break
        default:
          router.push('/')
      }
    } else {
      error.value = data.message
    }
  } catch (err) {
    error.value = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <!-- Header -->
    <header class="header">
      <div class="logo">MOU</div>
      <div class="lang">TH|EN</div>
    </header>

    <!-- Login Form อยู่กลางจอ -->
    <div class="login-wrapper">
      <div class="login-card">
        <div class="user-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>

        <h1 class="title">LOGIN</h1>

        <form @submit.prevent="handleLogin" class="login-form">
          <input
            type="text"
            v-model="username"
            placeholder="username"
            required
            class="input-field"
          />
          <input
            type="password"
            v-model="password"
            placeholder="password"
            required
            class="input-field"
          />

          <a href="#" class="forgot-password">Forgot password</a>

          <button type="submit" class="login-button">Login</button>
        </form>
      </div>
    </div>
  </div>

  <form @submit.prevent="handleLogin" class="login-form">
    <input v-model="username" placeholder="username" required class="input-field" />
    <input v-model="password" type="password" placeholder="password" required class="input-field" />

    <div v-if="error" class="error-msg">{{ error }}</div>

    <button type="submit" :disabled="loading" class="login-button">
      {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'Login' }}
    </button>
  </form>

</template>

<script setup>
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const handleLogin = () => {
  if (username.value && password.value) {
    alert(`เข้าสู่ระบบด้วย: ${username.value}`)
    // ต่อ API ที่นี่
  }
}
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

.error-msg {
  color: #d63031;
  font-size: 15px;
  margin: 10px 0;
}

.login-container {
  width: 100vw;
  height: 100vh;
  background: 
    linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),
    url('/img/world-map.png') center/cover no-repeat fixed; /* ใช้รูปสีดำของคุณ */
  position: relative;
  font-family: 'Segoe UI', sans-serif;
  overflow: hidden;
}

/* Header */
.header {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 70px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
  z-index: 100;
  color: white;
}

.logo {
  font-size: 36px;
  font-weight: bold;
  letter-spacing: 3px;
}

.lang {
  font-size: 15px;
  opacity: 0.9;
}

/* Login Card อยู่กลางจอเต็มตา */
.login-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.login-card {
  background: rgba(255, 255, 255, 0.97);
  padding: 70px 80px;
  border-radius: 24px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
  text-align: center;
  min-width: 420px;
  max-width: 500px;
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.user-icon {
  width: 110px;
  height: 110px;
  background: #000;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  font-size: 56px;
}

.title {
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 50px;
  letter-spacing: 2px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.input-field {
  padding: 18px 24px;
  font-size: 17px;
  border: none;
  border-radius: 50px;
  background: #f0f0f0;
  outline: none;
  transition: all 0.3s;
}

.input-field:focus {
  background: white;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.15);
}

.forgot-password {
  align-self: flex-end;
  color: #555;
  font-size: 14px;
  text-decoration: none;
  margin-top: -8px;
}

.forgot-password:hover {
  text-decoration: underline;
  color: #000;
}

.login-button {
  margin-top: 20px;
  padding: 18px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: #000;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
}

.login-button:hover {
  background: #333;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
</style>