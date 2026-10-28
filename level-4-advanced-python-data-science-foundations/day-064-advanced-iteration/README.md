# Day 64: Advanced iteration

**Level 4, Advanced Python & Data Science Foundations.** Project: **Log analysis pipeline**

The `itertools` module is a toolbox of fast, memory-efficient building blocks for iteration. Combined with generators, it lets you build powerful data pipelines in a few lines.

## Lesson

### Infinite and slicing tools

`count(start, step)` counts forever, `cycle(items)` repeats forever, `repeat(x, n)` repeats a value. `islice(iterable, stop)` takes the first few items from any iterator, even an infinite one.

```python
from itertools import count, cycle, islice

print(list(islice(count(10, 5), 4)))
print(list(islice(cycle("AB"), 5)))
```

Output:

```text
[10, 15, 20, 25]
['A', 'B', 'A', 'B', 'A']
```

### Combining iterators

`chain(a, b)` joins iterables end to end. `zip_longest` zips to the longest input, filling gaps. `pairwise(items)` gives neighbouring pairs, useful for differences between consecutive values. `batched(items, n)` (Python 3.12+) gives chunks of size n.

```python
from itertools import chain, pairwise

print(list(chain([1, 2], (3, 4))))
prices = [10, 12, 9, 15]
print([b - a for a, b in pairwise(prices)])
```

Output:

```text
[1, 2, 3, 4]
[2, -3, 6]
```

### Grouping and accumulating

`groupby(items, key)` groups **consecutive** items with the same key, so sort by the key first. `accumulate` produces running totals (or running maximums).

```python
from itertools import groupby, accumulate

words = sorted(["apple", "avocado", "banana", "blueberry", "cherry"])
for letter, group in groupby(words, key=lambda w: w[0]):
    print(letter, list(group))

print(list(accumulate([5, 3, 8])))
```

### Combinatorics

`product` (every combination of several lists, like nested loops), `permutations` (orderings), `combinations` (choices without order). In ML, `product` is how a grid search tries every combination of settings (Day 92).

```python
from itertools import product, combinations

print(list(product([0.01, 0.1], [16, 32])))
print(list(combinations("ABC", 2)))
```

### yield from

Inside a generator, `yield from other` yields every item of another iterable. It's a clean way to flatten or delegate.


## Exercises

1. Print the first 10 square numbers using `count`, a generator expression and `islice`.

<details><summary>Solution</summary>

```python
from itertools import count, islice
print(list(islice((n * n for n in count(1)), 10)))
```

</details>

2. Given daily step counts, print the running total for the week with `accumulate`.

<details><summary>Solution</summary>

```python
from itertools import accumulate
steps = [4000, 7500, 6200, 9000, 3000, 12000, 8000]
print(list(accumulate(steps)))
```

</details>

3. List every way to choose 2 people from a team of 4 to pair-program.

<details><summary>Solution</summary>

```python
from itertools import combinations
for pair in combinations(["Amina", "Omar", "Sara", "Yusuf"], 2):
    print(pair)
```

</details>

## Project: Log analysis pipeline

Analyse a stream of application events with generators and itertools: merge several log sources, parse them, group events into user sessions, find the busiest minutes, and compute session statistics, all without loading everything into memory.

Files in this folder: `day64_pipeline.py`.

### Key lines explained

- `chain.from_iterable(sources)`: Joins three generators into one stream without building a combined list.
- `groupby(by_user, key=lambda e: e["user"])`: Because the events were sorted by user first, each group is one user's complete history in time order.
- `if session and event["time"] - session[-1]["time"] > gap:`: Session splitting: more than 5 minutes of silence starts a new session. Analytics tools use the same rule.
- `Counter(... for a, b in pairwise(s))`: `pairwise` gives each event with the next one, so we can count what users do after searching.
- `accumulate(hourly[h] for h in hours)`: Running totals per hour from a generator expression.

### Stretch goals

- Compute the average time between events per user with `pairwise`.
- Use `itertools.batched` (Python 3.12+) to write events to files of 100 lines each.

## Test it

- [ ] Change the session gap to 1 minute: how does the session count change?
- [ ] Feed in only one source.
- [ ] Check one user's sessions by printing them.
