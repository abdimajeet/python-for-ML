// Level 4 lessons: Days 61-80. Code fields use String.raw so backslashes stay literal.
window.LESSONS = window.LESSONS || {};
(function (L) {
const R = String.raw;

L[61] = {
  intro: "Level 4 starts by going deeper into functions: closures, partial application, caching, and keyword-only arguments. These ideas appear all over data-science libraries.",
  lesson: [
    {h: "Closures revisited",
     p: "A function defined inside another can use the outer function's variables, even after the outer function has returned. The inner function \"closes over\" them. To <b>change</b> such a variable from inside, declare it <code>nonlocal</code>.",
     code: R`def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()
counter(); counter()
print(counter())`,
     out: "3"},
    {h: "functools.partial",
     p: "<code>partial(func, some_args)</code> creates a new function with some arguments already filled in. It's a tidy way to make specialised versions of general functions, for example a key function or a callback.",
     code: R`from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube = partial(power, exponent=3)
print(square(5), cube(2))`,
     out: "25 8"},
    {h: "Caching with lru_cache and cache",
     p: "<code>@functools.cache</code> remembers the result for each set of arguments, so repeated calls return instantly. This technique is called <b>memoisation</b>. <code>@lru_cache(maxsize=1000)</code> keeps only the most recently used results. Arguments must be hashable (no lists or dicts). <code>.cache_info()</code> shows hits and misses."},
    {h: "Keyword-only and positional-only parameters",
     p: "Parameters after a bare <code>*</code> must be passed by keyword, which makes calls self-explaining. Parameters before a <code>/</code> must be passed by position. You'll see both in library signatures, such as <code>sorted(iterable, /, *, key=None, reverse=False)</code>.",
     code: R`def train(data, *, epochs=10, learning_rate=0.01):
    ...

train(data, epochs=5)          # fine
train(data, 5)                 # TypeError: epochs is keyword-only`},
    {h: "Higher-order functions",
     p: "A function that takes or returns functions is a <b>higher-order function</b>. You've used <code>map</code>, <code>sorted(key=...)</code> and decorators. <code>functools.reduce</code> combines all items into one value, and the <code>operator</code> module offers ready-made functions like <code>operator.add</code> and <code>operator.itemgetter(\"score\")</code>."}
  ],
  exercises: [
    {q: "Write <code>make_multiplier(n)</code> using a closure, and create <code>triple</code> from it.", sol: R`def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply

triple = make_multiplier(3)
print(triple(7))   # 21`},
    {q: "Use <code>partial</code> to make <code>parse_binary</code> from <code>int</code> so that <code>parse_binary(\"1010\")</code> returns 10.", sol: R`from functools import partial
parse_binary = partial(int, base=2)
print(parse_binary("1010"))`},
    {q: "Use <code>functools.reduce</code> and <code>operator.mul</code> to multiply all numbers in a list.", sol: R`from functools import reduce
import operator
print(reduce(operator.mul, [2, 3, 4], 1))   # 24`}
  ],
  project: {
    title: "Memoised Fibonacci and speed comparison",
    brief: "Compare four ways of computing Fibonacci numbers: naive recursion, a hand-written cache using a closure, <code>@functools.cache</code>, and a simple loop. Count the function calls and time each one to see how much caching changes everything.",
    file: "day61_fibonacci.py",
    code: R`# day61_fibonacci.py
# Four Fibonacci implementations, compared by calls and time.

import functools
import time


def make_counted(func):
    """Wrap func so we can count how many times it is called."""
    def wrapper(n):
        wrapper.calls += 1
        return func(n)
    wrapper.calls = 0
    return wrapper


# 1. Naive recursion: recomputes the same values again and again
@make_counted
def fib_naive(n):
    return n if n < 2 else fib_naive(n - 1) + fib_naive(n - 2)


# 2. A hand-made cache inside a closure
def make_memo_fib():
    memo = {}

    @make_counted
    def fib(n):
        if n not in memo:
            memo[n] = n if n < 2 else fib(n - 1) + fib(n - 2)
        return memo[n]
    return fib

fib_closure = make_memo_fib()


# 3. The standard library does it for us
@functools.cache
def fib_cached(n):
    return n if n < 2 else fib_cached(n - 1) + fib_cached(n - 2)


# 4. No recursion at all
def fib_loop(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def timed(func, n):
    start = time.perf_counter()
    result = func(n)
    return result, (time.perf_counter() - start) * 1000


def main():
    n = 30
    print(f"Computing fib({n}) four ways\n")
    print(f"{'method':<16}{'result':>10}{'calls':>12}{'ms':>10}")

    result, ms = timed(fib_naive, n)
    print(f"{'naive':<16}{result:>10}{fib_naive.calls:>12,}{ms:>10.2f}")

    result, ms = timed(fib_closure, n)
    print(f"{'closure memo':<16}{result:>10}{fib_closure.calls:>12,}{ms:>10.2f}")

    result, ms = timed(fib_cached, n)
    info = fib_cached.cache_info()
    print(f"{'functools.cache':<16}{result:>10}{info.misses:>12,}{ms:>10.2f}")

    result, ms = timed(fib_loop, n)
    print(f"{'loop':<16}{result:>10}{'-':>12}{ms:>10.2f}")

    print(f"\nWith caching, fib(300) = {fib_cached(300)}")
    print("Cache stats:", fib_cached.cache_info())


if __name__ == "__main__":
    main()`,
    explain: [
      ["wrapper.calls += 1", "A decorator from Day 49, reused here to count calls. The naive version makes over a million calls for n = 30."],
      ["memo = {} inside make_memo_fib", "The dictionary lives in the enclosing function. The inner <code>fib</code> closes over it, so the cache survives between calls but isn't a global."],
      ["@functools.cache", "Does exactly what the hand-made closure does, in one line."],
      ["info.misses", "Each miss is a value that had to be computed: 31 values from 0 to 30, instead of over a million calls."],
      ["fib(300) with caching", "Would take longer than the age of the universe with naive recursion; with caching it's instant."]
    ],
    stretch: ["Try <code>fib_cached(5000)</code> and read the RecursionError. Why does the loop version not have this problem?", "Use <code>@lru_cache(maxsize=2)</code> and see how the miss count changes."]
  },
  tests: ["All four methods must give the same result.", "Change n to 32 and watch the naive time grow by about 2.6×.", "Call <code>fib_cached.cache_clear()</code> and time it again."]
};

L[62] = {
  intro: "Today you learn three modern OOP tools: dataclasses (less boilerplate), abstract base classes (enforced interfaces) and protocols (duck typing that type checkers understand).",
  lesson: [
    {h: "dataclasses",
     p: "<code>@dataclass</code> writes <code>__init__</code>, <code>__repr__</code> and <code>__eq__</code> for you from annotated class attributes. Use <code>field(default_factory=list)</code> for mutable defaults. <code>frozen=True</code> makes instances immutable (and hashable). <code>order=True</code> adds comparisons.",
     code: R`from dataclasses import dataclass, field

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
print(s == Student("Amina", [88, 92]))`,
     out: "Student(name='Amina', scores=[88, 92], active=True)\nTrue"},
    {h: "Abstract base classes",
     p: "<code>ABC</code> plus <code>@abstractmethod</code> defines an interface: subclasses <b>must</b> implement those methods, or Python refuses to create them. This catches missing methods immediately, not later in production.",
     code: R`from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float: ...

class Square(Shape):
    def __init__(self, side):
        self.side = side
    def area(self):
        return self.side ** 2

Square(3).area()
Shape()     # TypeError: Can't instantiate abstract class Shape`},
    {h: "Protocols",
     p: "A <code>Protocol</code> describes the methods something must have, without requiring inheritance. Any class with matching methods counts, which is Python's duck typing, but mypy can now check it.",
     code: R`from typing import Protocol

class Drawable(Protocol):
    def draw(self) -> str: ...

def render(item: Drawable) -> None:
    print(item.draw())

class Circle:                  # doesn't inherit from Drawable
    def draw(self) -> str:
        return "○"

render(Circle())               # fine for Python and for mypy`},
    {h: "Which to use",
     p: "Use a <b>dataclass</b> for classes that mainly hold data. Use an <b>ABC</b> when you own a family of classes and want to force them to implement methods. Use a <b>Protocol</b> when you accept any object with the right methods, including ones you didn't write. scikit-learn uses the protocol idea: anything with <code>fit</code> and <code>predict</code> works as a model."}
  ],
  exercises: [
    {q: "Write a frozen dataclass <code>Point(x, y)</code> and try to change <code>x</code>.", sol: R`from dataclasses import dataclass

@dataclass(frozen=True)
class Point:
    x: float
    y: float

p = Point(1, 2)
p.x = 5   # dataclasses.FrozenInstanceError`},
    {q: "Make a dataclass <code>Product</code> with <code>order=True</code> and sort a list of them. Which field decides the order?", sol: R`@dataclass(order=True)
class Product:
    price: float
    name: str

print(sorted([Product(3.5, "tea"), Product(1.2, "pen")]))
# Fields are compared in order, so price first, then name.`},
    {q: "Create an ABC <code>Animal</code> with an abstract <code>sound()</code>, and a subclass that forgets to implement it. What happens?", sol: R`class Animal(ABC):
    @abstractmethod
    def sound(self): ...

class Fish(Animal):
    pass

Fish()   # TypeError: Can't instantiate abstract class Fish ... 'sound'`}
  ],
  project: {
    title: "Pluggable payment processors",
    brief: "Design a checkout that can take payments by card, mobile money or bank transfer. Each processor implements an abstract <code>PaymentProcessor</code> interface; payments and receipts are dataclasses; adding a new payment method needs no changes to the checkout.",
    file: "day62_payments.py",
    code: R`# day62_payments.py
# A checkout with interchangeable payment processors.

from __future__ import annotations

import uuid
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime


class PaymentError(Exception):
    pass


@dataclass(frozen=True)
class Payment:
    amount: float
    currency: str
    customer: str
    details: dict[str, str] = field(default_factory=dict)


@dataclass
class Receipt:
    payment: Payment
    method: str
    fee: float
    reference: str = field(default_factory=lambda: uuid.uuid4().hex[:8].upper())
    time: datetime = field(default_factory=datetime.now)

    @property
    def total(self) -> float:
        return round(self.payment.amount + self.fee, 2)


class PaymentProcessor(ABC):
    name: str = "processor"

    @abstractmethod
    def validate(self, payment: Payment) -> None:
        """Raise PaymentError if the payment can't be made."""

    @abstractmethod
    def fee(self, payment: Payment) -> float: ...

    def pay(self, payment: Payment) -> Receipt:
        """Template method: the same steps for every processor."""
        if payment.amount <= 0:
            raise PaymentError("Amount must be positive")
        self.validate(payment)
        return Receipt(payment, self.name, round(self.fee(payment), 2))


class CardProcessor(PaymentProcessor):
    name = "card"

    def validate(self, payment: Payment) -> None:
        number = payment.details.get("card_number", "").replace(" ", "")
        if not (number.isdigit() and len(number) == 16 and luhn_ok(number)):
            raise PaymentError("Invalid card number")

    def fee(self, payment: Payment) -> float:
        return payment.amount * 0.029 + 0.30


class MobileMoneyProcessor(PaymentProcessor):
    name = "mobile money"
    LIMIT = 1000

    def validate(self, payment: Payment) -> None:
        phone = payment.details.get("phone", "")
        if not phone.startswith("+") or not phone[1:].isdigit():
            raise PaymentError("Phone must look like +252612345678")
        if payment.amount > self.LIMIT:
            raise PaymentError(f"Mobile money limit is {self.LIMIT}")

    def fee(self, payment: Payment) -> float:
        return min(payment.amount * 0.01, 5.0)


class BankTransferProcessor(PaymentProcessor):
    name = "bank transfer"

    def validate(self, payment: Payment) -> None:
        if len(payment.details.get("iban", "")) < 15:
            raise PaymentError("IBAN looks too short")

    def fee(self, payment: Payment) -> float:
        return 1.50


def luhn_ok(number: str) -> bool:
    """The checksum used by real card numbers."""
    total = 0
    for i, digit in enumerate(reversed(number)):
        d = int(digit)
        if i % 2 == 1:
            d = d * 2 - 9 if d > 4 else d * 2
        total += d
    return total % 10 == 0


PROCESSORS: dict[str, PaymentProcessor] = {
    p.name: p for p in (CardProcessor(), MobileMoneyProcessor(), BankTransferProcessor())
}


def checkout(method: str, payment: Payment) -> Receipt:
    processor = PROCESSORS.get(method)
    if processor is None:
        raise PaymentError(f"Unknown payment method: {method}")
    return processor.pay(payment)


def main() -> None:
    attempts = [
        ("card", Payment(120.0, "USD", "Amina", {"card_number": "4242 4242 4242 4242"})),
        ("card", Payment(120.0, "USD", "Omar", {"card_number": "4242 4242 4242 4241"})),
        ("mobile money", Payment(45.0, "USD", "Sara", {"phone": "+252612345678"})),
        ("mobile money", Payment(5000.0, "USD", "Yusuf", {"phone": "+252612345678"})),
        ("bank transfer", Payment(900.0, "EUR", "Hodan", {"iban": "DE89370400440532013000"})),
        ("crypto", Payment(10.0, "USD", "Bilal")),
    ]
    for method, payment in attempts:
        try:
            r = checkout(method, payment)
            print(f"OK   {r.reference}  {payment.customer:<6} {r.method:<14}"
                  f"{payment.amount:>8.2f} + fee {r.fee:>5.2f} = {r.total:>8.2f} {payment.currency}")
        except PaymentError as error:
            print(f"FAIL {payment.customer:<6} via {method}: {error}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["@dataclass(frozen=True) class Payment", "A payment shouldn't change once created, so it's frozen. The dataclass writes the constructor and repr."],
      ["reference: str = field(default_factory=...)", "<code>default_factory</code> runs once per receipt, so each one gets its own random reference and timestamp."],
      ["class PaymentProcessor(ABC) ... @abstractmethod", "Every processor must implement <code>validate</code> and <code>fee</code>. Forget one and Python refuses to create it."],
      ["def pay(self, payment):", "The <b>template method</b> pattern: the base class fixes the order of steps, and subclasses fill in the details."],
      ["PROCESSORS = {p.name: p for p in (...)}", "Adding a new payment method means writing one class and adding it here. <code>checkout</code> never changes."]
    ],
    stretch: ["Add a <code>PayPalProcessor</code> that requires an email address.", "Write pytest tests for each processor's validation rules."]
  },
  tests: ["The two invalid attempts (bad card checksum, over the mobile money limit) and the unknown method should fail with clear messages.", "Create a processor subclass without <code>fee</code> and read the error.", "Try changing <code>payment.amount</code> after creating it."]
};

L[63] = {
  intro: "Design patterns are proven solutions to problems that come up again and again. Today you learn three of the most useful, written the Python way: strategy, factory and observer.",
  lesson: [
    {h: "What a pattern is",
     p: "A pattern is a named, reusable design idea, not code to copy. Knowing them gives you a vocabulary (\"use a strategy here\") and helps you recognise designs in libraries. Many patterns from Java books become much simpler in Python because functions are objects."},
    {h: "Strategy",
     p: "Make an algorithm swappable by passing it in. In Python a strategy is often just a function. You've used it already: <code>sorted(key=...)</code> takes a strategy for comparison.",
     code: R`def flat_shipping(weight): return 5.0
def weight_shipping(weight): return 2.0 + weight * 1.5

def checkout(total, weight, shipping=flat_shipping):
    return total + shipping(weight)

print(checkout(50, 4, shipping=weight_shipping))`},
    {h: "Factory",
     p: "A factory creates objects without the caller knowing which class it gets. A dict mapping names to classes is a simple, extensible factory. It's how config files can say <code>\"model\": \"random_forest\"</code> and the code builds the right object.",
     code: R`SHAPES = {"circle": Circle, "square": Square}

def make_shape(kind, *args):
    return SHAPES[kind](*args)`},
    {h: "Observer",
     p: "One object (the <b>subject</b>) keeps a list of <b>observers</b> and notifies them when something happens. The subject doesn't need to know what the observers do. Buttons in user interfaces, event systems and ML training callbacks (\"after each epoch, save a checkpoint\") work this way.",
     code: R`class Button:
    def __init__(self):
        self.listeners = []

    def on_click(self, func):
        self.listeners.append(func)

    def click(self):
        for listener in self.listeners:
            listener()

b = Button()
b.on_click(lambda: print("Saved!"))
b.click()`},
    {h: "Don't overuse them",
     p: "Apply a pattern when it solves a real problem you have, such as needing to add new types without editing old code. A pattern used everywhere \"just in case\" makes simple code complicated."}
  ],
  exercises: [
    {q: "Write two discount strategies as functions and a <code>price_after(total, strategy)</code> function.", sol: R`def no_discount(total): return total
def ten_percent(total): return total * 0.9

def price_after(total, strategy=no_discount):
    return round(strategy(total), 2)

print(price_after(80, ten_percent))`},
    {q: "Make a factory that turns <code>\"json\"</code> or <code>\"csv\"</code> into the right saver function.", sol: R`import csv, json

def save_json(rows, path):
    with open(path, "w") as f:
        json.dump(rows, f)

def save_csv(rows, path):
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=rows[0].keys())
        w.writeheader()
        w.writerows(rows)

SAVERS = {"json": save_json, "csv": save_csv}
SAVERS["csv"]([{"a": 1}], "out.csv")`}
  ],
  project: {
    title: "Notification system",
    brief: "Build an order-tracking system for a shop. When an order's status changes, every subscribed observer is told. Notification channels (email, SMS, push) are created by a factory from a config, and each customer chooses a message-formatting strategy (short or detailed).",
    file: "day63_notifications.py",
    code: R`# day63_notifications.py
# Observer, factory and strategy patterns in one small system.

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Protocol


# ----- Strategy: how a message is worded -----

def short_format(order: Order, old: str, new: str) -> str:
    return f"Order {order.order_id}: {new}"


def detailed_format(order: Order, old: str, new: str) -> str:
    items = ", ".join(order.items)
    return (f"Hi {order.customer}, your order {order.order_id} ({items}) "
            f"changed from '{old}' to '{new}'.")


Formatter = Callable[["Order", str, str], str]


# ----- Factory: building channels from configuration -----

class Channel(Protocol):
    def send(self, to: str, message: str) -> None: ...


class EmailChannel:
    def send(self, to: str, message: str) -> None:
        print(f"  [email to {to}] {message}")


class SmsChannel:
    MAX = 70

    def send(self, to: str, message: str) -> None:
        text = message if len(message) <= self.MAX else message[: self.MAX - 3] + "..."
        print(f"  [sms to {to}] {text}")


class PushChannel:
    def send(self, to: str, message: str) -> None:
        print(f"  [push to {to}'s phone] {message}")


CHANNELS: dict[str, type] = {"email": EmailChannel, "sms": SmsChannel, "push": PushChannel}


def make_channel(kind: str) -> Channel:
    try:
        return CHANNELS[kind]()
    except KeyError:
        raise ValueError(f"Unknown channel '{kind}'. Choose from {list(CHANNELS)}") from None


# ----- Observer: orders notify whoever subscribed -----

Observer = Callable[["Order", str, str], None]


@dataclass
class Order:
    order_id: str
    customer: str
    items: list[str]
    status: str = "placed"
    _observers: list[Observer] = field(default_factory=list, repr=False)

    STATUSES = ("placed", "paid", "packed", "shipped", "delivered", "cancelled")

    def subscribe(self, observer: Observer) -> None:
        self._observers.append(observer)

    def set_status(self, new: str) -> None:
        if new not in self.STATUSES:
            raise ValueError(f"Unknown status: {new}")
        old, self.status = self.status, new
        for observer in self._observers:
            observer(self, old, new)


@dataclass
class Customer:
    name: str
    contact: str
    channels: list[str]
    formatter: Formatter = short_format

    def notifier(self) -> Observer:
        """Build an observer function that sends on all of this customer's channels."""
        channels = [make_channel(kind) for kind in self.channels]

        def notify(order: Order, old: str, new: str) -> None:
            message = self.formatter(order, old, new)
            for channel in channels:
                channel.send(self.contact, message)
        return notify


class AuditLog:
    """Another observer: it records every change, regardless of customer."""

    def __init__(self) -> None:
        self.entries: list[str] = []

    def __call__(self, order: Order, old: str, new: str) -> None:
        self.entries.append(f"{order.order_id}: {old} -> {new}")


def main() -> None:
    audit = AuditLog()
    amina = Customer("Amina", "amina@example.com", ["email", "push"], detailed_format)
    omar = Customer("Omar", "+252612345678", ["sms"])

    order1 = Order("A-1001", "Amina", ["headphones", "USB cable"])
    order2 = Order("A-1002", "Omar", ["laptop stand"])
    order1.subscribe(amina.notifier())
    order1.subscribe(audit)
    order2.subscribe(omar.notifier())
    order2.subscribe(audit)

    for order, status in [(order1, "paid"), (order2, "paid"), (order1, "shipped"),
                          (order2, "cancelled"), (order1, "delivered")]:
        print(f"{order.order_id} -> {status}")
        order.set_status(status)

    print("\nAudit log:")
    for line in audit.entries:
        print("  ", line)

    try:
        make_channel("pigeon")
    except ValueError as error:
        print("\n", error)


if __name__ == "__main__":
    main()`,
    explain: [
      ["Formatter = Callable[[\"Order\", str, str], str]", "A type alias: any function taking an order and two strings and returning a string can be a formatting strategy."],
      ["CHANNELS = {\"email\": EmailChannel, ...} / make_channel", "The factory: configuration text (\"sms\") becomes an object. New channels mean one new class and one dict entry."],
      ["for observer in self._observers: observer(self, old, new)", "The order doesn't know or care what observers do: send messages, write logs, update a dashboard."],
      ["def notifier(self) -> Observer: ... return notify", "A closure: the returned function remembers this customer's channels and formatter."],
      ["class AuditLog: def __call__(...)", "Defining <code>__call__</code> makes an object callable like a function, so a stateful object can be an observer too."]
    ],
    stretch: ["Add an <code>unsubscribe</code> method and let customers opt out after delivery.", "Add a <code>WebhookChannel</code> that would POST JSON to a URL (print the JSON instead)."]
  },
  tests: ["Trace one status change by hand: which functions run, in which order?", "Give Omar the detailed formatter and see the SMS get truncated.", "Set an invalid status and check that no observer was notified."]
};

L[64] = {
  intro: "The <code>itertools</code> module is a toolbox of fast, memory-efficient building blocks for iteration. Combined with generators, it lets you build powerful data pipelines in a few lines.",
  lesson: [
    {h: "Infinite and slicing tools",
     p: "<code>count(start, step)</code> counts forever, <code>cycle(items)</code> repeats forever, <code>repeat(x, n)</code> repeats a value. <code>islice(iterable, stop)</code> takes the first few items from any iterator, even an infinite one.",
     code: R`from itertools import count, cycle, islice

print(list(islice(count(10, 5), 4)))
print(list(islice(cycle("AB"), 5)))`,
     out: "[10, 15, 20, 25]\n['A', 'B', 'A', 'B', 'A']"},
    {h: "Combining iterators",
     p: "<code>chain(a, b)</code> joins iterables end to end. <code>zip_longest</code> zips to the longest input, filling gaps. <code>pairwise(items)</code> gives neighbouring pairs, useful for differences between consecutive values. <code>batched(items, n)</code> (Python 3.12+) gives chunks of size n.",
     code: R`from itertools import chain, pairwise

print(list(chain([1, 2], (3, 4))))
prices = [10, 12, 9, 15]
print([b - a for a, b in pairwise(prices)])`,
     out: "[1, 2, 3, 4]\n[2, -3, 6]"},
    {h: "Grouping and accumulating",
     p: "<code>groupby(items, key)</code> groups <b>consecutive</b> items with the same key, so sort by the key first. <code>accumulate</code> produces running totals (or running maximums).",
     code: R`from itertools import groupby, accumulate

words = sorted(["apple", "avocado", "banana", "blueberry", "cherry"])
for letter, group in groupby(words, key=lambda w: w[0]):
    print(letter, list(group))

print(list(accumulate([5, 3, 8])))`},
    {h: "Combinatorics",
     p: "<code>product</code> (every combination of several lists, like nested loops), <code>permutations</code> (orderings), <code>combinations</code> (choices without order). In ML, <code>product</code> is how a grid search tries every combination of settings (Day 92).",
     code: R`from itertools import product, combinations

print(list(product([0.01, 0.1], [16, 32])))
print(list(combinations("ABC", 2)))`},
    {h: "yield from",
     p: "Inside a generator, <code>yield from other</code> yields every item of another iterable. It's a clean way to flatten or delegate."}
  ],
  exercises: [
    {q: "Print the first 10 square numbers using <code>count</code>, a generator expression and <code>islice</code>.", sol: R`from itertools import count, islice
print(list(islice((n * n for n in count(1)), 10)))`},
    {q: "Given daily step counts, print the running total for the week with <code>accumulate</code>.", sol: R`from itertools import accumulate
steps = [4000, 7500, 6200, 9000, 3000, 12000, 8000]
print(list(accumulate(steps)))`},
    {q: "List every way to choose 2 people from a team of 4 to pair-program.", sol: R`from itertools import combinations
for pair in combinations(["Amina", "Omar", "Sara", "Yusuf"], 2):
    print(pair)`}
  ],
  project: {
    title: "Log analysis pipeline",
    brief: "Analyse a stream of application events with generators and itertools: merge several log sources, parse them, group events into user sessions, find the busiest minutes, and compute session statistics, all without loading everything into memory.",
    file: "day64_pipeline.py",
    code: R`# day64_pipeline.py
# A streaming event pipeline built from generators and itertools.

import random
from collections import Counter
from datetime import datetime, timedelta
from itertools import accumulate, chain, groupby, islice, pairwise

EVENTS = ["login", "view", "view", "view", "search", "add_to_cart", "checkout", "logout"]


def fake_source(server, n, seed):
    """Yield raw log lines like '2026-10-01T09:00:03|web-1|user7|view'."""
    rng = random.Random(seed)
    t = datetime(2026, 10, 1, 9, 0)
    for _ in range(n):
        t += timedelta(seconds=rng.randint(1, 20))
        yield f"{t.isoformat()}|{server}|user{rng.randint(1, 12)}|{rng.choice(EVENTS)}"


def parse(lines):
    for line in lines:
        time, server, user, event = line.split("|")
        yield {"time": datetime.fromisoformat(time), "server": server, "user": user, "event": event}


def sessions(events, gap=timedelta(minutes=5)):
    """Split each user's events into sessions separated by gaps of inactivity."""
    by_user = sorted(events, key=lambda e: (e["user"], e["time"]))
    for user, group in groupby(by_user, key=lambda e: e["user"]):
        session = []
        for event in group:
            if session and event["time"] - session[-1]["time"] > gap:
                yield user, session
                session = []
            session.append(event)
        if session:
            yield user, session


def busiest_minutes(events, top=3):
    per_minute = Counter(e["time"].replace(second=0) for e in events)
    return per_minute.most_common(top)


def main():
    sources = [fake_source("web-1", 400, 1), fake_source("web-2", 400, 2), fake_source("api", 200, 3)]
    events = list(parse(chain.from_iterable(sources)))
    print(f"Events: {len(events)} from {len({e['server'] for e in events})} servers")

    print("\nFirst three events:")
    for e in islice(events, 3):
        print(f"  {e['time']:%H:%M:%S} {e['server']:<6}{e['user']:<8}{e['event']}")

    print("\nBusiest minutes:")
    for minute, n in busiest_minutes(events):
        print(f"  {minute:%H:%M}  {n} events")

    all_sessions = list(sessions(events))
    lengths = [len(s) for _, s in all_sessions]
    durations = [(s[-1]["time"] - s[0]["time"]).total_seconds() / 60 for _, s in all_sessions]
    print(f"\nSessions: {len(all_sessions)}")
    print(f"  average events per session: {sum(lengths) / len(lengths):.1f}")
    print(f"  longest session: {max(durations):.1f} minutes")

    converted = sum(1 for _, s in all_sessions if any(e["event"] == "checkout" for e in s))
    print(f"  sessions with a checkout: {converted} ({converted / len(all_sessions):.0%})")

    print("\nMost common next event after 'search':")
    pairs = Counter((a["event"], b["event"]) for _, s in all_sessions for a, b in pairwise(s))
    after_search = {b: n for (a, b), n in pairs.items() if a == "search"}
    for event, n in sorted(after_search.items(), key=lambda kv: -kv[1])[:3]:
        print(f"  {event:<12}{n}")

    hourly = Counter(e["time"].hour for e in events)
    hours = sorted(hourly)
    running = list(accumulate(hourly[h] for h in hours))
    print("\nCumulative events by hour:", dict(zip(hours, running)))


if __name__ == "__main__":
    main()`,
    explain: [
      ["chain.from_iterable(sources)", "Joins three generators into one stream without building a combined list."],
      ["groupby(by_user, key=lambda e: e[\"user\"])", "Because the events were sorted by user first, each group is one user's complete history in time order."],
      ["if session and event[\"time\"] - session[-1][\"time\"] > gap:", "Session splitting: more than 5 minutes of silence starts a new session. Analytics tools use the same rule."],
      ["Counter(... for a, b in pairwise(s))", "<code>pairwise</code> gives each event with the next one, so we can count what users do after searching."],
      ["accumulate(hourly[h] for h in hours)", "Running totals per hour from a generator expression."]
    ],
    stretch: ["Compute the average time between events per user with <code>pairwise</code>.", "Use <code>itertools.batched</code> (Python 3.12+) to write events to files of 100 lines each."]
  },
  tests: ["Change the session gap to 1 minute: how does the session count change?", "Feed in only one source.", "Check one user's sessions by printing them."]
};

L[65] = {
  intro: "Regular expressions (regex) are a mini-language for finding patterns in text: emails, phone numbers, dates, codes. Today you learn the core syntax and Python's <code>re</code> module.",
  lesson: [
    {h: "Why regex",
     p: "String methods find exact text. Regex finds <b>patterns</b>: \"a word, then an @, then a domain\". It's essential for cleaning text data, validating input and parsing logs. Always write patterns as raw strings, <code>r\"...\"</code>, so backslashes reach the regex engine unchanged."},
    {h: "The building blocks",
     p: "<code>\\d</code> digit, <code>\\w</code> word character (letter, digit, underscore), <code>\\s</code> whitespace, <code>.</code> any character. <code>[abc]</code> one of these, <code>[a-z]</code> a range, <code>[^0-9]</code> anything except. Quantifiers: <code>*</code> zero or more, <code>+</code> one or more, <code>?</code> optional, <code>{3}</code> exactly 3, <code>{2,4}</code> between 2 and 4. Anchors: <code>^</code> start, <code>$</code> end, <code>\\b</code> word boundary. Escape special characters with a backslash: <code>\\.</code> means a real dot."},
    {h: "The main functions",
     p: "<code>re.search</code> finds the first match anywhere, <code>re.fullmatch</code> requires the whole string to match (for validation), <code>re.findall</code> returns every match, <code>re.finditer</code> yields match objects, <code>re.sub</code> replaces matches and <code>re.split</code> splits on a pattern.",
     code: R`import re

text = "Call 0612 345 678 or 0700-123-456 before 5pm."
print(re.findall(r"\d{3,4}[ -]\d{3}[ -]\d{3}", text))
print(bool(re.fullmatch(r"[A-Z]{2}\d{4}", "SO2026")))
print(re.sub(r"\s+", " ", "too    many   spaces"))`,
     out: "['0612 345 678', '0700-123-456']\nTrue\ntoo many spaces"},
    {h: "Match objects and flags",
     p: "<code>re.search</code> returns a match object (or <code>None</code>). <code>m.group()</code> is the matched text, <code>m.start()</code> its position. Flags change behaviour: <code>re.IGNORECASE</code>, <code>re.MULTILINE</code>. <code>re.compile(pattern)</code> builds a reusable pattern object.",
     code: R`m = re.search(r"\d+", "Order 4521 shipped")
if m:
    print(m.group(), m.start())`,
     out: "4521 6"},
    {h: "Test your patterns",
     p: "Use <b>regex101.com</b> (choose the Python flavour) to build and test patterns visually; it explains every part. Keep patterns as simple as the job allows, and add comments for complex ones (tomorrow you'll learn the VERBOSE flag)."}
  ],
  exercises: [
    {q: "Find all hashtags in <code>\"Learning #python and #MachineLearning today #100DaysOfCode\"</code>.", sol: R`print(re.findall(r"#\w+", "Learning #python and #MachineLearning today #100DaysOfCode"))`},
    {q: "Validate a time like <code>09:45</code> or <code>23:59</code> with <code>fullmatch</code>.", sol: R`def valid_time(t):
    return re.fullmatch(r"([01]\d|2[0-3]):[0-5]\d", t) is not None

print(valid_time("23:59"), valid_time("24:00"))`},
    {q: "Replace every digit in a string with <code>#</code>.", sol: R`print(re.sub(r"\d", "#", "Card 4242 ends 99"))`}
  ],
  project: {
    title: "Email and phone number extractor",
    brief: "Scan a block of text (or any text file) and extract email addresses, phone numbers, URLs and dates. Normalise each to a standard form, remove duplicates, and optionally produce a redacted copy of the text with personal data hidden.",
    file: "day65_extractor.py",
    code: R`# day65_extractor.py
# Finds contact details in text with regular expressions.

import re
import sys
from pathlib import Path

SAMPLE = """
Contact Amina at Amina.Hassan@example.com or amina.hassan@EXAMPLE.com.
Sales: sales-team@shop.co.uk, phone +252 61 234 5678 or (061) 234-5678.
Omar's mobile is 0612345678; office line +44 20 7946 0958.
Website https://www.example.com/contact and http://shop.co.uk/sale?id=7.
Meeting on 2026-11-03, follow-up 15/11/2026. Invoice #4521 total 99.50.
"""

EMAIL = re.compile(r"\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b")
PHONE = re.compile(r"(?:\+\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{2,4}[\s-]?\d{3,4}(?:[\s-]?\d{3,4})?")
URL = re.compile(r"https?://[^\s,]+[^\s,.]")
DATE_ISO = re.compile(r"\b\d{4}-\d{2}-\d{2}\b")
DATE_DMY = re.compile(r"\b(\d{1,2})/(\d{1,2})/(\d{4})\b")


def unique(items):
    """Remove duplicates but keep the original order."""
    return list(dict.fromkeys(items))


def find_emails(text):
    return unique(m.lower() for m in EMAIL.findall(text))


def find_phones(text):
    phones = []
    for match in PHONE.findall(text):
        digits = re.sub(r"\D", "", match)
        if 9 <= len(digits) <= 15:
            phones.append(("+" if match.strip().startswith("+") else "") + digits)
    return unique(phones)


def find_urls(text):
    return unique(URL.findall(text))


def find_dates(text):
    dates = DATE_ISO.findall(text)
    dates += [f"{y}-{int(m):02d}-{int(d):02d}" for d, m, y in DATE_DMY.findall(text)]
    return unique(dates)


def redact(text):
    text = EMAIL.sub("[email]", text)
    text = URL.sub("[link]", text)
    return PHONE.sub(lambda m: "[phone]" if len(re.sub(r"\D", "", m.group())) >= 9 else m.group(), text)


def main():
    text = Path(sys.argv[1]).read_text(encoding="utf-8") if len(sys.argv) > 1 else SAMPLE

    for label, values in [("Emails", find_emails(text)), ("Phones", find_phones(text)),
                          ("URLs", find_urls(text)), ("Dates", find_dates(text))]:
        print(f"{label} ({len(values)}):")
        for v in values:
            print("  ", v)

    print("\nRedacted text:")
    print(redact(text).strip())


if __name__ == "__main__":
    main()`,
    explain: [
      ["r\"\\b[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+\\b\"", "A practical email pattern: name characters, @, then a domain with one or more dot-separated parts. <code>(?:...)</code> is a group that doesn't capture. Perfectly validating every legal email with regex is famously hard; this is good enough for extraction."],
      ["re.sub(r\"\\D\", \"\", match)", "<code>\\D</code> means \"not a digit\". Removing them normalises \"(061) 234-5678\" and \"061 234 5678\" to the same digits."],
      ["if 9 <= len(digits) <= 15:", "A sanity check after the regex: it filters out things like invoice numbers that look a bit like phone numbers."],
      ["list(dict.fromkeys(items))", "Dicts keep insertion order and unique keys, so this removes duplicates while keeping the first-seen order."],
      ["PHONE.sub(lambda m: ..., text)", "<code>sub</code> can take a function that decides the replacement for each match."]
    ],
    stretch: ["Extract money amounts like <code>99.50</code> and <code>$1,200</code>.", "Run it on a real text file: <code>python day65_extractor.py notes.txt</code>."]
  },
  tests: ["The two Amina emails differ only in case and should appear once.", "The invoice number #4521 must not be counted as a phone.", "Check the redacted text still reads sensibly."]
};

L[66] = {
  intro: "Today you go beyond finding text: capture groups pull out the parts of a match, so one regex can turn a messy log line into structured data.",
  lesson: [
    {h: "Capture groups",
     p: "Parentheses capture part of a match. <code>m.group(1)</code> is the first group, and <code>m.groups()</code> returns them all. <code>findall</code> with groups returns tuples.",
     code: R`import re
m = re.search(r"(\d{4})-(\d{2})-(\d{2})", "Due 2026-11-03")
print(m.group(1), m.groups())`,
     out: "2026 ('2026', '11', '03')"},
    {h: "Named groups",
     p: "<code>(?P&lt;name&gt;...)</code> names a group. <code>m.group(\"name\")</code> or <code>m.groupdict()</code> give readable access. Parsing a line into a dict in one step is the main use.",
     code: R`pattern = r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})"
print(re.search(pattern, "Due 2026-11-03").groupdict())`,
     out: "{'year': '2026', 'month': '11', 'day': '03'}"},
    {h: "Backreferences and substitution",
     p: "In a replacement, <code>\\1</code> or <code>\\g&lt;name&gt;</code> inserts a captured group, so you can rearrange text.",
     code: R`print(re.sub(r"(\d{2})/(\d{2})/(\d{4})", r"\3-\2-\1", "Born 14/03/2001"))`,
     out: "Born 2001-03-14"},
    {h: "Greedy and lazy",
     p: "<code>.*</code> is <b>greedy</b>: it matches as much as possible. <code>.*?</code> is <b>lazy</b>: as little as possible. On <code>&lt;b&gt;one&lt;/b&gt; &lt;b&gt;two&lt;/b&gt;</code>, <code>&lt;b&gt;.*&lt;/b&gt;</code> matches everything, but <code>&lt;b&gt;.*?&lt;/b&gt;</code> matches each tag pair separately."},
    {h: "Readable patterns with VERBOSE",
     p: "<code>re.VERBOSE</code> ignores whitespace in the pattern and allows <code>#</code> comments, so complex patterns can be laid out over several lines and explained.",
     code: R`PRICE = re.compile(r"""
    (?P<currency>[$€£])     # currency symbol
    (?P<amount>\d+(?:\.\d{2})?)  # whole number, optional cents
""", re.VERBOSE)`}
  ],
  exercises: [
    {q: "Swap \"Lastname, Firstname\" to \"Firstname Lastname\" with <code>re.sub</code>.", sol: R`print(re.sub(r"(\w+), (\w+)", r"\2 \1", "Hassan, Amina"))`},
    {q: "Parse <code>\"temp=21.5C humidity=40%\"</code> into a dict with named groups.", sol: R`m = re.search(r"temp=(?P<temp>[\d.]+)C humidity=(?P<humidity>\d+)%", "temp=21.5C humidity=40%")
print(m.groupdict())`},
    {q: "Extract the contents of every <code>&lt;b&gt;...&lt;/b&gt;</code> tag using a lazy quantifier.", sol: R`print(re.findall(r"<b>(.*?)</b>", "<b>one</b> and <b>two</b>"))`}
  ],
  project: {
    title: "Web server log parser",
    brief: "Parse web server access logs in the standard \"combined\" format used by Apache and Nginx into structured records with a verbose, named-group regex. Then report status codes, top pages, bandwidth, suspicious IPs and malformed lines.",
    file: "day66_access_log.py",
    code: R`# day66_access_log.py
# Parses Apache/Nginx "combined" access logs with named groups.

import re
from collections import Counter
from datetime import datetime

SAMPLE = r'''
192.168.1.10 - - [24/Oct/2026:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 2326 "-" "Mozilla/5.0"
192.168.1.10 - - [24/Oct/2026:13:55:40 +0000] "GET /images/logo.png HTTP/1.1" 200 15400 "http://example.com/" "Mozilla/5.0"
10.0.0.5 - - [24/Oct/2026:13:56:02 +0000] "POST /login HTTP/1.1" 401 512 "-" "curl/8.4.0"
10.0.0.5 - - [24/Oct/2026:13:56:03 +0000] "POST /login HTTP/1.1" 401 512 "-" "curl/8.4.0"
10.0.0.5 - - [24/Oct/2026:13:56:04 +0000] "POST /login HTTP/1.1" 401 512 "-" "curl/8.4.0"
10.0.0.5 - - [24/Oct/2026:13:56:05 +0000] "POST /login HTTP/1.1" 401 512 "-" "curl/8.4.0"
172.16.0.3 - amina [24/Oct/2026:14:01:12 +0000] "GET /dashboard HTTP/1.1" 200 8812 "-" "Mozilla/5.0 (Windows NT 10.0)"
172.16.0.3 - amina [24/Oct/2026:14:01:30 +0000] "GET /api/orders?page=2 HTTP/1.1" 200 1290 "-" "Mozilla/5.0 (Windows NT 10.0)"
203.0.113.9 - - [24/Oct/2026:14:02:00 +0000] "GET /wp-admin HTTP/1.1" 404 196 "-" "BadBot/1.0"
203.0.113.9 - - [24/Oct/2026:14:02:01 +0000] "GET /.env HTTP/1.1" 404 196 "-" "BadBot/1.0"
this line is broken and should be reported
192.168.1.22 - - [24/Oct/2026:14:05:44 +0000] "GET /index.html HTTP/1.1" 304 - "-" "Mozilla/5.0"
192.168.1.22 - - [24/Oct/2026:14:06:10 +0000] "GET /checkout HTTP/1.1" 500 734 "-" "Mozilla/5.0"
'''

LINE = re.compile(r"""
    ^(?P<ip>\d{1,3}(?:\.\d{1,3}){3})          # client IP address
    \s\S+\s(?P<user>\S+)\s                     # identity (unused) and user
    \[(?P<time>[^\]]+)\]\s                     # [24/Oct/2026:13:55:36 +0000]
    "(?P<method>[A-Z]+)\s(?P<path>\S+)\s[^"]*"\s   # "GET /index.html HTTP/1.1"
    (?P<status>\d{3})\s(?P<size>\d+|-)         # status code and response size
    \s"(?P<referrer>[^"]*)"\s"(?P<agent>[^"]*)"$   # referrer and user agent
""", re.VERBOSE)


def parse(lines):
    """Yield (record, None) for good lines and (None, line) for bad ones."""
    for line in lines:
        line = line.strip()
        if not line:
            continue
        m = LINE.match(line)
        if not m:
            yield None, line
            continue
        r = m.groupdict()
        r["time"] = datetime.strptime(r["time"], "%d/%b/%Y:%H:%M:%S %z")
        r["status"] = int(r["status"])
        r["size"] = 0 if r["size"] == "-" else int(r["size"])
        r["path"] = re.sub(r"\?.*$", "", r["path"])       # drop the query string
        yield r, None


def main():
    records, bad = [], []
    for record, broken in parse(SAMPLE.splitlines()):
        if record:
            records.append(record)
        else:
            bad.append(broken)

    print(f"Parsed {len(records)} requests, {len(bad)} malformed line(s)")
    for line in bad:
        print("   malformed:", line[:60])

    statuses = Counter(r["status"] // 100 * 100 for r in records)
    print("\nStatus classes:", {f"{k // 100}xx": v for k, v in sorted(statuses.items())})

    print("\nTop pages:")
    for path, n in Counter(r["path"] for r in records).most_common(3):
        print(f"  {n}  {path}")

    total_kb = sum(r["size"] for r in records) / 1024
    print(f"\nBandwidth: {total_kb:.1f} KB")

    failed_logins = Counter(r["ip"] for r in records if r["path"] == "/login" and r["status"] == 401)
    probes = Counter(r["ip"] for r in records if re.search(r"wp-admin|\.env|phpmyadmin", r["path"]))
    print("\nSuspicious:")
    for ip, n in failed_logins.items():
        if n >= 3:
            print(f"  {ip}: {n} failed logins")
    for ip, n in probes.items():
        print(f"  {ip}: probing for sensitive files ({n} requests)")

    errors = [r for r in records if r["status"] >= 500]
    for r in errors:
        print(f"\nServer error at {r['time']:%H:%M:%S}: {r['method']} {r['path']}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["re.VERBOSE with # comments", "A long pattern becomes readable: one line per log field, each explained."],
      ["(?P<ip>\\d{1,3}(?:\\.\\d{1,3}){3})", "Four groups of 1 to 3 digits separated by dots. The inner <code>(?:...)</code> repeats without creating an extra capture group."],
      ["\\[(?P<time>[^\\]]+)\\]", "Square brackets are special, so they're escaped. <code>[^\\]]+</code> means \"everything up to the closing bracket\"."],
      ["datetime.strptime(r[\"time\"], \"%d/%b/%Y:%H:%M:%S %z\")", "Turns the log's date text into a real datetime, including the timezone (<code>%z</code>)."],
      ["yield None, line", "Bad lines aren't silently ignored: they're reported, which matters when parsing real data."]
    ],
    stretch: ["Read a real log file line by line (some hosting providers let you download one) instead of SAMPLE.", "Report requests per minute and the average response size per page."]
  },
  tests: ["The broken line is reported as malformed.", "The 304 response with size <code>-</code> is parsed as size 0.", "10.0.0.5 is flagged for failed logins and 203.0.113.9 for probing."]
};

