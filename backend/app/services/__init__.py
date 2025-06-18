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
