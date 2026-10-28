# day32_todo_json.py
# A to-do list saved to JSON.

import json
from pathlib import Path

DATA_FILE = Path(__file__).parent / "tasks.json"


def load_tasks():
    try:
        with open(DATA_FILE, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        print("Warning: tasks.json was damaged. Starting with an empty list.")
        return []


def save_tasks(tasks):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2)


def show(tasks):
    if not tasks:
        print("Nothing to do!")
        return
    for i, t in enumerate(tasks, start=1):
        mark = "x" if t["done"] else " "
        flag = " !" if t["priority"] == "high" else ""
        print(f"{i:>2}. [{mark}] {t['title']}{flag}")


def pick(tasks, verb):
    """Ask for a task number and return its index, or None."""
    try:
        n = int(input(f"Number to {verb}: "))
    except ValueError:
        print("Please type a number.")
        return None
    if 1 <= n <= len(tasks):
        return n - 1
    print("No task with that number.")
    return None


def main():
    tasks = load_tasks()
    while True:
        print()
        show(tasks)
        print("\na) Add  d) Done/undone  r) Remove  c) Clear finished  q) Quit")
        choice = input("Choose: ").strip().lower()

        if choice == "a":
            title = input("Task: ").strip()
            if title:
                high = input("High priority? (y/n): ").strip().lower() == "y"
                tasks.append({"title": title, "done": False,
                              "priority": "high" if high else "normal"})
        elif choice == "d":
            i = pick(tasks, "toggle")
            if i is not None:
                tasks[i]["done"] = not tasks[i]["done"]
        elif choice == "r":
            i = pick(tasks, "remove")
            if i is not None:
                print("Removed:", tasks.pop(i)["title"])
        elif choice == "c":
            tasks = [t for t in tasks if not t["done"]]
        elif choice == "q":
            break
        else:
            continue
        save_tasks(tasks)


main()