L[67] = {
  intro: "Threads let a program wait for several slow things at once, such as network requests or file downloads. Today you learn when threads help, why the GIL limits them, and how to use them safely with <code>concurrent.futures</code>.",
  lesson: [
    {h: "Concurrency and the GIL",
     p: "Normally Python does one thing at a time. A <b>thread</b> is a separate flow of execution inside the same program. CPython's <b>Global Interpreter Lock</b> (GIL) lets only one thread run Python code at a time, so threads <b>don't</b> speed up calculations. But while a thread waits for the network or disk, the GIL is released and others run. So threads are great for <b>I/O-bound</b> work and useless for <b>CPU-bound</b> work (that's tomorrow's topic: processes)."},
    {h: "ThreadPoolExecutor",
     p: "<code>concurrent.futures.ThreadPoolExecutor</code> manages a pool of worker threads for you. <code>executor.map(func, items)</code> runs the function on every item using several threads and returns results in order.",
     code: R`import time
from concurrent.futures import ThreadPoolExecutor

def slow_task(n):
    time.sleep(1)          # pretend to wait for the network
    return n * n

start = time.perf_counter()
with ThreadPoolExecutor(max_workers=5) as pool:
    results = list(pool.map(slow_task, range(5)))
print(results, f"{time.perf_counter() - start:.1f}s")`,
     out: "[0, 1, 4, 9, 16] 1.0s"},
    {h: "submit and as_completed",
     p: "<code>pool.submit(func, arg)</code> returns a <b>Future</b>: a placeholder for a result that will arrive later. <code>as_completed(futures)</code> yields each future as soon as it finishes, so you can show progress. <code>future.result()</code> returns the value or re-raises the thread's exception."},
    {h: "Shared data and locks",
     p: "If several threads change the same variable, updates can collide (a <b>race condition</b>). Protect shared data with a <code>threading.Lock</code> in a <code>with</code> block, or avoid sharing: let each task return its result and combine results in the main thread. The second approach is simpler and is what <code>map</code> encourages.",
     code: R`import threading

lock = threading.Lock()
total = 0

def add(n):
    global total
    with lock:
        total += n`}
  ],
  exercises: [
    {q: "Time 10 calls of <code>time.sleep(0.5)</code> done one after another, then with a pool of 10 threads.", sol: R`import time
from concurrent.futures import ThreadPoolExecutor

def nap(_):
    time.sleep(0.5)

start = time.perf_counter()
for i in range(10):
    nap(i)
print("sequential", time.perf_counter() - start)   # about 5s

start = time.perf_counter()
with ThreadPoolExecutor(10) as pool:
    list(pool.map(nap, range(10)))
print("threads", time.perf_counter() - start)      # about 0.5s`},
    {q: "Now try a CPU-heavy function, like summing squares to 5 million, with 4 threads. Is it faster than sequential?", sol: R`# No: because of the GIL, threads take turns running Python code,
# so CPU-bound work takes about the same time (or a little longer).`}
  ],
  project: {
    title: "Concurrent website status checker",
    brief: "Check whether a list of websites is up, how fast each one responds and what status it returns, using a thread pool. Compare the total time with checking them one by one. Results appear as each check finishes. Needs <code>pip install requests</code>.",
    file: "day67_status_checker.py",
    code: R`# day67_status_checker.py
# Checks many websites at once with a thread pool.

import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass

import requests

DEFAULT_SITES = [
    "https://www.python.org",
    "https://pypi.org",
    "https://docs.python.org/3/",
    "https://github.com",
    "https://www.wikipedia.org",
    "https://numpy.org",
    "https://pandas.pydata.org",
    "https://scikit-learn.org",
    "https://pytorch.org",
    "https://this-domain-does-not-exist-12345.com",
]


@dataclass
class Result:
    url: str
    ok: bool
    status: int | None
    ms: float
    error: str = ""


def check(url: str, timeout: float = 8.0) -> Result:
    start = time.perf_counter()
    try:
        r = requests.get(url, timeout=timeout, headers={"User-Agent": "status-checker/1.0"})
        ms = (time.perf_counter() - start) * 1000
        return Result(url, r.ok, r.status_code, ms)
    except requests.RequestException as error:
        ms = (time.perf_counter() - start) * 1000
        return Result(url, False, None, ms, type(error).__name__)


def show(r: Result) -> None:
    mark = "UP  " if r.ok else "DOWN"
    detail = str(r.status) if r.status else r.error
    print(f"  {mark} {r.ms:>7.0f} ms  {detail:<16}{r.url}")


def check_sequential(urls):
    return [check(u) for u in urls]


def check_concurrent(urls, workers=10):
    results = []
    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(check, url): url for url in urls}
        for future in as_completed(futures):
            result = future.result()
            show(result)                 # print as each one finishes
            results.append(result)
    return results


def main():
    urls = sys.argv[1:] or DEFAULT_SITES

    print(f"Checking {len(urls)} sites with threads (fastest first):")
    start = time.perf_counter()
    results = check_concurrent(urls)
    threaded = time.perf_counter() - start

    print("\nChecking the same sites one at a time...")
    start = time.perf_counter()
    check_sequential(urls)
    sequential = time.perf_counter() - start

    up = sum(r.ok for r in results)
    print(f"\n{up}/{len(results)} up")
    print(f"Threads:    {threaded:.2f}s")
    print(f"Sequential: {sequential:.2f}s  ({sequential / threaded:.1f}x slower)")
    slowest = max((r for r in results if r.ok), key=lambda r: r.ms, default=None)
    if slowest:
        print(f"Slowest responding site: {slowest.url} ({slowest.ms:.0f} ms)")


if __name__ == "__main__":
    main()`,
    explain: [
      ["def check(url) -> Result:", "Each task is independent and returns its own result, so the threads never share mutable data and no lock is needed."],
      ["except requests.RequestException as error:", "Errors are turned into results inside the thread. One broken site can't crash the whole check."],
      ["futures = {pool.submit(check, url): url ...}", "<code>submit</code> starts every check immediately and returns Future objects."],
      ["for future in as_completed(futures):", "Results print in the order they finish, not the order submitted, so fast sites appear first."],
      ["sum(r.ok for r in results)", "True counts as 1 and False as 0, so summing bools counts the successes."]
    ],
    stretch: ["Read the list of URLs from a text file.", "Check every site every 60 seconds and log any site that goes down."]
  },
  tests: ["Run with your own list: <code>python day67_status_checker.py https://example.com https://python.org</code>.", "Compare the two timings; with 10 sites threads should be several times faster.", "Change <code>max_workers</code> to 1: it becomes as slow as sequential. Why?"]
};

