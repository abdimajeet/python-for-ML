# day67_status_checker.py
# Checks many websites at once with a thread pool.

import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass

import requests

DEFAULT_SITES = [
    "https://www.python.org",
    "https://pypi.org",
    "https://docs.python.org/3/",
    "https://github.com",
    "https://www.wikipedia.org",
    "https://numpy.org",
    "https://pandas.pydata.org",
    "https://scikit-learn.org",
    "https://pytorch.org",
    "https://this-domain-does-not-exist-12345.com",
]


@dataclass
class Result:
    url: str
    ok: bool
    status: int | None
    ms: float
    error: str = ""


def check(url: str, timeout: float = 8.0) -> Result:
    start = time.perf_counter()
    try:
        r = requests.get(url, timeout=timeout, headers={"User-Agent": "status-checker/1.0"})
        ms = (time.perf_counter() - start) * 1000
        return Result(url, r.ok, r.status_code, ms)
    except requests.RequestException as error:
        ms = (time.perf_counter() - start) * 1000
        return Result(url, False, None, ms, type(error).__name__)


def show(r: Result) -> None:
    mark = "UP  " if r.ok else "DOWN"
    detail = str(r.status) if r.status else r.error
    print(f"  {mark} {r.ms:>7.0f} ms  {detail:<16}{r.url}")


def check_sequential(urls):
    return [check(u) for u in urls]


def check_concurrent(urls, workers=10):
    results = []
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(check, url): url for url in urls}
        for future in as_completed(futures):
            result = future.result()
            show(result)                 # print as each one finishes
            results.append(result)
    return results


def main():
    urls = sys.argv[1:] or DEFAULT_SITES

    print(f"Checking {len(urls)} sites with threads (fastest first):")
    start = time.perf_counter()
    results = check_concurrent(urls)
    threaded = time.perf_counter() - start

    print("\nChecking the same sites one at a time...")
    start = time.perf_counter()
    check_sequential(urls)
    sequential = time.perf_counter() - start

    up = sum(r.ok for r in results)
    print(f"\n{up}/{len(results)} up")
    print(f"Threads:    {threaded:.2f}s")
    print(f"Sequential: {sequential:.2f}s  ({sequential / threaded:.1f}x slower)")
    slowest = max((r for r in results if r.ok), key=lambda r: r.ms, default=None)
    if slowest:
        print(f"Slowest responding site: {slowest.url} ({slowest.ms:.0f} ms)")


if __name__ == "__main__":
    main()
