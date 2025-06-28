# Historic Events Generator Backend
### by Andre Birkus

A **FastAPI application** that provides AI-powered historic events based on user date input, integrating with OpenAI and Gemini APIs.

## 🚀 Quick Start

### Local Development (Recommended)
```bash
# Install dependencies
poetry install

# Set up environment variables
cp .env.sample .env
# Edit .env with your API keys

# Start development server
poetry run fastapi dev app/main.py

# Access at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Docker Development
```bash
# Build and run development container
docker build -t backend-dev .
docker run -d --name backend-dev -p 8000:8000 -v $(pwd):/app backend-dev

# Access at http://localhost:8000
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

| Command | Description |
|---------|-------------|
| `poetry install` | Install dependencies |
| `poetry run fastapi dev app/main.py` | Start development server with hot reload |
| `poetry run fastapi run app/main.py` | Start production server |
| `poetry run pytest` | Run tests |
| `poetry run black .` | Format code |
| `poetry run mypy .` | Type checking |
| `poetry run flake8` | Lint code |

### Legacy Commands (still supported)
```bash
# Alternative ways to start the server
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
python -m uvicorn app.main:app --reload
```

## 🐳 Docker Usage

### Development Container

```bash
# Build development image
docker build -t backend-dev .

# Run with hot reloading (mount source code)
docker run -d \
  --name backend-dev-container \
  -p 8000:8000 \
  -v $(pwd):/app \
  -v /app/.venv \
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
# Build production image
docker build -t backend-prod .

# Run production container
docker run -d \
  --name backend-prod-container \
  -p 8000:8000 \
  -e OPENAI_API_KEY=your_key_here \
  -e GEMINI_API_KEY=your_key_here \
  -e ENVIRONMENT=production \
  backend-prod

# Access at http://localhost:8000
```

### Using Environment File with Docker

```bash
# Run with .env file
docker run -d \
  --name backend-container \
  -p 8000:8000 \
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
| `PORT` | Server port | ❌ No | `8000` |

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

### Local Development
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

# Install new dependencies
poetry install
```

### Docker Development
```bash
# Start container with volume mounting for hot reload
docker run -d \
  --name backend-dev \
  -p 8000:8000 \
  -v $(pwd):/app \
  -v /app/.venv \
  --env-file .env \
  backend-dev

# Access container shell
docker exec -it backend-dev /bin/bash

# Inside container, you can run:
poetry install      # Install new dependencies
poetry run pytest  # Run tests
poetry run black .  # Format code
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
├── Dockerfile            # Container configuration
├── pyproject.toml        # Poetry dependencies and config
├── poetry.lock           # Locked dependency versions
├── .env.sample           # Environment template
└── README.md             
```

## 📚 API Documentation

When the server is running, comprehensive API documentation is available:

| Endpoint | Description |
|----------|-------------|
| `http://localhost:8000/docs` | **Swagger UI** - Interactive API documentation |
| `http://localhost:8000/redoc` | **ReDoc** - Alternative documentation format |
| `http://localhost:8000/openapi.json` | **OpenAPI Schema** - Raw API specification |
| `http://localhost:8000/api/health` | **Health Check** - Service status |

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
curl http://localhost:8000/docs
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
poetry run pytest

# Run with coverage
poetry run pytest --cov=app

# Run specific test file
poetry run pytest tests/test_events.py

# Run with verbose output
poetry run pytest -v

# Run tests in Docker
docker exec -it backend-dev-container poetry run pytest
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
# Check environment variables are loaded
poetry run python -c "import os; print('OpenAI:', bool(os.getenv('OPENAI_API_KEY')))"

# Verify .env file exists and has correct format
cat .env
```

**2. Server not starting:**
```bash
# Check for port conflicts
lsof -i :8000

# Check logs for errors
poetry run fastapi dev app/main.py

# In Docker, check container logs
docker logs backend-dev-container
```

**3. Import errors:**
```bash
# Ensure PYTHONPATH is set correctly
export PYTHONPATH=/path/to/backend

# Or use poetry shell
poetry shell
python -c "from app.main import app; print('Import successful')"
```

**4. Poetry issues:**
```bash
# Clear poetry cache
poetry cache clear pypi --all

# Reinstall dependencies
rm poetry.lock
poetry install

# Check poetry configuration
poetry config --list
```

### Debug Commands

```bash
# Check server status
curl http://localhost:8000/api/health

# Test API endpoint
curl -X POST http://localhost:8000/api/events \
  -H "Content-Type: application/json" \
  -d '{"date": "2023-06-28", "model": "openai"}'

# Check dependencies
poetry show

# Verify Python version
poetry run python --version

# Access container shell for debugging
docker exec -it backend-dev-container /bin/bash
```

### Reset Development Environment

```bash
# Clean up poetry environment
poetry env remove python
poetry install

# Clean up Docker
docker stop backend-dev-container
docker rm backend-dev-container
docker rmi backend-dev

# Rebuild and restart
poetry install  # or docker build -t backend-dev .
poetry run fastapi dev app/main.py  # or docker run commands
```

## 🚀 Deployment

### Building for Production

```bash
# Local production build
poetry run fastapi run app/main.py

# Docker production build
docker build -t backend-prod .
docker run -p 8000:8000 --env-file .env.production backend-prod
```

### Production Checklist

- [ ] API keys configured in environment
- [ ] Debug mode disabled (`DEBUG=false`)
- [ ] Environment set to production (`ENVIRONMENT=production`)
- [ ] Health check endpoint working
- [ ] Database connections configured (if applicable)
- [ ] Logging configured for production
- [ ] Security headers configured

## 🔗 Related

- **Frontend Application**: Located in `../frontend/`
- **Full Stack Setup**: See main project README
- **Docker Compose**: For running backend + frontend together

## 🛡️ Security Notes

- Never commit API keys to version control
- Use environment variables for all secrets
- Regularly rotate API keys
- Monitor API usage and costs
- Implement rate limiting for production

---

**Need help?** Check the troubleshooting section above.