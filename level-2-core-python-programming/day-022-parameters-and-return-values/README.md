# Day 22: Parameters and return values

**Level 2, Core Python Programming.** Project: **Shipping cost calculator**

Today you learn the different ways to pass arguments, how default values work, and how to return more than one value.

## Lesson

### Positional and keyword arguments

Arguments match parameters by position, or you can name them with **keyword arguments**. Keywords make calls easier to read and let you pass them in any order. Positional arguments must come before keyword ones.

```python
def describe(name, age, city):
    print(f"{name}, {age}, from {city}")

describe("Amina", 24, "Hargeisa")
describe(city="Nairobi", name="Omar", age=31)
```

### Default values

A parameter with `=value` in the definition is optional. If the caller leaves it out, the default is used. Parameters with defaults must come after those without.

```python
def power(base, exponent=2):
    return base ** exponent

print(power(5))      # 25
print(power(2, 10))  # 1024
```

### Returning several values

Return several values separated by commas. Python packs them into a tuple, and the caller can unpack them (Day 14).

```python
def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([4, 9, 1, 7])
print(low, high)
```

Output:

```text
1 9
```

### Early return and guard clauses

You can `return` early when input is bad. This keeps the main logic unindented and easy to read.

```python
def average(numbers):
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)
```

### The mutable default trap

Never use a list or dict as a default value, like `def add(item, items=[])`. The default is created **once**, when the function is defined, and shared between calls. Use `None` and create the list inside: `if items is None: items = []`.


## Exercises

1. Write `greet(name, greeting="Hello")` and call it once with and once without the greeting.

<details><summary>Solution</summary>

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Sara"))
print(greet("Sara", greeting="Salaam"))
```

</details>

2. Write `divide_with_remainder(a, b)` that returns the quotient and remainder. Unpack the result.

<details><summary>Solution</summary>

```python
def divide_with_remainder(a, b):
    return a // b, a % b

q, r = divide_with_remainder(17, 5)
print(q, r)   # 3 2
```

</details>

3. Write `stats(numbers)` returning count, total and average, returning `(0, 0, 0)` for an empty list.

<details><summary>Solution</summary>

```python
def stats(numbers):
    if not numbers:
        return 0, 0, 0
    total = sum(numbers)
    return len(numbers), total, total / len(numbers)
```

</details>

## Project: Shipping cost calculator

Write functions that price a parcel by weight and distance, with an optional express service and an optional insurance rate, and estimate the delivery time. The main program asks for details and prints a quote.

Files in this folder: `day22_shipping.py`.

Sample output:

```text
Parcel weight in kg: 3
Distance in km: 1200
Express delivery? (y/n): n
Add insurance? (y/n): n

Standard delivery
Price:    68.60
Arrives:  in about 3 working day(s)
(Express would cost 102.90 and take 1 day(s))
```

### Key lines explained

- `express=False, insured_value=0`: Defaults make the common case short: `shipping_cost(2, 100)` works, and callers add options only when needed.
- `days = max(1, days // 2)`: `max` picks the larger value, so express is never quoted as 0 days.
- `return price, days`: Two values come back as a tuple. `price, days = quote(...)` unpacks them.
- `quote(weight, distance, express=express, insured_value=insured)`: Keyword arguments make it clear which value is which. The later call uses positions, which works but is harder to read. Compare them.
- `"Express" if express else "Standard"`: The conditional expression from Day 20, choosing a word in one line.

### Stretch goals

- Add a `max_weight=30` parameter and return `None` for parcels that are too heavy.
- Add a discount parameter for business customers.

## Test it

- [ ] Check one price by hand: 5 + 3 × 1.2 + 1200 × 0.05 = 68.60.
- [ ] A short distance with express should never give 0 days.
- [ ] In the interpreter, call `shipping_cost(1, 10)` and `shipping_cost(1, 10, True)` directly.
