FROM python:3.12-slim-bookworm

ENV PYTHONUNBUFFERED=1

# Install uv
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#installing-uv
COPY --from=ghcr.io/astral-sh/uv:0.7.20 /uv /uvx /bin/

# Set working directory
WORKDIR /app

# Place executables in the environment at the front of the path
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#using-the-environment
ENV PATH="/app/.venv/bin:$PATH"

# Compile bytecode
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#compiling-bytecode
ENV UV_COMPILE_BYTECODE=1

# uv Cache
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#caching
ENV UV_LINK_MODE=copy

# Copy dependency files first for better caching
COPY ./pyproject.toml ./uv.lock /app/

# Install dependencies in virtual environment
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#intermediate-layers
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project

# Copy application code
COPY ./app /app/app

# Install the project itself (this ensures your package and any dev dependencies are available)
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

# Set Python path
ENV PYTHONPATH=/app

# Use uv to run the FastAPI application
CMD ["uv", "run", "fastapi", "run", "app/main.py"]