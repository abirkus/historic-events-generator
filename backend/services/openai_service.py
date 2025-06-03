from .ai_service import AIService
from typing import List, Dict, Optional
import openai


class OpenAIService(AIService):
    def __init__(self, api_key: str):
        self.client = openai.OpenAI(api_key=api_key)

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = "gpt-4o-mini",
        temperature: Optional[float] = 0.7,
    ) -> str:
        response = self.client.chat.completions.create(
            model=model, messages=messages, temperature=temperature
        )
        return response.choices[0].message.content
