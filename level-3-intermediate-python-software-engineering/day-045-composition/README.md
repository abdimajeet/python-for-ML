# Day 45: Composition

**Level 3, Intermediate Python & Software Engineering.** Project: **Shopping cart with products**

Composition builds objects out of other objects. It's often more flexible than inheritance, and it's how most real systems are put together.

## Lesson

### Has-a versus is-a

Inheritance models **is-a** (a cat is an animal). Composition models **has-a**: a car _has an_ engine, a cart _has_ items. In code, composition just means an object stores other objects as attributes.

```python
class Engine:
    def __init__(self, horsepower):
        self.horsepower = horsepower

    def start(self):
        return "Vroom"

class Car:
    def __init__(self, model, engine):
        self.model = model
        self.engine = engine          # a Car has an Engine

    def start(self):
        return f"{self.model}: {self.engine.start()}"

print(Car("Corolla", Engine(130)).start())
```

### Delegation

The outer object passes work to the objects it contains, as `Car.start` does above. Each class stays small and focused on one job.


### Why prefer composition

You can swap parts at runtime (a different engine, a different discount rule), test each part alone, and avoid deep inheritance trees. A common guideline is "favour composition over inheritance".


### Aggregating many objects

Often one object holds a list or dict of others and offers methods that work across them: a cart totals its line items, a library searches its books. Defining `__len__` and `__iter__` on the container makes it feel built-in.

```python
class Playlist:
    def __init__(self):
        self.songs = []

    def add(self, song):
        self.songs.append(song)

    def __len__(self):
        return len(self.songs)

    def __iter__(self):
        return iter(self.songs)
```

## Exercises

1. Make `Address` and `Person` classes where a person has an address, and print a person's city through it.

<details><summary>Solution</summary>

```python
class Address:
    def __init__(self, street, city):
        self.street, self.city = street, city

class Person:
    def __init__(self, name, address):
        self.name, self.address = name, address

p = Person("Amina", Address("1 Main Rd", "Hargeisa"))
print(p.address.city)
```

</details>

2. Give the Car a `Radio` part and a `play()` method that delegates to it.

<details><summary>Solution</summary>

```python
class Radio:
    def play(self, station):
        return f"Playing {station}"

class Car:
    def __init__(self, model, engine, radio):
        self.model, self.engine, self.radio = model, engine, radio

    def play(self, station):
        return self.radio.play(station)
```

</details>

## Project: Shopping cart with products

Build an online-shop cart from small classes: `Product`, `LineItem` (a product and a quantity), discount rules, and a `Cart` that composes them. Discounts are separate objects you can plug in, which is something inheritance alone can't do neatly.

Files in this folder: `day45_cart.py`.

Sample output:

```text
7 items in the cart

  4 x Green tea (box)       18.00
  1 x Ceramic mug            9.00
  2 x Honey jar             12.50
Subtotal                    39.50
Buy 3 get 1 free on TEA     -4.50
10% off everything          -3.95
TOTAL                       31.05
```

### Key lines explained

- `self.items = {}  # sku -> LineItem`: The cart **has** line items, and each line item **has** a product. Nobody inherits from anybody.
- `class PercentOff / class BuyXGetOneFree`: Two unrelated classes that both offer `amount(cart)` and `describe()`. The cart doesn't care which kind it gets. This is called **duck typing**: if it has the right methods, it works.
- `d.amount(self)`: The cart passes itself to each discount, so a discount can look at whatever it needs.
- `max(0, self.subtotal() - self.discount_total())`: A guard so stacked discounts can never make the total negative.
- `def __len__(self):`: `len(cart)` counts every unit, not just distinct products.

### Stretch goals

- Add a `FixedAmountOff(5, minimum=30)` discount that only applies over a minimum spend.
- Add stock levels to Product and refuse to add more than is available.

## Test it

- [ ] Remove items until a line disappears.
- [ ] Apply both discounts to an empty cart: the total should be 0.
- [ ] Check the receipt numbers by hand.
