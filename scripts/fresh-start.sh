#!/bin/bash

# Fresh Start Script - Complete cleanup and setup
# This script performs a complete cleanup and fresh installation

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[WARN] $1${NC}"
}

echo -e "${BLUE}"
echo "================================================"
echo "  🚀 FRESH START - Complete Environment Reset"
echo "================================================"
echo -e "${NC}"

warn "This will completely remove all containers, images, volumes, and dependencies!"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

log "Starting fresh environment setup..."

# Stop and remove all containers
log "Stopping and removing containers..."
docker-compose down -v --remove-orphans 2>/dev/null || true

# Remove Docker images related to this project
log "Removing project Docker images..."
docker rmi $(docker images | grep "fullstack" | awk '{print $3}') 2>/dev/null || true
docker rmi $(docker images | grep "myprojects" | awk '{print $3}') 2>/dev/null || true

# Clean up Docker system
log "Cleaning up Docker system..."
docker system prune -f

# Remove node_modules
log "Removing frontend dependencies..."
rm -rf frontend/node_modules
rm -rf frontend/dist
rm -f frontend/package-lock.json

# Remove vendor directory
log "Removing backend dependencies..."
rm -rf backend/vendor
rm -f backend/composer.lock

# Remove any cache or temporary files
log "Cleaning up cache and temporary files..."
rm -rf backend/var/cache/*
rm -rf backend/var/log/*

log "✅ Cleanup complete! Starting fresh setup..."

# Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

echo -e "\n${GREEN}🎉 Fresh start completed successfully!${NC}"