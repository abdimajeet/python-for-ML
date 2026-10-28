# Day 61: Advanced functions

**Level 4, Advanced Python & Data Science Foundations.** Project: **Memoised Fibonacci and speed comparison**

Level 4 starts by going deeper into functions: closures, partial application, caching, and keyword-only arguments. These ideas appear all over data-science libraries.

## Lesson

### Closures revisited

A function defined inside another can use the outer function's variables, even after the outer function has returned. The inner function "closes over" them. To **change** such a variable from inside, declare it `nonlocal`.

```python
def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()
counter(); counter()
print(counter())
```

Output:

```text
3
```

### functools.partial

`partial(func, some_args)` creates a new function with some arguments already filled in. It's a tidy way to make specialised versions of general functions, for example a key function or a callback.

```python
from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)
print(square(5), cube(2))
```

Output:

```text
25 8
```

### Caching with lru_cache and cache

`@functools.cache` remembers the result for each set of arguments, so repeated calls return instantly. This technique is called **memoisation**. `@lru_cache(maxsize=1000)` keeps only the most recently used results. Arguments must be hashable (no lists or dicts). `.cache_info()` shows hits and misses.


### Keyword-only and positional-only parameters

Parameters after a bare `*` must be passed by keyword, which makes calls self-explaining. Parameters before a `/` must be passed by position. You'll see both in library signatures, such as `sorted(iterable, /, *, key=None, reverse=False)`.

```python
def train(data, *, epochs=10, learning_rate=0.01):
    ...

train(data, epochs=5)          # fine
train(data, 5)                 # TypeError: epochs is keyword-only
```

### Higher-order functions

A function that takes or returns functions is a **higher-order function**. You've used `map`, `sorted(key=...)` and decorators. `functools.reduce` combines all items into one value, and the `operator` module offers ready-made functions like `operator.add` and `operator.itemgetter("score")`.


## Exercises

1. Write `make_multiplier(n)` using a closure, and create `triple` from it.

<details><summary>Solution</summary>

```python
def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply

triple = make_multiplier(3)
print(triple(7))   # 21
```

</details>

2. Use `partial` to make `parse_binary` from `int` so that `parse_binary("1010")` returns 10.

<details><summary>Solution</summary>

```python
from functools import partial
parse_binary = partial(int, base=2)
print(parse_binary("1010"))
```

</details>

3. Use `functools.reduce` and `operator.mul` to multiply all numbers in a list.

<details><summary>Solution</summary>

```python
from functools import reduce
import operator
print(reduce(operator.mul, [2, 3, 4], 1))   # 24
```

</details>

## Project: Memoised Fibonacci and speed comparison

Compare four ways of computing Fibonacci numbers: naive recursion, a hand-written cache using a closure, `@functools.cache`, and a simple loop. Count the function calls and time each one to see how much caching changes everything.

Files in this folder: `day61_fibonacci.py`.

### Key lines explained

- `wrapper.calls += 1`: A decorator from Day 49, reused here to count calls. The naive version makes over a million calls for n = 30.
- `memo = {} inside make_memo_fib`: The dictionary lives in the enclosing function. The inner `fib` closes over it, so the cache survives between calls but isn't a global.
- `@functools.cache`: Does exactly what the hand-made closure does, in one line.
- `info.misses`: Each miss is a value that had to be computed: 31 values from 0 to 30, instead of over a million calls.
- `fib(300) with caching`: Would take longer than the age of the universe with naive recursion; with caching it's instant.

### Stretch goals

- Try `fib_cached(5000)` and read the RecursionError. Why does the loop version not have this problem?
- Use `@lru_cache(maxsize=2)` and see how the miss count changes.

## Test it

- [ ] All four methods must give the same result.
- [ ] Change n to 32 and watch the naive time grow by about 2.6×.
- [ ] Call `fib_cached.cache_clear()` and time it again.
