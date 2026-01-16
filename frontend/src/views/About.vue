<template>
  <div class="about">
    <div class="container">
      <h1>About This Project</h1>
      
      <div class="section">
        <h2>🏗️ Architecture</h2>
        <p>This is a modern full-stack web application built with industry-standard technologies:</p>
        
        <div class="tech-stack">
          <div class="tech-item">
            <h3>Frontend</h3>
            <ul>
              <li>Vue.js 3 with Composition API</li>
              <li>TypeScript for type safety</li>
              <li>Vite for fast development</li>
              <li>Vue Router for navigation</li>
              <li>Pinia for state management</li>
            </ul>
          </div>
          
          <div class="tech-item">
            <h3>Backend</h3>
            <ul>
              <li>Symfony 6 PHP Framework</li>
              <li>RESTful API endpoints</li>
              <li>Doctrine ORM</li>
              <li>MySQL/PostgreSQL database</li>
              <li>JWT Authentication</li>
            </ul>
          </div>
          
          <div class="tech-item">
            <h3>DevOps</h3>
            <ul>
              <li>Docker containerization</li>
              <li>Kubernetes orchestration</li>
              <li>Automated deployment</li>
              <li>Health checks & monitoring</li>
              <li>One-command setup</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>🚀 Quick Start</h2>
        <div class="code-block">
          <pre><code># Clone the repository
git clone &lt;your-repo-url&gt;
cd &lt;project-directory&gt;

# Fresh start (builds everything)
npm run fresh-start

# Development mode
npm run dev

# Production deployment
npm run deploy</code></pre>
        </div>
      </div>

      <div class="section">
        <h2>📋 Available Commands</h2>
        <div class="commands">
          <div class="command">
            <code>npm run fresh-start</code>
            <p>Clean slate setup - removes containers and recreates everything</p>
          </div>
          <div class="command">
            <code>npm run dev</code>
            <p>Start development environment</p>
          </div>
          <div class="command">
            <code>npm run restart</code>
            <p>Restart all services</p>
          </div>
          <div class="command">
            <code>npm run cleanup</code>
            <p>Stop and remove all containers and volumes</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic here
</script>

<style scoped>
.about {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.container h1 {
  text-align: center;
  color: #42b883;
  margin-bottom: 2rem;
  font-size: 2.5rem;
}

.section {
  margin-bottom: 3rem;
}

.section h2 {
  color: #333;
  margin-bottom: 1rem;
  border-bottom: 2px solid #42b883;
  padding-bottom: 0.5rem;
}

.tech-stack {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.tech-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
}

.tech-item h3 {
  color: #42b883;
  margin-bottom: 1rem;
}

.tech-item ul {
  list-style: none;
}

.tech-item li {
  padding: 0.3rem 0;
  position: relative;
  padding-left: 1.5rem;
}

.tech-item li:before {
  content: "▶";
  position: absolute;
  left: 0;
  color: #42b883;
  font-size: 0.8rem;
}

.code-block {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  margin-top: 1rem;
}

.code-block pre {
  margin: 0;
  white-space: pre-wrap;
}

.code-block code {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.9rem;
  color: #333;
}

.commands {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.command {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
}

.command code {
  background: #42b883;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.command p {
  color: #666;
  margin: 0;
}
</style>