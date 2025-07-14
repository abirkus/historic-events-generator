# Historic Events Generator

A full-stack application with FastAPI backend and Vite React frontend for generating and managing historic events.

## 🚀 Quick Start

### Local Development (Recommended)

```bash
# Clone and navigate to project
git clone <your-repo-url>
cd historic-events-generator

# Backend development
cd backend
uv sync
cp .env.sample .env
# Edit .env with your API keys
uv run fastapi dev app/main.py

# Frontend development (in new terminal)
cd frontend
npm install
cp .env.sample .env
# Edit .env with backend URL
npm run dev

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Docker Testing (Optional)

```bash
# Test full stack with Docker
docker-compose up --build
# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
```

## 🏗️ Project Structure

```
historic-events-generator/
├── frontend/                 # Vite React application
│   ├── src/
│   ├── package.json
│   ├── Dockerfile           # Production build for Docker
│   └── vercel.json          # Vercel deployment config
├── backend/                 # FastAPI application
│   ├── app/
│   ├── pyproject.toml       # UV dependencies and config
│   ├── uv.lock              # Locked dependency versions
│   └── Dockerfile           # AWS App Runner deployment
├── docker-compose.yml       # Local testing and Docker deployment
├── deploy-to-app-runner.sh  # AWS App Runner deployment script
├── .env.sample             # Environment template
└── README.md               
```

## ⚡ Development Workflow

### Backend Development (UV)

```bash
cd backend

# First time setup
uv sync
cp .env.sample .env
# Edit .env with your OpenAI and Gemini API keys

# Daily development
uv run fastapi dev app/main.py      # Development server with hot reload
uv run fastapi run app/main.py      # Production server

# Development tools
uv run pytest                      # Run tests
uv run black .                     # Format code
uv run mypy .                      # Type checking
uv run flake8                      # Lint code

# Adding dependencies
uv add requests                    # Add production dependency
uv add --dev pytest-asyncio       # Add development dependency
```

### Frontend Development (NPM)

```bash
cd frontend

# First time setup
npm install
cp .env.sample .env
# Edit .env with backend URL (http://localhost:8000)

# Daily development
npm run dev                        # Development server with hot reload
npm run build                     # Production build
npm run preview                   # Preview production build

# Development tools
npm run test                      # Run tests
npm run lint                      # Lint code
npm run format                    # Format code with Prettier

# Adding dependencies
npm install axios                 # Add production dependency
npm install --save-dev @types/node # Add development dependency
```

### Environment Setup

**Backend (.env in ./backend/)**:
```bash
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
ENVIRONMENT=development
DEBUG=true
PYTHONPATH=/app
```

**Frontend (.env in ./frontend/)**:
```bash
VITE_SERVER_API_BASE_URL=http://localhost:8000
NODE_ENV=development
```

## 🚀 Deployment

### Backend Deployment (AWS App Runner)

The backend is deployed to AWS App Runner using a dedicated deployment script:

```bash
# Deploy backend to AWS App Runner
./deploy-to-app-runner.sh

# The script handles:
# - Building AMD64 Docker image
# - Pushing to AWS ECR
# - Updating App Runner service
# - Architecture compatibility (ARM64 → AMD64)
```

**Architecture Considerations:**
- Apple M-series chips use ARM64 architecture
- AWS App Runner requires AMD64 (x86_64) containers
- The deployment script automatically handles cross-platform building

### Frontend Deployment (Vercel)

The frontend is automatically deployed via Vercel integration:

1. **GitHub Integration**: Repository connected to Vercel
2. **Root Directory**: Configured to deploy from `./frontend`
3. **Auto Deploy**: Pushes to `main` branch trigger deployment
4. **Environment Variables**: Configured in Vercel dashboard

**Manual Vercel Setup** (if needed):
```bash
cd frontend
npm i -g vercel
vercel
# Follow prompts to configure deployment
```

### Environment Variables for Production

**AWS App Runner (Backend)**:
- `OPENAI_API_KEY`: Your OpenAI API key
- `GEMINI_API_KEY`: Your Google Gemini API key
- `ENVIRONMENT`: `production`
- `DEBUG`: `false`

**Vercel (Frontend)**:
- `VITE_SERVER_API_BASE_URL`: Your AWS App Runner backend URL

## 🐳 Docker Usage (Local Testing)

Docker is used for local testing and as a deployment option:

### Local Testing

```bash
# Test full stack locally
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Architecture Compatibility

