"""Menus and input. Uses storage and finance."""

from datetime import date
from pathlib import Path

from . import finance, storage


def ask_amount(prompt):
    while True:
        try:
            value = float(input(prompt))
            if value > 0:
                return round(value, 2)
            print("Enter a positive amount.")
        except ValueError:
            print("Enter a number, e.g. 12.50")


def ask_date():
    text = input("Date (YYYY-MM-DD, blank for today): ").strip()
    if not text:
        return date.today().isoformat()
    try:
        return date.fromisoformat(text).isoformat()
    except ValueError:
        print("Invalid date, using today.")
        return date.today().isoformat()


def ask_month(data):
    available = finance.months(data["transactions"])
    default = date.today().isoformat()[:7]
    if available:
        print("Months with data:", ", ".join(available))
    return input(f"Month (YYYY-MM, blank for {default}): ").strip() or default


def print_rows(rows):
    for t in sorted(rows, key=lambda t: t["date"]):
        sign = "+" if t["type"] == "income" else "-"
        print(f"  {t['date']}  {t['category']:<12}{sign}{t['amount']:>9.2f}  {t['note']}")


def add_transaction(data, kind):
    data["transactions"].append({
        "date": ask_date(),
        "type": kind,
        "category": input("Category: ").strip().lower() or "other",
        "amount": ask_amount("Amount: "),
        "note": input("Note: ").strip(),
    })
    storage.save(data)
    print("Saved.")


def report(data):
    month = ask_month(data)
    rows = finance.for_month(data["transactions"], month)
    if not rows:
        print("No transactions that month.")
        return
    income, spending, balance = finance.summary(rows)
    print(f"\n=== {month} ===")
    print(f"Income   {income:>10.2f}")
    print(f"Spending {spending:>10.2f}")
    print(f"Balance  {balance:>10.2f}")

    print("\nSpending by category:")
    by_cat = finance.spending_by_category(rows)
    for cat in sorted(by_cat, key=by_cat.get, reverse=True):
        print(f"  {cat:<12}{by_cat[cat]:>9.2f}")

    status = finance.budget_status(rows, data["budgets"])
    if status:
        print("\nBudgets:")
        for cat, spent, budget, share in status:
            warning = "  OVER BUDGET" if share > 1 else ("  close" if share > 0.8 else "")
            print(f"  {cat:<12}{spent:>8.2f} / {budget:<8.2f}{share:>5.0%}{warning}")


def set_budget(data):
    category = input("Category: ").strip().lower()
    if category:
        data["budgets"][category] = ask_amount("Monthly budget: ")
        storage.save(data)
        print("Budget saved.")


def main():
    data = storage.load()
    actions = {
        "1": ("Add expense", lambda: add_transaction(data, "expense")),
        "2": ("Add income", lambda: add_transaction(data, "income")),
        "3": ("Monthly report", lambda: report(data)),
        "4": ("Set a budget", lambda: set_budget(data)),
        "5": ("Search", lambda: print_rows(finance.search(data["transactions"], input("Search: ")))),
        "6": ("Export month to CSV", lambda: export(data)),
    }
    while True:
        print()
        for key, (label, _) in actions.items():
            print(f"{key}) {label}")
        print("q) Quit")
        choice = input("Choose: ").strip().lower()
        if choice == "q":
            break
        if choice in actions:
            actions[choice][1]()


def export(data):
    month = ask_month(data)
    rows = finance.for_month(data["transactions"], month)
    path = Path.cwd() / f"finance-{month}.csv"
    count = finance.export_csv(rows, path)
    print(f"Exported {count} transactions to {path.name}")
