import subprocess
from dotenv import load_dotenv


def dev():
    # Load environment variables from .env
    load_dotenv()
    # Run the FastAPI dev command directly
    subprocess.run(["fastapi", "dev", "main.py"], check=True)