L[68] = {
  intro: "For CPU-heavy work, threads don't help because of the GIL. Separate processes do: each has its own Python interpreter and can use its own CPU core.",
  lesson: [
    {h: "Processes vs threads",
     p: "A <b>process</b> is a separate running program with its own memory and its own GIL. Running work in several processes uses several CPU cores at once, which gives real speed-ups for calculations. The cost: starting processes is slower, and data has to be copied between them (it must be <b>picklable</b>: numbers, strings, lists, dicts and most simple objects)."},
    {h: "ProcessPoolExecutor",
     p: "The API is the same as yesterday's thread pool, so switching is easy. <code>os.cpu_count()</code> tells you how many cores you have.",
     code: R`import os
from concurrent.futures import ProcessPoolExecutor

def heavy(n):
    return sum(i * i for i in range(n))

if __name__ == "__main__":
    print(os.cpu_count(), "cores")
    with ProcessPoolExecutor() as pool:
        print(list(pool.map(heavy, [5_000_000] * 4)))`},
    {h: "The __main__ guard is required",
     p: "On Windows and macOS, each worker process imports your file. Without <code>if __name__ == \"__main__\":</code>, every worker would start its own pool, creating processes endlessly. Worker functions must be defined at the top level of the module, not inside another function or as a lambda."},
    {h: "Choosing the right tool",
     p: "<b>Waiting</b> (network, disk, database): threads, or asyncio (tomorrow). <b>Calculating</b> (maths, image processing, parsing big files): processes. Tasks should be big enough that the work outweighs the cost of sending data to another process. In data science you'll often get parallelism for free: NumPy, pandas and scikit-learn (<code>n_jobs=-1</code>) parallelise internally."}
  ],
  exercises: [
    {q: "Print how many CPU cores your computer has.", sol: R`import os
print(os.cpu_count())`},
    {q: "Time <code>heavy(5_000_000)</code> four times sequentially and with a ProcessPoolExecutor. What speed-up do you get?", sol: R`import time
from concurrent.futures import ProcessPoolExecutor

if __name__ == "__main__":
    start = time.perf_counter()
    [heavy(5_000_000) for _ in range(4)]
    print("sequential", time.perf_counter() - start)

    start = time.perf_counter()
    with ProcessPoolExecutor() as pool:
        list(pool.map(heavy, [5_000_000] * 4))
    print("processes", time.perf_counter() - start)
# Usually close to 4x on a machine with 4+ cores.`},
    {q: "Try passing a lambda to <code>pool.map</code>. What error do you get and why?", sol: R`# PicklingError / AttributeError: lambdas can't be pickled,
# so they can't be sent to another process. Use a def at module level.`}
  ],
  project: {
    title: "Parallel prime finder",
    brief: "Count and find prime numbers up to a large limit by splitting the range into chunks and checking them in parallel. Compare one process, a thread pool, and a process pool to see the GIL's effect clearly.",
    file: "day68_primes.py",
    code: R`# day68_primes.py
# Finds primes in parallel and compares threads with processes.

import math
import os
import time
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

LIMIT = 3_000_000


def is_prime(n: int) -> bool:
    if n < 2:
        return False
    if n % 2 == 0:
        return n == 2
    for d in range(3, math.isqrt(n) + 1, 2):
        if n % d == 0:
            return False
    return True


def primes_in_range(bounds: tuple[int, int]) -> list[int]:
    start, stop = bounds
    return [n for n in range(start, stop) if is_prime(n)]


def chunks(limit: int, parts: int) -> list[tuple[int, int]]:
    size = math.ceil(limit / parts)
    return [(i, min(i + size, limit)) for i in range(0, limit, size)]


def run(label, executor_class, limit, workers):
    start = time.perf_counter()
    if executor_class is None:
        results = [primes_in_range((0, limit))]
    else:
        with executor_class(max_workers=workers) as pool:
            results = list(pool.map(primes_in_range, chunks(limit, workers * 4)))
    primes = [p for chunk in results for p in chunk]
    seconds = time.perf_counter() - start
    print(f"{label:<18}{len(primes):>10,} primes{seconds:>9.2f}s")
    return primes, seconds


def main():
    workers = os.cpu_count() or 4
    print(f"Primes below {LIMIT:,} using up to {workers} workers\n")

    single, t_single = run("single process", None, LIMIT, 1)
    threaded, t_threads = run("thread pool", ThreadPoolExecutor, LIMIT, workers)
    multi, t_procs = run("process pool", ProcessPoolExecutor, LIMIT, workers)

    assert single == threaded == multi, "all methods must agree"
    print(f"\nThreads speed-up:   {t_single / t_threads:.1f}x  (the GIL stops real parallelism)")
    print(f"Processes speed-up: {t_single / t_procs:.1f}x")
    print(f"Largest prime found: {multi[-1]:,}")
    print(f"Last five: {multi[-5:]}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["math.isqrt(n) + 1", "A divisor bigger than √n would pair with one smaller than √n, so checking up to the square root is enough. <code>isqrt</code> is the integer square root."],
      ["def primes_in_range(bounds):", "Defined at module level and taking a single tuple, so it can be pickled and sent to worker processes."],
      ["chunks(limit, workers * 4)", "More chunks than workers balances the load: chunks with big numbers take longer, so small pieces keep every core busy."],
      ["[p for chunk in results for p in chunk]", "A nested comprehension that flattens the list of lists. <code>map</code> keeps results in order, so the primes stay sorted."],
      ["if __name__ == \"__main__\": main()", "Essential with process pools; without it, workers would re-run the program."]
    ],
    stretch: ["Measure how the speed-up changes with 1, 2, 4 and 8 workers and plot it on Day 78.", "Replace the trial division with a Sieve of Eratosthenes. How does the single-process time compare?"]
  },
  tests: ["All three methods must find the same primes (the assert checks this).", "Compare the speed-ups and explain the difference in your own words.", "Remove the <code>__main__</code> guard (on Windows or macOS) and observe the error, then put it back."]
};

L[69] = {
  intro: "asyncio runs many waiting tasks concurrently in a single thread, switching between them whenever one is waiting. It's how modern Python web servers and API clients handle thousands of connections.",
  lesson: [
    {h: "Coroutines",
     p: "<code>async def</code> defines a <b>coroutine function</b>. Calling it doesn't run it; it creates a coroutine object. You run coroutines with <code>await</code> (from inside another coroutine) or with <code>asyncio.run(main())</code> at the top level.",
     code: R`import asyncio

async def greet(name):
    await asyncio.sleep(1)     # wait without blocking other tasks
    return f"Hello {name}"

async def main():
    print(await greet("Amina"))

asyncio.run(main())`},
    {h: "The event loop",
     p: "<code>asyncio.run</code> starts an <b>event loop</b>. When a coroutine reaches <code>await</code> on something slow, it pauses and the loop runs another task that's ready. Nothing runs in parallel: tasks take turns, but only at <code>await</code> points. That makes it safer than threads (no surprise interruptions)."},
    {h: "Running tasks concurrently",
     p: "<code>await asyncio.gather(a(), b(), c())</code> runs coroutines concurrently and returns their results in order. <code>asyncio.create_task(coro())</code> starts one in the background. <code>asyncio.wait_for(coro, timeout)</code> adds a time limit.",
     code: R`async def main():
    start = asyncio.get_running_loop().time()
    results = await asyncio.gather(greet("A"), greet("B"), greet("C"))
    print(results, round(asyncio.get_running_loop().time() - start, 1))

asyncio.run(main())`,
     out: "['Hello A', 'Hello B', 'Hello C'] 1.0"},
    {h: "Never block the loop",
     p: "Inside async code, use <code>await asyncio.sleep()</code>, never <code>time.sleep()</code>; the latter freezes every task. The same applies to libraries: use async ones (like <code>httpx</code> tomorrow) instead of <code>requests</code>. For unavoidable blocking calls, <code>await asyncio.to_thread(func, args)</code> runs them in a thread."}
  ],
  exercises: [
    {q: "Write <code>async def countdown(name, n)</code> that prints a countdown with 0.5 s pauses, and run two at once with <code>gather</code>.", sol: R`import asyncio

async def countdown(name, n):
    while n > 0:
        print(name, n)
        await asyncio.sleep(0.5)
        n -= 1

async def main():
    await asyncio.gather(countdown("A", 3), countdown("B", 5))

asyncio.run(main())`},
    {q: "Replace <code>await asyncio.sleep</code> with <code>time.sleep</code> in that exercise. What changes and why?", sol: R`# The countdowns no longer interleave: time.sleep blocks the whole
# event loop, so the other task can't run until it finishes.`},
    {q: "Use <code>asyncio.wait_for</code> to give up on a 3-second task after 1 second.", sol: R`async def main():
    try:
        await asyncio.wait_for(asyncio.sleep(3), timeout=1)
    except TimeoutError:
        print("Too slow!")

asyncio.run(main())`}
  ],
  project: {
    title: "Async timers and countdowns",
    brief: "A kitchen-timer program that runs several named timers at once in one thread. Timers report progress, can be cancelled, and a watcher task prints a live status line. It demonstrates tasks, gather, cancellation and timeouts.",
    file: "day69_timers.py",
    code: R`# day69_timers.py
# Several timers running at once with asyncio.

import asyncio
import time

START = time.perf_counter()


def stamp() -> str:
    return f"[{time.perf_counter() - START:5.1f}s]"


async def timer(name: str, seconds: float, step: float = 1.0) -> str:
    """Count down, reporting every step seconds. Returns a summary."""
    remaining = seconds
    print(f"{stamp()} {name}: started ({seconds}s)")
    try:
        while remaining > 0:
            await asyncio.sleep(min(step, remaining))
            remaining = round(remaining - step, 2)
            if remaining > 0:
                print(f"{stamp()} {name}: {remaining:g}s left")
        print(f"{stamp()} {name}: DING!")
        return f"{name} finished"
    except asyncio.CancelledError:
        print(f"{stamp()} {name}: cancelled with {remaining:g}s left")
        raise


async def watcher(tasks: dict[str, asyncio.Task], every: float = 1.5) -> None:
    """Print which timers are still running until all have finished."""
    while not all(t.done() for t in tasks.values()):
        await asyncio.sleep(every)
        running = [name for name, t in tasks.items() if not t.done()]
        print(f"{stamp()} still running: {', '.join(running) or 'none'}")


async def main() -> None:
    tasks = {
        "tea": asyncio.create_task(timer("tea", 3)),
        "eggs": asyncio.create_task(timer("eggs", 5)),
        "rice": asyncio.create_task(timer("rice", 8, step=2)),
    }
    watch = asyncio.create_task(watcher(tasks))

    await asyncio.sleep(4)
    print(f"{stamp()} Changed my mind about the rice.")
    tasks["rice"].cancel()

    results = await asyncio.gather(*tasks.values(), return_exceptions=True)
    await watch
    print()
    for name, result in zip(tasks, results):
        outcome = "cancelled" if isinstance(result, asyncio.CancelledError) else result
        print(f"  {name:<5} {outcome}")

    try:
        await asyncio.wait_for(timer("pizza", 10), timeout=2)
    except TimeoutError:
        print(f"{stamp()} pizza timer gave up after 2 seconds")

    print(f"\nTotal time {time.perf_counter() - START:.1f}s, though the timers add up to 26s.")


if __name__ == "__main__":
    asyncio.run(main())`,
    explain: [
      ["asyncio.create_task(timer(\"tea\", 3))", "Starts the coroutine running in the background right away and returns a Task you can check or cancel."],
      ["await asyncio.sleep(min(step, remaining))", "Each await hands control back to the event loop, which is what lets the other timers and the watcher run."],
      ["except asyncio.CancelledError: ... raise", "<code>task.cancel()</code> raises CancelledError at the task's current await. We print a message, then re-raise so the task is properly marked cancelled."],
      ["gather(*tasks.values(), return_exceptions=True)", "Returns exceptions (like the cancellation) as results instead of raising, so one cancelled timer doesn't hide the others' results."],
      ["asyncio.wait_for(..., timeout=2)", "Cancels the pizza timer automatically if it takes longer than 2 seconds."]
    ],
    stretch: ["Let the user type new timers while others run (look up <code>asyncio.to_thread(input, ...)</code>).", "Add a pause/resume feature using <code>asyncio.Event</code>."]
  },
  tests: ["Total time should be about 7 seconds, not 26.", "Change <code>asyncio.sleep</code> in <code>timer</code> to <code>time.sleep</code> and watch everything run one after another.", "Cancel the tea timer instead."]
};

