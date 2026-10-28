# Day 33: CSV

**Level 2, Core Python Programming.** Project: **Expense tracker**

CSV files are the universal format for tables: spreadsheets export them, datasets come as them, and pandas reads them. Today you read and write CSV with the `csv` module.

## Lesson

### What CSV is

Comma-Separated Values: one row per line, columns separated by commas, usually with a header row. A value containing a comma is wrapped in quotes. That quoting is why you should use the `csv` module rather than `split(",")`.

```python
date,category,amount,note
2026-10-01,food,12.50,"Lunch, with friends"
2026-10-02,transport,3.00,Bus
```

### Reading rows as dicts

`csv.DictReader` uses the header row as keys, giving one dict per row. Every value is a **string**, so convert numbers yourself. Open CSV files with `newline=""`, as the documentation recommends.

```python
import csv
with open("expenses.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["category"], float(row["amount"]))
```

### Writing rows

`csv.DictWriter(f, fieldnames=[...])` writes dicts. Call `writeheader()` once for a new file. In append mode, only write the header if the file is new.

```python
rows = [{"name": "Amina", "score": 88}, {"name": "Omar", "score": 72}]
with open("scores.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "score"])
    writer.writeheader()
    writer.writerows(rows)
```

### Plain reader and writer

`csv.reader` gives each row as a list, and `csv.writer` writes lists. DictReader is usually clearer because you use column names instead of positions.


## Exercises

1. Write a CSV of three countries with their population, then read it back and print the total population.

<details><summary>Solution</summary>

```python
import csv
rows = [{"country": "Kenya", "population": 55}, {"country": "Somalia", "population": 18},
        {"country": "Ethiopia", "population": 126}]
with open("countries.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["country", "population"])
    w.writeheader()
    w.writerows(rows)

with open("countries.csv", newline="", encoding="utf-8") as f:
    print(sum(int(r["population"]) for r in csv.DictReader(f)))
```

</details>

2. Open your CSV in a spreadsheet program (Excel, Google Sheets or LibreOffice). Then save a sheet from there as CSV and read it in Python.

<details><summary>Solution</summary>

```python
# No code solution: the point is to see that the same file
# works in both worlds. That's why data scientists love CSV.
```

</details>

## Project: Expense tracker

Record expenses (date, category, amount, note) to `expenses.csv`. List them, total them by category with a percentage breakdown, and filter by month.

Files in this folder: `day33_expenses.py`.

### Key lines explained

- `newline=""`: Stops the csv module from writing blank lines between rows on Windows.
- `row["amount"] = float(row["amount"])`: CSV values are always strings. We convert once when loading, so the rest of the program works with numbers.
- `is_new = not CSV_FILE.exists()`: Checked before opening, because opening in append mode creates the file.
- `sorted(totals, key=totals.get, reverse=True)`: Sorts the categories by their total, biggest first. `key=` is explained fully on Day 37.
- `date.today().isoformat()[:7]`: ISO dates start with year-month, so slicing gives the current month and `startswith` filters by it.

### Stretch goals

- Add a monthly budget per category and warn when you go over.
- Export the summary to a second CSV file.

## Test it

- [ ] Add a note containing a comma, then list: it should display correctly.
- [ ] Open `expenses.csv` in a spreadsheet.
- [ ] Type `ten` as an amount.
- [ ] Run the summary with one category only.
