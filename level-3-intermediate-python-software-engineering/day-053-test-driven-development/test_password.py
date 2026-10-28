"""Tests written one at a time, in this order, before the code."""

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
    assert not is_valid("abc")
