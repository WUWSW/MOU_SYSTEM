<template>
  <div :style="styles.page">
    <!-- Background Map -->
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg"
      alt="World Map"
      :style="styles.backgroundMap"
    />

    <!-- Navbar -->
    <nav :style="styles.navbar">
      <div :style="styles.logo">LOGO</div>
      <ul :style="styles.navList">
        <li><a href="#" :style="styles.navLink">Home</a></li>
        <li>
          <a href="#" :style="styles.navLink">About ▼</a>
        </li>
        <li><a href="#" :style="styles.navLink">Profile</a></li>
      </ul>
      <button :style="styles.logoutBtn">Logout</button>
    </nav>

    <!-- Main Content -->
    <div :style="styles.contentWrapper">
      <!-- Left: Profile Card -->
      <div :style="styles.profileCard">
        <img src="https://via.placeholder.com/120" alt="Avatar" :style="styles.avatar" />
        <h2 :style="styles.profileName">{{ profile.name }}</h2>
        <p :style="styles.profileText">ID: {{ profile.id }}</p>
        <p :style="styles.profileText">{{ profile.organization }}</p>
      </div>

      <!-- Right: Info Cards -->
      <div :style="styles.infoWrapper">
        <!-- General Information -->
        <div :style="styles.infoCard">
          <h3 :style="styles.cardTitle">General Information</h3>
          <div :style="styles.grid">
            <p :style="styles.label">Name:</p>
            <p :style="styles.value">{{ profile.name }}</p>

            <p :style="styles.label">Nick Name:</p>
            <p :style="styles.value">{{ profile.nickName }}</p>

            <p :style="styles.label">Gender:</p>
            <p :style="styles.value">{{ profile.gender }}</p>

            <p :style="styles.label">Birthday:</p>
            <p :style="styles.value">{{ profile.birthday }}</p>

            <p :style="styles.label">Nationality:</p>
            <p :style="styles.value">{{ profile.nationality }} {{ profile.flag }}</p>

            <p :style="styles.label">Email:</p>
            <p :style="styles.value">{{ profile.email }}</p>

            <p :style="styles.label">Phone Number:</p>
            <p :style="styles.value">{{ profile.phone }}</p>

            <p :style="styles.label">Address:</p>
            <p :style="styles.value">{{ profile.address }}</p>
          </div>
        </div>

        <!-- Other Information -->
        <div :style="styles.infoCard">
          <h3 :style="styles.cardTitle">Other Information</h3>
          <p :style="styles.value">{{ profile.otherInfo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const profile = reactive({
  name: 'Ishmam Ahasan Samni',
  id: '6650101XX',
  organization: 'Mae Fah Luang University',
  nickName: 'Sammy',
  gender: 'Male',
  birthday: '15 Aug 2004',
  nationality: 'Indian',
  flag: '🇮🇳',
  email: '6631512XX@gmail.com',
  phone: '063-441-XXXX',
  address:
    'House No.46, Village No.9, Noknoi Village, Soi Ratchadapisek 66, Bang Sue sub-district, Bang Sue district, Bangkok,10800',
  otherInfo:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
})

const styles = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'sans-serif'
  },
  backgroundMap: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.1,
    pointerEvents: 'none',
    zIndex: 0
  },
  navbar: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '16px',
    margin: '16px',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' },
  navList: { display: 'flex', gap: '24px', alignItems: 'center', listStyle: 'none' },
  navLink: { color: '#1f2937', fontWeight: 500, textDecoration: 'none', cursor: 'pointer' },
  logoutBtn: {
    backgroundColor: '#ec4899',
    color: 'white',
    padding: '8px 20px',
    borderRadius: '9999px',
    border: 'none',
    cursor: 'pointer'
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    margin: '16px'
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '24px',
    textAlign: 'center'
  },
  avatar: { width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 16px', border: '4px solid #e5e7eb' },
  profileName: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '4px', color: '#1f2937' },
  profileText: { color: '#6b7280', marginBottom: '4px' },
  infoWrapper: { display: 'flex', flexDirection: 'column', gap: '24px' },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '24px'
  },
  cardTitle: { fontWeight: 600, fontSize: '1rem', color: '#1f2937', marginBottom: '12px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', color: '#374151' },
  label: { fontWeight: 500 },
  value: { color: '#374151' }
}
</script>
