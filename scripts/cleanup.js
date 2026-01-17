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

function executeCommand(command, description) {
  try {
    log(description);
    execSync(command, { stdio: "inherit" });
  } catch (err) {
    // Continue on error for cleanup commands
    console.log(
      `${colors.yellow}Warning: ${description} may have failed${colors.reset}`
    );
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
  console.log(`${colors.blue}======================================`);
  console.log("  🧹 Cleanup - Stop and Remove");
  console.log("======================================");
  console.log(colors.reset);

  warn("This will stop and remove all containers and volumes!");

  const confirmed = await askConfirmation("Continue? (y/N): ");

  if (!confirmed) {
    console.log("Aborted.");
    return;
  }

  executeCommand("docker-compose down", "Stopping services...");
  executeCommand(
    "docker-compose down -v --remove-orphans",
    "Removing containers and volumes..."
  );
  executeCommand(
    "docker system prune -f",
    "Cleaning up unused Docker resources..."
  );

  // Remove logs
  log("Cleaning up logs...");
  try {
    const logPath = path.join("backend", "var", "log");
    if (fs.existsSync(logPath)) {
      const files = fs.readdirSync(logPath);
      files.forEach((file) => {
        const filePath = path.join(logPath, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
    }
  } catch (err) {
    // Continue if log cleanup fails
  }

  console.log(`\n${colors.green}✅ Cleanup completed!${colors.reset}`);
}

main().catch(console.error);
