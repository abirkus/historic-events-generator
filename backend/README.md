# Historic Events Generator Backend
### by Andre Birkus

A **FastAPI application** that provides AI-powered historic events based on user date input, integrating with OpenAI and Gemini APIs.

## 🏗️ Architecture Decision: Poetry + Requirements.txt Hybrid

This project uses a **hybrid approach** for dependency management:

- **Local Development**: Poetry for dependency management, virtual environments, and development workflow
- **Docker Production**: requirements.txt exported from Poetry for optimized container builds

### Why This Approach?

| Aspect | Poetry in Docker | Requirements.txt in Docker | Our Choice |
|--------|------------------|---------------------------|------------|
| **Image Size** | ~800MB+ | ~300MB | ✅ Requirements.txt |
| **Build Speed** | Slower (Poetry overhead) | Faster (pip only) | ✅ Requirements.txt |
| **Dependency Management** | Full Poetry features | Basic pip install | Poetry (local dev) |
| **Lock File Benefits** | ✅ Yes | ❌ No | Poetry lock → requirements.txt |

**Current optimized Docker image size: ~300MB** (down from 970MB+ with full Poetry setup)

### Workflow:
1. **Develop locally** with Poetry (`poetry add`, `poetry install`, etc.)
2. **Export for Docker** with `poetry export -f requirements.txt --output requirements.txt --without-hashes --only=main`
3. **Build containers** using lightweight requirements.txt approach

## 🚀 Quick Start

### Local Development (Recommended)
```bash
# Install dependencies with Poetry
poetry install

# Set up environment variables
cp .env.sample .env
# Edit .env with your API keys

# Start development server
poetry run fastapi dev app/main.py

# Access at http://localhost:8080
# API docs at http://localhost:8080/docs
```

### Docker Development
```bash
# Build optimized container (300MB)
docker build -t backend-dev .
docker run -d --name backend-dev -p 8080:8080 -v $(pwd):/app backend-dev

# Access at http://localhost:8080
```

## 📋 Prerequisites

- **Python** 3.9+ and **Poetry** (for local development)
- **Docker** (for containerized development)
- **API Keys** for OpenAI and Gemini

### Environment Setup

Create a `.env` file in the backend directory:

```bash
# Copy from sample
cp .env.sample .env

# Required API keys
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Optional configuration
ENVIRONMENT=development
DEBUG=true
PYTHONPATH=/app
```

## 🛠️ Available Commands

### Local Development (Poetry)

| Command | Description |
|---------|-------------|
| `poetry install` | Install dependencies |
| `poetry run fastapi dev app/main.py` | Start development server with hot reload |
| `poetry run fastapi run app/main.py` | Start production server |
| `poetry run pytest` | Run tests |
| `poetry run black .` | Format code |
| `poetry run mypy .` | Type checking |
| `poetry run flake8` | Lint code |

### Docker Export Commands

```bash
# Export Poetry dependencies to requirements.txt for Docker
poetry export -f requirements.txt --output requirements.txt --without-hashes --only=main

# Export with development dependencies (for development containers)
poetry export -f requirements.txt --output requirements-dev.txt --without-hashes --with dev
```

### Legacy Commands (still supported)
```bash
# Alternative ways to start the server locally
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
python -m uvicorn app.main:app --reload
```

## 🐳 Docker Usage

**Docker containers use requirements.txt (exported from Poetry) for optimal size and performance.**

### Development Container

```bash
# Build development image (~300MB)
docker build -t backend-dev .

# Run with hot reloading (mount source code)
docker run -d \
  --name backend-dev-container \
  -p 8080:8080 \
  -v $(pwd):/app \
  -e OPENAI_API_KEY=your_key_here \
  -e GEMINI_API_KEY=your_key_here \
  -e ENVIRONMENT=development \
  backend-dev

# View logs
docker logs -f backend-dev-container

# Stop and cleanup
docker stop backend-dev-container && docker rm backend-dev-container
```

### Production Container

```bash
# Build production image (~300MB)
docker build -t backend-prod .

# Run production container
docker run -d \
  --name backend-prod-container \
  -p 8080:8080 \
  -e OPENAI_API_KEY=your_key_here \
  -e GEMINI_API_KEY=your_key_here \
  -e ENVIRONMENT=production \
  backend-prod

# Access at http://localhost:8080
```