L[70] = {
  intro: "Today you combine asyncio with an async HTTP client to fetch many web resources concurrently, while respecting rate limits and handling failures.",
  lesson: [
    {h: "httpx",
     p: "<code>httpx</code> (<code>pip install httpx</code>) looks like <code>requests</code> but also has an async client. Create one <code>AsyncClient</code> and reuse it for every request; it keeps connections open between requests.",
     code: R`import asyncio
import httpx

async def main():
    async with httpx.AsyncClient(timeout=10) as client:
        r = await client.get("https://api.github.com")
        print(r.status_code)

asyncio.run(main())`},
    {h: "Many requests at once",
     p: "Create a coroutine per URL and <code>gather</code> them. A hundred requests that take a second each finish in about one second instead of a hundred."},
    {h: "Limiting concurrency with a semaphore",
     p: "Firing thousands of requests at once can overload a server or get you blocked. An <code>asyncio.Semaphore(5)</code> allows at most 5 tasks inside its <code>async with</code> block at a time; the rest wait their turn.",
     code: R`limit = asyncio.Semaphore(5)

async def fetch(client, url):
    async with limit:
        return await client.get(url)`},
    {h: "Async or threads?",
     p: "Both handle I/O-bound work. asyncio scales to many thousands of connections cheaply and avoids race conditions, but every library you call must be async. Threads work with any library. For a small script, threads are often simpler; for servers and large crawlers, asyncio wins. FastAPI (Day 97) is built on asyncio."}
  ],
  exercises: [
    {q: "Fetch three URLs concurrently with <code>httpx.AsyncClient</code> and print their status codes.", sol: R`async def main():
    urls = ["https://www.python.org", "https://pypi.org", "https://github.com"]
    async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
        responses = await asyncio.gather(*(client.get(u) for u in urls))
    for u, r in zip(urls, responses):
        print(r.status_code, u)

asyncio.run(main())`},
    {q: "Use a <code>Semaphore(2)</code> with 6 tasks that each sleep 1 second. How long does it take?", sol: R`async def task(sem, i):
    async with sem:
        await asyncio.sleep(1)

async def main():
    sem = asyncio.Semaphore(2)
    await asyncio.gather(*(task(sem, i) for i in range(6)))
# About 3 seconds: 2 at a time, 3 rounds.`}
  ],
  project: {
    title: "Async API fetcher",
    brief: "Download data about many countries from the free REST Countries API concurrently with <code>httpx</code>, limiting how many requests run at once, retrying failures, and then summarising the results. A <code>--sequential</code> flag lets you compare the timing. Needs <code>pip install httpx</code>.",
    file: "day70_async_fetcher.py",
    code: R`# day70_async_fetcher.py
# Fetches country data concurrently with httpx and asyncio.

import asyncio
import sys
import time

import httpx

API = "https://restcountries.com/v3.1/alpha/{code}"
FIELDS = "name,capital,population,region,area,currencies"
CODES = ["SO", "KE", "ET", "DJ", "UG", "TZ", "EG", "NG", "ZA", "GH",
         "MA", "GB", "DE", "JP", "BR", "IN", "US", "CA", "AU", "XX"]
MAX_CONCURRENT = 5
RETRIES = 2


async def fetch_country(client: httpx.AsyncClient, code: str, limit: asyncio.Semaphore) -> dict:
    url = API.format(code=code)
    for attempt in range(RETRIES + 1):
        try:
            async with limit:
                r = await client.get(url, params={"fields": FIELDS})
            if r.status_code == 404:
                return {"code": code, "error": "not found"}
            r.raise_for_status()
            data = r.json()
            return {
                "code": code,
                "name": data["name"]["common"],
                "capital": (data.get("capital") or ["-"])[0],
                "region": data["region"],
                "population": data["population"],
                "area": data["area"],
                "currencies": ", ".join(data.get("currencies", {})),
            }
        except (httpx.TransportError, httpx.HTTPStatusError) as error:
            if attempt == RETRIES:
                return {"code": code, "error": type(error).__name__}
            await asyncio.sleep(0.5 * 2 ** attempt)        # back off before retrying
    return {"code": code, "error": "unknown"}


async def fetch_all(codes: list[str], concurrent: bool) -> list[dict]:
    limit = asyncio.Semaphore(MAX_CONCURRENT if concurrent else 1)
    async with httpx.AsyncClient(timeout=10) as client:
        return await asyncio.gather(*(fetch_country(client, c, limit) for c in codes))


def report(results: list[dict]) -> None:
    good = [r for r in results if "error" not in r]
    bad = [r for r in results if "error" in r]
    print(f"\n{'Country':<16}{'Capital':<14}{'Region':<10}{'Population':>14}{'per km²':>9}  Currency")
    for r in sorted(good, key=lambda r: r["population"], reverse=True):
        density = r["population"] / r["area"] if r["area"] else 0
        print(f"{r['name'][:15]:<16}{r['capital'][:13]:<14}{r['region']:<10}"
              f"{r['population']:>14,}{density:>9.0f}  {r['currencies']}")
    for r in bad:
        print(f"  {r['code']}: {r['error']}")

    by_region: dict[str, int] = {}
    for r in good:
        by_region[r["region"]] = by_region.get(r["region"], 0) + r["population"]
    print("\nPopulation by region:", {k: f"{v / 1e6:.0f}M" for k, v in by_region.items()})


def main() -> None:
    concurrent = "--sequential" not in sys.argv
    start = time.perf_counter()
    results = asyncio.run(fetch_all(CODES, concurrent))
    elapsed = time.perf_counter() - start
    report(results)
    mode = f"concurrently (max {MAX_CONCURRENT} at once)" if concurrent else "one at a time"
    print(f"\nFetched {len(results)} countries {mode} in {elapsed:.2f}s")


if __name__ == "__main__":
    main()`,
    explain: [
      ["async with limit:", "Only 5 requests are in flight at any moment, which is polite to the free API. The <code>--sequential</code> mode uses a limit of 1 to compare."],
      ["await asyncio.sleep(0.5 * 2 ** attempt)", "<b>Exponential backoff</b>: wait 0.5 s, then 1 s, before retrying, giving a struggling server time to recover."],
      ["(data.get(\"capital\") or [\"-\"])[0]", "Some countries have no capital in the data; <code>or</code> supplies a default list so indexing is safe."],
      ["return {\"code\": code, \"error\": ...}", "Failures become results, so one bad country code (XX) doesn't stop the others."],
      ["asyncio.gather(*(fetch_country(...) for c in codes))", "A generator expression creates every coroutine; <code>gather</code> runs them and returns results in the same order as the codes."]
    ],
    stretch: ["Save the results to a CSV with Day 33's code, ready for pandas on Day 75.", "Add a progress counter that updates as each country arrives (use <code>asyncio.as_completed</code>)."]
  },
  tests: ["Run normally, then with <code>--sequential</code>, and compare times.", "The code XX should show \"not found\" without stopping the others.", "Disconnect from the internet: every country should report a transport error after retrying."]
};

L[71] = {
  intro: "Before optimising, measure. Today you learn to time code with <code>timeit</code>, find bottlenecks with <code>cProfile</code>, and apply the optimisations that matter most in Python.",
  lesson: [
    {h: "Rules of optimisation",
     p: "1) Make it work and test it first. 2) Measure to find where the time actually goes; it's rarely where you'd guess. 3) Optimise only the slow part, and keep the tests passing. A 10× improvement in a function that takes 1% of the time saves almost nothing."},
    {h: "timeit for small snippets",
     p: "<code>timeit</code> runs code many times and reports the time, avoiding one-off noise. In Jupyter, <code>%timeit expr</code> does the same.",
     code: R`import timeit

data = list(range(10_000))
as_set = set(data)
print(timeit.timeit(lambda: 9_999 in data, number=1000))
print(timeit.timeit(lambda: 9_999 in as_set, number=1000))`},
    {h: "cProfile for whole programs",
     p: "<code>python -m cProfile -s cumulative my_script.py</code> lists every function with how many times it was called and how long it took. Look at <code>cumtime</code> (time including everything it called) to find the expensive branch, then <code>tottime</code> to find the function doing the work itself.",
     code: R`import cProfile
import pstats

cProfile.run("main()", "profile.out")
pstats.Stats("profile.out").sort_stats("cumulative").print_stats(10)`},
    {h: "The optimisations that matter",
     p: "<b>Choose the right data structure</b>: set/dict lookups are O(1), list searches O(n). <b>Don't repeat work</b>: move calculations out of loops, cache results. <b>Use built-ins and comprehensions</b>: <code>sum</code>, <code>sorted</code>, <code>\"\".join</code> run in C. <b>Avoid building strings with += in loops</b>. <b>Vectorise</b> numeric work with NumPy (Day 74). Only after all that consider parallelism."}
  ],
  exercises: [
    {q: "Use <code>timeit</code> to compare building a string of 10,000 numbers with <code>+=</code> versus <code>\"\".join</code>.", sol: R`import timeit

def concat():
    s = ""
    for i in range(10_000):
        s += str(i)
    return s

def joined():
    return "".join(str(i) for i in range(10_000))

print(timeit.timeit(concat, number=100))
print(timeit.timeit(joined, number=100))`},
    {q: "Profile your Day 36 algorithms script with cProfile. Which function has the highest tottime?", sol: R`# python -m cProfile -s tottime day36_algorithms.py
# bubble_sort and selection_sort dominate: they're O(n²).`}
  ],
  project: {
    title: "Profile and speed up a slow script",
    brief: "A deliberately slow \"customer report\" script finds repeat customers, matches orders to products and builds a text report. Profile it, find the bottlenecks, and write a fast version. Both versions must produce identical output, which a check at the end confirms.",
    file: "day71_optimise.py",
    code: R`# day71_optimise.py
# A slow report, its profile, and an optimised version with the same output.

import cProfile
import io
import pstats
import random
import time

random.seed(42)
PRODUCTS = [{"id": i, "name": f"Product {i}", "price": round(random.uniform(1, 100), 2)}
            for i in range(2_000)]
ORDERS = [{"customer": f"C{random.randint(1, 3_000)}", "product_id": random.randint(0, 1_999),
           "qty": random.randint(1, 5)} for _ in range(20_000)]


# ---------- slow version ----------

def find_product_slow(product_id):
    for p in PRODUCTS:                      # O(n) search every time
        if p["id"] == product_id:
            return p


def repeat_customers_slow(orders):
    seen, repeats = [], []
    for o in orders:
        if o["customer"] in seen:           # list membership: O(n)
            if o["customer"] not in repeats:
                repeats.append(o["customer"])
        else:
            seen.append(o["customer"])
    return sorted(repeats)


def report_slow(orders):
    totals = {}
    for o in orders:
        product = find_product_slow(o["product_id"])
        totals[o["customer"]] = totals.get(o["customer"], 0) + product["price"] * o["qty"]
    repeats = repeat_customers_slow(orders)
    text = ""
    for c in repeats:
        text += f"{c}: {totals[c]:.2f}\n"   # string += in a loop
    return text


# ---------- fast version ----------

def report_fast(orders):
    price_of = {p["id"]: p["price"] for p in PRODUCTS}      # build a lookup once
    totals, counts = {}, {}
    for o in orders:
        c = o["customer"]
        totals[c] = totals.get(c, 0) + price_of[o["product_id"]] * o["qty"]
        counts[c] = counts.get(c, 0) + 1
    repeats = sorted(c for c, n in counts.items() if n > 1)
    return "".join(f"{c}: {totals[c]:.2f}\n" for c in repeats)


def timed(func, *args):
    start = time.perf_counter()
    result = func(*args)
    return result, time.perf_counter() - start


def main():
    print("Profiling the slow version (top 5 by total time):")
    profiler = cProfile.Profile()
    profiler.enable()
    slow, _ = timed(report_slow, ORDERS)
    profiler.disable()
    out = io.StringIO()
    pstats.Stats(profiler, stream=out).sort_stats("tottime").print_stats(5)
    print("\n".join(out.getvalue().splitlines()[4:16]))

    slow, t_slow = timed(report_slow, ORDERS)
    fast, t_fast = timed(report_fast, ORDERS)
    assert slow == fast, "the optimised version must give identical output"

    print(f"Slow: {t_slow:.3f}s   Fast: {t_fast:.4f}s   Speed-up: {t_slow / t_fast:,.0f}x")
    print(f"Repeat customers: {slow.count(chr(10)):,}")
    print("First lines of the report:")
    print("".join(fast.splitlines(keepends=True)[:3]))


if __name__ == "__main__":
    main()`,
    explain: [
      ["find_product_slow ... for p in PRODUCTS", "Called 20,000 times, each scanning up to 2,000 products: about 20 million comparisons. The profile shows it at the top."],
      ["price_of = {p[\"id\"]: p[\"price\"] for p in PRODUCTS}", "Built once, then every lookup is instant. This single change gives most of the speed-up."],
      ["if o[\"customer\"] in seen:  (a list)", "List membership checks every element. Counting with a dict replaces two O(n) lists."],
      ["\"\".join(...)", "Builds the final string in one step instead of copying it again on every <code>+=</code>."],
      ["assert slow == fast", "Optimisation must never change results. Always compare against the slow, trusted version."]
    ],
    stretch: ["Profile your Day 40 finance app's report with a few thousand fake transactions.", "Try <code>collections.Counter</code> and <code>defaultdict</code> in the fast version. Is it faster or just shorter?"]
  },
  tests: ["The assert must pass: identical output.", "Read the profile: which function has the most calls? Which the most tottime?", "Double the number of orders: how does each version's time change? (Linear versus much worse.)"]
};

