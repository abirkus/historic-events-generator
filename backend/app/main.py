from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import openai
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],  # Adjust if your frontend runs on a different port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use environment variables for API keys
openai.api_key = os.environ.get("OPENAI_API_KEY")
if not openai.api_key:
    print("Warning: OPENAI_API_KEY not found in environment variables")


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    model: str = "gpt-4o-mini"
    temperature: Optional[float] = 0.7


class ChatResponse(BaseModel):
    response: str


@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        messages = [
            {"role": msg.role, "content": msg.content} for msg in request.messages
        ]

        response = openai.chat.completions.create(
            model=request.model,
            messages=messages,
            temperature=request.temperature,
        )

        return ChatResponse(response=response.choices[0].message.content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API error: {str(e)}")
