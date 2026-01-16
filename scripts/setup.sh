#!/bin/bash

# Full Stack Development Environment - Setup Script
# This script sets up the complete Vue.js + Symfony 6 + Docker + K8s environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
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

# Check if Docker is installed and running
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker is not running. Please start Docker first."
    fi
    
    log "✓ Docker is installed and running"
}

# Check if Docker Compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    log "✓ Docker Compose is available"
}

# Install frontend dependencies
setup_frontend() {
    log "Setting up Vue.js frontend..."
    
    if [ ! -d "frontend/node_modules" ]; then
        log "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
    else
        log "Frontend dependencies already installed"
    fi
    
    log "✓ Frontend setup complete"
}

# Install backend dependencies
setup_backend() {
    log "Setting up Symfony backend..."
    
    if [ ! -d "backend/vendor" ]; then
        log "Installing backend dependencies via Docker..."
        docker run --rm -v "$(pwd)/backend":/app -w /app composer:2 install --no-dev --optimize-autoloader
    else
        log "Backend dependencies already installed"
    fi
    
    log "✓ Backend setup complete"
}

# Build and start containers
start_containers() {
    log "Building and starting containers..."
    
    # Build images
    docker-compose build --no-cache
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 30
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        log "✓ All services are running"
        
        # Show running services
        echo -e "\n${BLUE}Running services:${NC}"
        docker-compose ps
        
        echo -e "\n${GREEN}🎉 Setup complete!${NC}"
        echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
        echo -e "${BLUE}Backend API: http://localhost:8000/api${NC}"
        echo -e "${BLUE}Health Check: http://localhost:8000/api/health${NC}"
        
    else
        error "Some services failed to start. Check logs with: docker-compose logs"
    fi
}

# Main setup function
main() {
    echo -e "${BLUE}"
    echo "================================================"
    echo "  Full Stack Development Environment Setup"
    echo "  Vue.js + Symfony 6 + Docker + Kubernetes"
    echo "================================================"
    echo -e "${NC}"
    
    check_docker
    check_docker_compose
    setup_frontend
    setup_backend
    start_containers
    
    echo -e "\n${GREEN}Setup completed successfully!${NC}"
    echo -e "Use the following commands to manage your environment:"
    echo -e "  ${YELLOW}npm run restart${NC}     - Restart all services"
    echo -e "  ${YELLOW}npm run cleanup${NC}     - Stop and remove containers"
    echo -e "  ${YELLOW}npm run fresh-start${NC} - Clean slate setup"
    echo -e "  ${YELLOW}docker-compose logs${NC} - View logs"
}

# Run main function
main "$@"