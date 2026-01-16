<template>
  <div class="home">
    <div class="hero">
      <h1>Vue.js + Symfony 6 Full Stack Application</h1>
      <p class="subtitle">Complete development environment with Docker and Kubernetes</p>
      
      <div class="status-card">
        <h3>Backend API Status</h3>
        <div v-if="apiStatus.loading">Loading...</div>
        <div v-else-if="apiStatus.error" class="error">
          ❌ Error: {{ apiStatus.error }}
        </div>
        <div v-else class="success">
          ✅ Connected! Message: {{ apiStatus.data?.message }}
        </div>
      </div>

      <div class="features">
        <h3>Features</h3>
        <ul>
          <li>Vue.js 3 with Composition API</li>
          <li>TypeScript Support</li>
          <li>Symfony 6 Backend API</li>
          <li>Docker Containerization</li>
          <li>Kubernetes Orchestration</li>
          <li>One-Command Setup</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const apiStatus = ref({
  loading: true,
  data: null,
  error: null
});

onMounted(async () => {
  try {
    const response = await axios.get('/api/health');
    apiStatus.value = {
      loading: false,
      data: response.data,
      error: null
    };
  } catch (error) {
    apiStatus.value = {
      loading: false,
      data: null,
      error: error.message
    };
  }
});
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero h1 {
  font-size: 3rem;
  color: #42b883;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.status-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 2rem 0;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
}

.status-card h3 {
  margin-bottom: 1rem;
  color: #333;
}

.error {
  color: #dc3545;
  font-weight: bold;
}

.success {
  color: #28a745;
  font-weight: bold;
}

.features {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 2rem;
  margin-top: 2rem;
}

.features h3 {
  margin-bottom: 1rem;
  color: #333;
}

.features ul {
  list-style: none;
  text-align: left;
}

.features li {
  padding: 0.5rem 0;
  font-weight: 500;
}

.features li:before {
  content: "🚀 ";
  margin-right: 0.5rem;
}
</style>