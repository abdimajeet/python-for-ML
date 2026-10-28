# Day 65: Regular expressions I

**Level 4, Advanced Python & Data Science Foundations.** Project: **Email and phone number extractor**

Regular expressions (regex) are a mini-language for finding patterns in text: emails, phone numbers, dates, codes. Today you learn the core syntax and Python's `re` module.

## Lesson

### Why regex

String methods find exact text. Regex finds **patterns**: "a word, then an @, then a domain". It's essential for cleaning text data, validating input and parsing logs. Always write patterns as raw strings, `r"..."`, so backslashes reach the regex engine unchanged.


### The building blocks

`\d` digit, `\w` word character (letter, digit, underscore), `\s` whitespace, `.` any character. `[abc]` one of these, `[a-z]` a range, `[^0-9]` anything except. Quantifiers: `*` zero or more, `+` one or more, `?` optional, `{3}` exactly 3, `{2,4}` between 2 and 4. Anchors: `^` start, `$` end, `\b` word boundary. Escape special characters with a backslash: `\.` means a real dot.


### The main functions

`re.search` finds the first match anywhere, `re.fullmatch` requires the whole string to match (for validation), `re.findall` returns every match, `re.finditer` yields match objects, `re.sub` replaces matches and `re.split` splits on a pattern.

```python
import re

text = "Call 0612 345 678 or 0700-123-456 before 5pm."
print(re.findall(r"\d{3,4}[ -]\d{3}[ -]\d{3}", text))
print(bool(re.fullmatch(r"[A-Z]{2}\d{4}", "SO2026")))
print(re.sub(r"\s+", " ", "too    many   spaces"))
```

Output:

```text
['0612 345 678', '0700-123-456']
True
too many spaces
```

### Match objects and flags

`re.search` returns a match object (or `None`). `m.group()` is the matched text, `m.start()` its position. Flags change behaviour: `re.IGNORECASE`, `re.MULTILINE`. `re.compile(pattern)` builds a reusable pattern object.

```python
m = re.search(r"\d+", "Order 4521 shipped")
if m:
    print(m.group(), m.start())
```

Output:

```text
4521 6
```

### Test your patterns

Use **regex101.com** (choose the Python flavour) to build and test patterns visually; it explains every part. Keep patterns as simple as the job allows, and add comments for complex ones (tomorrow you'll learn the VERBOSE flag).


## Exercises

1. Find all hashtags in `"Learning #python and #MachineLearning today #100DaysOfCode"`.

<details><summary>Solution</summary>

```python
print(re.findall(r"#\w+", "Learning #python and #MachineLearning today #100DaysOfCode"))
```

</details>

2. Validate a time like `09:45` or `23:59` with `fullmatch`.

<details><summary>Solution</summary>

```python
def valid_time(t):
    return re.fullmatch(r"([01]\d|2[0-3]):[0-5]\d", t) is not None

print(valid_time("23:59"), valid_time("24:00"))
```

</details>

3. Replace every digit in a string with `#`.

<details><summary>Solution</summary>

```python
print(re.sub(r"\d", "#", "Card 4242 ends 99"))
```

</details>

## Project: Email and phone number extractor

Scan a block of text (or any text file) and extract email addresses, phone numbers, URLs and dates. Normalise each to a standard form, remove duplicates, and optionally produce a redacted copy of the text with personal data hidden.

Files in this folder: `day65_extractor.py`.

### Key lines explained

- `r"\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b"`: A practical email pattern: name characters, @, then a domain with one or more dot-separated parts. `(?:...)` is a group that doesn't capture. Perfectly validating every legal email with regex is famously hard; this is good enough for extraction.
- `re.sub(r"\D", "", match)`: `\D` means "not a digit". Removing them normalises "(061) 234-5678" and "061 234 5678" to the same digits.
- `if 9 <= len(digits) <= 15:`: A sanity check after the regex: it filters out things like invoice numbers that look a bit like phone numbers.
- `list(dict.fromkeys(items))`: Dicts keep insertion order and unique keys, so this removes duplicates while keeping the first-seen order.
- `PHONE.sub(lambda m: ..., text)`: `sub` can take a function that decides the replacement for each match.

### Stretch goals

- Extract money amounts like `99.50` and `$1,200`.
- Run it on a real text file: `python day65_extractor.py notes.txt`.

## Test it

- [ ] The two Amina emails differ only in case and should appear once.
- [ ] The invoice number #4521 must not be counted as a phone.
- [ ] Check the redacted text still reads sensibly.
