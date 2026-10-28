# Day 52: Testing with pytest

**Level 3, Intermediate Python & Software Engineering.** Project: **Test suite for earlier projects**

Automated tests check your code for you, every time you change it. Today you learn `pytest`, the most popular Python testing tool, and test code from earlier days.

## Lesson

### Why automated tests

So far you tested by running programs and typing input. That's slow and easy to forget. A test is a small function that calls your code and **asserts** the result. Run hundreds in a second, every time you change something, and know immediately if you broke anything.


### Your first test

Install with `pip install pytest` in your venv. Put tests in files named `test_*.py`, in functions named `test_*`. Use a plain `assert`. Run `pytest` in the folder; it finds and runs them all.

```python
# test_maths.py
def add(a, b):
    return a + b

def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -1) == -2
```

Output:

```text
$ pytest
====== 2 passed in 0.01s ======
```

### Testing errors and floats

`pytest.raises` checks that code raises the right error. `pytest.approx` compares floats safely.

```python
import pytest

def test_divide_by_zero():
    with pytest.raises(ZeroDivisionError):
        1 / 0

def test_float():
    assert 0.1 + 0.2 == pytest.approx(0.3)
```

### Parametrize and fixtures

`@pytest.mark.parametrize` runs one test with many inputs. A **fixture** is a function that prepares something a test needs; tests receive it by naming it as a parameter. The built-in `tmp_path` fixture gives each test its own empty temporary folder.

```python
@pytest.mark.parametrize("year, expected", [(2024, True), (1900, False), (2000, True)])
def test_leap(year, expected):
    assert is_leap(year) == expected

def test_save(tmp_path):
    file = tmp_path / "data.json"
    save({"a": 1}, file)
    assert file.exists()
```

### What to test

Test normal cases, edge cases (empty, zero, one item, boundaries like exactly 18) and error cases. Code that separates logic from `input()`/`print()`, as you've done since Day 34, is easy to test. Code that mixes them is hard. That's one of the main reasons for the separation.


## Exercises

1. Write tests for `is_even(n)` from Day 21, including 0 and a negative number.

<details><summary>Solution</summary>

```python
def test_is_even():
    assert is_even(4)
    assert not is_even(7)
    assert is_even(0)
    assert is_even(-2)
```

</details>

2. Use parametrize to test your BMI category function from Day 6 at each boundary.

<details><summary>Solution</summary>

```python
@pytest.mark.parametrize("bmi, category", [
    (18.4, "underweight"), (18.5, "a healthy weight"),
    (24.9, "a healthy weight"), (25, "overweight"), (30, "obese"),
])
def test_category(bmi, category):
    assert bmi_category(bmi) == category
```

</details>

## Project: Test suite for earlier projects

Write a pytest suite for code you already built: the dice parser from Day 26, the Fraction class from Day 43, the Book class from Day 42 (using fixed dates) and the finance calculations from Day 40. For a self-contained project, the code under test is collected in `earlier.py`. Run `pytest -v` until everything passes.

Files in this folder: `earlier.py`, `test_earlier.py`.

Sample output:

```text
$ pytest -v
test_earlier.py::test_parse_dice[2d6-expected0] PASSED
...
test_earlier.py::test_spending_by_category PASSED
====== 18 passed in 0.05s ======
```

### Key lines explained

- `@pytest.mark.parametrize("notation, expected", [...])`: One test function, four test cases. Each appears separately in the report, so you see exactly which input failed.
- `with pytest.raises(ValueError):`: The test passes only if the block raises that error. Testing failures matters as much as testing successes.
- `@pytest.fixture def book():`: Every test that names `book` as a parameter gets a **fresh** Book, so tests can't affect each other.
- `book.borrow("Amina", today=date(2026, 1, 1))`: This is why Day 42's methods accepted `today`: tests can use fixed dates and get the same result on any day.
- `(date(2026, 1, 15), 0.0)  # exactly on the due date`: Boundary cases are where bugs hide. Each one gets its own row.

### Stretch goals

- Change `late_fee` to use `<` instead of `<=` and watch which test catches the bug.
- Install `pytest-cov` and run `pytest --cov=earlier` to see which lines your tests never reach.

## Test it

- [ ] `pytest -v` shows 18 passed.
- [ ] Break one function on purpose and read pytest's failure report: it shows the values on both sides of the failed assert.
- [ ] Run a single test with `pytest -k late_fee`.
