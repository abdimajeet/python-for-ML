# Day 8: Putting it together

**Level 1, Python Fundamentals.** Project: **Four-function calculator**

No new syntax today. You combine everything so far into a complete program, and learn to plan a program before writing it.

## Lesson

### Plan before you code

Write the steps in plain words first, as comments. For a calculator: 1) show the options, 2) read two numbers, 3) read the choice, 4) do the matching calculation, 5) print the answer. Then fill in the code under each comment. This habit matters more than any syntax.


### Menus

A menu prints numbered options and reads the user's choice as a string. Comparing with strings like `"1"` avoids converting the choice and avoids a crash if the user types a letter.

```python
print("1) Add")
print("2) Subtract")
choice = input("Choose 1 or 2: ")
if choice == "1":
    print("You chose add")
```

### Validating input

Check for bad situations before they cause errors. Dividing by zero raises `ZeroDivisionError`, so check the divisor first. An unknown menu choice should get a helpful message, not silence.


## Exercises

1. Write only the plan (as comments) for a program that converts a number of seconds into hours, minutes and seconds.

<details><summary>Solution</summary>

```python
# 1. ask for total seconds and convert to int
# 2. hours = seconds // 3600
# 3. remaining = seconds % 3600
# 4. minutes = remaining // 60, secs = remaining % 60
# 5. print all three
```

</details>

2. Now write the code under each comment.

<details><summary>Solution</summary>

```python
total = int(input("Seconds: "))
hours = total // 3600
remaining = total % 3600
minutes = remaining // 60
secs = remaining % 60
print(hours, "h", minutes, "m", secs, "s")
```

</details>

## Project: Four-function calculator

Ask for two numbers and an operation, then print the result. Handle division by zero and unknown operations with clear messages.

Files in this folder: `day08_calculator.py`.

Sample output:

```text
First number: 12
Second number: 4
Operation: /
12.0 / 4.0 = 3.0
```

### Key lines explained

- `# 1. read the numbers`: The plan stays in the code as comments, so the structure is easy to follow.
- `if b == 0:`: A nested check inside the division branch. We only divide when it's safe.
- `else: print("Unknown operation:", op)`: The final `else` catches anything the user typed that isn't one of the four symbols.

### Stretch goals

- Add `**` for power and `%` for remainder.
- Show results without `.0` when the answer is a whole number. Hint: `result == int(result)`.

## Test it

- [ ] Try every operation once.
- [ ] Divide by 0.
- [ ] Type `x` as the operation.
- [ ] Use negative and decimal numbers.
