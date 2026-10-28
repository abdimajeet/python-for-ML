# day59_habits.py
# A habit tracker with all SQL inside a repository class.

import sqlite3
from datetime import date, timedelta
from pathlib import Path

DB_FILE = Path(__file__).parent / "habits.db"


class HabitRepository:
    def __init__(self, path=DB_FILE):
        self.conn = sqlite3.connect(path)
        self.conn.row_factory = sqlite3.Row
        self.conn.execute("PRAGMA foreign_keys = ON")
        self.conn.executescript("""
            CREATE TABLE IF NOT EXISTS habits (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                created TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS check_ins (
                id INTEGER PRIMARY KEY,
                habit_id INTEGER NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
                day TEXT NOT NULL,
                UNIQUE (habit_id, day)
            );
        """)

    # ----- Create -----
    def add_habit(self, name):
        with self.conn:
            cur = self.conn.execute("INSERT INTO habits (name, created) VALUES (?, ?)",
                                    (name, date.today().isoformat()))
        return cur.lastrowid

    def check_in(self, habit_id, day=None):
        """Record a check-in. Returns False if already checked in that day."""
        day = (day or date.today()).isoformat()
        try:
            with self.conn:
                self.conn.execute("INSERT INTO check_ins (habit_id, day) VALUES (?, ?)",
                                  (habit_id, day))
            return True
        except sqlite3.IntegrityError:
            return False

    # ----- Read -----
    def habits(self):
        return self.conn.execute("SELECT id, name, created FROM habits ORDER BY name").fetchall()

    def days_done(self, habit_id):
        rows = self.conn.execute("SELECT day FROM check_ins WHERE habit_id = ?", (habit_id,))
        return {date.fromisoformat(r["day"]) for r in rows}

    # ----- Update -----
    def rename(self, habit_id, new_name):
        with self.conn:
            cur = self.conn.execute("UPDATE habits SET name = ? WHERE id = ?", (new_name, habit_id))
        return cur.rowcount == 1

    # ----- Delete -----
    def delete(self, habit_id):
        with self.conn:
            cur = self.conn.execute("DELETE FROM habits WHERE id = ?", (habit_id,))
        return cur.rowcount == 1


def current_streak(days, today=None):
    """Consecutive days up to today (or up to yesterday if today isn't done yet)."""
    today = today or date.today()
    day = today if today in days else today - timedelta(days=1)
    streak = 0
    while day in days:
        streak += 1
        day -= timedelta(days=1)
    return streak


def last_week(days, today=None):
    today = today or date.today()
    return "".join("■" if today - timedelta(days=i) in days else "·" for i in range(6, -1, -1))


def show(repo):
    habits = repo.habits()
    if not habits:
        print("No habits yet.")
        return
    print(f"{'#':>3}  {'Habit':<22}{'Last 7 days':<13}Streak")
    for h in habits:
        days = repo.days_done(h["id"])
        print(f"{h['id']:>3}  {h['name']:<22}{last_week(days):<13}{current_streak(days)}")


def ask_id():
    try:
        return int(input("Habit number: "))
    except ValueError:
        return None


def main():
    repo = HabitRepository()
    while True:
        print()
        show(repo)
        print("\na) Add  c) Check in  r) Rename  d) Delete  q) Quit")
        choice = input("Choose: ").strip().lower()
        if choice == "a":
            name = input("New habit: ").strip()
            try:
                if name:
                    repo.add_habit(name)
            except sqlite3.IntegrityError:
                print("You already have a habit with that name.")
        elif choice == "c":
            habit_id = ask_id()
            if habit_id is not None:
                print("Checked in!" if repo.check_in(habit_id) else "Already done today (or no such habit).")
        elif choice == "r":
            habit_id = ask_id()
            if habit_id is not None and not repo.rename(habit_id, input("New name: ").strip()):
                print("No such habit.")
        elif choice == "d":
            habit_id = ask_id()
            if habit_id is not None and input("Type yes to delete: ") == "yes":
                print("Deleted." if repo.delete(habit_id) else "No such habit.")
        elif choice == "q":
            break


if __name__ == "__main__":
    main()
