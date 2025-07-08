import subprocess
from dotenv import load_dotenv


def dev():
    load_dotenv()
    subprocess.run(["fastapi", "dev", "app/main.py"], check=True)


def prod():
    load_dotenv()
    subprocess.run(["fastapi", "run", "app/main.py"])
