# Historic Events Generator

A modern full-stack application that generates AI-powered historical events and insights. Built with FastAPI backend and React frontend, supporting multiple LLM providers for rich historical conversations.

## Features

- **Multi-LLM Support**: OpenAI GPT and Google Gemini integration
- **Modern Stack**: FastAPI backend + React/Vite frontend
- **AI Conversations**: Interactive chat interface for historical exploration
- **Production Ready**: AWS App Runner + Vercel deployment
- **Developer Friendly**: Hot reload, comprehensive testing, modern tooling

## Architecture

The Historic Events Generator follows a modern microservices architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                USER BROWSER                                 │
└─────────────────────────┬───────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Vercel)                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   React + Vite  │  │   Components    │  │      API Service Layer      │  │
│  │   TypeScript    │  │   - Header      │  │   - ApiClient.ts            │  │
│  │   Port 3000     │  │   - EventCard   │  │   - AxiosApiClient.ts       │  │
│  │                 │  │   - Footer      │  │                             │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────────────────────────┘
                          │ HTTPS/REST API
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BACKEND (AWS App Runner)                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   FastAPI       │  │     Routers     │  │         Services            │  │
│  │   UV + Python   │  │   - chat.py     │  │   - ai_service.py           │  │
│  │   Port 8000     │  │   - health      │  │   - openai_service.py       │  │
│  │                 │  │                 │  │   - gemini_service.py       │  │   
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────────────────────────────────────┐   │
│  │     Models      │  │                Utils                            │   │
│  │   - chat.py     │  │   - provider_utils.py                           │   │
│  │   - schemas     │  │   - response_cleanup.py                         │   │
│  └─────────────────┘  └─────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────────────────┘
                          │ API Calls
                          ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AI PROVIDERS                                       │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │           OpenAI GPT            │  │         Google Gemini           │   │
│  │      Chat Completions API       │  │       Generative AI API         │   │
│  │                                 │  │                                 │   │
│  └─────────────────────────────────┘  └─────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

                          DEVELOPMENT TOOLS
┌─────────────────────────────────────────────────────────────────────────────┐
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │ Docker Compose  │  │  UV Package Mgr │  │      Vite Dev Server        │  │
│  │ Local Dev Stack │  │ Fast API Deps.  │  │    Hot Module Reload        │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **User** interacts with React frontend hosted on Vercel
2. **Frontend** sends requests through API service layer to FastAPI backend
3. **Backend** processes requests using routers and services
4. **AI Services** call OpenAI or Gemini APIs for content generation
5. **Response** flows back through the same path to the user

### Component Breakdown
- **Frontend (React)**: User interface with modular components and API service layer
- **Backend (FastAPI)**: RESTful API with LLM integrations and business logic  
- **AI Providers**: External APIs for generating historical content
- **Development Tools**: Modern tooling for fast development and deployment

## Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+ and [UV package manager](https://docs.astral.sh/uv/)
- **API Keys**: OpenAI and Google Gemini

### Local Development

```bash
# Clone repository
git clone <repository-url>
cd historic-events-generator

# Backend setup
cd backend
uv sync
cp .env.sample .env
# Add your API keys to .env
uv run fastapi dev app/main.py

# Frontend setup (new terminal)
cd ../frontend
npm install
cp .env.sample .env
# Set VITE_SERVER_API_BASE_URL=http://localhost:8000
npm run dev

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000/docs
```

### Docker (Optional)

```bash
# Test full stack locally
docker-compose up --build

# Access at http://localhost:3000
```

## Project Structure

```
historic-events-generator/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   └── services/        # API client layer
│   ├── package.json
│   └── Dockerfile
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # LLM integrations
│   │   └── models/          # Data models
│   ├── pyproject.toml       # UV dependencies
│   └── Dockerfile
├── docker-compose.yml       # Local development stack
└── deploy-to-app-runner.sh  # AWS deployment script
```

## Development

### Backend (FastAPI + UV)

