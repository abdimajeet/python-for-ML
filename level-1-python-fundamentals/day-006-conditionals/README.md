# Day 6: Conditionals

**Level 1, Python Fundamentals.** Project: **BMI calculator**

With `if` statements your program finally chooses what to do. You also meet Python's most distinctive rule: indentation is part of the syntax.

## Lesson

### if

An `if` line ends with a colon. The lines underneath that belong to it are **indented** by 4 spaces. Python uses indentation instead of the curly braces other languages use. If the condition is True, the indented block runs.

```python
temperature = 31
if temperature > 30:
    print("It's hot!")
    print("Drink water.")
print("This always runs.")
```

### else and elif

`else` runs when the `if` was False. `elif` (short for "else if") adds more conditions. Python checks from the top and runs **only the first** branch that is True.

```python
score = 72
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print("Grade:", grade)
```

Output:

```text
Grade: C
```

### Why order matters

If you wrote `score >= 70` first, a score of 95 would get a C because that branch is True and the checking stops. Put the most specific or highest condition first.


### Nesting

An `if` can sit inside another. Each level indents 4 more spaces. Keep nesting shallow; on Day 7 you'll learn `and`/`or`, which often removes the need for it.

```python
has_ticket = True
age = 15
if has_ticket:
    if age >= 18:
        print("Enjoy the film")
    else:
        print("You need an adult with you")
else:
    print("Buy a ticket first")
```

## Exercises

1. Ask for a number and print whether it is positive, negative, or zero.

<details><summary>Solution</summary>

```python
n = float(input("Number: "))
if n > 0:
    print("Positive")
elif n < 0:
    print("Negative")
else:
    print("Zero")
```

</details>

2. Ask for a number and print "even" or "odd".

   _Hint: Use `%` from Day 3._

<details><summary>Solution</summary>

```python
n = int(input("Number: "))
if n % 2 == 0:
    print("even")
else:
    print("odd")
```

</details>

3. This code has a bug. Find it without running it: `if x > 5` on one line and `print("big")` on the next, not indented.

<details><summary>Solution</summary>

```python
# Two problems: the colon is missing, and the body is not indented.
if x > 5:
    print("big")
```

</details>

## Project: BMI calculator

Ask for weight and height, calculate body-mass index, and print the category. BMI = weight (kg) ÷ height (m)². Categories: under 18.5 underweight, under 25 normal, under 30 overweight, 30 and above obese.

Files in this folder: `day06_bmi.py`.

Sample output:

```text
Weight in kg: 70
Height in cm: 175
Your BMI is 22.9
That is classed as a healthy weight.
```

### Key lines explained

- `height_m ** 2`: `**` runs before `/`, so the height is squared first, which is what the formula needs.
- `elif bmi < 25:`: We only reach this if `bmi < 18.5` was False, so here we already know the BMI is at least 18.5. No need to write `18.5 <= bmi`.
- `category = ...`: Each branch stores a word, and one print at the end uses it. That's tidier than four separate print calls.

### Stretch goals

- Tell the user the healthy weight range for their height.
- Ask whether they want metric or imperial units.

## Test it

- [ ] Test each boundary: a BMI of exactly 18.5, 25 and 30. Which category should each get?
- [ ] Try a height of 0 and read the error.
- [ ] Indent one line wrongly and read the IndentationError.
