from fastapi import HTTPException, logger
from ..config import get_settings
from ..models.chat import ChatRequest
from ..utils.provider_utils import validate_provider_request
from .ai_service import AIService
from .openai_service import OpenAIService
from .gemini_service import GeminiService


def get_ai_service(provider: str, api_key: str) -> AIService:
    """Factory function to get the appropriate AI service"""
    if provider.lower() == "openai":
        return OpenAIService(api_key)
    elif provider.lower() == "gemini":
        return GeminiService(api_key)
    else:
        raise ValueError(f"Unknown AI provider: {provider}")


async def get_service(request: ChatRequest) -> AIService:
    """
    Get the appropriate AI service based on the request.
    """
    settings = get_settings()

    # Determine provider
    provider = (
        request.provider.lower()
        if request.provider
        else settings.default_ai_provider.lower()
    )

    # Validate the request for this provider
    validate_provider_request(provider, request.model, request.temperature)

    # Get the appropriate API key
    if provider == "openai":
        api_key = settings.openai_api_key
    elif provider == "gemini":
        api_key = settings.gemini_api_key
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")

    if not api_key:
        raise HTTPException(
            status_code=500, detail=f"{provider.upper()}_API_KEY not configured"
        )

    try:
        return get_ai_service(provider, api_key)
    except Exception as e:
        logger.error(f"Failed to initialize {provider} service: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"Failed to initialize {provider} service: {str(e)}"
        )
