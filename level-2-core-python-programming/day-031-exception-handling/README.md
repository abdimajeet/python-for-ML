# Day 31: Exception handling

**Level 2, Core Python Programming.** Project: **Crash-proof calculator**

Real programs meet bad input, missing files and network failures. Exception handling lets your program respond sensibly instead of crashing.

## Lesson

### try and except

Put risky code in a `try` block. If an error of the named type happens, Python jumps to the matching `except` block instead of crashing.

```python
try:
    age = int(input("Age: "))
    print("Next year:", age + 1)
except ValueError:
    print("Please type a whole number.")
```

### Several excepts, and the error object

You can catch different errors separately. `as e` gives you the error object, and `str(e)` is its message.

```python
try:
    a = float(input("a: "))
    b = float(input("b: "))
    print(a / b)
except ValueError:
    print("Those weren't numbers.")
except ZeroDivisionError as e:
    print("Maths error:", e)
```

### else and finally

`else` runs only if no error happened. `finally` always runs, error or not, which is useful for cleanup. Keep the `try` block small, containing only the line that might fail.

```python
try:
    f = open("data.txt", encoding="utf-8")
except FileNotFoundError:
    print("No data yet.")
else:
    print(f.read())
    f.close()
finally:
    print("Finished loading.")
```

### Never catch everything silently

A bare `except:` or `except Exception: pass` hides real bugs, including typos. Catch the **specific** errors you expect and know how to handle. Let everything else crash loudly so you can fix it.


### Raising your own errors

`raise ValueError("message")` stops a function when it receives input it can't handle. The caller can then decide what to do. You saw this on Day 24.

```python
def set_age(age):
    if age < 0:
        raise ValueError("Age can't be negative")
    return age
```

## Exercises

1. Write `ask_int(prompt)` that keeps asking until the user types a valid whole number, then returns it.

<details><summary>Solution</summary>

```python
def ask_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("That's not a whole number. Try again.")
```

</details>

2. Read a file whose name the user types; print a friendly message if it doesn't exist.

<details><summary>Solution</summary>

```python
name = input("File: ")
try:
    with open(name, encoding="utf-8") as f:
        print(f.read())
except FileNotFoundError:
    print(f"There is no file called {name}.")
```

</details>

3. Look up a key in a dict with `[]` and handle a `KeyError`.

<details><summary>Solution</summary>

```python
stock = {"apple": 3}
try:
    print(stock["mango"])
except KeyError:
    print("We don't sell that.")
```

</details>

## Project: Crash-proof calculator

A calculator that no input can crash. It reads expressions like `12 / 4` or `2 ** 8`, validates every part, raises clear errors from the calculation function, and catches them in the main loop. Try your hardest to break it.

Files in this folder: `day31_safe_calculator.py`.

### Key lines explained

- `OPERATIONS = {"+": lambda a, b: a + b, ...}`: A dict mapping symbols to small anonymous functions. `lambda` is covered properly on Day 37; here it simply means "a function of a and b that returns a + b".
- `raise ValueError("Write it as...")`: `parse` doesn't print anything. It raises errors with helpful messages and lets the caller decide how to show them.
- `try: return float(left), ... except ValueError: raise ValueError(...)`: We catch Python's technical message and replace it with one a user understands.
- `except (ValueError, ZeroDivisionError, OverflowError) as error:`: A tuple of error types catches any of them in one block. We catch only the errors we expect.
- `else: ... print("=", result)`: The `else` block runs only when nothing failed, keeping the success path separate.

### Stretch goals

- Remember the last result as `ans` so the user can type `ans * 2`.
- Add `sqrt 9` as a two-part expression.

## Test it

- [ ] Try: `12/4` without spaces, `a + 1`, `5 ^ 2`, `1 / 0`, `2 ** 99999`, an empty line, and `1 + 2 + 3`.
- [ ] Every case should print a message and keep the program running.
- [ ] Press Ctrl+C: that still stops the program, which is correct.