L[72] = {
  intro: "Real datasets can be bigger than your computer's memory. Today you learn to process large files in a stream or in chunks, and to measure memory use.",
  lesson: [
    {h: "Memory is the limit",
     p: "Reading a file with <code>f.read()</code> or <code>list(csv.reader(f))</code> loads everything at once. A 5 GB CSV can easily need 20+ GB as Python objects. The fix is to process one row, or one chunk of rows, at a time, keeping only running totals in memory."},
    {h: "Streaming with csv",
     p: "Looping over <code>csv.DictReader</code> reads one row at a time (Day 48's lazy idea). Memory stays flat no matter how big the file.",
     code: R`import csv

total = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        total += float(row["amount"])`},
    {h: "Chunks with pandas",
     p: "<code>pd.read_csv(path, chunksize=100_000)</code> returns an iterator of DataFrames, each with 100,000 rows. Compute partial results per chunk and combine them. You'll learn pandas properly on Day 75; today you only use a little of it.",
     code: R`import pandas as pd

totals = None
for chunk in pd.read_csv("sales.csv", chunksize=100_000):
    part = chunk.groupby("category")["amount"].sum()
    totals = part if totals is None else totals.add(part, fill_value=0)`},
    {h: "Reduce what you load",
     p: "Load only the columns you need (<code>usecols=</code>), choose smaller types (<code>dtype={\"qty\": \"int32\"}</code>, <code>\"category\"</code> for repeated text), and consider faster file formats like Parquet for data you'll reuse."},
    {h: "Measuring memory",
     p: "<code>tracemalloc</code> from the standard library reports the peak memory Python allocated. Use it to compare approaches.",
     code: R`import tracemalloc

tracemalloc.start()
# ... run something ...
current, peak = tracemalloc.get_traced_memory()
print(f"peak {peak / 1e6:.1f} MB")
tracemalloc.stop()`}
  ],
  exercises: [
    {q: "Write a generator that yields rows of a CSV file as dicts with the <code>amount</code> already converted to float.", sol: R`def rows(path):
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            row["amount"] = float(row["amount"])
            yield row`},
    {q: "Using that generator, find the largest single amount without storing all rows.", sol: R`print(max(r["amount"] for r in rows("sales.csv")))`}
  ],
  project: {
    title: "Summarise a million-row CSV",
    brief: "Generate a one-million-row sales CSV, then summarise it three ways (loading everything into a list, streaming with <code>csv</code>, and pandas chunks), measuring time and peak memory for each. All three must agree on the totals. Needs <code>pip install pandas</code>.",
    file: "day72_big_csv.py",
    code: R`# day72_big_csv.py
# Summarises a million-row CSV three ways and compares memory and time.

import csv
import random
import time
import tracemalloc
from datetime import date, timedelta
from pathlib import Path

import pandas as pd

CSV_FILE = Path(__file__).parent / "sales_1m.csv"
ROWS = 1_000_000
CATEGORIES = ["electronics", "home", "books", "toys", "food", "clothing", "sports"]
REGIONS = ["north", "south", "east", "west"]


def generate(path=CSV_FILE, rows=ROWS, seed=7):
    rng = random.Random(seed)
    start = date(2025, 1, 1)
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["order_id", "date", "region", "category", "qty", "amount"])
        for i in range(rows):
            day = start + timedelta(days=rng.randint(0, 364))
            qty = rng.randint(1, 5)
            writer.writerow([i, day.isoformat(), rng.choice(REGIONS), rng.choice(CATEGORIES),
                             qty, round(qty * rng.uniform(2, 80), 2)])


def summarise_list(path):
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))                 # everything in memory
    totals = {}
    for r in rows:
        totals[r["category"]] = totals.get(r["category"], 0) + float(r["amount"])
    return totals


def summarise_stream(path):
    totals = {}
    with open(path, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):                    # one row at a time
            totals[r["category"]] = totals.get(r["category"], 0) + float(r["amount"])
    return totals


def summarise_chunks(path, chunksize=100_000):
    totals = None
    for chunk in pd.read_csv(path, usecols=["category", "amount"],
                             dtype={"category": "category"}, chunksize=chunksize):
        part = chunk.groupby("category", observed=True)["amount"].sum()
        totals = part if totals is None else totals.add(part, fill_value=0)
    return totals.to_dict()


def measure(label, func):
    tracemalloc.start()
    start = time.perf_counter()
    result = func(CSV_FILE)
    seconds = time.perf_counter() - start
    _, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    print(f"{label:<22}{seconds:>8.2f}s{peak / 1e6:>10.1f} MB peak")
    return result


def main():
    if not CSV_FILE.exists():
        print(f"Generating {ROWS:,} rows...")
        generate()
    print(f"{CSV_FILE.name}: {CSV_FILE.stat().st_size / 1e6:.0f} MB on disk\n")
    print(f"{'method':<22}{'time':>9}{'memory':>15}")

    a = measure("load everything", summarise_list)
    b = measure("stream with csv", summarise_stream)
    c = measure("pandas chunks", summarise_chunks)

    for category in sorted(a):
        assert abs(a[category] - b[category]) < 0.01 and abs(a[category] - c[category]) < 0.01
    print("\nAll three methods agree.\n")

    grand = sum(a.values())
    for category, total in sorted(a.items(), key=lambda kv: -kv[1]):
        print(f"  {category:<12}{total:>16,.2f}  {total / grand:6.1%}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["rows = list(csv.DictReader(f))", "Turns a million rows into a million dicts at once. tracemalloc will show this uses far more memory than the file size."],
      ["for r in csv.DictReader(f):", "The streaming version keeps only the 7 running totals in memory. Its peak barely changes whether the file has a thousand rows or a billion."],
      ["usecols=[\"category\", \"amount\"], dtype={\"category\": \"category\"}", "Pandas reads only two columns and stores the repeated category names efficiently."],
      ["totals.add(part, fill_value=0)", "Combines each chunk's partial sums into the running total, treating missing categories as 0."],
      ["assert abs(a[category] - b[category]) < 0.01", "Floating-point sums can differ in the last digits depending on order, so we compare with a tolerance."]
    ],
    stretch: ["Also summarise by month and region in the streaming version.", "Save the data as Parquet (<code>pip install pyarrow</code>, then <code>df.to_parquet</code>) and compare file size and load time."]
  },
  tests: ["Compare the three peak memory figures; the list approach should be by far the largest.", "Try a chunk size of 10,000 and of 500,000.", "Add <code>sales_1m.csv</code> to <code>.gitignore</code>: large data files don't belong in Git."]
};

L[73] = {
  intro: "NumPy is the foundation of nearly all data science and ML in Python. Today you set up Jupyter notebooks and learn NumPy arrays: creating them, their shapes, indexing and simple statistics.",
  lesson: [
    {h: "Jupyter notebooks",
     p: "A notebook mixes code, output, charts and notes in cells you run one at a time, which is ideal for exploring data. Install with <code>pip install jupyter numpy</code> in your venv. In VS Code, create a <code>.ipynb</code> file, or put <code># %%</code> lines in a normal <code>.py</code> file: each section becomes a runnable cell (\"Run Cell\" appears above it). Today's project uses the <code># %%</code> style."},
    {h: "Arrays",
     p: "<code>np.array</code> holds many numbers of <b>one type</b> in a compact block of memory. Unlike lists, maths applies to every element at once. Key attributes: <code>shape</code> (size along each dimension), <code>ndim</code>, <code>dtype</code> (the element type) and <code>size</code>.",
     code: R`import numpy as np

a = np.array([3, 1, 4, 1, 5])
print(a * 2, a.sum(), a.mean())

m = np.array([[1, 2, 3], [4, 5, 6]])
print(m.shape, m.ndim, m.dtype)`,
     out: "[ 6  2  8  2 10] 14 2.8\n(2, 3) 2 int64"},
    {h: "Creating arrays",
     p: "<code>np.zeros((3, 4))</code>, <code>np.ones</code>, <code>np.arange(0, 10, 2)</code>, <code>np.linspace(0, 1, 5)</code> (evenly spaced). For random data use a generator: <code>rng = np.random.default_rng(42)</code>, then <code>rng.integers</code>, <code>rng.normal</code>, <code>rng.random</code>. <code>reshape</code> changes the shape without copying data.",
     code: R`rng = np.random.default_rng(42)
scores = rng.integers(40, 100, size=(4, 3))   # 4 students, 3 subjects
print(scores)
print(np.arange(12).reshape(3, 4))`},
    {h: "Indexing and slicing in 2-D",
     p: "<code>m[row, col]</code> gets one element. <code>m[1]</code> is a whole row, <code>m[:, 0]</code> a whole column, <code>m[:2, 1:]</code> a block. Slices are <b>views</b> that share memory with the original; use <code>.copy()</code> for an independent array."},
    {h: "Axes",
     p: "Statistics can run over the whole array or along an axis. For a 2-D array, <code>axis=0</code> goes down the rows (one result per column) and <code>axis=1</code> goes across the columns (one result per row). This idea is everywhere in pandas and ML.",
     code: R`print(scores.mean(axis=0))   # average per subject (column)
print(scores.mean(axis=1))   # average per student (row)`}
  ],
  exercises: [
    {q: "Create an array of the numbers 1 to 20 and print the even ones, the sum and the standard deviation.", sol: R`a = np.arange(1, 21)
print(a[a % 2 == 0], a.sum(), a.std())`},
    {q: "Make a 5×5 array of zeros and set its border to 1 with slicing.", sol: R`m = np.zeros((5, 5), dtype=int)
m[0, :] = m[-1, :] = 1
m[:, 0] = m[:, -1] = 1
print(m)`},
    {q: "Generate 1,000 numbers from a normal distribution with mean 170 and standard deviation 8 (heights). Check the mean and std are close.", sol: R`rng = np.random.default_rng(0)
heights = rng.normal(170, 8, size=1000)
print(heights.mean().round(1), heights.std().round(1))`}
  ],
  project: {
    title: "Exam score statistics",
    brief: "Analyse exam scores for a class of 30 students across 5 subjects, stored in a 2-D NumPy array. Compute per-student and per-subject statistics, rank students, find each subject's top student, standardise scores to z-scores, and find correlated subjects. Written as notebook cells with <code># %%</code>. Needs <code>pip install numpy</code>.",
    file: "day73_exam_stats.py",
    code: R`# day73_exam_stats.py
# Exam statistics with NumPy. Each "# %%" starts a notebook cell in VS Code.

# %% Setup: fake but realistic scores
import numpy as np

rng = np.random.default_rng(2026)
subjects = np.array(["Maths", "Physics", "English", "History", "CS"])
students = np.array([f"S{i:02d}" for i in range(1, 31)])

ability = rng.normal(65, 12, size=(30, 1))            # each student's general level
subject_bias = np.array([0, -3, 4, 2, 5])             # some exams are easier
noise = rng.normal(0, 8, size=(30, 5))
scores = np.clip(np.round(ability + subject_bias + noise), 0, 100).astype(int)
scores[:, 1] = np.clip(np.round(0.6 * scores[:, 0] + 0.4 * scores[:, 1]), 0, 100)  # physics follows maths

print("shape:", scores.shape, "dtype:", scores.dtype)
print(scores[:5])

# %% Per-subject statistics (axis=0 means "down the rows")
print(f"{'subject':<9}{'mean':>7}{'median':>8}{'std':>7}{'min':>5}{'max':>5}{'pass%':>7}")
for name, col in zip(subjects, scores.T):
    print(f"{name:<9}{col.mean():>7.1f}{np.median(col):>8.1f}{col.std():>7.1f}"
          f"{col.min():>5}{col.max():>5}{(col >= 50).mean():>7.0%}")

# %% Per-student averages and ranking (axis=1 means "across the columns")
averages = scores.mean(axis=1)
order = np.argsort(averages)[::-1]            # indexes from best to worst
print("Top 5 students:")
for rank, i in enumerate(order[:5], start=1):
    print(f"  {rank}. {students[i]}  average {averages[i]:.1f}  scores {scores[i]}")

# %% Best student in each subject
best = scores.argmax(axis=0)
for subject, i in zip(subjects, best):
    print(f"  {subject:<8} {students[i]} with {scores[i, list(subjects).index(subject)]}")

# %% Boolean masks: who needs help?
failing = scores < 50
needs_help = failing.sum(axis=1) >= 2
print(f"{needs_help.sum()} students failed two or more subjects:", students[needs_help])

# %% Standardise to z-scores: how unusual is each score within its subject?
z = (scores - scores.mean(axis=0)) / scores.std(axis=0)
i, j = np.unravel_index(np.abs(z).argmax(), z.shape)
print(f"Most unusual score: {students[i]} in {subjects[j]}: {scores[i, j]} (z = {z[i, j]:+.2f})")

# %% Which subjects go together? (correlation matrix)
corr = np.corrcoef(scores.T)
print("        " + "".join(f"{s[:7]:>8}" for s in subjects))
for name, row in zip(subjects, corr):
    print(f"{name:<8}" + "".join(f"{v:>8.2f}" for v in row))`,
    explain: [
      ["ability + subject_bias + noise", "<b>Broadcasting</b> (tomorrow's topic): a (30, 1) column, a (5,) row and a (30, 5) grid combine into a (30, 5) result."],
      ["for name, col in zip(subjects, scores.T):", "<code>.T</code> transposes the array, so looping gives one subject column at a time."],
      ["(col >= 50).mean()", "A comparison gives an array of True/False; the mean of booleans is the fraction that are True."],
      ["np.argsort(averages)[::-1]", "<code>argsort</code> returns the positions that would sort the array; reversing gives best first."],
      ["np.corrcoef(scores.T)", "Pearson correlation between every pair of subjects. Maths and Physics should stand out, because the data was built that way."]
    ],
    stretch: ["Give each subject a weight and compute weighted averages with <code>np.average(scores, axis=1, weights=...)</code>.", "Convert the file to a real notebook: in VS Code, right-click and choose \"Export current Python file as Jupyter Notebook\"."]
  },
  tests: ["Run each cell separately in VS Code with \"Run Cell\".", "Check one student's average by hand.", "Change the seed: the statistics change, but Maths–Physics stays the strongest correlation."]
};

