import pytest
from fastapi import HTTPException
from app.utils import provider_utils


def test_get_provider_config_valid():
    config = provider_utils.get_provider_config("openai")
    assert isinstance(config, dict)
    assert "default_models" in config
    assert config["default_models"] == ["gpt-4o-mini"]


def test_get_provider_config_invalid():
    with pytest.raises(ValueError):
        provider_utils.get_provider_config("invalid_provider")


def test_get_supported_providers():
    providers = provider_utils.get_supported_providers()
    assert "openai" in providers
    assert "gemini" in providers


def test_validate_provider_request_valid():
    # Should not raise
    provider_utils.validate_provider_request("openai", "gpt-4o-mini", 1.0)


def test_validate_provider_request_invalid_provider():
    with pytest.raises(HTTPException) as exc:
        provider_utils.validate_provider_request("invalid", None, 1.0)
    assert exc.value.status_code == 400


def test_validate_provider_request_invalid_temperature():
    with pytest.raises(HTTPException) as exc:
        provider_utils.validate_provider_request("openai", None, 3.0)
    assert "exceeds maximum" in exc.value.detail


def test_validate_provider_request_invalid_model_warns(caplog):
    provider_utils.validate_provider_request("openai", "unknown-model", 1.0)
    assert "Model unknown-model not in default models" in caplog.text


def test_normalize_messages_for_provider_openai():
    messages = [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi"},
        {"role": "custom", "content": "Custom message"},
    ]
    norm = provider_utils.normalize_messages_for_provider(messages, "openai")
    assert norm[0]["role"] == "user"
    assert norm[1]["role"] == "assistant"
    assert norm[2]["role"] == "user"
    assert "[Custom]:" in norm[2]["content"]


def test_normalize_messages_for_provider_gemini():
    messages = [
        {"role": "system", "content": "System info"},
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi"},
        {"role": "tool", "content": "Tool message"},
    ]
    norm = provider_utils.normalize_messages_for_provider(messages, "gemini")
    assert norm[0]["role"] == "user"
    assert "System: System info" in norm[0]["content"]
    assert norm[1]["role"] == "user"
    assert norm[2]["role"] == "model"
    assert norm[3]["role"] == "user"
    assert "[Tool]:" in norm[3]["content"]


def test_normalize_messages_for_provider_unknown(caplog):
    messages = [{"role": "user", "content": "Hello"}]
    norm = provider_utils.normalize_messages_for_provider(messages, "unknown")
    assert norm == messages
    assert "Unknown provider" in caplog.text


def test_get_provider_from_service_name():
    assert provider_utils.get_provider_from_service_name("OpenAIService") == "openai"
    assert provider_utils.get_provider_from_service_name("GeminiService") == "gemini"


def test_is_provider_supported():
    assert provider_utils.is_provider_supported("openai")
    assert not provider_utils.is_provider_supported("unknown")


def test_get_default_model_for_provider():
    assert provider_utils.get_default_model_for_provider("openai") == "gpt-4o-mini"
    assert provider_utils.get_default_model_for_provider("gemini") == "gemini-2.0-flash"
    with pytest.raises(ValueError):
        provider_utils.get_default_model_for_provider("unknown")


def test_get_supported_models_for_provider():
    assert provider_utils.get_supported_models_for_provider("openai") == ["gpt-4o-mini"]
    assert provider_utils.get_supported_models_for_provider("gemini") == [
        "gemini-2.0-flash"
    ]
    with pytest.raises(ValueError):
        provider_utils.get_supported_models_for_provider("unknown")
