# Historic Events Generator Frontend
### by Andre Birkus

A **single-page application** built with Vite and React for interacting with AI models to obtain historic events based on user date input.

## 🚀 Quick Start

### Local Development (Recommended)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

### Docker Development
```bash
# Build and run development container
docker build -f Dockerfile.dev -t frontend-dev .
docker run -d --name frontend-dev -p 3000:3000 -v $(pwd):/app -v /app/node_modules frontend-dev

# Access at http://localhost:3000
```

## 📋 Prerequisites

- **Node.js** 18+ and **npm** (for local development)
- **Docker** (for containerized development)

### Environment Setup

Create a `.env` file in the frontend directory:

```bash
# Copy from sample
cp .env.sample .env

# Edit with your values
VITE_SERVER_API_BASE_URL=http://localhost:8000
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server (http://localhost:3000) |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests |
| `npm run lint` | Lint code with ESLint |
| `npm run format` | Format code with Prettier |

## 🐳 Docker Usage

### Development Container

```bash
# Build development image
docker build -f Dockerfile.dev -t frontend-dev .

# Run with hot reloading
docker run -d \
  --name frontend-dev-container \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e VITE_SERVER_API_BASE_URL=http://localhost:8000 \
  frontend-dev

# View logs
docker logs -f frontend-dev-container

# Stop and cleanup
docker stop frontend-dev-container && docker rm frontend-dev-container
```

### Production Container

```bash
# Build production image
docker build -t frontend-prod .

# Run production container
docker run -d \
  --name frontend-prod-container \
  -p 3000:3000 \
  -e VITE_SERVER_API_BASE_URL=http://localhost:8000 \
  frontend-prod

# Access at http://localhost:3000
```

### One-liner Commands

```bash
# Development
cd frontend && docker build -f Dockerfile.dev -t frontend-dev . && docker run -d --name frontend-dev -p 3000:3000 -v $(pwd):/app -v /app/node_modules -e VITE_SERVER_API_BASE_URL=http://localhost:8000 frontend-dev

# Production  
cd frontend && docker build -t frontend-prod . && docker run -d --name frontend-prod -p 3000:3000 -e VITE_SERVER_API_BASE_URL=http://localhost:8000 frontend-prod
```

## 🌐 Environment Variables

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_SERVER_API_BASE_URL` | Backend API endpoint | `http://localhost:8000` | Your production API URL |
| `NODE_ENV` | Environment mode | `development` | `production` |

### Environment Files

```bash
# .env.development
VITE_SERVER_API_BASE_URL=http://localhost:8000
NODE_ENV=development

# .env.production  
VITE_SERVER_API_BASE_URL=https://your-api-domain.com
NODE_ENV=production
```

## 🔧 Development Workflow

### Local Development
```bash
# Start development server
npm run dev

# In another terminal, start backend
# (or use Docker Compose for full stack)

# Make changes to src/ files
# Hot reloading will update automatically
```

### Docker Development
```bash
# Start container with volume mounting for hot reload
docker run -d \
  --name frontend-dev \
  -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  frontend-dev

# Make changes to src/ files
# Changes will be reflected in the container
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── assets/        # Custom UI images and icons
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── services/      # API service abstraction layer to interact with BE
│   ├── App.css        # CSS styling
│   ├── App.tsx        # Application entry point
│   ├── index.css      # CSS styling
│   └── index.tsx      # Application entry point
├── Dockerfile         # Production container
├── Dockerfile.dev     # Development container
├── vite.config.ts     # Vite configuration
├── package.json       # Dependencies and scripts
├── .env.sample        # Environment template
└── README.md          
```

## 🐛 Troubleshooting

### Common Issues

**1. Vite server not accessible in Docker:**
```bash
# Ensure Vite binds to 0.0.0.0, not localhost
# In vite.config.ts:
server: {
  host: '0.0.0.0',
  port: 3000
}

# Or in package.json:
"dev": "vite --host 0.0.0.0 --port 3000"
```

**2. API calls failing:**
```bash
# Check environment variable
echo $VITE_SERVER_API_BASE_URL

# Verify backend is running
curl http://localhost:8000/docs
```

**3. Hot reloading not working in Docker:**
```bash
# Ensure volume is mounted correctly
-v $(pwd):/app
-v /app/node_modules  # Preserve node_modules
```

**4. Port conflicts:**
```bash
# Check what's using the port
lsof -i :3000

# Use different port
docker run -p 3001:3000 frontend-dev
```

### Debug Commands

```bash
# Check container status
docker ps

# View container logs
docker logs frontend-dev-container

# Access container shell
docker exec -it frontend-dev-container sh

# Test API connectivity from container
docker exec -it frontend-dev-container curl http://host.docker.internal:8000/docs
```

### Reset Development Environment

```bash
# Clean up containers
docker stop frontend-dev-container
docker rm frontend-dev-container

# Clean up images
docker rmi frontend-dev

# Rebuild and restart
npm install  # or docker build -f Dockerfile.dev -t frontend-dev .
npm run dev  # or docker run commands above
```

## 🚀 Deployment

### Building for Production

```bash
# Local build
npm run build
npm run preview  # Test production build

# Docker build
docker build -t frontend-prod .
docker run -p 3000:3000 frontend-prod
```

### Production Environment

The production build creates optimized static files served by Nginx:
- Minified JavaScript and CSS
- Gzip compression enabled
- Efficient caching headers
- Health check endpoint at `/health`

## 🔗 Related

- **Backend API**: Located in `../backend/`
- **Full Stack Setup**: See main project README
- **Docker Compose**: For running frontend + backend together

---

**Need help?** Check the main project README.