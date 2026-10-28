# day72_big_csv.py
# Summarises a million-row CSV three ways and compares memory and time.

import csv
import random
import time
import tracemalloc
from datetime import date, timedelta
from pathlib import Path

import pandas as pd

CSV_FILE = Path(__file__).parent / "sales_1m.csv"
ROWS = 1_000_000
CATEGORIES = ["electronics", "home", "books", "toys", "food", "clothing", "sports"]
REGIONS = ["north", "south", "east", "west"]


def generate(path=CSV_FILE, rows=ROWS, seed=7):
    rng = random.Random(seed)
    start = date(2025, 1, 1)
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["order_id", "date", "region", "category", "qty", "amount"])
        for i in range(rows):
            day = start + timedelta(days=rng.randint(0, 364))
            qty = rng.randint(1, 5)
            writer.writerow([i, day.isoformat(), rng.choice(REGIONS), rng.choice(CATEGORIES),
                             qty, round(qty * rng.uniform(2, 80), 2)])


def summarise_list(path):
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))                 # everything in memory
    totals = {}
    for r in rows:
        totals[r["category"]] = totals.get(r["category"], 0) + float(r["amount"])
    return totals


def summarise_stream(path):
    totals = {}
    with open(path, newline="", encoding="utf-8") as f:
        for r in csv.DictReader(f):                    # one row at a time
            totals[r["category"]] = totals.get(r["category"], 0) + float(r["amount"])
    return totals


def summarise_chunks(path, chunksize=100_000):
    totals = None
    for chunk in pd.read_csv(path, usecols=["category", "amount"],
                             dtype={"category": "category"}, chunksize=chunksize):
        part = chunk.groupby("category", observed=True)["amount"].sum()
        totals = part if totals is None else totals.add(part, fill_value=0)
    return totals.to_dict()


def measure(label, func):
    tracemalloc.start()
    start = time.perf_counter()
    result = func(CSV_FILE)
    seconds = time.perf_counter() - start
    _, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    print(f"{label:<22}{seconds:>8.2f}s{peak / 1e6:>10.1f} MB peak")
    return result


def main():
    if not CSV_FILE.exists():
        print(f"Generating {ROWS:,} rows...")
        generate()
    print(f"{CSV_FILE.name}: {CSV_FILE.stat().st_size / 1e6:.0f} MB on disk\n")
    print(f"{'method':<22}{'time':>9}{'memory':>15}")

    a = measure("load everything", summarise_list)
    b = measure("stream with csv", summarise_stream)
    c = measure("pandas chunks", summarise_chunks)

    for category in sorted(a):
        assert abs(a[category] - b[category]) < 0.01 and abs(a[category] - c[category]) < 0.01
    print("\nAll three methods agree.\n")

    grand = sum(a.values())
    for category, total in sorted(a.items(), key=lambda kv: -kv[1]):
        print(f"  {category:<12}{total:>16,.2f}  {total / grand:6.1%}")


if __name__ == "__main__":
    main()
