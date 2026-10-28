# day27_filter_toolkit.py
# Answers questions about an inventory using comprehensions.

PRODUCTS = [
    {"name": "Laptop", "category": "electronics", "price": 899.00, "stock": 4},
    {"name": "Headphones", "category": "electronics", "price": 59.99, "stock": 0},
    {"name": "Desk lamp", "category": "home", "price": 24.50, "stock": 12},
    {"name": "Notebook", "category": "stationery", "price": 3.20, "stock": 150},
    {"name": "Office chair", "category": "home", "price": 149.00, "stock": 2},
    {"name": "Pen set", "category": "stationery", "price": 7.80, "stock": 0},
    {"name": "Monitor", "category": "electronics", "price": 179.00, "stock": 6},
]


def in_stock(products):
    return [p for p in products if p["stock"] > 0]


def names(products):
    return [p["name"] for p in products]


def categories(products):
    return sorted(set(p["category"] for p in products))


def with_vat(products, rate=0.16):
    return [{**p, "price": round(p["price"] * (1 + rate), 2)} for p in products]


def stock_value(products):
    return sum(p["price"] * p["stock"] for p in products)


def search(products, category=None, max_price=None):
    return [
        p for p in products
        if (category is None or p["category"] == category)
        and (max_price is None or p["price"] <= max_price)
    ]


def main():
    print("Out of stock:", names([p for p in PRODUCTS if p["stock"] == 0]))
    print("Categories:  ", categories(PRODUCTS))
    print(f"Stock value:  {stock_value(PRODUCTS):,.2f}")
    print()

    category = input(f"Category {categories(PRODUCTS)} or blank for all: ").strip().lower()
    limit = input("Maximum price, or blank for no limit: ").strip()

    results = search(
        in_stock(PRODUCTS),
        category=category or None,
        max_price=float(limit) if limit else None,
    )
    if not results:
        print("Nothing matches.")
    for p in with_vat(results):
        print(f"  {p['name']:<14}{p['price']:>9.2f} incl. VAT   ({p['stock']} left)")


main()
