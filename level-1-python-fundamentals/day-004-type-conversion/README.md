# Day 4: Type conversion

**Level 1, Python Fundamentals.** Project: **Unit converter**

Everything from `input()` is text. Today you learn to convert between types so you can do maths with what users type.

## Lesson

### The problem

`input()` always returns a `str`, even if the user types digits. Adding two strings joins them, so you get a surprising answer.

```python
a = input("First number: ")   # user types 5
b = input("Second number: ")  # user types 5
print(a + b)
```

Output:

```text
55
```

### Converting types

`int()`, `float()` and `str()` create a new value of that type from another value. Wrap `input()` in one to get a number.

```python
a = int(input("First number: "))
b = int(input("Second number: "))
print(a + b)            # 10

price = float("19.99")  # str to float
label = str(42)         # int to str
print("Item " + label)
```

### What can be converted

`int("12")` works, but `int("12.5")` and `int("twelve")` raise a **ValueError**. `int(3.9)` gives `3`; it cuts off the decimals rather than rounding. For now, type valid input; on Day 31 you'll learn to handle bad input gracefully.

```python
print(int(3.9))        # 3
print(float("2"))      # 2.0
print(int(float("12.5")))  # 12
```

### Why str() matters for printing

`"Age: " + 30` is a **TypeError** because Python won't silently mix text and numbers. Either convert with `str(30)` or use commas in `print()`.


## Exercises

1. Ask for the user's birth year and print how old they turn this year.

<details><summary>Solution</summary>

```python
year = int(input("Birth year: "))
print("You turn", 2026 - year, "this year")
```

</details>

2. Predict, then run: `print("3" * 3)` and `print(int("3") * 3)`.

<details><summary>Solution</summary>

```python
print("3" * 3)       # 333  (string repeated)
print(int("3") * 3)  # 9
```

</details>

3. Ask for a price with decimals and print it with 16% VAT added.

<details><summary>Solution</summary>

```python
price = float(input("Price: "))
print("With VAT:", round(price * 1.16, 2))
```

</details>

## Project: Unit converter

Ask the user for a distance in kilometres and a temperature in Celsius, then print both converted. Each conversion reads a string, converts it to a float, calculates, and prints a rounded answer.

Files in this folder: `day04_unit_converter.py`.

Sample output:

```text
=== Unit Converter ===
Distance in kilometres: 10
10.0 km is 6.21 miles

Temperature in Celsius: 37
37.0 °C is 98.6 °F
```

### Key lines explained

- `KM_TO_MILES = 0.621371`: A value that never changes. Python has no true constants; capital letters just tell readers "don't change this".
- `float(input(...))`: Read inside-out: `input()` runs first and returns text, then `float()` turns it into a number.
- `celsius * 9 / 5 + 32`: The standard formula. Multiplication and division happen before the addition.

### Stretch goals

- Add kilograms to pounds (1 kg = 2.20462 lb).
- Go back to yesterday's tip splitter and make it ask for its three values.

## Test it

- [ ] 0 °C should give 32 °F and 100 °C should give 212 °F.
- [ ] -40 °C should give -40 °F.
- [ ] Type `ten` for the distance and read the ValueError.
