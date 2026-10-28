# Day 27: List comprehensions

**Level 2, Core Python Programming.** Project: **Data filter toolkit**

List comprehensions build a new list from an existing one in a single, readable line. They are one of the most "Pythonic" features and appear everywhere in data code.

## Lesson

### The pattern

`[expression for item in iterable]` means: for each item, compute the expression and collect the results. It replaces the four-line "empty list, loop, append" pattern.

```python
# loop version
squares = []
for n in range(1, 6):
    squares.append(n * n)

# comprehension version
squares = [n * n for n in range(1, 6)]
print(squares)
```

Output:

```text
[1, 4, 9, 16, 25]
```

### Filtering with if

Add `if condition` at the end to keep only some items.

```python
words = ["apple", "fig", "banana", "kiwi"]
long_words = [w.upper() for w in words if len(w) > 4]
print(long_words)
```

Output:

```text
['APPLE', 'BANANA']
```

### Choosing a value with if/else

To transform every item differently, put a conditional expression at the **front**. Note the difference: an `if` at the end filters; an `if ... else` at the front chooses.

```python
marks = [45, 80, 62]
labels = ["pass" if m >= 50 else "fail" for m in marks]
print(labels)
```

### Generator expressions

Use round brackets instead of square ones and you get a **generator expression**, which produces values one at a time without building a list. Pass one straight into `sum`, `max`, `any` or `all`.

```python
total = sum(n * n for n in range(1_000_000))
print(any(m < 50 for m in marks))
```

### Keep them readable

A comprehension should fit on one line and be readable in one go. If you need several conditions, nested loops, or side effects like `print`, use a normal loop.


## Exercises

1. Make a list of the even numbers from 1 to 20.

<details><summary>Solution</summary>

```python
evens = [n for n in range(1, 21) if n % 2 == 0]
```

</details>

2. Given `names = [" amina", "OMAR ", "sara"]`, clean them into title case without spaces.

<details><summary>Solution</summary>

```python
clean = [n.strip().title() for n in names]
```

</details>

3. Convert a list of Celsius temperatures to Fahrenheit, rounded to 1 decimal.

<details><summary>Solution</summary>

```python
celsius = [0, 21.5, 37, -5]
fahrenheit = [round(c * 9 / 5 + 32, 1) for c in celsius]
```

</details>

4. Rewrite as a comprehension: a loop that appends `len(word)` for every word in a sentence.

<details><summary>Solution</summary>

```python
lengths = [len(word) for word in sentence.split()]
```

</details>

## Project: Data filter toolkit

Given an inventory as a list of dicts, write small functions that each answer one question using a comprehension, then a menu that lets the user filter products by category and maximum price.

Files in this folder: `day27_filter_toolkit.py`.

### Key lines explained

- `[p for p in products if p["stock"] > 0]`: Each helper is a one-line comprehension that answers one question. Small, named functions like these are easy to test and combine.
- `sorted(set(p["category"] for p in products))`: A generator expression feeds a set (removing duplicates), which is then sorted into a list.
- `{**p, "price": ...}`: `**p` copies every key from the original dict into a new one, then the price is overridden. The original products are never changed.
- `(category is None or p["category"] == category)`: If no category was given, the condition is True for everything, so that filter is effectively switched off.
- `category or None`: An empty string is falsy, so a blank answer becomes `None`, meaning "no filter".

### Stretch goals

- Add `cheapest(products, n)` that returns the n cheapest product names.
- Add a filter for minimum stock.

## Test it

- [ ] Leave both questions blank: all in-stock products appear.
- [ ] Choose `home` with a limit of 100.
- [ ] Choose a category that doesn't exist.
- [ ] Check that `PRODUCTS` prices are unchanged after calling `with_vat`.
