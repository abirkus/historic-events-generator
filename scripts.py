import subprocess

def dev():
    # Run the FastAPI dev command directly
    subprocess.run(["fastapi", "dev", "app/main.py"], check=True)