### Using Environment File with Docker

```bash
# Run with .env file
docker run -d \
  --name backend-container \
  -p 8080:8080 \
  --env-file .env \
  backend-dev
```

## 🌐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key | ✅ Yes | None |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ Yes | None |
| `ENVIRONMENT` | Runtime environment | ❌ No | `development` |
| `DEBUG` | Enable debug mode | ❌ No | `true` |
| `PYTHONPATH` | Python path | ❌ No | `/app` |
| `HOST` | Server host | ❌ No | `0.0.0.0` |
| `PORT` | Server port | ❌ No | `8080` |

### Environment Files

```bash
# .env.development
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
ENVIRONMENT=development
DEBUG=true
PYTHONPATH=/app

# .env.production
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
ENVIRONMENT=production
DEBUG=false
PYTHONPATH=/app
```

## 🔧 Development Workflow

### Local Development (Poetry)
```bash
# Start development server with hot reload
poetry run fastapi dev app/main.py

# In another terminal, run tests
poetry run pytest

# Format and lint code
poetry run black .
poetry run mypy .
poetry run flake8
```

### Adding Dependencies
```bash
# Add production dependency
poetry add fastapi-users

# Add development dependency
poetry add --group dev pytest-asyncio

# Update lockfile
poetry lock

# Export new dependencies for Docker
poetry export -f requirements.txt --output requirements.txt --without-hashes --only=main

# Install new dependencies
poetry install
```

### Docker Development
```bash
# After updating dependencies, rebuild container
docker build -t backend-dev .

# Start container with volume mounting for hot reload
docker run -d \
  --name backend-dev \
  -p 8080:8080 \
  -v $(pwd):/app \
  --env-file .env \
  backend-dev

# Access container shell
docker exec -it backend-dev /bin/bash

# Note: Poetry is NOT available in containers
# Use pip for any container-specific operations
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application entry point
│   ├── routers/          # API route handlers
│   ├── models/           # Data models
│   ├── services/         # Business logic
│   └── config.py         # Configuration settings
├── tests/                # Test files
├── Dockerfile            # Optimized container (uses requirements.txt)
├── requirements.txt      # Exported from Poetry for Docker
├── pyproject.toml        # Poetry dependencies and config
├── poetry.lock           # Locked dependency versions
├── .env.sample           # Environment template
└── README.md             # This file
```

## 🔄 Dependency Management Workflow

### 1. Local Development (Poetry)
```bash
# Use Poetry for all local development
poetry add requests          # Add dependency
poetry add --group dev black # Add dev dependency
poetry install              # Install dependencies
poetry run pytest          # Run with Poetry
```

### 2. Export for Docker
```bash
# Export current dependencies to requirements.txt
poetry export -f requirements.txt --output requirements.txt --without-hashes --only=main

# Verify export
cat requirements.txt | head -10
```

### 3. Build Optimized Container
```bash
# Build container using requirements.txt (300MB)
docker build -t backend .

# Verify size optimization
docker images | grep backend
```

## 📚 API Documentation

When the server is running, comprehensive API documentation is available:

| Endpoint | Description |
|----------|-------------|
| `http://localhost:8080/docs` | **Swagger UI** - Interactive API documentation |
| `http://localhost:8080/redoc` | **ReDoc** - Alternative documentation format |
| `http://localhost:8080/openapi.json` | **OpenAPI Schema** - Raw API specification |
| `http://localhost:8080/api/health` | **Health Check** - Service status |

### Key API Endpoints

```bash
# Health check
GET /api/health

# Historic events (example)
POST /api/events
{
  "date": "2023-06-28",
  "model": "openai"  # or "gemini"
}

# View all available endpoints
curl http://localhost:8080/docs
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests (locally with Poetry)
poetry run pytest

# Run with coverage
poetry run pytest --cov=app

# Run specific test file
poetry run pytest tests/test_events.py

# Run with verbose output
poetry run pytest -v

# Run tests in Docker (pip-based environment)
docker exec -it backend-dev-container python -m pytest
```

### Test Structure

