from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class AIService(ABC):
    @abstractmethod
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        model: Optional[str] = None,
        temperature: Optional[float] = 0.7,
    ) -> str:
        """Get a chat completion from the AI service"""
        pass
