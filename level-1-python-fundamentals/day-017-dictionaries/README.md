# Day 17: Dictionaries

**Level 1, Python Fundamentals.** Project: **Contact book**

Dictionaries map keys to values, like a real dictionary maps words to meanings. They are everywhere in Python and in ML code.

## Lesson

### Creating and reading

Write a dict with curly braces and `key: value` pairs. Read a value with `d[key]`. Keys are usually strings and must be unique. If the key is missing, `d[key]` raises a **KeyError**, whereas `d.get(key)` returns `None` or a default you give it.

```python
ages = {"Amina": 24, "Omar": 31}
print(ages["Amina"])
print(ages.get("Sara"))        # None
print(ages.get("Sara", 0))     # 0
```

### Adding, changing and deleting

Assigning to a key adds it if it's new or replaces it if it exists. `del d[key]` or `d.pop(key)` removes it. `key in d` checks if a key exists.

```python
ages["Sara"] = 19      # add
ages["Omar"] = 32      # update
del ages["Amina"]
print("Sara" in ages, ages)
```

Output:

```text
True {'Omar': 32, 'Sara': 19}
```

### Looping

Looping over a dict gives its keys. `.items()` gives (key, value) pairs you can unpack. `.keys()` and `.values()` give one side. Dicts remember the order you inserted things.

```python
for name, age in ages.items():
    print(f"{name} is {age}")
```

### Why dicts are fast

Looking up a key in a dict is nearly instant even with millions of entries, while searching a list checks every item. When you find yourself searching a list for something by name, a dict is usually the better choice.


## Exercises

1. Make a dict of three countries and their capitals, then print each pair with an f-string.

<details><summary>Solution</summary>

```python
capitals = {"Kenya": "Nairobi", "Somalia": "Mogadishu", "Egypt": "Cairo"}
for country, city in capitals.items():
    print(f"The capital of {country} is {city}")
```

</details>

2. Ask for a country and print its capital, or "Unknown" if it's not in the dict, without an error.

<details><summary>Solution</summary>

```python
country = input("Country: ")
print(capitals.get(country, "Unknown"))
```

</details>

3. Count how many times each letter appears in a word, using a dict.

<details><summary>Solution</summary>

```python
word = "banana"
counts = {}
for ch in word:
    counts[ch] = counts.get(ch, 0) + 1
print(counts)   # {'b': 1, 'a': 3, 'n': 2}
```

</details>

## Project: Contact book

A menu-driven contact book that maps names to phone numbers. Users can add, look up, update, delete and list contacts.

Files in this folder: `day17_contacts.py`.

### Key lines explained

- `.strip().title()`: Normalising names means "amina " and "Amina" are treated as the same key.
- `contacts[name] = phone`: The same line both adds and updates. We check `name in contacts` beforehand only to choose the message.
- `contacts.get(name)`: Returns `None` for a missing name, which is falsy, so `if phone:` handles both cases without a KeyError.
- `sorted(contacts)`: Sorting a dict gives its keys in alphabetical order.

### Stretch goals

- Store an email too, using a dict as the value: `{"phone": ..., "email": ...}`. That's tomorrow's next step.
- Add a search that finds every name containing some text.

## Test it

- [ ] Add a contact, then add the same name with different capitals. It should update, not duplicate.
- [ ] Look up and delete a name that doesn't exist.
- [ ] List an empty book.
