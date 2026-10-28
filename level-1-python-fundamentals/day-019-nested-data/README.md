# Day 19: Nested data

**Level 1, Python Fundamentals.** Project: **Quiz app with score tracking**

Real data is nested: lists of dicts, dicts of lists. Today you learn to build and navigate these structures, which is exactly what JSON and API data look like.

## Lesson

### A list of dicts

Each dict is one record, and the list holds many records. This is the shape of a table, and it's how you'll handle data in Level 2 and in pandas later.

```python
students = [
    {"name": "Amina", "score": 88},
    {"name": "Omar", "score": 72},
]
print(students[1]["name"])     # Omar
for s in students:
    print(f"{s['name']}: {s['score']}")
```

### Read the access path left to right

`students[1]["name"]` means: take `students`, get item 1 (a dict), then get its `"name"`. With deeper nesting, just keep going one step at a time. If you get lost, `print()` each step.


### A dict of lists

Useful for grouping. Each key holds a list you can append to.

```python
groups = {"A": ["Amina"], "B": []}
groups["B"].append("Omar")
print(groups)
```

Output:

```text
{'A': ['Amina'], 'B': ['Omar']}
```

### Quotes inside f-strings

Inside an f-string that uses double quotes, use single quotes for dict keys: `f"{s['name']}"`. Mixing them avoids ending the string early.


## Exercises

1. From the `students` list above, print the name of the highest scorer.

<details><summary>Solution</summary>

```python
best = students[0]
for s in students:
    if s["score"] > best["score"]:
        best = s
print(best["name"])
```

</details>

2. Given `library = {"fiction": ["Dune", "Emma"], "science": ["Cosmos"]}`, print each genre and how many books it has.

<details><summary>Solution</summary>

```python
for genre, books in library.items():
    print(f"{genre}: {len(books)} books")
```

</details>

3. Add a book "Sapiens" to a new genre "history".

<details><summary>Solution</summary>

```python
library["history"] = ["Sapiens"]
```

</details>

## Project: Quiz app with score tracking

Store the quiz as a list of dicts, each with a question, four options and the right answer. Ask each question, track the score, and show a review of wrong answers at the end.

Files in this folder: `day19_quiz.py`.

### Key lines explained

- `QUIZ = [ {...}, ... ]`: The questions are data, separate from the logic. Adding a question means adding a dict, with no new code.
- `"options": {"a": ..., ...}`: A dict inside a dict inside a list. `item["options"][right]` walks two levels deep.
- `enumerate(QUIZ, start=1)`: Gives (number, item) pairs so we don't need a manual counter. You'll study it properly on Day 25.
- `while reply not in item["options"]:`: `in` on a dict checks its keys, so only a, b, c or d gets through.

### Stretch goals

- Shuffle the question order with `random.shuffle(QUIZ)`.
- Write 10 questions about what you learned this week.

## Test it

- [ ] Answer everything right, then everything wrong.
- [ ] Type an invalid letter and uppercase letters.
- [ ] Add a fifth question and check it works with no other changes.
