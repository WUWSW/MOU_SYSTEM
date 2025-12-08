<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Navbar -->
    <nav class="flex justify-between items-center bg-white p-4 rounded shadow">
      <div class="text-xl font-bold">LOGO</div>
      <ul class="flex gap-6">
        <li><a href="#" class="hover:text-blue-500">Home</a></li>
        <li>
          <a href="#" class="hover:text-blue-500">About</a>
        </li>
        <li>
          <a href="#" class="hover:text-blue-500">Contact</a>
        </li>
        <li>
          <a href="#" class="hover:text-blue-500">Profile</a>
        </li>
      </ul>
      <button class="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
        Logout
      </button>
    </nav>

    <!-- Profile Section -->
    <div class="mt-6 flex flex-col lg:flex-row gap-6">
      <!-- Left: Avatar & Basic Info -->
      <div class="bg-white p-6 rounded shadow w-full lg:w-1/3 flex flex-col items-center">
        <img
          src="https://via.placeholder.com/120"
          alt="Avatar"
          class="rounded-full mb-4"
        />
        <h2 class="text-lg font-bold mb-2">{{ profile.name }}</h2>
        <p>ID: {{ profile.id }}</p>
        <p>Organization: {{ profile.organization }}</p>
      </div>

      <!-- Right: Detailed Info -->
      <div class="flex-1 space-y-6">
        <!-- General Information -->
        <div class="bg-white p-6 rounded shadow">
          <h3 class="text-lg font-bold mb-4">General Information</h3>
          <div class="grid grid-cols-2 gap-2">
            <p class="font-semibold">Name:</p>
            <p>{{ profile.name }}</p>

            <p class="font-semibold">Nick Name:</p>
            <p>{{ profile.nickName }}</p>

            <p class="font-semibold">Gender:</p>
            <p>{{ profile.gender }}</p>

            <p class="font-semibold">Birthday:</p>
            <p>{{ profile.birthday }}</p>

            <p class="font-semibold">Nationality:</p>
            <p>{{ profile.nationality }} <span>{{ profile.flag }}</span></p>

            <p class="font-semibold">Email:</p>
            <p>{{ profile.email }}</p>

            <p class="font-semibold">Phone Number:</p>
            <p>{{ profile.phone }}</p>

            <p class="font-semibold">Address:</p>
            <p>{{ profile.address }}</p>
          </div>
        </div>

        <!-- Other Information -->
        <div class="bg-white p-6 rounded shadow">
          <h3 class="text-lg font-bold mb-2">Other Information</h3>
          <p>{{ profile.otherInfo }}</p>
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
</script>

<style>
/* optional global style */
</style>
