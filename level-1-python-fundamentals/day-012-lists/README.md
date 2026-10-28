# Day 12: Lists

**Level 1, Python Fundamentals.** Project: **To-do list**

A list holds many values in order under one name. It's the most-used data structure in Python.

## Lesson

### Creating lists and indexing

Write a list with square brackets and commas. Items can be any type. Indexing starts at **0**. Negative indexes count from the end, so `[-1]` is the last item. `len()` gives the length.

```python
fruits = ["apple", "banana", "mango"]
print(fruits[0])     # apple
print(fruits[-1])    # mango
print(len(fruits))   # 3
```

### Lists can change

Lists are **mutable**: you can change them after creating them. `append(x)` adds to the end, `insert(i, x)` adds at a position, `remove(x)` deletes the first matching value, `pop(i)` removes and returns the item at index `i`, and `lst[i] = x` replaces one.

```python
fruits.append("orange")
fruits.insert(0, "kiwi")
fruits.remove("banana")
last = fruits.pop()       # removes "orange"
fruits[0] = "lemon"
print(fruits, last)
```

Output:

```text
['lemon', 'apple', 'mango'] orange
```

### Checking membership

`x in my_list` is True if the value is in the list. Use it before `remove()`, which raises a ValueError if the item isn't there.

```python
if "apple" in fruits:
    fruits.remove("apple")
```

### Looping over a list

Loop over items directly, just like strings. An empty list is falsy, so `if not tasks:` means "if there are no tasks".

```python
for fruit in fruits:
    print("I like", fruit)
```

## Exercises

1. Make a list of 5 numbers. Print the first, the last, and the length.

<details><summary>Solution</summary>

```python
nums = [4, 8, 15, 16, 23]
print(nums[0], nums[-1], len(nums))
```

</details>

2. Start with an empty list. Ask for 3 names and append each one. Print the list.

<details><summary>Solution</summary>

```python
names = []
for i in range(3):
    names.append(input("Name: "))
print(names)
```

</details>

3. Given `scores = [55, 90, 72]`, loop through and print only the scores of 70 or more.

<details><summary>Solution</summary>

```python
scores = [55, 90, 72]
for s in scores:
    if s >= 70:
        print(s)
```

</details>

## Project: To-do list

A menu-driven to-do list that lets the user view, add and remove tasks until they quit. Tasks live in a list while the program runs; on Day 32 you'll save them to a file.

Files in this folder: `day12_todo.py`.

### Key lines explained

- `tasks = []`: An empty list, created once before the loop so it keeps its contents between menu choices.
- `if not tasks:`: An empty list is falsy, so this reads as "if there are no tasks".
- `tasks.pop(number - 1)`: Users count from 1 but Python counts from 0, so we subtract 1. `pop` returns the removed task so we can show it.
- `1 <= number <= len(tasks)`: A guard so a bad number gives a message instead of an IndexError.

### Stretch goals

- Add an option to mark a task as done by adding "✓ " to the start of its text.
- On Day 25 you'll learn `enumerate()`, which replaces the manual `number` counter.

## Test it

- [ ] View the list when it is empty.
- [ ] Add three tasks, remove the middle one, and check the numbering.
- [ ] Try to remove task 0 and task 99.
- [ ] Type a letter in the menu.
