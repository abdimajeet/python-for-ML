# day50_context_managers.py
# Three useful context managers.

import os
import time
from contextlib import contextmanager
from pathlib import Path


@contextmanager
def atomic_write(path, encoding="utf-8"):
    """Write to a temp file; replace the real file only if no error occurred."""
    path = Path(path)
    temp = path.with_name(path.name + ".tmp")
    f = open(temp, "w", encoding=encoding)
    try:
        yield f
    except BaseException:
        f.close()
        temp.unlink()              # throw the half-written file away
        raise
    else:
        f.close()
        temp.replace(path)         # swap in the finished file


class Timer:
    """Times a block of code and remembers every result by name."""
    results = {}

    def __init__(self, name):
        self.name = name

    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, tb):
        self.elapsed = time.perf_counter() - self.start
        Timer.results[self.name] = self.elapsed
        status = "failed" if exc_type else "done"
        print(f"[{self.name}] {status} in {self.elapsed * 1000:.1f} ms")
        return False               # never hide exceptions

    @classmethod
    def report(cls):
        for name, seconds in sorted(cls.results.items(), key=lambda kv: kv[1]):
            print(f"  {name:<20}{seconds * 1000:>8.1f} ms")


@contextmanager
def working_directory(path):
    """Temporarily change the current folder."""
    previous = Path.cwd()
    os.chdir(path)
    try:
        yield Path(path)
    finally:
        os.chdir(previous)


def main():
    target = Path(__file__).parent / "report.txt"

    with Timer("good write"):
        with atomic_write(target) as f:
            for i in range(1, 6):
                f.write(f"Line {i}\n")
    print("After good write:", target.read_text().splitlines())

    try:
        with Timer("failing write"):
            with atomic_write(target) as f:
                f.write("This should never appear\n")
                raise RuntimeError("simulated crash halfway through")
    except RuntimeError as error:
        print("Caught:", error)
    print("After failed write, file is unchanged:", target.read_text().splitlines()[:2], "...")

    with Timer("list comprehension"):
        squares = [n * n for n in range(1_000_000)]
    with Timer("for loop"):
        squares = []
        for n in range(1_000_000):
            squares.append(n * n)

    print("\nFastest first:")
    Timer.report()

    with working_directory(target.parent.parent):
        print("\nInside the block, cwd is", Path.cwd().name)
    print("Afterwards, cwd is", Path.cwd().name)


if __name__ == "__main__":
    main()
