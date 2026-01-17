#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Colors for console output
const colors = {
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  reset: "\x1b[0m",
};

function log(message) {
  console.log(
    `${colors.green}[${new Date().toISOString()}] ${message}${colors.reset}`
  );
}

function warn(message) {
  console.log(`${colors.yellow}[WARN] ${message}${colors.reset}`);
}

function error(message) {
  console.log(`${colors.red}[ERROR] ${message}${colors.reset}`);
  process.exit(1);
}

function executeCommand(command, description) {
  try {
    log(description);
    execSync(command, { stdio: "inherit" });
  } catch (err) {
    error(`Failed to execute: ${command}`);
  }
}

function checkDocker() {
  try {
    execSync("docker info", { stdio: "devnull" });
    log("✓ Docker is installed and running");
  } catch (err) {
    error("Docker is not running. Please start Docker first.");
  }
}

function checkDockerCompose() {
  try {
    execSync("docker-compose version", { stdio: "devnull" });
    log("✓ Docker Compose is available");
  } catch (err) {
    try {
      execSync("docker compose version", { stdio: "devnull" });
      log("✓ Docker Compose is available");
    } catch (err2) {
      error(
        "Docker Compose is not installed. Please install Docker Compose first."
      );
    }
  }
}

function setupFrontend() {
  log("Setting up Vue.js frontend...");

  if (!fs.existsSync("frontend/node_modules")) {
    log("Installing frontend dependencies...");
    process.chdir("frontend");
    executeCommand("npm install", "Installing frontend packages...");
    process.chdir("..");
  } else {
    log("Frontend dependencies already installed");
  }

  log("✓ Frontend setup complete");
}

function setupBackend() {
  log("Setting up Symfony backend...");

  if (!fs.existsSync("backend/vendor")) {
    log("Installing backend dependencies via Docker...");
    const backendPath = path.resolve("backend").replace(/\\/g, "/");
    try {
      executeCommand(
        `docker run --rm -v "${backendPath}":/app -w /app composer:2 install --no-dev --optimize-autoloader`,
        "Installing backend packages via Docker..."
      );
    } catch (err) {
      warn(
        "Backend dependency installation failed, will be installed during container build..."
      );
    }
  } else {
    log("Backend dependencies already installed");
  }

  log("✓ Backend setup complete");
}

function startContainers() {
  log("Building and starting containers...");

  executeCommand("docker-compose build --no-cache", "Building images...");
  executeCommand("docker-compose up -d", "Starting services...");

  log("Waiting for services to be ready...");
  setTimeout(() => {
    try {
      executeCommand("docker-compose ps", "Checking service status...");

      console.log(`\n${colors.green}✓ All services are running${colors.reset}`);
      console.log(`\n${colors.green}🎉 Setup complete!${colors.reset}`);
      console.log(
        `${colors.blue}Frontend: http://localhost:3000${colors.reset}`
      );
      console.log(
        `${colors.blue}Backend API: http://localhost:8000/api${colors.reset}`
      );
      console.log(
        `${colors.blue}Health Check: http://localhost:8000/api/health${colors.reset}`
      );
    } catch (err) {
      error(
        "Some services failed to start. Check logs with: docker-compose logs"
      );
    }
  }, 30000);
}

function main() {
  console.log(`${colors.blue}================================================`);
  console.log("  Full Stack Development Environment Setup");
  console.log("  Vue.js + Symfony 6 + Docker + Kubernetes");
  console.log("================================================");
  console.log(colors.reset);

  checkDocker();
  checkDockerCompose();
  setupFrontend();
  setupBackend();
  startContainers();

  console.log(`\n${colors.green}Setup completed successfully!${colors.reset}`);
  console.log("Use the following commands to manage your environment:");
  console.log(
    `  ${colors.yellow}npm run restart${colors.reset}     - Restart all services`
  );
  console.log(
    `  ${colors.yellow}npm run cleanup${colors.reset}     - Stop and remove containers`
  );
  console.log(
    `  ${colors.yellow}npm run fresh-start${colors.reset} - Clean slate setup`
  );
  console.log(
    `  ${colors.yellow}docker-compose logs${colors.reset} - View logs`
  );
}

main();
