# Day 79: Exploratory data analysis

**Level 4, Advanced Python & Data Science Foundations.** Project: **Titanic passenger analysis**

Exploratory data analysis (EDA) is the process of getting to know a dataset by asking questions and answering them with statistics and charts. Today you learn Seaborn, which makes statistical charts easy, and analyse the classic Titanic dataset.

## Lesson

### The EDA mindset

Start with questions, not charts: who survived? Did class matter? Did age? Look at each variable alone (**univariate**), then pairs (**bivariate**), then groups. Write down findings as you go, and check surprising results; they're either insights or bugs.


### Seaborn

`pip install seaborn`; import as `sns`. Seaborn works directly with DataFrames: give it the data and column names, and it handles grouping, colours and legends. It draws on Matplotlib axes, so you can still customise with `ax.set_title` and so on. `sns.load_dataset("titanic")` downloads practice datasets.

```python
import seaborn as sns
import matplotlib.pyplot as plt

titanic = sns.load_dataset("titanic")
fig, ax = plt.subplots()
sns.barplot(data=titanic, x="class", y="survived", hue="sex", ax=ax)
ax.set_ylabel("Survival rate")
```

### Useful chart types

`histplot` and `kdeplot` (distributions), `boxplot` and `violinplot` (distributions by group), `countplot` (counts of categories), `barplot` (mean with confidence interval), `scatterplot`, `heatmap` (for correlation matrices) and `pairplot` (every numeric pair at once).


### Correlation is not causation

Two variables moving together doesn't prove one causes the other. On the Titanic, fare and survival are correlated, but fare mostly reflects class, which reflects where cabins were. Always look for a third variable that might explain a pattern. This habit is essential before building any ML model.


## Exercises

1. Load the Titanic dataset and print its shape, columns and missing values.

<details><summary>Solution</summary>

```python
titanic = sns.load_dataset("titanic")
print(titanic.shape)
print(titanic.isna().sum())
```

</details>

2. What was the overall survival rate, and the rate for each passenger class?

<details><summary>Solution</summary>

```python
print(titanic["survived"].mean())
print(titanic.groupby("class", observed=True)["survived"].mean())
```

</details>

3. Draw a histogram of ages split by survival.

<details><summary>Solution</summary>

```python
fig, ax = plt.subplots()
sns.histplot(data=titanic, x="age", hue="survived", multiple="stack", bins=30, ax=ax)
fig.savefig("ages.png")
```

</details>

## Project: Titanic passenger analysis

Investigate who survived the Titanic disaster. Clean the data, answer five specific questions with numbers and Seaborn charts, and print a written summary of findings. This dataset returns on Day 86, when you'll train a model to predict survival. Needs `pip install seaborn pandas matplotlib` and an internet connection the first time (to download the data).

Files in this folder: `day79_titanic_eda.py`.

### Key lines explained

- `pd.cut(df["age"], bins=[...], labels=[...])`: Turns a number into ranges you choose (age groups). Missing ages stay missing.
- `pd.qcut(df["fare"], 4, ...)`: Splits into four groups of equal size (quartiles), whatever the values are.
- `df.pivot_table(index="class", columns="sex", values="survived", aggfunc="mean")`: The mean of a 0/1 column is a rate, so this table shows survival rates for every class and sex combination.
- `fam[fam["count"] >= 20]["mean"].idxmax()`: Ignores tiny groups when choosing the "best" family size, so one lucky family of 7 doesn't win by chance.
- `findings.append(...)`: EDA should end in sentences someone can act on, not just charts. Each finding quotes its numbers.

### Stretch goals

- Add a question of your own, such as: did the port of embarkation matter, and why might it?
- Try `sns.pairplot(numeric, hue="survived")` and describe what you see.

## Test it

- [ ] Open each chart in `titanic_charts/` and check it matches the printed numbers.
- [ ] Overall survival should be about 38%.
- [ ] Explain in one sentence why fare alone is a misleading predictor.
