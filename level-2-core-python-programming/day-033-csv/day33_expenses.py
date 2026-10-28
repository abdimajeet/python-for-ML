# day33_expenses.py
# Tracks expenses in a CSV file.

import csv
from datetime import date
from pathlib import Path

CSV_FILE = Path(__file__).parent / "expenses.csv"
FIELDS = ["date", "category", "amount", "note"]


def load_expenses():
    if not CSV_FILE.exists():
        return []
    with open(CSV_FILE, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row["amount"] = float(row["amount"])
    return rows


def add_expense(category, amount, note=""):
    is_new = not CSV_FILE.exists()
    with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        if is_new:
            writer.writeheader()
        writer.writerow({"date": date.today().isoformat(), "category": category,
                         "amount": f"{amount:.2f}", "note": note})


def totals_by_category(expenses):
    totals = {}
    for e in expenses:
        totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]
    return totals


def show_list(expenses):
    for e in expenses:
        print(f"{e['date']}  {e['category']:<12}{e['amount']:>9.2f}  {e['note']}")
    print(f"{'':12}{'TOTAL':<12}{sum(e['amount'] for e in expenses):>9.2f}")


def show_summary(expenses):
    totals = totals_by_category(expenses)
    grand = sum(totals.values())
    for category in sorted(totals, key=totals.get, reverse=True):
        share = totals[category] / grand
        print(f"{category:<12}{totals[category]:>9.2f}  {share:>5.0%}  {'#' * round(share * 30)}")


def main():
    while True:
        print("\n1) Add  2) List  3) Summary  4) This month  5) Quit")
        choice = input("Choose: ")
        if choice == "1":
            category = input("Category: ").strip().lower() or "other"
            try:
                amount = float(input("Amount: "))
            except ValueError:
                print("Amount must be a number.")
                continue
            add_expense(category, amount, input("Note: ").strip())
            print("Saved.")
        elif choice in ("2", "3", "4"):
            expenses = load_expenses()
            if choice == "4":
                month = date.today().isoformat()[:7]          # "2026-10"
                expenses = [e for e in expenses if e["date"].startswith(month)]
            if not expenses:
                print("No expenses recorded.")
            elif choice == "3":
                show_summary(expenses)
            else:
                show_list(expenses)
        elif choice == "5":
            break


main()
