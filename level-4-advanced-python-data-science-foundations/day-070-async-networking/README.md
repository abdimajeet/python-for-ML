# Day 70: Async networking

**Level 4, Advanced Python & Data Science Foundations.** Project: **Async API fetcher**

Today you combine asyncio with an async HTTP client to fetch many web resources concurrently, while respecting rate limits and handling failures.

## Lesson

### httpx

`httpx` (`pip install httpx`) looks like `requests` but also has an async client. Create one `AsyncClient` and reuse it for every request; it keeps connections open between requests.

```python
import asyncio
import httpx

async def main():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get("https://api.github.com")
        print(r.status_code)

asyncio.run(main())
```

### Many requests at once

Create a coroutine per URL and `gather` them. A hundred requests that take a second each finish in about one second instead of a hundred.


### Limiting concurrency with a semaphore

Firing thousands of requests at once can overload a server or get you blocked. An `asyncio.Semaphore(5)` allows at most 5 tasks inside its `async with` block at a time; the rest wait their turn.

```python
limit = asyncio.Semaphore(5)

async def fetch(client, url):
    async with limit:
        return await client.get(url)
```

### Async or threads?

Both handle I/O-bound work. asyncio scales to many thousands of connections cheaply and avoids race conditions, but every library you call must be async. Threads work with any library. For a small script, threads are often simpler; for servers and large crawlers, asyncio wins. FastAPI (Day 97) is built on asyncio.


## Exercises

1. Fetch three URLs concurrently with `httpx.AsyncClient` and print their status codes.

<details><summary>Solution</summary>

```python
async def main():
    urls = ["https://www.python.org", "https://pypi.org", "https://github.com"]
    async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
        responses = await asyncio.gather(*(client.get(u) for u in urls))
    for u, r in zip(urls, responses):
        print(r.status_code, u)

asyncio.run(main())
```

</details>

2. Use a `Semaphore(2)` with 6 tasks that each sleep 1 second. How long does it take?

<details><summary>Solution</summary>

```python
async def task(sem, i):
    async with sem:
        await asyncio.sleep(1)

async def main():
    sem = asyncio.Semaphore(2)
    await asyncio.gather(*(task(sem, i) for i in range(6)))
# About 3 seconds: 2 at a time, 3 rounds.
```

</details>

## Project: Async API fetcher

Download data about many countries from the free REST Countries API concurrently with `httpx`, limiting how many requests run at once, retrying failures, and then summarising the results. A `--sequential` flag lets you compare the timing. Needs `pip install httpx`.

Files in this folder: `day70_async_fetcher.py`.

### Key lines explained

- `async with limit:`: Only 5 requests are in flight at any moment, which is polite to the free API. The `--sequential` mode uses a limit of 1 to compare.
- `await asyncio.sleep(0.5 * 2 ** attempt)`: **Exponential backoff**: wait 0.5 s, then 1 s, before retrying, giving a struggling server time to recover.
- `(data.get("capital") or ["-"])[0]`: Some countries have no capital in the data; `or` supplies a default list so indexing is safe.
- `return {"code": code, "error": ...}`: Failures become results, so one bad country code (XX) doesn't stop the others.
- `asyncio.gather(*(fetch_country(...) for c in codes))`: A generator expression creates every coroutine; `gather` runs them and returns results in the same order as the codes.

### Stretch goals

- Save the results to a CSV with Day 33's code, ready for pandas on Day 75.
- Add a progress counter that updates as each country arrives (use `asyncio.as_completed`).

## Test it

- [ ] Run normally, then with `--sequential`, and compare times.
- [ ] The code XX should show "not found" without stopping the others.
- [ ] Disconnect from the internet: every country should report a transport error after retrying.
