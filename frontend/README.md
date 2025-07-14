# Historic Events Generator Frontend
### by Andre Birkus

A **single-page application** built with Vite and React for interacting with AI models to obtain historic events based on user date input.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access at http://localhost:3000
```

## 📋 Prerequisites

- **Node.js** 18+ and **npm**

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
├── vite.config.ts     # Vite configuration
├── package.json       # Dependencies and scripts
├── .env.sample        # Environment template
└── README.md          
```

## 🐛 Troubleshooting

### Common Issues

**1. API calls failing:**
```bash
# Check environment variable
echo $VITE_SERVER_API_BASE_URL

# Verify backend is running
curl http://localhost:8000/docs
```

**2. Port conflicts:**
```bash
# Check what's using the port
lsof -i :3000

# Kill process using the port
sudo kill -9 $(lsof -ti:3000)
```

**3. Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Reset Development Environment

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 🚀 Deployment

### Vercel Deployment

This project is configured for automatic deployment with Vercel:

1. **Connect GitHub Repository**: Link your GitHub repository to Vercel
2. **Set Root Directory**: Configure Vercel to deploy from `./frontend` directory
3. **Environment Variables**: Add production environment variables in Vercel dashboard:
   ```
   VITE_SERVER_API_BASE_URL=https://your-production-api-url.com
   ```
4. **Auto Deploy**: Push to main branch triggers automatic deployment

### Manual Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts to configure deployment
```

### Building for Production

```bash
# Local production build
npm run build
npm run preview  # Test production build locally
```

### Production Environment

The production build creates optimized static files:
- Minified JavaScript and CSS
- Tree-shaking for smaller bundle size
- Efficient caching and CDN delivery via Vercel
- Automatic HTTPS and global distribution

## 🔗 Related

- **Backend API**: Located in `../backend/`
- **Full Stack Setup**: See main project README
- **Vercel Dashboard**: Manage deployments and environment variables

---

**Need help?** Check the main project README or Vercel documentation.