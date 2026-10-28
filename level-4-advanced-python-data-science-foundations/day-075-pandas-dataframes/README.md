# Day 75: pandas DataFrames

**Level 4, Advanced Python & Data Science Foundations.** Project: **Explore a movies dataset**

pandas is the main tool for working with tables of data in Python. Today you learn Series and DataFrames: loading data, inspecting it, selecting rows and columns, and sorting.

## Lesson

### Series and DataFrame

A **Series** is a one-dimensional labelled array: values plus an **index**. A **DataFrame** is a table: several Series (columns) sharing one index. Under the hood, columns are NumPy arrays, so vectorised maths works. Install with `pip install pandas`; import as `pd` by convention.

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Amina", "Omar", "Sara"],
    "age": [24, 31, 19],
    "city": ["Hargeisa", "Nairobi", "Hargeisa"],
})
print(df)
print(df["age"].mean())
```

### Loading and inspecting

`pd.read_csv(path)` loads a CSV (also `read_excel`, `read_json`, `read_sql`). Always inspect first: `df.head()`, `df.shape`, `df.info()` (columns, types, missing counts), `df.describe()` (statistics for numeric columns), `df["col"].value_counts()`.


### Selecting

`df["col"]` is one column (a Series); `df[["a", "b"]]` several. `df.loc[rows, cols]` selects by **label**; `df.iloc[rows, cols]` by **position**. Filter rows with a boolean mask, as in NumPy, or with `df.query("age > 20")`.

```python
adults = df[df["age"] >= 20]
in_city = df.loc[df["city"] == "Hargeisa", ["name", "age"]]
first_two = df.iloc[:2]
print(df.query("age > 20 and city == 'Nairobi'"))
```

### New columns and sorting

Assign to a new column name to add a column, computed from others with vectorised maths. `sort_values("col", ascending=False)` sorts; `nlargest(5, "col")` is a shortcut. Most methods return a new DataFrame rather than changing the original.

```python
df["age_in_months"] = df["age"] * 12
print(df.sort_values("age", ascending=False))
```

## Exercises

1. Create a DataFrame of 5 countries with population and area, add a `density` column, and sort by it.

<details><summary>Solution</summary>

```python
df = pd.DataFrame({"country": ["Somalia", "Kenya", "Ethiopia", "Egypt", "Djibouti"],
                   "population": [18.1e6, 55.1e6, 126.5e6, 112.7e6, 1.1e6],
                   "area": [637657, 580367, 1104300, 1002450, 23200]})
df["density"] = df["population"] / df["area"]
print(df.sort_values("density", ascending=False))
```

</details>

2. Select the countries with more than 50 million people, showing only name and population.

<details><summary>Solution</summary>

```python
print(df.loc[df["population"] > 50e6, ["country", "population"]])
```

</details>

3. What's the difference between `df.loc[0]` and `df.iloc[0]` after sorting?

<details><summary>Solution</summary>

```python
# loc[0] finds the row whose index label is 0 (wherever it now is);
# iloc[0] takes whatever row is currently first.
```

</details>

## Project: Explore a movies dataset

Explore a catalogue of 600 films on a made-up streaming service: generate the dataset with a seed, save and reload it as CSV, inspect it, then answer questions with selection, filtering, sorting and new columns. (The titles and numbers are synthetic, so you can generate exactly the same data as everyone else.) Written as notebook cells. Needs `pip install pandas numpy`.

Files in this folder: `day75_movies_pandas.py`.

### Key lines explained

- `rng.choice([...], size=n, p=[...])`: Picks genres with the given probabilities, so some genres are more common, like a real catalogue.
- `(10 ** rng.uniform(2, 6, size=n)).astype(int)`: Vote counts spread from 100 to 1,000,000 on a log scale: a few films are hugely popular, most are not.
- `df.info()`: Shows each column's type and how many values are present. Always run it first on new data.
- `df[df["votes"] >= 50_000]`: A boolean mask selects rows, exactly like NumPy masks.
- `best.iloc[0] vs best.loc[0, "title"]`: After sorting, position 0 and label 0 are different rows. Mixing them up is one of the most common pandas bugs.

### Stretch goals

- Find the director-less question you're curious about, such as "which year had the best average rating?", and answer it.
- Load a real dataset: many are free on kaggle.com or data.world. Inspect it with the same steps.

## Test it

- [ ] Run each cell in order in VS Code.
- [ ] `df.info()` should show 600 rows and no missing values.
- [ ] Check one filter by eye: do all rows in the sci-fi result meet every condition?
