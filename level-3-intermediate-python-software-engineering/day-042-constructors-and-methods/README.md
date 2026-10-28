# Day 42: Constructors and methods

**Level 3, Intermediate Python & Software Engineering.** Project: **Library book tracker**

Today you learn the constructor, `__init__`, properly, along with the difference between instance and class attributes.

## Lesson

### The constructor

`__init__` runs automatically every time an instance is created. Its job is to give the new object every attribute it needs, so no instance is ever half set up. Arguments you pass to the class go to `__init__` after `self`.

```python
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages
        self.is_borrowed = False     # a default not passed in

b = Book("Dune", "Frank Herbert", 412)
print(b.title, b.is_borrowed)
```

Output:

```text
Dune False
```

### Methods that change and methods that report

Some methods change state (`borrow`), others answer questions (`is_long`). Methods can take extra arguments and return values just like functions.

```python
class Book:
    # ... __init__ as above ...
    def borrow(self):
        if self.is_borrowed:
            return False
        self.is_borrowed = True
        return True

    def is_long(self, limit=400):
        return self.pages > limit
```

### Class attributes

A variable defined in the class body, outside any method, is a **class attribute**: shared by every instance. Use it for constants and shared counters. Instance attributes (set on `self`) belong to one object.

```python
class Book:
    loan_days = 14          # shared by all books
    count = 0

    def __init__(self, title):
        self.title = title
        Book.count += 1     # update the shared counter

Book("A")
Book("B")
print(Book.count, Book.loan_days)
```

Output:

```text
2 14
```

### Class methods and static methods

`@classmethod` receives the class (`cls`) instead of an instance. It's commonly used as an alternative constructor, for example `Book.from_dict(data)`. `@staticmethod` receives neither; it's just a function that belongs with the class.

```python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    @classmethod
    def from_dict(cls, data):
        return cls(data["title"], data["author"])

b = Book.from_dict({"title": "Emma", "author": "Jane Austen"})
```

## Exercises

1. Write a class `Rectangle` with width and height, and methods `area()` and `perimeter()`.

<details><summary>Solution</summary>

```python
class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

print(Rectangle(3, 4).area())
```

</details>

2. Add a class attribute that counts how many rectangles have been created.

<details><summary>Solution</summary>

```python
class Rectangle:
    created = 0

    def __init__(self, width, height):
        self.width = width
        self.height = height
        Rectangle.created += 1
```

</details>

3. Add a classmethod `square(size)` that returns a rectangle with equal sides.

<details><summary>Solution</summary>

```python
    @classmethod
    def square(cls, size):
        return cls(size, size)

sq = Rectangle.square(5)
```

</details>

## Project: Library book tracker

Model books with a `Book` class: borrowing, returning, due dates, and late fees. A small menu lets a librarian check books in and out. Books are saved to and loaded from JSON using `to_dict` and a `from_dict` classmethod.

Files in this folder: `day42_library_books.py`.

### Key lines explained

- `loan_days = 14 / fee_per_day = 0.25`: Class attributes: library-wide rules shared by every book.
- `def borrow(self, person, today=None):`: Passing `today` is optional. In normal use it defaults to the real date, but a test can pass a fixed date. You'll use this on Day 52.
- `return False / return True`: The method reports whether it succeeded, and the menu decides what to say. The class never prints.
- `def to_dict(self) / @classmethod from_dict`: A matching pair: objects become plain dicts for JSON, and dicts become objects again. Dates are stored as ISO strings because JSON has no date type.
- `[Book.from_dict(d) for d in json.load(f)]`: A comprehension that rebuilds every Book object from the saved file.

### Stretch goals

- Add a `times_borrowed` counter to each book and list the most popular.
- Add a method that lists all overdue books for a given date.

## Test it

- [ ] Borrow a book, then try borrowing it again.
- [ ] In the interpreter: create a book, borrow it with `today=date(2026, 1, 1)`, return it with `today=date(2026, 1, 20)`. The fee should be 5 × 0.25 = 1.25.
- [ ] Quit and restart: borrowed books stay borrowed.
