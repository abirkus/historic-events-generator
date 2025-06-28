from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import chat
from .config import get_settings

app = FastAPI(
    title="AI Chat API", description="AI-powered historic events API", version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])


@app.get("/")
def read_root():
    return {"message": "AI Chat API"}
