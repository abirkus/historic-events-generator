import logging
from typing import List, Dict, Optional
import openai
from .ai_service import AIService

logger = logging.getLogger(__name__)


class OpenAIService(AIService):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = "gpt-4o-mini",
        temperature: Optional[float] = 0.7,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        Get a chat completion from OpenAI.
        """
        try:
            request_params = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
            }

            if max_tokens is not None:
                request_params["max_tokens"] = max_tokens

            logger.info(f"Sending request to OpenAI with model: {model}")
            logger.debug(f"Request params: {request_params}")

            response = self.client.chat.completions.create(**request_params)

            content = response.choices[0].message.content

            if not content:
                logger.warning("OpenAI returned empty content")
                return ""

            logger.info(f"OpenAI response received: {len(content)} characters")

            return content

        except openai.APIError as e:
            logger.error(f"OpenAI API error: {e}")
            raise Exception(f"OpenAI API error: {e}")
        except openai.RateLimitError as e:
            logger.error(f"OpenAI rate limit error: {e}")
            raise Exception(f"OpenAI rate limit exceeded: {e}")
        except openai.AuthenticationError as e:
            logger.error(f"OpenAI authentication error: {e}")
            raise Exception(f"OpenAI authentication failed: {e}")
        except Exception as e:
            logger.error(f"Unexpected OpenAI error: {e}")
            raise Exception(f"OpenAI service error: {e}")
