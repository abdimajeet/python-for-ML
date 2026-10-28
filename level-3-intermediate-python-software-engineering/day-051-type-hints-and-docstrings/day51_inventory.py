# day51_inventory.py
# A fully typed and documented inventory.

from __future__ import annotations


class Item:
    """One product line in the inventory."""

    def __init__(self, sku: str, name: str, price: float, quantity: int = 0) -> None:
        self.sku = sku
        self.name = name
        self.price = price
        self.quantity = quantity

    @property
    def value(self) -> float:
        """Total stock value of this item."""
        return self.price * self.quantity

    def __repr__(self) -> str:
        return f"Item({self.sku!r}, {self.name!r}, {self.price}, {self.quantity})"


class Inventory:
    """A collection of items, looked up by SKU."""

    def __init__(self, low_stock_level: int = 5) -> None:
        self._items: dict[str, Item] = {}
        self.low_stock_level = low_stock_level

    def add(self, item: Item) -> None:
        """Add a new item, or increase stock if the SKU already exists."""
        existing = self._items.get(item.sku)
        if existing is None:
            self._items[item.sku] = item
        else:
            existing.quantity += item.quantity

    def get(self, sku: str) -> Item | None:
        """Return the item with this SKU, or None if there isn't one."""
        return self._items.get(sku)

    def sell(self, sku: str, quantity: int) -> float:
        """Remove stock for a sale and return the sale amount.

        Raises:
            KeyError: If the SKU is unknown.
            ValueError: If there isn't enough stock.
        """
        item = self._items[sku]
        if quantity > item.quantity:
            raise ValueError(f"Only {item.quantity} {item.name} left")
        item.quantity -= quantity
        return item.price * quantity

    def low_stock(self) -> list[Item]:
        return [i for i in self._items.values() if i.quantity <= self.low_stock_level]

    def total_value(self) -> float:
        return sum(i.value for i in self._items.values())

    def search(self, text: str) -> list[Item]:
        text = text.lower()
        return [i for i in self._items.values() if text in i.name.lower()]

    def summary(self) -> dict[str, float | int]:
        return {
            "products": len(self._items),
            "units": sum(i.quantity for i in self._items.values()),
            "value": round(self.total_value(), 2),
        }


def restock_plan(inventory: Inventory, target: int = 20) -> dict[str, int]:
    """Return how many units of each low-stock item to order to reach target."""
    return {item.sku: target - item.quantity for item in inventory.low_stock()}


def main() -> None:
    shop = Inventory(low_stock_level=5)
    shop.add(Item("A100", "USB-C cable", 6.99, 40))
    shop.add(Item("B200", "Wireless mouse", 18.50, 4))
    shop.add(Item("C300", "Laptop stand", 32.00, 7))
    shop.add(Item("D400", "USB hub", 21.00, 2))

    earned = shop.sell("C300", 3)
    print(f"Sold 3 laptop stands for {earned:.2f}")

    try:
        shop.sell("D400", 5)
    except ValueError as error:
        print("Sale refused:", error)

    print("Summary:", shop.summary())
    print("Search 'usb':", shop.search("usb"))
    print("Restock plan:", restock_plan(shop))

    item = shop.get("Z999")
    if item is not None:
        print(item.value)
    else:
        print("Z999 not found")


if __name__ == "__main__":
    main()
