#!/usr/bin/env node

const { execSync } = require("child_process");

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

function checkKubectl() {
  try {
    execSync("kubectl version --client", { stdio: "devnull" });
    log("✓ kubectl is installed");
  } catch (err) {
    error("kubectl is not installed. Please install kubectl first.");
  }
}

function checkCluster() {
  try {
    execSync("kubectl cluster-info", { stdio: "devnull" });
    log("✓ Connected to Kubernetes cluster");
  } catch (err) {
    error(
      "Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    );
  }
}

function buildAndPushImages(registry) {
  log("Building and pushing Docker images...");

  // Build images
  executeCommand("docker-compose build", "Building Docker images...");

  // Tag and push images
  const images = ["frontend", "backend"];
  images.forEach((service) => {
    const localImage = `fullstack-vue-symfony-starter-${service}`;
    const registryImage = `${registry}/fullstack-${service}:latest`;

    executeCommand(
      `docker tag ${localImage} ${registryImage}`,
      `Tagging ${service} image...`
    );
    executeCommand(
      `docker push ${registryImage}`,
      `Pushing ${service} image to registry...`
    );
  });

  log("✓ All images built and pushed successfully");
}

function deployToK8s() {
  log("Deploying to Kubernetes...");

  // Apply Kubernetes manifests in order
  const manifests = [
    "namespace.yaml",
    "configmap.yaml",
    "mysql.yaml",
    "backend.yaml",
    "frontend.yaml",
    "ingress.yaml",
    "hpa.yaml",
  ];

  manifests.forEach((manifest) => {
    executeCommand(
      `kubectl apply -f k8s/${manifest}`,
      `Applying ${manifest}...`
    );
  });

  // Wait for deployments
  executeCommand(
    "kubectl wait --for=condition=available --timeout=300s deployment/mysql-deployment -n fullstack-app",
    "Waiting for MySQL deployment..."
  );
  executeCommand(
    "kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment -n fullstack-app",
    "Waiting for backend deployment..."
  );
  executeCommand(
    "kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment -n fullstack-app",
    "Waiting for frontend deployment..."
  );

  log("✓ Deployment completed successfully");
}

function showStatus() {
  console.log(`\n${colors.blue}Deployment Status:${colors.reset}`);
  executeCommand(
    "kubectl get all -n fullstack-app",
    "Getting deployment status..."
  );

  console.log(`\n${colors.blue}Ingress Information:${colors.reset}`);
  executeCommand(
    "kubectl get ingress -n fullstack-app",
    "Getting ingress information..."
  );
}

function main() {
  const registry = process.argv[2] || "your-registry";

  console.log(`${colors.blue}==============================================`);
  console.log("  🚀 Kubernetes Deployment");
  console.log("==============================================");
  console.log(colors.reset);

  if (registry === "your-registry") {
    warn('Using default registry name "your-registry"');
    warn(
      "Please update the registry name in the script or pass it as an argument"
    );
    warn("Usage: npm run deploy your-actual-registry");
    console.log();
  }

  checkKubectl();
  checkCluster();
  buildAndPushImages(registry);
  deployToK8s();
  showStatus();

  console.log(
    `\n${colors.green}🎉 Kubernetes deployment completed!${colors.reset}`
  );
  console.log("Please update your DNS to point to the ingress IP address");
}

main();
