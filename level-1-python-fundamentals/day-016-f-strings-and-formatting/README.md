# Day 16: f-strings and formatting

**Level 1, Python Fundamentals.** Project: **Shop receipt printer**

f-strings are the modern way to put values into text. Today you learn to format numbers and line up columns.

## Lesson

### f-strings

Put `f` before the opening quote, then write any expression inside `{ }`. No `str()` or `+` needed. This is the way most Python code builds text today.

```python
name = "Abdy"
day = 16
print(f"Hi {name}, this is day {day} of 100.")
print(f"{day * 2} is double the day")
```

Output:

```text
Hi Abdy, this is day 16 of 100.
32 is double the day
```

### Number formatting

Add a colon and a format spec after the value. `:.2f` means 2 decimal places. `:,` adds thousands separators. `:%` shows a fraction as a percentage.

```python
price = 1234.5
print(f"{price:.2f}")     # 1234.50
print(f"{price:,.2f}")    # 1,234.50
print(f"{0.256:.1%}")     # 25.6%
```

### Width and alignment

A number after the colon sets a width. `<` aligns left, `>` right, `^` centre. Combine with decimals like `:>8.2f`. You can also choose a fill character, as in `:-^30`.

```python
print(f"[{'tea':<8}]")
print(f"[{'tea':>8}]")
print(f"[{'tea':^8}]")
print(f"{'MENU':-^20}")
```

Output:

```text
[tea     ]
[     tea]
[  tea   ]
--------MENU--------
```

### Multi-line strings

Triple quotes `"""..."""` let a string span several lines. They work with `f` too.


## Exercises

1. Rewrite `print("Total: " + str(round(t, 2)))` as an f-string.

<details><summary>Solution</summary>

```python
print(f"Total: {t:.2f}")
```

</details>

2. Print the numbers 1 to 10 with their squares and cubes in three right-aligned columns of width 6.

<details><summary>Solution</summary>

```python
for n in range(1, 11):
    print(f"{n:>6}{n**2:>6}{n**3:>6}")
```

</details>

3. Given a population of 1380004385, print it with commas.

<details><summary>Solution</summary>

```python
print(f"{1380004385:,}")   # 1,380,004,385
```

</details>

## Project: Shop receipt printer

Print a neat receipt from a list of (item, quantity, unit price) tuples, with aligned columns, a subtotal, tax and a total.

Files in this folder: `day16_receipt.py`.

Sample output:

```text
====================================
            Corner Café
====================================
Item             Qty   Price   Total
------------------------------------
Coffee             2    3.50    7.00
Croissant          3    2.25    6.75
Orange juice       1    4.00    4.00
Sandwich           2    6.75   13.50
------------------------------------
Subtotal                       31.25
Tax (16%)                       5.00
TOTAL                          36.25
====================================
             Thank you!
```

### Key lines explained

- `f"{SHOP:^{WIDTH}}"`: The width itself can come from a variable using nested braces. Change WIDTH and everything re-centres.
- `for name, qty, price in items:`: Tuple unpacking from Day 14: each tuple splits into three names.
- `{price:>8.2f}`: Right-aligned in 8 characters with 2 decimals, so all the decimal points line up.
- `16 + 4 + 8 + 8 = 36`: The column widths add up to WIDTH, which keeps the rules and the columns the same length.

### Stretch goals

- Let the user type items until they enter a blank name.
- Add a 10% discount line when the subtotal is over 30.

## Test it

- [ ] Add an item with a long name (over 16 characters). What breaks? Fix it by shortening with a slice.
- [ ] Check the total by hand.
- [ ] Change WIDTH and see what still lines up.
