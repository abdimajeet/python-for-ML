# day90_segmentation.py
# Customer segmentation with k-means.

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(90)
FEATURES = ["yearly_spend", "visits_per_month", "avg_basket", "days_since_last", "categories"]


def make_customers() -> pd.DataFrame:
    """Four hidden customer types. The clustering never sees the 'true_type' column."""
    types = {  # count, spend, visits, basket, days since last, categories
        "loyal": (400, 2400, 8, 25, 5, 6),
        "occasional": (900, 450, 1.5, 25, 40, 3),
        "big-basket": (350, 1900, 2, 80, 20, 4),
        "lapsed": (350, 300, 0.4, 60, 200, 2),
    }
    parts = []
    for name, (n, spend, visits, basket, days, cats) in types.items():
        parts.append(pd.DataFrame({
            "yearly_spend": rng.lognormal(np.log(spend), 0.35, n).round(2),
            "visits_per_month": rng.gamma(visits * 4, 0.25, n).round(1),
            "avg_basket": rng.lognormal(np.log(basket), 0.3, n).round(2),
            "days_since_last": rng.gamma(4, days / 4, n).round(),
            "categories": np.clip(rng.poisson(cats, n), 1, 10),
            "true_type": name,
        }))
    return pd.concat(parts, ignore_index=True).sample(frac=1, random_state=90).reset_index(drop=True)


def prepare(df: pd.DataFrame) -> np.ndarray:
    X = df[FEATURES].copy()
    for col in ("yearly_spend", "avg_basket", "days_since_last", "visits_per_month"):
        X[col] = np.log1p(X[col])                       # tame long tails
    return StandardScaler().fit_transform(X)


def name_segment(profile: pd.Series, overall: pd.Series) -> str:
    if profile["days_since_last"] > 2 * overall["days_since_last"]:
        return "lapsed"
    if profile["visits_per_month"] > 1.5 * overall["visits_per_month"]:
        return "loyal regulars"
    if profile["avg_basket"] > 1.5 * overall["avg_basket"]:
        return "big-basket shoppers"
    return "occasional shoppers"


def main() -> None:
    df = make_customers()
    X = prepare(df)

    print(" k   inertia   silhouette")
    scores = {}
    for k in range(2, 9):
        km = KMeans(n_clusters=k, n_init=10, random_state=90).fit(X)
        scores[k] = silhouette_score(X, km.labels_, sample_size=1500, random_state=90)
        print(f"{k:>2} {km.inertia_:>9.0f}   {scores[k]:.3f}")
    best_k = max(scores, key=scores.get)
    print(f"Best silhouette at k = {best_k}")

    km = KMeans(n_clusters=best_k, n_init=10, random_state=90).fit(X)
    df["cluster"] = km.labels_
    overall = df[FEATURES].mean()
    profiles = df.groupby("cluster")[FEATURES].mean()
    names = {c: name_segment(profiles.loc[c], overall) for c in profiles.index}
    df["segment"] = df["cluster"].map(names)

    summary = df.groupby("segment")[FEATURES].mean().round(1)
    summary.insert(0, "customers", df["segment"].value_counts())
    summary["share_of_revenue"] = (df.groupby("segment")["yearly_spend"].sum() / df["yearly_spend"].sum()).round(2)
    print("\nSegment profiles:")
    print(summary.sort_values("customers", ascending=False).to_string())

    print("\nHow well did we recover the hidden types?")
    print(pd.crosstab(df["true_type"], df["segment"]).to_string())

    fig, ax = plt.subplots(figsize=(7, 5))
    for segment, group in df.groupby("segment"):
        ax.scatter(group["visits_per_month"], group["yearly_spend"], s=8, alpha=0.6, label=segment)
    ax.set(xscale="log", yscale="log", xlabel="Visits per month (log scale)",
           ylabel="Yearly spend (log scale)", title="Customer segments")
    ax.legend(markerscale=2)
    fig.tight_layout()
    fig.savefig("segments.png", dpi=120)
    df.drop(columns="true_type").to_csv("customer_segments.csv", index=False)
    print("\nSaved segments.png and customer_segments.csv")


if __name__ == "__main__":
    main()
