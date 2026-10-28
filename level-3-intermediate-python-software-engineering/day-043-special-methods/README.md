# Day 43: Special methods

**Level 3, Intermediate Python & Software Engineering.** Project: **Fraction and vector classes**

Special methods, the ones with double underscores ("dunder" methods), let your objects work with Python's built-in syntax: `print`, `==`, `+`, `len` and more.

## Lesson

### __str__ and __repr__

`__str__` returns the friendly text used by `print()` and `str()`. `__repr__` returns an unambiguous, developer-facing version used in the interpreter and inside lists; ideally it looks like the code that would recreate the object.

```python
class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __str__(self):
        return f"({self.x}, {self.y})"

p = Point(2, 3)
print(p)          # uses __str__
print([p])        # lists use __repr__
```

Output:

```text
(2, 3)
[Point(2, 3)]
```

### Equality

By default `==` on two objects checks if they are the _same object_. Define `__eq__` to compare their values instead. Return `NotImplemented` for types you don't know how to compare.

```python
    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y
```

### Arithmetic operators

`__add__` runs for `+`, `__sub__` for `-`, `__mul__` for `*`, `__truediv__` for `/`. They should return a **new** object rather than change the existing one. `__lt__` (less than) makes `<` and `sorted()` work.

```python
    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)

print(Point(1, 2) + Point(3, 4))
```

Output:

```text
(4, 6)
```

### Other useful ones

`__len__` for `len()`, `__getitem__` for `obj[i]`, `__contains__` for `in`, `__bool__` for truthiness, `__abs__` for `abs()`, `__hash__` so objects can go in sets and be dict keys. This is how NumPy arrays make `a + b` add whole arrays: their class defines `__add__`.


## Exercises

1. Add a `__repr__` to the Rectangle class from Day 42.

<details><summary>Solution</summary>

```python
    def __repr__(self):
        return f"Rectangle({self.width}, {self.height})"
```

</details>

2. Make rectangles comparable by area with `__lt__`, then sort a list of them.

<details><summary>Solution</summary>

```python
    def __lt__(self, other):
        return self.area() < other.area()

print(sorted([Rectangle(5, 5), Rectangle(1, 2), Rectangle(3, 3)]))
```

</details>

3. Write a `Money` class holding an amount and currency, where `+` raises ValueError for different currencies.

<details><summary>Solution</summary>

```python
class Money:
    def __init__(self, amount, currency):
        self.amount, self.currency = amount, currency

    def __add__(self, other):
        if self.currency != other.currency:
            raise ValueError("Can't add different currencies")
        return Money(self.amount + other.amount, self.currency)

    def __repr__(self):
        return f"Money({self.amount}, '{self.currency}')"
```

</details>

## Project: Fraction and vector classes

Build two number-like classes. `Fraction` stores exact fractions in lowest terms and supports + - * /, comparison and printing. `Vector` supports addition, scaling, dot product, length and indexing: the same operations NumPy performs on arrays, which you'll meet on Day 73.

Files in this folder: `day43_numbers.py`.

Sample output:

```text
1/2 + 1/3 = 5/6
1/2 - 1/3 = 1/6
1/2 * 1/3 = 1/6
1/2 / 1/3 = 3/2
Sorted: [Fraction(1, 3), Fraction(1, 2), Fraction(2, 3), Fraction(3, 4)]
6/8 == 3/4: True
As a float: 0.875

v + w = Vector(4, 2)
3 * v = Vector(9, 12)
v · w = -5
|v|   = 5.0
v[0]  = 3  len(v) = 2
```

### Key lines explained

- `math.gcd(numerator, denominator)`: The greatest common divisor. Dividing both parts by it stores every fraction in lowest terms, so 6/8 becomes 3/4 and equality just compares the parts.
- `return Fraction(...)`: Every operator returns a brand-new object. The originals never change, just like ints.
- `for a, b in zip(self, other)`: Because Vector defines `__len__` and `__getitem__`, Python can loop over it, so `zip` works on vectors directly.
- `__rmul__ = __mul__`: `3 * v` first asks int how to multiply by a Vector; int doesn't know, so Python tries `v.__rmul__(3)`.
- `def _check(self, other):`: A leading underscore marks a helper meant for use inside the class only. More on this on Day 46.

### Stretch goals

- Let Fractions add to plain ints: `Fraction(1, 2) + 1`.
- Add a `normalised()` method to Vector that returns a vector of length 1.

## Test it

- [ ] `Fraction(1, 0)` should raise ZeroDivisionError.
- [ ] `Fraction(2, -4)` should print `-1/2`.
- [ ] Adding vectors of different lengths should raise ValueError.
- [ ] Compare with Python's own `fractions.Fraction` for a few sums.
