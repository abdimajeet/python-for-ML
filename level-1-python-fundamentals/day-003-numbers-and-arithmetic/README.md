# Day 3: Numbers and arithmetic

**Level 1, Python Fundamentals.** Project: **Tip and bill splitter**

Python is an excellent calculator. Today you learn its number types and arithmetic operators.

## Lesson

### int and float

`int` is a whole number like `42` or `-7`. `float` is a number with a decimal point like `3.14`. Python ints can be as large as you like; there is no overflow.

```python
apples = 12
price = 0.75
print(type(apples), type(price))
```

Output:

```text
<class 'int'> <class 'float'>
```

### Arithmetic operators

`+ - *` work as you expect. `/` **always** gives a float, even for `10 / 2`. `//` is floor division (divides and drops the remainder). `%` is the remainder (modulo). `**` is power.

```python
print(10 / 3)    # 3.3333333333333335
print(10 // 3)   # 3
print(10 % 3)    # 1
print(2 ** 10)   # 1024
print(10 / 2)    # 5.0, still a float
```

### Order of operations

Python follows the usual maths order: `**` first, then `* / // %`, then `+ -`. Use parentheses to make the order obvious.

```python
print(2 + 3 * 4)     # 14
print((2 + 3) * 4)   # 20
```

### Updating a variable

`total += 5` is short for `total = total + 5`. The same works with `-=`, `*=` and `/=`.

```python
score = 10
score += 5
score *= 2
print(score)
```

Output:

```text
30
```

### Rounding and float surprises

Floats are stored in binary, so some decimals can't be exact. `0.1 + 0.2` gives `0.30000000000000004`. That's normal in every language. Use `round(value, 2)` when showing money.

```python
print(0.1 + 0.2)
print(round(0.1 + 0.2, 2))
print(round(7.456, 1))
```

Output:

```text
0.30000000000000004
0.3
7.5
```

## Exercises

1. How many full hours and leftover minutes are in 200 minutes? Use `//` and `%`.

<details><summary>Solution</summary>

```python
minutes = 200
print(minutes // 60, "hours and", minutes % 60, "minutes")
# 3 hours and 20 minutes
```

</details>

2. Calculate the area of a circle with radius 5 (use 3.14159 for π) and round it to 2 decimals.

<details><summary>Solution</summary>

```python
radius = 5
area = 3.14159 * radius ** 2
print(round(area, 2))   # 78.54
```

</details>

3. Is 1234 even? Print the remainder when divided by 2.

<details><summary>Solution</summary>

```python
print(1234 % 2)   # 0 means even
```

</details>

## Project: Tip and bill splitter

Given a bill, a tip percentage and a number of people, calculate the tip, the total and what each person pays. For today the values are written in the code; tomorrow you'll read them from the user.

Files in this folder: `day03_tip_splitter.py`.

Sample output:

```text
Bill:       84.5
Tip:        12.68
Total:      97.17
Each pays:  24.29
```

### Key lines explained

- `tip = bill * tip_percent / 100`: Multiplication and division have the same priority and run left to right: 84.5 × 15 = 1267.5, then ÷ 100 = 12.675.
- `each = total / people`: `/` gives a float, which is what we want for money.
- `round(tip, 2)`: Rounds to 2 decimal places for display; the stored value is unchanged.

### Stretch goals

- Change the values and check the answers with a calculator.
- Also print how much tip each person contributes.

## Test it

- [ ] Set people to 1; each pays should equal the total.
- [ ] Set tip_percent to 0; the total should equal the bill.
- [ ] Set people to 0 and run it. Read the error; you'll learn to prevent it on Day 8.