L[74] = {
  intro: "Vectorisation means replacing Python loops with whole-array operations that run in fast C code. Today you learn vectorisation, broadcasting and boolean masks, and use them to build image filters.",
  lesson: [
    {h: "Vectorised operations",
     p: "Arithmetic, comparisons and maths functions (<code>np.sqrt</code>, <code>np.exp</code>, <code>np.log</code>) apply element by element to entire arrays. The loop still happens, but in optimised C code, often 50 to 100 times faster than a Python loop.",
     code: R`import numpy as np, time

x = np.random.default_rng(0).random(1_000_000)

start = time.perf_counter()
slow = [v * v + 1 for v in x]
print("loop ", time.perf_counter() - start)

start = time.perf_counter()
fast = x * x + 1
print("numpy", time.perf_counter() - start)`},
    {h: "Broadcasting",
     p: "When shapes differ, NumPy stretches the smaller array to match, without copying. Shapes are compared from the right: each dimension must be equal or 1. A (3, 4) array plus a (4,) row adds the row to every row; plus a (3, 1) column adds the column to every column.",
     code: R`m = np.arange(12).reshape(3, 4)
print(m - m.mean(axis=0))          # (3,4) - (4,): centre each column
print(m / m.sum(axis=1, keepdims=True))   # (3,4) / (3,1): each row sums to 1`},
    {h: "Boolean masks and np.where",
     p: "A comparison makes a boolean array; using it as an index selects matching elements, or assigns to them. <code>np.where(cond, a, b)</code> chooses element by element. Combine conditions with <code>&amp;</code>, <code>|</code> and <code>~</code>, with parentheses around each one.",
     code: R`temps = np.array([18, 25, 31, 22, 35])
print(temps[temps > 24])
print(np.where(temps > 30, "hot", "ok"))
temps[(temps > 20) & (temps < 30)] = 0`},
    {h: "Images are arrays",
     p: "A colour image is a 3-D array of shape (height, width, 3): red, green and blue values from 0 to 255 for each pixel. Pillow (<code>pip install pillow</code>) loads images, and <code>np.asarray(img)</code> turns one into an array. Every filter is just array maths. This is also exactly how image data enters neural networks (Day 95)."}
  ],
  exercises: [
    {q: "Normalise an array to the range 0 to 1 with <code>(x - min) / (max - min)</code> in one line.", sol: R`x = np.array([3.0, 7.0, 1.0, 9.0])
print((x - x.min()) / (x.max() - x.min()))`},
    {q: "Create a 10×10 multiplication table with broadcasting (no loops).", sol: R`n = np.arange(1, 11)
print(n[:, None] * n)      # (10,1) * (10,) -> (10,10)`},
    {q: "Replace every negative value in an array with 0 using a mask, then using <code>np.where</code>.", sol: R`a = np.array([3, -1, 4, -5])
b = a.copy(); b[b < 0] = 0
c = np.where(a < 0, 0, a)
# also: np.maximum(a, 0) or np.clip(a, 0, None)`}
  ],
  project: {
    title: "Image filters on pixel arrays",
    brief: "Build a set of photo filters using only NumPy array operations: greyscale, invert, brightness, sepia, blur, edge detection and a colour-splash effect. Use your own photo, or the program generates a test image. Results are saved side by side. Needs <code>pip install numpy pillow</code>.",
    file: "day74_filters.py",
    code: R`# day74_filters.py
# Image filters written as NumPy array operations.

import sys
from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).parent / "filtered"


def test_image(h=240, w=320):
    """A colourful generated image: gradients, a circle and stripes."""
    y, x = np.mgrid[0:h, 0:w]
    img = np.zeros((h, w, 3))
    img[..., 0] = x / w * 255                     # red increases to the right
    img[..., 1] = y / h * 255                     # green increases downwards
    img[..., 2] = 128 + 127 * np.sin(x / 15)      # blue stripes
    circle = (x - w * 0.6) ** 2 + (y - h * 0.5) ** 2 < (h * 0.3) ** 2
    img[circle] = [230, 40, 40]                   # a red circle
    return img.astype(np.uint8)


def greyscale(img):
    weights = np.array([0.299, 0.587, 0.114])    # how bright each channel looks to us
    grey = img[..., :3] @ weights                # (h, w, 3) @ (3,) -> (h, w)
    return np.stack([grey] * 3, axis=-1).astype(np.uint8)


def invert(img):
    return 255 - img


def brightness(img, amount=60):
    return np.clip(img.astype(int) + amount, 0, 255).astype(np.uint8)


def sepia(img):
    matrix = np.array([[0.393, 0.769, 0.189],
                       [0.349, 0.686, 0.168],
                       [0.272, 0.534, 0.131]])
    return np.clip(img[..., :3] @ matrix.T, 0, 255).astype(np.uint8)


def box_blur(img, radius=4):
    """Average each pixel with its neighbours, using shifted copies instead of loops over pixels."""
    padded = np.pad(img.astype(float), ((radius, radius), (radius, radius), (0, 0)), mode="edge")
    h, w = img.shape[:2]
    total = np.zeros(img.shape, dtype=float)
    size = 2 * radius + 1
    for dy in range(size):
        for dx in range(size):
            total += padded[dy:dy + h, dx:dx + w]
    return (total / size ** 2).astype(np.uint8)


def edges(img, threshold=15):
    grey = greyscale(img)[..., 0].astype(float)
    gx = np.zeros_like(grey)
    gy = np.zeros_like(grey)
    gx[:, 1:-1] = grey[:, 2:] - grey[:, :-2]      # horizontal change
    gy[1:-1, :] = grey[2:, :] - grey[:-2, :]      # vertical change
    magnitude = np.hypot(gx, gy)
    out = np.where(magnitude > threshold, 255, 0).astype(np.uint8)
    return np.stack([out] * 3, axis=-1)


def colour_splash(img):
    """Keep strongly red pixels in colour, make everything else grey."""
    r, g, b = (img[..., c].astype(int) for c in range(3))
    is_red = (r > 150) & (r > g + 60) & (r > b + 60)
    return np.where(is_red[..., None], img[..., :3], greyscale(img))


FILTERS = {"greyscale": greyscale, "invert": invert, "bright": brightness, "sepia": sepia,
           "blur": box_blur, "edges": edges, "splash": colour_splash}


def main():
    if len(sys.argv) > 1:
        img = np.asarray(Image.open(sys.argv[1]).convert("RGB"))
    else:
        img = test_image()
    print(f"Image: shape {img.shape}, dtype {img.dtype}, mean brightness {img.mean():.0f}")

    OUT.mkdir(exist_ok=True)
    tiles = [img]
    for name, func in FILTERS.items():
        result = func(img)
        Image.fromarray(result).save(OUT / f"{name}.png")
        tiles.append(result)
        print(f"  {name:<10} -> {OUT.name}/{name}.png")

    row1 = np.concatenate(tiles[:4], axis=1)
    row2 = np.concatenate(tiles[4:], axis=1)
    Image.fromarray(np.concatenate([row1, row2], axis=0)).save(OUT / "all.png")
    print(f"Contact sheet saved to {OUT.name}/all.png")


if __name__ == "__main__":
    main()`,
    explain: [
      ["y, x = np.mgrid[0:h, 0:w]", "Two arrays holding every pixel's row and column number, so formulas like a circle can be computed for all pixels at once."],
      ["img[..., :3] @ weights", "<code>@</code> is matrix multiplication. Multiplying each pixel's (R, G, B) by the weights and summing gives its brightness, for all pixels in one step."],
      ["img.astype(int) + amount", "uint8 values wrap around (250 + 10 becomes 4!), so we convert to int, add, clip to 0–255, and convert back."],
      ["padded[dy:dy + h, dx:dx + w]", "The blur adds shifted copies of the whole image. The double loop runs only (2r+1)² times, not once per pixel."],
      ["np.where(is_red[..., None], img, greyscale(img))", "<code>[..., None]</code> adds a dimension so the (h, w) mask broadcasts across the 3 colour channels."]
    ],
    stretch: ["Add a pixelate filter: shrink by taking every 10th pixel with slicing, then enlarge with <code>np.repeat</code>.", "Run your filters on a photo of your own: <code>python day74_filters.py photo.jpg</code>."]
  },
  tests: ["Open <code>filtered/all.png</code> and check each filter looks right.", "Inverting twice must give back the original: <code>(invert(invert(img)) == img).all()</code>.", "Time <code>box_blur</code> and compare with a version that loops over every pixel (use a small image!)."]
};

L[75] = {
  intro: "pandas is the main tool for working with tables of data in Python. Today you learn Series and DataFrames: loading data, inspecting it, selecting rows and columns, and sorting.",
  lesson: [
    {h: "Series and DataFrame",
     p: "A <b>Series</b> is a one-dimensional labelled array: values plus an <b>index</b>. A <b>DataFrame</b> is a table: several Series (columns) sharing one index. Under the hood, columns are NumPy arrays, so vectorised maths works. Install with <code>pip install pandas</code>; import as <code>pd</code> by convention.",
     code: R`import pandas as pd

df = pd.DataFrame({
    "name": ["Amina", "Omar", "Sara"],
    "age": [24, 31, 19],
    "city": ["Hargeisa", "Nairobi", "Hargeisa"],
})
print(df)
print(df["age"].mean())`},
    {h: "Loading and inspecting",
     p: "<code>pd.read_csv(path)</code> loads a CSV (also <code>read_excel</code>, <code>read_json</code>, <code>read_sql</code>). Always inspect first: <code>df.head()</code>, <code>df.shape</code>, <code>df.info()</code> (columns, types, missing counts), <code>df.describe()</code> (statistics for numeric columns), <code>df[\"col\"].value_counts()</code>."},
    {h: "Selecting",
     p: "<code>df[\"col\"]</code> is one column (a Series); <code>df[[\"a\", \"b\"]]</code> several. <code>df.loc[rows, cols]</code> selects by <b>label</b>; <code>df.iloc[rows, cols]</code> by <b>position</b>. Filter rows with a boolean mask, as in NumPy, or with <code>df.query(\"age &gt; 20\")</code>.",
     code: R`adults = df[df["age"] >= 20]
in_city = df.loc[df["city"] == "Hargeisa", ["name", "age"]]
first_two = df.iloc[:2]
print(df.query("age > 20 and city == 'Nairobi'"))`},
    {h: "New columns and sorting",
     p: "Assign to a new column name to add a column, computed from others with vectorised maths. <code>sort_values(\"col\", ascending=False)</code> sorts; <code>nlargest(5, \"col\")</code> is a shortcut. Most methods return a new DataFrame rather than changing the original.",
     code: R`df["age_in_months"] = df["age"] * 12
print(df.sort_values("age", ascending=False))`}
  ],
  exercises: [
    {q: "Create a DataFrame of 5 countries with population and area, add a <code>density</code> column, and sort by it.", sol: R`df = pd.DataFrame({"country": ["Somalia", "Kenya", "Ethiopia", "Egypt", "Djibouti"],
                   "population": [18.1e6, 55.1e6, 126.5e6, 112.7e6, 1.1e6],
                   "area": [637657, 580367, 1104300, 1002450, 23200]})
df["density"] = df["population"] / df["area"]
print(df.sort_values("density", ascending=False))`},
    {q: "Select the countries with more than 50 million people, showing only name and population.", sol: R`print(df.loc[df["population"] > 50e6, ["country", "population"]])`},
    {q: "What's the difference between <code>df.loc[0]</code> and <code>df.iloc[0]</code> after sorting?", sol: R`# loc[0] finds the row whose index label is 0 (wherever it now is);
# iloc[0] takes whatever row is currently first.`}
  ],
  project: {
    title: "Explore a movies dataset",
    brief: "Explore a catalogue of 600 films on a made-up streaming service: generate the dataset with a seed, save and reload it as CSV, inspect it, then answer questions with selection, filtering, sorting and new columns. (The titles and numbers are synthetic, so you can generate exactly the same data as everyone else.) Written as notebook cells. Needs <code>pip install pandas numpy</code>.",
    file: "day75_movies_pandas.py",
    code: R`# day75_movies_pandas.py
# Exploring a (synthetic) streaming catalogue with pandas.

# %% Create the dataset and save it as CSV
from pathlib import Path

import numpy as np
import pandas as pd

rng = np.random.default_rng(75)
n = 600
genres = rng.choice(["Drama", "Comedy", "Action", "Documentary", "Animation", "Thriller", "Sci-Fi"],
                    size=n, p=[0.24, 0.2, 0.17, 0.1, 0.09, 0.12, 0.08])
words_a = ["Silent", "Last", "Golden", "Hidden", "Broken", "Midnight", "Lost", "Second", "Wild", "Red"]
words_b = ["River", "Kingdom", "Signal", "Garden", "Promise", "City", "Storm", "Letter", "Road", "Star"]

movies = pd.DataFrame({
    "title": [f"The {rng.choice(words_a)} {rng.choice(words_b)} {i}" for i in range(n)],
    "genre": genres,
    "year": rng.integers(1980, 2027, size=n),
    "runtime": np.clip(rng.normal(108, 18, size=n).round(), 70, 200).astype(int),
    "rating": np.clip(rng.normal(6.6, 1.0, size=n), 1, 10).round(1),
    "votes": (10 ** rng.uniform(2, 6, size=n)).astype(int),
    "budget_musd": np.clip(rng.lognormal(3, 1, size=n), 0.5, 300).round(1),
})
movies["revenue_musd"] = (movies["budget_musd"] * rng.lognormal(0.6, 0.8, size=n)).round(1)
movies.loc[movies["genre"] == "Documentary", "runtime"] -= 20

path = Path(__file__).parent / "movies.csv"
movies.to_csv(path, index=False)
df = pd.read_csv(path)

# %% Inspect
print(df.shape)
print(df.head())
df.info()
print(df.describe().round(1))

# %% Counting
print(df["genre"].value_counts())
print("Films per decade:")
print((df["year"] // 10 * 10).value_counts().sort_index())

# %% New columns
df["profit_musd"] = df["revenue_musd"] - df["budget_musd"]
df["roi"] = df["profit_musd"] / df["budget_musd"]
df["long"] = df["runtime"] > 130

# %% Questions answered with selection and sorting
print("Highest rated with at least 50,000 votes:")
popular = df[df["votes"] >= 50_000]
print(popular.nlargest(5, "rating")[["title", "genre", "year", "rating", "votes"]])

print("\nBiggest money-makers:")
print(df.sort_values("profit_musd", ascending=False).head(5)[["title", "budget_musd", "revenue_musd"]])

print("\nRecent long sci-fi:")
print(df.query("genre == 'Sci-Fi' and year >= 2015 and long")[["title", "year", "runtime"]])

print("\nShare of films that lost money:", f"{(df['profit_musd'] < 0).mean():.0%}")

# %% loc vs iloc
best = df.sort_values("rating", ascending=False)
print("iloc[0] (first row after sorting):", best.iloc[0]["title"])
print("loc[0]  (the row labelled 0):     ", best.loc[0, "title"])

# %% Average rating and runtime by genre (a preview of tomorrow)
print(df.groupby("genre")[["rating", "runtime"]].mean().round(1).sort_values("rating"))`,
    explain: [
      ["rng.choice([...], size=n, p=[...])", "Picks genres with the given probabilities, so some genres are more common, like a real catalogue."],
      ["(10 ** rng.uniform(2, 6, size=n)).astype(int)", "Vote counts spread from 100 to 1,000,000 on a log scale: a few films are hugely popular, most are not."],
      ["df.info()", "Shows each column's type and how many values are present. Always run it first on new data."],
      ["df[df[\"votes\"] >= 50_000]", "A boolean mask selects rows, exactly like NumPy masks."],
      ["best.iloc[0] vs best.loc[0, \"title\"]", "After sorting, position 0 and label 0 are different rows. Mixing them up is one of the most common pandas bugs."]
    ],
    stretch: ["Find the director-less question you're curious about, such as \"which year had the best average rating?\", and answer it.", "Load a real dataset: many are free on kaggle.com or data.world. Inspect it with the same steps."]
  },
  tests: ["Run each cell in order in VS Code.", "<code>df.info()</code> should show 600 rows and no missing values.", "Check one filter by eye: do all rows in the sci-fi result meet every condition?"]
};

L[76] = {
  intro: "Today you learn pandas' most powerful tools: grouping and aggregating, merging tables, pivot tables, and working with dates. These turn raw transactions into reports.",
  lesson: [
    {h: "groupby: split, apply, combine",
     p: "<code>df.groupby(\"col\")</code> splits rows into groups, an aggregation computes one value per group, and the results combine into a new table. <code>agg</code> computes several statistics at once, with readable names.",
     code: R`sales.groupby("region")["amount"].sum()

sales.groupby(["region", "category"]).agg(
    revenue=("amount", "sum"),
    orders=("order_id", "count"),
    avg_order=("amount", "mean"),
)`},
    {h: "merge: joining tables",
     p: "<code>pd.merge(left, right, on=\"key\")</code> joins tables like SQL's JOIN (Day 58). <code>how=\"left\"</code> keeps every left row even without a match. Check the row count afterwards: an unexpected increase usually means duplicate keys.",
     code: R`orders = pd.merge(orders, products, on="product_id", how="left")
orders = orders.merge(customers, on="customer_id", how="left")`},
    {h: "Pivot tables",
     p: "<code>pivot_table</code> builds a spreadsheet-style summary: one variable down the rows, another across the columns, and an aggregate in the cells.",
     code: R`pd.pivot_table(sales, index="month", columns="region",
               values="amount", aggfunc="sum", fill_value=0)`},
    {h: "Dates",
     p: "Convert text to dates with <code>pd.to_datetime</code>. The <code>.dt</code> accessor gives parts: <code>.dt.month</code>, <code>.dt.day_name()</code>, <code>.dt.to_period(\"M\")</code> for months. <code>resample(\"W\")</code> groups a date-indexed table by week."}
  ],
  exercises: [
    {q: "Given a DataFrame of expenses with category and amount, find the total and average per category, sorted by total.", sol: R`(expenses.groupby("category")["amount"]
    .agg(["sum", "mean"])
    .sort_values("sum", ascending=False))`},
    {q: "Merge a <code>students</code> table (id, name) with a <code>scores</code> table (student_id, subject, score), then compute each student's average.", sol: R`merged = scores.merge(students, left_on="student_id", right_on="id")
print(merged.groupby("name")["score"].mean())`},
    {q: "Make a pivot table of average score with students as rows and subjects as columns.", sol: R`print(merged.pivot_table(index="name", columns="subject", values="score", aggfunc="mean"))`}
  ],
  project: {
    title: "Sales performance report",
    brief: "Build a sales report for a fictional shop from three related tables (orders, products and stores): merge them, then answer business questions with groupby, pivot tables and dates. The data is generated with a seed. Needs <code>pip install pandas numpy</code>.",
    file: "day76_sales_report.py",
    code: R`# day76_sales_report.py
# A sales report from three related tables using pandas.

# %% Build three related tables
import numpy as np
import pandas as pd

rng = np.random.default_rng(76)

products = pd.DataFrame({
    "product_id": range(1, 13),
    "product": ["Laptop", "Phone", "Tablet", "Headphones", "Charger", "Mouse",
                "Keyboard", "Monitor", "Desk", "Chair", "Lamp", "Backpack"],
    "category": ["Electronics"] * 8 + ["Furniture"] * 3 + ["Accessories"],
    "price": [850, 620, 330, 95, 25, 30, 55, 210, 240, 180, 45, 60],
    "unit_cost": [700, 480, 250, 50, 9, 12, 25, 160, 150, 110, 20, 28],
})
stores = pd.DataFrame({
    "store_id": [1, 2, 3, 4],
    "store": ["Hargeisa Central", "Mogadishu Mall", "Nairobi CBD", "Online"],
    "region": ["Somaliland", "Somalia", "Kenya", "Online"],
})
n = 5_000
orders = pd.DataFrame({
    "order_id": range(10_001, 10_001 + n),
    "date": pd.to_datetime("2026-01-01") + pd.to_timedelta(rng.integers(0, 273, n), unit="D"),
    "store_id": rng.choice([1, 2, 3, 4], size=n, p=[0.2, 0.25, 0.2, 0.35]),
    "product_id": rng.integers(1, 13, size=n),
    "qty": rng.choice([1, 1, 1, 2, 2, 3], size=n),
    "discount": rng.choice([0, 0, 0, 0.05, 0.1], size=n),
})

# %% Merge into one analysis table
sales = (orders
         .merge(products, on="product_id", how="left")
         .merge(stores, on="store_id", how="left"))
assert len(sales) == len(orders), "a merge must not duplicate orders"

sales["revenue"] = sales["qty"] * sales["price"] * (1 - sales["discount"])
sales["profit"] = sales["revenue"] - sales["qty"] * sales["unit_cost"]
sales["month"] = sales["date"].dt.to_period("M")
print(sales.head())

# %% Headline numbers
print(f"Revenue {sales['revenue'].sum():,.0f}   Profit {sales['profit'].sum():,.0f}   "
      f"Margin {sales['profit'].sum() / sales['revenue'].sum():.1%}   Orders {len(sales):,}")

# %% Performance by store
by_store = sales.groupby("store").agg(
    revenue=("revenue", "sum"),
    profit=("profit", "sum"),
    orders=("order_id", "count"),
    avg_order=("revenue", "mean"),
).sort_values("revenue", ascending=False)
by_store["margin"] = by_store["profit"] / by_store["revenue"]
print(by_store.round(2))

# %% Monthly revenue per store (pivot table)
monthly = sales.pivot_table(index="month", columns="store", values="revenue",
                            aggfunc="sum", fill_value=0)
print(monthly.round(0))
print("Month-on-month growth (all stores):")
print(monthly.sum(axis=1).pct_change().round(3).dropna())

# %% Best and worst products by profit
by_product = (sales.groupby(["category", "product"])["profit"].sum()
              .sort_values(ascending=False))
print(by_product.head(3))
print(by_product.tail(3))

# %% Do discounts pay off?
print(sales.groupby("discount").agg(orders=("order_id", "count"),
                                    avg_qty=("qty", "mean"),
                                    margin=("profit", "sum")).round(2))

# %% Weekday pattern
weekday = sales.groupby(sales["date"].dt.day_name())["revenue"].sum()
order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
print(weekday.reindex(order).round(0))

# %% Export for a spreadsheet
by_store.to_csv("report_by_store.csv")
monthly.to_csv("report_monthly.csv")
print("Saved report_by_store.csv and report_monthly.csv")`,
    explain: [
      ["orders.merge(products, ...).merge(stores, ...)", "Method chaining in parentheses keeps a multi-step transformation readable, one step per line."],
      ["assert len(sales) == len(orders)", "A safety check: if a lookup table had duplicate keys, the merge would silently multiply rows."],
      ["sales[\"date\"].dt.to_period(\"M\")", "Turns each date into its month, perfect for monthly grouping."],
      ["groupby(...).agg(revenue=(\"revenue\", \"sum\"), ...)", "<b>Named aggregation</b>: each new column states its source column and function."],
      ["monthly.sum(axis=1).pct_change()", "Totals each month across stores, then computes the percentage change from the previous month."]
    ],
    stretch: ["Find the best-selling product in each store using <code>groupby</code> and <code>idxmax</code>.", "Add a customers table and find the top 10 customers by lifetime value."]
  },
  tests: ["The assert after merging must pass.", "Check that the store revenues add up to the headline revenue.", "Open the exported CSV files in a spreadsheet."]
};

