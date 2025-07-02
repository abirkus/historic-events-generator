# Historic Events Generator

A full-stack application with FastAPI backend and Vite React frontend for generating and managing historic events.

## 🚀 Quick Start

```bash
# Clone and navigate to project
git clone <your-repo-url>
cd historic-events-generator

# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# API Docs: http://localhost:8080/docs
```

## 🏗️ Project Structure

```
historic-events-generator/
├── frontend/                 # Vite React application
│   ├── src/
│   ├── package.json
│   ├── Dockerfile           # Production build
│   ├── Dockerfile.dev       # Development build
│   └── nginx.conf           # Nginx configuration
├── backend/                 # FastAPI application
│   ├── app/
│   ├── pyproject.toml
│   └── Dockerfile           # Backend container
├── docker-compose.yml       # Production configuration
├── docker-compose.dev.yml   # Development configuration
├── .env.production         # Production environment variables
├── .env.development        # Development environment variables
└── README.md               
```

## ⚡ Development Commands

### Core Docker Compose Commands

```bash
# Development workflow
docker-compose -f docker-compose.dev.yml up -d         # Start development environment
docker-compose -f docker-compose.dev.yml logs -f       # View all logs (follow)
docker-compose -f docker-compose.dev.yml down          # Stop all services
docker-compose -f docker-compose.dev.yml restart       # Restart all services

# Production workflow
docker-compose up -d                                    # Start production environment
docker-compose logs -f                                  # View all logs (follow)
docker-compose down                                     # Stop all services

# Build and start
docker-compose -f docker-compose.dev.yml up --build -d # Rebuild and start dev
docker-compose up --build -d                          # Rebuild and start prod
```

### Service-Specific Commands

```bash
# Individual service logs
docker-compose -f docker-compose.dev.yml logs -f backend    # Backend logs only
docker-compose -f docker-compose.dev.yml logs -f frontend   # Frontend logs only

# Start individual services
docker-compose -f docker-compose.dev.yml up backend -d      # Start only backend
docker-compose -f docker-compose.dev.yml up frontend -d     # Start only frontend

# Rebuild individual services
docker-compose -f docker-compose.dev.yml build backend      # Rebuild backend only
docker-compose -f docker-compose.dev.yml build frontend     # Rebuild frontend only
```

### Container Access

```bash
# Get shell access to containers
docker exec -it chronicles-backend-dev /bin/bash       # Access backend container
docker exec -it chronicles-frontend-dev /bin/sh        # Access frontend container

# Alternative: using docker-compose exec
docker-compose -f docker-compose.dev.yml exec backend /bin/bash
docker-compose -f docker-compose.dev.yml exec frontend /bin/sh
```

### Status and Monitoring

```bash
# Check running services
docker-compose -f docker-compose.dev.yml ps            # Development services
docker-compose ps                                      # Production services

# View container status
docker ps                                              # All running containers
docker stats                                           # Resource usage

# View recent logs (without following)
docker-compose -f docker-compose.dev.yml logs --tail=50 backend
```

## 🔧 Environment Setup

### First Time Setup

1. **Create environment files**:

```bash
# Development environment
cat > .env.development << EOF
COMPOSE_PROJECT_NAME=chronicles-dev
ENVIRONMENT=development
VITE_SERVER_API_BASE_URL=http://localhost:8080
DEBUG=true
PYTHONPATH=/app
NODE_ENV=development
EOF

# Production environment
cat > .env.production << EOF
COMPOSE_PROJECT_NAME=chronicles
ENVIRONMENT=production
VITE_SERVER_API_BASE_URL=http://localhost:8080
PYTHONPATH=/app
NODE_ENV=production
EOF
```

2. **Build and start development environment**:

```bash
docker-compose -f docker-compose.dev.yml up --build -d
```

3. **Verify everything is running**:

```bash
# Check container status
docker-compose -f docker-compose.dev.yml ps

# Test endpoints
curl http://localhost:8080/docs    # Backend API documentation
curl http://localhost:3000         # Frontend application
```

## 🔄 Development Workflow

### Daily Development

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs in real-time
docker-compose -f docker-compose.dev.yml logs -f

# Make code changes (hot reload enabled):
# - Frontend: Edit files in ./frontend/src/ 
# - Backend: Edit files in ./backend/app/

# Stop when done
docker-compose -f docker-compose.dev.yml down
```

### Backend Development

```bash
# Access backend container
docker exec -it chronicles-backend-dev /bin/bash

# Inside container, you can:
poetry install              # Install new dependencies
poetry run pytest          # Run tests
poetry run black .          # Format code
poetry run mypy .           # Type checking

# View backend logs only
docker-compose -f docker-compose.dev.yml logs -f backend
```

### Frontend Development

```bash
# Access frontend container
docker exec -it chronicles-frontend-dev /bin/sh

# Inside container, you can:
npm install                 # Install new dependencies
npm run test               # Run tests
npm run lint               # Lint code
npm run build              # Test production build

# View frontend logs only
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Adding Dependencies

**Backend (Poetry):**
```bash
# Add production dependency
cd backend
poetry add fastapi

# Add development dependency
poetry add --group dev pytest

# Rebuild container
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build -d
```

