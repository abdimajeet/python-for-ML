"""Load and save the app's data as JSON."""

import json
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "data.json"


def load(path=DATA_FILE):
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        data = {}
    except json.JSONDecodeError:
        backup = path.with_suffix(".broken.json")
        path.replace(backup)
        print(f"Your data file was damaged and was moved to {backup.name}.")
        data = {}
    return {"budgets": data.get("budgets", {}),
            "transactions": data.get("transactions", [])}


def save(data, path=DATA_FILE):
    temp = path.with_suffix(".tmp")
    with open(temp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    temp.replace(path)          # swap in the new file only once it is fully written
