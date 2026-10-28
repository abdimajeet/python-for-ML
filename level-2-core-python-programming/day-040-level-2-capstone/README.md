# Day 40: Level 2 capstone

**Level 2, Core Python Programming.** Project: **Personal finance command-line app**

Level 2 capstone. You build a personal finance app that combines functions, modules, files, JSON, CSV, exceptions, comprehensions, sorting and dates. Take two or three days if you need them.

## Lesson

### Plan the features

Record income and expenses with a date, category and note. Set a monthly budget per category. See a monthly report with income, spending, balance and budget warnings. Search transactions. Export a month to CSV for a spreadsheet. Everything is saved to a JSON file.


### Plan the structure

Use the Day 34 split. `storage.py` loads and saves JSON. `finance.py` holds pure calculation functions with no `input` or `print`. `app.py` has the menus. `main.py` starts it.

```python
day40_finance/
├── main.py
├── finance_app/
│   ├── __init__.py
│   ├── storage.py
│   ├── finance.py
│   └── app.py
└── data.json        (created on first run)
```

### Plan the data

One JSON document holds everything. Amounts are positive; the `type` field says income or expense. Dates are ISO strings so they sort and filter as text.

```python
{
  "budgets": {"food": 200, "transport": 60},
  "transactions": [
    {"date": "2026-10-03", "type": "expense", "category": "food",
     "amount": 12.5, "note": "Lunch"}
  ]
}
```

### Review checklist

If any of these feel shaky, revisit the day before starting: functions and return values (21–22), scope (23), built-ins (25), comprehensions (27–28), files and paths (29–30), exceptions (31), JSON (32), CSV (33), packages (34), sorting with keys (37) and dates (38).


## Exercises

1. Before reading the code, write `finance.py`'s function list yourself: name, parameters and what each returns.

<details><summary>Solution</summary>

```python
# month_of(t) -> "YYYY-MM"
# for_month(transactions, month) -> list
# summary(transactions) -> (income, spending, balance)
# spending_by_category(transactions) -> dict
# budget_status(transactions, budgets) -> list of (category, spent, budget, share)
# search(transactions, text) -> list
```

</details>

2. Write the `summary` function using generator expressions.

<details><summary>Solution</summary>

```python
def summary(transactions):
    income = sum(t["amount"] for t in transactions if t["type"] == "income")
    spending = sum(t["amount"] for t in transactions if t["type"] == "expense")
    return income, spending, income - spending
```

</details>

## Project: Personal finance command-line app

Build the app described in the lesson. Try writing each module yourself first, using the plan, then compare with the code below. Run it with `python main.py` from the `day40_finance` folder.

Files in this folder: `finance_app/__init__.py`, `finance_app/storage.py`, `finance_app/finance.py`, `finance_app/app.py`, `main.py`.

### Key lines explained

- `data.get("budgets", {})`: Fills in anything missing, so an empty, damaged or older data file still gives the app the shape it expects.
- `temp.replace(path)`: Writing to a temporary file and then swapping it in means a crash mid-save can never leave a half-written data file. Real applications do this.
- `finance.py has no input() or print()`: All the logic can be tested with plain lists of dicts, which is exactly what you'll do on Day 52.
- `actions = {"1": ("Add expense", lambda: ...)}`: A dict of menu entries: each holds a label and a function to call. Adding a menu item is one line, and the loop never changes.
- `sorted(rows, key=lambda r: r[3], reverse=True)`: Budgets closest to or over their limit are listed first.

### Stretch goals

- Add recurring transactions, such as rent on the 1st of every month.
- Add a yearly report with a text bar chart per month.
- Import transactions from a bank's CSV export.

## Test it

- [ ] Add income and several expenses across two months, then run each report.
- [ ] Set a budget lower than what you spent and check the warning.
- [ ] Search by part of a note.
- [ ] Export a month and open the CSV in a spreadsheet.
- [ ] Quit and restart: everything should still be there.
- [ ] Break `data.json` by hand and check the app recovers and keeps a backup.
