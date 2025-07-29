"""
Provider utilities for handling different AI service providers.
Contains provider configurations and message normalization logic.
"""

import logging
from typing import List, Dict, Any, Optional
from fastapi import HTTPException

logger = logging.getLogger(__name__)

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


def get_provider_config(provider: str) -> Dict[str, Any]:
    """
    Get configuration for a specific provider.

    Args:
        provider: The AI provider name

    Returns:
        Provider configuration dictionary

    Raises:
        ValueError: If provider is not supported
    """
    provider = provider.lower()
    if provider not in PROVIDER_CONFIG:
        raise ValueError(f"Unsupported provider: {provider}")
    return PROVIDER_CONFIG[provider]


def get_supported_providers() -> List[str]:
    """
    Get list of all supported providers.

    Returns:
        List of supported provider names
    """
    return list(PROVIDER_CONFIG.keys())


def validate_provider_request(
    provider: str, model: Optional[str], temperature: float
) -> None:
    """
    Validate request parameters for the specific provider.

    Args:
        provider: The AI provider name
        model: Optional model name to validate
        temperature: Temperature value to validate

    Raises:
        HTTPException: If validation fails
    """
    try:
        config = get_provider_config(provider)
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=f"{str(e)}. Supported providers: {get_supported_providers()}",
        )

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


def normalize_messages_for_provider(
    messages: List[Dict[str, str]], provider: str
) -> List[Dict[str, str]]:
    """
    Normalize message format for different providers.
    Handles role mapping and custom roles.

    Args:
        messages: List of message dictionaries with 'role' and 'content' keys
        provider: The target AI provider name

    Returns:
        List of normalized message dictionaries
    """
    provider = provider.lower()

    if provider == "gemini":
        return _normalize_messages_for_gemini(messages)
    elif provider == "openai":
        return _normalize_messages_for_openai(messages)
    else:
        # For other providers, return as-is with warning
        logger.warning(
            f"Unknown provider '{provider}', returning messages without normalization"
        )
        return messages


def _normalize_messages_for_gemini(
    messages: List[Dict[str, str]],
) -> List[Dict[str, str]]:
    """
    Normalize messages for Gemini provider.
    Converts OpenAI format to Gemini format.

    Args:
        messages: List of message dictionaries

    Returns:
        List of Gemini-compatible message dictionaries
    """
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


def _normalize_messages_for_openai(
    messages: List[Dict[str, str]],
) -> List[Dict[str, str]]:
    """
    Normalize messages for OpenAI provider.
    Validates roles and handles custom roles.

    Args:
        messages: List of message dictionaries

    Returns:
        List of OpenAI-compatible message dictionaries
    """
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


def get_provider_from_service_name(service_class_name: str) -> str:
    """
    Extract provider name from service class name.

    Args:
        service_class_name: Name of the service class (e.g., "OpenAIService")

    Returns:
        Provider name in lowercase (e.g., "openai")
    """
    return service_class_name.replace("Service", "").lower()


def is_provider_supported(provider: str) -> bool:
    """
    Check if a provider is supported.

    Args:
        provider: Provider name to check

    Returns:
        True if provider is supported, False otherwise
    """
    return provider.lower() in PROVIDER_CONFIG


def get_default_model_for_provider(provider: str) -> str:
    """
    Get the default model for a provider.

    Args:
        provider: Provider name

    Returns:
        Default model name for the provider

    Raises:
        ValueError: If provider is not supported
    """
    config = get_provider_config(provider)
    return config["default_models"][0]


def get_supported_models_for_provider(provider: str) -> List[str]:
    """
    Get all supported models for a provider.

    Args:
        provider: Provider name

    Returns:
        List of supported model names

    Raises:
        ValueError: If provider is not supported
    """
    config = get_provider_config(provider)
    return config["default_models"]
