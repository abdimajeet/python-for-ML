# Day 51: Type hints and docstrings

**Level 3, Intermediate Python & Software Engineering.** Project: **Typed inventory system**

Type hints document what a function expects and returns, and let tools catch bugs before you run the code. Together with good docstrings, they make code much easier to read and maintain.

## Lesson

### Basic hints

Annotate parameters with `name: type` and the return value with `-> type`. Python itself **ignores** hints at runtime; they're for readers, editors and checkers.

```python
def greet(name: str, times: int = 1) -> str:
    return ", ".join([f"Hello {name}"] * times)

count: int = 0
```

### Collections, optional values and unions

Use the built-in names with brackets: `list[str]`, `dict[str, float]`, `tuple[int, int]`, `set[str]`. `X | None` means "an X or None"; `int | float` means either.

```python
def average(values: list[float]) -> float | None:
    if not values:
        return None
    return sum(values) / len(values)

def lookup(prices: dict[str, float], item: str) -> float | None:
    return prices.get(item)
```

### Checking with mypy

`pip install mypy`, then `mypy your_file.py`. It reads the hints and reports mistakes such as passing a str where an int is expected, or forgetting that a value might be None. VS Code's Python extension shows similar warnings as you type.

```python
result = average([1, 2, 3])
print(result + 1)
# mypy: Unsupported operand types for + ("None" and "int")
```

### Docstrings

A good docstring says what the function does, what each argument means and what it returns or raises. A common layout is the Google style shown below. Hints give the types; the docstring gives the meaning.

```python
def convert(amount: float, rate: float) -> float:
    """Convert an amount using an exchange rate.

    Args:
        amount: The amount in the source currency.
        rate: Units of target currency per unit of source currency.

    Returns:
        The converted amount, rounded to 2 decimals.

    Raises:
        ValueError: If amount is negative.
    """
```

### Your own classes as types

Any class can be used as a type: `def add(self, item: Item) -> None`. Libraries like pandas, NumPy and PyTorch all ship type hints, which is why your editor can autocomplete their methods.


## Exercises

1. Add type hints to `def initials(full_name): ...` from Day 21.

<details><summary>Solution</summary>

```python
def initials(full_name: str) -> str:
    ...
```

</details>

2. What's the type of a dict mapping student names to lists of scores?

<details><summary>Solution</summary>

```python
dict[str, list[int]]
```

</details>

3. Write a typed `find_index(items: list[str], target: str) -> int | None`, then run mypy on a call that adds 1 to the result without checking for None.

<details><summary>Solution</summary>

```python
def find_index(items: list[str], target: str) -> int | None:
    for i, item in enumerate(items):
        if item == target:
            return i
    return None

i = find_index(["a", "b"], "b")
if i is not None:          # mypy is satisfied once None is ruled out
    print(i + 1)
```

</details>

## Project: Typed inventory system

An inventory for a small shop with fully typed, documented classes and functions. Run `mypy` on it until it reports no issues, then deliberately introduce bugs and watch mypy catch them without running the program.

Files in this folder: `day51_inventory.py`.

### Key lines explained

- `from __future__ import annotations`: Lets hints refer to classes defined later in the file and keeps hints from costing anything at runtime.
- `self._items: dict[str, Item] = {}`: Annotating an empty container tells mypy what will go in it later.
- `def get(self, sku: str) -> Item | None:`: The return type warns every caller that the result might be None.
- `if item is not None:`: This check is what mypy wants to see before you use `item.value`. Remove it and run mypy.
- `Raises: in the docstring`: Hints can't describe exceptions, so the docstring does.

### Stretch goals

- Run `mypy --strict day51_inventory.py` and fix anything it reports.
- Add type hints to your Day 40 finance app's `finance.py`.

## Test it

- [ ] `pip install mypy` and run `mypy day51_inventory.py`: expect "Success".
- [ ] Change `shop.sell("C300", 3)` to `shop.sell("C300", "3")` and run mypy again before running Python.
- [ ] Delete the None check around `item.value` and see mypy's warning.
