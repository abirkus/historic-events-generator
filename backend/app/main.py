from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import chat
from .config import get_settings
import os

app = FastAPI(
    title="AI Chat API", description="AI-powered historic events API", version="1.0.0"
)


def get_cors_origins():
    environment = os.getenv("ENVIRONMENT", "production")

    if environment == "production":
        # Get allowed origins from environment variable
        origins_env = os.getenv("ALLOWED_ORIGINS", "")
        if origins_env:
            origins = [origin.strip() for origin in origins_env.split(",")]
        else:
            # Fallback defaults
            origins = ["https://www.historicevents.ai", "https://historicevents.ai"]

        return origins
    else:
        return [
            "http://localhost:3000",
            "http://localhost:5173",
            "http://127.0.0.1:3000",
            "http://localhost:8080",
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
