# Day 34: Modules and packages

**Level 2, Core Python Programming.** Project: **Expense tracker as a package**

As programs grow, one file isn't enough. Today you split code into modules and a package, and learn how Python's import system finds them.

## Lesson

### Every .py file is a module

If `helpers.py` sits next to `main.py`, then `import helpers` in main loads it, and you call `helpers.greet()`. Python runs the imported file's top-level code once, the first time it's imported.

```python
# helpers.py
def greet(name):
    return f"Hello, {name}"

# main.py
import helpers
print(helpers.greet("Amina"))
```

### if __name__ == "__main__":

When a file is run directly, its `__name__` is `"__main__"`. When it's imported, `__name__` is the module name. So code under this check runs only when you run the file, not when another file imports it. Put your `main()` call there from now on.

```python
def main():
    print("Running as a program")

if __name__ == "__main__":
    main()
```

### Packages

A **package** is a folder of modules with an `__init__.py` file (it can be empty). Import from it with dots: `from expense_tracker.storage import load_expenses`. Inside the package, modules can import each other with a leading dot: `from .storage import load_expenses`.

```python
day34_expenses/
├── main.py
└── expense_tracker/
    ├── __init__.py
    ├── storage.py
    ├── reports.py
    └── cli.py
```

### How to split code

Group by responsibility. A common split is: **storage** (reading and writing data), **logic** (calculations, no input or print), and **interface** (menus, input, printing). Logic modules that never call `input()` or `print()` are the easiest to test and reuse.


### Running it

Run `python main.py` from the `day34_expenses` folder. Python looks for imports in the folder of the script you ran, then the standard library, then installed packages. Never name your own file `random.py` or `csv.py`, or it will hide the real module.


## Exercises

1. Create `mathtools.py` with `area_circle(r)` and `area_square(s)`, then import and use them from `main.py` in two different ways.

<details><summary>Solution</summary>

```python
# main.py
import mathtools
from mathtools import area_square

print(mathtools.area_circle(2))
print(area_square(3))
```

</details>

2. Add a test call to the bottom of `mathtools.py` under `if __name__ == "__main__":`. Run both files and notice when it runs.

<details><summary>Solution</summary>

```python
# bottom of mathtools.py
if __name__ == "__main__":
    print(area_circle(1))   # only when running mathtools.py directly
```

</details>

## Project: Expense tracker as a package

Reorganise yesterday's expense tracker into a package with three modules: storage, reports and the command-line interface. `main.py` just starts it. Behaviour stays exactly the same; only the structure changes.

Files in this folder: `expense_tracker/__init__.py`, `expense_tracker/storage.py`, `expense_tracker/reports.py`, `expense_tracker/cli.py`, `main.py`.

### Key lines explained

- `expense_tracker/__init__.py`: Marks the folder as a package. A docstring is enough content.
- `Path(__file__).parent.parent / "expenses.csv"`: `storage.py` is inside the package folder, so we go up two levels to keep the CSV next to `main.py`.
- `path=CSV_FILE parameters`: Functions accept a path but default to the real file. Tests on Day 52 will pass a temporary file instead.
- `from .reports import ...`: The dot means "from this package". Relative imports keep the package working even if you rename its folder.
- `reports.py has no input() or print()`: Pure calculation functions. The `__main__` block lets you check them quickly with `python -m expense_tracker.reports`.

### Stretch goals

- Add an `export.py` module that writes the summary to a CSV.
- Run `python -m expense_tracker.reports` from the project folder and explain why `-m` is needed.

## Test it

- [ ] Run `python main.py` and check everything works exactly like Day 33.
- [ ] Copy yesterday's `expenses.csv` next to `main.py`; your old data should load.
- [ ] In the interpreter, `from expense_tracker.reports import total` and call it on a small list.
