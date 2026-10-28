// Level 3 lessons: Days 41-60. Code fields use String.raw so backslashes stay literal.
window.LESSONS = window.LESSONS || {};
(function (L) {
const R = String.raw;

L[41] = {
  intro: "Object-oriented programming (OOP) bundles data and the functions that work on it into one unit. You've been using objects since Day 2; today you create your own.",
  lesson: [
    {h: "You already use objects",
     p: "Every value in Python is an <b>object</b>. A string like <code>\"hi\"</code> holds data (its characters) and has <b>methods</b> (<code>upper</code>, <code>split</code>). A list holds items and has <code>append</code>. A <b>class</b> is the blueprint; an object made from it is an <b>instance</b>. <code>type(\"hi\")</code> prints <code>&lt;class 'str'&gt;</code>."},
    {h: "Defining a class",
     p: "<code>class</code> defines a blueprint. Class names use <b>CapWords</b>. Calling the class like a function, <code>Dog()</code>, creates a new instance. You can attach data to an instance with a dot.",
     code: R`class Dog:
    pass            # an empty class body

rex = Dog()
rex.name = "Rex"
print(rex.name)
print(type(rex))`,
     out: "Rex\n<class '__main__.Dog'>"},
    {h: "Methods and self",
     p: "A function defined inside a class is a <b>method</b>. Its first parameter, always called <code>self</code>, is the instance the method was called on. When you write <code>rex.bark()</code>, Python calls <code>Dog.bark(rex)</code> behind the scenes, so <code>self</code> is <code>rex</code>.",
     code: R`class Dog:
    def bark(self):
        print(f"{self.name} says woof!")

rex = Dog()
rex.name = "Rex"
rex.bark()`,
     out: "Rex says woof!"},
    {h: "Each instance has its own data",
     p: "Two instances of the same class are separate objects with separate attributes. Changing one doesn't affect the other. This is the main advantage over the dicts you used in Level 2: the data <i>and</i> the behaviour travel together."},
    {h: "Why OOP?",
     p: "Classes model things in your problem: a bank account, a player, a dataset. In ML you'll use them constantly: a scikit-learn model is an object you <code>fit()</code> and <code>predict()</code> with, and a PyTorch network is a class you write yourself."}
  ],
  exercises: [
    {q: "Make a class <code>Car</code> with a method <code>honk</code> that prints <code>\"Beep!\"</code>. Create two cars and honk both.", sol: R`class Car:
    def honk(self):
        print("Beep!")

a = Car()
b = Car()
a.honk()
b.honk()`},
    {q: "Give each car a <code>colour</code> attribute and a method <code>describe</code> that prints it.", sol: R`class Car:
    def describe(self):
        print(f"A {self.colour} car")

c = Car()
c.colour = "red"
c.describe()`},
    {q: "What happens if you call <code>describe</code> on a car that never had <code>colour</code> set? Why is that a problem? (Tomorrow fixes it.)", sol: R`# AttributeError: 'Car' object has no attribute 'colour'
# Nothing guarantees every Car gets a colour. A constructor (__init__) will.`}
  ],
  project: {
    title: "Pet simulator",
    brief: "Create a virtual pet that gets hungry and bored over time. You can feed it, play with it and let it sleep. Its state is stored on the object and changed by its methods. (Today uses a small <code>__init__</code> method to set up each pet; tomorrow explains it fully.)",
    file: "day41_pet.py",
    code: R`# day41_pet.py
# A virtual pet whose state lives inside an object.

import random


class Pet:
    def __init__(self, name):
        self.name = name
        self.hunger = 3      # 0 = full, 10 = starving
        self.boredom = 3     # 0 = happy, 10 = very bored
        self.energy = 7      # 0 = exhausted, 10 = full of energy

    def mood(self):
        worst = max(self.hunger, self.boredom, 10 - self.energy)
        if worst <= 3:
            return "happy"
        if worst <= 6:
            return "okay"
        if worst <= 8:
            return "grumpy"
        return "miserable"

    def status(self):
        print(f"{self.name} is {self.mood()}. "
              f"Hunger {self.hunger}/10, boredom {self.boredom}/10, energy {self.energy}/10")

    def pass_time(self):
        self.hunger = min(10, self.hunger + 1)
        self.boredom = min(10, self.boredom + 1)
        self.energy = max(0, self.energy - 1)

    def feed(self):
        self.hunger = max(0, self.hunger - 4)
        print(f"{self.name} munches happily.")

    def play(self):
        if self.energy < 2:
            print(f"{self.name} is too tired to play.")
            return
        self.boredom = max(0, self.boredom - 5)
        self.energy -= 2
        print(f"You play {random.choice(['fetch', 'tag', 'hide and seek'])} with {self.name}.")

    def sleep(self):
        self.energy = 10
        print(f"{self.name} curls up and sleeps. Zzz...")


def main():
    pet = Pet(input("Name your pet: ").strip() or "Pixel")
    actions = {"f": pet.feed, "p": pet.play, "s": pet.sleep}

    while True:
        print()
        pet.status()
        choice = input("f)eed  p)lay  s)leep  w)ait  q)uit: ").strip().lower()
        if choice == "q":
            print(f"Goodbye from {pet.name}!")
            break
        if choice in actions:
            actions[choice]()
        pet.pass_time()


if __name__ == "__main__":
    main()`,
    explain: [
      ["def __init__(self, name):", "A special method Python calls automatically when you create a pet with <code>Pet(\"Pixel\")</code>. It sets the starting attributes. Tomorrow's lesson covers it."],
      ["self.hunger = min(10, self.hunger + 1)", "Methods change the object's own attributes through <code>self</code>. <code>min</code> keeps the value at 10 or below."],
      ["self.mood()", "One method can call another on the same object, again through <code>self</code>."],
      ["actions = {\"f\": pet.feed, ...}", "<code>pet.feed</code> without parentheses is a <b>bound method</b>: a function already tied to this pet. Calling <code>actions[\"f\"]()</code> feeds this particular pet."],
      ["if self.energy < 2: ... return", "Objects can enforce their own rules: the pet refuses to play when exhausted."]
    ],
    stretch: ["Create two pets and let the player switch between them.", "Add an age attribute that grows each turn, and let the pet grow from baby to adult."]
  },
  tests: ["Wait several turns without doing anything and watch the mood fall.", "Play until the pet is too tired.", "Feed it when it's already full: the hunger shouldn't go below 0."]
};

L[42] = {
  intro: "Today you learn the constructor, <code>__init__</code>, properly, along with the difference between instance and class attributes.",
  lesson: [
    {h: "The constructor",
     p: "<code>__init__</code> runs automatically every time an instance is created. Its job is to give the new object every attribute it needs, so no instance is ever half set up. Arguments you pass to the class go to <code>__init__</code> after <code>self</code>.",
     code: R`class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages
        self.is_borrowed = False     # a default not passed in

b = Book("Dune", "Frank Herbert", 412)
print(b.title, b.is_borrowed)`,
     out: "Dune False"},
    {h: "Methods that change and methods that report",
     p: "Some methods change state (<code>borrow</code>), others answer questions (<code>is_long</code>). Methods can take extra arguments and return values just like functions.",
     code: R`class Book:
    # ... __init__ as above ...
    def borrow(self):
        if self.is_borrowed:
            return False
        self.is_borrowed = True
        return True

    def is_long(self, limit=400):
        return self.pages > limit`},
    {h: "Class attributes",
     p: "A variable defined in the class body, outside any method, is a <b>class attribute</b>: shared by every instance. Use it for constants and shared counters. Instance attributes (set on <code>self</code>) belong to one object.",
     code: R`class Book:
    loan_days = 14          # shared by all books
    count = 0

    def __init__(self, title):
        self.title = title
        Book.count += 1     # update the shared counter

Book("A")
Book("B")
print(Book.count, Book.loan_days)`,
     out: "2 14"},
    {h: "Class methods and static methods",
     p: "<code>@classmethod</code> receives the class (<code>cls</code>) instead of an instance. It's commonly used as an alternative constructor, for example <code>Book.from_dict(data)</code>. <code>@staticmethod</code> receives neither; it's just a function that belongs with the class.",
     code: R`class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    @classmethod
    def from_dict(cls, data):
        return cls(data["title"], data["author"])

b = Book.from_dict({"title": "Emma", "author": "Jane Austen"})`}
  ],
  exercises: [
    {q: "Write a class <code>Rectangle</code> with width and height, and methods <code>area()</code> and <code>perimeter()</code>.", sol: R`class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

print(Rectangle(3, 4).area())`},
    {q: "Add a class attribute that counts how many rectangles have been created.", sol: R`class Rectangle:
    created = 0

    def __init__(self, width, height):
        self.width = width
        self.height = height
        Rectangle.created += 1`},
    {q: "Add a classmethod <code>square(size)</code> that returns a rectangle with equal sides.", sol: R`    @classmethod
    def square(cls, size):
        return cls(size, size)

sq = Rectangle.square(5)`}
  ],
  project: {
    title: "Library book tracker",
    brief: "Model books with a <code>Book</code> class: borrowing, returning, due dates, and late fees. A small menu lets a librarian check books in and out. Books are saved to and loaded from JSON using <code>to_dict</code> and a <code>from_dict</code> classmethod.",
    file: "day42_library_books.py",
    code: R`# day42_library_books.py
# Tracks library books with a Book class.

import json
from datetime import date, timedelta
from pathlib import Path

DATA_FILE = Path(__file__).parent / "books.json"


class Book:
    loan_days = 14
    fee_per_day = 0.25

    def __init__(self, title, author, borrower=None, due=None):
        self.title = title
        self.author = author
        self.borrower = borrower
        self.due = due            # a date, or None when on the shelf

    def is_available(self):
        return self.borrower is None

    def borrow(self, person, today=None):
        if not self.is_available():
            return False
        today = today or date.today()
        self.borrower = person
        self.due = today + timedelta(days=Book.loan_days)
        return True

    def return_book(self, today=None):
        """Mark the book returned and return the late fee owed."""
        today = today or date.today()
        fee = self.late_fee(today)
        self.borrower = None
        self.due = None
        return fee

    def late_fee(self, today=None):
        today = today or date.today()
        if self.due is None or today <= self.due:
            return 0.0
        return (today - self.due).days * Book.fee_per_day

    def describe(self):
        if self.is_available():
            return f"{self.title} by {self.author} (on the shelf)"
        return f"{self.title} by {self.author} (with {self.borrower}, due {self.due})"

    def to_dict(self):
        return {"title": self.title, "author": self.author, "borrower": self.borrower,
                "due": self.due.isoformat() if self.due else None}

    @classmethod
    def from_dict(cls, data):
        due = date.fromisoformat(data["due"]) if data["due"] else None
        return cls(data["title"], data["author"], data["borrower"], due)


def load():
    if not DATA_FILE.exists():
        return [Book("Dune", "Frank Herbert"), Book("Emma", "Jane Austen"),
                Book("Python Crash Course", "Eric Matthes")]
    with open(DATA_FILE, encoding="utf-8") as f:
        return [Book.from_dict(d) for d in json.load(f)]


def save(books):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump([b.to_dict() for b in books], f, indent=2)


def choose(books):
    for i, b in enumerate(books, start=1):
        print(f"{i}. {b.describe()}")
    try:
        return books[int(input("Book number: ")) - 1]
    except (ValueError, IndexError):
        print("No such book.")
        return None


def main():
    books = load()
    while True:
        print("\n1) List  2) Borrow  3) Return  4) Add book  5) Quit")
        choice = input("Choose: ")
        if choice == "1":
            for b in books:
                print(" -", b.describe())
        elif choice == "2":
            book = choose(books)
            if book and book.borrow(input("Borrower's name: ")):
                print(f"Due back on {book.due}.")
            elif book:
                print("That book is already out.")
        elif choice == "3":
            book = choose(books)
            if book and not book.is_available():
                fee = book.return_book()
                print(f"Returned. Late fee: {fee:.2f}" if fee else "Returned on time.")
        elif choice == "4":
            books.append(Book(input("Title: "), input("Author: ")))
        elif choice == "5":
            break
        save(books)


if __name__ == "__main__":
    main()`,
    explain: [
      ["loan_days = 14 / fee_per_day = 0.25", "Class attributes: library-wide rules shared by every book."],
      ["def borrow(self, person, today=None):", "Passing <code>today</code> is optional. In normal use it defaults to the real date, but a test can pass a fixed date. You'll use this on Day 52."],
      ["return False / return True", "The method reports whether it succeeded, and the menu decides what to say. The class never prints."],
      ["def to_dict(self) / @classmethod from_dict", "A matching pair: objects become plain dicts for JSON, and dicts become objects again. Dates are stored as ISO strings because JSON has no date type."],
      ["[Book.from_dict(d) for d in json.load(f)]", "A comprehension that rebuilds every Book object from the saved file."]
    ],
    stretch: ["Add a <code>times_borrowed</code> counter to each book and list the most popular.", "Add a method that lists all overdue books for a given date."]
  },
  tests: ["Borrow a book, then try borrowing it again.", "In the interpreter: create a book, borrow it with <code>today=date(2026, 1, 1)</code>, return it with <code>today=date(2026, 1, 20)</code>. The fee should be 5 × 0.25 = 1.25.", "Quit and restart: borrowed books stay borrowed."]
};

L[43] = {
  intro: "Special methods, the ones with double underscores (\"dunder\" methods), let your objects work with Python's built-in syntax: <code>print</code>, <code>==</code>, <code>+</code>, <code>len</code> and more.",
  lesson: [
    {h: "__str__ and __repr__",
     p: "<code>__str__</code> returns the friendly text used by <code>print()</code> and <code>str()</code>. <code>__repr__</code> returns an unambiguous, developer-facing version used in the interpreter and inside lists; ideally it looks like the code that would recreate the object.",
     code: R`class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

    def __str__(self):
        return f"({self.x}, {self.y})"

p = Point(2, 3)
print(p)          # uses __str__
print([p])        # lists use __repr__`,
     out: "(2, 3)\n[Point(2, 3)]"},
    {h: "Equality",
     p: "By default <code>==</code> on two objects checks if they are the <i>same object</i>. Define <code>__eq__</code> to compare their values instead. Return <code>NotImplemented</code> for types you don't know how to compare.",
     code: R`    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y`},
    {h: "Arithmetic operators",
     p: "<code>__add__</code> runs for <code>+</code>, <code>__sub__</code> for <code>-</code>, <code>__mul__</code> for <code>*</code>, <code>__truediv__</code> for <code>/</code>. They should return a <b>new</b> object rather than change the existing one. <code>__lt__</code> (less than) makes <code>&lt;</code> and <code>sorted()</code> work.",
     code: R`    def __add__(self, other):
        return Point(self.x + other.x, self.y + other.y)

print(Point(1, 2) + Point(3, 4))`,
     out: "(4, 6)"},
    {h: "Other useful ones",
     p: "<code>__len__</code> for <code>len()</code>, <code>__getitem__</code> for <code>obj[i]</code>, <code>__contains__</code> for <code>in</code>, <code>__bool__</code> for truthiness, <code>__abs__</code> for <code>abs()</code>, <code>__hash__</code> so objects can go in sets and be dict keys. This is how NumPy arrays make <code>a + b</code> add whole arrays: their class defines <code>__add__</code>."}
  ],
  exercises: [
    {q: "Add a <code>__repr__</code> to the Rectangle class from Day 42.", sol: R`    def __repr__(self):
        return f"Rectangle({self.width}, {self.height})"`},
    {q: "Make rectangles comparable by area with <code>__lt__</code>, then sort a list of them.", sol: R`    def __lt__(self, other):
        return self.area() < other.area()

print(sorted([Rectangle(5, 5), Rectangle(1, 2), Rectangle(3, 3)]))`},
    {q: "Write a <code>Money</code> class holding an amount and currency, where <code>+</code> raises ValueError for different currencies.", sol: R`class Money:
    def __init__(self, amount, currency):
        self.amount, self.currency = amount, currency

    def __add__(self, other):
        if self.currency != other.currency:
            raise ValueError("Can't add different currencies")
        return Money(self.amount + other.amount, self.currency)

    def __repr__(self):
        return f"Money({self.amount}, '{self.currency}')"`}
  ],
  project: {
    title: "Fraction and vector classes",
    brief: "Build two number-like classes. <code>Fraction</code> stores exact fractions in lowest terms and supports + - * /, comparison and printing. <code>Vector</code> supports addition, scaling, dot product, length and indexing: the same operations NumPy performs on arrays, which you'll meet on Day 73.",
    file: "day43_numbers.py",
    code: R`# day43_numbers.py
# Fraction and Vector classes built with special methods.

import math


class Fraction:
    def __init__(self, numerator, denominator=1):
        if denominator == 0:
            raise ZeroDivisionError("Denominator can't be zero")
        if denominator < 0:                      # keep the sign on top
            numerator, denominator = -numerator, -denominator
        common = math.gcd(numerator, denominator)
        self.num = numerator // common
        self.den = denominator // common

    def __repr__(self):
        return f"Fraction({self.num}, {self.den})"

    def __str__(self):
        return str(self.num) if self.den == 1 else f"{self.num}/{self.den}"

    def __add__(self, other):
        return Fraction(self.num * other.den + other.num * self.den, self.den * other.den)

    def __sub__(self, other):
        return Fraction(self.num * other.den - other.num * self.den, self.den * other.den)

    def __mul__(self, other):
        return Fraction(self.num * other.num, self.den * other.den)

    def __truediv__(self, other):
        return Fraction(self.num * other.den, self.den * other.num)

    def __eq__(self, other):
        if not isinstance(other, Fraction):
            return NotImplemented
        return self.num == other.num and self.den == other.den

    def __lt__(self, other):
        return self.num * other.den < other.num * self.den

    def __float__(self):
        return self.num / self.den


class Vector:
    def __init__(self, *components):
        self.components = list(components)

    def __repr__(self):
        return f"Vector{tuple(self.components)}"

    def __len__(self):
        return len(self.components)

    def __getitem__(self, index):
        return self.components[index]

    def _check(self, other):
        if len(self) != len(other):
            raise ValueError("Vectors must be the same length")

    def __add__(self, other):
        self._check(other)
        return Vector(*[a + b for a, b in zip(self, other)])

    def __sub__(self, other):
        self._check(other)
        return Vector(*[a - b for a, b in zip(self, other)])

    def __mul__(self, scalar):
        return Vector(*[a * scalar for a in self])

    __rmul__ = __mul__          # so 3 * v works as well as v * 3

    def dot(self, other):
        self._check(other)
        return sum(a * b for a, b in zip(self, other))

    def __abs__(self):
        return math.sqrt(self.dot(self))

    def __eq__(self, other):
        return isinstance(other, Vector) and self.components == other.components


def main():
    half, third = Fraction(1, 2), Fraction(1, 3)
    print(f"{half} + {third} = {half + third}")
    print(f"{half} - {third} = {half - third}")
    print(f"{half} * {third} = {half * third}")
    print(f"{half} / {third} = {half / third}")
    print("Sorted:", sorted([Fraction(3, 4), half, Fraction(2, 3), third]))
    print("6/8 == 3/4:", Fraction(6, 8) == Fraction(3, 4))
    print("As a float:", float(Fraction(7, 8)))

    v, w = Vector(3, 4), Vector(1, -2)
    print()
    print("v + w =", v + w)
    print("3 * v =", 3 * v)
    print("v · w =", v.dot(w))
    print("|v|   =", abs(v))
    print("v[0]  =", v[0], " len(v) =", len(v))


if __name__ == "__main__":
    main()`,
    explain: [
      ["math.gcd(numerator, denominator)", "The greatest common divisor. Dividing both parts by it stores every fraction in lowest terms, so 6/8 becomes 3/4 and equality just compares the parts."],
      ["return Fraction(...)", "Every operator returns a brand-new object. The originals never change, just like ints."],
      ["for a, b in zip(self, other)", "Because Vector defines <code>__len__</code> and <code>__getitem__</code>, Python can loop over it, so <code>zip</code> works on vectors directly."],
      ["__rmul__ = __mul__", "<code>3 * v</code> first asks int how to multiply by a Vector; int doesn't know, so Python tries <code>v.__rmul__(3)</code>."],
      ["def _check(self, other):", "A leading underscore marks a helper meant for use inside the class only. More on this on Day 46."]
    ],
    out: "1/2 + 1/3 = 5/6\n1/2 - 1/3 = 1/6\n1/2 * 1/3 = 1/6\n1/2 / 1/3 = 3/2\nSorted: [Fraction(1, 3), Fraction(1, 2), Fraction(2, 3), Fraction(3, 4)]\n6/8 == 3/4: True\nAs a float: 0.875\n\nv + w = Vector(4, 2)\n3 * v = Vector(9, 12)\nv · w = -5\n|v|   = 5.0\nv[0]  = 3  len(v) = 2",
    stretch: ["Let Fractions add to plain ints: <code>Fraction(1, 2) + 1</code>.", "Add a <code>normalised()</code> method to Vector that returns a vector of length 1."]
  },
  tests: ["<code>Fraction(1, 0)</code> should raise ZeroDivisionError.", "<code>Fraction(2, -4)</code> should print <code>-1/2</code>.", "Adding vectors of different lengths should raise ValueError.", "Compare with Python's own <code>fractions.Fraction</code> for a few sums."]
};

L[44] = {
  intro: "Inheritance lets one class build on another: a subclass gets everything from its parent and can add or change behaviour.",
  lesson: [
    {h: "Subclasses",
     p: "Put the parent class in brackets: <code>class Manager(Employee):</code>. The subclass <b>inherits</b> every attribute and method. Use inheritance for a true <b>is-a</b> relationship: a manager <i>is an</i> employee.",
     code: R`class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Cat(Animal):
    def speak(self):            # override the parent's method
        return "Meow"

print(Cat("Tom").name, Cat("Tom").speak())`,
     out: "Tom Meow"},
    {h: "super()",
     p: "<code>super()</code> calls the parent's version of a method. Most often it's used in <code>__init__</code> so the parent sets up its attributes, and the child then adds its own.",
     code: R`class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)      # parent sets self.name
        self.breed = breed`},
    {h: "Polymorphism",
     p: "Code that works with the parent type also works with every subclass. A loop can call <code>speak()</code> on a mix of animals, and each answers in its own way. The calling code doesn't need <code>if</code> statements for each type.",
     code: R`for pet in [Cat("Tom"), Dog("Rex", "lab")]:
    print(pet.name, pet.speak())`},
    {h: "isinstance and checking types",
     p: "<code>isinstance(x, Animal)</code> is True for an Animal or any subclass. Prefer polymorphism (each class knows its behaviour) over long chains of <code>isinstance</code> checks."},
    {h: "Keep hierarchies shallow",
     p: "One or two levels of inheritance is usually plenty. Deep hierarchies are hard to follow. Tomorrow's topic, composition, is often the better choice."}
  ],
  exercises: [
    {q: "Make a <code>Shape</code> class with an <code>area()</code> that returns 0, then <code>Circle</code> and <code>Square</code> subclasses that override it.", sol: R`import math

class Shape:
    def area(self):
        return 0

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return math.pi * self.r ** 2

class Square(Shape):
    def __init__(self, side):
        self.side = side
    def area(self):
        return self.side ** 2`},
    {q: "Print the total area of a list containing circles and squares.", sol: R`shapes = [Circle(1), Square(2), Circle(0.5)]
print(sum(s.area() for s in shapes))`},
    {q: "Add a <code>describe()</code> method in Shape that uses <code>type(self).__name__</code> and <code>self.area()</code>. Does it work for subclasses without changes?", sol: R`class Shape:
    def describe(self):
        return f"{type(self).__name__} with area {self.area():.2f}"
# Yes: each subclass inherits describe, and self.area() calls its own version.`}
  ],
  project: {
    title: "Employee payroll system",
    brief: "Model salaried, hourly and commission-based employees, plus managers who get a team bonus. Every type has a <code>monthly_pay()</code> method, so the payroll code treats them all the same.",
    file: "day44_payroll.py",
    code: R`# day44_payroll.py
# Payroll for different kinds of employee, using inheritance.


class Employee:
    def __init__(self, emp_id, name):
        self.emp_id = emp_id
        self.name = name

    def monthly_pay(self):
        raise NotImplementedError("Subclasses must define monthly_pay")

    def role(self):
        return type(self).__name__.replace("Employee", "").lower() or "employee"

    def __repr__(self):
        return f"{type(self).__name__}({self.emp_id}, {self.name!r})"


class SalariedEmployee(Employee):
    def __init__(self, emp_id, name, annual_salary):
        super().__init__(emp_id, name)
        self.annual_salary = annual_salary

    def monthly_pay(self):
        return self.annual_salary / 12


class HourlyEmployee(Employee):
    OVERTIME_AFTER = 160          # hours per month
    OVERTIME_RATE = 1.5

    def __init__(self, emp_id, name, hourly_rate, hours=0):
        super().__init__(emp_id, name)
        self.hourly_rate = hourly_rate
        self.hours = hours

    def monthly_pay(self):
        regular = min(self.hours, self.OVERTIME_AFTER)
        overtime = max(0, self.hours - self.OVERTIME_AFTER)
        return (regular + overtime * self.OVERTIME_RATE) * self.hourly_rate


class CommissionEmployee(SalariedEmployee):
    def __init__(self, emp_id, name, annual_salary, sales=0, rate=0.05):
        super().__init__(emp_id, name, annual_salary)
        self.sales = sales
        self.rate = rate

    def monthly_pay(self):
        return super().monthly_pay() + self.sales * self.rate


class Manager(SalariedEmployee):
    BONUS_PER_REPORT = 150

    def __init__(self, emp_id, name, annual_salary):
        super().__init__(emp_id, name, annual_salary)
        self.team = []

    def add_report(self, employee):
        self.team.append(employee)

    def monthly_pay(self):
        return super().monthly_pay() + self.BONUS_PER_REPORT * len(self.team)


def run_payroll(employees):
    print(f"{'ID':<5}{'Name':<14}{'Role':<12}{'Monthly pay':>12}")
    print("-" * 43)
    total = 0
    for e in sorted(employees, key=lambda e: e.monthly_pay(), reverse=True):
        pay = e.monthly_pay()
        total += pay
        print(f"{e.emp_id:<5}{e.name:<14}{e.role():<12}{pay:>12,.2f}")
    print("-" * 43)
    print(f"{'Total':<31}{total:>12,.2f}")


def main():
    amina = Manager(1, "Amina", 72_000)
    omar = SalariedEmployee(2, "Omar", 48_000)
    sara = HourlyEmployee(3, "Sara", 22.50, hours=172)
    yusuf = CommissionEmployee(4, "Yusuf", 30_000, sales=41_000)
    for person in (omar, sara, yusuf):
        amina.add_report(person)

    run_payroll([amina, omar, sara, yusuf])
    print(f"\n{amina.name} manages: {amina.team}")
    print("Is Yusuf salaried?", isinstance(yusuf, SalariedEmployee))


if __name__ == "__main__":
    main()`,
    explain: [
      ["raise NotImplementedError(...)", "The base class promises a <code>monthly_pay</code> method but can't know how to calculate it. Forgetting to override it in a subclass gives a clear error."],
      ["super().__init__(emp_id, name)", "Each subclass lets its parent set up the shared attributes, then adds its own. No code is duplicated."],
      ["return super().monthly_pay() + self.sales * self.rate", "A commission employee's pay is the salaried pay <i>plus</i> commission. <code>super()</code> reuses the parent's calculation."],
      ["for e in sorted(employees, key=lambda e: e.monthly_pay(), ...)", "Polymorphism: the payroll never checks types. Each object calculates its own pay."],
      ["{self.name!r}", "<code>!r</code> in an f-string uses <code>repr()</code>, which adds quotes around strings."]
    ],
    out: "ID   Name          Role         Monthly pay\n-------------------------------------------\n1    Amina         manager         6,450.00\n4    Yusuf         commission      4,550.00\n3    Sara          hourly          4,005.00\n2    Omar          salaried        4,000.00\n-------------------------------------------\nTotal                             19,005.00",
    stretch: ["Add an <code>Intern</code> class with a fixed monthly stipend.", "Add a tax calculation in the base class that every subclass inherits."]
  },
  tests: ["Check Sara by hand: 160 × 22.50 + 12 × 1.5 × 22.50.", "Create a plain <code>Employee</code> and call <code>monthly_pay()</code>.", "Add a second manager who manages the first one."]
};

L[45] = {
  intro: "Composition builds objects out of other objects. It's often more flexible than inheritance, and it's how most real systems are put together.",
  lesson: [
    {h: "Has-a versus is-a",
     p: "Inheritance models <b>is-a</b> (a cat is an animal). Composition models <b>has-a</b>: a car <i>has an</i> engine, a cart <i>has</i> items. In code, composition just means an object stores other objects as attributes.",
     code: R`class Engine:
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

print(Car("Corolla", Engine(130)).start())`},
    {h: "Delegation",
     p: "The outer object passes work to the objects it contains, as <code>Car.start</code> does above. Each class stays small and focused on one job."},
    {h: "Why prefer composition",
     p: "You can swap parts at runtime (a different engine, a different discount rule), test each part alone, and avoid deep inheritance trees. A common guideline is \"favour composition over inheritance\"."},
    {h: "Aggregating many objects",
     p: "Often one object holds a list or dict of others and offers methods that work across them: a cart totals its line items, a library searches its books. Defining <code>__len__</code> and <code>__iter__</code> on the container makes it feel built-in.",
     code: R`class Playlist:
    def __init__(self):
        self.songs = []

    def add(self, song):
        self.songs.append(song)

    def __len__(self):
        return len(self.songs)

    def __iter__(self):
        return iter(self.songs)`}
  ],
  exercises: [
    {q: "Make <code>Address</code> and <code>Person</code> classes where a person has an address, and print a person's city through it.", sol: R`class Address:
    def __init__(self, street, city):
        self.street, self.city = street, city

class Person:
    def __init__(self, name, address):
        self.name, self.address = name, address

p = Person("Amina", Address("1 Main Rd", "Hargeisa"))
print(p.address.city)`},
    {q: "Give the Car a <code>Radio</code> part and a <code>play()</code> method that delegates to it.", sol: R`class Radio:
    def play(self, station):
        return f"Playing {station}"

class Car:
    def __init__(self, model, engine, radio):
        self.model, self.engine, self.radio = model, engine, radio

    def play(self, station):
        return self.radio.play(station)`}
  ],
  project: {
    title: "Shopping cart with products",
    brief: "Build an online-shop cart from small classes: <code>Product</code>, <code>LineItem</code> (a product and a quantity), discount rules, and a <code>Cart</code> that composes them. Discounts are separate objects you can plug in, which is something inheritance alone can't do neatly.",
    file: "day45_cart.py",
    code: R`# day45_cart.py
# A shopping cart built by composing small objects.


class Product:
    def __init__(self, sku, name, price):
        self.sku = sku
        self.name = name
        self.price = price

    def __repr__(self):
        return f"Product({self.sku!r}, {self.name!r}, {self.price})"


class LineItem:
    def __init__(self, product, quantity=1):
        self.product = product
        self.quantity = quantity

    def subtotal(self):
        return self.product.price * self.quantity


class PercentOff:
    def __init__(self, percent):
        self.percent = percent

    def amount(self, cart):
        return cart.subtotal() * self.percent / 100

    def describe(self):
        return f"{self.percent}% off everything"


class BuyXGetOneFree:
    def __init__(self, sku, x):
        self.sku = sku
        self.x = x

    def amount(self, cart):
        item = cart.items.get(self.sku)
        if item is None:
            return 0
        free = item.quantity // (self.x + 1)
        return free * item.product.price

    def describe(self):
        return f"Buy {self.x} get 1 free on {self.sku}"


class Cart:
    def __init__(self):
        self.items = {}          # sku -> LineItem
        self.discounts = []

    def add(self, product, quantity=1):
        if product.sku in self.items:
            self.items[product.sku].quantity += quantity
        else:
            self.items[product.sku] = LineItem(product, quantity)

    def remove(self, sku, quantity=1):
        item = self.items.get(sku)
        if item is None:
            return
        item.quantity -= quantity
        if item.quantity <= 0:
            del self.items[sku]

    def apply(self, discount):
        self.discounts.append(discount)

    def subtotal(self):
        return sum(item.subtotal() for item in self.items.values())

    def discount_total(self):
        return sum(d.amount(self) for d in self.discounts)

    def total(self):
        return max(0, self.subtotal() - self.discount_total())

    def __len__(self):
        return sum(item.quantity for item in self.items.values())

    def receipt(self):
        lines = []
        for item in self.items.values():
            lines.append(f"{item.quantity:>3} x {item.product.name:<18}{item.subtotal():>9.2f}")
        lines.append(f"{'Subtotal':<24}{self.subtotal():>9.2f}")
        for d in self.discounts:
            lines.append(f"{d.describe():<24}{-d.amount(self):>9.2f}")
        lines.append(f"{'TOTAL':<24}{self.total():>9.2f}")
        return "\n".join(lines)


def main():
    catalogue = {
        "TEA": Product("TEA", "Green tea (box)", 4.50),
        "MUG": Product("MUG", "Ceramic mug", 9.00),
        "HNY": Product("HNY", "Honey jar", 6.25),
    }
    cart = Cart()
    cart.add(catalogue["TEA"], 3)
    cart.add(catalogue["MUG"])
    cart.add(catalogue["HNY"], 2)
    cart.add(catalogue["TEA"])           # adds to the existing line
    cart.apply(BuyXGetOneFree("TEA", 3))
    cart.apply(PercentOff(10))

    print(f"{len(cart)} items in the cart\n")
    print(cart.receipt())


if __name__ == "__main__":
    main()`,
    explain: [
      ["self.items = {}  # sku -> LineItem", "The cart <b>has</b> line items, and each line item <b>has</b> a product. Nobody inherits from anybody."],
      ["class PercentOff / class BuyXGetOneFree", "Two unrelated classes that both offer <code>amount(cart)</code> and <code>describe()</code>. The cart doesn't care which kind it gets. This is called <b>duck typing</b>: if it has the right methods, it works."],
      ["d.amount(self)", "The cart passes itself to each discount, so a discount can look at whatever it needs."],
      ["max(0, self.subtotal() - self.discount_total())", "A guard so stacked discounts can never make the total negative."],
      ["def __len__(self):", "<code>len(cart)</code> counts every unit, not just distinct products."]
    ],
    out: "7 items in the cart\n\n  4 x Green tea (box)       18.00\n  1 x Ceramic mug            9.00\n  2 x Honey jar             12.50\nSubtotal                    39.50\nBuy 3 get 1 free on TEA     -4.50\n10% off everything          -3.95\nTOTAL                       31.05",
    stretch: ["Add a <code>FixedAmountOff(5, minimum=30)</code> discount that only applies over a minimum spend.", "Add stock levels to Product and refuse to add more than is available."]
  },
  tests: ["Remove items until a line disappears.", "Apply both discounts to an empty cart: the total should be 0.", "Check the receipt numbers by hand."]
};

L[46] = {
  intro: "Encapsulation means an object protects its own data so it can never get into an invalid state. Today you learn Python's conventions for private data and the <code>@property</code> decorator.",
  lesson: [
    {h: "The problem",
     p: "Attributes can be changed by anyone: <code>account.balance = -1_000_000</code>. Nothing stops invalid values, and the bug shows up far from where it was caused."},
    {h: "Python's privacy conventions",
     p: "Python has no truly private attributes. A single leading underscore, <code>self._balance</code>, means \"internal: please don't touch from outside\". Everyone respects it. A double underscore, <code>self.__balance</code>, triggers <b>name mangling</b> to avoid clashes in subclasses; you rarely need it."},
    {h: "@property",
     p: "<code>@property</code> turns a method into something that reads like an attribute. Add a <b>setter</b> to validate new values. Users still write <code>t.target = 21</code>, but your code checks it first.",
     code: R`class Thermostat:
    def __init__(self, target):
        self.target = target          # goes through the setter

    @property
    def target(self):
        return self._target

    @target.setter
    def target(self, value):
        if not 10 <= value <= 30:
            raise ValueError("Target must be between 10 and 30")
        self._target = value

t = Thermostat(21)
t.target = 24
print(t.target)
t.target = 99          # ValueError`},
    {h: "Read-only and computed properties",
     p: "A property without a setter is read-only. Properties can also compute a value each time it's read, so it can never be out of date.",
     code: R`class Rectangle:
    def __init__(self, w, h):
        self.w, self.h = w, h

    @property
    def area(self):           # computed, read-only
        return self.w * self.h

print(Rectangle(3, 4).area)   # no parentheses`},
    {h: "Start simple",
     p: "Begin with plain attributes. Python lets you switch to a property later without changing any code that uses the class, so you don't need Java-style <code>get_x()</code> / <code>set_x()</code> methods."}
  ],
  exercises: [
    {q: "Add a property <code>perimeter</code> to the Rectangle above.", sol: R`    @property
    def perimeter(self):
        return 2 * (self.w + self.h)`},
    {q: "Make a <code>Person</code> whose <code>age</code> setter rejects negative numbers and non-integers.", sol: R`class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if not isinstance(value, int) or value < 0:
            raise ValueError("Age must be a non-negative whole number")
        self._age = value`},
    {q: "Make a <code>Temperature</code> class storing Celsius, with a <code>fahrenheit</code> property that can be read and set.", sol: R`class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9`}
  ],
  project: {
    title: "Thermostat with safe limits",
    brief: "Model a smart thermostat. The target temperature is validated, the mode is restricted to a fixed set, the heating state is computed from the readings, and history is read-only from outside. Users interact through a small command prompt.",
    file: "day46_thermostat.py",
    code: R`# day46_thermostat.py
# A thermostat that protects its own state.


class Thermostat:
    MIN_TEMP = 10.0
    MAX_TEMP = 30.0
    MODES = ("heat", "cool", "off")
    TOLERANCE = 0.5

    def __init__(self, target=21.0, mode="heat"):
        self._history = []
        self.target = target          # validated by the setter
        self.mode = mode
        self._current = 18.0

    @property
    def target(self):
        return self._target

    @target.setter
    def target(self, value):
        value = round(float(value), 1)
        if not self.MIN_TEMP <= value <= self.MAX_TEMP:
            raise ValueError(f"Target must be between {self.MIN_TEMP} and {self.MAX_TEMP}")
        self._target = value
        self._log(f"target set to {value}")

    @property
    def mode(self):
        return self._mode

    @mode.setter
    def mode(self, value):
        if value not in self.MODES:
            raise ValueError(f"Mode must be one of {self.MODES}")
        self._mode = value
        self._log(f"mode set to {value}")

    @property
    def current(self):
        return self._current

    @property
    def action(self):
        """What the thermostat is doing right now (computed, read-only)."""
        if self._mode == "heat" and self._current < self._target - self.TOLERANCE:
            return "heating"
        if self._mode == "cool" and self._current > self._target + self.TOLERANCE:
            return "cooling"
        return "idle"

    @property
    def history(self):
        return tuple(self._history)   # a copy that can't be changed

    def read_sensor(self, temperature):
        self._current = float(temperature)

    def tick(self):
        """Simulate one minute passing."""
        if self.action == "heating":
            self._current += 0.5
        elif self.action == "cooling":
            self._current -= 0.5

    def _log(self, message):
        self._history.append(message)

    def __str__(self):
        return (f"Mode {self._mode} | target {self._target}°C | "
                f"room {self._current:.1f}°C | {self.action}")


def main():
    t = Thermostat()
    print("Commands: target 22 | mode cool | room 25 | wait 5 | history | quit")
    while True:
        print(t)
        parts = input("> ").strip().lower().split()
        if not parts:
            continue
        command, args = parts[0], parts[1:]
        try:
            if command == "quit":
                break
            elif command == "target":
                t.target = args[0]
            elif command == "mode":
                t.mode = args[0]
            elif command == "room":
                t.read_sensor(args[0])
            elif command == "wait":
                for _ in range(int(args[0]) if args else 1):
                    t.tick()
            elif command == "history":
                for line in t.history:
                    print("  -", line)
            else:
                print("Unknown command.")
        except (ValueError, IndexError) as error:
            print("Error:", error or "missing value")


if __name__ == "__main__":
    main()`,
    explain: [
      ["self.target = target  (in __init__)", "Even the constructor goes through the setter, so an invalid starting value is rejected too."],
      ["value = round(float(value), 1)", "The setter accepts text like \"22\" from the prompt and normalises it."],
      ["@property def action(self):", "Computed from the current state each time, so it can never be stale. There's no setter: <code>t.action = \"heating\"</code> raises an AttributeError."],
      ["return tuple(self._history)", "Returning a tuple copy means outside code can read the history but can't append to or erase it."],
      ["def _log(self, message):", "The underscore says this is for the class's own use."]
    ],
    stretch: ["Add an eco mode that lowers the target by 2 degrees at night.", "Add a <code>schedule</code> of times and targets, and apply it in <code>tick()</code>."]
  },
  tests: ["<code>target 35</code> and <code>mode warm</code> should be rejected.", "Set <code>room 15</code>, then <code>wait 15</code>: it should heat up and then go idle.", "In the interpreter, try <code>t.action = \"heating\"</code> and <code>t.history.append(\"x\")</code>."]
};

L[47] = {
  intro: "Every <code>for</code> loop uses Python's iterator protocol. Today you learn how it works and make your own objects loopable.",
  lesson: [
    {h: "Iterables and iterators",
     p: "An <b>iterable</b> is anything you can loop over: lists, strings, dicts, files. Calling <code>iter()</code> on it gives an <b>iterator</b>, an object that produces one value each time you call <code>next()</code> and raises <code>StopIteration</code> when it runs out.",
     code: R`it = iter(["a", "b"])
print(next(it))
print(next(it))
print(next(it))   # StopIteration`},
    {h: "What a for loop really does",
     p: "<code>for x in items:</code> calls <code>iter(items)</code> once, then calls <code>next()</code> repeatedly until StopIteration, which it catches quietly. That's the whole trick.",
     code: R`items = [1, 2, 3]
it = iter(items)
while True:
    try:
        x = next(it)
    except StopIteration:
        break
    print(x)`},
    {h: "Writing an iterator class",
     p: "An iterator needs <code>__iter__</code> (returning itself) and <code>__next__</code> (returning the next value or raising StopIteration).",
     code: R`class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

print(list(Countdown(3)))`,
     out: "[3, 2, 1]"},
    {h: "Iterators get used up",
     p: "An iterator can only be looped over once. A container class (like a playlist) should therefore return a <b>new</b> iterator from <code>__iter__</code> each time, so it can be looped over again and again."}
  ],
  exercises: [
    {q: "Call <code>iter()</code> and <code>next()</code> by hand on the string \"hi\".", sol: R`it = iter("hi")
print(next(it), next(it))   # h i`},
    {q: "Write an iterator class <code>EvenNumbers(limit)</code> producing 0, 2, 4, up to the limit.", sol: R`class EvenNumbers:
    def __init__(self, limit):
        self.limit = limit
        self.n = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.n > self.limit:
            raise StopIteration
        value = self.n
        self.n += 2
        return value

print(list(EvenNumbers(8)))`},
    {q: "Loop over the same <code>EvenNumbers(4)</code> object twice. Why is the second loop empty?", sol: R`evens = EvenNumbers(4)
print(list(evens))   # [0, 2, 4]
print(list(evens))   # []  the iterator is already used up`}
  ],
  project: {
    title: "Music playlist iterator",
    brief: "A <code>Playlist</code> container that can be looped over normally, plus separate iterator classes for shuffle play and repeat play. It shows the difference between an iterable container and the iterators it creates.",
    file: "day47_playlist.py",
    code: R`# day47_playlist.py
# A playlist with normal, shuffled and repeating iterators.

import random


class Song:
    def __init__(self, title, artist, seconds):
        self.title = title
        self.artist = artist
        self.seconds = seconds

    def __str__(self):
        minutes, secs = divmod(self.seconds, 60)
        return f"{self.title} - {self.artist} ({minutes}:{secs:02d})"


class ShuffleIterator:
    """Plays every song once, in a random order."""

    def __init__(self, songs, seed=None):
        self.order = list(songs)
        random.Random(seed).shuffle(self.order)
        self.position = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.position >= len(self.order):
            raise StopIteration
        song = self.order[self.position]
        self.position += 1
        return song


class RepeatIterator:
    """Plays the songs in order, starting again at the end, up to a limit."""

    def __init__(self, songs, max_plays):
        self.songs = songs
        self.max_plays = max_plays
        self.played = 0

    def __iter__(self):
        return self

    def __next__(self):
        if not self.songs or self.played >= self.max_plays:
            raise StopIteration
        song = self.songs[self.played % len(self.songs)]
        self.played += 1
        return song


class Playlist:
    def __init__(self, name):
        self.name = name
        self.songs = []

    def add(self, song):
        self.songs.append(song)

    def __len__(self):
        return len(self.songs)

    def __iter__(self):
        return iter(self.songs)          # a fresh iterator every time

    def shuffled(self, seed=None):
        return ShuffleIterator(self.songs, seed)

    def repeat(self, max_plays):
        return RepeatIterator(self.songs, max_plays)

    def total_time(self):
        return sum(song.seconds for song in self)


def main():
    mix = Playlist("Study mix")
    mix.add(Song("Weightless", "Marconi Union", 480))
    mix.add(Song("Clair de Lune", "Debussy", 302))
    mix.add(Song("Experience", "Ludovico Einaudi", 315))
    mix.add(Song("Nuvole Bianche", "Ludovico Einaudi", 357))

    minutes = mix.total_time() // 60
    print(f"{mix.name}: {len(mix)} songs, {minutes} minutes\n")

    print("In order:")
    for number, song in enumerate(mix, start=1):
        print(f"  {number}. {song}")

    print("\nShuffle:")
    for song in mix.shuffled(seed=7):
        print("  ", song)

    print("\nRepeat (6 plays):")
    for song in mix.repeat(6):
        print("  ", song.title)

    print("\nArtists:", sorted({song.artist for song in mix}))


if __name__ == "__main__":
    main()`,
    explain: [
      ["return iter(self.songs)", "The playlist is an <b>iterable</b>, not an iterator. Each <code>for</code> loop gets a fresh iterator over the list, so you can loop as many times as you like."],
      ["random.Random(seed).shuffle(self.order)", "A private random generator with an optional seed: the same seed always gives the same order, which makes shuffles testable."],
      ["self.songs[self.played % len(self.songs)]", "The remainder wraps the position back to 0 after the last song."],
      ["sum(song.seconds for song in self)", "Inside the class, <code>self</code> is loopable too, because <code>__iter__</code> is defined."],
      ["{song.artist for song in mix}", "Comprehensions work with any iterable, including your own classes."]
    ],
    stretch: ["Add a <code>by_artist(name)</code> iterator.", "Make <code>RepeatIterator</code> stop after a total listening time instead of a number of plays."]
  },
  tests: ["Loop over the playlist twice; both loops should print every song.", "Loop over the same <code>mix.shuffled()</code> object twice. What happens?", "Call <code>repeat(5)</code> on an empty playlist."]
};

L[48] = {
  intro: "Generators are the easy way to write iterators. They also let you process data far bigger than your computer's memory, which matters a lot for ML datasets.",
  lesson: [
    {h: "yield",
     p: "A function containing <code>yield</code> is a <b>generator function</b>. Calling it doesn't run the body; it returns a generator. Each <code>next()</code> runs the body until the next <code>yield</code>, hands out that value, and <b>pauses</b> there, remembering all its local variables.",
     code: R`def countdown(n):
    while n > 0:
        yield n
        n -= 1

for x in countdown(3):
    print(x)`,
     out: "3\n2\n1"},
    {h: "Compare with yesterday",
     p: "The <code>Countdown</code> iterator class from Day 47 needed 12 lines. The generator does the same in 4. Python creates <code>__iter__</code> and <code>__next__</code> for you."},
    {h: "Lazy evaluation",
     p: "Generators produce values only when asked. A list of a billion numbers wouldn't fit in memory; a generator that yields them one at a time uses almost none.",
     code: R`def squares(limit):
    for n in range(limit):
        yield n * n

total = sum(squares(10_000_000))   # never builds a list`},
    {h: "Pipelines",
     p: "Generators can feed each other, each doing one step. Data flows through one item at a time. This is the pattern behind streaming data loaders in ML.",
     code: R`def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip("\n")

def non_empty(lines):
    for line in lines:
        if line.strip():
            yield line

for line in non_empty(read_lines("notes.txt")):
    print(line)`},
    {h: "Infinite generators",
     p: "A generator can run forever (<code>while True: yield ...</code>) because it only produces what you ask for. Take what you need with a <code>break</code>, or with <code>itertools.islice</code> (Day 64)."}
  ],
  exercises: [
    {q: "Write a generator <code>fibonacci()</code> that yields Fibonacci numbers forever, and print the first 10.", sol: R`def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

for i, n in enumerate(fibonacci()):
    if i == 10:
        break
    print(n)`},
    {q: "Write <code>chunks(items, size)</code> that yields lists of <code>size</code> items at a time.", sol: R`def chunks(items, size):
    for start in range(0, len(items), size):
        yield items[start:start + size]

print(list(chunks([1, 2, 3, 4, 5], 2)))   # [[1, 2], [3, 4], [5]]`},
    {q: "Rewrite <code>[n * 2 for n in data]</code> as a generator expression and pass it to <code>max</code>.", sol: R`print(max(n * 2 for n in data))`}
  ],
  project: {
    title: "Streaming log-file reader",
    brief: "Generate a large fake web-server log, then analyse it with a pipeline of generators: read lines, parse them, filter errors, and summarise. Memory use stays tiny no matter how big the file is.",
    file: "day48_logs.py",
    code: R`# day48_logs.py
# Analyses a large log file with a pipeline of generators.

import random
from datetime import datetime, timedelta
from pathlib import Path

LOG_FILE = Path(__file__).parent / "server.log"
PAGES = ["/", "/login", "/products", "/cart", "/checkout", "/api/data"]
STATUSES = [200] * 90 + [301] * 3 + [404] * 4 + [500] * 3


def make_fake_log(lines=200_000, seed=1):
    """Write a log file with one request per line."""
    rng = random.Random(seed)
    time = datetime(2026, 10, 1)
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        for _ in range(lines):
            time += timedelta(seconds=rng.randint(0, 3))
            ip = f"10.0.{rng.randint(0, 255)}.{rng.randint(1, 254)}"
            f.write(f"{time.isoformat()} {ip} GET {rng.choice(PAGES)} "
                    f"{rng.choice(STATUSES)} {rng.randint(5, 900)}ms\n")


def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip("\n")


def parse(lines):
    for line in lines:
        parts = line.split()
        if len(parts) != 6:
            continue                      # skip malformed lines
        time, ip, method, page, status, duration = parts
        yield {"time": time, "ip": ip, "page": page,
               "status": int(status), "ms": int(duration.removesuffix("ms"))}


def only_errors(records):
    for r in records:
        if r["status"] >= 400:
            yield r


def summarise(records):
    count, slowest, by_page = 0, None, {}
    for r in records:
        count += 1
        by_page[r["page"]] = by_page.get(r["page"], 0) + 1
        if slowest is None or r["ms"] > slowest["ms"]:
            slowest = r
    return count, slowest, by_page


def main():
    if not LOG_FILE.exists():
        print("Creating a 200,000-line log file...")
        make_fake_log()
    size_mb = LOG_FILE.stat().st_size / 1_000_000
    print(f"{LOG_FILE.name}: {size_mb:.1f} MB\n")

    errors = only_errors(parse(read_lines(LOG_FILE)))   # nothing has run yet
    count, slowest, by_page = summarise(errors)          # now it streams

    print(f"Error responses: {count:,}")
    print(f"Slowest error:   {slowest['page']} took {slowest['ms']}ms at {slowest['time']}")
    print("Errors by page:")
    for page, n in sorted(by_page.items(), key=lambda kv: kv[1], reverse=True):
        print(f"  {page:<12}{n:>6,}")

    first_404 = next(r for r in parse(read_lines(LOG_FILE)) if r["status"] == 404)
    print(f"\nFirst 404: {first_404['page']} from {first_404['ip']}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["errors = only_errors(parse(read_lines(LOG_FILE)))", "Builds the pipeline without reading anything yet. Each stage wraps the previous one."],
      ["for r in records: ... (in summarise)", "Looping pulls one line through all three stages at a time. Only one line is in memory at any moment, whether the file is 10 MB or 10 GB."],
      ["duration.removesuffix(\"ms\")", "A string method (Python 3.9+) that removes the ending if present."],
      ["next(r for r in ... if r[\"status\"] == 404)", "<code>next()</code> on a generator expression takes the first match and stops reading the file immediately."],
      ["random.Random(seed)", "A seeded generator makes the fake log identical on every computer."]
    ],
    stretch: ["Add a stage that keeps only one day's records.", "Compare memory use with a version that reads the file into a list: use <code>tracemalloc</code> from the standard library."]
  },
  tests: ["Add a broken line to <code>server.log</code> by hand; it should be skipped.", "Increase the log to 2 million lines: memory use should stay the same.", "Count all 200 responses with the same pipeline idea."]
};

L[49] = {
  intro: "Decorators wrap a function to add behaviour (timing, logging, retrying, checking) without changing the function's own code. You've already used <code>@property</code> and <code>@classmethod</code>.",
  lesson: [
    {h: "Functions are objects",
     p: "A function can be stored in a variable, passed as an argument, and returned from another function. A function defined inside another can remember the outer function's variables; this is called a <b>closure</b>.",
     code: R`def make_multiplier(n):
    def multiply(x):
        return x * n          # remembers n
    return multiply

double = make_multiplier(2)
print(double(21))`,
     out: "42"},
    {h: "A decorator by hand",
     p: "A decorator is a function that takes a function and returns a new function, usually one that calls the original with something extra before or after.",
     code: R`def shout(func):
    def wrapper():
        print("Before")
        func()
        print("After")
    return wrapper

def hello():
    print("Hello")

hello = shout(hello)    # replace hello with the wrapped version
hello()`,
     out: "Before\nHello\nAfter"},
    {h: "The @ syntax",
     p: "<code>@shout</code> above a definition means exactly <code>hello = shout(hello)</code>. To wrap functions with any arguments, the wrapper accepts <code>*args, **kwargs</code> and passes them on, and returns the result. <code>functools.wraps</code> keeps the original function's name and docstring.",
     code: R`import functools

def announce(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}{args}")
        return func(*args, **kwargs)
    return wrapper

@announce
def add(a, b):
    return a + b

print(add(2, 3))`,
     out: "Calling add(2, 3)\n5"},
    {h: "Decorators with arguments",
     p: "<code>@retry(times=3)</code> needs one more layer: <code>retry(3)</code> runs first and returns the actual decorator. It looks complicated, but it's always the same three-level shape, which you'll see in today's project."}
  ],
  exercises: [
    {q: "Write a decorator <code>@twice</code> that runs the function two times.", sol: R`def twice(func):
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
        return func(*args, **kwargs)
    return wrapper

@twice
def greet(name):
    print("Hi", name)

greet("Sara")`},
    {q: "Write <code>@positive_args</code> that raises ValueError if any argument is a negative number.", sol: R`def positive_args(func):
    def wrapper(*args, **kwargs):
        for a in args:
            if isinstance(a, (int, float)) and a < 0:
                raise ValueError("Arguments must be positive")
        return func(*args, **kwargs)
    return wrapper`},
    {q: "Try <code>functools.lru_cache</code>, a built-in decorator, on a recursive Fibonacci function. How much faster is <code>fib(35)</code>?", sol: R`import functools

@functools.lru_cache
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(35))   # instant; without the cache it takes seconds`}
  ],
  project: {
    title: "Timer and retry decorators",
    brief: "Build a small toolkit of reusable decorators: <code>@timer</code> reports how long a function took, <code>@retry</code> re-runs a function that fails (useful for flaky network calls), <code>@count_calls</code> tracks usage, and <code>@validate_types</code> checks argument types.",
    file: "day49_decorators.py",
    code: R`# day49_decorators.py
# A toolkit of reusable decorators.

import functools
import random
import time


def timer(func):
    """Print how long each call takes."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"[timer] {func.__name__} took {elapsed * 1000:.1f} ms")
        return result
    return wrapper


def retry(times=3, delay=0.2, exceptions=(Exception,)):
    """Call the function again if it raises one of the given exceptions."""
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as error:
                    print(f"[retry] {func.__name__} attempt {attempt} failed: {error}")
                    if attempt == times:
                        raise
                    time.sleep(delay * attempt)      # wait a little longer each time
        return wrapper
    return decorator


def count_calls(func):
    """Count how many times the function is called."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return func(*args, **kwargs)
    wrapper.calls = 0
    return wrapper


def validate_types(**expected):
    """Check keyword-named argument types, e.g. @validate_types(n=int)."""
    def decorator(func):
        names = func.__code__.co_varnames[:func.__code__.co_argcount]

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            values = dict(zip(names, args)) | kwargs
            for name, kind in expected.items():
                if name in values and not isinstance(values[name], kind):
                    raise TypeError(f"{name} must be {kind.__name__}, "
                                    f"got {type(values[name]).__name__}")
            return func(*args, **kwargs)
        return wrapper
    return decorator


# ----- examples -----

@timer
def slow_sum(n):
    return sum(i * i for i in range(n))


@retry(times=4, exceptions=(ConnectionError,))
def flaky_download():
    """Pretend network call that fails 60% of the time."""
    if random.random() < 0.6:
        raise ConnectionError("network timeout")
    return "data received"


@count_calls
def greet(name):
    return f"Hello, {name}"


@validate_types(name=str, times=int)
def repeat(name, times):
    return " ".join([name] * times)


def main():
    print(slow_sum(2_000_000))
    print()

    random.seed(3)
    try:
        print(flaky_download())
    except ConnectionError:
        print("Gave up after 4 attempts.")
    print()

    for person in ["Amina", "Omar", "Sara"]:
        greet(person)
    print(f"greet was called {greet.calls} times")
    print("Name kept by functools.wraps:", greet.__name__)
    print()

    print(repeat("hi", 3))
    try:
        repeat("hi", "3")
    except TypeError as error:
        print("TypeError:", error)


if __name__ == "__main__":
    main()`,
    explain: [
      ["result = func(*args, **kwargs) ... return result", "The wrapper must return the original result, or every decorated function would return <code>None</code>."],
      ["def retry(times=3, ...): def decorator(func): def wrapper(...):", "Three layers: <code>retry(...)</code> takes the settings and returns a decorator; the decorator takes the function and returns the wrapper."],
      ["raise  (on its own)", "Re-raises the current error after the final attempt, so the caller still finds out it failed."],
      ["wrapper.calls = 0", "Functions are objects, so you can attach attributes to them. The counter lives on the wrapper."],
      ["dict(zip(names, args)) | kwargs", "Matches positional values to parameter names, then merges in keyword arguments with the <code>|</code> dict-merge operator (Python 3.9+)."]
    ],
    stretch: ["Write <code>@cache_to_file</code> that saves results to JSON and reuses them.", "Stack <code>@timer</code> on top of <code>@retry</code> and explain the order of the output."]
  },
  tests: ["Run it a few times with different seeds and watch retry succeed or give up.", "Check <code>help(greet)</code> still shows the original docstring.", "Remove <code>return result</code> from <code>timer</code> and see what breaks."]
};

L[50] = {
  intro: "Context managers power the <code>with</code> statement. They guarantee setup and cleanup happen, even when errors occur. Today you write your own.",
  lesson: [
    {h: "What with does",
     p: "<code>with open(...) as f:</code> calls the object's <code>__enter__</code> method at the start, giving <code>f</code>, and its <code>__exit__</code> method at the end, <b>no matter how the block ends</b>: normally, by <code>return</code>, or by an exception. That's why files always get closed."},
    {h: "A class-based context manager",
     p: "<code>__exit__</code> receives details of any exception. Returning <code>True</code> from it would swallow the exception; usually you return nothing (<code>None</code>) so errors still propagate.",
     code: R`import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        print(f"Took {self.elapsed:.3f}s")

with Timer():
    sum(range(5_000_000))`},
    {h: "The @contextmanager shortcut",
     p: "<code>contextlib.contextmanager</code> turns a generator into a context manager. Code before <code>yield</code> is the setup, the yielded value is what <code>as</code> receives, and code after <code>yield</code> is the cleanup. Put the cleanup in <code>finally</code> so it runs even after an error.",
     code: R`from contextlib import contextmanager

@contextmanager
def announce(name):
    print(f"Starting {name}")
    try:
        yield
    finally:
        print(f"Finished {name}")

with announce("training"):
    print("...working...")`,
     out: "Starting training\n...working...\nFinished training"},
    {h: "Where you'll see them",
     p: "Files, database connections and transactions (Day 58), locks in threaded code (Day 67), temporary directories, and in ML: <code>torch.no_grad()</code> turns off gradient tracking inside a <code>with</code> block (Day 94)."}
  ],
  exercises: [
    {q: "Use the <code>Timer</code> class to time sorting a list of a million random numbers.", sol: R`import random
data = [random.random() for _ in range(1_000_000)]
with Timer():
    data.sort()`},
    {q: "Write a <code>@contextmanager</code> called <code>indented()</code> that prints \"{\" before the block and \"}\" after it.", sol: R`@contextmanager
def indented():
    print("{")
    try:
        yield
    finally:
        print("}")`},
    {q: "Use <code>contextlib.suppress(FileNotFoundError)</code> to delete a file that may not exist.", sol: R`import contextlib
from pathlib import Path

with contextlib.suppress(FileNotFoundError):
    Path("maybe.txt").unlink()`}
  ],
  project: {
    title: "Safe file writer and code timer",
    brief: "Build three context managers. <code>atomic_write</code> writes to a temporary file and only replaces the real file if everything succeeded, so a crash never leaves a half-written file. <code>Timer</code> measures named sections. <code>working_directory</code> temporarily changes the current folder and always changes it back.",
    file: "day50_context_managers.py",
    code: R`# day50_context_managers.py
# Three useful context managers.

import os
import time
from contextlib import contextmanager
from pathlib import Path


@contextmanager
def atomic_write(path, encoding="utf-8"):
    """Write to a temp file; replace the real file only if no error occurred."""
    path = Path(path)
    temp = path.with_name(path.name + ".tmp")
    f = open(temp, "w", encoding=encoding)
    try:
        yield f
    except BaseException:
        f.close()
        temp.unlink()              # throw the half-written file away
        raise
    else:
        f.close()
        temp.replace(path)         # swap in the finished file


class Timer:
    """Times a block of code and remembers every result by name."""
    results = {}

    def __init__(self, name):
        self.name = name

    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, tb):
        self.elapsed = time.perf_counter() - self.start
        Timer.results[self.name] = self.elapsed
        status = "failed" if exc_type else "done"
        print(f"[{self.name}] {status} in {self.elapsed * 1000:.1f} ms")
        return False               # never hide exceptions

    @classmethod
    def report(cls):
        for name, seconds in sorted(cls.results.items(), key=lambda kv: kv[1]):
            print(f"  {name:<20}{seconds * 1000:>8.1f} ms")


@contextmanager
def working_directory(path):
    """Temporarily change the current folder."""
    previous = Path.cwd()
    os.chdir(path)
    try:
        yield Path(path)
    finally:
        os.chdir(previous)


def main():
    target = Path(__file__).parent / "report.txt"

    with Timer("good write"):
        with atomic_write(target) as f:
            for i in range(1, 6):
                f.write(f"Line {i}\n")
    print("After good write:", target.read_text().splitlines())

    try:
        with Timer("failing write"):
            with atomic_write(target) as f:
                f.write("This should never appear\n")
                raise RuntimeError("simulated crash halfway through")
    except RuntimeError as error:
        print("Caught:", error)
    print("After failed write, file is unchanged:", target.read_text().splitlines()[:2], "...")

    with Timer("list comprehension"):
        squares = [n * n for n in range(1_000_000)]
    with Timer("for loop"):
        squares = []
        for n in range(1_000_000):
            squares.append(n * n)

    print("\nFastest first:")
    Timer.report()

    with working_directory(target.parent.parent):
        print("\nInside the block, cwd is", Path.cwd().name)
    print("Afterwards, cwd is", Path.cwd().name)


if __name__ == "__main__":
    main()`,
    explain: [
      ["yield f", "Everything before <code>yield</code> is setup; the <code>with</code> body runs at the yield; everything after is cleanup."],
      ["except BaseException: ... raise", "On any failure (even Ctrl+C) the temp file is deleted, then the error continues to the caller."],
      ["else: ... temp.replace(path)", "Only when the block finished cleanly does the new file replace the old one. <code>replace</code> is atomic on most systems: other programs see either the old or the new file, never half of one."],
      ["return False  (in __exit__)", "Tells Python not to suppress the exception. The timer reports the failure but doesn't hide it."],
      ["finally: os.chdir(previous)", "Guarantees the original folder is restored even if the block raises."]
    ],
    stretch: ["Add a <code>backup(path)</code> context manager that copies a file first and restores it if the block fails.", "Use <code>Timer</code> to compare <code>sorted()</code> with your bubble sort from Day 36."]
  },
  tests: ["Check <code>report.txt</code> still holds lines 1 to 5 after the simulated crash.", "Check that no <code>.tmp</code> file is left behind.", "Raise an error inside <code>working_directory</code> and confirm the folder is still restored."]
};

L[51] = {
  intro: "Type hints document what a function expects and returns, and let tools catch bugs before you run the code. Together with good docstrings, they make code much easier to read and maintain.",
  lesson: [
    {h: "Basic hints",
     p: "Annotate parameters with <code>name: type</code> and the return value with <code>-&gt; type</code>. Python itself <b>ignores</b> hints at runtime; they're for readers, editors and checkers.",
     code: R`def greet(name: str, times: int = 1) -> str:
    return ", ".join([f"Hello {name}"] * times)

count: int = 0`},
    {h: "Collections, optional values and unions",
     p: "Use the built-in names with brackets: <code>list[str]</code>, <code>dict[str, float]</code>, <code>tuple[int, int]</code>, <code>set[str]</code>. <code>X | None</code> means \"an X or None\"; <code>int | float</code> means either.",
     code: R`def average(values: list[float]) -> float | None:
    if not values:
        return None
    return sum(values) / len(values)

def lookup(prices: dict[str, float], item: str) -> float | None:
    return prices.get(item)`},
    {h: "Checking with mypy",
     p: "<code>pip install mypy</code>, then <code>mypy your_file.py</code>. It reads the hints and reports mistakes such as passing a str where an int is expected, or forgetting that a value might be None. VS Code's Python extension shows similar warnings as you type.",
     code: R`result = average([1, 2, 3])
print(result + 1)
# mypy: Unsupported operand types for + ("None" and "int")`},
    {h: "Docstrings",
     p: "A good docstring says what the function does, what each argument means and what it returns or raises. A common layout is the Google style shown below. Hints give the types; the docstring gives the meaning.",
     code: R`def convert(amount: float, rate: float) -> float:
    """Convert an amount using an exchange rate.

    Args:
        amount: The amount in the source currency.
        rate: Units of target currency per unit of source currency.

    Returns:
        The converted amount, rounded to 2 decimals.

    Raises:
        ValueError: If amount is negative.
    """`},
    {h: "Your own classes as types",
     p: "Any class can be used as a type: <code>def add(self, item: Item) -&gt; None</code>. Libraries like pandas, NumPy and PyTorch all ship type hints, which is why your editor can autocomplete their methods."}
  ],
  exercises: [
    {q: "Add type hints to <code>def initials(full_name): ...</code> from Day 21.", sol: R`def initials(full_name: str) -> str:
    ...`},
    {q: "What's the type of a dict mapping student names to lists of scores?", sol: R`dict[str, list[int]]`},
    {q: "Write a typed <code>find_index(items: list[str], target: str) -&gt; int | None</code>, then run mypy on a call that adds 1 to the result without checking for None.", sol: R`def find_index(items: list[str], target: str) -> int | None:
    for i, item in enumerate(items):
        if item == target:
            return i
    return None

i = find_index(["a", "b"], "b")
if i is not None:          # mypy is satisfied once None is ruled out
    print(i + 1)`}
  ],
  project: {
    title: "Typed inventory system",
    brief: "An inventory for a small shop with fully typed, documented classes and functions. Run <code>mypy</code> on it until it reports no issues, then deliberately introduce bugs and watch mypy catch them without running the program.",
    file: "day51_inventory.py",
    code: R`# day51_inventory.py
# A fully typed and documented inventory.

from __future__ import annotations


class Item:
    """One product line in the inventory."""

    def __init__(self, sku: str, name: str, price: float, quantity: int = 0) -> None:
        self.sku = sku
        self.name = name
        self.price = price
        self.quantity = quantity

    @property
    def value(self) -> float:
        """Total stock value of this item."""
        return self.price * self.quantity

    def __repr__(self) -> str:
        return f"Item({self.sku!r}, {self.name!r}, {self.price}, {self.quantity})"


class Inventory:
    """A collection of items, looked up by SKU."""

    def __init__(self, low_stock_level: int = 5) -> None:
        self._items: dict[str, Item] = {}
        self.low_stock_level = low_stock_level

    def add(self, item: Item) -> None:
        """Add a new item, or increase stock if the SKU already exists."""
        existing = self._items.get(item.sku)
        if existing is None:
            self._items[item.sku] = item
        else:
            existing.quantity += item.quantity

    def get(self, sku: str) -> Item | None:
        """Return the item with this SKU, or None if there isn't one."""
        return self._items.get(sku)

    def sell(self, sku: str, quantity: int) -> float:
        """Remove stock for a sale and return the sale amount.

        Raises:
            KeyError: If the SKU is unknown.
            ValueError: If there isn't enough stock.
        """
        item = self._items[sku]
        if quantity > item.quantity:
            raise ValueError(f"Only {item.quantity} {item.name} left")
        item.quantity -= quantity
        return item.price * quantity

    def low_stock(self) -> list[Item]:
        return [i for i in self._items.values() if i.quantity <= self.low_stock_level]

    def total_value(self) -> float:
        return sum(i.value for i in self._items.values())

    def search(self, text: str) -> list[Item]:
        text = text.lower()
        return [i for i in self._items.values() if text in i.name.lower()]

    def summary(self) -> dict[str, float | int]:
        return {
            "products": len(self._items),
            "units": sum(i.quantity for i in self._items.values()),
            "value": round(self.total_value(), 2),
        }


def restock_plan(inventory: Inventory, target: int = 20) -> dict[str, int]:
    """Return how many units of each low-stock item to order to reach target."""
    return {item.sku: target - item.quantity for item in inventory.low_stock()}


def main() -> None:
    shop = Inventory(low_stock_level=5)
    shop.add(Item("A100", "USB-C cable", 6.99, 40))
    shop.add(Item("B200", "Wireless mouse", 18.50, 4))
    shop.add(Item("C300", "Laptop stand", 32.00, 7))
    shop.add(Item("D400", "USB hub", 21.00, 2))

    earned = shop.sell("C300", 3)
    print(f"Sold 3 laptop stands for {earned:.2f}")

    try:
        shop.sell("D400", 5)
    except ValueError as error:
        print("Sale refused:", error)

    print("Summary:", shop.summary())
    print("Search 'usb':", shop.search("usb"))
    print("Restock plan:", restock_plan(shop))

    item = shop.get("Z999")
    if item is not None:
        print(item.value)
    else:
        print("Z999 not found")


if __name__ == "__main__":
    main()`,
    explain: [
      ["from __future__ import annotations", "Lets hints refer to classes defined later in the file and keeps hints from costing anything at runtime."],
      ["self._items: dict[str, Item] = {}", "Annotating an empty container tells mypy what will go in it later."],
      ["def get(self, sku: str) -> Item | None:", "The return type warns every caller that the result might be None."],
      ["if item is not None:", "This check is what mypy wants to see before you use <code>item.value</code>. Remove it and run mypy."],
      ["Raises: in the docstring", "Hints can't describe exceptions, so the docstring does."]
    ],
    stretch: ["Run <code>mypy --strict day51_inventory.py</code> and fix anything it reports.", "Add type hints to your Day 40 finance app's <code>finance.py</code>."]
  },
  tests: ["<code>pip install mypy</code> and run <code>mypy day51_inventory.py</code>: expect \"Success\".", "Change <code>shop.sell(\"C300\", 3)</code> to <code>shop.sell(\"C300\", \"3\")</code> and run mypy again before running Python.", "Delete the None check around <code>item.value</code> and see mypy's warning."]
};

L[52] = {
  intro: "Automated tests check your code for you, every time you change it. Today you learn <code>pytest</code>, the most popular Python testing tool, and test code from earlier days.",
  lesson: [
    {h: "Why automated tests",
     p: "So far you tested by running programs and typing input. That's slow and easy to forget. A test is a small function that calls your code and <b>asserts</b> the result. Run hundreds in a second, every time you change something, and know immediately if you broke anything."},
    {h: "Your first test",
     p: "Install with <code>pip install pytest</code> in your venv. Put tests in files named <code>test_*.py</code>, in functions named <code>test_*</code>. Use a plain <code>assert</code>. Run <code>pytest</code> in the folder; it finds and runs them all.",
     code: R`# test_maths.py
def add(a, b):
    return a + b

def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -1) == -2`,
     out: "$ pytest\n====== 2 passed in 0.01s ======"},
    {h: "Testing errors and floats",
     p: "<code>pytest.raises</code> checks that code raises the right error. <code>pytest.approx</code> compares floats safely.",
     code: R`import pytest

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0

def test_float():
    assert 0.1 + 0.2 == pytest.approx(0.3)`},
    {h: "Parametrize and fixtures",
     p: "<code>@pytest.mark.parametrize</code> runs one test with many inputs. A <b>fixture</b> is a function that prepares something a test needs; tests receive it by naming it as a parameter. The built-in <code>tmp_path</code> fixture gives each test its own empty temporary folder.",
     code: R`@pytest.mark.parametrize("year, expected", [(2024, True), (1900, False), (2000, True)])
def test_leap(year, expected):
    assert is_leap(year) == expected

def test_save(tmp_path):
    file = tmp_path / "data.json"
    save({"a": 1}, file)
    assert file.exists()`},
    {h: "What to test",
     p: "Test normal cases, edge cases (empty, zero, one item, boundaries like exactly 18) and error cases. Code that separates logic from <code>input()</code>/<code>print()</code>, as you've done since Day 34, is easy to test. Code that mixes them is hard. That's one of the main reasons for the separation."}
  ],
  exercises: [
    {q: "Write tests for <code>is_even(n)</code> from Day 21, including 0 and a negative number.", sol: R`def test_is_even():
    assert is_even(4)
    assert not is_even(7)
    assert is_even(0)
    assert is_even(-2)`},
    {q: "Use parametrize to test your BMI category function from Day 6 at each boundary.", sol: R`@pytest.mark.parametrize("bmi, category", [
    (18.4, "underweight"), (18.5, "a healthy weight"),
    (24.9, "a healthy weight"), (25, "overweight"), (30, "obese"),
])
def test_category(bmi, category):
    assert bmi_category(bmi) == category`}
  ],
  project: {
    title: "Test suite for earlier projects",
    brief: "Write a pytest suite for code you already built: the dice parser from Day 26, the Fraction class from Day 43, the Book class from Day 42 (using fixed dates) and the finance calculations from Day 40. For a self-contained project, the code under test is collected in <code>earlier.py</code>. Run <code>pytest -v</code> until everything passes.",
    file: "day52_tests/",
    files: [
      ["earlier.py", R`"""Code from earlier days, collected here so it can be tested."""

import math
from datetime import date, timedelta


# Day 26
def parse_dice(notation):
    notation = notation.lower().replace(" ", "")
    bonus = 0
    if "+" in notation:
        notation, bonus_text = notation.split("+")
        bonus = int(bonus_text)
    count_text, sides_text = notation.split("d")
    count = int(count_text) if count_text else 1
    return count, int(sides_text), bonus


# Day 43
class Fraction:
    def __init__(self, numerator, denominator=1):
        if denominator == 0:
            raise ZeroDivisionError("Denominator can't be zero")
        if denominator < 0:
            numerator, denominator = -numerator, -denominator
        common = math.gcd(numerator, denominator)
        self.num = numerator // common
        self.den = denominator // common

    def __add__(self, other):
        return Fraction(self.num * other.den + other.num * self.den, self.den * other.den)

    def __eq__(self, other):
        return isinstance(other, Fraction) and (self.num, self.den) == (other.num, other.den)


# Day 42
class Book:
    loan_days = 14
    fee_per_day = 0.25

    def __init__(self, title, author):
        self.title, self.author = title, author
        self.borrower, self.due = None, None

    def borrow(self, person, today):
        if self.borrower is not None:
            return False
        self.borrower, self.due = person, today + timedelta(days=Book.loan_days)
        return True

    def late_fee(self, today):
        if self.due is None or today <= self.due:
            return 0.0
        return (today - self.due).days * Book.fee_per_day


# Day 40
def summary(transactions):
    income = sum(t["amount"] for t in transactions if t["type"] == "income")
    spending = sum(t["amount"] for t in transactions if t["type"] == "expense")
    return income, spending, income - spending


def spending_by_category(transactions):
    totals = {}
    for t in transactions:
        if t["type"] == "expense":
            totals[t["category"]] = totals.get(t["category"], 0) + t["amount"]
    return totals`],
      ["test_earlier.py", R`"""Tests for earlier.py. Run with: pytest -v"""

from datetime import date

import pytest

from earlier import Book, Fraction, parse_dice, spending_by_category, summary


# ----- dice parser -----

@pytest.mark.parametrize("notation, expected", [
    ("2d6", (2, 6, 0)),
    ("d20", (1, 20, 0)),
    ("3d8+4", (3, 8, 4)),
    (" 1D4 + 1 ", (1, 4, 1)),
])
def test_parse_dice(notation, expected):
    assert parse_dice(notation) == expected


def test_parse_dice_rejects_nonsense():
    with pytest.raises(ValueError):
        parse_dice("abc")


# ----- Fraction -----

def test_fraction_is_reduced():
    f = Fraction(6, 8)
    assert (f.num, f.den) == (3, 4)


def test_fraction_sign_moves_to_numerator():
    f = Fraction(1, -2)
    assert (f.num, f.den) == (-1, 2)


def test_fraction_addition():
    assert Fraction(1, 2) + Fraction(1, 3) == Fraction(5, 6)


def test_fraction_zero_denominator():
    with pytest.raises(ZeroDivisionError):
        Fraction(1, 0)


# ----- Book -----

@pytest.fixture
def book():
    return Book("Dune", "Frank Herbert")


def test_borrow_sets_due_date(book):
    assert book.borrow("Amina", today=date(2026, 1, 1))
    assert book.due == date(2026, 1, 15)


def test_cannot_borrow_twice(book):
    book.borrow("Amina", today=date(2026, 1, 1))
    assert not book.borrow("Omar", today=date(2026, 1, 2))


@pytest.mark.parametrize("returned, fee", [
    (date(2026, 1, 10), 0.0),     # early
    (date(2026, 1, 15), 0.0),     # exactly on the due date
    (date(2026, 1, 16), 0.25),    # one day late
    (date(2026, 1, 25), 2.50),    # ten days late
])
def test_late_fee(book, returned, fee):
    book.borrow("Amina", today=date(2026, 1, 1))
    assert book.late_fee(returned) == pytest.approx(fee)


# ----- finance -----

@pytest.fixture
def transactions():
    return [
        {"type": "income", "category": "salary", "amount": 1000.0},
        {"type": "expense", "category": "food", "amount": 120.5},
        {"type": "expense", "category": "food", "amount": 30.0},
        {"type": "expense", "category": "bus", "amount": 25.0},
    ]


def test_summary(transactions):
    assert summary(transactions) == pytest.approx((1000.0, 175.5, 824.5))


def test_summary_empty():
    assert summary([]) == (0, 0, 0)


def test_spending_by_category(transactions):
    assert spending_by_category(transactions) == {"food": 150.5, "bus": 25.0}`]
    ],
    explain: [
      ["@pytest.mark.parametrize(\"notation, expected\", [...])", "One test function, four test cases. Each appears separately in the report, so you see exactly which input failed."],
      ["with pytest.raises(ValueError):", "The test passes only if the block raises that error. Testing failures matters as much as testing successes."],
      ["@pytest.fixture def book():", "Every test that names <code>book</code> as a parameter gets a <b>fresh</b> Book, so tests can't affect each other."],
      ["book.borrow(\"Amina\", today=date(2026, 1, 1))", "This is why Day 42's methods accepted <code>today</code>: tests can use fixed dates and get the same result on any day."],
      ["(date(2026, 1, 15), 0.0)  # exactly on the due date", "Boundary cases are where bugs hide. Each one gets its own row."]
    ],
    out: "$ pytest -v\ntest_earlier.py::test_parse_dice[2d6-expected0] PASSED\n...\ntest_earlier.py::test_spending_by_category PASSED\n====== 18 passed in 0.05s ======",
    stretch: ["Change <code>late_fee</code> to use <code>&lt;</code> instead of <code>&lt;=</code> and watch which test catches the bug.", "Install <code>pytest-cov</code> and run <code>pytest --cov=earlier</code> to see which lines your tests never reach."]
  },
  tests: ["<code>pytest -v</code> shows 18 passed.", "Break one function on purpose and read pytest's failure report: it shows the values on both sides of the failed assert.", "Run a single test with <code>pytest -k late_fee</code>."]
};

L[53] = {
  intro: "Test-driven development (TDD) flips the order: write a failing test first, then write just enough code to pass it. It's a powerful way to design code in small, confident steps.",
  lesson: [
    {h: "Red, green, refactor",
     p: "<b>Red:</b> write one small test for behaviour that doesn't exist yet, and watch it fail. <b>Green:</b> write the simplest code that makes it pass. <b>Refactor:</b> tidy the code while all tests stay green. Repeat with the next small behaviour."},
    {h: "Why it helps",
     p: "Writing the test first forces you to decide what the function should do, and what its inputs and outputs are, before worrying about how. You build up a full test suite as a side effect, and every change is small enough to understand."},
    {h: "A tiny example",
     p: "Suppose we want <code>fizzbuzz(n)</code>. Start with the simplest case only.",
     code: R`# Step 1 (red): the test fails because fizzbuzz doesn't exist
def test_plain_number():
    assert fizzbuzz(1) == "1"

# Step 2 (green): the simplest thing that passes
def fizzbuzz(n):
    return str(n)

# Step 3 (red again): the next behaviour
def test_multiple_of_three():
    assert fizzbuzz(3) == "Fizz"

# Step 4 (green)
def fizzbuzz(n):
    if n % 3 == 0:
        return "Fizz"
    return str(n)`},
    {h: "Keep steps small",
     p: "If you can't make a test pass in a few minutes, the step is too big: write a smaller test. Run the whole suite after every change. The feeling of always being one small step from working code is the point."}
  ],
  exercises: [
    {q: "Finish FizzBuzz with TDD: add tests for 5 (\"Buzz\") and 15 (\"FizzBuzz\"), one at a time, making each pass before the next.", sol: R`def test_multiple_of_five():
    assert fizzbuzz(5) == "Buzz"

def test_multiple_of_both():
    assert fizzbuzz(15) == "FizzBuzz"

def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)`},
    {q: "Write only the tests (no code yet) for <code>word_count(text)</code>: empty string, one word, extra spaces, and punctuation.", sol: R`def test_empty():
    assert word_count("") == 0

def test_one_word():
    assert word_count("hello") == 1

def test_extra_spaces():
    assert word_count("  hello   world ") == 2

def test_punctuation_only_is_not_a_word():
    assert word_count("hi - there") == 2`}
  ],
  project: {
    title: "Password validator built test-first",
    brief: "Build a <code>validate_password</code> function strictly test-first. It returns a list of problems (empty means valid). Follow the cycle below: write one test, run <code>pytest</code> and see red, write code until green, tidy up, and move to the next rule. The final versions of both files are shown, with the tests in the order you write them.",
    file: "day53_tdd/",
    files: [
      ["test_password.py", R`"""Tests written one at a time, in this order, before the code."""

import pytest

from password import validate_password, is_valid

GOOD = "Sunrise#2026"


# Cycle 1: a good password has no problems
def test_good_password_has_no_problems():
    assert validate_password(GOOD) == []


# Cycle 2: minimum length
def test_too_short():
    assert "at least 10 characters" in validate_password("Ab#1")


# Cycle 3-5: character types
@pytest.mark.parametrize("password, problem", [
    ("sunrise#2026", "an uppercase letter"),
    ("SUNRISE#2026", "a lowercase letter"),
    ("Sunrise#abcd", "a digit"),
    ("Sunrise12026", "a symbol"),
])
def test_missing_character_types(password, problem):
    assert problem in validate_password(password)


# Cycle 6: no spaces
def test_no_spaces():
    assert "no spaces" in validate_password("Sun rise#2026")


# Cycle 7: common passwords are rejected, whatever the case
@pytest.mark.parametrize("password", ["Password123!", "PASSWORD123!x", "Qwerty12345!"])
def test_common_passwords(password):
    assert "not a common password" in validate_password(password)


# Cycle 8: not based on the username
def test_not_containing_username():
    assert "not contain your username" in validate_password("Amina#2026xyz", username="amina")


def test_username_check_is_optional():
    assert validate_password("Amina#2026xyz") == []


# Cycle 9: several problems are all reported
def test_reports_every_problem():
    assert len(validate_password("abc")) == 4


# Cycle 10: convenience wrapper
def test_is_valid():
    assert is_valid(GOOD)
    assert not is_valid("abc")`],
      ["password.py", R`"""Password rules, written to make test_password.py pass."""

import string

MIN_LENGTH = 10
COMMON = {"password", "qwerty", "letmein", "welcome", "admin", "iloveyou"}

RULES = [
    (str.isupper, "an uppercase letter"),
    (str.islower, "a lowercase letter"),
    (str.isdigit, "a digit"),
    (lambda ch: ch in string.punctuation, "a symbol"),
]


def validate_password(password: str, username: str | None = None) -> list[str]:
    """Return a list of problems with the password. Empty means it's valid."""
    problems = []

    if len(password) < MIN_LENGTH:
        problems.append(f"at least {MIN_LENGTH} characters")

    for check, description in RULES:
        if not any(check(ch) for ch in password):
            problems.append(description)

    if " " in password:
        problems.append("no spaces")

    lowered = password.lower()
    if any(word in lowered for word in COMMON):
        problems.append("not a common password")

    if username and username.lower() in lowered:
        problems.append("not contain your username")

    return problems


def is_valid(password: str, username: str | None = None) -> bool:
    return not validate_password(password, username)


if __name__ == "__main__":
    pw = input("Choose a password: ")
    problems = validate_password(pw)
    if problems:
        print("It needs: " + "; ".join(problems))
    else:
        print("Strong password!")`]
    ],
    explain: [
      ["Cycle 1: test_good_password_has_no_problems", "The very first green step can be <code>return []</code>. It feels silly, but it sets up the file, imports and function signature."],
      ["Cycle 2: test_too_short", "Now <code>return []</code> fails, so you add the length check. Each test forces one small piece of real logic."],
      ["RULES = [(str.isupper, ...), ...]", "This list appeared during a <b>refactor</b> step: after writing four nearly identical <code>if</code> blocks for cycles 3 to 5, you tidy them into data while the tests stay green."],
      ["test_reports_every_problem", "\"abc\" is too short and lacks uppercase, digit and symbol: 4 problems. A test like this protects you from accidentally stopping at the first problem."],
      ["username: str | None = None", "Cycle 8 added a parameter. Because it has a default, the earlier tests didn't need to change."]
    ],
    stretch: ["Add a rule (test first!) that rejects three identical characters in a row.", "Add a strength score from 0 to 100, driven by tests."]
  },
  tests: ["Really do it test-first: delete <code>password.py</code>, and write it again one cycle at a time.", "<code>pytest -v</code> should show 14 passed.", "After each cycle, commit with a message like \"Cycle 3: uppercase rule\"."]
};

L[54] = {
  intro: "Today you level up your debugging with VS Code's debugger, and replace scattered <code>print</code> calls with the <code>logging</code> module.",
  lesson: [
    {h: "The debugger",
     p: "Click in the gutter left of a line number to set a <b>breakpoint</b> (a red dot). Press <b>F5</b> and choose \"Python File\". The program pauses at the breakpoint and you can see every variable. <b>F10</b> steps over a line, <b>F11</b> steps into a function call, <b>Shift+F11</b> steps out, and F5 continues. The <b>Debug Console</b> lets you run any expression in the paused program."},
    {h: "breakpoint() and pdb",
     p: "Calling <code>breakpoint()</code> anywhere in your code pauses it in the terminal debugger, pdb. Type <code>p name</code> to print a variable, <code>n</code> for the next line, <code>s</code> to step in, <code>c</code> to continue and <code>q</code> to quit. It works even without VS Code, for example on a server."},
    {h: "Why logging instead of print",
     p: "<code>print</code> debugging has to be deleted afterwards and can't be switched on or off. <code>logging</code> messages have <b>levels</b> (DEBUG, INFO, WARNING, ERROR, CRITICAL), include timestamps and source, and can go to the screen, a file or both. You choose how much detail to see without changing code.",
     code: R`import logging

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)-8s %(name)s: %(message)s")
log = logging.getLogger(__name__)

log.debug("Hidden at INFO level")
log.info("Starting")
log.warning("Disk almost full")
log.error("Could not open file")`},
    {h: "Good logging habits",
     p: "Create one logger per module with <code>logging.getLogger(__name__)</code>. Use <code>log.exception(\"...\")</code> inside an <code>except</code> block to log the full traceback. Pass values as arguments, <code>log.info(\"Moved %s\", name)</code>, rather than building f-strings, so the text is only built if the message is shown. Configure logging once, in <code>main()</code>, not in library modules."}
  ],
  exercises: [
    {q: "Set a breakpoint inside the loop of your Day 36 bubble sort and watch the list change step by step in the debugger.", sol: R`# No code: use F5, then F10 repeatedly, and watch the Variables panel.`},
    {q: "Configure logging to write to <code>app.log</code> and also show warnings on screen.", sol: R`import logging

file_handler = logging.FileHandler("app.log", encoding="utf-8")
file_handler.setLevel(logging.DEBUG)
screen_handler = logging.StreamHandler()
screen_handler.setLevel(logging.WARNING)
logging.basicConfig(level=logging.DEBUG, handlers=[file_handler, screen_handler])`},
    {q: "Log a ZeroDivisionError with its traceback.", sol: R`try:
    1 / 0
except ZeroDivisionError:
    logging.exception("Calculation failed")`}
  ],
  project: {
    title: "Add logging to the folder organiser",
    brief: "Upgrade the Day 30 organiser: replace prints with logging, write a detailed log file for every run, add a <code>--verbose</code> flag for DEBUG output on screen, and log failures with tracebacks while carrying on with the other files. Command-line flags use <code>argparse</code> from the standard library.",
    file: "day54_organiser_logging.py",
    code: R`# day54_organiser_logging.py
# The Day 30 organiser with logging and command-line options.

import argparse
import logging
from pathlib import Path

log = logging.getLogger("organiser")

CATEGORIES = {
    "Images": {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"},
    "Documents": {".pdf", ".docx", ".doc", ".txt", ".md", ".pptx", ".xlsx", ".csv"},
    "Audio": {".mp3", ".wav", ".m4a"},
    "Video": {".mp4", ".mov", ".mkv"},
    "Archives": {".zip", ".rar", ".7z", ".tar", ".gz"},
    "Code": {".py", ".js", ".html", ".css", ".ipynb", ".json"},
}


def setup_logging(verbose, log_file):
    screen = logging.StreamHandler()
    screen.setLevel(logging.DEBUG if verbose else logging.INFO)
    screen.setFormatter(logging.Formatter("%(levelname)-7s %(message)s"))

    file = logging.FileHandler(log_file, encoding="utf-8")
    file.setLevel(logging.DEBUG)
    file.setFormatter(logging.Formatter("%(asctime)s %(levelname)-7s %(message)s"))

    logging.basicConfig(level=logging.DEBUG, handlers=[screen, file])


def category_for(path):
    suffix = path.suffix.lower()
    for name, suffixes in CATEGORIES.items():
        if suffix in suffixes:
            return name
    return "Other"


def safe_target(folder, filename):
    target = folder / filename
    counter = 1
    while target.exists():
        target = folder / f"{Path(filename).stem} ({counter}){Path(filename).suffix}"
        counter += 1
    return target


def organise(folder, dry_run=True):
    moved = failed = skipped = 0
    for item in sorted(folder.iterdir()):
        if not item.is_file() or item.name.startswith("."):
            log.debug("Skipping %s", item.name)
            skipped += 1
            continue

        dest_folder = folder / category_for(item)
        target = safe_target(dest_folder, item.name)
        if target.name != item.name:
            log.warning("%s already exists in %s; renaming to %s",
                        item.name, dest_folder.name, target.name)

        if dry_run:
            log.info("Would move %s -> %s/", item.name, dest_folder.name)
            continue
        try:
            dest_folder.mkdir(exist_ok=True)
            item.rename(target)
            log.info("Moved %s -> %s/", item.name, dest_folder.name)
            moved += 1
        except OSError:
            log.exception("Failed to move %s", item.name)
            failed += 1

    log.info("Done: %d moved, %d failed, %d skipped", moved, failed, skipped)
    return moved, failed


def main():
    parser = argparse.ArgumentParser(description="Sort files into folders by type.")
    parser.add_argument("folder", nargs="?", default=str(Path.home() / "Downloads"))
    parser.add_argument("--apply", action="store_true", help="actually move files")
    parser.add_argument("-v", "--verbose", action="store_true", help="show debug output")
    args = parser.parse_args()

    folder = Path(args.folder).expanduser()
    setup_logging(args.verbose, Path(__file__).parent / "organiser.log")
    log.debug("Arguments: %s", args)

    if not folder.is_dir():
        log.error("%s is not a folder", folder)
        return
    if not args.apply:
        log.info("Dry run. Add --apply to move files.")
    organise(folder, dry_run=not args.apply)


if __name__ == "__main__":
    main()`,
    explain: [
      ["log = logging.getLogger(\"organiser\")", "A named logger. Messages show where they came from, and you can tune each module's level separately."],
      ["screen.setLevel(...) / file.setLevel(logging.DEBUG)", "Two handlers with different levels: the screen stays quiet unless <code>--verbose</code>, while the file always keeps every detail."],
      ["log.info(\"Moved %s -> %s/\", item.name, dest_folder.name)", "Values are passed separately; logging fills them in only if the message is actually shown."],
      ["except OSError: log.exception(...)", "Logs the full traceback to the file, counts the failure, and continues with the next file instead of stopping."],
      ["argparse.ArgumentParser", "Turns command-line text into <code>args.folder</code>, <code>args.apply</code> and <code>args.verbose</code>, and creates <code>--help</code> automatically."]
    ],
    stretch: ["Use <code>logging.handlers.RotatingFileHandler</code> so the log never grows beyond 1 MB.", "Add logging to your Day 40 finance app's storage module."]
  },
  tests: ["<code>python day54_organiser_logging.py --help</code>", "Run on a test folder without <code>--apply</code>, then with it, then with <code>-v</code>.", "Open <code>organiser.log</code> and read the timestamps.", "Set a breakpoint in <code>organise</code> and step through one file in the debugger."]
};

L[55] = {
  intro: "Git tracks every version of your code, and GitHub shares it. Today you learn the professional workflow: branches, commits, pull requests and merging. This is also when we set up your <code>python-100-days</code> repository.",
  lesson: [
    {h: "Core ideas",
     p: "A <b>repository</b> (repo) is a project folder whose history Git tracks. A <b>commit</b> is a saved snapshot with a message. The <b>staging area</b> is where you choose what goes into the next commit. A <b>branch</b> is a separate line of work. <b>origin</b> is the copy of your repo on GitHub."},
    {h: "Everyday commands",
     p: "Install Git from <b>git-scm.com</b>, then set your name and email once. <code>git status</code> is the command you'll run most: it tells you what changed and what to do next.",
     code: R`git config --global user.name "AbdyRahman"
git config --global user.email "you@example.com"

git init                      # start tracking this folder
git status                    # what changed?
git add notes.py              # stage a file
git commit -m "Add notes app" # save a snapshot
git log --oneline             # history`},
    {h: "Branches",
     p: "Never build new features directly on <code>main</code>. Create a branch, work there, and merge when it's done and tested. If the experiment fails, just delete the branch.",
     code: R`git switch -c feature/search   # create and move to a new branch
# ...edit, add, commit...
git switch main
git merge feature/search
git branch -d feature/search`},
    {h: "GitHub and pull requests",
     p: "Create an empty repository on github.com, connect it, and push. A <b>pull request</b> (PR) asks to merge a branch into main. It shows the changes for review and is where teams discuss code. Even working alone, PRs give you a clean history of features.",
     code: R`git remote add origin https://github.com/AbdyRahmann/python-100-days.git
git push -u origin main

git switch -c feature/tags
# ...work and commit...
git push -u origin feature/tags
# then open a pull request on github.com and merge it`},
    {h: "Good commit habits",
     p: "Commit small, working steps. Write messages in the imperative, saying what the commit does: \"Add search command\", not \"stuff\". Keep secrets, data files and <code>.venv</code> out of Git with <code>.gitignore</code>. Pull before you start work: <code>git pull</code>."}
  ],
  exercises: [
    {q: "Create a practice folder, run <code>git init</code>, commit a file, change it, and use <code>git diff</code> before committing again.", sol: R`mkdir git-practice && cd git-practice
git init
echo "print('v1')" > app.py
git add app.py
git commit -m "Add first version"
echo "print('v2')" > app.py
git diff
git commit -am "Update to v2"
git log --oneline`},
    {q: "Make a branch, change a file there, switch back to main and see the change disappear, then merge it.", sol: R`git switch -c experiment
echo "print('experiment')" >> app.py
git commit -am "Try an experiment"
git switch main
cat app.py          # no experiment line
git merge experiment
cat app.py          # now it's there`},
    {q: "Write a <code>.gitignore</code> for a Python project.", sol: R`.venv/
__pycache__/
*.pyc
.env
*.log
.pytest_cache/
.mypy_cache/`}
  ],
  project: {
    title: "Notes app developed on feature branches",
    brief: "Build a command-line notes app in three features, each on its own branch with its own pull request: (1) add and list notes, (2) search, (3) tags. The terminal steps show the workflow; the code is the finished app after all three merges. When you're ready to create the GitHub repository, tell me and we'll do it together.",
    file: "day55_notes/",
    files: [
      ["workflow (terminal)", R`# One-time setup
mkdir day55_notes && cd day55_notes
git init
printf ".venv/\n__pycache__/\nnotes.json\n" > .gitignore
git add .gitignore
git commit -m "Add .gitignore"

# Feature 1: add and list
git switch -c feature/add-list
# ...write add and list commands in notes.py...
git add notes.py
git commit -m "Add add and list commands"
git push -u origin feature/add-list     # open a PR on GitHub, review, merge
git switch main
git pull

# Feature 2: search
git switch -c feature/search
git commit -am "Add search command"
git push -u origin feature/search       # PR, merge, pull

# Feature 3: tags
git switch -c feature/tags
git commit -am "Add tags and filter by tag"
git push -u origin feature/tags         # PR, merge, pull

git log --oneline --graph`],
      ["notes.py", R`"""A command-line notes app.

Usage:
    python notes.py add "Buy milk" --tags shopping home
    python notes.py list [--tag shopping]
    python notes.py search milk
    python notes.py delete 3
"""

import argparse
import json
from datetime import datetime
from pathlib import Path

NOTES_FILE = Path(__file__).parent / "notes.json"


def load():
    if not NOTES_FILE.exists():
        return []
    return json.loads(NOTES_FILE.read_text(encoding="utf-8"))


def save(notes):
    NOTES_FILE.write_text(json.dumps(notes, indent=2), encoding="utf-8")


def next_id(notes):
    return max((n["id"] for n in notes), default=0) + 1


def show(notes):
    if not notes:
        print("No notes.")
    for n in notes:
        tags = " ".join(f"#{t}" for t in n["tags"])
        print(f"{n['id']:>3}  {n['created'][:16]}  {n['text']}  {tags}")


def cmd_add(args, notes):
    note = {"id": next_id(notes), "text": args.text,
            "tags": [t.lower() for t in args.tags],
            "created": datetime.now().isoformat(timespec="seconds")}
    notes.append(note)
    save(notes)
    print(f"Added note {note['id']}.")


def cmd_list(args, notes):
    if args.tag:
        notes = [n for n in notes if args.tag.lower() in n["tags"]]
    show(notes)


def cmd_search(args, notes):
    word = args.word.lower()
    show([n for n in notes if word in n["text"].lower()])


def cmd_delete(args, notes):
    remaining = [n for n in notes if n["id"] != args.id]
    if len(remaining) == len(notes):
        print(f"No note {args.id}.")
        return
    save(remaining)
    print(f"Deleted note {args.id}.")


def main():
    parser = argparse.ArgumentParser(description="Simple notes.")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("add")
    p.add_argument("text")
    p.add_argument("--tags", nargs="*", default=[])
    p.set_defaults(func=cmd_add)

    p = sub.add_parser("list")
    p.add_argument("--tag")
    p.set_defaults(func=cmd_list)

    p = sub.add_parser("search")
    p.add_argument("word")
    p.set_defaults(func=cmd_search)

    p = sub.add_parser("delete")
    p.add_argument("id", type=int)
    p.set_defaults(func=cmd_delete)

    args = parser.parse_args()
    args.func(args, load())


if __name__ == "__main__":
    main()`]
    ],
    explain: [
      ["git switch -c feature/add-list", "Each feature lives on its own branch until it works. <code>main</code> always holds working code."],
      ["notes.json in .gitignore", "Your personal notes are data, not code, so they stay out of the repository."],
      ["sub = parser.add_subparsers(...)", "argparse sub-commands give the app a <code>git</code>-like interface: <code>notes.py add</code>, <code>notes.py list</code>."],
      ["p.set_defaults(func=cmd_add)", "Each sub-command remembers which function handles it, so <code>main</code> just calls <code>args.func</code>. No if/elif chain."],
      ["max((n[\"id\"] for n in notes), default=0) + 1", "<code>default=0</code> handles the empty list, so the first note gets id 1."]
    ],
    stretch: ["Add an <code>edit</code> command on a new branch, using a pull request.", "Deliberately create a merge conflict: change the same line on two branches, merge, and resolve it."]
  },
  tests: ["<code>python notes.py add \"Learn git\" --tags study</code>, then <code>list</code>, <code>list --tag study</code>, <code>search git</code>, <code>delete 1</code>.", "<code>git log --oneline --graph</code> shows your three feature merges.", "Tell me when you want the GitHub repository created and we'll set it up together."]
};

L[56] = {
  intro: "Web APIs let your programs talk to services on the internet. Today you learn how HTTP works and use the <code>requests</code> library to fetch live weather data.",
  lesson: [
    {h: "HTTP in one minute",
     p: "Your program (the <b>client</b>) sends a <b>request</b> to a URL. The <b>server</b> sends back a <b>response</b> with a <b>status code</b> and a body. A <b>REST API</b> is a set of URLs that return data (usually JSON) instead of web pages. The main methods are GET (read), POST (create), PUT/PATCH (update) and DELETE."},
    {h: "Status codes",
     p: "2xx means success (200 OK, 201 Created). 3xx is a redirect. 4xx means you made a mistake (400 bad request, 401 not logged in, 404 not found, 429 too many requests). 5xx means the server failed."},
    {h: "requests",
     p: "Install with <code>pip install requests</code>. <code>requests.get(url, params=...)</code> builds the query string for you. Always set a <code>timeout</code> so a slow server can't freeze your program. <code>raise_for_status()</code> turns 4xx/5xx responses into exceptions. <code>.json()</code> parses the body.",
     code: R`import requests

response = requests.get(
    "https://api.open-meteo.com/v1/forecast",
    params={"latitude": 9.56, "longitude": 44.06, "current": "temperature_2m"},
    timeout=10,
)
response.raise_for_status()
data = response.json()
print(response.status_code, data["current"]["temperature_2m"])`},
    {h: "Read the documentation",
     p: "Every API documents its URLs, parameters and the shape of its JSON. Open-Meteo (<b>open-meteo.com</b>) is free and needs no account, which makes it perfect for learning. Print the JSON (or open the URL in a browser) and explore it before writing code."},
    {h: "Handle failures",
     p: "Networks fail. Catch <code>requests.RequestException</code> (the parent of timeouts, connection errors and HTTP errors) and show a helpful message. Your Day 49 <code>@retry</code> decorator fits here nicely."}
  ],
  exercises: [
    {q: "Open this URL in your browser and look at the JSON: <code>https://geocoding-api.open-meteo.com/v1/search?name=Nairobi&amp;count=1</code>", sol: R`# You'll see {"results": [{"name": "Nairobi", "latitude": -1.28, "longitude": 36.82,
#   "country": "Kenya", ...}], ...}`},
    {q: "Fetch the same URL with requests and print the country and coordinates.", sol: R`import requests
r = requests.get("https://geocoding-api.open-meteo.com/v1/search",
                 params={"name": "Nairobi", "count": 1}, timeout=10)
place = r.json()["results"][0]
print(place["country"], place["latitude"], place["longitude"])`},
    {q: "Request a city that doesn't exist. What does the JSON look like? How should your code handle it?", sol: R`# The "results" key is missing entirely, so use data.get("results") and check for None.`}
  ],
  project: {
    title: "Weather CLI using a free public API",
    brief: "Type a city name to get the current weather and a 5-day forecast. The program first converts the city to coordinates with Open-Meteo's geocoding API, then fetches the forecast. Network errors and unknown cities are handled cleanly. Needs <code>pip install requests</code>.",
    file: "day56_weather.py",
    code: R`# day56_weather.py
# Current weather and a 5-day forecast from Open-Meteo (no API key needed).

import requests

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

# WMO weather codes used by Open-Meteo (simplified)
WEATHER = {
    0: "clear sky", 1: "mainly clear", 2: "partly cloudy", 3: "overcast",
    45: "fog", 48: "fog", 51: "light drizzle", 53: "drizzle", 55: "heavy drizzle",
    61: "light rain", 63: "rain", 65: "heavy rain", 71: "light snow", 73: "snow",
    75: "heavy snow", 80: "rain showers", 81: "rain showers", 82: "violent showers",
    95: "thunderstorm", 96: "thunderstorm with hail", 99: "thunderstorm with hail",
}


class WeatherError(Exception):
    """Raised when weather data can't be fetched."""


def get_json(url, params):
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.Timeout:
        raise WeatherError("The weather service took too long to answer.")
    except requests.RequestException as error:
        raise WeatherError(f"Network problem: {error}")


def find_city(name):
    data = get_json(GEOCODE_URL, {"name": name, "count": 1, "language": "en"})
    results = data.get("results")
    if not results:
        raise WeatherError(f"No place called '{name}' was found.")
    place = results[0]
    return place["name"], place.get("country", ""), place["latitude"], place["longitude"]


def get_forecast(lat, lon, days=5):
    return get_json(FORECAST_URL, {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
        "timezone": "auto",
        "forecast_days": days,
    })


def describe(code):
    return WEATHER.get(code, f"code {code}")


def show(city, country, data):
    now = data["current"]
    units = data["current_units"]
    print(f"\n{city}, {country}")
    print(f"Now: {now['temperature_2m']}{units['temperature_2m']}, {describe(now['weather_code'])}, "
          f"humidity {now['relative_humidity_2m']}%, wind {now['wind_speed_10m']} {units['wind_speed_10m']}")

    daily = data["daily"]
    print(f"\n{'Day':<12}{'Weather':<22}{'Min':>6}{'Max':>6}{'Rain':>8}")
    rows = zip(daily["time"], daily["weather_code"], daily["temperature_2m_min"],
               daily["temperature_2m_max"], daily["precipitation_sum"])
    for day, code, low, high, rain in rows:
        print(f"{day:<12}{describe(code):<22}{low:>6.1f}{high:>6.1f}{rain:>6.1f}mm")


def main():
    while True:
        name = input("\nCity (blank to quit): ").strip()
        if not name:
            break
        try:
            city, country, lat, lon = find_city(name)
            show(city, country, get_forecast(lat, lon))
        except WeatherError as error:
            print(error)


if __name__ == "__main__":
    main()`,
    explain: [
      ["class WeatherError(Exception):", "A custom exception for this program. Low-level network errors are translated into one friendly error type the menu can catch."],
      ["requests.get(url, params=params, timeout=10)", "<code>params</code> builds the <code>?latitude=...&amp;longitude=...</code> part safely, and the timeout stops the program waiting forever."],
      ["results = data.get(\"results\")", "The geocoding API leaves out <code>results</code> entirely for unknown places. <code>.get</code> avoids a KeyError."],
      ["\"timezone\": \"auto\"", "Daily values are calculated in the city's own timezone, not yours."],
      ["zip(daily[\"time\"], daily[\"weather_code\"], ...)", "The API returns one list per field. <code>zip</code> turns them back into one row per day, the same trick as Day 25."]
    ],
    out: "City (blank to quit): Hargeisa\n\nHargeisa, Somalia\nNow: 24.3°C, partly cloudy, humidity 41%, wind 18.2 km/h\n\nDay         Weather                  Min   Max    Rain\n2026-10-24  partly cloudy           15.2  27.9   0.0mm\n...",
    stretch: ["Remember the last city in a JSON file and offer it as the default.", "Add the <code>@retry</code> decorator from Day 49 to <code>get_json</code>."]
  },
  tests: ["Try your own city and two others.", "Try a made-up city name.", "Turn off Wi-Fi and run it: you should get the network message, not a traceback."]
};

L[57] = {
  intro: "Real APIs need more care: query parameters, pagination, rate limits, caching, and API keys that must never appear in your code. Today you build a currency converter on a free exchange-rate API.",
  lesson: [
    {h: "Query parameters and endpoints",
     p: "An API usually has several <b>endpoints</b>: one URL for each kind of data, such as <code>/latest</code> for today's rates and <code>/currencies</code> for the list of codes. Parameters choose what you get. Always read the docs to learn the endpoints and their parameters."},
    {h: "API keys stay out of code",
     p: "Many APIs require a secret key. Never write it in your code or commit it to Git: anyone who sees the repo can use it. Store it in an <b>environment variable</b> and read it with <code>os.environ</code>. A <code>.env</code> file (listed in <code>.gitignore</code>) plus the <code>python-dotenv</code> package is a common way to load such variables.",
     code: R`import os

api_key = os.environ.get("WEATHER_API_KEY")
if api_key is None:
    raise SystemExit("Set the WEATHER_API_KEY environment variable first.")

headers = {"Authorization": f"Bearer {api_key}"}`},
    {h: "Pagination",
     p: "APIs that return many records send them in <b>pages</b>. You request page 1, then the next page, until there are no more. A generator (Day 48) is the perfect shape for this.",
     code: R`def all_items(url):
    page = 1
    while True:
        data = requests.get(url, params={"page": page}, timeout=10).json()
        if not data["items"]:
            return
        yield from data["items"]
        page += 1`},
    {h: "Be polite: rate limits and caching",
     p: "APIs limit how often you can call them; a 429 status means slow down. Don't request the same data repeatedly: cache it. Exchange rates change once a day, so saving them to a file with a timestamp and reusing them for a few hours is both faster and kinder to the service."},
    {h: "Sessions",
     p: "<code>requests.Session()</code> reuses one connection for many requests, which is faster, and lets you set headers once."}
  ],
  exercises: [
    {q: "Set an environment variable in your terminal and read it from Python.", sol: R`# macOS/Linux:  export MY_NAME="Abdy"
# PowerShell:   $env:MY_NAME="Abdy"
import os
print(os.environ.get("MY_NAME", "not set"))`},
    {q: "Open <code>https://api.frankfurter.dev/v1/latest?base=USD&amp;symbols=EUR,GBP</code> in your browser and describe the JSON.", sol: R`# {"amount": 1.0, "base": "USD", "date": "2026-10-23", "rates": {"EUR": 0.92, "GBP": 0.79}}`},
    {q: "Write a function that returns cached data if a JSON file is younger than one hour, otherwise None.", sol: R`import json, time
from pathlib import Path

def read_cache(path: Path, max_age=3600):
    if path.exists() and time.time() - path.stat().st_mtime < max_age:
        return json.loads(path.read_text())
    return None`}
  ],
  project: {
    title: "Currency converter",
    brief: "Convert between currencies using the free Frankfurter API (European Central Bank rates, no key needed). It lists supported currencies, caches rates for a few hours, uses a session with a timeout, and shows a conversion table. Needs <code>pip install requests</code>.",
    file: "day57_currency.py",
    code: R`# day57_currency.py
# Currency conversion with the Frankfurter API, with caching.

import json
import time
from pathlib import Path

import requests

API = "https://api.frankfurter.dev/v1"
CACHE_FILE = Path(__file__).parent / "rates_cache.json"
CACHE_HOURS = 6


class RatesClient:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers["User-Agent"] = "python-100-days currency converter"

    def _get(self, endpoint, **params):
        try:
            r = self.session.get(f"{API}/{endpoint}", params=params, timeout=10)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as error:
            raise ConnectionError(f"Could not reach the rates service: {error}") from error

    def currencies(self):
        return self._get("currencies")

    def latest(self, base):
        cache = self._read_cache()
        entry = cache.get(base)
        if entry and time.time() - entry["fetched"] < CACHE_HOURS * 3600:
            return entry["data"]

        data = self._get("latest", base=base)
        cache[base] = {"fetched": time.time(), "data": data}
        CACHE_FILE.write_text(json.dumps(cache, indent=2), encoding="utf-8")
        return data

    def _read_cache(self):
        try:
            return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        except (FileNotFoundError, json.JSONDecodeError):
            return {}


def convert(amount, base, target, client):
    if base == target:
        return amount, 1.0, None
    data = client.latest(base)
    rate = data["rates"].get(target)
    if rate is None:
        raise ValueError(f"No rate for {target}")
    return amount * rate, rate, data["date"]


def main():
    client = RatesClient()
    try:
        names = client.currencies()
    except ConnectionError as error:
        print(error)
        return

    print("Supported:", ", ".join(sorted(names)))
    while True:
        text = input("\nConvert (e.g. 100 USD EUR), or q: ").strip().upper()
        if text == "Q":
            break
        try:
            amount_text, base, target = text.split()
            amount = float(amount_text)
            if base not in names or target not in names:
                raise ValueError("Unknown currency code")
            result, rate, day = convert(amount, base, target, client)
        except ValueError as error:
            print("Please type: amount FROM TO, e.g. 50 GBP JPY.", error)
            continue
        except ConnectionError as error:
            print(error)
            continue

        print(f"{amount:,.2f} {names[base]} = {result:,.2f} {names[target]}")
        print(f"Rate 1 {base} = {rate:.4f} {target}" + (f" (ECB rate for {day})" if day else ""))

        print(f"\n{base:>10} {target:>12}")
        for x in (1, 5, 10, 50, 100, 500, 1000):
            print(f"{x:>10,} {x * rate:>12,.2f}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["self.session = requests.Session()", "One session reuses the connection for every call and carries the User-Agent header, which identifies your program politely."],
      ["def _get(self, endpoint, **params):", "All network access goes through one method, so errors are handled in exactly one place."],
      ["raise ConnectionError(...) from error", "<code>from error</code> keeps the original exception attached, so the full cause appears when debugging."],
      ["if entry and time.time() - entry[\"fetched\"] < CACHE_HOURS * 3600:", "Rates are reused for 6 hours. Most conversions then need no network call at all."],
      ["rates_cache.json", "Generated data. Add it to <code>.gitignore</code>."]
    ],
    stretch: ["Use the <code>/{date}</code> endpoint (e.g. <code>/2025-01-02</code>) to compare today's rate with a year ago.", "Add a <code>--offline</code> option that only uses the cache."]
  },
  tests: ["Convert <code>100 USD EUR</code> twice: the second time should be instant (cached).", "Try <code>100 USD XYZ</code> and <code>hundred USD EUR</code>.", "Delete the cache file and run again.", "Disconnect from the internet and check the error message."]
};

L[58] = {
  intro: "Databases store data safely and let you ask complex questions about it. Today you learn SQL, the language of relational databases, using SQLite, which is built into Python.",
  lesson: [
    {h: "Tables, rows and columns",
     p: "A relational database stores data in <b>tables</b>, like spreadsheets with strict columns. Each row is a record. A <b>primary key</b> uniquely identifies each row. A <b>foreign key</b> in one table points to a row in another, which is how tables relate."},
    {h: "SQLite in Python",
     p: "SQLite keeps a whole database in a single file, and the <code>sqlite3</code> module ships with Python. Connect, run SQL with <code>execute</code>, and <code>commit</code> changes.",
     code: R`import sqlite3

conn = sqlite3.connect("shop.db")
conn.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL
    )
""")
conn.execute("INSERT INTO products (name, price) VALUES (?, ?)", ("Tea", 4.5))
conn.commit()`},
    {h: "SELECT",
     p: "<code>SELECT</code> asks questions. <code>WHERE</code> filters rows, <code>ORDER BY</code> sorts, <code>LIMIT</code> keeps the first few. <code>COUNT</code>, <code>SUM</code>, <code>AVG</code>, <code>MIN</code> and <code>MAX</code> summarise, and <code>GROUP BY</code> summarises per group.",
     code: R`SELECT name, price FROM products WHERE price < 10 ORDER BY price DESC LIMIT 5;
SELECT category, COUNT(*), AVG(price) FROM products GROUP BY category;`},
    {h: "JOIN",
     p: "<code>JOIN</code> combines rows from related tables using the keys. This is the core power of relational databases.",
     code: R`SELECT movies.title, directors.name
FROM movies
JOIN directors ON movies.director_id = directors.id
WHERE directors.name = 'Christopher Nolan';`},
    {h: "Always use placeholders",
     p: "Never put user input into SQL with f-strings. Someone could type SQL code and change your query: this is called <b>SQL injection</b>, one of the most common security bugs. Use <code>?</code> placeholders and pass values separately; sqlite3 handles them safely.",
     code: R`# WRONG: f"SELECT * FROM users WHERE name = '{name}'"
rows = conn.execute("SELECT * FROM users WHERE name = ?", (name,)).fetchall()`}
  ],
  exercises: [
    {q: "Create a <code>students</code> table with id, name and score, insert three rows with <code>executemany</code>, and select those with a score above 70.", sol: R`conn = sqlite3.connect(":memory:")   # a temporary in-memory database
conn.execute("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, score INTEGER)")
conn.executemany("INSERT INTO students (name, score) VALUES (?, ?)",
                 [("Amina", 88), ("Omar", 64), ("Sara", 91)])
print(conn.execute("SELECT name FROM students WHERE score > 70").fetchall())`},
    {q: "Get the average score and the best student with SQL.", sol: R`print(conn.execute("SELECT AVG(score) FROM students").fetchone()[0])
print(conn.execute("SELECT name FROM students ORDER BY score DESC LIMIT 1").fetchone()[0])`},
    {q: "Explain why this is dangerous: <code>conn.execute(f\"DELETE FROM students WHERE name = '{name}'\")</code> if <code>name</code> is <code>x' OR '1'='1</code>.", sol: R`# The query becomes: DELETE FROM students WHERE name = 'x' OR '1'='1'
# '1'='1' is always true, so every student is deleted. Use ? placeholders.`}
  ],
  project: {
    title: "Movie database explorer",
    brief: "Create a small movie database with three related tables (directors, movies, ratings), fill it with sample data, then answer interesting questions with SQL: joins, grouping, and searches typed by the user (safely, with placeholders).",
    file: "day58_movies.py",
    code: R`# day58_movies.py
# Explores a movie database with SQL.

import sqlite3
from pathlib import Path

DB_FILE = Path(__file__).parent / "movies.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS directors (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    country TEXT
);
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER,
    genre TEXT,
    director_id INTEGER REFERENCES directors(id)
);
CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id),
    reviewer TEXT,
    stars INTEGER CHECK (stars BETWEEN 1 AND 5)
);
"""

DIRECTORS = [("Christopher Nolan", "UK"), ("Hayao Miyazaki", "Japan"),
             ("Greta Gerwig", "USA"), ("Bong Joon-ho", "South Korea")]
MOVIES = [("Inception", 2010, "sci-fi", 1), ("Interstellar", 2014, "sci-fi", 1),
          ("Oppenheimer", 2023, "drama", 1), ("Spirited Away", 2001, "animation", 2),
          ("My Neighbor Totoro", 1988, "animation", 2), ("Little Women", 2019, "drama", 3),
          ("Barbie", 2023, "comedy", 3), ("Parasite", 2019, "thriller", 4)]
RATINGS = [(1, "amina", 5), (1, "omar", 4), (2, "amina", 5), (2, "sara", 4), (3, "omar", 4),
           (4, "sara", 5), (4, "amina", 5), (5, "omar", 4), (6, "sara", 4), (7, "omar", 3),
           (7, "amina", 4), (8, "sara", 5), (8, "omar", 5), (8, "amina", 5)]


def connect():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row          # access columns by name
    conn.executescript(SCHEMA)
    if conn.execute("SELECT COUNT(*) FROM movies").fetchone()[0] == 0:
        with conn:                           # a transaction: all or nothing
            conn.executemany("INSERT INTO directors (name, country) VALUES (?, ?)", DIRECTORS)
            conn.executemany("INSERT INTO movies (title, year, genre, director_id) VALUES (?, ?, ?, ?)", MOVIES)
            conn.executemany("INSERT INTO ratings (movie_id, reviewer, stars) VALUES (?, ?, ?)", RATINGS)
    return conn


QUERIES = {
    "1": ("Top rated movies", """
        SELECT m.title, d.name AS director, ROUND(AVG(r.stars), 2) AS avg_stars, COUNT(r.id) AS votes
        FROM movies m
        JOIN directors d ON m.director_id = d.id
        LEFT JOIN ratings r ON r.movie_id = m.id
        GROUP BY m.id
        ORDER BY avg_stars DESC, votes DESC
    """),
    "2": ("Movies per genre", """
        SELECT genre, COUNT(*) AS movies, MIN(year) AS earliest, MAX(year) AS latest
        FROM movies GROUP BY genre ORDER BY movies DESC
    """),
    "3": ("Directors' averages", """
        SELECT d.name, d.country, COUNT(DISTINCT m.id) AS movies, ROUND(AVG(r.stars), 2) AS avg_stars
        FROM directors d
        JOIN movies m ON m.director_id = d.id
        JOIN ratings r ON r.movie_id = m.id
        GROUP BY d.id ORDER BY avg_stars DESC
    """),
}


def print_rows(rows):
    if not rows:
        print("No results.")
        return
    columns = rows[0].keys()
    print("  ".join(f"{c:<20}" for c in columns))
    for row in rows:
        print("  ".join(f"{str(row[c]):<20}" for c in columns))


def main():
    conn = connect()
    while True:
        print()
        for key, (label, _) in QUERIES.items():
            print(f"{key}) {label}")
        print("4) Search titles  5) Movies from a year range  q) Quit")
        choice = input("Choose: ").strip().lower()

        if choice in QUERIES:
            print_rows(conn.execute(QUERIES[choice][1]).fetchall())
        elif choice == "4":
            text = input("Title contains: ")
            print_rows(conn.execute(
                "SELECT title, year, genre FROM movies WHERE title LIKE ? ORDER BY year",
                (f"%{text}%",)).fetchall())
        elif choice == "5":
            try:
                start, end = int(input("From year: ")), int(input("To year: "))
            except ValueError:
                print("Years must be numbers.")
                continue
            print_rows(conn.execute(
                "SELECT title, year FROM movies WHERE year BETWEEN ? AND ? ORDER BY year",
                (start, end)).fetchall())
        elif choice == "q":
            break
    conn.close()


if __name__ == "__main__":
    main()`,
    explain: [
      ["REFERENCES directors(id)", "A foreign key: each movie points to its director's row. That's what JOINs follow."],
      ["CHECK (stars BETWEEN 1 AND 5)", "The database itself refuses invalid ratings, whatever code inserts them."],
      ["conn.row_factory = sqlite3.Row", "Rows behave like dicts, so you can write <code>row[\"title\"]</code> and get column names with <code>keys()</code>."],
      ["with conn:", "A transaction: if any insert fails, all of them are undone, so the database is never half-filled."],
      ["WHERE title LIKE ?  with (f\"%{text}%\",)", "The <code>%</code> wildcards are part of the value, not the SQL, so the search is still injection-safe."]
    ],
    stretch: ["Add a menu option to rate a movie, inserting into <code>ratings</code>.", "Install \"DB Browser for SQLite\" and open <code>movies.db</code> to explore it visually."]
  },
  tests: ["Run every menu option.", "Search for <code>' OR 1=1 --</code>: it should simply find nothing.", "Delete <code>movies.db</code> and run again; the sample data is recreated."]
};

L[59] = {
  intro: "Today you build a full CRUD application (Create, Read, Update, Delete) on SQLite, with the database code separated into a class so the rest of the program never writes SQL.",
  lesson: [
    {h: "CRUD in SQL",
     p: "<b>Create</b> is <code>INSERT</code>, <b>Read</b> is <code>SELECT</code>, <b>Update</b> is <code>UPDATE ... SET ... WHERE</code>, and <b>Delete</b> is <code>DELETE ... WHERE</code>. Forgetting the <code>WHERE</code> on UPDATE or DELETE changes every row, so always double-check it.",
     code: R`conn.execute("UPDATE habits SET name = ? WHERE id = ?", ("Read 20 pages", 3))
conn.execute("DELETE FROM habits WHERE id = ?", (3,))
cursor = conn.execute("INSERT INTO habits (name) VALUES (?)", ("Walk",))
print(cursor.lastrowid)    # the new row's id`},
    {h: "Schema design",
     p: "Store each fact once. A habit tracker has <code>habits</code> (one row per habit) and <code>check_ins</code> (one row per habit per day). A <code>UNIQUE(habit_id, day)</code> constraint stops double check-ins, and <code>ON DELETE CASCADE</code> removes a habit's check-ins when the habit is deleted."},
    {h: "The repository pattern",
     p: "Put all SQL in one class, often called a <b>repository</b>, with methods like <code>add_habit</code> and <code>check_in</code>. The rest of the program calls those methods. You can change the database later, or test with an in-memory database (<code>\":memory:\"</code>), without touching anything else."},
    {h: "Foreign keys in SQLite",
     p: "SQLite only enforces foreign keys after <code>PRAGMA foreign_keys = ON</code>, which must be run on each new connection. It's an easy step to forget."}
  ],
  exercises: [
    {q: "Write the SQL to rename habit 2 to \"Meditate\".", sol: R`UPDATE habits SET name = 'Meditate' WHERE id = 2;`},
    {q: "Write a query counting check-ins per habit, including habits with none.", sol: R`SELECT h.name, COUNT(c.id)
FROM habits h LEFT JOIN check_ins c ON c.habit_id = h.id
GROUP BY h.id;`},
    {q: "What happens if you run <code>DELETE FROM habits</code> without a WHERE?", sol: R`# Every habit is deleted (and with ON DELETE CASCADE, every check-in too).`}
  ],
  project: {
    title: "Habit tracker on SQLite",
    brief: "Track daily habits: create, rename and delete habits, check in for today, and see each habit's current streak and last-7-days grid. All SQL lives in a <code>HabitRepository</code> class; the menu code never sees SQL.",
    file: "day59_habits.py",
    code: R`# day59_habits.py
# A habit tracker with all SQL inside a repository class.

import sqlite3
from datetime import date, timedelta
from pathlib import Path

DB_FILE = Path(__file__).parent / "habits.db"


class HabitRepository:
    def __init__(self, path=DB_FILE):
        self.conn = sqlite3.connect(path)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA foreign_keys = ON")
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS habits (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                created TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS check_ins (
                id INTEGER PRIMARY KEY,
                habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
                day TEXT NOT NULL,
                UNIQUE (habit_id, day)
            );
        """)

    # ----- Create -----
    def add_habit(self, name):
        with self.conn:
            cur = self.conn.execute("INSERT INTO habits (name, created) VALUES (?, ?)",
                                    (name, date.today().isoformat()))
        return cur.lastrowid

    def check_in(self, habit_id, day=None):
        """Record a check-in. Returns False if already checked in that day."""
        day = (day or date.today()).isoformat()
        try:
            with self.conn:
                self.conn.execute("INSERT INTO check_ins (habit_id, day) VALUES (?, ?)",
                                  (habit_id, day))
            return True
        except sqlite3.IntegrityError:
            return False

    # ----- Read -----
    def habits(self):
        return self.conn.execute("SELECT id, name, created FROM habits ORDER BY name").fetchall()

    def days_done(self, habit_id):
        rows = self.conn.execute("SELECT day FROM check_ins WHERE habit_id = ?", (habit_id,))
        return {date.fromisoformat(r["day"]) for r in rows}

    # ----- Update -----
    def rename(self, habit_id, new_name):
        with self.conn:
            cur = self.conn.execute("UPDATE habits SET name = ? WHERE id = ?", (new_name, habit_id))
        return cur.rowcount == 1

    # ----- Delete -----
    def delete(self, habit_id):
        with self.conn:
            cur = self.conn.execute("DELETE FROM habits WHERE id = ?", (habit_id,))
        return cur.rowcount == 1


def current_streak(days, today=None):
    """Consecutive days up to today (or up to yesterday if today isn't done yet)."""
    today = today or date.today()
    day = today if today in days else today - timedelta(days=1)
    streak = 0
    while day in days:
        streak += 1
        day -= timedelta(days=1)
    return streak


def last_week(days, today=None):
    today = today or date.today()
    return "".join("■" if today - timedelta(days=i) in days else "·" for i in range(6, -1, -1))


def show(repo):
    habits = repo.habits()
    if not habits:
        print("No habits yet.")
        return
    print(f"{'#':>3}  {'Habit':<22}{'Last 7 days':<13}Streak")
    for h in habits:
        days = repo.days_done(h["id"])
        print(f"{h['id']:>3}  {h['name']:<22}{last_week(days):<13}{current_streak(days)}")


def ask_id():
    try:
        return int(input("Habit number: "))
    except ValueError:
        return None


def main():
    repo = HabitRepository()
    while True:
        print()
        show(repo)
        print("\na) Add  c) Check in  r) Rename  d) Delete  q) Quit")
        choice = input("Choose: ").strip().lower()
        if choice == "a":
            name = input("New habit: ").strip()
            try:
                if name:
                    repo.add_habit(name)
            except sqlite3.IntegrityError:
                print("You already have a habit with that name.")
        elif choice == "c":
            habit_id = ask_id()
            if habit_id is not None:
                print("Checked in!" if repo.check_in(habit_id) else "Already done today (or no such habit).")
        elif choice == "r":
            habit_id = ask_id()
            if habit_id is not None and not repo.rename(habit_id, input("New name: ").strip()):
                print("No such habit.")
        elif choice == "d":
            habit_id = ask_id()
            if habit_id is not None and input("Type yes to delete: ") == "yes":
                print("Deleted." if repo.delete(habit_id) else "No such habit.")
        elif choice == "q":
            break


if __name__ == "__main__":
    main()`,
    explain: [
      ["class HabitRepository:", "Every SQL statement lives here. The menu code calls readable methods like <code>repo.check_in(3)</code>."],
      ["UNIQUE (habit_id, day) ... except sqlite3.IntegrityError", "The database rejects a second check-in on the same day, and the method turns that into a simple True/False."],
      ["ON DELETE CASCADE + PRAGMA foreign_keys = ON", "Deleting a habit removes its check-ins automatically, but only because foreign keys were switched on."],
      ["cur.rowcount == 1", "UPDATE and DELETE report how many rows they changed. 0 means no habit had that id."],
      ["def current_streak(days, today=None):", "Pure logic with an optional <code>today</code>, kept outside the repository so it's easy to test with fixed dates."]
    ],
    stretch: ["Add a \"longest streak ever\" column.", "Write pytest tests using <code>HabitRepository(\":memory:\")</code> so each test gets a fresh database."]
  },
  tests: ["Check in twice on the same day.", "Delete a habit, then check the <code>check_ins</code> table has no rows left for it.", "Rename to an existing name: what happens? Should the program catch it?", "In the interpreter, test <code>current_streak</code> with a set of fixed dates."]
};

