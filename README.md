# 🚀 Fullstack Vue Symfony Starter

A complete, production-ready development environment featuring **Vue.js 3**, **Symfony 6**, **Docker**, and **Kubernetes** with one-command setup and automated deployment.

Perfect starter template for modern full-stack applications with enterprise-grade infrastructure.

[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?style=flat&logo=vue.js)](https://vuejs.org/)
[![Symfony](https://img.shields.io/badge/Symfony-6.x-000000?style=flat&logo=symfony)](https://symfony.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker)](https://docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5?style=flat&logo=kubernetes)](https://kubernetes.io/)

## ✨ Features

- **🎯 One-Command Setup**: Get everything running with a single command
- **🏗️ Modern Stack**: Vue.js 3 + JavaScript + Vite + Symfony 6 + PHP 8.2
- **🐳 Docker Ready**: Complete containerization for development and production
- **☸️ Kubernetes Native**: Production-ready K8s manifests with auto-scaling
- **🔄 Hot Reload**: Live development with instant updates
- **📊 Health Monitoring**: Built-in health checks and status endpoints
- **🚀 CI/CD Ready**: Automated deployment scripts

## 🏗️ Project Structure

```
├── 📁 frontend/              # Vue.js 3 + JavaScript + Vite
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
│   └── nginx.conf
├── 📁 k8s/                   # Kubernetes manifests
│   ├── namespace.yaml
│   ├── backend.yaml
│   ├── frontend.yaml
│   └── ingress.yaml
├── 📁 scripts/               # Automation scripts
│   ├── setup.sh
│   ├── fresh-start.sh
│   ├── restart.sh
│   └── cleanup.sh
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
cd <project-directory>

# Fresh start - builds everything from scratch
npm run fresh-start
```

That's it! 🎉 Your complete development environment is ready!

### 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Health Check**: http://localhost:8000/api/health
- **Database**: localhost:3306 (user: app, password: secret)

## 📋 Available Commands

### Development Commands

```bash
npm run dev         # Start development environment
npm run setup       # Initial setup (install dependencies & start)
npm run restart     # Restart all services
npm run fresh-start # Complete clean slate setup
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

- **Frontend**: Vue.js app with Vite dev server
- **Backend**: Symfony 6 with PHP-FPM and Nginx
- **Database**: MySQL 8.0 with persistent storage
- **Redis**: Caching layer (optional)

### Development vs Production

- **Development**: Hot reload, source maps, debug mode
- **Production**: Optimized builds, multi-stage containers, health checks

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

#### Frontend (vite.config.ts)

```typescript
server: {
  host: '0.0.0.0',
  port: 3000,
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
# Check logs
docker-compose logs

# Restart with fresh build
npm run fresh-start
```

**Port conflicts?**

```bash
# Check what's using the port
netstat -an | grep :3000
lsof -i :3000

# Stop conflicting services
```

**Database connection issues?**

```bash
# Reset database
docker-compose down -v
npm run fresh-start
```

### Health Checks

```bash
# Check all services
curl http://localhost:8000/api/health
curl http://localhost:8000/api/status
curl http://localhost:3000
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

- Replace `your-registry` with your actual Docker registry
- Update domain names in Kubernetes ingress
- Customize configurations for your specific needs
- Review security settings before production deployment

**Happy coding! 🎉**
