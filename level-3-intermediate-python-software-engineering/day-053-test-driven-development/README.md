# Day 53: Test-driven development

**Level 3, Intermediate Python & Software Engineering.** Project: **Password validator built test-first**

Test-driven development (TDD) flips the order: write a failing test first, then write just enough code to pass it. It's a powerful way to design code in small, confident steps.

## Lesson

### Red, green, refactor

**Red:** write one small test for behaviour that doesn't exist yet, and watch it fail. **Green:** write the simplest code that makes it pass. **Refactor:** tidy the code while all tests stay green. Repeat with the next small behaviour.


### Why it helps

Writing the test first forces you to decide what the function should do, and what its inputs and outputs are, before worrying about how. You build up a full test suite as a side effect, and every change is small enough to understand.


### A tiny example

Suppose we want `fizzbuzz(n)`. Start with the simplest case only.

```python
# Step 1 (red): the test fails because fizzbuzz doesn't exist
def test_plain_number():
    assert fizzbuzz(1) == "1"

# Step 2 (green): the simplest thing that passes
def fizzbuzz(n):
    return str(n)

# Step 3 (red again): the next behaviour
def test_multiple_of_three():
    assert fizzbuzz(3) == "Fizz"

# Step 4 (green)
def fizzbuzz(n):
    if n % 3 == 0:
        return "Fizz"
    return str(n)
```

### Keep steps small

If you can't make a test pass in a few minutes, the step is too big: write a smaller test. Run the whole suite after every change. The feeling of always being one small step from working code is the point.


## Exercises

1. Finish FizzBuzz with TDD: add tests for 5 ("Buzz") and 15 ("FizzBuzz"), one at a time, making each pass before the next.

<details><summary>Solution</summary>

```python
def test_multiple_of_five():
    assert fizzbuzz(5) == "Buzz"

def test_multiple_of_both():
    assert fizzbuzz(15) == "FizzBuzz"

def fizzbuzz(n):
    if n % 15 == 0:
        return "FizzBuzz"
    if n % 3 == 0:
        return "Fizz"
    if n % 5 == 0:
        return "Buzz"
    return str(n)
```

</details>

2. Write only the tests (no code yet) for `word_count(text)`: empty string, one word, extra spaces, and punctuation.

<details><summary>Solution</summary>

```python
def test_empty():
    assert word_count("") == 0

def test_one_word():
    assert word_count("hello") == 1

def test_extra_spaces():
    assert word_count("  hello   world ") == 2

def test_punctuation_only_is_not_a_word():
    assert word_count("hi - there") == 2
```

</details>

## Project: Password validator built test-first

Build a `validate_password` function strictly test-first. It returns a list of problems (empty means valid). Follow the cycle below: write one test, run `pytest` and see red, write code until green, tidy up, and move to the next rule. The final versions of both files are shown, with the tests in the order you write them.

Files in this folder: `test_password.py`, `password.py`.

### Key lines explained

- `Cycle 1: test_good_password_has_no_problems`: The very first green step can be `return []`. It feels silly, but it sets up the file, imports and function signature.
- `Cycle 2: test_too_short`: Now `return []` fails, so you add the length check. Each test forces one small piece of real logic.
- `RULES = [(str.isupper, ...), ...]`: This list appeared during a **refactor** step: after writing four nearly identical `if` blocks for cycles 3 to 5, you tidy them into data while the tests stay green.
- `test_reports_every_problem`: "abc" is too short and lacks uppercase, digit and symbol: 4 problems. A test like this protects you from accidentally stopping at the first problem.
- `username: str | None = None`: Cycle 8 added a parameter. Because it has a default, the earlier tests didn't need to change.

### Stretch goals

- Add a rule (test first!) that rejects three identical characters in a row.
- Add a strength score from 0 to 100, driven by tests.

## Test it

- [ ] Really do it test-first: delete `password.py`, and write it again one cycle at a time.
- [ ] `pytest -v` should show 14 passed.
- [ ] After each cycle, commit with a message like "Cycle 3: uppercase rule".
