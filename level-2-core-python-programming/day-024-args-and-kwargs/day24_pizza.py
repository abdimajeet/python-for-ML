# day24_pizza.py
# Builds pizza orders using *args and **kwargs.

SIZES = {"small": 8.00, "medium": 10.00, "large": 12.50}
TOPPING_PRICE = 1.25
EXTRA_PRICES = {"extra_cheese": 1.50, "stuffed_crust": 2.00, "gluten_free": 2.50}


def make_pizza(size, *toppings, **extras):
    """Return a dict describing one pizza and its price."""
    if size not in SIZES:
        raise ValueError(f"Unknown size: {size}")

    price = SIZES[size] + TOPPING_PRICE * len(toppings)
    chosen_extras = []
    for name, wanted in extras.items():
        if wanted and name in EXTRA_PRICES:
            price += EXTRA_PRICES[name]
            chosen_extras.append(name.replace("_", " "))

    return {
        "size": size,
        "toppings": toppings,
        "extras": chosen_extras,
        "price": round(price, 2),
    }


def describe(pizza):
    text = pizza["size"].title() + " pizza"
    if pizza["toppings"]:
        text += " with " + ", ".join(pizza["toppings"])
    if pizza["extras"]:
        text += " (+ " + ", ".join(pizza["extras"]) + ")"
    return text


def ask_for_pizza():
    size = input("Size (small/medium/large): ").strip().lower()
    raw = input("Toppings, separated by commas: ")
    toppings = []
    for t in raw.split(","):
        if t.strip():
            toppings.append(t.strip())
    cheese = input("Extra cheese? (y/n): ").strip().lower() == "y"
    return make_pizza(size, *toppings, extra_cheese=cheese)


def main():
    order = [
        make_pizza("large", "mushroom", "olives", extra_cheese=True),
        make_pizza("small"),
    ]
    print("Two pizzas are already in the basket. Add one more:")
    order.append(ask_for_pizza())

    print()
    total = 0
    for number, pizza in enumerate(order, start=1):
        print(f"{number}. {describe(pizza):<55}{pizza['price']:>7.2f}")
        total += pizza["price"]
    print(f"{'TOTAL':<58}{total:>7.2f}")


main()