```bash
cd backend

# Development server
uv run fastapi dev app/main.py

# Testing and quality
uv run pytest
uv run black .
uv run mypy .

# Add dependencies
uv add package-name
```

### Frontend (React + Vite)

```bash
cd frontend

# Development server
npm run dev

# Testing and quality
npm run test
npm run lint
npm run format

# Add dependencies
npm install package-name
```

## Environment Configuration

### Backend (.env)
```bash
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
ENVIRONMENT=development
DEBUG=true
```

### Frontend (.env)
```bash
VITE_SERVER_API_BASE_URL=http://localhost:8000
```

## Deployment

### Production Architecture

- **Frontend**: Vercel (automatic deployment from main branch)
- **Backend**: AWS App Runner (containerized deployment)
- **Cross-Platform**: AMD64 Docker builds for AWS compatibility

### Backend Deployment

```bash
# Deploy to AWS App Runner
./deploy-to-app-runner.sh
```

### Frontend Deployment

```bash
# Automatic via Vercel integration
git push origin main
```

### Environment Variables (Production)

**AWS App Runner**:
- `OPENAI_API_KEY`, `GEMINI_API_KEY`
- `ENVIRONMENT=production`, `DEBUG=false`

**Vercel**:
- `VITE_SERVER_API_BASE_URL=<your-app-runner-url>`

## API Documentation

Interactive API documentation available when backend is running:

- **Swagger UI**: `/docs`
- **ReDoc**: `/redoc`
- **OpenAPI Schema**: `/openapi.json`

### Key Endpoints

```bash
# Health check
GET /api/health

# Chat with AI
POST /api/chat/message
{
  "message": "What happened on June 28, 2023?",
  "provider": "openai"
}
```

## Testing

```bash
# Backend tests
cd backend && uv run pytest --cov=app

# Frontend tests
cd frontend && npm run test

# Integration testing
docker-compose up --build
curl http://localhost:8000/api/health
curl http://localhost:3000
```

## Performance

- **Fast Development**: UV package manager (10x faster than pip)
- **Hot Reload**: Both frontend and backend support instant updates
- **Optimized Builds**: Vite for frontend, UV for backend containers
- **Production Ready**: CDN delivery, containerized deployment

## Troubleshooting

### Common Issues

**API Connection Failed**
```bash
# Check backend status
curl http://localhost:8000/api/health

# Verify environment variables
cd backend && uv run python -c "import os; print('API Keys:', bool(os.getenv('OPENAI_API_KEY')))"
```

**Port Conflicts**
```bash
# Check port usage
lsof -i :3000 :8000

# Kill processes if needed
sudo kill -9 $(lsof -ti:3000,8000)
```

**Docker Architecture Issues**
```bash
# Verify AMD64 build for AWS
docker inspect backend | grep Architecture
# Should show: "Architecture": "amd64"
```

### Reset Environment

```bash
# Backend reset
cd backend && rm -rf .venv && uv sync

# Frontend reset
cd frontend && rm -rf node_modules && npm install

# Docker reset
docker-compose down -v && docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Start development servers:
   ```bash
   cd backend && uv run fastapi dev app/main.py &
   cd frontend && npm run dev &
   ```
4. Make changes with hot reload enabled
5. Run tests: `uv run pytest` and `npm run test`
6. Commit and push: `git commit -m 'Add feature'`
7. Open a Pull Request

## Technology Stack

### Backend
- **Framework**: FastAPI with async support
- **Package Manager**: UV for fast dependency management
- **LLM Integration**: OpenAI GPT, Google Gemini
- **Deployment**: AWS App Runner with Docker

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and builds
- **Styling**: Modern CSS with responsive design
- **Deployment**: Vercel with automatic CI/CD

### Infrastructure
- **Containerization**: Docker with multi-platform builds
- **Local Development**: Docker Compose for full stack testing
- **Monitoring**: Health checks and comprehensive logging

---

**Live Demo**: Available through production deployment  
**Documentation**: Comprehensive API docs and component libraries  
**Support**: Issues and discussions welcome in the repository