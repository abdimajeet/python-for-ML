"""A command-line notes app.

Usage:
    python notes.py add "Buy milk" --tags shopping home
    python notes.py list [--tag shopping]
    python notes.py search milk
    python notes.py delete 3
"""

import argparse
import json
from datetime import datetime
from pathlib import Path

NOTES_FILE = Path(__file__).parent / "notes.json"


def load():
    if not NOTES_FILE.exists():
        return []
    return json.loads(NOTES_FILE.read_text(encoding="utf-8"))


def save(notes):
    NOTES_FILE.write_text(json.dumps(notes, indent=2), encoding="utf-8")


def next_id(notes):
    return max((n["id"] for n in notes), default=0) + 1


def show(notes):
    if not notes:
        print("No notes.")
    for n in notes:
        tags = " ".join(f"#{t}" for t in n["tags"])
        print(f"{n['id']:>3}  {n['created'][:16]}  {n['text']}  {tags}")


def cmd_add(args, notes):
    note = {"id": next_id(notes), "text": args.text,
            "tags": [t.lower() for t in args.tags],
            "created": datetime.now().isoformat(timespec="seconds")}
    notes.append(note)
    save(notes)
    print(f"Added note {note['id']}.")


def cmd_list(args, notes):
    if args.tag:
        notes = [n for n in notes if args.tag.lower() in n["tags"]]
    show(notes)


def cmd_search(args, notes):
    word = args.word.lower()
    show([n for n in notes if word in n["text"].lower()])


def cmd_delete(args, notes):
    remaining = [n for n in notes if n["id"] != args.id]
    if len(remaining) == len(notes):
        print(f"No note {args.id}.")
        return
    save(remaining)
    print(f"Deleted note {args.id}.")


def main():
    parser = argparse.ArgumentParser(description="Simple notes.")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("add")
    p.add_argument("text")
    p.add_argument("--tags", nargs="*", default=[])
    p.set_defaults(func=cmd_add)

    p = sub.add_parser("list")
    p.add_argument("--tag")
    p.set_defaults(func=cmd_list)

    p = sub.add_parser("search")
    p.add_argument("word")
    p.set_defaults(func=cmd_search)

    p = sub.add_parser("delete")
    p.add_argument("id", type=int)
    p.set_defaults(func=cmd_delete)

    args = parser.parse_args()
    args.func(args, load())


if __name__ == "__main__":
    main()
