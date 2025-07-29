import pytest
import json
from unittest.mock import MagicMock, patch, AsyncMock
from app.services.gemini_service import GeminiService


@pytest.fixture
def gemini_service():
    # Patch the genai.Client to avoid real API calls
    with patch("app.services.gemini_service.genai.Client") as MockClient:
        mock_client = MockClient.return_value
        mock_client.aio = MagicMock()
        return GeminiService(api_key="fake-api-key")


def test_clean_gemini_response_removes_markdown_and_valid_json(gemini_service):
    response = '```json\n[{"event": "test"}]\n```'
    cleaned = gemini_service.clean_gemini_response(response)
    assert json.loads(cleaned) == [{"event": "test"}]


def test_clean_gemini_response_handles_non_json(gemini_service):
    response = "Some random text"
    cleaned = gemini_service.clean_gemini_response(response)
    assert cleaned == "Some random text"


def test_clean_gemini_response_extracts_json_array(gemini_service):
    response = 'Here is your data: [{"event": "test2"}]'
    cleaned = gemini_service.clean_gemini_response(response)
    assert json.loads(cleaned) == [{"event": "test2"}]


def test_clean_gemini_response_invalid_json_returns_original(gemini_service):
    response = "```json\n[invalid json]\n```"
    cleaned = gemini_service.clean_gemini_response(response)
    assert cleaned == "[invalid json]"


def test_clean_gemini_response_empty_string(gemini_service):
    assert gemini_service.clean_gemini_response("") == ""


def test_convert_messages_to_genai_format_single(gemini_service):
    messages = [{"role": "user", "content": "Hello"}]
    result = gemini_service._convert_messages_to_genai_format(messages)
    assert result == "Hello"


def test_convert_messages_to_genai_format_multiple(gemini_service):
    messages = [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi there!"},
    ]
    result = gemini_service._convert_messages_to_genai_format(messages)
    assert result == "Hello\nHi there!"


@pytest.mark.asyncio
async def test_chat_completion_success(gemini_service):
    # Patch the aio.models.generate_content method
    mock_response = MagicMock()
    mock_response.text = '```json\n[{"event": "test3"}]\n```'
    gemini_service.client.aio.models.generate_content = AsyncMock(
        return_value=mock_response
    )

    messages = [{"role": "user", "content": "Tell me an event"}]
    result = await gemini_service.chat_completion(messages)
    assert json.loads(result) == [{"event": "test3"}]


@pytest.mark.asyncio
async def test_chat_completion_exception(gemini_service):
    gemini_service.client.aio.models.generate_content = AsyncMock(
        side_effect=Exception("API error")
    )
    messages = [{"role": "user", "content": "Test"}]
    with pytest.raises(Exception) as excinfo:
        await gemini_service.chat_completion(messages)
    assert "Gemini API error" in str(excinfo.value)
