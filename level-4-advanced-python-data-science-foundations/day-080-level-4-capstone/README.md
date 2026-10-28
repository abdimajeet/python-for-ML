# Day 80: Level 4 capstone

**Level 4, Advanced Python & Data Science Foundations.** Project: **Data analysis report in a notebook**

Level 4 capstone. You'll carry out a complete data analysis on the Palmer Penguins dataset: load, clean, analyse, visualise and write a report, the same workflow you'll use before every ML project in Level 5. Give it two days.

## Lesson

### The workflow

1) **Question**: what do you want to know? 2) **Load** and inspect. 3) **Clean**, documenting every decision. 4) **Explore** each variable, then relationships. 5) **Answer** the questions with numbers and charts. 6) **Report**: write findings someone else can read without running your code.


### The dataset

Palmer Penguins has measurements of 344 penguins of three species (Adélie, Chinstrap, Gentoo) from three islands in Antarctica: bill length and depth, flipper length, body mass and sex. It's a modern replacement for the famous Iris dataset and returns in Level 5 for classification and clustering. Load it with `sns.load_dataset("penguins")`.


### Your questions

How do the three species differ in size? Are males bigger than females in every species? Which measurements best separate the species? Is bill length related to bill depth, and does the answer change when you look within each species? (It does: this is **Simpson's paradox**, a famous trap.)


### The report

The script writes a Markdown report (`penguin_report.md`) with the findings, a data-quality section, and links to the charts. Markdown renders nicely on GitHub, so this becomes a portfolio piece. VS Code shows a preview with Ctrl+Shift+V.


## Exercises

1. Before reading the code, write your own list of the cleaning decisions this dataset needs. Look at `df.isna().sum()` first.

<details><summary>Solution</summary>

```python
# - 2 rows have no measurements at all: drop them.
# - About 11 rows have no sex: keep them for species comparisons,
#   leave them out of male/female comparisons.
# - Check for impossible values with describe().
```

</details>

2. Compute the correlation between bill length and bill depth for all penguins, then for each species separately. What do you notice?

<details><summary>Solution</summary>

```python
print(df["bill_length_mm"].corr(df["bill_depth_mm"]))          # negative overall
print(df.groupby("species")[["bill_length_mm", "bill_depth_mm"]]
        .corr().xs("bill_depth_mm", level=1)["bill_length_mm"])   # positive in each species
```

</details>

## Project: Data analysis report in a notebook

Write a complete analysis of the penguins dataset as notebook cells, ending with an automatically generated Markdown report and a folder of charts. Run it cell by cell in VS Code, then read the report. Needs `pip install seaborn pandas matplotlib` and an internet connection the first time.

Files in this folder: `day80_penguins_report.py`.

### Key lines explained

- `quality.append(...)`: Every cleaning decision is recorded and goes into the report, so a reader knows exactly what was removed and why.
- `pd.crosstab(df["species"], df["island"])`: Counts every combination of two categories. It reveals that species and island are tangled together.
- `summary.to_markdown()`: Turns a DataFrame into a Markdown table for the report. It needs the `tabulate` package: `pip install tabulate`.
- `sns.pairplot(..., hue="species", corner=True)`: Scatter plots of every pair of measurements, coloured by species: the quickest way to see which features separate groups.
- `within = {s: g[...].corr(...) for s, g in df.groupby("species")}`: Correlation computed separately inside each species. The sign flips compared with the overall correlation.

### Stretch goals

- Turn the script into a real notebook (.ipynb) and add your own Markdown commentary between cells.
- Publish `penguin_report.md` and the charts folder to your GitHub repository as a portfolio piece.
- Repeat the workflow on a dataset you care about.

## Test it

- [ ] Run every cell in order without errors.
- [ ] Open `penguin_report.md` in VS Code's preview: are all charts visible?
- [ ] Check one number in the report against your own quick calculation.
- [ ] Ask yourself whether someone who never saw the code could understand the report.
