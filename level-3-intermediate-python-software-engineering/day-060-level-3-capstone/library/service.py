"""Business rules. Knows nothing about SQL or menus."""

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
        return [loan for loan in self.repo.open_loans() if loan.due < today]
