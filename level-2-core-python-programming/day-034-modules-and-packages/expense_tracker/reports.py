"""Calculations on lists of expenses. No input or printing here."""


def total(expenses):
    return sum(e["amount"] for e in expenses)


def totals_by_category(expenses):
    totals = {}
    for e in expenses:
        totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]
    return totals


def for_month(expenses, month):
    """month is a 'YYYY-MM' string."""
    return [e for e in expenses if e["date"].startswith(month)]


def breakdown(expenses):
    """Return (category, amount, share) tuples, biggest first."""
    totals = totals_by_category(expenses)
    grand = sum(totals.values())
    ordered = sorted(totals, key=totals.get, reverse=True)
    return [(c, totals[c], totals[c] / grand) for c in ordered]


if __name__ == "__main__":
    sample = [{"date": "2026-10-01", "category": "food", "amount": 10.0},
              {"date": "2026-10-02", "category": "bus", "amount": 5.0}]
    print(breakdown(sample))
