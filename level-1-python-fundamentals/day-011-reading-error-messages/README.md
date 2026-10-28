# Day 11: Reading error messages

**Level 1, Python Fundamentals.** Project: **Bug hunt**

Errors are messages, not failures. Today you learn to read a traceback, recognise the common errors, and debug methodically.

## Lesson

### Reading a traceback

When Python crashes it prints a **traceback**. Read it **from the bottom up**. The last line names the error type and gives a message. The line above shows the file, the line number, and the code that failed.

```python
Traceback (most recent call last):
  File "/home/abdy/day11.py", line 3, in <module>
    total = price * qty
NameError: name 'qty' is not defined
```

### The errors you'll see most

**SyntaxError**: not valid Python, such as a missing colon or quote. **IndentationError**: inconsistent spacing. **NameError**: a name that doesn't exist, often a typo. **TypeError**: an operation on the wrong type, like `"a" + 1`. **ValueError**: the right type but a bad value, like `int("abc")`. **ZeroDivisionError**: dividing by zero.


### Logic errors

The hardest bugs produce no error at all: the program runs and gives the wrong answer. To find them, **print the values** at key points and compare them with what you expected.

```python
average = 10 + 20 / 2          # expected 15
print("DEBUG average =", average)  # shows 20.0, so precedence is the bug
average = (10 + 20) / 2
```

### A debugging routine

1) Read the whole error message. 2) Go to the line it names, and also look at the line above. 3) Say what you expected versus what happened. 4) Change one thing at a time and rerun. 5) If you're stuck, print variables. Pasting the last line of the error into a search engine is also a normal, professional move.


## Exercises

1. Name the error each line will cause: a) `print("hi)` b) `print(Name)` when only `name` exists c) `"5" + 5` d) `int("5.5")`

<details><summary>Solution</summary>

```python
# a) SyntaxError: unterminated string
# b) NameError: names are case-sensitive
# c) TypeError: can't add str and int
# d) ValueError: "5.5" isn't a valid int
```

</details>

2. This should print the average of 4, 8 and 9 (7.0) but prints 15.0. Fix it: `print(4 + 8 + 9 / 3)`

<details><summary>Solution</summary>

```python
print((4 + 8 + 9) / 3)   # 7.0
```

</details>

## Project: Bug hunt

Below are ten broken programs. Copy the broken version into `day11_bugs.py`, run it, read the error, and fix it. Do them one at a time. The solution shows the fixed versions with what was wrong; only open it after trying.

Files in this folder: `day11_bugs.py`, plus a starter file.

### Key lines explained

- `Bugs 1 to 8`: Each one produces a traceback. The last line of each traceback told you exactly what kind of problem it was.
- `Bugs 9 and 10`: Logic errors. Python can't detect these; only testing against expected results catches them.

### Stretch goals

- Write three new buggy programs for a friend to fix, or swap with me and I'll fix yours.
- Keep a file called `my_errors.md` and note each new error you meet in the coming days.

## Test it

- [ ] Each fixed program runs without a traceback.
- [ ] Bugs 9 and 10 now print the expected result.
- [ ] For each bug, you can explain in one sentence what the error message meant.
