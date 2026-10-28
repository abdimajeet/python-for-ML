# Day 35: Recursion

**Level 2, Core Python Programming.** Project: **Folder tree printer**

Recursion is when a function calls itself. It's the natural way to handle things that contain smaller versions of themselves, like folders inside folders.

## Lesson

### The two parts

Every recursive function needs a **base case**, where it returns without calling itself, and a **recursive case**, where it calls itself on a **smaller** problem. Each call moves closer to the base case.

```python
def countdown(n):
    if n == 0:              # base case
        print("Liftoff!")
        return
    print(n)
    countdown(n - 1)        # smaller problem

countdown(3)
```

Output:

```text
3
2
1
Liftoff!
```

### Returning values

The classic example is factorial: 5! = 5 × 4!. Each call waits for the smaller call's answer, then uses it.

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))   # 120
```

### The call stack

Each call is placed on the **call stack** until it returns. `factorial(3)` waits for `factorial(2)`, which waits for `factorial(1)`, which returns 1; then the answers flow back up. Python limits the depth to about 1000 calls. Forget the base case and you get **RecursionError**.


### When to use it

For simple counting, a loop is clearer and faster in Python. Recursion shines with **nested structures**: folder trees, nested lists, JSON documents, and tree-shaped data, including the decision trees you'll build on Day 89.

```python
def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))   # recurse into sub-lists
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, 4]], 5]))
```

Output:

```text
[1, 2, 3, 4, 5]
```

## Exercises

1. Write a recursive `sum_list(numbers)`. Hint: the sum is the first item plus the sum of the rest.

<details><summary>Solution</summary>

```python
def sum_list(numbers):
    if not numbers:
        return 0
    return numbers[0] + sum_list(numbers[1:])
```

</details>

2. Write a recursive `reverse(text)`.

<details><summary>Solution</summary>

```python
def reverse(text):
    if len(text) <= 1:
        return text
    return reverse(text[1:]) + text[0]
```

</details>

3. Write `depth(items)` that returns how deeply a list is nested: `[1, [2, [3]]]` gives 3.

<details><summary>Solution</summary>

```python
def depth(items):
    if not isinstance(items, list):
        return 0
    deepest = 0
    for item in items:
        deepest = max(deepest, depth(item))
    return 1 + deepest
```

</details>

## Project: Folder tree printer

Print a folder and everything inside it as a tree, like the `tree` command, with sizes, a depth limit, and a summary of files, folders and total size.

Files in this folder: `day35_tree.py`.

### Key lines explained

- `f, d, s = tree(item, prefix + extension, depth + 1, max_depth)`: The recursive case: the same function handles a sub-folder, with a longer prefix and a depth one greater. Its totals are added to ours.
- `if depth + 1 < max_depth:`: A depth limit doubles as a base case. The other base case is a folder with no sub-folders: the loop simply finishes.
- `"    " if is_last else "│   "`: Under the last item there's no vertical line to continue, which is what makes the drawing look right.
- `key=lambda p: (p.is_file(), p.name.lower())`: Folders sort first (False before True), then alphabetically. More on `lambda` keys on Day 37.
- `except PermissionError:`: Some system folders can't be read. We show a note and carry on rather than crashing the whole tree.

### Stretch goals

- Show only files with a given extension, such as `.py`.
- Add an option to list the 5 biggest files found.

## Test it

- [ ] Run it on your `python-100-days` folder.
- [ ] Try depth 1 and depth 10.
- [ ] Run it on an empty folder.
- [ ] Compare the file count with your operating system's file explorer.
