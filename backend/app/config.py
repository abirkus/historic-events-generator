from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

# When creating a Settings instance,
# pydantic-settings will automatically check for environment variables
# that match our settings field names (case-insensitive).


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="allow",  # Allow extra fields that aren't defined in the model
    )

    default_ai_provider: str = "openai"
    openai_api_key: str = ""
    gemini_api_key: str = ""


# The @lru_cache() decorator is a nice optimization
# that ensures get_settings() only creates the Settings object once,
# rather than every time it's called.


@lru_cache()
def get_settings():
    return Settings()
