# Day 7: Logical operators

**Level 1, Python Fundamentals.** Project: **Leap-year and grade checker**

Real decisions often depend on several conditions at once. Today you combine conditions with `and`, `or` and `not`.

## Lesson

### and, or, not

`a and b` is True only if both are True. `a or b` is True if at least one is. `not a` flips True and False. Python uses these English words instead of symbols like `&&` and `||`.

```python
age = 25
has_id = True
print(age >= 18 and has_id)   # True
print(age < 13 or age > 65)   # False
print(not has_id)             # False
```

### Chained comparisons

Python lets you write a range check the way you would in maths. `13 <= age <= 19` means `13 <= age and age <= 19`.

```python
age = 16
if 13 <= age <= 19:
    print("Teenager")
```

### Short-circuiting

Python stops as soon as it knows the answer. In `a and b`, if `a` is False then `b` is never checked. That lets you guard risky checks: `count != 0 and total / count > 5` never divides by zero.


### Use parentheses when mixing

`not` runs first, then `and`, then `or`. When you mix `and` with `or`, add parentheses so nobody (including you) has to remember that.


## Exercises

1. Ask for a username and password. Print "Welcome" only if the username is `admin` and the password is `1234`.

<details><summary>Solution</summary>

```python
user = input("Username: ")
pw = input("Password: ")
if user == "admin" and pw == "1234":
    print("Welcome")
else:
    print("Access denied")
```

</details>

2. Ask what day it is. Print "Weekend!" if it is Saturday or Sunday.

<details><summary>Solution</summary>

```python
day = input("Day: ")
if day == "Saturday" or day == "Sunday":
    print("Weekend!")
else:
    print("Weekday")
```

</details>

3. Ask for a number and say whether it is between 1 and 10 inclusive, using a chained comparison.

<details><summary>Solution</summary>

```python
n = int(input("Number: "))
if 1 <= n <= 10:
    print("In range")
else:
    print("Out of range")
```

</details>

## Project: Leap-year and grade checker

Two small programs in one file. First, decide if a year is a leap year: divisible by 4, except century years, which must be divisible by 400. Then turn a score from 0 to 100 into a letter grade, rejecting impossible scores.

Files in this folder: `day07_checks.py`.

Sample output:

```text
Enter a year: 2024
2024 is a leap year.

Enter a score (0-100): 85
Grade B
```

### Key lines explained

- `(year % 4 == 0 and year % 100 != 0)`: Divisible by 4 but not a century year. The parentheses make it obvious this pair goes together.
- `or year % 400 == 0`: Century years like 2000 still count if divisible by 400. 1900 fails both parts, so it's not a leap year.
- `if score  100:`: Checking for bad input first is called a **guard**. The grade branches below can then trust the score.

### Stretch goals

- Rewrite the score guard using `not (0 <= score <= 100)`.
- Add + and - grades, like B+ for 87 to 89.

## Test it

- [ ] Years: 2024 (yes), 2023 (no), 1900 (no), 2000 (yes).
- [ ] Scores: -5, 0, 59, 60, 100, 101.
- [ ] Remove the parentheses in the leap-year line. Does it still give the same results? Think about why.
