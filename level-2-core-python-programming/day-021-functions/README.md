# Day 21: Functions

**Level 2, Core Python Programming.** Project: **Refactor the calculator into functions**

Functions are named, reusable blocks of code. They are the main tool for organising programs, and every level from here builds on them.

## Lesson

### Defining and calling

`def` defines a function: a name, parentheses, a colon, and an indented body. Defining it does not run it. The body runs only when you **call** the function with its name and parentheses. Python reads files top to bottom, so a function must be defined before the line that calls it runs.

```python
def greet():
    print("Hello!")
    print("Welcome to Level 2.")

greet()
greet()
```

Output:

```text
Hello!
Welcome to Level 2.
Hello!
Welcome to Level 2.
```

### Parameters

Names inside the parentheses are **parameters**. The values you pass when calling are **arguments**. Inside the function, parameters behave like ordinary variables.

```python
def greet(name):
    print(f"Hello, {name}!")

greet("Amina")
greet("Omar")
```

### return sends a value back

`return` ends the function and hands a value back to the caller, who can store it or use it in an expression. This is different from `print()`, which only shows text on screen. A function with no `return` gives back `None`.

```python
def square(n):
    return n * n

area = square(4) + square(3)
print(area)

result = print("hi")   # print returns None
print(result)
```

Output:

```text
25
hi
None
```

### Docstrings

A string on the first line of a function body is its **docstring**. It documents what the function does, and editors show it when you hover over a call. Write one for every function that isn't obvious.

```python
def celsius_to_fahrenheit(c):
    """Convert a temperature from Celsius to Fahrenheit."""
    return c * 9 / 5 + 32
```

### Why bother?

Functions let you **name** an idea, **reuse** it without copying code, and **test** one piece at a time. A good function does one job, and its name says what that job is. If you can't name it, it's probably doing too much.


## Exercises

1. Write `is_even(n)` that returns `True` or `False`. Test it with a few numbers.

<details><summary>Solution</summary>

```python
def is_even(n):
    return n % 2 == 0

print(is_even(4), is_even(7))   # True False
```

</details>

2. Write `initials(full_name)` that returns the initials, e.g. `"Abdy Rahman"` gives `"A.R."`.

<details><summary>Solution</summary>

```python
def initials(full_name):
    result = ""
    for word in full_name.split():
        result += word[0].upper() + "."
    return result

print(initials("Abdy Rahman"))
```

</details>

3. What does this print, and why? `def f(): print("x")` then `y = f()` then `print(y)`.

<details><summary>Solution</summary>

```python
# x      (printed while f runs)
# None   (f has no return, so y is None)
```

</details>

## Project: Refactor the calculator into functions

Take your Day 8 calculator and reorganise it into small functions: one per operation, one to read a number, one to pick the right operation, and a `main()` that runs the program in a loop. Same behaviour, cleaner structure.

Files in this folder: `day21_calculator_functions.py`.

### Key lines explained

- `def divide(a, b): ... return None`: Instead of printing an error, the function reports the problem through its return value. The caller decides what to say. That keeps the calculation separate from the user interface.
- `def calculate(a, op, b):`: This function only maps a symbol to a function. Notice how each `return` ends the function immediately, so no `else` chain is really needed.
- `if result is None:`: `is None` is the correct way to check for `None` (Day 5 mentioned this).
- `def main(): ... main()`: Putting the program's top-level flow in `main()` is a common convention. The last line calls it to start everything.

### Stretch goals

- Add a `power(a, b)` function and the `**` operator.
- Keep a list of past results inside `main()` and add an `h` command to show the history.

## Test it

- [ ] Each operation still gives the same answers as your Day 8 version.
- [ ] Divide by zero.
- [ ] In the interpreter, import nothing, just paste the `add` function and call it directly. Being able to test one function alone is the point of functions.
