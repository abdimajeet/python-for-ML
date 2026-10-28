# day45_cart.py
# A shopping cart built by composing small objects.


class Product:
    def __init__(self, sku, name, price):
        self.sku = sku
        self.name = name
        self.price = price

    def __repr__(self):
        return f"Product({self.sku!r}, {self.name!r}, {self.price})"


class LineItem:
    def __init__(self, product, quantity=1):
        self.product = product
        self.quantity = quantity

    def subtotal(self):
        return self.product.price * self.quantity


class PercentOff:
    def __init__(self, percent):
        self.percent = percent

    def amount(self, cart):
        return cart.subtotal() * self.percent / 100

    def describe(self):
        return f"{self.percent}% off everything"


class BuyXGetOneFree:
    def __init__(self, sku, x):
        self.sku = sku
        self.x = x

    def amount(self, cart):
        item = cart.items.get(self.sku)
        if item is None:
            return 0
        free = item.quantity // (self.x + 1)
        return free * item.product.price

    def describe(self):
        return f"Buy {self.x} get 1 free on {self.sku}"


class Cart:
    def __init__(self):
        self.items = {}          # sku -> LineItem
        self.discounts = []

    def add(self, product, quantity=1):
        if product.sku in self.items:
            self.items[product.sku].quantity += quantity
        else:
            self.items[product.sku] = LineItem(product, quantity)

    def remove(self, sku, quantity=1):
        item = self.items.get(sku)
        if item is None:
            return
        item.quantity -= quantity
        if item.quantity <= 0:
            del self.items[sku]

    def apply(self, discount):
        self.discounts.append(discount)

    def subtotal(self):
        return sum(item.subtotal() for item in self.items.values())

    def discount_total(self):
        return sum(d.amount(self) for d in self.discounts)

    def total(self):
        return max(0, self.subtotal() - self.discount_total())

    def __len__(self):
        return sum(item.quantity for item in self.items.values())

    def receipt(self):
        lines = []
        for item in self.items.values():
            lines.append(f"{item.quantity:>3} x {item.product.name:<18}{item.subtotal():>9.2f}")
        lines.append(f"{'Subtotal':<24}{self.subtotal():>9.2f}")
        for d in self.discounts:
            lines.append(f"{d.describe():<24}{-d.amount(self):>9.2f}")
        lines.append(f"{'TOTAL':<24}{self.total():>9.2f}")
        return "\n".join(lines)


def main():
    catalogue = {
        "TEA": Product("TEA", "Green tea (box)", 4.50),
        "MUG": Product("MUG", "Ceramic mug", 9.00),
        "HNY": Product("HNY", "Honey jar", 6.25),
    }
    cart = Cart()
    cart.add(catalogue["TEA"], 3)
    cart.add(catalogue["MUG"])
    cart.add(catalogue["HNY"], 2)
    cart.add(catalogue["TEA"])           # adds to the existing line
    cart.apply(BuyXGetOneFree("TEA", 3))
    cart.apply(PercentOff(10))

    print(f"{len(cart)} items in the cart\n")
    print(cart.receipt())


if __name__ == "__main__":
    main()
