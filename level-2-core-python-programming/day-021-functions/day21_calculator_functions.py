# day21_calculator_functions.py
# The Day 8 calculator, rebuilt from small functions.


def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    """Divide a by b. Returns None if b is zero."""
    if b == 0:
        return None
    return a / b


def get_number(prompt):
    """Ask for a number and return it as a float."""
    return float(input(prompt))


def calculate(a, op, b):
    """Apply the operator symbol op to a and b."""
    if op == "+":
        return add(a, b)
    elif op == "-":
        return subtract(a, b)
    elif op == "*":
        return multiply(a, b)
    elif op == "/":
        return divide(a, b)
    else:
        return None


def main():
    print("=== Calculator === (type q to quit)")
    while True:
        op = input("Operation (+ - * /): ").strip()
        if op == "q":
            print("Goodbye!")
            break
        if op not in ("+", "-", "*", "/"):
            print("Unknown operation.")
            continue

        a = get_number("First number: ")
        b = get_number("Second number: ")
        result = calculate(a, op, b)

        if result is None:
            print("That can't be calculated (division by zero?).")
        else:
            print(f"{a} {op} {b} = {round(result, 4)}")
        print()


main()
