"""Code from earlier days, collected here so it can be tested."""

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
    return totals
