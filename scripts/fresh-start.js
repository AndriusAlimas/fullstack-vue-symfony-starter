#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

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
    // Ignore errors for cleanup commands
    if (
      !description.includes("Removing") &&
      !description.includes("Cleaning")
    ) {
      error(`Failed to execute: ${command}`);
    }
  }
}

function tryExecuteCommand(command, description) {
  try {
    log(description);
    execSync(command, { stdio: "inherit" });
    return true;
  } catch (err) {
    return false;
  }
}

function removeIfExists(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
      log(`✓ ${description}`);
    } else {
      log(`✓ ${description} (already clean)`);
    }
  } catch (err) {
    log(`✓ ${description} (already clean)`);
  }
}

async function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y");
    });
  });
}

async function main() {
  console.log(`${colors.blue}================================================`);
  console.log("  🚀 FRESH START - Complete Environment Reset");
  console.log("================================================");
  console.log(colors.reset);

  warn(
    "This will completely remove all containers, images, volumes, and dependencies!"
  );

  const confirmed = await askConfirmation(
    "Are you sure you want to continue? (y/N): "
  );

  if (!confirmed) {
    console.log("Aborted.");
    return;
  }

  log("Starting fresh environment setup...");

  // Stop and remove all containers
  executeCommand(
    "docker-compose down -v --remove-orphans",
    "Stopping and removing containers..."
  );

  // Clean up Docker system
  executeCommand("docker system prune -f", "Cleaning up Docker system...");

  // Remove frontend dependencies
  log("Removing frontend dependencies...");
  removeIfExists(
    path.join("frontend", "node_modules"),
    "Removed frontend/node_modules"
  );
  removeIfExists(path.join("frontend", "dist"), "Removed frontend/dist");
  removeIfExists(
    path.join("frontend", "package-lock.json"),
    "Removed frontend/package-lock.json"
  );

  // Remove backend dependencies
  log("Removing backend dependencies...");
  removeIfExists(path.join("backend", "vendor"), "Removed backend/vendor");
  removeIfExists(
    path.join("backend", "composer.lock"),
    "Removed backend/composer.lock"
  );

  // Remove cache and logs
  log("Cleaning up cache and temporary files...");
  removeIfExists(path.join("backend", "var", "cache"), "Cleared backend cache");
  removeIfExists(path.join("backend", "var", "log"), "Cleared backend logs");

  // Set up backend environment
  log("Setting up backend environment...");
  const backendEnvPath = path.join("backend", ".env");
  const backendEnvExamplePath = path.join("backend", ".env.example");
  
  if (!fs.existsSync(backendEnvPath) && fs.existsSync(backendEnvExamplePath)) {
    try {
      fs.copyFileSync(backendEnvExamplePath, backendEnvPath);
      log("Created backend/.env from .env.example");
    } catch (err) {
      warn("Could not create backend/.env file automatically");
    }
  }

  log("✅ Cleanup complete! Starting fresh setup...");

  // Install frontend dependencies
  log("Installing frontend dependencies...");
  try {
    process.chdir("frontend");
    executeCommand("npm install", "Installing frontend packages...");
    process.chdir("..");
  } catch (err) {
    process.chdir("..");
    error("Frontend setup failed. Please check the logs.");
  }

  // Install backend dependencies
  log("Installing backend dependencies...");
  const backendPath = path.resolve("backend").replace(/\\/g, "/");
  const success = tryExecuteCommand(
    `docker run --rm -v "${backendPath}":/app -w /app composer:2 install --optimize-autoloader`,
    "Installing backend packages via Docker..."
  );

  if (!success) {
    warn(
      "Backend dependency installation failed, will be installed during container build..."
    );
  }

  // Build and start containers
  log("Building and starting containers...");
  executeCommand("docker-compose build --no-cache", "Building containers...");
  executeCommand("docker-compose up -d", "Starting containers...");

  // Wait for services to be ready
  log("Waiting for services to be ready...");
  await new Promise((resolve) => setTimeout(resolve, 10000));

  // Check if services are running
  try {
    executeCommand("docker-compose ps", "Checking service status...");
    console.log(
      `\n${colors.green}🎉 Fresh start completed successfully!${colors.reset}`
    );
    console.log(`${colors.blue}Frontend: http://localhost:3000 and http://localhost:3001${colors.reset}`);
    console.log(
      `${colors.blue}Backend API: http://localhost:8000/api${colors.reset}`
    );
    console.log(
      `${colors.blue}Health Check: http://localhost:8000/api/health${colors.reset}`
    );
    console.log(
      `${colors.blue}Database: MySQL on localhost:3307 (external access)${colors.reset}`
    );
    console.log(`${colors.blue}Redis: localhost:6379${colors.reset}`);
  } catch (err) {
    warn(
      "Some services may not have started properly. Check with: docker-compose ps"
    );
  }
}

main().catch(console.error);
