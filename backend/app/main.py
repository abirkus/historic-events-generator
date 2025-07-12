from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import chat
from .config import get_settings
import os

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