```bash
# Build for AMD64 (AWS compatibility)
docker buildx build --platform linux/amd64 -t backend ./backend
docker buildx build --platform linux/amd64 -t frontend ./frontend

# Verify architecture
docker inspect backend | grep Architecture
# Should show: "Architecture": "amd64"
```

### Service-Specific Commands

```bash
# Individual service logs
docker-compose logs -f backend     # Backend logs only
docker-compose logs -f frontend    # Frontend logs only

# Rebuild individual services
docker-compose build backend       # Rebuild backend only
docker-compose build frontend      # Rebuild frontend only

# Access containers
docker exec -it chronicles-backend /bin/bash
docker exec -it chronicles-frontend /bin/sh
```

## 🔧 Configuration

### Port Configuration

| Service | Local Development | Docker | Production |
|---------|------------------|--------|------------|
| Frontend | 3000 (Vite) | 3000 | 443 (Vercel) |
| Backend | 8000 (FastAPI) | 8000 | 443 (App Runner) |

### Environment Variables

| Variable | Description | Local Dev | Production |
|----------|-------------|-----------|------------|
| `VITE_SERVER_API_BASE_URL` | Backend API URL | `http://localhost:8000` | App Runner URL |
| `OPENAI_API_KEY` | OpenAI API key | Required | Required |
| `GEMINI_API_KEY` | Gemini API key | Required | Required |
| `ENVIRONMENT` | Runtime environment | `development` | `production` |
| `DEBUG` | Debug mode | `true` | `false` |

## 🐛 Troubleshooting

### Common Development Issues

**1. Backend not starting:**
```bash
cd backend
# Check UV environment
uv info

# Reinstall dependencies
rm -rf .venv
uv sync

# Check environment variables
uv run python -c "import os; print('OpenAI:', bool(os.getenv('OPENAI_API_KEY')))"
```

**2. Frontend not connecting to backend:**
```bash
cd frontend
# Check environment variables
cat .env
# Should have: VITE_SERVER_API_BASE_URL=http://localhost:8000

# Verify backend is running
curl http://localhost:8000/api/health
```

**3. Port conflicts:**
```bash
# Check what's using the ports
lsof -i :3000
lsof -i :8000

# Kill processes if needed
sudo kill -9 $(lsof -ti:3000)
sudo kill -9 $(lsof -ti:8000)
```

### Docker Issues

**4. Architecture mismatch:**
```bash
# Check image architecture
docker inspect backend | grep Architecture

# Rebuild for correct architecture
docker buildx build --platform linux/amd64 -t backend ./backend
```

**5. Container startup failures:**
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild containers
docker-compose down
docker-compose up --build
```

### Reset Development Environment

```bash
# Reset backend
cd backend
rm -rf .venv
uv sync

# Reset frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Reset Docker (if using)
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
uv run pytest                     # Run all tests
uv run pytest --cov=app          # Run with coverage
uv run pytest tests/test_main.py # Run specific test
```

### Frontend Testing

```bash
cd frontend
npm run test                      # Run all tests
npm run test -- --coverage       # Run with coverage
npm run test -- --watch          # Run in watch mode
```

### Integration Testing

```bash
# Start both services locally
cd backend && uv run fastapi dev app/main.py &
cd frontend && npm run dev &

# Test API endpoints
curl http://localhost:8000/api/health
curl http://localhost:8000/docs

