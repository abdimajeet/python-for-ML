"""Reading and writing expenses to CSV. No printing here."""

import csv
from datetime import date
from pathlib import Path

CSV_FILE = Path(__file__).parent.parent / "expenses.csv"
FIELDS = ["date", "category", "amount", "note"]


def load_expenses(path=CSV_FILE):
    if not path.exists():
        return []
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row["amount"] = float(row["amount"])
    return rows


def add_expense(category, amount, note="", path=CSV_FILE):
    is_new = not path.exists()
    with open(path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        if is_new:
            writer.writeheader()
        writer.writerow({"date": date.today().isoformat(), "category": category,
                         "amount": f"{amount:.2f}", "note": note})
