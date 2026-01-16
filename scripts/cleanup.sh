#!/bin/bash

# Cleanup Script - Stop and remove all containers and volumes

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
echo "======================================"
echo "  🧹 Cleanup - Stop and Remove"
echo "======================================"
echo -e "${NC}"

warn "This will stop and remove all containers and volumes!"
read -p "Continue? (y/N): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

log "Stopping services..."
docker-compose down

log "Removing containers and volumes..."
docker-compose down -v --remove-orphans

log "Cleaning up unused Docker resources..."
docker system prune -f

# Remove logs
log "Cleaning up logs..."
rm -rf backend/var/log/*

echo -e "\n${GREEN}✅ Cleanup completed!${NC}"
echo "To start the environment again, run: npm run setup"