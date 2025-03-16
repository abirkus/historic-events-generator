from pydantic import BaseModel
from typing import List, Optional


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: Optional[str] = None
    temperature: Optional[float] = 0.7
    provider: Optional[str] = None  # To specify which AI service to use


class ChatResponse(BaseModel):
    response: str
    provider: str  # Which provider generated the response
