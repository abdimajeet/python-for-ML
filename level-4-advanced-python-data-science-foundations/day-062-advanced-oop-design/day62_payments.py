# day62_payments.py
# A checkout with interchangeable payment processors.

from __future__ import annotations

import uuid
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime


class PaymentError(Exception):
    pass


@dataclass(frozen=True)
class Payment:
    amount: float
    currency: str
    customer: str
    details: dict[str, str] = field(default_factory=dict)


@dataclass
class Receipt:
    payment: Payment
    method: str
    fee: float
    reference: str = field(default_factory=lambda: uuid.uuid4().hex[:8].upper())
    time: datetime = field(default_factory=datetime.now)

    @property
    def total(self) -> float:
        return round(self.payment.amount + self.fee, 2)


class PaymentProcessor(ABC):
    name: str = "processor"

    @abstractmethod
    def validate(self, payment: Payment) -> None:
        """Raise PaymentError if the payment can't be made."""

    @abstractmethod
    def fee(self, payment: Payment) -> float: ...

    def pay(self, payment: Payment) -> Receipt:
        """Template method: the same steps for every processor."""
        if payment.amount <= 0:
            raise PaymentError("Amount must be positive")
        self.validate(payment)
        return Receipt(payment, self.name, round(self.fee(payment), 2))


class CardProcessor(PaymentProcessor):
    name = "card"

    def validate(self, payment: Payment) -> None:
        number = payment.details.get("card_number", "").replace(" ", "")
        if not (number.isdigit() and len(number) == 16 and luhn_ok(number)):
            raise PaymentError("Invalid card number")

    def fee(self, payment: Payment) -> float:
        return payment.amount * 0.029 + 0.30


class MobileMoneyProcessor(PaymentProcessor):
    name = "mobile money"
    LIMIT = 1000

    def validate(self, payment: Payment) -> None:
        phone = payment.details.get("phone", "")
        if not phone.startswith("+") or not phone[1:].isdigit():
            raise PaymentError("Phone must look like +252612345678")
        if payment.amount > self.LIMIT:
            raise PaymentError(f"Mobile money limit is {self.LIMIT}")

    def fee(self, payment: Payment) -> float:
        return min(payment.amount * 0.01, 5.0)


class BankTransferProcessor(PaymentProcessor):
    name = "bank transfer"

    def validate(self, payment: Payment) -> None:
        if len(payment.details.get("iban", "")) < 15:
            raise PaymentError("IBAN looks too short")

    def fee(self, payment: Payment) -> float:
        return 1.50


def luhn_ok(number: str) -> bool:
    """The checksum used by real card numbers."""
    total = 0
    for i, digit in enumerate(reversed(number)):
        d = int(digit)
        if i % 2 == 1:
            d = d * 2 - 9 if d > 4 else d * 2
        total += d
    return total % 10 == 0


PROCESSORS: dict[str, PaymentProcessor] = {
    p.name: p for p in (CardProcessor(), MobileMoneyProcessor(), BankTransferProcessor())
}


def checkout(method: str, payment: Payment) -> Receipt:
    processor = PROCESSORS.get(method)
    if processor is None:
        raise PaymentError(f"Unknown payment method: {method}")
    return processor.pay(payment)


def main() -> None:
    attempts = [
        ("card", Payment(120.0, "USD", "Amina", {"card_number": "4242 4242 4242 4242"})),
        ("card", Payment(120.0, "USD", "Omar", {"card_number": "4242 4242 4242 4241"})),
        ("mobile money", Payment(45.0, "USD", "Sara", {"phone": "+252612345678"})),
        ("mobile money", Payment(5000.0, "USD", "Yusuf", {"phone": "+252612345678"})),
        ("bank transfer", Payment(900.0, "EUR", "Hodan", {"iban": "DE89370400440532013000"})),
        ("crypto", Payment(10.0, "USD", "Bilal")),
    ]
    for method, payment in attempts:
        try:
            r = checkout(method, payment)
            print(f"OK   {r.reference}  {payment.customer:<6} {r.method:<14}"
                  f"{payment.amount:>8.2f} + fee {r.fee:>5.2f} = {r.total:>8.2f} {payment.currency}")
        except PaymentError as error:
            print(f"FAIL {payment.customer:<6} via {method}: {error}")


if __name__ == "__main__":
    main()
