# Day 38: Dates and times

**Level 2, Core Python Programming.** Project: **Birthday and event countdown**

Dates are everywhere in real data: timestamps, deadlines, birthdays. Today you learn the `datetime` module properly.

## Lesson

### date, datetime and timedelta

`date` is a calendar day, `datetime` a day plus a time, and `timedelta` a duration. Subtracting two dates gives a timedelta; adding a timedelta to a date gives a new date.

```python
from datetime import date, datetime, timedelta

today = date.today()
exam = date(2026, 12, 15)
print((exam - today).days, "days to go")
print(today + timedelta(weeks=2))
print(datetime.now())
```

### Parsing and formatting

`strptime` (string parse time) reads text into a datetime using a format; `strftime` (string format time) writes one out. Common codes: `%Y` year, `%m` month, `%d` day, `%H:%M` time, `%A` weekday name, `%B` month name.

```python
d = datetime.strptime("24/10/2026", "%d/%m/%Y").date()
print(d.strftime("%A %d %B %Y"))
print(d.isoformat())
```

Output:

```text
Saturday 24 October 2026
2026-10-24
```

### ISO format

`YYYY-MM-DD` is the international standard. It sorts correctly as text, and `date.fromisoformat("2026-10-24")` reads it without a format string. Use it for storing dates in files.


### Comparing and replacing

Dates compare with `<` and `==`. `d.replace(year=2027)` returns a copy with one part changed. Watch out: replacing the year of 29 February in a non-leap year raises ValueError.

```python
birthday = date(2004, 2, 29)
try:
    print(birthday.replace(year=2027))
except ValueError:
    print("No 29 February in 2027")
```

## Exercises

1. Print what weekday you were born on.

<details><summary>Solution</summary>

```python
from datetime import date
print(date(2001, 3, 14).strftime("%A"))
```

</details>

2. Print the date 100 days from today.

<details><summary>Solution</summary>

```python
print(date.today() + timedelta(days=100))
```

</details>

3. Read a date typed like `2026-12-31` and say whether it's in the past or future.

<details><summary>Solution</summary>

```python
d = date.fromisoformat(input("Date (YYYY-MM-DD): "))
print("future" if d > date.today() else "past or today")
```

</details>

## Project: Birthday and event countdown

Enter your birthday to get your exact age and a countdown to your next birthday, then see a sorted countdown for a list of upcoming events. Handles 29 February birthdays and bad date input.

Files in this folder: `day38_countdown.py`.

### Key lines explained

- `(today.month, today.day) < (birthday.month, birthday.day)`: Tuple comparison checks month first, then day, which is exactly "has the birthday happened yet this year?".
- `except ValueError: candidate = date(year, 3, 1)`: A 29 February birthday is celebrated on 1 March in non-leap years.
- `divmod(days, 7)`: A built-in that returns `(days // 7, days % 7)` in one call.
- `sorted((date.fromisoformat(d), name) for ...)`: Tuples sort by their first item, so putting the date first sorts events chronologically.
- `f"{when:%d %b %Y}"`: f-strings accept date format codes directly after the colon.

### Stretch goals

- Load events from a JSON file and add a menu to add new ones.
- Show how many working days (Monday to Friday) remain until each event.

## Test it

- [ ] Use a birthday that was yesterday and one that is tomorrow.
- [ ] Use 2004-02-29.
- [ ] Type `14/03/2001` and check the error message.
- [ ] Check your age by hand.
