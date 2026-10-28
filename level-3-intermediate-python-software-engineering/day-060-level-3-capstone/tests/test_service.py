"""Tests for the library rules. Run from day60_library with: pytest -v"""

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
        service.return_book(books[0].id, today=TODAY)
