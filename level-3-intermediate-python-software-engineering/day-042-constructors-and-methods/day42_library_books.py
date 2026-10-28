# day42_library_books.py
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
    main()
