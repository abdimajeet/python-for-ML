"""The text menu: all input() and print() calls live here."""

from datetime import date

from .reports import breakdown, for_month, total
from .storage import add_expense, load_expenses


def show_list(expenses):
    for e in expenses:
        print(f"{e['date']}  {e['category']:<12}{e['amount']:>9.2f}  {e['note']}")
    print(f"{'':12}{'TOTAL':<12}{total(expenses):>9.2f}")


def show_summary(expenses):
    for category, amount, share in breakdown(expenses):
        print(f"{category:<12}{amount:>9.2f}  {share:>5.0%}  {'#' * round(share * 30)}")


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
                expenses = for_month(expenses, date.today().isoformat()[:7])
            if not expenses:
                print("No expenses recorded.")
            elif choice == "3":
                show_summary(expenses)
            else:
                show_list(expenses)
        elif choice == "5":
            break
