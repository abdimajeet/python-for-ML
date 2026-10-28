# Day 69: asyncio basics

**Level 4, Advanced Python & Data Science Foundations.** Project: **Async timers and countdowns**

asyncio runs many waiting tasks concurrently in a single thread, switching between them whenever one is waiting. It's how modern Python web servers and API clients handle thousands of connections.

## Lesson

### Coroutines

`async def` defines a **coroutine function**. Calling it doesn't run it; it creates a coroutine object. You run coroutines with `await` (from inside another coroutine) or with `asyncio.run(main())` at the top level.

```python
import asyncio

async def greet(name):
    await asyncio.sleep(1)     # wait without blocking other tasks
    return f"Hello {name}"

async def main():
    print(await greet("Amina"))

asyncio.run(main())
```

### The event loop

`asyncio.run` starts an **event loop**. When a coroutine reaches `await` on something slow, it pauses and the loop runs another task that's ready. Nothing runs in parallel: tasks take turns, but only at `await` points. That makes it safer than threads (no surprise interruptions).


### Running tasks concurrently

`await asyncio.gather(a(), b(), c())` runs coroutines concurrently and returns their results in order. `asyncio.create_task(coro())` starts one in the background. `asyncio.wait_for(coro, timeout)` adds a time limit.

```python
async def main():
    start = asyncio.get_running_loop().time()
    results = await asyncio.gather(greet("A"), greet("B"), greet("C"))
    print(results, round(asyncio.get_running_loop().time() - start, 1))

asyncio.run(main())
```

Output:

```text
['Hello A', 'Hello B', 'Hello C'] 1.0
```

### Never block the loop

Inside async code, use `await asyncio.sleep()`, never `time.sleep()`; the latter freezes every task. The same applies to libraries: use async ones (like `httpx` tomorrow) instead of `requests`. For unavoidable blocking calls, `await asyncio.to_thread(func, args)` runs them in a thread.


## Exercises

1. Write `async def countdown(name, n)` that prints a countdown with 0.5 s pauses, and run two at once with `gather`.

<details><summary>Solution</summary>

```python
import asyncio

async def countdown(name, n):
    while n > 0:
        print(name, n)
        await asyncio.sleep(0.5)
        n -= 1

async def main():
    await asyncio.gather(countdown("A", 3), countdown("B", 5))

asyncio.run(main())
```

</details>

2. Replace `await asyncio.sleep` with `time.sleep` in that exercise. What changes and why?

<details><summary>Solution</summary>

```python
# The countdowns no longer interleave: time.sleep blocks the whole
# event loop, so the other task can't run until it finishes.
```

</details>

3. Use `asyncio.wait_for` to give up on a 3-second task after 1 second.

<details><summary>Solution</summary>

```python
async def main():
    try:
        await asyncio.wait_for(asyncio.sleep(3), timeout=1)
    except TimeoutError:
        print("Too slow!")

asyncio.run(main())
```

</details>

## Project: Async timers and countdowns

A kitchen-timer program that runs several named timers at once in one thread. Timers report progress, can be cancelled, and a watcher task prints a live status line. It demonstrates tasks, gather, cancellation and timeouts.

Files in this folder: `day69_timers.py`.

### Key lines explained

- `asyncio.create_task(timer("tea", 3))`: Starts the coroutine running in the background right away and returns a Task you can check or cancel.
- `await asyncio.sleep(min(step, remaining))`: Each await hands control back to the event loop, which is what lets the other timers and the watcher run.
- `except asyncio.CancelledError: ... raise`: `task.cancel()` raises CancelledError at the task's current await. We print a message, then re-raise so the task is properly marked cancelled.
- `gather(*tasks.values(), return_exceptions=True)`: Returns exceptions (like the cancellation) as results instead of raising, so one cancelled timer doesn't hide the others' results.
- `asyncio.wait_for(..., timeout=2)`: Cancels the pizza timer automatically if it takes longer than 2 seconds.

### Stretch goals

- Let the user type new timers while others run (look up `asyncio.to_thread(input, ...)`).
- Add a pause/resume feature using `asyncio.Event`.

## Test it

- [ ] Total time should be about 7 seconds, not 26.
- [ ] Change `asyncio.sleep` in `timer` to `time.sleep` and watch everything run one after another.
- [ ] Cancel the tea timer instead.
