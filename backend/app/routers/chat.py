from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import os
import logging

from ..services import get_ai_service, AIService
from ..services.utils.response_cleanup import clean_ai_response
from ..config import get_settings

router = APIRouter()
logger = logging.getLogger(__name__)


class ChatMessage(BaseModel):
    role: str = Field(
        ..., description="Role of the message sender (user, assistant, system)"
    )
    content: str = Field(..., description="Content of the message")


class ChatRequest(BaseModel):
    messages: List[ChatMessage] = Field(..., description="List of chat messages")
    model: Optional[str] = Field(
        None, description="Specific model to use (e.g., gpt-4, gemini-pro)"
    )
    temperature: Optional[float] = Field(
        0.7, ge=0.0, le=2.0, description="Sampling temperature"
    )
    max_tokens: Optional[int] = Field(
        None, ge=1, description="Maximum number of tokens to generate"
    )
    provider: Optional[str] = Field(
        None, description="AI provider to use (openai, gemini)"
    )


class ChatResponse(BaseModel):
    response: str = Field(..., description="Generated response from the AI")
    provider: str = Field(..., description="Provider that generated the response")
    model: Optional[str] = Field(None, description="Specific model used")
    usage: Optional[Dict[str, Any]] = Field(
        None, description="Token usage information if available"
    )


class ErrorResponse(BaseModel):
    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Additional error details")
    provider: Optional[str] = Field(None, description="Provider that caused the error")


# Provider configuration mapping
PROVIDER_CONFIG = {
    "openai": {
        "default_models": ["gpt-4o-mini"],
        "supported_roles": ["system", "user", "assistant", "function", "tool"],
        "max_temperature": 2.0,
    },
    "gemini": {
        "default_models": ["gemini-2.0-flash"],
        "supported_roles": [
            "user",
            "model",
        ],  # Gemini uses 'model' instead of 'assistant'
        "max_temperature": 1.0,
    },
}


def normalize_messages_for_provider(
    messages: List[Dict[str, str]], provider: str
) -> List[Dict[str, str]]:
    """
    Normalize message format for different providers.
    Handles role mapping and custom roles.
    """
    if provider.lower() == "gemini":
        # Convert OpenAI format to Gemini format
        normalized = []
        for msg in messages:
            role = msg["role"]
            content = msg["content"]

            # Map roles for Gemini
            if role in ["assistant", "model"]:
                role = "model"
            elif role == "system":
                # Gemini doesn't have system role, prepend to first user message
                if normalized and normalized[-1]["role"] == "user":
                    normalized[-1][
                        "content"
                    ] = f"System: {content}\n\n{normalized[-1]['content']}"
                else:
                    normalized.append({"role": "user", "content": f"System: {content}"})
                continue
            elif role == "user":
                role = "user"
            else:
                # Handle custom roles (developer, function, tool, etc.)
                # For Gemini, treat custom roles as user messages with role prefix
                logger.warning(
                    f"Custom role '{role}' converted to 'user' for Gemini provider"
                )
                normalized.append(
                    {"role": "user", "content": f"[{role.title()}]: {content}"}
                )
                continue

            normalized.append({"role": role, "content": content})
        return normalized

    elif provider.lower() == "openai":
        # OpenAI supports more roles but validate them
        normalized = []
        valid_openai_roles = ["system", "user", "assistant", "function", "tool"]

        for msg in messages:
            role = msg["role"]
            content = msg["content"]

            if role not in valid_openai_roles:
                # Handle custom roles for OpenAI
                logger.warning(
                    f"Custom role '{role}' converted to 'user' for OpenAI provider"
                )
                normalized.append(
                    {"role": "user", "content": f"[{role.title()}]: {content}"}
                )
            else:
                normalized.append({"role": role, "content": content})

        return normalized

    # For other providers, return as-is with warning
    logger.warning(
        f"Unknown provider '{provider}', returning messages without normalization"
    )
    return messages


def validate_provider_request(
    provider: str, model: Optional[str], temperature: float
) -> None:
    """
    Validate request parameters for the specific provider.
    """
    if provider not in PROVIDER_CONFIG:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported provider: {provider}. Supported providers: {list(PROVIDER_CONFIG.keys())}",
        )

    config = PROVIDER_CONFIG[provider]

    # Validate temperature
    if temperature > config["max_temperature"]:
        raise HTTPException(
            status_code=400,
            detail=f"Temperature {temperature} exceeds maximum {config['max_temperature']} for {provider}",
        )

    # Validate model if specified
    if model and model not in config["default_models"]:
        logger.warning(
            f"Model {model} not in default models for {provider}: {config['default_models']}"
        )


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


@router.get("/models", response_model=List[str])
async def get_available_providers():
    """
    Get the list of available AI providers.
    """
    settings = get_settings()
    available_providers = []

    # Check which providers have API keys configured
    if settings.openai_api_key:
        available_providers.append("openai")
    if settings.gemini_api_key:
        available_providers.append("gemini")

    if not available_providers:
        raise HTTPException(
            status_code=503, detail="No AI providers are currently configured"
        )

    return available_providers


@router.get("/models/{provider}", response_model=List[str])
async def get_provider_models(provider: str):
    """
    Get the list of available models for a specific provider.
    """
    provider = provider.lower()

    if provider not in PROVIDER_CONFIG:
        raise HTTPException(status_code=404, detail=f"Provider {provider} not found")

    return PROVIDER_CONFIG[provider]["default_models"]


@router.post(
    "/chat",
    response_model=ChatResponse,
    responses={400: {"model": ErrorResponse}, 500: {"model": ErrorResponse}},
)
async def chat(request: ChatRequest, service: AIService = Depends(get_service)):
    """
    Generate a chat completion using the specified AI provider.
    Supports both OpenAI and Gemini API formats.
    """
    try:
        # Get provider from service class name
        provider_name = service.__class__.__name__.replace("Service", "").lower()

        # Convert pydantic models to dictionaries
        messages = [
            {"role": msg.role, "content": msg.content} for msg in request.messages
        ]

        # Normalize messages for the specific provider
        normalized_messages = normalize_messages_for_provider(messages, provider_name)

        logger.info(
            f"Sending request to {provider_name} with {len(normalized_messages)} messages"
        )

        # Prepare service parameters
        service_params = {
            "messages": normalized_messages,
            "temperature": request.temperature,
        }

        # Add model if specified
        if request.model:
            service_params["model"] = request.model

        # Add max_tokens if specified
        if request.max_tokens:
            service_params["max_tokens"] = request.max_tokens

        # Use the service to get a response
        response_text = await service.chat_completion(**service_params)

        cleaned_response = clean_ai_response(response_text, provider_name)

        logger.info(
            f"Received response from {provider_name}: {len(cleaned_response)} characters"
        )
        logger.debug(f"Cleaned response preview: {cleaned_response[:200]}...")

        return ChatResponse(
            response=cleaned_response,
            provider=provider_name,
            model=request.model,
            # Note: Usage information would need to be implemented in the service layer
            usage=None,
        )

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Chat completion error: {str(e)}", exc_info=True)
        provider_name = (
            getattr(service, "__class__", type(service))
            .__name__.replace("Service", "")
            .lower()
        )
        raise HTTPException(
            status_code=500, detail=f"AI API error from {provider_name}: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Health check endpoint to verify the router is working.
    """
    settings = get_settings()

    provider_status = {
        "openai": bool(settings.openai_api_key),
        "gemini": bool(settings.gemini_api_key),
    }

    return {
        "status": "healthy",
        "providers_configured": provider_status,
        "default_provider": settings.default_ai_provider,
    }
