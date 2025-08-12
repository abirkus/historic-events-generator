# Historic Events Generator - Frontend

A modern React application built with Vite that provides an intuitive interface for exploring historical events through AI-powered conversations.

## Features

- **Modern React Stack**: Built with Vite, TypeScript, and React 18
- **AI Chat Interface**: Interactive conversations with multiple LLM providers
- **Responsive Design**: Optimized for desktop and mobile experiences
- **Fast Development**: Hot module replacement and instant feedback
- **Production Ready**: Optimized builds with automatic deployment

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Configure environment
cp .env.sample .env
# Edit .env with your backend URL

# Start development server
npm run dev
```

Access the application at `http://localhost:3000`

### Environment Configuration

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_SERVER_API_BASE_URL` | Yes | Backend API endpoint | `http://localhost:8000` |

```bash
# .env
VITE_SERVER_API_BASE_URL=http://localhost:8000
```

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Code quality
npm run lint
npm run format
```

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Application pages
│   ├── services/           # API client and utilities
│   ├── assets/             # Static assets and images
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
├── public/                 # Static public assets
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

### Development Workflow

1. **Start Backend**: Ensure the backend API is running on port 8000
2. **Start Frontend**: Run `npm run dev` for development server
3. **Make Changes**: Edit files in `src/` with instant hot reload
4. **Test Changes**: Use the interactive interface to verify functionality

## Deployment

### Vercel (Recommended)

Automatic deployment configured for Vercel:

1. **Connect Repository**: Link GitHub repo to Vercel
2. **Configure Root**: Set deployment directory to `./frontend`
3. **Environment Variables**: Add production API URL
4. **Deploy**: Push to main branch for automatic deployment

```bash
# Manual Vercel deployment
npm i -g vercel
cd frontend
vercel
```

### Manual Build

```bash
# Create production build
npm run build

# Test production build locally
npm run preview

# Deploy dist/ folder to any static hosting
```

## Architecture

### Component Structure

- **Pages**: Route-level components (`Home`, `About`)
- **Components**: Reusable UI elements (`Header`, `Footer`, `EventCard`)
- **Services**: API abstraction layer for backend communication
- **Assets**: Images, icons, and static resources

### API Integration

The frontend communicates with the backend through a clean service layer:

```typescript
// Example API call
const response = await apiClient.sendMessage({
  message: "What happened on June 28, 2023?",
  provider: "openai"
});
```

## Performance

- **Vite Build Tool**: Lightning-fast development and optimized production builds
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Eliminates unused code for smaller bundles
- **CDN Delivery**: Vercel provides global CDN distribution
- **Lazy Loading**: Components and routes loaded on demand

## Troubleshooting

### Common Issues

**API Connection Failed**
```bash
# Verify environment variable
echo $VITE_SERVER_API_BASE_URL

# Check backend status
curl http://localhost:8000/api/health
```

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Module Resolution Errors**
```bash
# Clean installation
rm -rf node_modules package-lock.json
npm install
```

### Reset Environment

```bash
# Complete reset
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## Contributing

1. Follow TypeScript and React best practices
2. Use ESLint and Prettier for code formatting
3. Test changes across different screen sizes
4. Ensure accessibility standards are met
5. Update documentation for new features

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and builds
- **Styling**: CSS with modern features
- **Deployment**: Vercel for automatic CI/CD
- **Code Quality**: ESLint, Prettier, TypeScript

---

**Live Demo**: Available through Vercel deployment  
**Backend API**: Connects to FastAPI backend service  
**Performance**: Optimized for fast loading and smooth interactions