L[77] = {
  intro: "Real data is messy: missing values, duplicates, inconsistent text, wrong types and impossible values. Data scientists spend much of their time cleaning, and today you learn a systematic way to do it.",
  lesson: [
    {h: "Finding problems",
     p: "Before fixing anything, look. <code>df.info()</code> and <code>df.isna().sum()</code> show missing values. <code>df.duplicated().sum()</code> counts duplicate rows. <code>df[\"col\"].unique()</code> and <code>value_counts()</code> reveal inconsistent spellings. <code>describe()</code> exposes impossible values like negative ages."},
    {h: "Missing values",
     p: "pandas marks missing data as <code>NaN</code> (or <code>NaT</code> for dates, <code>pd.NA</code> in some types). Options: drop rows (<code>dropna</code>), fill with a value (<code>fillna</code>), fill with a statistic like the median, or fill within groups. The right choice depends on <b>why</b> the data is missing, so write down your decision.",
     code: R`df["age"] = df["age"].fillna(df["age"].median())
df["city"] = df["city"].fillna("Unknown")
df = df.dropna(subset=["email"])          # rows without email are useless here`},
    {h: "Fixing text and types",
     p: "The <code>.str</code> accessor applies string methods to a whole column: <code>.str.strip()</code>, <code>.str.lower()</code>, <code>.str.replace()</code>, <code>.str.extract(regex)</code>. Convert types with <code>pd.to_numeric(col, errors=\"coerce\")</code> and <code>pd.to_datetime(col, errors=\"coerce\")</code>: anything unparseable becomes NaN instead of crashing.",
     code: R`df["city"] = df["city"].str.strip().str.title()
df["price"] = pd.to_numeric(df["price"].str.replace(r"[$,]", "", regex=True), errors="coerce")`},
    {h: "Duplicates and outliers",
     p: "<code>drop_duplicates(subset=[...])</code> removes repeats, judged on the columns you choose. For outliers, decide if a value is <b>impossible</b> (an age of 250: remove or set to NaN) or just <b>unusual</b> (a very large order: usually keep). Clipping to a plausible range is another option."},
    {h: "Make it repeatable",
     p: "Put every cleaning step in a function or script, never edit the raw file by hand. Keep the raw data unchanged, and print a short report of what each step did. Then anyone can re-run the cleaning and check your decisions."}
  ],
  exercises: [
    {q: "Count missing values per column and the percentage of rows with any missing value.", sol: R`print(df.isna().sum())
print(f"{df.isna().any(axis=1).mean():.1%}")`},
    {q: "Standardise a column of country names like <code>\" kenya\"</code>, <code>\"KENYA\"</code> and <code>\"Kenya \"</code>.", sol: R`df["country"] = df["country"].str.strip().str.title()`},
    {q: "Fill missing salaries with the median salary of the same department.", sol: R`df["salary"] = df["salary"].fillna(df.groupby("department")["salary"].transform("median"))`}
  ],
  project: {
    title: "Clean a messy real-world dataset",
    brief: "Clean a deliberately messy customer sign-up dataset with all the classic problems: inconsistent spellings, mixed date formats, prices stored as text, impossible ages, duplicates and missing values. A pipeline of small functions logs what each step changed, and validation checks run at the end. Needs <code>pip install pandas numpy</code>.",
    file: "day77_cleaning.py",
    code: R`# day77_cleaning.py
# A repeatable cleaning pipeline for a messy dataset.

import io

import numpy as np
import pandas as pd

RAW_CSV = """customer_id,name,email,country,signup_date,age,plan,monthly_fee
1001,Amina Hassan,amina@example.com,Somalia,2026-01-15,24,premium,$12.99
1002, omar ali ,OMAR@EXAMPLE.COM,somalia,15/02/2026,31,Basic,4.99
1003,Sara Noor,sara@example.com,Kenya ,2026-03-01,,basic,4.99
1004,Yusuf Ahmed,,KENYA,2026/03/09,45,Premium,12.99
1005,Hodan Abdi,hodan@example.com,Ethiopia,2026-03-12,250,premium,"$1,299"
1002, omar ali ,OMAR@EXAMPLE.COM,somalia,15/02/2026,31,Basic,4.99
1006,Bilal Warsame,bilal@example,Djibouti,not a date,19,free,0
1007,Faisal Musa,faisal@example.com,somaliland,2026-04-02,-3,basic,4.99
1008,Layla Yusuf,layla@example.com,,2026-04-18,28,PREMIUM,12.99
1009,Khadar Omar,khadar@example.com,Kenya,2026-05-05,38,enterprise,49.00
1010,Nimco Jama,nimco@example.com,Somalia,2026-05-20,22,basic,
"""

COUNTRY_FIX = {"Somaliland": "Somalia"}          # a business decision, documented here
VALID_PLANS = {"free", "basic", "premium", "enterprise"}


def report(step, before, after):
    print(f"{step:<34} rows {len(before):>3} -> {len(after):>3}")
    return after


def clean_text(df):
    df = df.copy()
    df["name"] = df["name"].str.strip().str.title()
    df["email"] = df["email"].str.strip().str.lower()
    df["country"] = df["country"].str.strip().str.title().replace(COUNTRY_FIX)
    df["plan"] = df["plan"].str.strip().str.lower()
    return df


def drop_duplicates(df):
    return df.drop_duplicates(subset=["customer_id"], keep="first")


def fix_dates(df):
    df = df.copy()
    text = df["signup_date"].astype(str).str.replace("/", "-")
    iso = pd.to_datetime(text, format="%Y-%m-%d", errors="coerce")
    dmy = pd.to_datetime(text, format="%d-%m-%Y", errors="coerce")
    df["signup_date"] = iso.fillna(dmy)
    return df


def fix_numbers(df):
    df = df.copy()
    fee_text = df["monthly_fee"].astype(str).str.replace(r"[$,]", "", regex=True)
    df["monthly_fee"] = pd.to_numeric(fee_text, errors="coerce")
    df["age"] = pd.to_numeric(df["age"], errors="coerce")
    df.loc[~df["age"].between(13, 110), "age"] = np.nan          # impossible ages
    return df


def fill_missing(df):
    df = df.copy()
    df["age"] = df["age"].fillna(df["age"].median()).round().astype(int)
    df["country"] = df["country"].fillna("Unknown")
    typical_fee = df.groupby("plan")["monthly_fee"].transform("median")
    df["monthly_fee"] = df["monthly_fee"].fillna(typical_fee)
    # A fee far above the plan's usual price is treated as a typing error.
    too_high = df["monthly_fee"] > typical_fee * 10
    df.loc[too_high, "monthly_fee"] = typical_fee[too_high]
    return df


def flag_bad_rows(df):
    df = df.copy()
    valid_email = df["email"].str.fullmatch(r"[\w.+-]+@[\w-]+\.[\w.]+", na=False)
    df["needs_review"] = ~valid_email | df["signup_date"].isna() | ~df["plan"].isin(VALID_PLANS)
    return df


def validate(df):
    assert df["customer_id"].is_unique
    assert df["age"].between(13, 110).all()
    assert (df["monthly_fee"] >= 0).all()
    assert df["plan"].isin(VALID_PLANS).all()
    assert df["country"].notna().all()
    print("All validation checks passed.")


def main():
    raw = pd.read_csv(io.StringIO(RAW_CSV))
    print("Missing values in the raw data:")
    print(raw.isna().sum()[raw.isna().sum() > 0].to_dict(), "\n")

    df = raw
    for step in (clean_text, drop_duplicates, fix_dates, fix_numbers, fill_missing, flag_bad_rows):
        df = report(step.__name__, df, step(df))

    print()
    print(df.to_string(index=False))
    print(f"\n{df['needs_review'].sum()} row(s) flagged for a human to review:")
    print(df.loc[df["needs_review"], ["customer_id", "email", "signup_date"]].to_string(index=False))
    validate(df)
    df.to_csv("customers_clean.csv", index=False)


if __name__ == "__main__":
    main()`,
    explain: [
      ["df = df.copy() at the start of each step", "Each function returns a new DataFrame and never changes its input, so the raw data stays untouched and steps can be re-run."],
      ["iso.fillna(dmy)", "Dates come in two formats. Parsing each format strictly, then combining, avoids pandas guessing day and month the wrong way round."],
      ["df.loc[~df[\"age\"].between(13, 110), \"age\"] = np.nan", "Impossible ages (250, -3) become missing, and are then filled like other missing ages. <code>~</code> means \"not\"."],
      ["groupby(\"plan\")[\"monthly_fee\"].transform(\"median\")", "<code>transform</code> returns a value for every row (its plan's median), lined up with the original rows, so it can be used to fill gaps."],
      ["df[\"needs_review\"] = ...", "Not everything can be fixed automatically. A bad email or unreadable date is flagged for a person to check, not silently deleted."]
    ],
    stretch: ["Write pytest tests for each cleaning function with tiny DataFrames.", "Find a messy dataset online (search \"dirty data\" practice datasets) and write a pipeline for it."]
  },
  tests: ["The duplicate customer 1002 must appear only once.", "Customer 1005's $1,299 fee should be corrected to the premium price.", "Validation must pass, and the flagged rows should be the ones a human really needs to look at."]
};

L[78] = {
  intro: "A good chart shows in seconds what a table hides. Today you learn Matplotlib, Python's core plotting library, and the main chart types: line, bar, scatter and histogram.",
  lesson: [
    {h: "Figures and axes",
     p: "<code>import matplotlib.pyplot as plt</code>. Use the object-oriented style: <code>fig, ax = plt.subplots()</code> gives a <b>figure</b> (the whole image) and an <b>axes</b> (one plot area). Draw on the axes, label it, then <code>fig.savefig(\"chart.png\")</code> or <code>plt.show()</code>. In Jupyter or VS Code notebook cells, charts appear inline.",
     code: R`import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]
sales = [120, 135, 128, 160]

fig, ax = plt.subplots(figsize=(6, 3.5))
ax.plot(months, sales, marker="o")
ax.set_title("Monthly sales")
ax.set_ylabel("Units")
fig.tight_layout()
fig.savefig("sales.png", dpi=150)`},
    {h: "Choosing a chart",
     p: "<b>Line</b>: change over time. <b>Bar</b>: comparing categories (horizontal bars when labels are long). <b>Scatter</b>: the relationship between two numeric variables. <b>Histogram</b>: the distribution of one variable. <b>Box plot</b>: comparing distributions across groups. Pie charts are hard to read accurately; prefer bars."},
    {h: "Several plots in one figure",
     p: "<code>plt.subplots(2, 2)</code> returns a 2×2 grid of axes. Index them like an array: <code>axes[0, 1]</code>.",
     code: R`fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].bar(months, sales)
axes[1].hist([3, 5, 5, 6, 7, 7, 7, 9], bins=4)`},
    {h: "Make charts honest and readable",
     p: "Always label axes with units and give a title that says what to notice. Start bar charts at zero. Avoid unnecessary decoration. Use colour to highlight what matters, not to decorate. pandas has shortcuts that call Matplotlib for you: <code>df.plot(kind=\"bar\", ax=ax)</code>."}
  ],
  exercises: [
    {q: "Plot <code>y = x²</code> and <code>y = 2x</code> on the same axes for x from -5 to 5, with a legend.", sol: R`import numpy as np
x = np.linspace(-5, 5, 100)
fig, ax = plt.subplots()
ax.plot(x, x ** 2, label="x²")
ax.plot(x, 2 * x, label="2x")
ax.legend()
fig.savefig("functions.png")`},
    {q: "Draw a histogram of 1,000 normally distributed heights with 30 bins.", sol: R`heights = np.random.default_rng(0).normal(170, 8, 1000)
fig, ax = plt.subplots()
ax.hist(heights, bins=30, edgecolor="white")
ax.set_xlabel("Height (cm)")
fig.savefig("heights.png")`},
    {q: "Draw a horizontal bar chart of five countries' populations, sorted.", sol: R`pop = {"Somalia": 18.1, "Kenya": 55.1, "Ethiopia": 126.5, "Egypt": 112.7, "Djibouti": 1.1}
names = sorted(pop, key=pop.get)
fig, ax = plt.subplots()
ax.barh(names, [pop[n] for n in names])
ax.set_xlabel("Population (millions)")
fig.savefig("population.png")`}
  ],
  project: {
    title: "Visualise your expense data",
    brief: "Turn a year of personal expenses into a one-page visual dashboard: monthly spending against budget (line), spending by category (horizontal bar), the distribution of purchase sizes (histogram) and spending by weekday (bar). Use your own Day 33/40 data if you have it; otherwise the script generates a realistic year. Needs <code>pip install pandas matplotlib numpy</code>.",
    file: "day78_expense_charts.py",
    code: R`# day78_expense_charts.py
# A one-page dashboard of a year's expenses with Matplotlib.

import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

MONTHLY_BUDGET = 2000
OUT = Path(__file__).parent / "expenses_dashboard.png"


def sample_expenses(seed=78):
    rng = np.random.default_rng(seed)
    categories = {"food": (35, 14), "transport": (15, 6), "rent": (450, 0), "utilities": (60, 12),
                  "entertainment": (25, 12), "health": (40, 25), "shopping": (55, 35), "education": (30, 15)}
    rows = []
    for day in pd.date_range("2026-01-01", "2026-12-31"):
        if day.day == 1:
            rows.append((day, "rent", 450.0))
        if day.day == 5:
            rows.append((day, "utilities", rng.normal(*categories["utilities"])))
        for cat in ("food", "transport", "entertainment", "health", "shopping", "education"):
            chance = {"food": 0.7, "transport": 0.6}.get(cat, 0.08)
            if day.dayofweek >= 5 and cat == "entertainment":
                chance = 0.4
            if rng.random() < chance:
                mean, sd = categories[cat]
                rows.append((day, cat, max(1.0, rng.normal(mean, sd))))
    return pd.DataFrame(rows, columns=["date", "category", "amount"]).round({"amount": 2})


def load(path=None):
    if path:
        df = pd.read_csv(path)
        df["date"] = pd.to_datetime(df["date"])
        return df[df.get("type", "expense") == "expense"] if "type" in df else df
    return sample_expenses()


def main():
    df = load(sys.argv[1] if len(sys.argv) > 1 else None)
    print(f"{len(df):,} expenses, total {df['amount'].sum():,.2f}")

    monthly = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()
    by_cat = df.groupby("category")["amount"].sum().sort_values()
    weekday = df[df["category"] != "rent"].groupby(df["date"].dt.dayofweek)["amount"].sum()

    fig, axes = plt.subplots(2, 2, figsize=(13, 8))
    fig.suptitle("My spending in 2026", fontsize=16, fontweight="bold")

    # 1. Monthly spending vs budget
    ax = axes[0, 0]
    labels = monthly.index.strftime("%b")
    over = monthly > MONTHLY_BUDGET
    ax.plot(labels, monthly.values, marker="o", color="#2f6db0", label="spent")
    ax.axhline(MONTHLY_BUDGET, color="#b33d5a", linestyle="--", label=f"budget ({MONTHLY_BUDGET})")
    ax.scatter(labels[over], monthly[over], color="#b33d5a", zorder=3, s=60, label="over budget")
    ax.set_title("Monthly spending")
    ax.set_ylabel("Amount")
    ax.set_ylim(0, monthly.max() * 1.15)
    ax.legend(frameon=False)

    # 2. Spending by category
    ax = axes[0, 1]
    bars = ax.barh(by_cat.index.str.title(), by_cat.values, color="#7fa7d6")
    bars[-1].set_color("#2f6db0")                       # highlight the biggest
    ax.bar_label(bars, labels=[f"{v:,.0f}" for v in by_cat.values], padding=3, fontsize=9)
    ax.set_title("Where the money went")
    ax.set_xlabel("Total for the year")
    ax.set_xlim(0, by_cat.max() * 1.2)

    # 3. Distribution of purchase sizes (rent excluded)
    ax = axes[1, 0]
    everyday = df.loc[df["category"] != "rent", "amount"]
    ax.hist(everyday, bins=40, color="#2f8f6b", edgecolor="white")
    ax.axvline(everyday.median(), color="black", linestyle=":", label=f"median {everyday.median():.0f}")
    ax.set_title("How big are everyday purchases?")
    ax.set_xlabel("Amount per purchase")
    ax.set_ylabel("Number of purchases")
    ax.legend(frameon=False)

    # 4. Spending by weekday
    ax = axes[1, 1]
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    colours = ["#c0652c" if d >= 5 else "#e8b48f" for d in weekday.index]
    ax.bar([days[d] for d in weekday.index], weekday.values, color=colours)
    ax.set_title("Weekends cost more (rent excluded)")
    ax.set_ylabel("Total for the year")

    for ax in axes.flat:
        ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    fig.savefig(OUT, dpi=150)
    print(f"Saved {OUT.name}")
    # plt.show()   # uncomment to open a window instead


if __name__ == "__main__":
    main()`,
    explain: [
      ["fig, axes = plt.subplots(2, 2, figsize=(13, 8))", "One figure with a 2×2 grid. <code>axes[0, 1]</code> is the top-right chart."],
      ["ax.axhline(MONTHLY_BUDGET, linestyle=\"--\")", "A reference line makes \"over budget\" obvious at a glance; red dots mark the months that crossed it."],
      ["bars[-1].set_color(...)", "Colour is used for emphasis: only the biggest category is dark, so the eye goes straight to it."],
      ["ax.bar_label(bars, ...)", "Labels each bar with its value, so readers don't need to estimate from the axis."],
      ["ax.spines[[\"top\", \"right\"]].set_visible(False)", "Removing the box's top and right lines is a small change that makes charts look cleaner."]
    ],
    stretch: ["Run it on your own data: <code>python day78_expense_charts.py expenses.csv</code> (columns date, category, amount).", "Plot the step counts from your Day 36 algorithms with log-scaled axes (<code>ax.set_yscale(\"log\")</code>) to see O(n) vs O(n²)."]
  },
  tests: ["Open <code>expenses_dashboard.png</code>: does every chart have a title and labelled axes?", "Change the budget and check the red dots update.", "Show the chart to someone and ask what they notice first. Is it what you intended?"]
};

