<template>
  <div class="dashboard">

  <div class="main-nav-bar">
  <div class="logo">LOGO</div>
  <div class="nav-links">
    <router-link to="/User" class="nav-link active">Dashboard</router-link>
    <router-link to="/requests" class="nav-link">Request MOU</router-link>
    <router-link to="/history" class="nav-link">History</router-link>
  </div>
  <button @click="logout" class="btn-logout">Logout</button>
</div>

    <!-- Header -->
    <div class="header">MFU International Collaboration</div>

    <!-- Main Container -->
    <div class="container">
      <!-- World Map -->
      <div class="card">
        <h3>World Collaboration Map</h3>
        <div ref="worldMap" class="chart"></div>
      </div>

      <!-- Top Countries + Stats -->
      <div class="card">
        <h3>Top Countries</h3>
        <div ref="countryChart" class="chart"></div>

        <div class="subgrid">
          <div class="stat-box">MoU<br><span>157</span></div>
          <div class="stat-box">University<br><span>120</span></div>
          <div class="stat-box">Country<br><span>30</span></div>
          <div class="stat-box">Network<br><span>10</span></div>
        </div>
      </div>
    </div>

    <!-- Lower Grid -->
    <div class="full-grid">
      <!-- Cluster -->
      <div class="card">
        <h3>Cluster</h3>
        <div ref="clusterChart" class="chart-small"></div>
      </div>

      <!-- Network List -->
      <div class="card">
        <h3>Network</h3>
        <ul class="network-list">
          <li>University Consortium of the 21st Century</li>
          <li>University Alliance of the Silk Road</li>
          <li>South & Southeast Asian University Network</li>
          <li>Joint Declaration of GMS Universities</li>
          <li>Belt and Road International Medical Alliance</li>
        </ul>
      </div>

      <!-- MoU by Year -->
      <div class="card">
        <h3>MoU by Year</h3>
        <div ref="yearChart" class="chart-small"></div>
      </div>
    </div>

    <!-- Agreement Table -->
    <div class="card table-card">
      <h3>MoU / MoA / Agreements</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>MoU/MoA/Agreement</th>
            <th>Country</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>11</td>
            <td>Vaccine & Gene Therapy Institute</td>
            <td>USA</td>
            <td>VALID</td>
          </tr>
          <tr>
            <td>12</td>
            <td>University of Wisconsin Milwaukee</td>
            <td>USA</td>
            <td>VALID</td>
          </tr>
          <tr>
            <td>13</td>
            <td>University of Tsukuba</td>
            <td>Japan</td>
            <td>VALID</td>
          </tr>
          <tr>
            <td>14</td>
            <td>University of Shizuoka</td>
            <td>Japan</td>
            <td>VALID</td>
          </tr>
          <tr>
            <td>15</td>
            <td>University of Northampton</td>
            <td>UK</td>
            <td>VALID</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.replace('/login')  
}
// Refs สำหรับ chart containers
const worldMap = ref(null)
const countryChart = ref(null)
const clusterChart = ref(null)
const yearChart = ref(null)

// โหลด Google Charts แค่ครั้งเดียว
onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://www.gstatic.com/charts/loader.js'
  script.onload = () => {
    google.charts.load('current', { packages: ['corechart', 'geochart'] })
    google.charts.setOnLoadCallback(drawAllCharts)
  }
  document.head.appendChild(script)
})

