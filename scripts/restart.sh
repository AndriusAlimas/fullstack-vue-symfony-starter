#!/bin/bash

# Restart Script - Restart all services

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

echo -e "${BLUE}"
echo "======================================"
echo "  🔄 Restarting All Services"
echo "======================================"
echo -e "${NC}"

log "Restarting containers..."

# Restart containers
docker-compose restart

# Wait for services to be ready
log "Waiting for services to come online..."
sleep 20

# Show status
echo -e "\n${YELLOW}Service Status:${NC}"
docker-compose ps

# Health check
log "Performing health checks..."

# Check frontend
if curl -s http://localhost:3000 > /dev/null; then
    log "✓ Frontend is responding"
else
    log "⚠ Frontend may not be ready yet"
fi

# Check backend
if curl -s http://localhost:8000/api/health > /dev/null; then
    log "✓ Backend API is responding"
else
    log "⚠ Backend API may not be ready yet"
fi

echo -e "\n${GREEN}🎉 Restart completed!${NC}"
echo -e "${BLUE}Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}Backend API: http://localhost:8000/api${NC}"