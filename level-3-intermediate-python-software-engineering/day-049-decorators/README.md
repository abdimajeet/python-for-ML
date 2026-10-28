# Day 49: Decorators

**Level 3, Intermediate Python & Software Engineering.** Project: **Timer and retry decorators**

Decorators wrap a function to add behaviour (timing, logging, retrying, checking) without changing the function's own code. You've already used `@property` and `@classmethod`.

## Lesson

### Functions are objects

A function can be stored in a variable, passed as an argument, and returned from another function. A function defined inside another can remember the outer function's variables; this is called a **closure**.

```python
def make_multiplier(n):
    def multiply(x):
        return x * n          # remembers n
    return multiply

double = make_multiplier(2)
print(double(21))
```

Output:

```text
42
```

### A decorator by hand

A decorator is a function that takes a function and returns a new function, usually one that calls the original with something extra before or after.

```python
def shout(func):
    def wrapper():
        print("Before")
        func()
        print("After")
    return wrapper

def hello():
    print("Hello")

hello = shout(hello)    # replace hello with the wrapped version
hello()
```

Output:

```text
Before
Hello
After
```

### The @ syntax

`@shout` above a definition means exactly `hello = shout(hello)`. To wrap functions with any arguments, the wrapper accepts `*args, **kwargs` and passes them on, and returns the result. `functools.wraps` keeps the original function's name and docstring.

```python
import functools

def announce(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}{args}")
        return func(*args, **kwargs)
    return wrapper

@announce
def add(a, b):
    return a + b

print(add(2, 3))
```

Output:

```text
Calling add(2, 3)
5
```

### Decorators with arguments

`@retry(times=3)` needs one more layer: `retry(3)` runs first and returns the actual decorator. It looks complicated, but it's always the same three-level shape, which you'll see in today's project.


## Exercises

1. Write a decorator `@twice` that runs the function two times.

<details><summary>Solution</summary>

```python
def twice(func):
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
        return func(*args, **kwargs)
    return wrapper

@twice
def greet(name):
    print("Hi", name)

greet("Sara")
```

</details>

2. Write `@positive_args` that raises ValueError if any argument is a negative number.

<details><summary>Solution</summary>

```python
def positive_args(func):
    def wrapper(*args, **kwargs):
        for a in args:
            if isinstance(a, (int, float)) and a < 0:
                raise ValueError("Arguments must be positive")
        return func(*args, **kwargs)
    return wrapper
```

</details>

3. Try `functools.lru_cache`, a built-in decorator, on a recursive Fibonacci function. How much faster is `fib(35)`?

<details><summary>Solution</summary>

```python
import functools

@functools.lru_cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(35))   # instant; without the cache it takes seconds
```

</details>

## Project: Timer and retry decorators

Build a small toolkit of reusable decorators: `@timer` reports how long a function took, `@retry` re-runs a function that fails (useful for flaky network calls), `@count_calls` tracks usage, and `@validate_types` checks argument types.

Files in this folder: `day49_decorators.py`.

### Key lines explained

- `result = func(*args, **kwargs) ... return result`: The wrapper must return the original result, or every decorated function would return `None`.
- `def retry(times=3, ...): def decorator(func): def wrapper(...):`: Three layers: `retry(...)` takes the settings and returns a decorator; the decorator takes the function and returns the wrapper.
- `raise  (on its own)`: Re-raises the current error after the final attempt, so the caller still finds out it failed.
- `wrapper.calls = 0`: Functions are objects, so you can attach attributes to them. The counter lives on the wrapper.
- `dict(zip(names, args)) | kwargs`: Matches positional values to parameter names, then merges in keyword arguments with the `|` dict-merge operator (Python 3.9+).

### Stretch goals

- Write `@cache_to_file` that saves results to JSON and reuses them.
- Stack `@timer` on top of `@retry` and explain the order of the output.

## Test it

- [ ] Run it a few times with different seeds and watch retry succeed or give up.
- [ ] Check `help(greet)` still shows the original docstring.
- [ ] Remove `return result` from `timer` and see what breaks.
