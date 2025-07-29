"""
Tests for app/services/__init__.py
Tests the service factory functions.
"""

import pytest
from unittest.mock import patch, Mock
from fastapi import HTTPException

from app.services import get_ai_service, get_service
from app.services.ai_service import AIService
from app.models.chat import ChatRequest, ChatMessage


class TestGetAIService:
    """Test the basic AI service factory function."""

    def test_get_ai_service_openai(self):
        """Test creating OpenAI service."""
        service = get_ai_service("openai", "test-key")
        assert service.__class__.__name__ == "OpenAIService"
        assert isinstance(service, AIService)

    def test_get_ai_service_gemini(self):
        """Test creating Gemini service."""
        service = get_ai_service("gemini", "test-key")
        assert service.__class__.__name__ == "GeminiService"
        assert isinstance(service, AIService)

    def test_get_ai_service_case_insensitive(self):
        """Test that provider names are case insensitive."""
        service1 = get_ai_service("OPENAI", "test-key")
        service2 = get_ai_service("OpenAI", "test-key")
        service3 = get_ai_service("openai", "test-key")

        assert all(
            s.__class__.__name__ == "OpenAIService"
            for s in [service1, service2, service3]
        )

    def test_get_ai_service_invalid_provider(self):
        """Test error handling for invalid provider."""
        with pytest.raises(ValueError, match="Unknown AI provider: invalid"):
            get_ai_service("invalid", "test-key")


