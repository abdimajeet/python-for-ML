# Day 5: Booleans and comparisons

**Level 1, Python Fundamentals.** Project: **Eligibility checker**

Programs make decisions by asking yes-or-no questions. Today you meet `bool` values and comparison operators.

## Lesson

### True and False

`bool` has exactly two values: `True` and `False`, with capital letters. They are what comparisons produce.

```python
is_raining = False
print(type(is_raining))
```

Output:

```text
<class 'bool'>
```

### Comparison operators

`==` equal, `!=` not equal, `<` `>` `<=` `>=`. Each comparison gives a bool. Don't confuse `=` (assign) with `==` (compare).

```python
age = 20
print(age >= 18)     # True
print(age == 21)     # False
print(age != 21)     # True
print("cat" == "Cat")  # False, case matters
```

### == versus is

`==` asks "do these have the same value?". `is` asks "are these the very same object in memory?". For everyday comparisons always use `==`. The one common use of `is` is checking `x is None`, which you'll meet later.


### Truthiness

Any value can be treated as true or false. Empty things and zero are **falsy**: `0`, `0.0`, `""`, and later empty lists. Everything else is **truthy**. `bool()` shows you which.

```python
print(bool(0), bool(5))
print(bool(""), bool("hi"))
```

Output:

```text
False True
False True
```

## Exercises

1. Ask for a number and print whether it is greater than 100.

<details><summary>Solution</summary>

```python
n = float(input("Number: "))
print("Greater than 100:", n > 100)
```

</details>

2. Ask for a password and print whether it equals `"python123"`.

<details><summary>Solution</summary>

```python
pw = input("Password: ")
print("Correct:", pw == "python123")
```

</details>

3. Predict each result, then check: `bool(" ")`, `10 / 2 == 5`, `"10" == 10`.

<details><summary>Solution</summary>

```python
print(bool(" "))   # True, a space is not empty
print(10 / 2 == 5)  # True, 5.0 equals 5
print("10" == 10)   # False, a str never equals an int
```

</details>

## Project: Eligibility checker

Ask for someone's age and height, then print a list of yes/no answers about what they can do. Tomorrow you'll use these same comparisons to make the program choose what to say.

Files in this folder: `day05_eligibility.py`.

Sample output:

```text
Results for Amina
Can vote:               True
Is at least 13:         True
Can ride the coaster:   True
Gets a senior discount: False
```

### Key lines explained

- `can_vote = age >= 18`: The comparison runs first and produces `True` or `False`, which is then stored in `can_vote`.
- `print("Can vote:", can_vote)`: Bools print as the words `True` and `False`.

### Stretch goals

- Add a check for whether the person can get a driving licence where you live.
- Ask for a second person's age and print whether they are older than the first.

## Test it

- [ ] Try exactly 18. Should `can_vote` be True? Check whether `>=` or `>` is right.
- [ ] Try 0 and 120.
- [ ] Check every label lines up.
