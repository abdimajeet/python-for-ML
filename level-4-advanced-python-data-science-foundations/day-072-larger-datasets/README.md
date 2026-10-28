# Day 72: Larger datasets

**Level 4, Advanced Python & Data Science Foundations.** Project: **Summarise a million-row CSV**

Real datasets can be bigger than your computer's memory. Today you learn to process large files in a stream or in chunks, and to measure memory use.

## Lesson

### Memory is the limit

Reading a file with `f.read()` or `list(csv.reader(f))` loads everything at once. A 5 GB CSV can easily need 20+ GB as Python objects. The fix is to process one row, or one chunk of rows, at a time, keeping only running totals in memory.


### Streaming with csv

Looping over `csv.DictReader` reads one row at a time (Day 48's lazy idea). Memory stays flat no matter how big the file.

```python
import csv

total = 0
with open("sales.csv", newline="") as f:
    for row in csv.DictReader(f):
        total += float(row["amount"])
```

### Chunks with pandas

`pd.read_csv(path, chunksize=100_000)` returns an iterator of DataFrames, each with 100,000 rows. Compute partial results per chunk and combine them. You'll learn pandas properly on Day 75; today you only use a little of it.

```python
import pandas as pd

totals = None
for chunk in pd.read_csv("sales.csv", chunksize=100_000):
    part = chunk.groupby("category")["amount"].sum()
    totals = part if totals is None else totals.add(part, fill_value=0)
```

### Reduce what you load

Load only the columns you need (`usecols=`), choose smaller types (`dtype={"qty": "int32"}`, `"category"` for repeated text), and consider faster file formats like Parquet for data you'll reuse.


### Measuring memory

`tracemalloc` from the standard library reports the peak memory Python allocated. Use it to compare approaches.

```python
import tracemalloc

tracemalloc.start()
# ... run something ...
current, peak = tracemalloc.get_traced_memory()
print(f"peak {peak / 1e6:.1f} MB")
tracemalloc.stop()
```

## Exercises

1. Write a generator that yields rows of a CSV file as dicts with the `amount` already converted to float.

<details><summary>Solution</summary>

```python
def rows(path):
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            row["amount"] = float(row["amount"])
            yield row
```

</details>

2. Using that generator, find the largest single amount without storing all rows.

<details><summary>Solution</summary>

```python
print(max(r["amount"] for r in rows("sales.csv")))
```

</details>

## Project: Summarise a million-row CSV

Generate a one-million-row sales CSV, then summarise it three ways (loading everything into a list, streaming with `csv`, and pandas chunks), measuring time and peak memory for each. All three must agree on the totals. Needs `pip install pandas`.

Files in this folder: `day72_big_csv.py`.

### Key lines explained

- `rows = list(csv.DictReader(f))`: Turns a million rows into a million dicts at once. tracemalloc will show this uses far more memory than the file size.
- `for r in csv.DictReader(f):`: The streaming version keeps only the 7 running totals in memory. Its peak barely changes whether the file has a thousand rows or a billion.
- `usecols=["category", "amount"], dtype={"category": "category"}`: Pandas reads only two columns and stores the repeated category names efficiently.
- `totals.add(part, fill_value=0)`: Combines each chunk's partial sums into the running total, treating missing categories as 0.
- `assert abs(a[category] - b[category]) < 0.01`: Floating-point sums can differ in the last digits depending on order, so we compare with a tolerance.

### Stretch goals

- Also summarise by month and region in the streaming version.
- Save the data as Parquet (`pip install pyarrow`, then `df.to_parquet`) and compare file size and load time.

## Test it

- [ ] Compare the three peak memory figures; the list approach should be by far the largest.
- [ ] Try a chunk size of 10,000 and of 500,000.
- [ ] Add `sales_1m.csv` to `.gitignore`: large data files don't belong in Git.
