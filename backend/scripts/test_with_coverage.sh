#!/bin/bash

# Exit on any error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Go to the project root (assuming script is in ./scripts/)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root - This is the key fix!
cd "$PROJECT_ROOT"

echo -e "${YELLOW}Running tests from: $(pwd)${NC}"
echo -e "${YELLOW}Running tests with coverage...${NC}"

# Ensure we're in a UV environment
if ! command -v uv &> /dev/null; then
    echo -e "${RED}Error: UV is not installed or not in PATH${NC}"
    exit 1
fi

# Install dependencies if not already installed
echo -e "${YELLOW}Installing dependencies...${NC}"
uv sync

# Run tests with coverage (back to original path since we're now in project root)
echo -e "${YELLOW}Running pytest with coverage...${NC}"
uv run coverage run -m pytest app/tests -v

# Generate coverage report
echo -e "${YELLOW}Generating coverage report...${NC}"
uv run coverage report

# Generate HTML coverage report (optional)
echo -e "${YELLOW}Generating HTML coverage report...${NC}"
uv run coverage html

# Display coverage summary
echo -e "${GREEN}Coverage report generated!${NC}"
echo -e "${GREEN}View detailed HTML report: open htmlcov/index.html${NC}"

echo -e "${GREEN}Tests completed successfully!${NC}"