# Day 60: Level 3 capstone

**Level 3, Intermediate Python & Software Engineering.** Project: **Library management system**

Level 3 capstone: a library management system that brings together OOP, a SQLite repository, a service layer with business rules, logging, type hints and a pytest suite. Give it two or three days.

## Lesson

### Layered architecture

Professional applications are split into layers that each have one job. **Models** describe the data (Book, Member, Loan). The **repository** stores and loads them (SQL only). The **service** enforces the business rules (loan limits, late fees) without knowing about SQL or menus. The **CLI** talks to the user. Each layer only talks to the one below it.

```python
day60_library/
├── main.py
├── library/
│   ├── __init__.py
│   ├── models.py       Book, Member, Loan classes
│   ├── repository.py   SQLite storage
│   ├── service.py      rules: borrowing, returns, fees
│   └── cli.py          menus
└── tests/
    └── test_service.py
```

### The rules

A member can hold at most 3 books. Loans last 14 days. Returns after the due date cost 0.25 per day. A member owing more than 5.00 in fees can't borrow until they pay. A book that's on loan can't be borrowed again. Every important action is logged.


### Why this pays off

Because the service receives a repository and an optional date, the tests can use an in-memory database and fixed dates. The rules can be tested in milliseconds without touching your real data or waiting 14 days. This is exactly how real teams structure applications.


### Review checklist

This project uses classes and constructors (41–42), special methods (43), composition (45), properties (46), generators (48), context managers (50), type hints (51), pytest fixtures (52), logging (54), SQL and the repository pattern (58–59). Revisit any that feel unclear before you start.


## Exercises

1. Before reading the code, list the methods `LibraryService` needs, with their parameters and return types.

<details><summary>Solution</summary>

```python
# add_book(title: str, author: str, isbn: str) -> Book
# add_member(name: str) -> Member
# borrow(member_id: int, book_id: int, today: date | None = None) -> Loan
# return_book(book_id: int, today: date | None = None) -> float   (fee charged)
# pay_fees(member_id: int, amount: float) -> float                 (remaining)
# overdue(today: date | None = None) -> list[Loan]
```

</details>

2. Write the test for "a member can't borrow a fourth book" before reading the solution.

<details><summary>Solution</summary>

```python
def test_loan_limit(service, member, books):
    for book in books[:3]:
        service.borrow(member.id, book.id, today=TODAY)
    with pytest.raises(LibraryError, match="limit"):
        service.borrow(member.id, books[3].id, today=TODAY)
```

</details>

## Project: Library management system

Build the layered library system described in the lesson. Write it one layer at a time from the bottom up (models, repository, service, then CLI), and write the service tests as you add each rule. Run it with `python main.py` and test it with `pytest -v` from the `day60_library` folder.

Files in this folder: `library/__init__.py`, `library/models.py`, `library/repository.py`, `library/service.py`, `library/cli.py`, `main.py`, `tests/test_service.py`.

### Key lines explained

- `Repository(":memory:") in the fixture`: Each test gets a brand-new database in memory. Tests can't affect each other or your real `library.db`.
- `class LibraryError(Exception)`: One exception type for broken rules. The CLI catches it and shows the message; tests check it with `pytest.raises(..., match=...)`.
- `def open_loans(...) -> Iterator[Loan]: ... yield`: The repository yields loans one at a time (a generator, Day 48). `any(...)` stops at the first one, and `next(..., None)` takes just one.
- `today: date | None = None`: Every rule that depends on the date accepts it as a parameter, so tests can travel through time instantly.
- `log.warning("Book %s returned %d days late...")`: Late returns are logged as warnings in `library.log`, giving an audit trail of what happened and when.

### Stretch goals

- Add reservations: a member can reserve a book that's on loan and is notified (printed) when it's returned.
- Add a `report` command showing the most borrowed books, using a SQL GROUP BY.
- Run `mypy library` and fix anything it finds.

## Test it

- [ ] `pytest -v` from `day60_library`: 11 tests should pass.
- [ ] Run `python main.py`, borrow and return books, and then read `library.log`.
- [ ] Break a rule in `service.py` (say, change `MAX_LOANS` to 4) and see which test fails.
- [ ] This is a great project for your GitHub profile: write a README explaining the architecture.