L[79] = {
  intro: "Exploratory data analysis (EDA) is the process of getting to know a dataset by asking questions and answering them with statistics and charts. Today you learn Seaborn, which makes statistical charts easy, and analyse the classic Titanic dataset.",
  lesson: [
    {h: "The EDA mindset",
     p: "Start with questions, not charts: who survived? Did class matter? Did age? Look at each variable alone (<b>univariate</b>), then pairs (<b>bivariate</b>), then groups. Write down findings as you go, and check surprising results; they're either insights or bugs."},
    {h: "Seaborn",
     p: "<code>pip install seaborn</code>; import as <code>sns</code>. Seaborn works directly with DataFrames: give it the data and column names, and it handles grouping, colours and legends. It draws on Matplotlib axes, so you can still customise with <code>ax.set_title</code> and so on. <code>sns.load_dataset(\"titanic\")</code> downloads practice datasets.",
     code: R`import seaborn as sns
import matplotlib.pyplot as plt

titanic = sns.load_dataset("titanic")
fig, ax = plt.subplots()
sns.barplot(data=titanic, x="class", y="survived", hue="sex", ax=ax)
ax.set_ylabel("Survival rate")`},
    {h: "Useful chart types",
     p: "<code>histplot</code> and <code>kdeplot</code> (distributions), <code>boxplot</code> and <code>violinplot</code> (distributions by group), <code>countplot</code> (counts of categories), <code>barplot</code> (mean with confidence interval), <code>scatterplot</code>, <code>heatmap</code> (for correlation matrices) and <code>pairplot</code> (every numeric pair at once)."},
    {h: "Correlation is not causation",
     p: "Two variables moving together doesn't prove one causes the other. On the Titanic, fare and survival are correlated, but fare mostly reflects class, which reflects where cabins were. Always look for a third variable that might explain a pattern. This habit is essential before building any ML model."}
  ],
  exercises: [
    {q: "Load the Titanic dataset and print its shape, columns and missing values.", sol: R`titanic = sns.load_dataset("titanic")
print(titanic.shape)
print(titanic.isna().sum())`},
    {q: "What was the overall survival rate, and the rate for each passenger class?", sol: R`print(titanic["survived"].mean())
print(titanic.groupby("class", observed=True)["survived"].mean())`},
    {q: "Draw a histogram of ages split by survival.", sol: R`fig, ax = plt.subplots()
sns.histplot(data=titanic, x="age", hue="survived", multiple="stack", bins=30, ax=ax)
fig.savefig("ages.png")`}
  ],
  project: {
    title: "Titanic passenger analysis",
    brief: "Investigate who survived the Titanic disaster. Clean the data, answer five specific questions with numbers and Seaborn charts, and print a written summary of findings. This dataset returns on Day 86, when you'll train a model to predict survival. Needs <code>pip install seaborn pandas matplotlib</code> and an internet connection the first time (to download the data).",
    file: "day79_titanic_eda.py",
    code: R`# day79_titanic_eda.py
# Exploratory analysis of the Titanic dataset with seaborn.

# %% Load and inspect
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

OUT = Path(__file__).parent / "titanic_charts"
OUT.mkdir(exist_ok=True)
sns.set_theme(style="whitegrid")

titanic = sns.load_dataset("titanic")
print(titanic.shape)
print(titanic.isna().sum()[lambda s: s > 0])

# %% Light cleaning for analysis
df = titanic.copy()
df["age_group"] = pd.cut(df["age"], bins=[0, 12, 18, 35, 60, 100],
                         labels=["child", "teen", "young adult", "adult", "senior"])
df["family_size"] = df["sibsp"] + df["parch"] + 1
df["fare_band"] = pd.qcut(df["fare"], 4, labels=["cheapest", "low", "high", "highest"])
findings = []

# %% Q1: How many survived?
rate = df["survived"].mean()
findings.append(f"Overall, {rate:.0%} of {len(df)} passengers survived.")

# %% Q2: Did sex and class matter?
table = df.pivot_table(index="class", columns="sex", values="survived", aggfunc="mean", observed=True)
print(table.round(2))
fig, ax = plt.subplots(figsize=(7, 4))
sns.barplot(data=df, x="class", y="survived", hue="sex", ax=ax, errorbar=None)
ax.set(title="Survival rate by class and sex", ylabel="Survival rate", xlabel="")
fig.savefig(OUT / "class_sex.png", dpi=120, bbox_inches="tight")
findings.append(f"Women in first class survived at {table.loc['First', 'female']:.0%}; "
                f"men in third class at {table.loc['Third', 'male']:.0%}.")

# %% Q3: Were children saved first?
by_age = df.groupby("age_group", observed=True)["survived"].agg(["mean", "count"])
print(by_age.round(2))
fig, ax = plt.subplots(figsize=(7, 4))
sns.histplot(data=df, x="age", hue="survived", multiple="stack", bins=30, ax=ax)
ax.set(title="Age distribution by survival", xlabel="Age")
fig.savefig(OUT / "age.png", dpi=120, bbox_inches="tight")
findings.append(f"Children under 12 survived at {by_age.loc['child', 'mean']:.0%}, "
                f"versus {rate:.0%} overall. Age is missing for {df['age'].isna().mean():.0%} of passengers.")

# %% Q4: Did family size matter?
fam = df.groupby("family_size")["survived"].agg(["mean", "count"])
print(fam.round(2))
fig, ax = plt.subplots(figsize=(7, 4))
sns.pointplot(data=df, x="family_size", y="survived", ax=ax, errorbar=None)
ax.set(title="Survival by family size", ylabel="Survival rate", xlabel="People in family group")
fig.savefig(OUT / "family.png", dpi=120, bbox_inches="tight")
best_size = fam[fam["count"] >= 20]["mean"].idxmax()
findings.append(f"Small families did best: groups of {best_size} survived at {fam.loc[best_size, 'mean']:.0%}; "
                "people alone and very large families did worse.")

# %% Q5: Is fare just a stand-in for class?
print(df.groupby(["class", "fare_band"], observed=True)["survived"].mean().unstack().round(2))
fig, ax = plt.subplots(figsize=(7, 4))
sns.boxplot(data=df, x="class", y="fare", hue="survived", ax=ax)
ax.set(yscale="log", title="Fare by class and survival (log scale)", ylabel="Fare", xlabel="")
fig.savefig(OUT / "fare.png", dpi=120, bbox_inches="tight")
findings.append("Fare and class overlap heavily; within a class, fare adds less information. "
                "Correlation with survival doesn't mean the ticket price caused it.")

# %% Correlation heatmap of numeric columns
numeric = df[["survived", "pclass", "age", "sibsp", "parch", "fare", "family_size"]]
fig, ax = plt.subplots(figsize=(6, 5))
sns.heatmap(numeric.corr(), annot=True, fmt=".2f", cmap="vlag", center=0, ax=ax)
ax.set_title("Correlations")
fig.savefig(OUT / "correlations.png", dpi=120, bbox_inches="tight")

# %% Summary
print("\nFINDINGS")
for i, line in enumerate(findings, start=1):
    print(f"{i}. {line}")
print(f"\nCharts saved in {OUT.name}/")`,
    explain: [
      ["pd.cut(df[\"age\"], bins=[...], labels=[...])", "Turns a number into ranges you choose (age groups). Missing ages stay missing."],
      ["pd.qcut(df[\"fare\"], 4, ...)", "Splits into four groups of equal size (quartiles), whatever the values are."],
      ["df.pivot_table(index=\"class\", columns=\"sex\", values=\"survived\", aggfunc=\"mean\")", "The mean of a 0/1 column is a rate, so this table shows survival rates for every class and sex combination."],
      ["fam[fam[\"count\"] >= 20][\"mean\"].idxmax()", "Ignores tiny groups when choosing the \"best\" family size, so one lucky family of 7 doesn't win by chance."],
      ["findings.append(...)", "EDA should end in sentences someone can act on, not just charts. Each finding quotes its numbers."]
    ],
    stretch: ["Add a question of your own, such as: did the port of embarkation matter, and why might it?", "Try <code>sns.pairplot(numeric, hue=\"survived\")</code> and describe what you see."]
  },
  tests: ["Open each chart in <code>titanic_charts/</code> and check it matches the printed numbers.", "Overall survival should be about 38%.", "Explain in one sentence why fare alone is a misleading predictor."]
};

L[80] = {
  intro: "Level 4 capstone. You'll carry out a complete data analysis on the Palmer Penguins dataset: load, clean, analyse, visualise and write a report, the same workflow you'll use before every ML project in Level 5. Give it two days.",
  lesson: [
    {h: "The workflow",
     p: "1) <b>Question</b>: what do you want to know? 2) <b>Load</b> and inspect. 3) <b>Clean</b>, documenting every decision. 4) <b>Explore</b> each variable, then relationships. 5) <b>Answer</b> the questions with numbers and charts. 6) <b>Report</b>: write findings someone else can read without running your code."},
    {h: "The dataset",
     p: "Palmer Penguins has measurements of 344 penguins of three species (Adélie, Chinstrap, Gentoo) from three islands in Antarctica: bill length and depth, flipper length, body mass and sex. It's a modern replacement for the famous Iris dataset and returns in Level 5 for classification and clustering. Load it with <code>sns.load_dataset(\"penguins\")</code>."},
    {h: "Your questions",
     p: "How do the three species differ in size? Are males bigger than females in every species? Which measurements best separate the species? Is bill length related to bill depth, and does the answer change when you look within each species? (It does: this is <b>Simpson's paradox</b>, a famous trap.)"},
    {h: "The report",
     p: "The script writes a Markdown report (<code>penguin_report.md</code>) with the findings, a data-quality section, and links to the charts. Markdown renders nicely on GitHub, so this becomes a portfolio piece. VS Code shows a preview with Ctrl+Shift+V."}
  ],
  exercises: [
    {q: "Before reading the code, write your own list of the cleaning decisions this dataset needs. Look at <code>df.isna().sum()</code> first.", sol: R`# - 2 rows have no measurements at all: drop them.
# - About 11 rows have no sex: keep them for species comparisons,
#   leave them out of male/female comparisons.
# - Check for impossible values with describe().`},
    {q: "Compute the correlation between bill length and bill depth for all penguins, then for each species separately. What do you notice?", sol: R`print(df["bill_length_mm"].corr(df["bill_depth_mm"]))          # negative overall
print(df.groupby("species")[["bill_length_mm", "bill_depth_mm"]]
        .corr().xs("bill_depth_mm", level=1)["bill_length_mm"])   # positive in each species`}
  ],
  project: {
    title: "Data analysis report in a notebook",
    brief: "Write a complete analysis of the penguins dataset as notebook cells, ending with an automatically generated Markdown report and a folder of charts. Run it cell by cell in VS Code, then read the report. Needs <code>pip install seaborn pandas matplotlib</code> and an internet connection the first time.",
    file: "day80_penguins_report.py",
    code: R`# day80_penguins_report.py
# Level 4 capstone: a complete analysis of the Palmer Penguins data.

# %% Setup
from datetime import date
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

HERE = Path(__file__).parent
CHARTS = HERE / "penguin_charts"
CHARTS.mkdir(exist_ok=True)
sns.set_theme(style="whitegrid", palette="Set2")
MEASURES = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
report = [f"# Palmer Penguins: an exploratory analysis\n\n_Generated {date.today():%d %B %Y}_\n"]


def save(fig, name):
    fig.savefig(CHARTS / name, dpi=120, bbox_inches="tight")
    plt.close(fig)
    return f"![{name}]({CHARTS.name}/{name})"


# %% 1. Load and inspect
raw = sns.load_dataset("penguins")
print(raw.shape)
print(raw.head())
print(raw.isna().sum())

# %% 2. Clean, recording every decision
quality = []
df = raw.dropna(subset=MEASURES).copy()
quality.append(f"Dropped {len(raw) - len(df)} rows with no body measurements.")
missing_sex = df["sex"].isna().sum()
quality.append(f"Kept {missing_sex} rows with unknown sex; they are excluded only from male/female comparisons.")
df["sex"] = df["sex"].str.title()
df["body_mass_kg"] = df["body_mass_g"] / 1000
assert df[MEASURES].gt(0).all().all(), "all measurements should be positive"
quality.append(f"Final dataset: {len(df)} penguins, {df['species'].nunique()} species, "
               f"{df['island'].nunique()} islands.")

report.append("## Data quality\n" + "\n".join(f"- {q}" for q in quality) + "\n")

# %% 3. Who lives where?
where = pd.crosstab(df["species"], df["island"])
print(where)
report.append("## Where each species lives\n" + where.to_markdown() + "\n")
report.append("Gentoo live only on Biscoe and Chinstrap only on Dream; Adélie are found on all three islands.\n")

# %% 4. How do the species differ in size?
summary = df.groupby("species")[MEASURES].mean().round(1)
print(summary)
fig, axes = plt.subplots(1, 4, figsize=(16, 4))
for ax, col in zip(axes, MEASURES):
    sns.boxplot(data=df, x="species", y=col, hue="species", ax=ax, legend=False)
    ax.set(title=col.replace("_", " "), xlabel="", ylabel="")
chart = save(fig, "species_measures.png")
heaviest = summary["body_mass_g"].idxmax()
report.append("## Size by species\n" + summary.to_markdown() + "\n\n" + chart + "\n")
report.append(f"{heaviest} penguins are the heaviest, averaging "
              f"{summary.loc[heaviest, 'body_mass_g'] / 1000:.1f} kg, with the longest flippers. "
              "Chinstrap and Adélie are similar in mass, but Chinstrap bills are much longer.\n")

# %% 5. Are males bigger in every species?
known = df.dropna(subset=["sex"])
by_sex = known.pivot_table(index="species", columns="sex", values="body_mass_g", aggfunc="mean")
by_sex["difference_%"] = ((by_sex["Male"] / by_sex["Female"] - 1) * 100).round(1)
print(by_sex.round(0))
fig, ax = plt.subplots(figsize=(7, 4))
sns.violinplot(data=known, x="species", y="body_mass_g", hue="sex", split=True, inner="quart", ax=ax)
ax.set(title="Body mass by species and sex", ylabel="Body mass (g)", xlabel="")
chart = save(fig, "mass_by_sex.png")
report.append("## Males versus females\n" + by_sex.round(0).to_markdown() + "\n\n" + chart + "\n")
report.append(f"Males are heavier in every species, by {by_sex['difference_%'].min():.0f}% to "
              f"{by_sex['difference_%'].max():.0f}%.\n")

# %% 6. Which measurements separate the species?
fig = sns.pairplot(df, vars=MEASURES, hue="species", corner=True, plot_kws={"s": 15}).figure
chart = save(fig, "pairplot.png")
report.append("## Which measurements separate the species?\n" + chart + "\n")
report.append("Flipper length and body mass separate Gentoo from the rest; bill length separates "
              "Adélie from Chinstrap. Using bill length together with flipper length separates all "
              "three species well, which is a promising sign for the classifier in Level 5.\n")

# %% 7. Simpson's paradox: bill length vs bill depth
overall = df["bill_length_mm"].corr(df["bill_depth_mm"])
within = {s: g["bill_length_mm"].corr(g["bill_depth_mm"]) for s, g in df.groupby("species")}
print(f"overall r = {overall:.2f}", {k: round(float(v), 2) for k, v in within.items()})
fig, ax = plt.subplots(figsize=(7, 5))
sns.regplot(data=df, x="bill_length_mm", y="bill_depth_mm", scatter=False, color="black",
            line_kws={"linestyle": "--"}, ax=ax, label=f"all penguins (r = {overall:.2f})")
for species, group in df.groupby("species"):
    sns.regplot(data=group, x="bill_length_mm", y="bill_depth_mm", ax=ax, scatter_kws={"s": 12},
                label=f"{species} (r = {within[species]:.2f})")
ax.legend()
ax.set(title="Bill length vs depth: the trend reverses inside each species",
       xlabel="Bill length (mm)", ylabel="Bill depth (mm)")
chart = save(fig, "simpsons_paradox.png")
report.append("## A trap: Simpson's paradox\n" + chart + "\n")
report.append(f"Across all penguins, longer bills go with shallower bills (r = {overall:.2f}). "
              "But within each species the relationship is positive. The overall trend is created by "
              "mixing species with different shapes. Always check relationships within groups "
              "before drawing conclusions or building a model.\n")

# %% 8. Write the report
report.append("## Summary\n"
              "1. The three species differ clearly in size and bill shape.\n"
              "2. Males are heavier than females in every species.\n"
              "3. A few measurements are enough to tell species apart, so a classifier should work well.\n"
              "4. Grouping matters: a trend in the whole dataset can reverse inside groups.\n")
path = HERE / "penguin_report.md"
path.write_text("\n".join(report), encoding="utf-8")
print(f"Report written to {path.name}, charts in {CHARTS.name}/")`,
    explain: [
      ["quality.append(...)", "Every cleaning decision is recorded and goes into the report, so a reader knows exactly what was removed and why."],
      ["pd.crosstab(df[\"species\"], df[\"island\"])", "Counts every combination of two categories. It reveals that species and island are tangled together."],
      ["summary.to_markdown()", "Turns a DataFrame into a Markdown table for the report. It needs the <code>tabulate</code> package: <code>pip install tabulate</code>."],
      ["sns.pairplot(..., hue=\"species\", corner=True)", "Scatter plots of every pair of measurements, coloured by species: the quickest way to see which features separate groups."],
      ["within = {s: g[...].corr(...) for s, g in df.groupby(\"species\")}", "Correlation computed separately inside each species. The sign flips compared with the overall correlation."]
    ],
    stretch: ["Turn the script into a real notebook (.ipynb) and add your own Markdown commentary between cells.", "Publish <code>penguin_report.md</code> and the charts folder to your GitHub repository as a portfolio piece.", "Repeat the workflow on a dataset you care about."]
  },
  tests: ["Run every cell in order without errors.", "Open <code>penguin_report.md</code> in VS Code's preview: are all charts visible?", "Check one number in the report against your own quick calculation.", "Ask yourself whether someone who never saw the code could understand the report."]
};

})(window.LESSONS);