class TestGetService:
    """Test the request-based service factory function."""

    @pytest.fixture
    def mock_settings(self):
        """Mock settings fixture."""
        settings = Mock()
        settings.default_ai_provider = "openai"
        settings.openai_api_key = "test-openai-key"
        settings.gemini_api_key = "test-gemini-key"
        return settings

    @pytest.fixture
    def sample_request(self):
        """Sample chat request fixture."""
        return ChatRequest(
            messages=[ChatMessage(role="user", content="Hello")],
            provider="openai",
            model="gpt-4",
            temperature=0.7,
        )

    @pytest.fixture
    def sample_request_no_provider(self):
        """Sample chat request without provider specified."""
        return ChatRequest(
            messages=[ChatMessage(role="user", content="Hello")], temperature=0.7
        )

    @pytest.mark.asyncio
    async def test_get_service_with_provider(self, mock_settings, sample_request):
        """Test getting service with explicit provider."""
        with patch("app.services.get_settings", return_value=mock_settings):
            with patch("app.services.validate_provider_request") as mock_validate:
                with patch("app.services.get_ai_service") as mock_get_service:
                    mock_service = Mock()
                    mock_get_service.return_value = mock_service

                    result = await get_service(sample_request)

                    mock_validate.assert_called_once_with("openai", "gpt-4", 0.7)
                    mock_get_service.assert_called_once_with(
                        "openai", "test-openai-key"
                    )
                    assert result == mock_service

    @pytest.mark.asyncio
    async def test_get_service_default_provider(
        self, mock_settings, sample_request_no_provider
    ):
        """Test getting service with default provider."""
        with patch("app.services.get_settings", return_value=mock_settings):
            with patch("app.services.validate_provider_request") as mock_validate:
                with patch("app.services.get_ai_service") as mock_get_service:
                    mock_service = Mock()
                    mock_get_service.return_value = mock_service

                    result = await get_service(sample_request_no_provider)

                    mock_validate.assert_called_once_with("openai", None, 0.7)
                    mock_get_service.assert_called_once_with(
                        "openai", "test-openai-key"
                    )
                    assert result == mock_service

    @pytest.mark.asyncio
    async def test_get_service_gemini_provider(self, mock_settings):
        """Test getting Gemini service."""
        request = ChatRequest(
            messages=[ChatMessage(role="user", content="Hello")],
            provider="gemini",
            temperature=0.5,
        )

        with patch("app.services.get_settings", return_value=mock_settings):
            with patch("app.services.validate_provider_request"):
                with patch("app.services.get_ai_service") as mock_get_service:
                    mock_service = Mock()
                    mock_get_service.return_value = mock_service

                    result = await get_service(request)

                    mock_get_service.assert_called_once_with(
                        "gemini", "test-gemini-key"
                    )
                    assert result == mock_service

    @pytest.mark.asyncio
    async def test_get_service_validation_error(self, mock_settings, sample_request):
        """Test handling of validation errors."""
        with patch("app.services.get_settings", return_value=mock_settings):
            with patch(
                "app.services.validate_provider_request",
                side_effect=HTTPException(
                    status_code=400, detail="Invalid temperature"
                ),
            ):
                with pytest.raises(HTTPException) as exc_info:
                    await get_service(sample_request)

                assert exc_info.value.status_code == 400
                assert "Invalid temperature" in str(exc_info.value.detail)

    @pytest.mark.asyncio
    async def test_get_service_unsupported_provider(self, mock_settings):
        """Test handling of unsupported provider."""
        request = ChatRequest(
            messages=[ChatMessage(role="user", content="Hello")],
            provider="unsupported",
            temperature=0.7,
        )

        with patch("app.services.get_settings", return_value=mock_settings):
            with patch("app.services.validate_provider_request"):
                with pytest.raises(HTTPException) as exc_info:
                    await get_service(request)

                assert exc_info.value.status_code == 400
                assert "Unsupported provider: unsupported" in str(exc_info.value.detail)

    @pytest.mark.asyncio
    async def test_get_service_missing_openai_api_key(
        self, mock_settings, sample_request
    ):
        """Test handling of missing OpenAI API key."""
        mock_settings.openai_api_key = None

        with patch("app.services.get_settings", return_value=mock_settings):
            with patch("app.services.validate_provider_request"):
                with pytest.raises(HTTPException) as exc_info:
                    await get_service(sample_request)

                assert exc_info.value.status_code == 500
                assert "OPENAI_API_KEY not configured" in str(exc_info.value.detail)

    @pytest.mark.asyncio
    async def test_get_service_missing_gemini_api_key(self, mock_settings):
        """Test handling of missing Gemini API key."""
        mock_settings.gemini_api_key = None
        request = ChatRequest(
            messages=[ChatMessage(role="user", content="Hello")],
            provider="gemini",
            temperature=0.7,
        )

        with patch("app.services.get_settings", return_value=mock_settings):
            with patch("app.services.validate_provider_request"):
                with pytest.raises(HTTPException) as exc_info:
                    await get_service(request)

                assert exc_info.value.status_code == 500
                assert "GEMINI_API_KEY not configured" in str(exc_info.value.detail)

    @pytest.mark.asyncio
    async def test_get_service_initialization_error(
        self, mock_settings, sample_request
    ):
        """Test handling of service initialization errors."""
        with patch("app.services.get_settings", return_value=mock_settings):
            with patch("app.services.validate_provider_request"):
                with patch(
                    "app.services.get_ai_service",
                    side_effect=Exception("Service initialization failed"),
                ):
                    with patch("app.services.logger") as mock_logger:
                        with pytest.raises(HTTPException) as exc_info:
                            await get_service(sample_request)

                        assert exc_info.value.status_code == 500
                        assert "Failed to initialize openai service" in str(
                            exc_info.value.detail
                        )
                        mock_logger.error.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_service_case_insensitive_provider(self, mock_settings):
        """Test that provider names are case insensitive."""
        request = ChatRequest(
            messages=[ChatMessage(role="user", content="Hello")],
            provider="OPENAI",
            temperature=0.7,
        )

        with patch("app.services.get_settings", return_value=mock_settings):
            with patch("app.services.validate_provider_request") as mock_validate:
                with patch("app.services.get_ai_service") as mock_get_service:
                    mock_service = Mock()
                    mock_get_service.return_value = mock_service

                    result = await get_service(request)

                    mock_validate.assert_called_once_with("openai", None, 0.7)
                    mock_get_service.assert_called_once_with(
                        "openai", "test-openai-key"
                    )
                    assert result == mock_service
