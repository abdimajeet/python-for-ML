# Day 15: String methods

**Level 1, Python Fundamentals.** Project: **Password strength checker**

Strings come with dozens of built-in methods. Today you learn the most useful ones and how to examine text character by character.

## Lesson

### Methods return new strings

Strings are immutable, so string methods never change the original. They **return** a new string, which you must store or use. `name.upper()` on its own line does nothing visible.

```python
name = "  amina  "
clean = name.strip().title()
print("[" + name + "]", "[" + clean + "]")
```

Output:

```text
[  amina  ] [Amina]
```

### The everyday methods

`upper()`, `lower()`, `title()` change case. `strip()` removes spaces at both ends. `replace(a, b)` swaps text. `startswith()` and `endswith()` test the ends. `find(x)` returns the position or -1. `count(x)` counts occurrences.

```python
email = "Abdy@Example.com"
print(email.lower())
print(email.endswith(".com"))
print(email.find("@"))
print("banana".count("a"))
```

### split and join

`split()` breaks a string into a list of words; `split(",")` splits on commas. `" ".join(list)` does the reverse, gluing a list of strings with the separator.

```python
words = "learn python today".split()
print(words)
print("-".join(words))
```

Output:

```text
['learn', 'python', 'today']
learn-python-today
```

### Character checks

`isdigit()`, `isalpha()`, `isupper()`, `islower()` and `isspace()` return bools. Combined with a `for` loop they let you inspect every character. `"x" in text` checks for a substring.


## Exercises

1. Ask for a full name typed messily (extra spaces, wrong case) and print it tidy.

<details><summary>Solution</summary>

```python
raw = input("Full name: ")
print(raw.strip().title())
```

</details>

2. Count the words in a sentence.

<details><summary>Solution</summary>

```python
sentence = input("Sentence: ")
print(len(sentence.split()), "words")
```

</details>

3. Turn "hello world from python" into "Hello_World_From_Python".

<details><summary>Solution</summary>

```python
text = "hello world from python"
print("_".join(text.title().split()))
```

</details>

4. Ask for a phone number and print whether it is all digits.

<details><summary>Solution</summary>

```python
phone = input("Phone: ").replace(" ", "")
print(phone.isdigit())
```

</details>

## Project: Password strength checker

Check a password against five rules (length of 8 or more, an uppercase letter, a lowercase letter, a digit, a symbol), give it a score, and list what is missing.

Files in this folder: `day15_password_checker.py`.

Sample output:

```text
Enter a password to check: hello123
Score: 3 / 5  (medium)
To improve it: add an uppercase letter, add a symbol like ! or #.
```

### Key lines explained

- `has_upper = False ...`: **Flags**: bools that start False and flip to True when we find what we're looking for.
- `elif not ch.isspace():`: Any character that isn't a letter, digit or space counts as a symbol.
- `score = 5 - len(tips)`: Each missing rule added one tip, so the number of rules met is 5 minus the tips. One list does two jobs.
- `", ".join(tips)`: Turns the list into one readable sentence.

### Stretch goals

- Reject passwords that contain the word "password" in any case.
- Add a rule against three identical characters in a row.

## Test it

- [ ] An empty password should score 0.
- [ ] `Tr0ub4dor&3` should score 5.
- [ ] Try passwords with spaces in them.
