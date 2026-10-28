# Day 78: Data visualisation

**Level 4, Advanced Python & Data Science Foundations.** Project: **Visualise your expense data**

A good chart shows in seconds what a table hides. Today you learn Matplotlib, Python's core plotting library, and the main chart types: line, bar, scatter and histogram.

## Lesson

### Figures and axes

`import matplotlib.pyplot as plt`. Use the object-oriented style: `fig, ax = plt.subplots()` gives a **figure** (the whole image) and an **axes** (one plot area). Draw on the axes, label it, then `fig.savefig("chart.png")` or `plt.show()`. In Jupyter or VS Code notebook cells, charts appear inline.

```python
import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr"]
sales = [120, 135, 128, 160]

fig, ax = plt.subplots(figsize=(6, 3.5))
ax.plot(months, sales, marker="o")
ax.set_title("Monthly sales")
ax.set_ylabel("Units")
fig.tight_layout()
fig.savefig("sales.png", dpi=150)
```

### Choosing a chart

**Line**: change over time. **Bar**: comparing categories (horizontal bars when labels are long). **Scatter**: the relationship between two numeric variables. **Histogram**: the distribution of one variable. **Box plot**: comparing distributions across groups. Pie charts are hard to read accurately; prefer bars.


### Several plots in one figure

`plt.subplots(2, 2)` returns a 2×2 grid of axes. Index them like an array: `axes[0, 1]`.

```python
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].bar(months, sales)
axes[1].hist([3, 5, 5, 6, 7, 7, 7, 9], bins=4)
```

### Make charts honest and readable

Always label axes with units and give a title that says what to notice. Start bar charts at zero. Avoid unnecessary decoration. Use colour to highlight what matters, not to decorate. pandas has shortcuts that call Matplotlib for you: `df.plot(kind="bar", ax=ax)`.


## Exercises

1. Plot `y = x²` and `y = 2x` on the same axes for x from -5 to 5, with a legend.

<details><summary>Solution</summary>

```python
import numpy as np
x = np.linspace(-5, 5, 100)
fig, ax = plt.subplots()
ax.plot(x, x ** 2, label="x²")
ax.plot(x, 2 * x, label="2x")
ax.legend()
fig.savefig("functions.png")
```

</details>

2. Draw a histogram of 1,000 normally distributed heights with 30 bins.

<details><summary>Solution</summary>

```python
heights = np.random.default_rng(0).normal(170, 8, 1000)
fig, ax = plt.subplots()
ax.hist(heights, bins=30, edgecolor="white")
ax.set_xlabel("Height (cm)")
fig.savefig("heights.png")
```

</details>

3. Draw a horizontal bar chart of five countries' populations, sorted.

<details><summary>Solution</summary>

```python
pop = {"Somalia": 18.1, "Kenya": 55.1, "Ethiopia": 126.5, "Egypt": 112.7, "Djibouti": 1.1}
names = sorted(pop, key=pop.get)
fig, ax = plt.subplots()
ax.barh(names, [pop[n] for n in names])
ax.set_xlabel("Population (millions)")
fig.savefig("population.png")
```

</details>

## Project: Visualise your expense data

Turn a year of personal expenses into a one-page visual dashboard: monthly spending against budget (line), spending by category (horizontal bar), the distribution of purchase sizes (histogram) and spending by weekday (bar). Use your own Day 33/40 data if you have it; otherwise the script generates a realistic year. Needs `pip install pandas matplotlib numpy`.

Files in this folder: `day78_expense_charts.py`.

### Key lines explained

- `fig, axes = plt.subplots(2, 2, figsize=(13, 8))`: One figure with a 2×2 grid. `axes[0, 1]` is the top-right chart.
- `ax.axhline(MONTHLY_BUDGET, linestyle="--")`: A reference line makes "over budget" obvious at a glance; red dots mark the months that crossed it.
- `bars[-1].set_color(...)`: Colour is used for emphasis: only the biggest category is dark, so the eye goes straight to it.
- `ax.bar_label(bars, ...)`: Labels each bar with its value, so readers don't need to estimate from the axis.
- `ax.spines[["top", "right"]].set_visible(False)`: Removing the box's top and right lines is a small change that makes charts look cleaner.

### Stretch goals

- Run it on your own data: `python day78_expense_charts.py expenses.csv` (columns date, category, amount).
- Plot the step counts from your Day 36 algorithms with log-scaled axes (`ax.set_yscale("log")`) to see O(n) vs O(n²).

## Test it

- [ ] Open `expenses_dashboard.png`: does every chart have a title and labelled axes?
- [ ] Change the budget and check the red dots update.
- [ ] Show the chart to someone and ask what they notice first. Is it what you intended?
