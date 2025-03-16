from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os

from ..services import get_ai_service, AIService
from ..config import get_settings

router = APIRouter()


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None
    temperature: Optional[float] = 0.7
    provider: Optional[str] = None  # Allow overriding default provider


class ChatResponse(BaseModel):
    response: str
    provider: str


# Dependency to get the AI service
async def get_service(request: ChatRequest = None) -> AIService:
    settings = get_settings()

    # Determine provider - from request, env var, or default
    provider = (
        request.provider
        if request and request.provider
        else os.getenv("DEFAULT_AI_PROVIDER", "openai")
    )

    # Get the appropriate API key
    if provider.lower() == "openai":
        api_key = os.getenv("OPENAI_API_KEY")
    elif provider.lower() == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")

    if not api_key:
        raise HTTPException(
            status_code=500, detail=f"{provider.upper()}_API_KEY not configured"
        )

    return get_ai_service(provider, api_key)


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, service: AIService = Depends(get_service)):
    try:
        # Convert pydantic models to dictionaries
        messages = [
            {"role": msg.role, "content": msg.content} for msg in request.messages
        ]

        # Use the service to get a response
        response_text = await service.chat_completion(
            messages=messages, model=request.model, temperature=request.temperature
        )

        return ChatResponse(
            response=response_text,
            provider=service.__class__.__name__.replace("Service", ""),
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI API error: {str(e)}")
