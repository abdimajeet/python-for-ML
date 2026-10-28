"""Plain data classes for the library."""

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
        return max(0, (on - self.due).days)
