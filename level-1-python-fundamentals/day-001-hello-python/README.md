# Day 1: Hello, Python

**Level 1, Python Fundamentals.** Project: **Personal intro card printer**

Today you install Python, learn the two ways to run it, and write your first program.

## Lesson

### What Python is

Python is an **interpreted** language. You write plain text in a `.py` file, and a program called the **interpreter** reads it and runs it line by line, top to bottom. There is no separate compile step like in C or Java. When people say "install Python", they mean install that interpreter.


### Install Python

Download the latest Python 3 from **python.org/downloads**. On Windows, tick **Add python.exe to PATH** on the first installer screen; this lets you type `python` in any terminal. On macOS, run the installer from python.org. Then open a terminal (PowerShell on Windows, Terminal on macOS) and check it worked:

```python
python --version
# on macOS/Linux you may need:
python3 --version
```

Output:

```text
Python 3.13.0
```

### Install VS Code

Download VS Code from **code.visualstudio.com**. Open it, go to the Extensions panel (the four-squares icon), search **Python**, and install the one published by Microsoft. Make a folder called `python-100-days` and open it with **File → Open Folder**. Everything for this course lives there.


### Way 1: the interactive interpreter (REPL)

Type `python` (or `python3`) in the terminal and press Enter. The `>>>` prompt means Python is waiting for one line. It runs it immediately and shows the result. This is great for quick experiments. Type `exit()` to leave.

```python
>>> 2 + 3
5
>>> "hello".upper()
'HELLO'
>>> exit()
```

### Way 2: running a file

Real programs live in files. Create `hello.py` in your folder, type the line below, save, and run it from the terminal. In VS Code you can also press the ▶ button in the top right.

```python
print("Hello, Python!")
```

Output:

```text
Hello, Python!
```

### print() and comments

`print()` is a **function**: a named piece of code you call with parentheses. Whatever you put inside the parentheses is its **argument**. Text must be inside quotes, either `"double"` or `'single'`. A line starting with `#` is a **comment**; Python ignores it, so it is a note for humans. Calling `print()` with nothing inside prints an empty line.

```python
# This is a comment. Python skips it.
print("Line one")
print()            # an empty line
print('Line three')
```

Output:

```text
Line one

Line three
```

## Exercises

1. In the REPL, calculate how many minutes are in a week.

   _Hint: 7 days × 24 hours × 60 minutes. Use `*` to multiply._

<details><summary>Solution</summary>

```python
>>> 7 * 24 * 60
10080
```

</details>

2. Write `three_lines.py` that prints your name, your city, and your favourite food on three separate lines.

<details><summary>Solution</summary>

```python
print("AbdyRahman")
print("My city")
print("Rice and chicken")
```

</details>

3. Add a comment above each line of the previous program saying what it prints. Run it again; the output should not change.

<details><summary>Solution</summary>

```python
# my name
print("AbdyRahman")
# where I live
print("My city")
# what I like to eat
print("Rice and chicken")
```

</details>

4. Run `print("Hello"` (missing the closing bracket). Read the error. What word does Python use for this kind of error?

   _Hint: Look at the last line of the message._

<details><summary>Solution</summary>

```python
SyntaxError: '(' was never closed
# A SyntaxError means the code is not valid Python, so nothing runs.
```

</details>

## Project: Personal intro card printer

Write a program that prints a small card introducing you, framed with text characters. This practises running a file, using `print()`, and writing comments.

Files in this folder: `day01_intro_card.py`.

Sample output:

```text
+--------------------------------+
|            ABOUT ME            |
+--------------------------------+
| Name:   AbdyRahman             |
| Goal:   Python for ML and AI   |
| Today:  Day 1 of 100           |
+--------------------------------+

Let's begin!
```

### Key lines explained

- `# day01_intro_card.py`: A comment naming the file. Comments at the top tell a reader what the program does.
- `print("+----...")`: Each `print()` call writes one line and then moves to the next line.
- `print()`: With no argument it prints a blank line, which spaces the card from the closing message.

### Stretch goals

- Add two more rows: a hobby and a language you already know.
- Make the right-hand border line up on every row.

## Test it

- [ ] Run the file from the terminal with `python day01_intro_card.py`, not only with the ▶ button.
- [ ] Check every row's right border lines up.
- [ ] Delete one closing quote, run it, read the error, then fix it.