L[60] = {
  intro: "Level 3 capstone: a library management system that brings together OOP, a SQLite repository, a service layer with business rules, logging, type hints and a pytest suite. Give it two or three days.",
  lesson: [
    {h: "Layered architecture",
     p: "Professional applications are split into layers that each have one job. <b>Models</b> describe the data (Book, Member, Loan). The <b>repository</b> stores and loads them (SQL only). The <b>service</b> enforces the business rules (loan limits, late fees) without knowing about SQL or menus. The <b>CLI</b> talks to the user. Each layer only talks to the one below it.",
     code: R`day60_library/
├── main.py
├── library/
│   ├── __init__.py
│   ├── models.py       Book, Member, Loan classes
│   ├── repository.py   SQLite storage
│   ├── service.py      rules: borrowing, returns, fees
│   └── cli.py          menus
└── tests/
    └── test_service.py`},
    {h: "The rules",
     p: "A member can hold at most 3 books. Loans last 14 days. Returns after the due date cost 0.25 per day. A member owing more than 5.00 in fees can't borrow until they pay. A book that's on loan can't be borrowed again. Every important action is logged."},
    {h: "Why this pays off",
     p: "Because the service receives a repository and an optional date, the tests can use an in-memory database and fixed dates. The rules can be tested in milliseconds without touching your real data or waiting 14 days. This is exactly how real teams structure applications."},
    {h: "Review checklist",
     p: "This project uses classes and constructors (41–42), special methods (43), composition (45), properties (46), generators (48), context managers (50), type hints (51), pytest fixtures (52), logging (54), SQL and the repository pattern (58–59). Revisit any that feel unclear before you start."}
  ],
  exercises: [
    {q: "Before reading the code, list the methods <code>LibraryService</code> needs, with their parameters and return types.", sol: R`# add_book(title: str, author: str, isbn: str) -> Book
# add_member(name: str) -> Member
# borrow(member_id: int, book_id: int, today: date | None = None) -> Loan
# return_book(book_id: int, today: date | None = None) -> float   (fee charged)
# pay_fees(member_id: int, amount: float) -> float                 (remaining)
# overdue(today: date | None = None) -> list[Loan]`},
    {q: "Write the test for \"a member can't borrow a fourth book\" before reading the solution.", sol: R`def test_loan_limit(service, member, books):
    for book in books[:3]:
        service.borrow(member.id, book.id, today=TODAY)
    with pytest.raises(LibraryError, match="limit"):
        service.borrow(member.id, books[3].id, today=TODAY)`}
  ],
  project: {
    title: "Library management system",
    brief: "Build the layered library system described in the lesson. Write it one layer at a time from the bottom up (models, repository, service, then CLI), and write the service tests as you add each rule. Run it with <code>python main.py</code> and test it with <code>pytest -v</code> from the <code>day60_library</code> folder.",
    file: "day60_library/",
    files: [
      ["library/__init__.py", R`"""Library management system."""`],
      ["library/models.py", R`"""Plain data classes for the library."""

from __future__ import annotations

from datetime import date


class Book:
    def __init__(self, id: int | None, title: str, author: str, isbn: str) -> None:
        self.id = id
        self.title = title
        self.author = author
        self.isbn = isbn

    def __repr__(self) -> str:
        return f"Book({self.id}, {self.title!r})"


class Member:
    def __init__(self, id: int | None, name: str, fees_owed: float = 0.0) -> None:
        self.id = id
        self.name = name
        self.fees_owed = fees_owed

    def __repr__(self) -> str:
        return f"Member({self.id}, {self.name!r})"


class Loan:
    def __init__(self, id: int | None, book_id: int, member_id: int,
                 borrowed: date, due: date, returned: date | None = None) -> None:
        self.id = id
        self.book_id = book_id
        self.member_id = member_id
        self.borrowed = borrowed
        self.due = due
        self.returned = returned

    @property
    def is_open(self) -> bool:
        return self.returned is None

    def days_late(self, on: date) -> int:
        return max(0, (on - self.due).days)`],
      ["library/repository.py", R`"""SQLite storage. The only module that contains SQL."""

from __future__ import annotations

import sqlite3
from datetime import date
from pathlib import Path
from typing import Iterator

from .models import Book, Loan, Member

SCHEMA = """
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY, title TEXT NOT NULL, author TEXT NOT NULL, isbn TEXT UNIQUE);
CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, fees_owed REAL NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL REFERENCES books(id),
    member_id INTEGER NOT NULL REFERENCES members(id),
    borrowed TEXT NOT NULL, due TEXT NOT NULL, returned TEXT);
"""


class Repository:
    def __init__(self, path: str | Path = ":memory:") -> None:
        self.conn = sqlite3.connect(path)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA foreign_keys = ON")
        self.conn.executescript(SCHEMA)

    # ----- books -----
    def add_book(self, book: Book) -> Book:
        with self.conn:
            cur = self.conn.execute("INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)",
                                    (book.title, book.author, book.isbn))
        book.id = cur.lastrowid
        return book

    def get_book(self, book_id: int) -> Book | None:
        row = self.conn.execute("SELECT * FROM books WHERE id = ?", (book_id,)).fetchone()
        return Book(row["id"], row["title"], row["author"], row["isbn"]) if row else None

    def search_books(self, text: str) -> list[Book]:
        like = f"%{text}%"
        rows = self.conn.execute(
            "SELECT * FROM books WHERE title LIKE ? OR author LIKE ? ORDER BY title", (like, like))
        return [Book(r["id"], r["title"], r["author"], r["isbn"]) for r in rows]

    # ----- members -----
    def add_member(self, member: Member) -> Member:
        with self.conn:
            cur = self.conn.execute("INSERT INTO members (name, fees_owed) VALUES (?, ?)",
                                    (member.name, member.fees_owed))
        member.id = cur.lastrowid
        return member

    def get_member(self, member_id: int) -> Member | None:
        row = self.conn.execute("SELECT * FROM members WHERE id = ?", (member_id,)).fetchone()
        return Member(row["id"], row["name"], row["fees_owed"]) if row else None

    def save_member(self, member: Member) -> None:
        with self.conn:
            self.conn.execute("UPDATE members SET name = ?, fees_owed = ? WHERE id = ?",
                              (member.name, member.fees_owed, member.id))

    def members(self) -> list[Member]:
        rows = self.conn.execute("SELECT * FROM members ORDER BY name")
        return [Member(r["id"], r["name"], r["fees_owed"]) for r in rows]

    # ----- loans -----
    def add_loan(self, loan: Loan) -> Loan:
        with self.conn:
            cur = self.conn.execute(
                "INSERT INTO loans (book_id, member_id, borrowed, due) VALUES (?, ?, ?, ?)",
                (loan.book_id, loan.member_id, loan.borrowed.isoformat(), loan.due.isoformat()))
        loan.id = cur.lastrowid
        return loan

    def close_loan(self, loan: Loan) -> None:
        assert loan.returned is not None
        with self.conn:
            self.conn.execute("UPDATE loans SET returned = ? WHERE id = ?",
                              (loan.returned.isoformat(), loan.id))

    def open_loans(self, member_id: int | None = None, book_id: int | None = None) -> Iterator[Loan]:
        sql = "SELECT * FROM loans WHERE returned IS NULL"
        params: list[int] = []
        if member_id is not None:
            sql += " AND member_id = ?"
            params.append(member_id)
        if book_id is not None:
            sql += " AND book_id = ?"
            params.append(book_id)
        for r in self.conn.execute(sql + " ORDER BY due", params):
            yield Loan(r["id"], r["book_id"], r["member_id"],
                       date.fromisoformat(r["borrowed"]), date.fromisoformat(r["due"]))`],
      ["library/service.py", R`"""Business rules. Knows nothing about SQL or menus."""

from __future__ import annotations

import logging
from datetime import date, timedelta

from .models import Book, Loan, Member
from .repository import Repository

log = logging.getLogger(__name__)


class LibraryError(Exception):
    """A rule was broken; the message explains which."""


class LibraryService:
    LOAN_DAYS = 14
    MAX_LOANS = 3
    FEE_PER_DAY = 0.25
    FEE_LIMIT = 5.00

    def __init__(self, repo: Repository) -> None:
        self.repo = repo

    def add_book(self, title: str, author: str, isbn: str) -> Book:
        book = self.repo.add_book(Book(None, title, author, isbn))
        log.info("Added book %s", book)
        return book

    def add_member(self, name: str) -> Member:
        member = self.repo.add_member(Member(None, name))
        log.info("Added member %s", member)
        return member

    def _member(self, member_id: int) -> Member:
        member = self.repo.get_member(member_id)
        if member is None:
            raise LibraryError(f"No member with id {member_id}")
        return member

    def borrow(self, member_id: int, book_id: int, today: date | None = None) -> Loan:
        today = today or date.today()
        member = self._member(member_id)
        if self.repo.get_book(book_id) is None:
            raise LibraryError(f"No book with id {book_id}")
        if any(self.repo.open_loans(book_id=book_id)):
            raise LibraryError("That book is already on loan")
        if len(list(self.repo.open_loans(member_id=member_id))) >= self.MAX_LOANS:
            raise LibraryError(f"{member.name} has reached the limit of {self.MAX_LOANS} books")
        if member.fees_owed > self.FEE_LIMIT:
            raise LibraryError(f"{member.name} owes {member.fees_owed:.2f}; please pay first")

        loan = self.repo.add_loan(Loan(None, book_id, member_id, today,
                                       today + timedelta(days=self.LOAN_DAYS)))
        log.info("Member %s borrowed book %s, due %s", member_id, book_id, loan.due)
        return loan

    def return_book(self, book_id: int, today: date | None = None) -> float:
        """Close the open loan for this book and return the fee charged."""
        today = today or date.today()
        loan = next(self.repo.open_loans(book_id=book_id), None)
        if loan is None:
            raise LibraryError("That book isn't on loan")

        loan.returned = today
        self.repo.close_loan(loan)
        fee = loan.days_late(today) * self.FEE_PER_DAY
        if fee:
            member = self._member(loan.member_id)
            member.fees_owed += fee
            self.repo.save_member(member)
            log.warning("Book %s returned %d days late; fee %.2f",
                        book_id, loan.days_late(today), fee)
        else:
            log.info("Book %s returned on time", book_id)
        return fee

    def pay_fees(self, member_id: int, amount: float) -> float:
        if amount <= 0:
            raise LibraryError("Payment must be positive")
        member = self._member(member_id)
        member.fees_owed = max(0.0, round(member.fees_owed - amount, 2))
        self.repo.save_member(member)
        log.info("Member %s paid %.2f", member_id, amount)
        return member.fees_owed

    def overdue(self, today: date | None = None) -> list[Loan]:
        today = today or date.today()
        return [loan for loan in self.repo.open_loans() if loan.due < today]`],
      ["library/cli.py", R`"""Text menus for librarians."""

import logging
from pathlib import Path

from .repository import Repository
from .service import LibraryError, LibraryService

DB_FILE = Path(__file__).parent.parent / "library.db"


def ask_int(prompt: str) -> int:
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Please enter a number.")


def seed(service: LibraryService) -> None:
    if service.repo.search_books(""):
        return
    for title, author, isbn in [
        ("Dune", "Frank Herbert", "9780441013593"),
        ("Python Crash Course", "Eric Matthes", "9781718502703"),
        ("Atomic Habits", "James Clear", "9780735211292"),
        ("Sapiens", "Yuval Noah Harari", "9780062316097"),
    ]:
        service.add_book(title, author, isbn)
    for name in ("Amina", "Omar", "Sara"):
        service.add_member(name)


def main() -> None:
    logging.basicConfig(filename=DB_FILE.with_suffix(".log"), level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    service = LibraryService(Repository(DB_FILE))
    seed(service)

    menu = ("1) Search books  2) Members  3) Borrow  4) Return  "
            "5) Pay fees  6) Overdue  7) Add book  8) Add member  q) Quit")
    while True:
        print("\n" + menu)
        choice = input("Choose: ").strip().lower()
        try:
            if choice == "1":
                for b in service.repo.search_books(input("Search (blank for all): ")):
                    on_loan = any(service.repo.open_loans(book_id=b.id))
                    print(f"  {b.id:>3}  {b.title:<28}{b.author:<22}{'on loan' if on_loan else 'available'}")
            elif choice == "2":
                for m in service.repo.members():
                    loans = len(list(service.repo.open_loans(member_id=m.id)))
                    print(f"  {m.id:>3}  {m.name:<12}{loans} book(s)  owes {m.fees_owed:.2f}")
            elif choice == "3":
                loan = service.borrow(ask_int("Member id: "), ask_int("Book id: "))
                print(f"Borrowed. Due {loan.due}.")
            elif choice == "4":
                fee = service.return_book(ask_int("Book id: "))
                print(f"Returned. Late fee {fee:.2f}." if fee else "Returned on time.")
            elif choice == "5":
                left = service.pay_fees(ask_int("Member id: "), float(input("Amount: ")))
                print(f"Thank you. Still owed: {left:.2f}")
            elif choice == "6":
                for loan in service.overdue():
                    print(f"  Book {loan.book_id} with member {loan.member_id}, due {loan.due}")
            elif choice == "7":
                service.add_book(input("Title: "), input("Author: "), input("ISBN: "))
            elif choice == "8":
                service.add_member(input("Name: "))
            elif choice == "q":
                break
        except (LibraryError, ValueError) as error:
            print("Sorry:", error)`],
      ["main.py", R`from library.cli import main

if __name__ == "__main__":
    main()`],
      ["tests/test_service.py", R`"""Tests for the library rules. Run from day60_library with: pytest -v"""

import sys
from datetime import date, timedelta
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).parent.parent))   # so "library" can be imported

from library.repository import Repository
from library.service import LibraryError, LibraryService

TODAY = date(2026, 3, 1)


@pytest.fixture
def service():
    return LibraryService(Repository(":memory:"))     # a fresh, empty database per test


@pytest.fixture
def member(service):
    return service.add_member("Amina")


@pytest.fixture
def books(service):
    return [service.add_book(f"Book {i}", "Author", f"isbn-{i}") for i in range(5)]


def test_borrow_sets_due_date(service, member, books):
    loan = service.borrow(member.id, books[0].id, today=TODAY)
    assert loan.due == TODAY + timedelta(days=14)


def test_book_cannot_be_borrowed_twice(service, member, books):
    other = service.add_member("Omar")
    service.borrow(member.id, books[0].id, today=TODAY)
    with pytest.raises(LibraryError, match="already on loan"):
        service.borrow(other.id, books[0].id, today=TODAY)


def test_loan_limit(service, member, books):
    for book in books[:3]:
        service.borrow(member.id, book.id, today=TODAY)
    with pytest.raises(LibraryError, match="limit"):
        service.borrow(member.id, books[3].id, today=TODAY)


def test_on_time_return_is_free(service, member, books):
    service.borrow(member.id, books[0].id, today=TODAY)
    assert service.return_book(books[0].id, today=TODAY + timedelta(days=14)) == 0


def test_late_return_charges_fee(service, member, books):
    service.borrow(member.id, books[0].id, today=TODAY)
    fee = service.return_book(books[0].id, today=TODAY + timedelta(days=20))
    assert fee == pytest.approx(6 * 0.25)
    assert service.repo.get_member(member.id).fees_owed == pytest.approx(1.50)


def test_returned_book_can_be_borrowed_again(service, member, books):
    service.borrow(member.id, books[0].id, today=TODAY)
    service.return_book(books[0].id, today=TODAY)
    service.borrow(member.id, books[0].id, today=TODAY)


def test_large_fees_block_borrowing(service, member, books):
    service.borrow(member.id, books[0].id, today=TODAY)
    service.return_book(books[0].id, today=TODAY + timedelta(days=14 + 30))   # 7.50 owed
    with pytest.raises(LibraryError, match="owes"):
        service.borrow(member.id, books[1].id, today=TODAY)
    service.pay_fees(member.id, 5)
    service.borrow(member.id, books[1].id, today=TODAY)                     # 2.50 left: allowed


def test_overdue(service, member, books):
    service.borrow(member.id, books[0].id, today=TODAY)
    assert service.overdue(today=TODAY + timedelta(days=14)) == []
    assert len(service.overdue(today=TODAY + timedelta(days=15))) == 1


@pytest.mark.parametrize("member_id, book_id", [(999, 1), (1, 999)])
def test_unknown_ids(service, member, books, member_id, book_id):
    with pytest.raises(LibraryError, match="No"):
        service.borrow(member_id, book_id, today=TODAY)


def test_returning_book_not_on_loan(service, books):
    with pytest.raises(LibraryError):
        service.return_book(books[0].id, today=TODAY)`]
    ],
    explain: [
      ["Repository(\":memory:\") in the fixture", "Each test gets a brand-new database in memory. Tests can't affect each other or your real <code>library.db</code>."],
      ["class LibraryError(Exception)", "One exception type for broken rules. The CLI catches it and shows the message; tests check it with <code>pytest.raises(..., match=...)</code>."],
      ["def open_loans(...) -> Iterator[Loan]: ... yield", "The repository yields loans one at a time (a generator, Day 48). <code>any(...)</code> stops at the first one, and <code>next(..., None)</code> takes just one."],
      ["today: date | None = None", "Every rule that depends on the date accepts it as a parameter, so tests can travel through time instantly."],
      ["log.warning(\"Book %s returned %d days late...\")", "Late returns are logged as warnings in <code>library.log</code>, giving an audit trail of what happened and when."]
    ],
    stretch: ["Add reservations: a member can reserve a book that's on loan and is notified (printed) when it's returned.", "Add a <code>report</code> command showing the most borrowed books, using a SQL GROUP BY.", "Run <code>mypy library</code> and fix anything it finds."]
  },
  tests: ["<code>pytest -v</code> from <code>day60_library</code>: 11 tests should pass.", "Run <code>python main.py</code>, borrow and return books, and then read <code>library.log</code>.", "Break a rule in <code>service.py</code> (say, change <code>MAX_LOANS</code> to 4) and see which test fails.", "This is a great project for your GitHub profile: write a README explaining the architecture."]
};

})(window.LESSONS);
