# day69_timers.py
# Several timers running at once with asyncio.

import asyncio
import time

START = time.perf_counter()


def stamp() -> str:
    return f"[{time.perf_counter() - START:5.1f}s]"


async def timer(name: str, seconds: float, step: float = 1.0) -> str:
    """Count down, reporting every step seconds. Returns a summary."""
    remaining = seconds
    print(f"{stamp()} {name}: started ({seconds}s)")
    try:
        while remaining > 0:
            await asyncio.sleep(min(step, remaining))
            remaining = round(remaining - step, 2)
            if remaining > 0:
                print(f"{stamp()} {name}: {remaining:g}s left")
        print(f"{stamp()} {name}: DING!")
        return f"{name} finished"
    except asyncio.CancelledError:
        print(f"{stamp()} {name}: cancelled with {remaining:g}s left")
        raise


async def watcher(tasks: dict[str, asyncio.Task], every: float = 1.5) -> None:
    """Print which timers are still running until all have finished."""
    while not all(t.done() for t in tasks.values()):
        await asyncio.sleep(every)
        running = [name for name, t in tasks.items() if not t.done()]
        print(f"{stamp()} still running: {', '.join(running) or 'none'}")


async def main() -> None:
    tasks = {
        "tea": asyncio.create_task(timer("tea", 3)),
        "eggs": asyncio.create_task(timer("eggs", 5)),
        "rice": asyncio.create_task(timer("rice", 8, step=2)),
    }
    watch = asyncio.create_task(watcher(tasks))

    await asyncio.sleep(4)
    print(f"{stamp()} Changed my mind about the rice.")
    tasks["rice"].cancel()

    results = await asyncio.gather(*tasks.values(), return_exceptions=True)
    await watch
    print()
    for name, result in zip(tasks, results):
        outcome = "cancelled" if isinstance(result, asyncio.CancelledError) else result
        print(f"  {name:<5} {outcome}")

    try:
        await asyncio.wait_for(timer("pizza", 10), timeout=2)
    except TimeoutError:
        print(f"{stamp()} pizza timer gave up after 2 seconds")

    print(f"\nTotal time {time.perf_counter() - START:.1f}s, though the timers add up to 26s.")


if __name__ == "__main__":
    asyncio.run(main())
