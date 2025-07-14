import re
import json
import logging
from typing import List, Dict, Optional
from google import genai
from google.genai import types
from .ai_service import AIService

logger = logging.getLogger(__name__)


class GeminiService(AIService):
    def __init__(self, api_key: str):
        # Create client with the new Google GenAI SDK
        self.client = genai.Client(api_key=api_key)

    def clean_gemini_response(self, response_text: str) -> str:
        """
        Clean Gemini response by removing markdown code blocks and other formatting.
        """
        if not response_text:
            return response_text

        # Remove markdown code blocks (```json, ```, etc.)
        # Pattern matches: ```json, ```JSON, ```, or any ```language
        response_text = re.sub(r"```(?:json|JSON)?\n?", "", response_text)
        response_text = re.sub(r"```\n?", "", response_text)

        # Remove any leading/trailing whitespace
        response_text = response_text.strip()

        # Try to extract JSON if it's wrapped in other text
        json_match = re.search(r"(\[.*\])", response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(1)

        # Validate that it's proper JSON
        try:
            parsed = json.loads(response_text)
            # If it's valid JSON, return the cleaned version
            return json.dumps(parsed, ensure_ascii=False)
        except json.JSONDecodeError as e:
            logger.warning(f"Response is not valid JSON after cleaning: {e}")
            logger.warning(f"Cleaned response: {response_text[:200]}...")

            # Fallback: try to extract array-like content
            if response_text.startswith("[") and response_text.endswith("]"):
                return response_text

            # Last resort: return original response
            logger.error("Could not clean Gemini response, returning original")
            return response_text

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = "gemini-2.0-flash-001",  # Updated model name for new SDK
        temperature: Optional[float] = 0.7,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        Get a chat completion from Gemini with response cleanup using the new GenAI SDK.
        """
        try:
            # Convert OpenAI format to new GenAI SDK format
            contents = self._convert_messages_to_genai_format(messages)

            # Configure generation parameters
            config_params = {
                "temperature": min(temperature, 1.0),  # Gemini max is 1.0
            }

            if max_tokens:
                config_params["max_output_tokens"] = max_tokens

            config = types.GenerateContentConfig(**config_params)

            logger.info(f"Sending message to Gemini: {str(contents)[:100]}...")

            # Generate content using the new SDK
            response = await self.client.aio.models.generate_content(
                model=model, contents=contents, config=config
            )

            raw_response = response.text

            logger.info(f"Raw Gemini response: {raw_response[:200]}...")

            # Clean the response
            cleaned_response = self.clean_gemini_response(raw_response)

            logger.info(f"Cleaned Gemini response: {cleaned_response[:200]}...")

            return cleaned_response

        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise Exception(f"Gemini API error: {str(e)}")

    def _convert_messages_to_genai_format(
        self, messages: List[Dict[str, str]]
    ) -> List[str]:
        """
        Convert messages to the new GenAI SDK format.
        The new SDK expects a simpler format - just the content strings.
        """
        contents = []

        for msg in messages:
            # For the new SDK, we can just use the content directly
            # The SDK handles the conversation flow automatically
            contents.append(msg["content"])

        # For multi-turn conversations, we join the messages
        # The SDK will handle the conversation context automatically
        return (
            "\n".join(contents)
            if len(contents) > 1
            else contents[0] if contents else ""
        )
