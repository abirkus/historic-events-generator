from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import chat
from .config import get_settings

import logging
import os


# Add startup logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


app = FastAPI(
    title="AI Chat API", description="AI-powered historic events API", version="1.0.0"
)


def get_cors_origins():
    environment = os.getenv("ENVIRONMENT", "development")

    if environment == "production":
        # Your production frontend URL from App Runner
        frontend_url = os.getenv("FRONTEND_URL", "")
        origins = []

        if frontend_url:
            origins.append(frontend_url)
            logger.info(f"Added production frontend URL: {frontend_url}")

        # Fallback: allow App Runner domain pattern
        origins.extend(
            ["https://*.us-east-1.awsapprunner.com", "https://*.awsapprunner.com"]
        )

        return origins
    else:
        # Development origins
        return [
            "http://localhost:3000",
            "http://localhost:5173",  # Vite dev server
            "http://127.0.0.1:3000",
            "http://localhost:8080",  # Alternative dev port
        ]


@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Historic Events Backend Starting...")
    logger.info(f"Environment: {os.getenv('ENVIRONMENT', 'unknown')}")
    logger.info(f"OpenAI configured: {bool(os.getenv('OPENAI_API_KEY'))}")
    logger.info(f"Gemini configured: {bool(os.getenv('GEMINI_API_KEY'))}")
    logger.info(f"Python path: {os.getenv('PYTHONPATH', 'not set')}")
    logger.info("Starting server on 0.0.0.0:8080")
    logger.info("✅ FastAPI startup complete - ready for requests")


# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])


@app.get("/")
def read_root():
    return {"message": "AI Chat API"}
