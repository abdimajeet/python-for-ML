"""SQLite storage. The only module that contains SQL."""

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
                       date.fromisoformat(r["borrowed"]), date.fromisoformat(r["due"]))
