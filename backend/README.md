# FastAPI backend app for Historic Events Generator
- Run in console `poetry run dev` to get started
- make sure OPENAI_API_KEY is set up in your environment or `.env`

- poetry run uvicorn main:app  
-  poetry run fastapi dev app/main.py    


- docker build -t chronicles-explorer-backend .
- docker run -p 8000:8000 chronicles-explorer-backend