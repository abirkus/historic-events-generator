import pytest
import json
from app.utils import response_cleanup


@pytest.mark.parametrize(
    "input_text,expected",
    [
        # Empty response
        ("", json.dumps([])),
        # Already a JSON array of strings
        (
            '["Event 1", "Event 2"]',
            json.dumps(["Event 1", "Event 2"], ensure_ascii=False),
        ),
        # Markdown code block
        (
            '```json\n["Event 1", "Event 2"]\n```',
            json.dumps(["Event 1", "Event 2"], ensure_ascii=False),
        ),
        # AI prefix
        (
            'Here are the events: ["Event 1", "Event 2"]',
            json.dumps(["Event 1", "Event 2"], ensure_ascii=False),
        ),
        # Embedded JSON array in text
        (
            'Some intro text. ["Event 1", "Event 2"] Some outro.',
            json.dumps(["Event 1", "Event 2"], ensure_ascii=False),
        ),
        # Numbered list
        (
            "1. Event 1\n2. Event 2",
            json.dumps(["Event 1", "Event 2"], ensure_ascii=False),
        ),
        # Bullet points
        (
            "- Event 1\n- Event 2",
            json.dumps(["Event 1", "Event 2"], ensure_ascii=False),
        ),
        # Single string
        (
            "Just a single event",
            json.dumps(["Just a single event"], ensure_ascii=False),
        ),
        # Dict response
        (
            '{"event": "Event 1"}',
            json.dumps(['{"event": "Event 1"}'], ensure_ascii=False),
        ),
        # Malformed JSON (trailing comma)
        (
            '["Event 1", "Event 2",]',
            json.dumps(["Event 1", "Event 2"], ensure_ascii=False),
        ),
        # Malformed JSON (single quotes)
        (
            "['Event 1', 'Event 2']",
            json.dumps(["Event 1", "Event 2"], ensure_ascii=False),
        ),
        # Array of dicts
        (
            '[{"event": "Event 1"}, {"event": "Event 2"}]',
            json.dumps(
                ['{"event": "Event 1"}', '{"event": "Event 2"}'], ensure_ascii=False
            ),
        ),
        # Array with mixed types
        (
            '["Event 1", 2, {"event": "Event 3"}]',
            json.dumps(["Event 1", "2", '{"event": "Event 3"}'], ensure_ascii=False),
        ),
    ],
)
def test_clean_ai_response_various_cases(input_text, expected):
    result = response_cleanup.clean_ai_response(input_text)
    assert json.loads(result) == json.loads(expected)
    assert response_cleanup.validate_response_format(result)


def test_parse_text_to_string_array_empty():
    assert response_cleanup.parse_text_to_string_array("") == json.dumps([])


def test_parse_text_to_string_array_numbered():
    text = "1. Event 1\n2. Event 2\n3. Event 3"
    expected = ["Event 1", "Event 2", "Event 3"]
    assert json.loads(response_cleanup.parse_text_to_string_array(text)) == expected


def test_parse_text_to_string_array_bullets():
    text = "- Event 1\n- Event 2\n- Event 3"
    expected = ["Event 1", "Event 2", "Event 3"]
    assert json.loads(response_cleanup.parse_text_to_string_array(text)) == expected


def test_parse_text_to_string_array_mixed():
    text = "1) Event 1\n* Event 2\n• Event 3"
    expected = ["Event 1", "Event 2", "Event 3"]
    assert json.loads(response_cleanup.parse_text_to_string_array(text)) == expected


def test_normalize_to_string_array_list():
    data = ["Event 1", "Event 2", 3, {"event": "Event 4"}]
    expected = ["Event 1", "Event 2", "3", '{"event": "Event 4"}']
    assert json.loads(response_cleanup.normalize_to_string_array(data)) == expected


def test_normalize_to_string_array_dict():
    data = {"event": "Event 1"}
    expected = ['{"event": "Event 1"}']
    assert json.loads(response_cleanup.normalize_to_string_array(data)) == expected


def test_normalize_to_string_array_str():
    data = "Event 1"
    expected = ["Event 1"]
    assert json.loads(response_cleanup.normalize_to_string_array(data)) == expected


def test_fix_common_json_issues_trailing_comma():
    malformed = '["Event 1", "Event 2",]'
    fixed = response_cleanup.fix_common_json_issues(malformed)
    assert json.loads(fixed) == ["Event 1", "Event 2"]


def test_fix_common_json_issues_single_quotes():
    malformed = "['Event 1', 'Event 2']"
    fixed = response_cleanup.fix_common_json_issues(malformed)
    assert json.loads(fixed) == ["Event 1", "Event 2"]


def test_validate_response_format_valid():
    valid = json.dumps(["Event 1", "Event 2"])
    assert response_cleanup.validate_response_format(valid)


def test_validate_response_format_invalid():
    invalid = json.dumps({"event": "Event 1"})
    assert not response_cleanup.validate_response_format(invalid)
    invalid2 = "not a json"
    assert not response_cleanup.validate_response_format(invalid2)
