# Day 67: Threads

**Level 4, Advanced Python & Data Science Foundations.** Project: **Concurrent website status checker**

Threads let a program wait for several slow things at once, such as network requests or file downloads. Today you learn when threads help, why the GIL limits them, and how to use them safely with `concurrent.futures`.

## Lesson

### Concurrency and the GIL

Normally Python does one thing at a time. A **thread** is a separate flow of execution inside the same program. CPython's **Global Interpreter Lock** (GIL) lets only one thread run Python code at a time, so threads **don't** speed up calculations. But while a thread waits for the network or disk, the GIL is released and others run. So threads are great for **I/O-bound** work and useless for **CPU-bound** work (that's tomorrow's topic: processes).


### ThreadPoolExecutor

`concurrent.futures.ThreadPoolExecutor` manages a pool of worker threads for you. `executor.map(func, items)` runs the function on every item using several threads and returns results in order.

```python
import time
from concurrent.futures import ThreadPoolExecutor

def slow_task(n):
    time.sleep(1)          # pretend to wait for the network
    return n * n

start = time.perf_counter()
with ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(slow_task, range(5)))
print(results, f"{time.perf_counter() - start:.1f}s")
```

Output:

```text
[0, 1, 4, 9, 16] 1.0s
```

### submit and as_completed

`pool.submit(func, arg)` returns a **Future**: a placeholder for a result that will arrive later. `as_completed(futures)` yields each future as soon as it finishes, so you can show progress. `future.result()` returns the value or re-raises the thread's exception.


### Shared data and locks

If several threads change the same variable, updates can collide (a **race condition**). Protect shared data with a `threading.Lock` in a `with` block, or avoid sharing: let each task return its result and combine results in the main thread. The second approach is simpler and is what `map` encourages.

```python
import threading

lock = threading.Lock()
total = 0

def add(n):
    global total
    with lock:
        total += n
```

## Exercises

1. Time 10 calls of `time.sleep(0.5)` done one after another, then with a pool of 10 threads.

<details><summary>Solution</summary>

```python
import time
from concurrent.futures import ThreadPoolExecutor

def nap(_):
    time.sleep(0.5)

start = time.perf_counter()
for i in range(10):
    nap(i)
print("sequential", time.perf_counter() - start)   # about 5s

start = time.perf_counter()
with ThreadPoolExecutor(10) as pool:
    list(pool.map(nap, range(10)))
print("threads", time.perf_counter() - start)      # about 0.5s
```

</details>

2. Now try a CPU-heavy function, like summing squares to 5 million, with 4 threads. Is it faster than sequential?

<details><summary>Solution</summary>

```python
# No: because of the GIL, threads take turns running Python code,
# so CPU-bound work takes about the same time (or a little longer).
```

</details>

## Project: Concurrent website status checker

Check whether a list of websites is up, how fast each one responds and what status it returns, using a thread pool. Compare the total time with checking them one by one. Results appear as each check finishes. Needs `pip install requests`.

Files in this folder: `day67_status_checker.py`.

### Key lines explained

- `def check(url) -> Result:`: Each task is independent and returns its own result, so the threads never share mutable data and no lock is needed.
- `except requests.RequestException as error:`: Errors are turned into results inside the thread. One broken site can't crash the whole check.
- `futures = {pool.submit(check, url): url ...}`: `submit` starts every check immediately and returns Future objects.
- `for future in as_completed(futures):`: Results print in the order they finish, not the order submitted, so fast sites appear first.
- `sum(r.ok for r in results)`: True counts as 1 and False as 0, so summing bools counts the successes.

### Stretch goals

- Read the list of URLs from a text file.
- Check every site every 60 seconds and log any site that goes down.

## Test it

- [ ] Run with your own list: `python day67_status_checker.py https://example.com https://python.org`.
- [ ] Compare the two timings; with 10 sites threads should be several times faster.
- [ ] Change `max_workers` to 1: it becomes as slow as sequential. Why?
