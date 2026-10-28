# Day 48: Generators

**Level 3, Intermediate Python & Software Engineering.** Project: **Streaming log-file reader**

Generators are the easy way to write iterators. They also let you process data far bigger than your computer's memory, which matters a lot for ML datasets.

## Lesson

### yield

A function containing `yield` is a **generator function**. Calling it doesn't run the body; it returns a generator. Each `next()` runs the body until the next `yield`, hands out that value, and **pauses** there, remembering all its local variables.

```python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

for x in countdown(3):
    print(x)
```

Output:

```text
3
2
1
```

### Compare with yesterday

The `Countdown` iterator class from Day 47 needed 12 lines. The generator does the same in 4. Python creates `__iter__` and `__next__` for you.


### Lazy evaluation

Generators produce values only when asked. A list of a billion numbers wouldn't fit in memory; a generator that yields them one at a time uses almost none.

```python
def squares(limit):
    for n in range(limit):
        yield n * n

total = sum(squares(10_000_000))   # never builds a list
```

### Pipelines

Generators can feed each other, each doing one step. Data flows through one item at a time. This is the pattern behind streaming data loaders in ML.

```python
def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip("\n")

def non_empty(lines):
    for line in lines:
        if line.strip():
            yield line

for line in non_empty(read_lines("notes.txt")):
    print(line)
```

### Infinite generators

A generator can run forever (`while True: yield ...`) because it only produces what you ask for. Take what you need with a `break`, or with `itertools.islice` (Day 64).


## Exercises

1. Write a generator `fibonacci()` that yields Fibonacci numbers forever, and print the first 10.

<details><summary>Solution</summary>

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

for i, n in enumerate(fibonacci()):
    if i == 10:
        break
    print(n)
```

</details>

2. Write `chunks(items, size)` that yields lists of `size` items at a time.

<details><summary>Solution</summary>

```python
def chunks(items, size):
    for start in range(0, len(items), size):
        yield items[start:start + size]

print(list(chunks([1, 2, 3, 4, 5], 2)))   # [[1, 2], [3, 4], [5]]
```

</details>

3. Rewrite `[n * 2 for n in data]` as a generator expression and pass it to `max`.

<details><summary>Solution</summary>

```python
print(max(n * 2 for n in data))
```

</details>

## Project: Streaming log-file reader

Generate a large fake web-server log, then analyse it with a pipeline of generators: read lines, parse them, filter errors, and summarise. Memory use stays tiny no matter how big the file is.

Files in this folder: `day48_logs.py`.

### Key lines explained

- `errors = only_errors(parse(read_lines(LOG_FILE)))`: Builds the pipeline without reading anything yet. Each stage wraps the previous one.
- `for r in records: ... (in summarise)`: Looping pulls one line through all three stages at a time. Only one line is in memory at any moment, whether the file is 10 MB or 10 GB.
- `duration.removesuffix("ms")`: A string method (Python 3.9+) that removes the ending if present.
- `next(r for r in ... if r["status"] == 404)`: `next()` on a generator expression takes the first match and stops reading the file immediately.
- `random.Random(seed)`: A seeded generator makes the fake log identical on every computer.

### Stretch goals

- Add a stage that keeps only one day's records.
- Compare memory use with a version that reads the file into a list: use `tracemalloc` from the standard library.

## Test it

- [ ] Add a broken line to `server.log` by hand; it should be skipped.
- [ ] Increase the log to 2 million lines: memory use should stay the same.
- [ ] Count all 200 responses with the same pipeline idea.
