import re
import json
import logging
from typing import List, Dict, Optional
import google.generativeai as genai
from .ai_service import AIService

logger = logging.getLogger(__name__)


class GeminiService(AIService):
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.client = genai

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
        model: Optional[str] = "gemini-2.0-flash",
        temperature: Optional[float] = 0.7,
        max_tokens: Optional[int] = None,
    ) -> str:
        """
        Get a chat completion from Gemini with response cleanup.
        """
        try:
            # Convert OpenAI format to Gemini format
            gemini_messages = self._convert_messages_to_gemini_format(messages)

            # Configure generation parameters
            generation_config = {
                "temperature": min(temperature, 1.0),  # Gemini max is 1.0
            }

            if max_tokens:
                generation_config["max_output_tokens"] = max_tokens

            # Initialize the model
            model_instance = genai.GenerativeModel(
                model_name=model, generation_config=generation_config
            )

            # Start chat with history (all messages except the last one)
            chat_history = gemini_messages[:-1] if len(gemini_messages) > 1 else []
            chat = model_instance.start_chat(history=chat_history)

            # Send the last message
            last_message = (
                gemini_messages[-1]["parts"][0]["text"] if gemini_messages else ""
            )

            logger.info(f"Sending message to Gemini: {last_message[:100]}...")

            response = chat.send_message(last_message)
            raw_response = response.text

            logger.info(f"Raw Gemini response: {raw_response[:200]}...")

            # Clean the response
            cleaned_response = self.clean_gemini_response(raw_response)

            logger.info(f"Cleaned Gemini response: {cleaned_response[:200]}...")

            return cleaned_response

        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            raise Exception(f"Gemini API error: {str(e)}")

    def _convert_messages_to_gemini_format(
        self, messages: List[Dict[str, str]]
    ) -> List[Dict]:
        """
        Convert messages to Gemini's expected format.
        """
        gemini_messages = []

        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            gemini_messages.append({"role": role, "parts": [{"text": msg["content"]}]})

        return gemini_messages
