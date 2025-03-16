from .ai_service import AIService
from typing import List, Dict, Optional
import google.generativeai as genai


class GeminiService(AIService):
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = "gemini-pro",
        temperature: Optional[float] = 0.7,
    ) -> str:
        # Convert OpenAI format to Gemini format
        gemini_messages = []
        for msg in messages:
            role = "user" if msg["role"] == "user" else "model"
            gemini_messages.append({"role": role, "parts": [{"text": msg["content"]}]})

        model = genai.GenerativeModel(model_name=model)
        chat = model.start_chat(history=gemini_messages)
        response = chat.send_message(
            gemini_messages[-1]["parts"][0]["text"],
            generation_config={"temperature": temperature},
        )
        return response.text
