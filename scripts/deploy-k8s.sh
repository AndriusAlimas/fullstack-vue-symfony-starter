#!/bin/bash

# Kubernetes Deployment Script

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Check if kubectl is installed
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        error "kubectl is not installed. Please install kubectl first."
    fi
    log "✓ kubectl is available"
}

# Check cluster connectivity
check_cluster() {
    if ! kubectl cluster-info &> /dev/null; then
        error "Cannot connect to Kubernetes cluster. Please check your cluster configuration."
    fi
    log "✓ Connected to Kubernetes cluster"
}

# Build and push Docker images
build_and_push_images() {
    local registry=${1:-"your-registry"}
    
    log "Building Docker images..."
    
    # Build frontend image
    docker build -f docker/Dockerfile.frontend -t ${registry}/fullstack-frontend:latest .
    
    # Build backend image
    docker build -f docker/Dockerfile.backend -t ${registry}/fullstack-backend:latest .
    
    log "Pushing images to registry..."
    docker push ${registry}/fullstack-frontend:latest
    docker push ${registry}/fullstack-backend:latest
    
    log "✓ Images built and pushed successfully"
}

# Deploy to Kubernetes
deploy_to_k8s() {
    log "Deploying to Kubernetes..."
    
    # Apply manifests in order
    kubectl apply -f k8s/namespace.yaml
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/mysql.yaml
    
    # Wait for MySQL to be ready
    log "Waiting for MySQL to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment/mysql-deployment -n fullstack-app
    
    # Deploy backend
    kubectl apply -f k8s/backend.yaml
    kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment -n fullstack-app
    
    # Deploy frontend
    kubectl apply -f k8s/frontend.yaml
    kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment -n fullstack-app
    
    # Apply ingress and HPA
    kubectl apply -f k8s/ingress.yaml
    kubectl apply -f k8s/hpa.yaml
    
    log "✓ Deployment completed successfully"
}

# Show deployment status
show_status() {
    echo -e "\n${BLUE}Deployment Status:${NC}"
    kubectl get all -n fullstack-app
    
    echo -e "\n${BLUE}Ingress Information:${NC}"
    kubectl get ingress -n fullstack-app
}

# Main function
main() {
    local registry=${1:-"your-registry"}
    
    echo -e "${BLUE}"
    echo "=============================================="
    echo "  🚀 Kubernetes Deployment"
    echo "=============================================="
    echo -e "${NC}"
    
    if [ "$registry" = "your-registry" ]; then
        warn "Using default registry name 'your-registry'"
        warn "Please update the registry name in the script or pass it as an argument"
        warn "Usage: ./deploy-k8s.sh your-actual-registry"
        echo
    fi
    
    check_kubectl
    check_cluster
    build_and_push_images "$registry"
    deploy_to_k8s
    show_status
    
    echo -e "\n${GREEN}🎉 Kubernetes deployment completed!${NC}"
    echo -e "Please update your DNS to point to the ingress IP address"
}

main "$@"