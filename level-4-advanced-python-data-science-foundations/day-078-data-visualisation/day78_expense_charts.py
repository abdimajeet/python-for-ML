# day78_expense_charts.py
# A one-page dashboard of a year's expenses with Matplotlib.

import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

MONTHLY_BUDGET = 2000
OUT = Path(__file__).parent / "expenses_dashboard.png"


def sample_expenses(seed=78):
    rng = np.random.default_rng(seed)
    categories = {"food": (35, 14), "transport": (15, 6), "rent": (450, 0), "utilities": (60, 12),
                  "entertainment": (25, 12), "health": (40, 25), "shopping": (55, 35), "education": (30, 15)}
    rows = []
    for day in pd.date_range("2026-01-01", "2026-12-31"):
        if day.day == 1:
            rows.append((day, "rent", 450.0))
        if day.day == 5:
            rows.append((day, "utilities", rng.normal(*categories["utilities"])))
        for cat in ("food", "transport", "entertainment", "health", "shopping", "education"):
            chance = {"food": 0.7, "transport": 0.6}.get(cat, 0.08)
            if day.dayofweek >= 5 and cat == "entertainment":
                chance = 0.4
            if rng.random() < chance:
                mean, sd = categories[cat]
                rows.append((day, cat, max(1.0, rng.normal(mean, sd))))
    return pd.DataFrame(rows, columns=["date", "category", "amount"]).round({"amount": 2})


def load(path=None):
    if path:
        df = pd.read_csv(path)
        df["date"] = pd.to_datetime(df["date"])
        return df[df.get("type", "expense") == "expense"] if "type" in df else df
    return sample_expenses()


def main():
    df = load(sys.argv[1] if len(sys.argv) > 1 else None)
    print(f"{len(df):,} expenses, total {df['amount'].sum():,.2f}")

    monthly = df.groupby(df["date"].dt.to_period("M"))["amount"].sum()
    by_cat = df.groupby("category")["amount"].sum().sort_values()
    weekday = df[df["category"] != "rent"].groupby(df["date"].dt.dayofweek)["amount"].sum()

    fig, axes = plt.subplots(2, 2, figsize=(13, 8))
    fig.suptitle("My spending in 2026", fontsize=16, fontweight="bold")

    # 1. Monthly spending vs budget
    ax = axes[0, 0]
    labels = monthly.index.strftime("%b")
    over = monthly > MONTHLY_BUDGET
    ax.plot(labels, monthly.values, marker="o", color="#2f6db0", label="spent")
    ax.axhline(MONTHLY_BUDGET, color="#b33d5a", linestyle="--", label=f"budget ({MONTHLY_BUDGET})")
    ax.scatter(labels[over], monthly[over], color="#b33d5a", zorder=3, s=60, label="over budget")
    ax.set_title("Monthly spending")
    ax.set_ylabel("Amount")
    ax.set_ylim(0, monthly.max() * 1.15)
    ax.legend(frameon=False)

    # 2. Spending by category
    ax = axes[0, 1]
    bars = ax.barh(by_cat.index.str.title(), by_cat.values, color="#7fa7d6")
    bars[-1].set_color("#2f6db0")                       # highlight the biggest
    ax.bar_label(bars, labels=[f"{v:,.0f}" for v in by_cat.values], padding=3, fontsize=9)
    ax.set_title("Where the money went")
    ax.set_xlabel("Total for the year")
    ax.set_xlim(0, by_cat.max() * 1.2)

    # 3. Distribution of purchase sizes (rent excluded)
    ax = axes[1, 0]
    everyday = df.loc[df["category"] != "rent", "amount"]
    ax.hist(everyday, bins=40, color="#2f8f6b", edgecolor="white")
    ax.axvline(everyday.median(), color="black", linestyle=":", label=f"median {everyday.median():.0f}")
    ax.set_title("How big are everyday purchases?")
    ax.set_xlabel("Amount per purchase")
    ax.set_ylabel("Number of purchases")
    ax.legend(frameon=False)

    # 4. Spending by weekday
    ax = axes[1, 1]
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    colours = ["#c0652c" if d >= 5 else "#e8b48f" for d in weekday.index]
    ax.bar([days[d] for d in weekday.index], weekday.values, color=colours)
    ax.set_title("Weekends cost more (rent excluded)")
    ax.set_ylabel("Total for the year")

    for ax in axes.flat:
        ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    fig.savefig(OUT, dpi=150)
    print(f"Saved {OUT.name}")
    # plt.show()   # uncomment to open a window instead


if __name__ == "__main__":
    main()
