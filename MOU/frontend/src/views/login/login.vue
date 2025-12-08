<template>
  <div class="login-container">
    <!-- Header -->
    <header class="header">
      <div class="logo">LOGO</div>
      <div class="lang">TH | EN</div>
    </header>


    <div class="user-icon">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    </div>

    <!-- Title -->
    <h1 class="title">LOGIN</h1>

    <!-- Form -->
    <form @submit.prevent="handleLogin" class="login-form">
      <input v-model="username" type="text" placeholder="username" required class="input-field"
        autocomplete="username" />

      <input v-model="password" type="password" placeholder="password" required class="input-field"
        autocomplete="current-password" />

      <!-- Error Message -->
      <div v-if="error" class="error-msg">{{ error }}</div>

      <a href="#" class="forgot-password">Forgot password</a>

      <button type="submit" :disabled="loading" class="login-btn">
        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'Login' }}
      </button>
    </form>

  </div>
</template>

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
    error.value = 'กรุณากรอก username และ password'
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

    switch (role) {
      case 'admin':
        router.push('/Admin')
        break
      case 'approve':
      case 'approver':
      case 'officer':
        router.push('/Approve')
        break
      default:
        router.push('/User')
    }
  } catch (err) {
    error.value = 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.login-container {
  min-height: 100vh;
  background: white;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 60px;
  color: white;
  z-index: 10;
}

.logo {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 4px;
}

.lang {
  font-size: 14px;
  opacity: 0.8;
  cursor: pointer;
}

/* Login Card */
.login-card {
  background: white;
  color: #000;
  padding: 80px 60px;
  border-radius: 24px;
  width: 100%;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.user-icon {
  width: 120px;
  height: 120px;
  background: #000;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 40px;
  font-size: 60px;
}

.title {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: 6px;
  margin-bottom: 50px;
  color: #000;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;

  width: 500px;
}

.input-field {
  padding: 18px 24px;
  font-size: 16px;
  border: 2px solid #333;
  border-radius: 50px;
  outline: none;
  transition: all 0.3s;
}

.input-field:focus {
  border-color: #000;
  box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.1);
}

.error-msg {
  color: #e74c3c;
  font-size: 14px;
  font-weight: 500;
  margin-top: -10px;
}

.forgot-password {
  align-self: flex-end;
  color: #555;
  font-size: 14px;
  text-decoration: none;
  margin-top: -10px;
  margin-bottom: 20px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-btn {
  margin-top: 20px;
  padding: 16px;
  font-size: 18px;
  font-weight: 600;
  background: #000;
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
}

.login-btn:hover:not(:disabled) {
  background: #333;
  transform: translateY(-2px);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>