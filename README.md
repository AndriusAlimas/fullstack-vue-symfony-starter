# 🚀 Fullstack Vue Symfony Starter

A complete, production-ready development environment featuring **Vue.js 3**, **Symfony 6**, **Docker**, and **Kubernetes** with one-command setup and automated deployment.

Perfect starter template for modern full-stack applications with enterprise-grade infrastructure.

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vue.js)](https://vuejs.org/)
[![Symfony](https://img.shields.io/badge/Symfony-6.x-000000?style=flat&logo=symfony)](https://symfony.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?style=flat&logo=kubernetes)](https://kubernetes.io/)

## ✨ Features

- **🎯 One-Command Setup**: Get everything running with a single command
- **🏗️ Modern Stack**: Vue.js 3 + Vue CLI + Symfony 6 + PHP 8.3
- **🐳 Docker Ready**: Complete containerization with nginx + PHP-FPM
- **☸️ Kubernetes Native**: Production-ready K8s manifests with auto-scaling
- **🔄 Hot Reload**: Live development with instant updates
- **📊 Health Monitoring**: Built-in health checks and status endpoints
- **🚀 CI/CD Ready**: Automated deployment scripts

## 🏗️ Project Structure

```
├── 📁 frontend/              # Vue.js 3 + Vue CLI
│   ├── src/
│   │   ├── components/
│   │   ├── views/
│   │   ├── router/
│   │   └── main.js
│   ├── package.json
│   └── vite.config.js
├── 📁 backend/               # Symfony 6 API
│   ├── src/
│   │   ├── Controller/
│   │   ├── Entity/
│   │   └── Kernel.php
│   ├── config/
│   └── composer.json
├── 📁 docker/                # Docker configuration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   ├── nginx.conf
│   └── nginx-backend.conf
├── 📁 k8s/                   # Kubernetes manifests
│   ├── namespace.yaml
│   ├── backend.yaml
│   ├── frontend.yaml
│   └── ingress.yaml
├── 📁 scripts/               # Automation scripts
│   ├── setup.js
│   ├── fresh-start.js
│   ├── restart.js
│   └── cleanup.js
└── docker-compose.yml        # Development environment
```

## ⚡ Quick Start

### Prerequisites

- **Docker** & **Docker Compose**
- **Node.js** 18+ (for local development)
- **Git**

### 🚀 One-Command Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-vue-symfony-starter

# Fresh start - builds everything from scratch
npm run fresh-start
```

That's it! 🎉 Your complete development environment is ready!

### 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/api/health
- **Status Check**: http://localhost:8000/api/status
- **Database**: localhost:3306 (user: app, password: secret)
- **Redis**: localhost:6379

## 📋 Available Commands

### Development Commands

```bash
npm run dev         # Same as setup - start development environment
npm run setup       # Initial setup (install dependencies & start)
npm run restart     # Restart all services
npm run fresh-start # Complete clean slate setup (recommended)
npm run cleanup     # Stop and remove all containers
```

### Docker Commands

```bash
npm run build       # Build Docker images
npm run up          # Start containers
npm run down        # Stop containers
npm run logs        # View logs from all services
```

### Component-Specific Commands

```bash
# Frontend
npm run frontend:dev    # Run frontend in development mode
npm run frontend:build  # Build frontend for production

# Backend
npm run backend:install    # Install PHP dependencies
npm run backend:migrate    # Run database migrations
npm run backend:cache-clear # Clear Symfony cache
```

### Deployment Commands

```bash
npm run deploy      # Deploy to Kubernetes cluster
```

## 🐳 Docker Development

The development environment uses Docker Compose with the following services:

- **Frontend**: Vue.js 3 app served via nginx (production-like setup)
- **Backend**: Symfony 6 with PHP 8.3-FPM and nginx
- **Database**: MySQL 8.0 with persistent storage
- **Redis**: Caching layer for sessions and data

### Architecture

- **Production-Ready Setup**: Uses nginx + PHP-FPM for better performance
- **Health Monitoring**: Built-in health checks at `/api/health` and `/api/status`
- **Optimized Builds**: Multi-stage Docker builds for smaller images

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (local or cloud)
- `kubectl` configured
- Docker registry access

### Deploy to Kubernetes

```bash
# Update registry in script
./scripts/deploy-k8s.sh your-registry

# Or manually:
kubectl apply -f k8s/
```

### Kubernetes Features

- **Auto-scaling**: HPA based on CPU/Memory
- **Health Checks**: Liveness and readiness probes
- **Load Balancing**: Multiple replicas with service discovery
- **Ingress**: SSL termination and domain routing
- **Persistent Storage**: MySQL data persistence

## 🔧 Configuration

### Environment Variables

#### Backend (.env)

```env
APP_ENV=dev
DATABASE_URL=mysql://app:secret@database:3306/app_db
CORS_ALLOW_ORIGIN=^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$
```

#### Frontend (vite.config.js)

```javascript
server: {
  host: '0.0.0.0',
  port: 8080,
  proxy: {
    '/api': 'http://backend:8000'
  }
}
```

### Docker Compose Override

Create `docker-compose.override.yml` for local customizations:

```yaml
version: "3.8"
services:
  backend:
    environment:
      - APP_DEBUG=1
    volumes:
      - ./backend:/var/www/html
```

## 🛠️ Development Guide

### Adding New API Endpoints

1. Create controller in `backend/src/Controller/`
2. Add routes with attributes
3. Update frontend services to consume API

### Adding New Vue Components

1. Create component in `frontend/src/components/`
2. Add to router if needed
3. Import and use in views

### Database Changes

```bash
# Create migration
docker-compose exec backend php bin/console make:migration

# Run migration
npm run backend:migrate
```

## 🔍 Troubleshooting

### Common Issues

**Containers not starting?**

```bash
# Check logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Restart with fresh build
npm run fresh-start

# Check running containers
docker-compose ps
```

**Port conflicts?**

```bash
# Check what's using the port (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Or on Linux/Mac
lsof -i :3000
lsof -i :8000
```

**Backend API returning 404?**

```bash
# Check if routes are registered correctly
docker-compose exec backend php bin/console debug:router

# Verify backend is healthy
curl http://localhost:8000/api/health
```

**Database connection issues?**

```bash
# Reset database
docker-compose down -v
npm run fresh-start
```

### Health Checks

```bash
# Check backend API health
curl http://localhost:8000/api/health

# Check backend API status
curl http://localhost:8000/api/status

# Check frontend application
curl http://localhost:3000

# Check container status
docker-compose ps
```

## 📊 Monitoring & Logging

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Performance Monitoring

- Backend API metrics at `/api/status`
- Frontend performance tools in browser dev tools
- Docker stats: `docker stats`

## 🚀 Production Deployment

### Docker Registry Setup

1. Build images: `docker-compose build`
2. Tag images: `docker tag fullstack_frontend your-registry/frontend:latest`
3. Push images: `docker push your-registry/frontend:latest`

### Kubernetes Production

1. Update image references in K8s manifests
2. Configure ingress with your domain
3. Set up SSL certificates
4. Configure monitoring and alerting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/fullstack-vue-symfony/issues)
- **Documentation**: This README and code comments
- **Community**: [Discussions](https://github.com/yourusername/fullstack-vue-symfony/discussions)

---

### 📝 Notes

- The setup uses **production-like configuration** with nginx + PHP-FPM for better performance
- Backend runs on **PHP 8.3** with **Symfony 6.4**
- Frontend uses **Vue.js 3** with **Vue CLI** (not Vite)
- All containers are optimized with multi-stage builds
- **Database migrations** are handled manually for flexibility
- Replace `your-registry` with your actual Docker registry
- Update domain names in Kubernetes ingress
- Customize configurations for your specific needs
- Review security settings before production deployment

**Happy coding! 🎉**