```bash
tests/
├── __init__.py
├── conftest.py           # Test configuration
├── test_main.py          # Main app tests
├── test_events.py        # Events API tests
└── test_services.py      # Service layer tests
```

## 🐛 Troubleshooting

### Common Issues

**1. API Keys not working:**
```bash
# Check environment variables are loaded (locally)
poetry run python -c "import os; print('OpenAI:', bool(os.getenv('OPENAI_API_KEY')))"

# Check in Docker container
docker exec -it backend-dev-container python -c "import os; print('OpenAI:', bool(os.getenv('OPENAI_API_KEY')))"

# Verify .env file exists and has correct format
cat .env
```

**2. Server not starting:**
```bash
# Check for port conflicts
lsof -i :8080

# Check logs for errors (locally)
poetry run fastapi dev app/main.py

# In Docker, check container logs
docker logs backend-dev-container
```

**3. Dependencies out of sync:**
```bash
# Re-export requirements.txt from Poetry
poetry export -f requirements.txt --output requirements.txt --without-hashes --only=main

# Rebuild Docker image
docker build -t backend .
```

**4. Poetry vs pip confusion:**
```bash
# Local development: Use Poetry
poetry add requests
poetry run python script.py

# Docker containers: Use pip (requirements.txt)
# Poetry is NOT available in containers by design (for size optimization)
```

### Debug Commands

```bash
# Check server status
curl http://localhost:8080/api/health

# Test API endpoint
curl -X POST http://localhost:8080/api/events \
  -H "Content-Type: application/json" \
  -d '{"date": "2023-06-28", "model": "openai"}'

# Check dependencies (locally)
poetry show

# Check dependencies (Docker)
docker exec -it backend-dev-container pip list

# Verify Python version
poetry run python --version              # Local
docker exec -it backend-dev-container python --version  # Container
```

### Reset Development Environment

```bash
# Clean up poetry environment
poetry env remove python
poetry install

# Re-export for Docker
poetry export -f requirements.txt --output requirements.txt --without-hashes --only=main

# Clean up Docker
docker stop backend-dev-container
docker rm backend-dev-container
docker rmi backend

# Rebuild and restart
docker build -t backend .
docker run -d --name backend-dev -p 8080:8080 --env-file .env backend
```

## 🚀 Deployment

### Building for Production

```bash
# Local production build (Poetry)
poetry run fastapi run app/main.py

# Docker production build (requirements.txt)
docker build -t backend-prod .
docker run -p 8080:8080 --env-file .env.production backend-prod
```

### Production Checklist

- [ ] API keys configured in environment
- [ ] Debug mode disabled (`DEBUG=false`)
- [ ] Environment set to production (`ENVIRONMENT=production`)
- [ ] Health check endpoint working
- [ ] Requirements.txt is up-to-date (`poetry export`)
- [ ] Docker image size optimized (~300MB)
- [ ] Database connections configured (if applicable)
- [ ] Logging configured for production
- [ ] Security headers configured

## 📊 Performance Metrics

### Docker Image Optimization Results

| Approach | Image Size | Build Time | Memory Usage |
|----------|------------|------------|--------------|
| **Poetry in Docker** | ~970MB | ~5-8 min | ~400MB RAM |
| **Requirements.txt** | **~300MB** | ~2-3 min | ~200MB RAM |
| **Improvement** | **69% smaller** | **60% faster** | **50% less RAM** |

### Dependencies Overview

```bash
# View current dependencies size breakdown
poetry show --tree

# View Docker image layers
docker history backend --human --format "table {{.CreatedBy}}\t{{.Size}}"
```

## 🔗 Related

- **Frontend Application**: Located in `../frontend/`
- **Full Stack Setup**: See main project README
- **Docker Compose**: For running backend + frontend together

## 💡 Tips & Best Practices

### Dependency Management
1. **Use Poetry locally** for all dependency operations
2. **Export to requirements.txt** before building Docker images
3. **Keep requirements.txt in version control** for reproducible builds
4. **Regularly update** both Poetry lock file and requirements.txt

### Docker Optimization
1. **Alpine Linux base** for minimal image size
2. **Multi-stage builds** for even smaller production images
3. **Layer caching** by copying requirements.txt first
4. **Regular cleanup** of unused images and containers

---

**Need help?** Check the troubleshooting section above.