# day61_fibonacci.py
# Four Fibonacci implementations, compared by calls and time.

import functools
import time


def make_counted(func):
    """Wrap func so we can count how many times it is called."""
    def wrapper(n):
        wrapper.calls += 1
        return func(n)
    wrapper.calls = 0
    return wrapper


# 1. Naive recursion: recomputes the same values again and again
@make_counted
def fib_naive(n):
    return n if n < 2 else fib_naive(n - 1) + fib_naive(n - 2)


# 2. A hand-made cache inside a closure
def make_memo_fib():
    memo = {}

    @make_counted
    def fib(n):
        if n not in memo:
            memo[n] = n if n < 2 else fib(n - 1) + fib(n - 2)
        return memo[n]
    return fib

fib_closure = make_memo_fib()


# 3. The standard library does it for us
@functools.cache
def fib_cached(n):
    return n if n < 2 else fib_cached(n - 1) + fib_cached(n - 2)


# 4. No recursion at all
def fib_loop(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def timed(func, n):
    start = time.perf_counter()
    result = func(n)
    return result, (time.perf_counter() - start) * 1000


def main():
    n = 30
    print(f"Computing fib({n}) four ways\n")
    print(f"{'method':<16}{'result':>10}{'calls':>12}{'ms':>10}")

    result, ms = timed(fib_naive, n)
    print(f"{'naive':<16}{result:>10}{fib_naive.calls:>12,}{ms:>10.2f}")

    result, ms = timed(fib_closure, n)
    print(f"{'closure memo':<16}{result:>10}{fib_closure.calls:>12,}{ms:>10.2f}")

    result, ms = timed(fib_cached, n)
    info = fib_cached.cache_info()
    print(f"{'functools.cache':<16}{result:>10}{info.misses:>12,}{ms:>10.2f}")

    result, ms = timed(fib_loop, n)
    print(f"{'loop':<16}{result:>10}{'-':>12}{ms:>10.2f}")

    print(f"\nWith caching, fib(300) = {fib_cached(300)}")
    print("Cache stats:", fib_cached.cache_info())


if __name__ == "__main__":
    main()
