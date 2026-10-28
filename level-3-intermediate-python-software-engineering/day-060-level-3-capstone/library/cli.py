"""Text menus for librarians."""

import logging
from pathlib import Path

from .repository import Repository
from .service import LibraryError, LibraryService

DB_FILE = Path(__file__).parent.parent / "library.db"


def ask_int(prompt: str) -> int:
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Please enter a number.")


def seed(service: LibraryService) -> None:
    if service.repo.search_books(""):
        return
    for title, author, isbn in [
        ("Dune", "Frank Herbert", "9780441013593"),
        ("Python Crash Course", "Eric Matthes", "9781718502703"),
        ("Atomic Habits", "James Clear", "9780735211292"),
        ("Sapiens", "Yuval Noah Harari", "9780062316097"),
    ]:
        service.add_book(title, author, isbn)
    for name in ("Amina", "Omar", "Sara"):
        service.add_member(name)


def main() -> None:
    logging.basicConfig(filename=DB_FILE.with_suffix(".log"), level=logging.INFO,
                        format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    service = LibraryService(Repository(DB_FILE))
    seed(service)

    menu = ("1) Search books  2) Members  3) Borrow  4) Return  "
            "5) Pay fees  6) Overdue  7) Add book  8) Add member  q) Quit")
    while True:
        print("\n" + menu)
        choice = input("Choose: ").strip().lower()
        try:
            if choice == "1":
                for b in service.repo.search_books(input("Search (blank for all): ")):
                    on_loan = any(service.repo.open_loans(book_id=b.id))
                    print(f"  {b.id:>3}  {b.title:<28}{b.author:<22}{'on loan' if on_loan else 'available'}")
            elif choice == "2":
                for m in service.repo.members():
                    loans = len(list(service.repo.open_loans(member_id=m.id)))
                    print(f"  {m.id:>3}  {m.name:<12}{loans} book(s)  owes {m.fees_owed:.2f}")
            elif choice == "3":
                loan = service.borrow(ask_int("Member id: "), ask_int("Book id: "))
                print(f"Borrowed. Due {loan.due}.")
            elif choice == "4":
                fee = service.return_book(ask_int("Book id: "))
                print(f"Returned. Late fee {fee:.2f}." if fee else "Returned on time.")
            elif choice == "5":
                left = service.pay_fees(ask_int("Member id: "), float(input("Amount: ")))
                print(f"Thank you. Still owed: {left:.2f}")
            elif choice == "6":
                for loan in service.overdue():
                    print(f"  Book {loan.book_id} with member {loan.member_id}, due {loan.due}")
            elif choice == "7":
                service.add_book(input("Title: "), input("Author: "), input("ISBN: "))
            elif choice == "8":
                service.add_member(input("Name: "))
            elif choice == "q":
                break
        except (LibraryError, ValueError) as error:
            print("Sorry:", error)
