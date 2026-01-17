#!/usr/bin/env node

const { execSync } = require('child_process');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message) {
  console.log(`${colors.green}[${new Date().toISOString()}] ${message}${colors.reset}`);
}

function executeCommand(command, description) {
  try {
    log(description);
    execSync(command, { stdio: 'inherit' });
  } catch (err) {
    console.log(`${colors.red}[ERROR] Failed to execute: ${command}${colors.reset}`);
    process.exit(1);
  }
}

async function checkHealth(url, serviceName) {
  try {
    const { default: fetch } = await import('node-fetch').catch(() => {
      // Fallback to using curl if node-fetch is not available
      execSync(`curl -s ${url}`, { stdio: 'devnull' });
      return null;
    });
    
    if (fetch) {
      const response = await fetch(url);
      if (response.ok) {
        log(`✓ ${serviceName} is responding`);
      } else {
        log(`⚠ ${serviceName} may not be ready yet`);
      }
    } else {
      log(`✓ ${serviceName} is responding`);
    }
  } catch (err) {
    log(`⚠ ${serviceName} may not be ready yet`);
  }
}

async function main() {
  console.log(`${colors.blue}======================================`);
  console.log('  🔄 Restarting All Services');
  console.log('======================================');
  console.log(colors.reset);

  executeCommand('docker-compose restart', 'Restarting containers...');

  log('Waiting for services to come online...');
  await new Promise(resolve => setTimeout(resolve, 20000));

  console.log(`\n${colors.yellow}Service Status:${colors.reset}`);
  executeCommand('docker-compose ps', 'Checking service status...');

  log('Performing health checks...');

  await checkHealth('http://localhost:3000', 'Frontend');
  await checkHealth('http://localhost:8000/api/health', 'Backend API');

  console.log(`\n${colors.green}🎉 Restart completed!${colors.reset}`);
  console.log(`${colors.blue}Frontend: http://localhost:3000${colors.reset}`);
  console.log(`${colors.blue}Backend API: http://localhost:8000/api${colors.reset}`);
}

main().catch(console.error);