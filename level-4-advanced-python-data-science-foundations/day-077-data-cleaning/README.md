# Day 77: Data cleaning

**Level 4, Advanced Python & Data Science Foundations.** Project: **Clean a messy real-world dataset**

Real data is messy: missing values, duplicates, inconsistent text, wrong types and impossible values. Data scientists spend much of their time cleaning, and today you learn a systematic way to do it.

## Lesson

### Finding problems

Before fixing anything, look. `df.info()` and `df.isna().sum()` show missing values. `df.duplicated().sum()` counts duplicate rows. `df["col"].unique()` and `value_counts()` reveal inconsistent spellings. `describe()` exposes impossible values like negative ages.


### Missing values

pandas marks missing data as `NaN` (or `NaT` for dates, `pd.NA` in some types). Options: drop rows (`dropna`), fill with a value (`fillna`), fill with a statistic like the median, or fill within groups. The right choice depends on **why** the data is missing, so write down your decision.

```python
df["age"] = df["age"].fillna(df["age"].median())
df["city"] = df["city"].fillna("Unknown")
df = df.dropna(subset=["email"])          # rows without email are useless here
```

### Fixing text and types

The `.str` accessor applies string methods to a whole column: `.str.strip()`, `.str.lower()`, `.str.replace()`, `.str.extract(regex)`. Convert types with `pd.to_numeric(col, errors="coerce")` and `pd.to_datetime(col, errors="coerce")`: anything unparseable becomes NaN instead of crashing.

```python
df["city"] = df["city"].str.strip().str.title()
df["price"] = pd.to_numeric(df["price"].str.replace(r"[$,]", "", regex=True), errors="coerce")
```

### Duplicates and outliers

`drop_duplicates(subset=[...])` removes repeats, judged on the columns you choose. For outliers, decide if a value is **impossible** (an age of 250: remove or set to NaN) or just **unusual** (a very large order: usually keep). Clipping to a plausible range is another option.


### Make it repeatable

Put every cleaning step in a function or script, never edit the raw file by hand. Keep the raw data unchanged, and print a short report of what each step did. Then anyone can re-run the cleaning and check your decisions.


## Exercises

1. Count missing values per column and the percentage of rows with any missing value.

<details><summary>Solution</summary>

```python
print(df.isna().sum())
print(f"{df.isna().any(axis=1).mean():.1%}")
```

</details>

2. Standardise a column of country names like `" kenya"`, `"KENYA"` and `"Kenya "`.

<details><summary>Solution</summary>

```python
df["country"] = df["country"].str.strip().str.title()
```

</details>

3. Fill missing salaries with the median salary of the same department.

<details><summary>Solution</summary>

```python
df["salary"] = df["salary"].fillna(df.groupby("department")["salary"].transform("median"))
```

</details>

## Project: Clean a messy real-world dataset

Clean a deliberately messy customer sign-up dataset with all the classic problems: inconsistent spellings, mixed date formats, prices stored as text, impossible ages, duplicates and missing values. A pipeline of small functions logs what each step changed, and validation checks run at the end. Needs `pip install pandas numpy`.

Files in this folder: `day77_cleaning.py`.

### Key lines explained

- `df = df.copy() at the start of each step`: Each function returns a new DataFrame and never changes its input, so the raw data stays untouched and steps can be re-run.
- `iso.fillna(dmy)`: Dates come in two formats. Parsing each format strictly, then combining, avoids pandas guessing day and month the wrong way round.
- `df.loc[~df["age"].between(13, 110), "age"] = np.nan`: Impossible ages (250, -3) become missing, and are then filled like other missing ages. `~` means "not".
- `groupby("plan")["monthly_fee"].transform("median")`: `transform` returns a value for every row (its plan's median), lined up with the original rows, so it can be used to fill gaps.
- `df["needs_review"] = ...`: Not everything can be fixed automatically. A bad email or unreadable date is flagged for a person to check, not silently deleted.

### Stretch goals

- Write pytest tests for each cleaning function with tiny DataFrames.
- Find a messy dataset online (search "dirty data" practice datasets) and write a pipeline for it.

## Test it

- [ ] The duplicate customer 1002 must appear only once.
- [ ] Customer 1005's $1,299 fee should be corrected to the premium price.
- [ ] Validation must pass, and the flagged rows should be the ones a human really needs to look at.
