# Day 36: Problem solving

**Level 2, Core Python Programming.** Project: **Search and sort by hand**

Today is about thinking like a programmer: breaking down problems, writing classic algorithms by hand, and measuring how fast they are.

## Lesson

### A problem-solving routine

1) Restate the problem in your own words. 2) Work through a small example by hand. 3) Write the steps in plain language. 4) Turn the steps into code. 5) Test with normal cases, edge cases (empty, one item, duplicates) and large inputs.


### Linear search

Check each item in turn until you find the target. It works on any list, but in the worst case it checks every item.

```python
def linear_search(items, target):
    for i, item in enumerate(items):
        if item == target:
            return i
    return -1
```

### Binary search

On a **sorted** list, look at the middle item. If the target is smaller, discard the right half; if larger, discard the left. Each step halves the remaining list. It's the strategy from the Day 9 guessing game.

```python
def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
```

### Big-O: how work grows

Big-O describes how the number of steps grows with input size _n_. Linear search is **O(n)**: double the list, double the work. Binary search is **O(log n)**: a million items need only about 20 steps. Simple sorts like bubble sort are **O(n²)**: double the list, four times the work. Python's built-in `sorted` is **O(n log n)**.


### Bubble sort

Repeatedly walk through the list swapping neighbours that are in the wrong order. Large values "bubble" to the end. You'll never use it in real code (use `sorted`), but writing it trains your thinking about loops and indexes.


## Exercises

1. By hand: how many steps would binary search need, at most, for 1,000 items? For 1,000,000?

<details><summary>Solution</summary>

```python
# 2**10 = 1024, so about 10 steps for 1,000.
# 2**20 is about 1,000,000, so about 20 steps.
```

</details>

2. Write `find_max(numbers)` without using `max()`.

<details><summary>Solution</summary>

```python
def find_max(numbers):
    best = numbers[0]
    for n in numbers[1:]:
        if n > best:
            best = n
    return best
```

</details>

3. Write `has_duplicates(items)` two ways: with nested loops (O(n²)) and with a set (O(n)).

<details><summary>Solution</summary>

```python
def has_duplicates_slow(items):
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

def has_duplicates_fast(items):
    return len(set(items)) != len(items)
```

</details>

## Project: Search and sort by hand

Implement linear search, binary search, bubble sort and selection sort, each counting its comparisons. Then race them on lists of growing size and see Big-O with your own eyes.

Files in this folder: `day36_algorithms.py`.

### Key lines explained

- `items = items[:]`: Copying first means the function doesn't change the caller's list. Each sort gets the same unsorted data.
- `items[i], items[i + 1] = items[i + 1], items[i]`: Tuple unpacking swaps two items in one line, with no temporary variable.
- `if not swapped: break`: An optimisation: a pass with no swaps means the list is sorted.
- `assert bubbled == selected == ordered`: `assert` stops the program if the condition is False. It's a quick self-check that your algorithms are correct, and a preview of testing on Day 52.
- `time.perf_counter()`: A precise clock for measuring how long code takes. More on performance on Day 71.

### Stretch goals

- Add insertion sort.
- Plot the step counts later, on Day 78, to see the curves.

## Test it

- [ ] Search for a value that isn't in the list.
- [ ] Sort an empty list and a one-item list.
- [ ] Look at the table: when n grows 10×, how much do linear and bubble sort steps grow?
