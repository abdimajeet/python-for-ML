"""Tests for earlier.py. Run with: pytest -v"""

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
    assert spending_by_category(transactions) == {"food": 150.5, "bus": 25.0}
