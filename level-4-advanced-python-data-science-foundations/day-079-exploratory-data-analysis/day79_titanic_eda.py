# day79_titanic_eda.py
# Exploratory analysis of the Titanic dataset with seaborn.

# %% Load and inspect
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

OUT = Path(__file__).parent / "titanic_charts"
OUT.mkdir(exist_ok=True)
sns.set_theme(style="whitegrid")

titanic = sns.load_dataset("titanic")
print(titanic.shape)
print(titanic.isna().sum()[lambda s: s > 0])

# %% Light cleaning for analysis
df = titanic.copy()
df["age_group"] = pd.cut(df["age"], bins=[0, 12, 18, 35, 60, 100],
                         labels=["child", "teen", "young adult", "adult", "senior"])
df["family_size"] = df["sibsp"] + df["parch"] + 1
df["fare_band"] = pd.qcut(df["fare"], 4, labels=["cheapest", "low", "high", "highest"])
findings = []

# %% Q1: How many survived?
rate = df["survived"].mean()
findings.append(f"Overall, {rate:.0%} of {len(df)} passengers survived.")

# %% Q2: Did sex and class matter?
table = df.pivot_table(index="class", columns="sex", values="survived", aggfunc="mean", observed=True)
print(table.round(2))
fig, ax = plt.subplots(figsize=(7, 4))
sns.barplot(data=df, x="class", y="survived", hue="sex", ax=ax, errorbar=None)
ax.set(title="Survival rate by class and sex", ylabel="Survival rate", xlabel="")
fig.savefig(OUT / "class_sex.png", dpi=120, bbox_inches="tight")
findings.append(f"Women in first class survived at {table.loc['First', 'female']:.0%}; "
                f"men in third class at {table.loc['Third', 'male']:.0%}.")

# %% Q3: Were children saved first?
by_age = df.groupby("age_group", observed=True)["survived"].agg(["mean", "count"])
print(by_age.round(2))
fig, ax = plt.subplots(figsize=(7, 4))
sns.histplot(data=df, x="age", hue="survived", multiple="stack", bins=30, ax=ax)
ax.set(title="Age distribution by survival", xlabel="Age")
fig.savefig(OUT / "age.png", dpi=120, bbox_inches="tight")
findings.append(f"Children under 12 survived at {by_age.loc['child', 'mean']:.0%}, "
                f"versus {rate:.0%} overall. Age is missing for {df['age'].isna().mean():.0%} of passengers.")

# %% Q4: Did family size matter?
fam = df.groupby("family_size")["survived"].agg(["mean", "count"])
print(fam.round(2))
fig, ax = plt.subplots(figsize=(7, 4))
sns.pointplot(data=df, x="family_size", y="survived", ax=ax, errorbar=None)
ax.set(title="Survival by family size", ylabel="Survival rate", xlabel="People in family group")
fig.savefig(OUT / "family.png", dpi=120, bbox_inches="tight")
best_size = fam[fam["count"] >= 20]["mean"].idxmax()
findings.append(f"Small families did best: groups of {best_size} survived at {fam.loc[best_size, 'mean']:.0%}; "
                "people alone and very large families did worse.")

# %% Q5: Is fare just a stand-in for class?
print(df.groupby(["class", "fare_band"], observed=True)["survived"].mean().unstack().round(2))
fig, ax = plt.subplots(figsize=(7, 4))
sns.boxplot(data=df, x="class", y="fare", hue="survived", ax=ax)
ax.set(yscale="log", title="Fare by class and survival (log scale)", ylabel="Fare", xlabel="")
fig.savefig(OUT / "fare.png", dpi=120, bbox_inches="tight")
findings.append("Fare and class overlap heavily; within a class, fare adds less information. "
                "Correlation with survival doesn't mean the ticket price caused it.")

# %% Correlation heatmap of numeric columns
numeric = df[["survived", "pclass", "age", "sibsp", "parch", "fare", "family_size"]]
fig, ax = plt.subplots(figsize=(6, 5))
sns.heatmap(numeric.corr(), annot=True, fmt=".2f", cmap="vlag", center=0, ax=ax)
ax.set_title("Correlations")
fig.savefig(OUT / "correlations.png", dpi=120, bbox_inches="tight")

# %% Summary
print("\nFINDINGS")
for i, line in enumerate(findings, start=1):
    print(f"{i}. {line}")
print(f"\nCharts saved in {OUT.name}/")
