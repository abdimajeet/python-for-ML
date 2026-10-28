# Day 63: Design patterns

**Level 4, Advanced Python & Data Science Foundations.** Project: **Notification system**

Design patterns are proven solutions to problems that come up again and again. Today you learn three of the most useful, written the Python way: strategy, factory and observer.

## Lesson

### What a pattern is

A pattern is a named, reusable design idea, not code to copy. Knowing them gives you a vocabulary ("use a strategy here") and helps you recognise designs in libraries. Many patterns from Java books become much simpler in Python because functions are objects.


### Strategy

Make an algorithm swappable by passing it in. In Python a strategy is often just a function. You've used it already: `sorted(key=...)` takes a strategy for comparison.

```python
def flat_shipping(weight): return 5.0
def weight_shipping(weight): return 2.0 + weight * 1.5

def checkout(total, weight, shipping=flat_shipping):
    return total + shipping(weight)

print(checkout(50, 4, shipping=weight_shipping))
```

### Factory

A factory creates objects without the caller knowing which class it gets. A dict mapping names to classes is a simple, extensible factory. It's how config files can say `"model": "random_forest"` and the code builds the right object.

```python
SHAPES = {"circle": Circle, "square": Square}

def make_shape(kind, *args):
    return SHAPES[kind](*args)
```

### Observer

One object (the **subject**) keeps a list of **observers** and notifies them when something happens. The subject doesn't need to know what the observers do. Buttons in user interfaces, event systems and ML training callbacks ("after each epoch, save a checkpoint") work this way.

```python
class Button:
    def __init__(self):
        self.listeners = []

    def on_click(self, func):
        self.listeners.append(func)

    def click(self):
        for listener in self.listeners:
            listener()

b = Button()
b.on_click(lambda: print("Saved!"))
b.click()
```

### Don't overuse them

Apply a pattern when it solves a real problem you have, such as needing to add new types without editing old code. A pattern used everywhere "just in case" makes simple code complicated.


## Exercises

1. Write two discount strategies as functions and a `price_after(total, strategy)` function.

<details><summary>Solution</summary>

```python
def no_discount(total): return total
def ten_percent(total): return total * 0.9

def price_after(total, strategy=no_discount):
    return round(strategy(total), 2)

print(price_after(80, ten_percent))
```

</details>

2. Make a factory that turns `"json"` or `"csv"` into the right saver function.

<details><summary>Solution</summary>

```python
import csv, json

def save_json(rows, path):
    with open(path, "w") as f:
        json.dump(rows, f)

def save_csv(rows, path):
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys())
        w.writeheader()
        w.writerows(rows)

SAVERS = {"json": save_json, "csv": save_csv}
SAVERS["csv"]([{"a": 1}], "out.csv")
```

</details>

## Project: Notification system

Build an order-tracking system for a shop. When an order's status changes, every subscribed observer is told. Notification channels (email, SMS, push) are created by a factory from a config, and each customer chooses a message-formatting strategy (short or detailed).

Files in this folder: `day63_notifications.py`.

### Key lines explained

- `Formatter = Callable[["Order", str, str], str]`: A type alias: any function taking an order and two strings and returning a string can be a formatting strategy.
- `CHANNELS = {"email": EmailChannel, ...} / make_channel`: The factory: configuration text ("sms") becomes an object. New channels mean one new class and one dict entry.
- `for observer in self._observers: observer(self, old, new)`: The order doesn't know or care what observers do: send messages, write logs, update a dashboard.
- `def notifier(self) -> Observer: ... return notify`: A closure: the returned function remembers this customer's channels and formatter.
- `class AuditLog: def __call__(...)`: Defining `__call__` makes an object callable like a function, so a stateful object can be an observer too.

### Stretch goals

- Add an `unsubscribe` method and let customers opt out after delivery.
- Add a `WebhookChannel` that would POST JSON to a URL (print the JSON instead).

## Test it

- [ ] Trace one status change by hand: which functions run, in which order?
- [ ] Give Omar the detailed formatter and see the SMS get truncated.
- [ ] Set an invalid status and check that no observer was notified.
