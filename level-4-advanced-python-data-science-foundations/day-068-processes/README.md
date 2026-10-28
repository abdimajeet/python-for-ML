# Day 68: Processes

**Level 4, Advanced Python & Data Science Foundations.** Project: **Parallel prime finder**

For CPU-heavy work, threads don't help because of the GIL. Separate processes do: each has its own Python interpreter and can use its own CPU core.

## Lesson

### Processes vs threads

A **process** is a separate running program with its own memory and its own GIL. Running work in several processes uses several CPU cores at once, which gives real speed-ups for calculations. The cost: starting processes is slower, and data has to be copied between them (it must be **picklable**: numbers, strings, lists, dicts and most simple objects).


### ProcessPoolExecutor

The API is the same as yesterday's thread pool, so switching is easy. `os.cpu_count()` tells you how many cores you have.

```python
import os
from concurrent.futures import ProcessPoolExecutor

def heavy(n):
    return sum(i * i for i in range(n))

if __name__ == "__main__":
    print(os.cpu_count(), "cores")
    with ProcessPoolExecutor() as pool:
        print(list(pool.map(heavy, [5_000_000] * 4)))
```

### The __main__ guard is required

On Windows and macOS, each worker process imports your file. Without `if __name__ == "__main__":`, every worker would start its own pool, creating processes endlessly. Worker functions must be defined at the top level of the module, not inside another function or as a lambda.


### Choosing the right tool

**Waiting** (network, disk, database): threads, or asyncio (tomorrow). **Calculating** (maths, image processing, parsing big files): processes. Tasks should be big enough that the work outweighs the cost of sending data to another process. In data science you'll often get parallelism for free: NumPy, pandas and scikit-learn (`n_jobs=-1`) parallelise internally.


## Exercises

1. Print how many CPU cores your computer has.

<details><summary>Solution</summary>

```python
import os
print(os.cpu_count())
```

</details>

2. Time `heavy(5_000_000)` four times sequentially and with a ProcessPoolExecutor. What speed-up do you get?

<details><summary>Solution</summary>

```python
import time
from concurrent.futures import ProcessPoolExecutor

if __name__ == "__main__":
    start = time.perf_counter()
    [heavy(5_000_000) for _ in range(4)]
    print("sequential", time.perf_counter() - start)

    start = time.perf_counter()
    with ProcessPoolExecutor() as pool:
        list(pool.map(heavy, [5_000_000] * 4))
    print("processes", time.perf_counter() - start)
# Usually close to 4x on a machine with 4+ cores.
```

</details>

3. Try passing a lambda to `pool.map`. What error do you get and why?

<details><summary>Solution</summary>

```python
# PicklingError / AttributeError: lambdas can't be pickled,
# so they can't be sent to another process. Use a def at module level.
```

</details>

## Project: Parallel prime finder

Count and find prime numbers up to a large limit by splitting the range into chunks and checking them in parallel. Compare one process, a thread pool, and a process pool to see the GIL's effect clearly.

Files in this folder: `day68_primes.py`.

### Key lines explained

- `math.isqrt(n) + 1`: A divisor bigger than √n would pair with one smaller than √n, so checking up to the square root is enough. `isqrt` is the integer square root.
- `def primes_in_range(bounds):`: Defined at module level and taking a single tuple, so it can be pickled and sent to worker processes.
- `chunks(limit, workers * 4)`: More chunks than workers balances the load: chunks with big numbers take longer, so small pieces keep every core busy.
- `[p for chunk in results for p in chunk]`: A nested comprehension that flattens the list of lists. `map` keeps results in order, so the primes stay sorted.
- `if __name__ == "__main__": main()`: Essential with process pools; without it, workers would re-run the program.

### Stretch goals

- Measure how the speed-up changes with 1, 2, 4 and 8 workers and plot it on Day 78.
- Replace the trial division with a Sieve of Eratosthenes. How does the single-process time compare?

## Test it

- [ ] All three methods must find the same primes (the assert checks this).
- [ ] Compare the speed-ups and explain the difference in your own words.
- [ ] Remove the `__main__` guard (on Windows or macOS) and observe the error, then put it back.
