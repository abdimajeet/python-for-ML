# day80_penguins_report.py
# Level 4 capstone: a complete analysis of the Palmer Penguins data.

# %% Setup
from datetime import date
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

HERE = Path(__file__).parent
CHARTS = HERE / "penguin_charts"
CHARTS.mkdir(exist_ok=True)
sns.set_theme(style="whitegrid", palette="Set2")
MEASURES = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
report = [f"# Palmer Penguins: an exploratory analysis\n\n_Generated {date.today():%d %B %Y}_\n"]


def save(fig, name):
    fig.savefig(CHARTS / name, dpi=120, bbox_inches="tight")
    plt.close(fig)
    return f"![{name}]({CHARTS.name}/{name})"


# %% 1. Load and inspect
raw = sns.load_dataset("penguins")
print(raw.shape)
print(raw.head())
print(raw.isna().sum())

# %% 2. Clean, recording every decision
quality = []
df = raw.dropna(subset=MEASURES).copy()
quality.append(f"Dropped {len(raw) - len(df)} rows with no body measurements.")
missing_sex = df["sex"].isna().sum()
quality.append(f"Kept {missing_sex} rows with unknown sex; they are excluded only from male/female comparisons.")
df["sex"] = df["sex"].str.title()
df["body_mass_kg"] = df["body_mass_g"] / 1000
assert df[MEASURES].gt(0).all().all(), "all measurements should be positive"
quality.append(f"Final dataset: {len(df)} penguins, {df['species'].nunique()} species, "
               f"{df['island'].nunique()} islands.")

report.append("## Data quality\n" + "\n".join(f"- {q}" for q in quality) + "\n")

# %% 3. Who lives where?
where = pd.crosstab(df["species"], df["island"])
print(where)
report.append("## Where each species lives\n" + where.to_markdown() + "\n")
report.append("Gentoo live only on Biscoe and Chinstrap only on Dream; Adélie are found on all three islands.\n")

# %% 4. How do the species differ in size?
summary = df.groupby("species")[MEASURES].mean().round(1)
print(summary)
fig, axes = plt.subplots(1, 4, figsize=(16, 4))
for ax, col in zip(axes, MEASURES):
    sns.boxplot(data=df, x="species", y=col, hue="species", ax=ax, legend=False)
    ax.set(title=col.replace("_", " "), xlabel="", ylabel="")
chart = save(fig, "species_measures.png")
heaviest = summary["body_mass_g"].idxmax()
report.append("## Size by species\n" + summary.to_markdown() + "\n\n" + chart + "\n")
report.append(f"{heaviest} penguins are the heaviest, averaging "
              f"{summary.loc[heaviest, 'body_mass_g'] / 1000:.1f} kg, with the longest flippers. "
              "Chinstrap and Adélie are similar in mass, but Chinstrap bills are much longer.\n")

# %% 5. Are males bigger in every species?
known = df.dropna(subset=["sex"])
by_sex = known.pivot_table(index="species", columns="sex", values="body_mass_g", aggfunc="mean")
by_sex["difference_%"] = ((by_sex["Male"] / by_sex["Female"] - 1) * 100).round(1)
print(by_sex.round(0))
fig, ax = plt.subplots(figsize=(7, 4))
sns.violinplot(data=known, x="species", y="body_mass_g", hue="sex", split=True, inner="quart", ax=ax)
ax.set(title="Body mass by species and sex", ylabel="Body mass (g)", xlabel="")
chart = save(fig, "mass_by_sex.png")
report.append("## Males versus females\n" + by_sex.round(0).to_markdown() + "\n\n" + chart + "\n")
report.append(f"Males are heavier in every species, by {by_sex['difference_%'].min():.0f}% to "
              f"{by_sex['difference_%'].max():.0f}%.\n")

# %% 6. Which measurements separate the species?
fig = sns.pairplot(df, vars=MEASURES, hue="species", corner=True, plot_kws={"s": 15}).figure
chart = save(fig, "pairplot.png")
report.append("## Which measurements separate the species?\n" + chart + "\n")
report.append("Flipper length and body mass separate Gentoo from the rest; bill length separates "
              "Adélie from Chinstrap. Using bill length together with flipper length separates all "
              "three species well, which is a promising sign for the classifier in Level 5.\n")

# %% 7. Simpson's paradox: bill length vs bill depth
overall = df["bill_length_mm"].corr(df["bill_depth_mm"])
within = {s: g["bill_length_mm"].corr(g["bill_depth_mm"]) for s, g in df.groupby("species")}
print(f"overall r = {overall:.2f}", {k: round(float(v), 2) for k, v in within.items()})
fig, ax = plt.subplots(figsize=(7, 5))
sns.regplot(data=df, x="bill_length_mm", y="bill_depth_mm", scatter=False, color="black",
            line_kws={"linestyle": "--"}, ax=ax, label=f"all penguins (r = {overall:.2f})")
for species, group in df.groupby("species"):
    sns.regplot(data=group, x="bill_length_mm", y="bill_depth_mm", ax=ax, scatter_kws={"s": 12},
                label=f"{species} (r = {within[species]:.2f})")
ax.legend()
ax.set(title="Bill length vs depth: the trend reverses inside each species",
       xlabel="Bill length (mm)", ylabel="Bill depth (mm)")
chart = save(fig, "simpsons_paradox.png")
report.append("## A trap: Simpson's paradox\n" + chart + "\n")
report.append(f"Across all penguins, longer bills go with shallower bills (r = {overall:.2f}). "
              "But within each species the relationship is positive. The overall trend is created by "
              "mixing species with different shapes. Always check relationships within groups "
              "before drawing conclusions or building a model.\n")

# %% 8. Write the report
report.append("## Summary\n"
              "1. The three species differ clearly in size and bill shape.\n"
              "2. Males are heavier than females in every species.\n"
              "3. A few measurements are enough to tell species apart, so a classifier should work well.\n"
              "4. Grouping matters: a trend in the whole dataset can reverse inside groups.\n")
path = HERE / "penguin_report.md"
path.write_text("\n".join(report), encoding="utf-8")
print(f"Report written to {path.name}, charts in {CHARTS.name}/")
