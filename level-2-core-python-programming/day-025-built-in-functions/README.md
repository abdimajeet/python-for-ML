# Day 25: Built-in functions

**Level 2, Core Python Programming.** Project: **Class report card generator**

Python's built-in functions replace many hand-written loops. Today you learn the ones you'll use constantly, including in data science.

## Lesson

### enumerate

`enumerate(items)` gives (index, item) pairs. Use `start=1` for human numbering. It replaces manual counters.

```python
for i, fruit in enumerate(["apple", "mango"], start=1):
    print(i, fruit)
```

Output:

```text
1 apple
2 mango
```

### zip

`zip(a, b)` pairs items from several sequences by position. It stops at the shortest one. `dict(zip(keys, values))` builds a dict from two lists.

```python
names = ["Amina", "Omar"]
scores = [88, 72]
for name, score in zip(names, scores):
    print(name, score)
print(dict(zip(names, scores)))
```

### map and filter

`map(func, items)` applies a function to every item. `filter(func, items)` keeps items where the function returns True. Both are **lazy**: they produce values on demand, so wrap them in `list()` to see the result. Note that you pass the function itself, `int`, not a call, `int()`.

```python
nums = list(map(int, "4,8,15".split(",")))
print(nums)

def is_positive(n):
    return n > 0

print(list(filter(is_positive, [3, -1, 0, 7])))
```

Output:

```text
[4, 8, 15]
[3, 7]
```

### any and all

`any(items)` is True if at least one item is truthy; `all(items)` is True if every item is.

```python
marks = [55, 72, 49]
print(all([m >= 50 for m in marks]))   # False
print(any([m >= 70 for m in marks]))   # True
```

### Others worth knowing

`sum`, `min`, `max`, `len`, `sorted`, `reversed`, `round`, `abs`, `range`, `isinstance(x, int)` and `type`. Run `help(zip)` in the interpreter to read any built-in's documentation.


## Exercises

1. Print a numbered list of three goals starting at 1 using `enumerate`.

<details><summary>Solution</summary>

```python
goals = ["Learn Python", "Build projects", "Study ML"]
for i, goal in enumerate(goals, start=1):
    print(f"{i}. {goal}")
```

</details>

2. Given `prices = ["3.5", "2", "10.25"]`, compute the total using `map`.

<details><summary>Solution</summary>

```python
prices = ["3.5", "2", "10.25"]
print(sum(map(float, prices)))   # 15.75
```

</details>

3. Check whether every character of a code like `"A1B2"` is a letter or digit using `all`.

<details><summary>Solution</summary>

```python
code = "A1B2"
print(all([ch.isalnum() for ch in code]))
```

</details>

## Project: Class report card generator

You have parallel lists of student names and their marks in three subjects. Combine them with `zip`, number them with `enumerate`, and use `all`, `any`, `map` and `filter` to produce a report card and a class summary.

Files in this folder: `day25_report_cards.py`.

### Key lines explained

- `enumerate(zip(names, maths, english, science), start=1)`: `zip` makes one tuple per student; `enumerate` numbers them. The loop target `number, (name, m, e, s)` unpacks both levels at once.
- `all(map(passed, marks))`: `map` runs `passed` on each mark, giving True/False values, and `all` checks them. Note `passed` without parentheses: we hand over the function itself.
- `[subj for subj, mark in zip(...) if not passed(mark)]`: A list comprehension: a preview of Day 27. It builds the list of failed subjects in one line.
- `averages.index(max(averages))`: Finds the position of the highest average so we can look up the matching name.
- `len(list(filter(passed, maths)))`: `filter` is lazy, so we turn it into a list before counting.

### Stretch goals

- Add a fourth subject. How many lines did you have to change?
- Print the subject with the highest class average.

## Test it

- [ ] Check one student's average by hand.
- [ ] Make one list shorter than the others. What does `zip` do? Why is that dangerous?
- [ ] Change `PASS_MARK` to 60 and check the notes update.
