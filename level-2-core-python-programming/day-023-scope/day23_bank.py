# day23_bank.py
# A bank account built without global variables.

MIN_BALANCE = 0


def record(history, kind, amount, balance):
    """Append one transaction to the shared history list."""
    history.append((kind, amount, balance))


def deposit(balance, amount, history):
    if amount <= 0:
        print("Deposits must be positive.")
        return balance
    balance += amount
    record(history, "deposit", amount, balance)
    return balance


def withdraw(balance, amount, history):
    if amount <= 0:
        print("Withdrawals must be positive.")
        return balance
    if balance - amount < MIN_BALANCE:
        print(f"Insufficient funds. Balance is {balance:.2f}.")
        return balance
    balance -= amount
    record(history, "withdraw", amount, balance)
    return balance


def show_history(history):
    if not history:
        print("No transactions yet.")
        return
    print(f"{'Type':<10}{'Amount':>10}{'Balance':>10}")
    for kind, amount, balance in history:
        print(f"{kind:<10}{amount:>10.2f}{balance:>10.2f}")


def main():
    balance = 0.0
    history = []

    while True:
        print()
        print(f"Balance: {balance:.2f}")
        print("1) Deposit  2) Withdraw  3) History  4) Quit")
        choice = input("Choose: ")

        if choice == "1":
            balance = deposit(balance, float(input("Amount: ")), history)
        elif choice == "2":
            balance = withdraw(balance, float(input("Amount: ")), history)
        elif choice == "3":
            show_history(history)
        elif choice == "4":
            print("Goodbye!")
            break
        else:
            print("Please choose 1 to 4.")


main()
