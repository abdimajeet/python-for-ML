# day68_primes.py
# Finds primes in parallel and compares threads with processes.

import math
import os
import time
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

LIMIT = 3_000_000


def is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    for d in range(3, math.isqrt(n) + 1, 2):
        if n % d == 0:
            return False
    return True


def primes_in_range(bounds: tuple[int, int]) -> list[int]:
    start, stop = bounds
    return [n for n in range(start, stop) if is_prime(n)]


def chunks(limit: int, parts: int) -> list[tuple[int, int]]:
    size = math.ceil(limit / parts)
    return [(i, min(i + size, limit)) for i in range(0, limit, size)]


def run(label, executor_class, limit, workers):
    start = time.perf_counter()
    if executor_class is None:
        results = [primes_in_range((0, limit))]
    else:
        with executor_class(max_workers=workers) as pool:
            results = list(pool.map(primes_in_range, chunks(limit, workers * 4)))
    primes = [p for chunk in results for p in chunk]
    seconds = time.perf_counter() - start
    print(f"{label:<18}{len(primes):>10,} primes{seconds:>9.2f}s")
    return primes, seconds


def main():
    workers = os.cpu_count() or 4
    print(f"Primes below {LIMIT:,} using up to {workers} workers\n")

    single, t_single = run("single process", None, LIMIT, 1)
    threaded, t_threads = run("thread pool", ThreadPoolExecutor, LIMIT, workers)
    multi, t_procs = run("process pool", ProcessPoolExecutor, LIMIT, workers)

    assert single == threaded == multi, "all methods must agree"
    print(f"\nThreads speed-up:   {t_single / t_threads:.1f}x  (the GIL stops real parallelism)")
    print(f"Processes speed-up: {t_single / t_procs:.1f}x")
    print(f"Largest prime found: {multi[-1]:,}")
    print(f"Last five: {multi[-5:]}")


if __name__ == "__main__":
    main()
