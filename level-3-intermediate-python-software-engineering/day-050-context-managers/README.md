# Day 50: Context managers

**Level 3, Intermediate Python & Software Engineering.** Project: **Safe file writer and code timer**

Context managers power the `with` statement. They guarantee setup and cleanup happen, even when errors occur. Today you write your own.

## Lesson

### What with does

`with open(...) as f:` calls the object's `__enter__` method at the start, giving `f`, and its `__exit__` method at the end, **no matter how the block ends**: normally, by `return`, or by an exception. That's why files always get closed.


### A class-based context manager

`__exit__` receives details of any exception. Returning `True` from it would swallow the exception; usually you return nothing (`None`) so errors still propagate.

```python
import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        print(f"Took {self.elapsed:.3f}s")

with Timer():
    sum(range(5_000_000))
```

### The @contextmanager shortcut

`contextlib.contextmanager` turns a generator into a context manager. Code before `yield` is the setup, the yielded value is what `as` receives, and code after `yield` is the cleanup. Put the cleanup in `finally` so it runs even after an error.

```python
from contextlib import contextmanager

@contextmanager
def announce(name):
    print(f"Starting {name}")
    try:
        yield
    finally:
        print(f"Finished {name}")

with announce("training"):
    print("...working...")
```

Output:

```text
Starting training
...working...
Finished training
```

### Where you'll see them

Files, database connections and transactions (Day 58), locks in threaded code (Day 67), temporary directories, and in ML: `torch.no_grad()` turns off gradient tracking inside a `with` block (Day 94).


## Exercises

1. Use the `Timer` class to time sorting a list of a million random numbers.

<details><summary>Solution</summary>

```python
import random
data = [random.random() for _ in range(1_000_000)]
with Timer():
    data.sort()
```

</details>

2. Write a `@contextmanager` called `indented()` that prints "{" before the block and "}" after it.

<details><summary>Solution</summary>

```python
@contextmanager
def indented():
    print("{")
    try:
        yield
    finally:
        print("}")
```

</details>

3. Use `contextlib.suppress(FileNotFoundError)` to delete a file that may not exist.

<details><summary>Solution</summary>

```python
import contextlib
from pathlib import Path

with contextlib.suppress(FileNotFoundError):
    Path("maybe.txt").unlink()
```

</details>

## Project: Safe file writer and code timer

Build three context managers. `atomic_write` writes to a temporary file and only replaces the real file if everything succeeded, so a crash never leaves a half-written file. `Timer` measures named sections. `working_directory` temporarily changes the current folder and always changes it back.

Files in this folder: `day50_context_managers.py`.

### Key lines explained

- `yield f`: Everything before `yield` is setup; the `with` body runs at the yield; everything after is cleanup.
- `except BaseException: ... raise`: On any failure (even Ctrl+C) the temp file is deleted, then the error continues to the caller.
- `else: ... temp.replace(path)`: Only when the block finished cleanly does the new file replace the old one. `replace` is atomic on most systems: other programs see either the old or the new file, never half of one.
- `return False  (in __exit__)`: Tells Python not to suppress the exception. The timer reports the failure but doesn't hide it.
- `finally: os.chdir(previous)`: Guarantees the original folder is restored even if the block raises.

### Stretch goals

- Add a `backup(path)` context manager that copies a file first and restores it if the block fails.
- Use `Timer` to compare `sorted()` with your bubble sort from Day 36.

## Test it

- [ ] Check `report.txt` still holds lines 1 to 5 after the simulated crash.
- [ ] Check that no `.tmp` file is left behind.
- [ ] Raise an error inside `working_directory` and confirm the folder is still restored.