function drawAllCharts() {
  // World Map
  const worldData = google.visualization.arrayToDataTable([
    ['Country', 'MoU'],
    ['China', 33], ['Taiwan', 29], ['Japan', 18], ['South Korea', 14],
    ['Indonesia', 9], ['United States', 8], ['France', 6], ['Malaysia', 6],
    ['Austria', 3], ['Germany', 3], ['Thailand', 3]
  ])

  const worldOptions = { colorAxis: { colors: ['#ffcccc', '#990000'] }, legend: 'none' }
  const map = new google.visualization.GeoChart(worldMap.value)
  map.draw(worldData, worldOptions)

  // Country Bar Chart
  const countryData = google.visualization.arrayToDataTable([
    ['Country', 'MoU', { role: 'style' }],
    ['China', 33, '#b80000'], ['Taiwan', 29, '#b80000'], ['Japan', 18, '#b80000'],
    ['South Korea', 14, '#b80000'], ['Indonesia', 9, '#b80000'], ['United States', 8, '#b80000'],
    ['France', 6, '#b80000'], ['Malaysia', 6, '#b80000'], ['Austria', 3, '#b80000']
  ])

  const countryOptions = { legend: { position: 'none' } }
  const bar = new google.visualization.ColumnChart(countryChart.value)
  bar.draw(countryData, countryOptions)

  // Cluster Chart
  const clusterData = google.visualization.arrayToDataTable([
    ['Cluster', 'Total', { role: 'style' }],
    ['Health Science', 27, '#b80000'],
    ['Humanities & Social Sci', 35, '#b80000'],
    ['All', 47, '#b80000']
  ])

  const clusterOptions = { legend: 'none' }
  const cluster = new google.visualization.BarChart(clusterChart.value)
  cluster.draw(clusterData, clusterOptions)

  // Year Chart
  const yearData = google.visualization.arrayToDataTable([
    ['Year', 'MoU'],
    ['2025', 6], ['2024', 27], ['2023', 23], ['2022', 26],
    ['2021', 19], ['2020', 8], ['2019', 11]
  ])

  const yearOptions = { legend: 'none', colors: ['#b80000'] }
  const year = new google.visualization.BarChart(yearChart.value)
  year.draw(yearData, yearOptions)
}
</script>

<style scoped>
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
  margin-bottom: 30px;
}
.logo { 
  font-size: 26px; 
  font-weight: bold; 
  color: #B20000; 
}
.nav-links { 
  display: flex; 
  gap: 35px; 
  margin-left: auto; 
  margin-right: 30px; 
}
.nav-link { 
  color: #333; 
  text-decoration: none; 
  font-size: 16px; 
  font-weight: 500; 
  position: relative; 
  padding: 5px 0; 
}
.nav-link:hover { 
  color: #B20000; 
}
.nav-link.active { 
  color: #B20000; 
  font-weight: bold; 
}
.nav-link.active::after { 
  content: ''; 
  position: absolute; 
  bottom: -6px; 
  left: 0; 
  width: 100%; 
  height: 3px; 
  background: #B20000; 
  border-radius: 2px; 
}
.btn-logout { 
  background: #B20000; 
  color: white; 
  padding: 9px 24px; 
  border: none; 
  border-radius: 8px; 
  cursor: pointer; 
  font-weight: 600; 
}
.btn-logout:hover { 
  background: #900000; 
}

/* เนื้อหาเดิมของ Dashboard ยังอยู่เหมือนเดิม */
.dashboard {
  font-family: 'Segoe UI', sans-serif;
  background: #f9f9f9;
  color: #333;
 
}

.header {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin: 30px 0 40px;
  color: #B20000;
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.full-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin: 0 0 15px 0;
  color: #b80000;
}

.chart {
  width: 100%;
  height: 400px;
}

.chart-small {
  height: 250px;
}

.subgrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 20px;
}

.stat-box {
  background: #b80000;
  color: white;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}

.stat-box span {
  display: block;
  font-size: 28px;
  font-weight: bold;
  margin-top: 5px;
}

.network-list {
  padding-left: 20px;
}

.network-list li {
  margin: 10px 0;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.table-card th,
.table-card td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.table-card th {
  background: #b80000;
  color: white;
}

.table-card tr:nth-child(even) {
  background: #f8f8f8;
}

/* Responsive */
@media (max-width: 1024px) {

  .container,
  .full-grid {
    grid-template-columns: 1fr;
  }
}

</style>