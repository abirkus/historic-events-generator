FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_NO_INTERACTION=1 \
    POETRY_VENV_IN_PROJECT=0 \
    POETRY_CACHE_DIR=/tmp/poetry_cache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry 2.1
RUN pip install --no-cache-dir poetry==2.1.0

# Copy poetry configuration files
COPY pyproject.toml poetry.lock* README.md ./

# Configure poetry to not create virtual environments
RUN poetry config virtualenvs.create false

# Install dependencies to system Python
RUN poetry install --only=main --no-root && rm -rf $POETRY_CACHE_DIR

# Copy application code
COPY . .

# Create non-root user for security
# RUN adduser --disabled-password --gecos '' --shell /bin/bash appuser \
#     && chown -R appuser:appuser /app

# Switch to non-root user
# USER appuser

# Expose port
EXPOSE 8000

CMD ["poetry", "run", "fastapi", "run", "app/main.py", "--host", "0.0.0.0", "--port", "8000"]