# Test frontend
curl http://localhost:3000
```

## 📚 API Documentation

When the backend is running, API documentation is available at:
- **Local Development**: http://localhost:8000/docs
- **Production**: https://your-app-runner-url.com/docs

Documentation formats:
- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI JSON**: `/openapi.json`

## 🔄 Development Best Practices

### Daily Workflow

1. **Start backend**: `cd backend && uv run fastapi dev app/main.py`
2. **Start frontend**: `cd frontend && npm run dev`
3. **Make changes** with hot reload enabled
4. **Run tests** before committing
5. **Commit and push** to trigger deployments

### Code Quality

```bash
# Backend (UV)
cd backend
uv run black .                    # Format
uv run mypy .                     # Type check
uv run flake8                     # Lint
uv run pytest                     # Test

# Frontend (NPM)
cd frontend
npm run format                    # Format with Prettier
npm run lint                      # Lint with ESLint
npm run test                      # Test with Vitest
```

### Dependency Management

**Backend**:
```bash
uv add package-name               # Add dependency
uv add --dev package-name         # Add dev dependency
uv lock                          # Update lock file
```

**Frontend**:
```bash
npm install package-name          # Add dependency
npm install --save-dev package-name # Add dev dependency
```

## 🚀 Production Monitoring

### Health Checks

- **Backend Health**: https://your-app-runner-url.com/api/health
- **Frontend**: Vercel automatically monitors deployment health

### Logs and Monitoring

- **AWS App Runner**: CloudWatch logs for backend
- **Vercel**: Function logs and analytics dashboard
- **Local Docker**: `docker-compose logs -f`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Start development servers**:
   ```bash
   cd backend && uv run fastapi dev app/main.py &
   cd frontend && npm run dev &
   ```
4. **Make your changes** (hot reload enabled)
5. **Test locally**: Verify both frontend and backend work
6. **Run quality checks**:
   ```bash
   cd backend && uv run pytest && uv run black . && uv run mypy .
   cd frontend && npm run test && npm run lint
   ```
7. **Commit your changes**: `git commit -m 'Add amazing feature'`
8. **Push to branch**: `git push origin feature/amazing-feature`
9. **Open a Pull Request**

## 📋 Deployment Checklist

### Before Deploying

- [ ] **Backend tests pass**: `cd backend && uv run pytest`
- [ ] **Frontend tests pass**: `cd frontend && npm run test`
- [ ] **Environment variables configured** in AWS and Vercel
- [ ] **API keys valid** and have sufficient quotas
- [ ] **CORS configured** for production frontend URL
- [ ] **Docker builds succeed** for AMD64 architecture

### Deployment Process

1. **Backend**: Run `./deploy-to-app-runner.sh`
2. **Frontend**: Push to `main` branch (auto-deploys via Vercel)
3. **Verify**: Test production URLs and API endpoints
4. **Monitor**: Check logs for any deployment issues

## 🆘 Getting Help

If you encounter issues:

1. **Check logs**:
   - Local: `uv run fastapi dev app/main.py` or `npm run dev`
   - Docker: `docker-compose logs -f`
   - Production: AWS CloudWatch or Vercel dashboard

2. **Verify environment**:
   - Check `.env` files exist and have correct values
   - Verify API keys are valid
   - Confirm services are running on expected ports

3. **Try reset procedures** above

4. **Create an issue** with:
   - Error messages and logs
   - Steps to reproduce
   - Environment details (OS, Node version, UV version)

---

**Happy coding! 🚀**

### Quick Reference

```bash
# Start development
cd backend && uv run fastapi dev app/main.py &
cd frontend && npm run dev &

# Deploy
./deploy-to-app-runner.sh          # Backend to AWS
git push origin main               # Frontend to Vercel (auto)

# Test with Docker
docker-compose up --build

# Reset everything
cd backend && rm -rf .venv && uv sync
cd frontend && rm -rf node_modules && npm install
```