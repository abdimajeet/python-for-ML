# day75_movies_pandas.py
# Exploring a (synthetic) streaming catalogue with pandas.

# %% Create the dataset and save it as CSV
from pathlib import Path

import numpy as np
import pandas as pd

rng = np.random.default_rng(75)
n = 600
genres = rng.choice(["Drama", "Comedy", "Action", "Documentary", "Animation", "Thriller", "Sci-Fi"],
                    size=n, p=[0.24, 0.2, 0.17, 0.1, 0.09, 0.12, 0.08])
words_a = ["Silent", "Last", "Golden", "Hidden", "Broken", "Midnight", "Lost", "Second", "Wild", "Red"]
words_b = ["River", "Kingdom", "Signal", "Garden", "Promise", "City", "Storm", "Letter", "Road", "Star"]

movies = pd.DataFrame({
    "title": [f"The {rng.choice(words_a)} {rng.choice(words_b)} {i}" for i in range(n)],
    "genre": genres,
    "year": rng.integers(1980, 2027, size=n),
    "runtime": np.clip(rng.normal(108, 18, size=n).round(), 70, 200).astype(int),
    "rating": np.clip(rng.normal(6.6, 1.0, size=n), 1, 10).round(1),
    "votes": (10 ** rng.uniform(2, 6, size=n)).astype(int),
    "budget_musd": np.clip(rng.lognormal(3, 1, size=n), 0.5, 300).round(1),
})
movies["revenue_musd"] = (movies["budget_musd"] * rng.lognormal(0.6, 0.8, size=n)).round(1)
movies.loc[movies["genre"] == "Documentary", "runtime"] -= 20

path = Path(__file__).parent / "movies.csv"
movies.to_csv(path, index=False)
df = pd.read_csv(path)

# %% Inspect
print(df.shape)
print(df.head())
df.info()
print(df.describe().round(1))

# %% Counting
print(df["genre"].value_counts())
print("Films per decade:")
print((df["year"] // 10 * 10).value_counts().sort_index())

# %% New columns
df["profit_musd"] = df["revenue_musd"] - df["budget_musd"]
df["roi"] = df["profit_musd"] / df["budget_musd"]
df["long"] = df["runtime"] > 130

# %% Questions answered with selection and sorting
print("Highest rated with at least 50,000 votes:")
popular = df[df["votes"] >= 50_000]
print(popular.nlargest(5, "rating")[["title", "genre", "year", "rating", "votes"]])

print("\nBiggest money-makers:")
print(df.sort_values("profit_musd", ascending=False).head(5)[["title", "budget_musd", "revenue_musd"]])

print("\nRecent long sci-fi:")
print(df.query("genre == 'Sci-Fi' and year >= 2015 and long")[["title", "year", "runtime"]])

print("\nShare of films that lost money:", f"{(df['profit_musd'] < 0).mean():.0%}")

# %% loc vs iloc
best = df.sort_values("rating", ascending=False)
print("iloc[0] (first row after sorting):", best.iloc[0]["title"])
print("loc[0]  (the row labelled 0):     ", best.loc[0, "title"])

# %% Average rating and runtime by genre (a preview of tomorrow)
print(df.groupby("genre")[["rating", "runtime"]].mean().round(1).sort_values("rating"))
