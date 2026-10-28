# day31_safe_calculator.py
# A calculator that handles every kind of bad input.

OPERATIONS = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: a / b,
    "**": lambda a, b: a ** b,
    "%": lambda a, b: a % b,
}


def parse(expression):
    """Split '12 / 4' into (12.0, '/', 4.0). Raises ValueError if malformed."""
    parts = expression.split()
    if len(parts) != 3:
        raise ValueError("Write it as: number operator number, with spaces.")
    left, op, right = parts
    if op not in OPERATIONS:
        raise ValueError(f"Unknown operator '{op}'. Use one of: {' '.join(OPERATIONS)}")
    try:
        return float(left), op, float(right)
    except ValueError:
        raise ValueError("Both sides must be numbers.")


def calculate(a, op, b):
    if op in ("/", "%") and b == 0:
        raise ZeroDivisionError("You can't divide by zero.")
    if op == "**" and abs(b) > 1000:
        raise OverflowError("That exponent is too large.")
    return OPERATIONS[op](a, b)


def main():
    print("Type a calculation like 12 / 4, or q to quit.")
    while True:
        expression = input("> ").strip()
        if expression.lower() == "q":
            break
        try:
            a, op, b = parse(expression)
            result = calculate(a, op, b)
        except (ValueError, ZeroDivisionError, OverflowError) as error:
            print("Error:", error)
        else:
            if isinstance(result, float) and result.is_integer():
                result = int(result)
            print("=", result)


main()
