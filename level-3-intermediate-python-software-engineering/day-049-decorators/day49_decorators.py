# day49_decorators.py
# A toolkit of reusable decorators.

import functools
import random
import time


def timer(func):
    """Print how long each call takes."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"[timer] {func.__name__} took {elapsed * 1000:.1f} ms")
        return result
    return wrapper


def retry(times=3, delay=0.2, exceptions=(Exception,)):
    """Call the function again if it raises one of the given exceptions."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as error:
                    print(f"[retry] {func.__name__} attempt {attempt} failed: {error}")
                    if attempt == times:
                        raise
                    time.sleep(delay * attempt)      # wait a little longer each time
        return wrapper
    return decorator


def count_calls(func):
    """Count how many times the function is called."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper


def validate_types(**expected):
    """Check keyword-named argument types, e.g. @validate_types(n=int)."""
    def decorator(func):
        names = func.__code__.co_varnames[:func.__code__.co_argcount]

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            values = dict(zip(names, args)) | kwargs
            for name, kind in expected.items():
                if name in values and not isinstance(values[name], kind):
                    raise TypeError(f"{name} must be {kind.__name__}, "
                                    f"got {type(values[name]).__name__}")
            return func(*args, **kwargs)
        return wrapper
    return decorator


# ----- examples -----

@timer
def slow_sum(n):
    return sum(i * i for i in range(n))


@retry(times=4, exceptions=(ConnectionError,))
def flaky_download():
    """Pretend network call that fails 60% of the time."""
    if random.random() < 0.6:
        raise ConnectionError("network timeout")
    return "data received"


@count_calls
def greet(name):
    return f"Hello, {name}"


@validate_types(name=str, times=int)
def repeat(name, times):
    return " ".join([name] * times)


def main():
    print(slow_sum(2_000_000))
    print()

    random.seed(3)
    try:
        print(flaky_download())
    except ConnectionError:
        print("Gave up after 4 attempts.")
    print()

    for person in ["Amina", "Omar", "Sara"]:
        greet(person)
    print(f"greet was called {greet.calls} times")
    print("Name kept by functools.wraps:", greet.__name__)
    print()

    print(repeat("hi", 3))
    try:
        repeat("hi", "3")
    except TypeError as error:
        print("TypeError:", error)


if __name__ == "__main__":
    main()
