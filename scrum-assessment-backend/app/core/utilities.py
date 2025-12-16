from app.core.config import SCORE_CONSTANT


def flatten_list(nested_list):
    flattened = []
    for item in nested_list:
        if isinstance(item, list):
            flattened.extend(flatten_list(item))
        else:
            flattened.append(item)
    return flattened


def num_to_column(n):
    name = ""
    while n > 0:
        n, r = divmod(n - 1, 26)
        name = chr(65 + r) + name
    return name


def column_to_num(col_name: str) -> int:
    col_name = col_name.upper()  # Ensure consistent case
    result = 0
    for char in col_name:
        result = result * 26 + (ord(char) - ord("A") + 1)
    return result


def get_score_category(score: float):
    """
    Determine which category a score falls into based on SCORE_CONSTANT ranges.

    Args:
        score (float): The score to evaluate

    Returns:
        str: The key from SCORE_CONSTANT that matches the score range
        None: If the score doesn't match any range
    """
    for category, (min_score, max_score) in SCORE_CONSTANT.items():
        if min_score <= score <= max_score:
            return category
    return None
