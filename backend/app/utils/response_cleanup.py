import re
import json
import logging
from typing import Any, Union, List

logger = logging.getLogger(__name__)


def clean_ai_response(response_text: str, provider: str = "") -> str:
    """
    Universal response cleaner for different AI providers.
    Ensures all responses are returned as a JSON array of strings.
    """
    if not response_text:
        return json.dumps([])

    original_response = response_text

    try:
        # Step 1: Remove markdown code blocks
        # Matches: ```json, ```JSON, ```, or any ```language
        response_text = re.sub(
            r"```(?:json|JSON|python|javascript|text)?\n?", "", response_text
        )
        response_text = re.sub(r"```\n?", "", response_text)

        # Step 2: Remove common AI response prefixes/suffixes
        prefixes_to_remove = [
            r"^Here\s+(?:is|are)\s+.*?:\s*",
            r"^(?:The\s+)?(?:historic\s+)?events?\s+(?:for\s+.*?\s+)?(?:are|include):\s*",
            r"^(?:Based\s+on\s+.*?,?\s*)?(?:here\s+are\s+)?(?:the\s+)?(?:notable\s+)?(?:historic\s+)?events?\s*:?\s*",
            r"^.*?(?:array|list)\s*:?\s*",
        ]

        for prefix_pattern in prefixes_to_remove:
            response_text = re.sub(
                prefix_pattern, "", response_text, flags=re.IGNORECASE | re.MULTILINE
            )

        # Step 3: Extract JSON array if it's embedded in text
        json_array_match = re.search(
            r"(\[(?:[^\[\]]|(?:\[[^\]]*\]))*\])", response_text, re.DOTALL
        )
        if json_array_match:
            response_text = json_array_match.group(1)

        # Step 4: Clean up whitespace
        response_text = response_text.strip()

        # Step 5: Try to parse as JSON
        try:
            parsed_json = json.loads(response_text)

            # Convert to array of strings format
            return normalize_to_string_array(parsed_json)

        except json.JSONDecodeError as e:
            logger.warning(f"Response is not valid JSON after cleaning: {e}")
            logger.warning(f"Cleaned response: {response_text[:200]}...")

            # Step 6: Try to fix common JSON issues
            fixed_response = fix_common_json_issues(response_text)
            try:
                parsed_json = json.loads(fixed_response)
                return normalize_to_string_array(parsed_json)
            except json.JSONDecodeError:
                pass

        # Step 7: Try to parse as a simple text response
        if not response_text.startswith("["):
            # If it's not already an array, try to convert plain text to array
            return parse_text_to_string_array(response_text)

        # Step 8: Fallback - if it looks like an array, try to parse it
        if response_text.startswith("[") and response_text.endswith("]"):
            try:
                # Attempt a more lenient JSON parse
                fixed_response = fix_common_json_issues(response_text)
                parsed_json = json.loads(fixed_response)
                return normalize_to_string_array(parsed_json)
            except:
                pass

        # Step 9: Last resort - convert whatever we have to a single-item array
        logger.error(
            f"Could not clean {provider} response, converting to single-item array"
        )
        logger.error(f"Original: {original_response[:200]}...")
        logger.error(f"Attempted cleanup: {response_text[:200]}...")

        # Return as a single-item array
        return json.dumps([response_text.strip()], ensure_ascii=False)

    except Exception as e:
        logger.error(f"Error cleaning {provider} response: {e}")
        # Return original as single-item array
        return json.dumps([original_response.strip()], ensure_ascii=False)


def normalize_to_string_array(data: Any) -> str:
    """
    Convert any data structure to a JSON array of strings.
    """
    if isinstance(data, list):
        # Already a list, convert all items to strings
        string_array = []
        for item in data:
            if isinstance(item, str):
                cleaned_item = item.strip()
                if cleaned_item:  # Only add non-empty strings
                    string_array.append(cleaned_item)
            elif isinstance(item, dict):
                # Convert dict to string representation
                string_array.append(json.dumps(item, ensure_ascii=False))
            else:
                # Convert other types to string
                string_repr = str(item).strip()
                if string_repr:
                    string_array.append(string_repr)

        return json.dumps(string_array, ensure_ascii=False)

    elif isinstance(data, dict):
        # Convert dict to a single-item array
        return json.dumps([json.dumps(data, ensure_ascii=False)], ensure_ascii=False)

    elif isinstance(data, str):
        # Single string becomes single-item array
        cleaned_string = data.strip()
        if cleaned_string:
            return json.dumps([cleaned_string], ensure_ascii=False)
        else:
            return json.dumps([])

    else:
        # Convert other types to string and put in array
        string_repr = str(data).strip()
        if string_repr:
            return json.dumps([string_repr], ensure_ascii=False)
        else:
            return json.dumps([])


def parse_text_to_string_array(text: str) -> str:
    """
    Parse plain text into an array of strings.
    Handles various text formats like numbered lists, bullet points, etc.
    """
    if not text.strip():
        return json.dumps([])

    # Try to split by common delimiters for lists
    lines = text.strip().split("\n")

    # Clean and filter lines
    cleaned_lines = []
    for line in lines:
        # Remove common list markers
        line = re.sub(r"^\s*[-*•]\s*", "", line)  # Bullet points
        line = re.sub(r"^\s*\d+\.\s*", "", line)  # Numbered lists
        line = re.sub(r"^\s*\d+\)\s*", "", line)  # Numbered lists with parentheses

        line = line.strip()
        if line and len(line) > 3:  # Only keep meaningful lines
            cleaned_lines.append(line)

    if cleaned_lines:
        return json.dumps(cleaned_lines, ensure_ascii=False)
    else:
        # If no meaningful lines found, return the whole text as single item
        return json.dumps([text.strip()], ensure_ascii=False)


def fix_common_json_issues(json_string: str) -> str:
    """
    Fix common JSON formatting issues.
    """
    # Fix trailing commas
    json_string = re.sub(r",(\s*[}\]])", r"\1", json_string)

    # Fix single quotes to double quotes (do this before other quote fixes)
    json_string = re.sub(r"'([^']*)'", r'"\1"', json_string)

    # Fix missing quotes around simple object keys (only for object keys, not array values)
    # This regex is more specific - only matches word characters followed by colon
    # and ensures we're likely in an object context
    json_string = re.sub(r"([{\s,])(\w+):", r'\1"\2":', json_string)

    # Remove the problematic unescaped quotes fix - it's too aggressive
    # Instead, let's only fix quotes that are clearly problematic
    # For example, unescaped quotes in the middle of strings (very rare case)

    return json_string


def validate_response_format(response: str) -> bool:
    """
    Validate that the response is a JSON array of strings.
    """
    try:
        parsed = json.loads(response)
        if isinstance(parsed, list):
            # Check that all items are strings
            return all(isinstance(item, str) for item in parsed)
        return False
    except (json.JSONDecodeError, TypeError):
        return False
