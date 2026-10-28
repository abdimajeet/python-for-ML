# day16_receipt.py
# Prints a formatted receipt.

SHOP = "Corner Café"
TAX_RATE = 0.16
WIDTH = 36

items = [
    ("Coffee", 2, 3.50),
    ("Croissant", 3, 2.25),
    ("Orange juice", 1, 4.00),
    ("Sandwich", 2, 6.75),
]

print("=" * WIDTH)
print(f"{SHOP:^{WIDTH}}")
print("=" * WIDTH)
print(f"{'Item':<16}{'Qty':>4}{'Price':>8}{'Total':>8}")
print("-" * WIDTH)

subtotal = 0
for name, qty, price in items:
    line_total = qty * price
    subtotal += line_total
    print(f"{name:<16}{qty:>4}{price:>8.2f}{line_total:>8.2f}")

tax = subtotal * TAX_RATE
total = subtotal + tax

print("-" * WIDTH)
print(f"{'Subtotal':<28}{subtotal:>8.2f}")
print(f"{'Tax (' + str(int(TAX_RATE * 100)) + '%)':<28}{tax:>8.2f}")
print(f"{'TOTAL':<28}{total:>8.2f}")
print("=" * WIDTH)
print(f"{'Thank you!':^{WIDTH}}")
