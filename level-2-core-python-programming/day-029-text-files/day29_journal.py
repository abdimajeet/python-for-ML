# day29_journal.py
# A journal saved to a text file.

import os
from datetime import date

JOURNAL_FILE = "journal.txt"
SEPARATOR = "---"


def add_entry(text):
    today = date.today().isoformat()          # e.g. "2026-10-24"
    with open(JOURNAL_FILE, "a", encoding="utf-8") as f:
        f.write(f"{today}\n{text}\n{SEPARATOR}\n")


def read_entries():
    """Return a list of (date, text) tuples."""
    if not os.path.exists(JOURNAL_FILE):
        return []
    with open(JOURNAL_FILE, encoding="utf-8") as f:
        content = f.read()

    entries = []
    for block in content.split(SEPARATOR + "\n"):
        lines = block.strip().split("\n", 1)   # split off the first line only
        if len(lines) == 2:
            entries.append((lines[0], lines[1]))
    return entries


def show(entries):
    if not entries:
        print("No entries found.")
    for day, text in entries:
        print(f"\n[{day}]\n{text}")


def main():
    while True:
        print("\n1) Write  2) Read all  3) Search  4) Quit")
        choice = input("Choose: ")
        if choice == "1":
            print("Write your entry. Press Enter on an empty line to finish.")
            lines = []
            while True:
                line = input()
                if not line:
                    break
                lines.append(line)
            if lines:
                add_entry("\n".join(lines))
                print("Saved.")
        elif choice == "2":
            show(read_entries())
        elif choice == "3":
            word = input("Search for: ").lower()
            show([(d, t) for d, t in read_entries() if word in t.lower()])
        elif choice == "4":
            break


main()
