# Day 32: JSON

**Level 2, Core Python Programming.** Project: **To-do list that remembers**

JSON is the most common format for saving structured data and exchanging it between programs and web APIs. Today your to-do list learns to remember.

## Lesson

### What JSON looks like

JSON (JavaScript Object Notation) is text that looks almost exactly like Python dicts and lists. Objects use `{}`, arrays `[]`, strings must use double quotes, and it has `true`, `false` and `null`.

```python
{
  "name": "Amina",
  "age": 24,
  "skills": ["python", "sql"],
  "employed": true,
  "manager": null
}
```

### Type mapping

dict ↔ object, list ↔ array, str ↔ string, int/float ↔ number, True/False ↔ true/false, None ↔ null. Tuples become arrays and come back as lists. Sets and dates can't be saved directly; convert them first (to a list, or to a date string).


### Saving and loading files

`json.dump(data, f)` writes to an open file. `json.load(f)` reads it back. `indent=2` makes the file readable by humans.

```python
import json

data = {"tasks": ["study", "exercise"], "streak": 5}
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

with open("data.json", encoding="utf-8") as f:
    loaded = json.load(f)
print(loaded["streak"])
```

Output:

```text
5
```

### Strings instead of files

`json.dumps(data)` (with an s, for "string") returns JSON text; `json.loads(text)` parses it. You'll use these with web APIs on Day 56.


### When the file is broken

If a JSON file was edited badly, `json.load` raises `json.JSONDecodeError`. A robust program catches it alongside `FileNotFoundError`.


## Exercises

1. Save a dict of three friends and their birthdays to `friends.json` with indentation, then open the file in VS Code.

<details><summary>Solution</summary>

```python
import json
friends = {"Amina": "03-14", "Omar": "07-02", "Sara": "11-30"}
with open("friends.json", "w", encoding="utf-8") as f:
    json.dump(friends, f, indent=2)
```

</details>

2. Load it back and add a new friend, then save again.

<details><summary>Solution</summary>

```python
with open("friends.json", encoding="utf-8") as f:
    friends = json.load(f)
friends["Yusuf"] = "01-09"
with open("friends.json", "w", encoding="utf-8") as f:
    json.dump(friends, f, indent=2)
```

</details>

3. What does `json.dumps({"ok": True, "x": None})` return?

<details><summary>Solution</summary>

```python
'{"ok": true, "x": null}'
```

</details>

## Project: To-do list that remembers

Upgrade the Day 12 to-do list. Each task is now a dict with a title, a done flag and a priority, and the list is saved to `tasks.json` after every change. A missing or corrupted file is handled gracefully.

Files in this folder: `day32_todo_json.py`.

### Key lines explained

- `DATA_FILE = Path(__file__).parent / "tasks.json"`: Saves next to the script, wherever you run it from. This fixes the working-directory surprise from Day 29.
- `except FileNotFoundError: return []`: The first run has no file; that's normal, not an error the user needs to see.
- `{"title": ..., "done": False, "priority": ...}`: Each task is a dict, so adding a field later (like a due date) doesn't break anything.
- `if i is not None:`: Index 0 is a valid task but is falsy, so `if i:` would be a bug. Always compare with `None` explicitly.
- `save_tasks(tasks) at the bottom of the loop`: Every action that changes something reaches this line; invalid choices `continue` past it.

### Stretch goals

- Add a due date stored as a `"YYYY-MM-DD"` string, and show overdue tasks first (after Day 38).
- Sort high-priority tasks to the top when displaying.

## Test it

- [ ] Add tasks, quit, run again: they're still there.
- [ ] Open `tasks.json` and edit a title by hand; the program should load it.
- [ ] Break the file on purpose (delete a bracket) and run again.
- [ ] Try removing task 0 and typing letters as the number.
