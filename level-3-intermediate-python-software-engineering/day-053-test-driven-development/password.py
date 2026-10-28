"""Password rules, written to make test_password.py pass."""

import string

MIN_LENGTH = 10
COMMON = {"password", "qwerty", "letmein", "welcome", "admin", "iloveyou"}

RULES = [
    (str.isupper, "an uppercase letter"),
    (str.islower, "a lowercase letter"),
    (str.isdigit, "a digit"),
    (lambda ch: ch in string.punctuation, "a symbol"),
]


def validate_password(password: str, username: str | None = None) -> list[str]:
    """Return a list of problems with the password. Empty means it's valid."""
    problems = []

    if len(password) < MIN_LENGTH:
        problems.append(f"at least {MIN_LENGTH} characters")

    for check, description in RULES:
        if not any(check(ch) for ch in password):
            problems.append(description)

    if " " in password:
        problems.append("no spaces")

    lowered = password.lower()
    if any(word in lowered for word in COMMON):
        problems.append("not a common password")

    if username and username.lower() in lowered:
        problems.append("not contain your username")

    return problems


def is_valid(password: str, username: str | None = None) -> bool:
    return not validate_password(password, username)


if __name__ == "__main__":
    pw = input("Choose a password: ")
    problems = validate_password(pw)
    if problems:
        print("It needs: " + "; ".join(problems))
    else:
        print("Strong password!")