**Frontend (NPM):**
```bash
# Add dependency
cd frontend
npm install axios

# Add dev dependency
npm install --save-dev @types/node

# Rebuild container
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build -d
```

## 🚀 Production Deployment

### Local Production Testing

```bash
# Build and start production environment
docker-compose up --build -d

# View production logs
docker-compose logs -f

# Stop production environment
docker-compose down
```

### Local Production Testing with .env.production

```bash
# 1. Build production (with production env file)
docker-compose --env-file .env.production build

# 2. Start production
docker-compose --env-file .env.production up -d
# Or with logs to see what's happening
docker-compose --env-file .env.production up

# 3. Test
curl http://localhost:3000  # Should show nginx (not vite dev server)
curl http://localhost:8080/api/health
```

### Production Build Commands

```bash
# Build production images
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend

# Build without cache
docker-compose build --no-cache
```

### Production Environment Variables

Update `.env.production` with your production values:

```bash
# Required for production
VITE_SERVER_API_BASE_URL=https://your-api-domain.com
DATABASE_URL=postgresql://user:password@host:port/database
SECRET_KEY=your-super-secret-key-here
```

## 🐛 Troubleshooting

### Common Issues

**1. Containers not starting:**
```bash
# Check logs
docker-compose -f docker-compose.dev.yml logs

# Check individual service logs
docker-compose -f docker-compose.dev.yml logs backend
docker-compose -f docker-compose.dev.yml logs frontend

# Rebuild containers
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build -d
```

**2. Port already in use:**
```bash
# Find what's using the port
lsof -i :3000
lsof -i :8080

# Kill process or change ports in docker-compose files
```

**3. Volume mount issues:**
```bash
# Ensure proper permissions
sudo chown -R $USER:$USER ./frontend ./backend

# Remove volumes and restart
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

**4. Health check failures:**
```bash
# Temporarily disable health checks in docker-compose.dev.yml
# Comment out healthcheck sections and use simple depends_on

depends_on:
  - backend  # Instead of condition: service_healthy
```

### Debug Commands

```bash
# Check container status
docker ps -a

# Inspect specific container
docker inspect chronicles-backend-dev

# Check container resource usage
docker stats

# View Docker system information
docker system df
docker system info

# Access container shell for debugging
docker exec -it chronicles-backend-dev /bin/bash
docker exec -it chronicles-frontend-dev /bin/sh
```

### Reset Everything

```bash
# Nuclear option - reset everything
docker-compose -f docker-compose.dev.yml down -v
docker-compose down -v
docker system prune -a --volumes
docker-compose -f docker-compose.dev.yml up --build -d
```

## 📚 Useful Docker Commands

### Container Management

```bash
# List all containers
docker ps -a

# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# View container logs
docker logs chronicles-backend-dev
docker logs chronicles-frontend-dev
```

### Image Management

```bash
# List images
docker images

# Remove unused images
docker image prune

# Remove specific image
docker rmi image_name

# Build image manually
docker build -t chronicles-backend ./backend
docker build -t chronicles-frontend ./frontend
```

### Volume Management

```bash
# List volumes
docker volume ls

# Remove unused volumes
docker volume prune

# Remove specific volume
docker volume rm volume_name
```

### Network Management

```bash
# List networks
docker network ls

# Inspect network
docker network inspect chronicles-dev-network

# Remove unused networks
docker network prune
```

## 🔧 Configuration Files

### Environment Variables

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_SERVER_API_BASE_URL` | Frontend API endpoint | `http://localhost:8080` | Your production API URL |
| `ENVIRONMENT` | App environment | `development` | `production` |
| `DEBUG` | Enable debug mode | `true` | `false` |
| `NODE_ENV` | Node environment | `development` | `production` |

### Port Configuration

| Service | Development Port | Production Port | Purpose |
|---------|-----------------|-----------------|---------|
| Frontend | 3000 | 3000 | Web application |
| Frontend HMR | 5173 | N/A | Hot module replacement |
| Backend | 8080 | 8080 | API server |

## 📖 API Documentation

When the backend is running, API documentation is available at:
- **Swagger UI**: http://localhost:8080/docs
- **ReDoc**: http://localhost:8080/redoc
- **OpenAPI JSON**: http://localhost:8080/openapi.json

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Start development environment**: `docker-compose -f docker-compose.dev.yml up -d`
4. **Make your changes** (hot reload enabled)
5. **Test your changes**: Verify both frontend and backend work
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

## 📝 Notes

- **Hot reloading** is enabled in development for both frontend and backend
- **Source code** is mounted as volumes in development containers
- **Production builds** create optimized, static assets
- **Environment variables** are managed through `.env` files
- **Health checks** ensure services are ready before starting dependent services

## 🆘 Getting Help

If you encounter issues:

1. Check the **troubleshooting section** above
2. View **container logs**: `docker-compose -f docker-compose.dev.yml logs`
3. Check **container status**: `docker-compose -f docker-compose.dev.yml ps`
4. Try the **reset procedure**: `docker-compose -f docker-compose.dev.yml down -v` then `docker-compose -f docker-compose.dev.yml up --build -d`
5. Create an issue with logs and error details

---

**Happy coding! 🚀**