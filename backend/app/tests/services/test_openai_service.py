import pytest
from unittest.mock import Mock, patch
import openai
from app.services.openai_service import OpenAIService


class TestOpenAIService:
    """Basic test suite for OpenAIService class."""

    def test_init(self):
        """Test OpenAIService initialization."""
        api_key = "test-api-key"
        service = OpenAIService(api_key)
        assert service.client is not None

    @pytest.mark.asyncio
    async def test_chat_completion_success(self):
        """Test successful chat completion."""
        # Setup
        service = OpenAIService("test-key")
        messages = [{"role": "user", "content": "Hello"}]

        # Mock response
        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = "Hello there!"

        with patch.object(
            service.client.chat.completions, "create", return_value=mock_response
        ):
            result = await service.chat_completion(messages)

        assert result == "Hello there!"

    @pytest.mark.asyncio
    async def test_chat_completion_with_parameters(self):
        """Test chat completion with custom parameters."""
        service = OpenAIService("test-key")
        messages = [{"role": "user", "content": "Hello"}]

        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = "Response"

        with patch.object(
            service.client.chat.completions, "create", return_value=mock_response
        ) as mock_create:
            await service.chat_completion(
                messages=messages, model="gpt-4", temperature=0.5, max_tokens=100
            )

            mock_create.assert_called_once_with(
                model="gpt-4", messages=messages, temperature=0.5, max_tokens=100
            )

    @pytest.mark.asyncio
    async def test_chat_completion_empty_content(self):
        """Test handling of empty content response."""
        service = OpenAIService("test-key")
        messages = [{"role": "user", "content": "Hello"}]

        mock_response = Mock()
        mock_response.choices = [Mock()]
        mock_response.choices[0].message.content = None

        with patch.object(
            service.client.chat.completions, "create", return_value=mock_response
        ):
            result = await service.chat_completion(messages)

        assert result == ""

    @pytest.mark.asyncio
    async def test_chat_completion_generic_error(self):
        """Test handling of generic errors."""
        service = OpenAIService("test-key")
        messages = [{"role": "user", "content": "Hello"}]

        with patch.object(
            service.client.chat.completions,
            "create",
            side_effect=Exception("Generic error"),
        ):
            with pytest.raises(Exception, match="OpenAI service error"):
                await service.chat_completion(messages)
