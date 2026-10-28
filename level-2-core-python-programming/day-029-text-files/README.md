# Day 29: Text files

**Level 2, Core Python Programming.** Project: **Daily journal app**

Until now, everything disappeared when the program ended. Today you read and write text files, so programs can remember things.

## Lesson

### Opening a file with with

`open(path, mode)` opens a file. Always use it in a `with` block, which closes the file automatically, even if an error happens. Give `encoding="utf-8"` so accented letters and emoji work the same on every computer.

```python
with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("First line\n")
    f.write("Second line\n")
```

### Modes

`"r"` read (the default; the file must exist). `"w"` write: creates the file, or **erases** it if it exists. `"a"` append: adds to the end. `write()` does not add a newline for you; include `\n` yourself.


### Reading

`f.read()` returns the whole file as one string. Looping over the file object gives one line at a time, which also works for huge files. Each line still ends with `\n`, so use `rstrip("\n")` or `strip()`.

```python
with open("notes.txt", encoding="utf-8") as f:
    for number, line in enumerate(f, start=1):
        print(number, line.rstrip("\n"))
```

Output:

```text
1 First line
2 Second line
```

### Where is the file?

A relative path like `"notes.txt"` is relative to the **current working directory**: the folder your terminal is in when you run the program, not necessarily where the script is. If a file "disappears", check where you ran from. Day 30 shows a more reliable way.


### Checking a file exists

Reading a missing file raises `FileNotFoundError`. For now, check first with `os.path.exists(path)`. On Day 31 you'll learn to handle the error directly.


## Exercises

1. Write three of your goals to `goals.txt`, one per line, then read them back and print them numbered.

<details><summary>Solution</summary>

```python
goals = ["Learn Python", "Build 100 projects", "Study ML"]
with open("goals.txt", "w", encoding="utf-8") as f:
    for g in goals:
        f.write(g + "\n")

with open("goals.txt", encoding="utf-8") as f:
    for i, line in enumerate(f, start=1):
        print(i, line.strip())
```

</details>

2. Count the lines, words and characters in a text file.

<details><summary>Solution</summary>

```python
with open("goals.txt", encoding="utf-8") as f:
    text = f.read()
print(len(text.splitlines()), len(text.split()), len(text))
```

</details>

3. Append a new goal without erasing the others.

<details><summary>Solution</summary>

```python
with open("goals.txt", "a", encoding="utf-8") as f:
    f.write("Get a job in AI\n")
```

</details>

## Project: Daily journal app

A journal that stores entries in `journal.txt`. Users can write an entry (saved with today's date), read every entry, and search for a word. Entries survive after the program closes.

Files in this folder: `day29_journal.py`.

### Key lines explained

- `from datetime import date`: A preview of Day 38. `date.today().isoformat()` gives a date string like `2026-10-24`, which also sorts correctly as text.
- `open(JOURNAL_FILE, "a", ...)`: Append mode adds each entry to the end and creates the file the first time.
- `f"{today}\n{text}\n{SEPARATOR}\n"`: We decide the file format ourselves: a date line, the text, then a separator line. Reading must follow the same format.
- `block.strip().split("\n", 1)`: The second argument limits it to one split, so multi-line entries stay in one piece.
- `if not os.path.exists(JOURNAL_FILE): return []`: On the very first run there's no file yet. Returning an empty list lets the rest of the program carry on.

### Stretch goals

- Add a mood rating from 1 to 5 to each entry.
- Show how many entries you wrote this month.

## Test it

- [ ] Read before writing anything.
- [ ] Write two entries, quit, run again and read: both should be there.
- [ ] Write an entry containing the separator `---`. What breaks? Day 32 will show a better format (JSON).
- [ ] Open `journal.txt` in VS Code and look at the format.
