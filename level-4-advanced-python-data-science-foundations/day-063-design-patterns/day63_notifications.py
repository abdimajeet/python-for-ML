# day63_notifications.py
# Observer, factory and strategy patterns in one small system.

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Callable, Protocol


# ----- Strategy: how a message is worded -----

def short_format(order: Order, old: str, new: str) -> str:
    return f"Order {order.order_id}: {new}"


def detailed_format(order: Order, old: str, new: str) -> str:
    items = ", ".join(order.items)
    return (f"Hi {order.customer}, your order {order.order_id} ({items}) "
            f"changed from '{old}' to '{new}'.")


Formatter = Callable[["Order", str, str], str]


# ----- Factory: building channels from configuration -----

class Channel(Protocol):
    def send(self, to: str, message: str) -> None: ...


class EmailChannel:
    def send(self, to: str, message: str) -> None:
        print(f"  [email to {to}] {message}")


class SmsChannel:
    MAX = 70

    def send(self, to: str, message: str) -> None:
        text = message if len(message) <= self.MAX else message[: self.MAX - 3] + "..."
        print(f"  [sms to {to}] {text}")


class PushChannel:
    def send(self, to: str, message: str) -> None:
        print(f"  [push to {to}'s phone] {message}")


CHANNELS: dict[str, type] = {"email": EmailChannel, "sms": SmsChannel, "push": PushChannel}


def make_channel(kind: str) -> Channel:
    try:
        return CHANNELS[kind]()
    except KeyError:
        raise ValueError(f"Unknown channel '{kind}'. Choose from {list(CHANNELS)}") from None


# ----- Observer: orders notify whoever subscribed -----

Observer = Callable[["Order", str, str], None]


@dataclass
class Order:
    order_id: str
    customer: str
    items: list[str]
    status: str = "placed"
    _observers: list[Observer] = field(default_factory=list, repr=False)

    STATUSES = ("placed", "paid", "packed", "shipped", "delivered", "cancelled")

    def subscribe(self, observer: Observer) -> None:
        self._observers.append(observer)

    def set_status(self, new: str) -> None:
        if new not in self.STATUSES:
            raise ValueError(f"Unknown status: {new}")
        old, self.status = self.status, new
        for observer in self._observers:
            observer(self, old, new)


@dataclass
class Customer:
    name: str
    contact: str
    channels: list[str]
    formatter: Formatter = short_format

    def notifier(self) -> Observer:
        """Build an observer function that sends on all of this customer's channels."""
        channels = [make_channel(kind) for kind in self.channels]

        def notify(order: Order, old: str, new: str) -> None:
            message = self.formatter(order, old, new)
            for channel in channels:
                channel.send(self.contact, message)
        return notify


class AuditLog:
    """Another observer: it records every change, regardless of customer."""

    def __init__(self) -> None:
        self.entries: list[str] = []

    def __call__(self, order: Order, old: str, new: str) -> None:
        self.entries.append(f"{order.order_id}: {old} -> {new}")


def main() -> None:
    audit = AuditLog()
    amina = Customer("Amina", "amina@example.com", ["email", "push"], detailed_format)
    omar = Customer("Omar", "+252612345678", ["sms"])

    order1 = Order("A-1001", "Amina", ["headphones", "USB cable"])
    order2 = Order("A-1002", "Omar", ["laptop stand"])
    order1.subscribe(amina.notifier())
    order1.subscribe(audit)
    order2.subscribe(omar.notifier())
    order2.subscribe(audit)

    for order, status in [(order1, "paid"), (order2, "paid"), (order1, "shipped"),
                          (order2, "cancelled"), (order1, "delivered")]:
        print(f"{order.order_id} -> {status}")
        order.set_status(status)

    print("\nAudit log:")
    for line in audit.entries:
        print("  ", line)

    try:
        make_channel("pigeon")
    except ValueError as error:
        print("\n", error)


if __name__ == "__main__":
    main()
