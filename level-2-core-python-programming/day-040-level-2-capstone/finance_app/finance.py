"""Pure calculations on transactions. No input() or print() here."""

import csv


def month_of(t):
    return t["date"][:7]


def for_month(transactions, month):
    return [t for t in transactions if month_of(t) == month]


def summary(transactions):
    income = sum(t["amount"] for t in transactions if t["type"] == "income")
    spending = sum(t["amount"] for t in transactions if t["type"] == "expense")
    return income, spending, income - spending


def spending_by_category(transactions):
    totals = {}
    for t in transactions:
        if t["type"] == "expense":
            totals[t["category"]] = totals.get(t["category"], 0) + t["amount"]
    return totals


def budget_status(transactions, budgets):
    """Return (category, spent, budget, share) for each budgeted category, worst first."""
    spent = spending_by_category(transactions)
    rows = [(c, spent.get(c, 0), b, spent.get(c, 0) / b) for c, b in budgets.items() if b > 0]
    return sorted(rows, key=lambda r: r[3], reverse=True)


def search(transactions, text):
    text = text.lower()
    return [t for t in transactions
            if text in t["note"].lower() or text in t["category"].lower()]


def months(transactions):
    return sorted({month_of(t) for t in transactions}, reverse=True)


def export_csv(transactions, path):
    fields = ["date", "type", "category", "amount", "note"]
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(sorted(transactions, key=lambda t: t["date"]))
    return len(transactions)
