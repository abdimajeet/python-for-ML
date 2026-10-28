# Day 62: Advanced OOP design

**Level 4, Advanced Python & Data Science Foundations.** Project: **Pluggable payment processors**

Today you learn three modern OOP tools: dataclasses (less boilerplate), abstract base classes (enforced interfaces) and protocols (duck typing that type checkers understand).

## Lesson

### dataclasses

`@dataclass` writes `__init__`, `__repr__` and `__eq__` for you from annotated class attributes. Use `field(default_factory=list)` for mutable defaults. `frozen=True` makes instances immutable (and hashable). `order=True` adds comparisons.

```python
from dataclasses import dataclass, field

@dataclass
class Student:
    name: str
    scores: list[int] = field(default_factory=list)
    active: bool = True

    @property
    def average(self) -> float:
        return sum(self.scores) / len(self.scores) if self.scores else 0.0

s = Student("Amina", [88, 92])
print(s)
print(s == Student("Amina", [88, 92]))
```

Output:

```text
Student(name='Amina', scores=[88, 92], active=True)
True
```

### Abstract base classes

`ABC` plus `@abstractmethod` defines an interface: subclasses **must** implement those methods, or Python refuses to create them. This catches missing methods immediately, not later in production.

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Square(Shape):
    def __init__(self, side):
        self.side = side
    def area(self):
        return self.side ** 2

Square(3).area()
Shape()     # TypeError: Can't instantiate abstract class Shape
```

### Protocols

A `Protocol` describes the methods something must have, without requiring inheritance. Any class with matching methods counts, which is Python's duck typing, but mypy can now check it.

```python
from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> str: ...

def render(item: Drawable) -> None:
    print(item.draw())

class Circle:                  # doesn't inherit from Drawable
    def draw(self) -> str:
        return "○"

render(Circle())               # fine for Python and for mypy
```

### Which to use

Use a **dataclass** for classes that mainly hold data. Use an **ABC** when you own a family of classes and want to force them to implement methods. Use a **Protocol** when you accept any object with the right methods, including ones you didn't write. scikit-learn uses the protocol idea: anything with `fit` and `predict` works as a model.


## Exercises

1. Write a frozen dataclass `Point(x, y)` and try to change `x`.

<details><summary>Solution</summary>

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: float
    y: float

p = Point(1, 2)
p.x = 5   # dataclasses.FrozenInstanceError
```

</details>

2. Make a dataclass `Product` with `order=True` and sort a list of them. Which field decides the order?

<details><summary>Solution</summary>

```python
@dataclass(order=True)
class Product:
    price: float
    name: str

print(sorted([Product(3.5, "tea"), Product(1.2, "pen")]))
# Fields are compared in order, so price first, then name.
```

</details>

3. Create an ABC `Animal` with an abstract `sound()`, and a subclass that forgets to implement it. What happens?

<details><summary>Solution</summary>

```python
class Animal(ABC):
    @abstractmethod
    def sound(self): ...

class Fish(Animal):
    pass

Fish()   # TypeError: Can't instantiate abstract class Fish ... 'sound'
```

</details>

## Project: Pluggable payment processors

Design a checkout that can take payments by card, mobile money or bank transfer. Each processor implements an abstract `PaymentProcessor` interface; payments and receipts are dataclasses; adding a new payment method needs no changes to the checkout.

Files in this folder: `day62_payments.py`.

### Key lines explained

- `@dataclass(frozen=True) class Payment`: A payment shouldn't change once created, so it's frozen. The dataclass writes the constructor and repr.
- `reference: str = field(default_factory=...)`: `default_factory` runs once per receipt, so each one gets its own random reference and timestamp.
- `class PaymentProcessor(ABC) ... @abstractmethod`: Every processor must implement `validate` and `fee`. Forget one and Python refuses to create it.
- `def pay(self, payment):`: The **template method** pattern: the base class fixes the order of steps, and subclasses fill in the details.
- `PROCESSORS = {p.name: p for p in (...)}`: Adding a new payment method means writing one class and adding it here. `checkout` never changes.

### Stretch goals

- Add a `PayPalProcessor` that requires an email address.
- Write pytest tests for each processor's validation rules.

## Test it

- [ ] The two invalid attempts (bad card checksum, over the mobile money limit) and the unknown method should fail with clear messages.
- [ ] Create a processor subclass without `fee` and read the error.
- [ ] Try changing `payment.amount` after creating it.
