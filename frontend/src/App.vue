<template>
  <div id="app">
    <header class="header">
      <nav class="nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
      </nav>
    </header>
    
    <main class="main">
      <router-view />
    </main>
    
    <footer class="footer">
      <p>&copy; 2026 Vue.js + Symfony 6 Full Stack Application</p>
    </footer>
  </div>
</template>

<script setup>
// App setup
</script>

<style scoped>
.header {
  background-color: #42b883;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav {
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-link.router-link-active {
  text-decoration: underline;
}

.main {
  min-height: calc(100vh - 120px);
  padding: 2rem;
}

.footer {
  background-color: #f8f9fa;
  text-align: center;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}
</style>