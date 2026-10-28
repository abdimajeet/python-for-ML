# day38_countdown.py
# Age, next birthday and event countdowns.

from datetime import date

EVENTS = {
    "Finish Level 2": "2026-11-15",
    "Start Machine Learning": "2027-01-20",
    "Python 100 complete": "2027-02-01",
}


def ask_date(prompt):
    while True:
        text = input(prompt).strip()
        try:
            return date.fromisoformat(text)
        except ValueError:
            print("Please use the format YYYY-MM-DD, e.g. 2001-03-14.")


def age_on(birthday, today):
    years = today.year - birthday.year
    if (today.month, today.day) < (birthday.month, birthday.day):
        years -= 1            # birthday hasn't happened yet this year
    return years


def next_birthday(birthday, today):
    for year in (today.year, today.year + 1):
        try:
            candidate = birthday.replace(year=year)
        except ValueError:                     # 29 February in a non-leap year
            candidate = date(year, 3, 1)
        if candidate >= today:
            return candidate


def describe(days):
    if days == 0:
        return "today!"
    if days < 0:
        return f"{-days} days ago"
    weeks, rest = divmod(days, 7)
    return f"in {days} days ({weeks} weeks, {rest} days)"


def main():
    today = date.today()
    birthday = ask_date("Your birthday (YYYY-MM-DD): ")
    if birthday > today:
        print("That's in the future!")
        return

    upcoming = next_birthday(birthday, today)
    print(f"\nYou are {age_on(birthday, today)} years old.")
    print(f"You were born on a {birthday.strftime('%A')}.")
    print(f"Next birthday: {upcoming.strftime('%A %d %B %Y')}, {describe((upcoming - today).days)}")
    print(f"You have been alive for {(today - birthday).days:,} days.")

    print("\nEvents:")
    events = sorted((date.fromisoformat(d), name) for name, d in EVENTS.items())
    for when, name in events:
        print(f"  {when:%d %b %Y}  {name:<24}{describe((when - today).days)}")


if __name__ == "__main__":
    main()
