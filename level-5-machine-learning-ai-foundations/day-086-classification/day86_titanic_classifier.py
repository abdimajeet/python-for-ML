# day86_titanic_classifier.py
# Logistic regression on the Titanic passengers.

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

FEATURES = ["pclass", "sex", "age", "sibsp", "parch", "fare", "embarked"]

raw = sns.load_dataset("titanic")
X_raw, y = raw[FEATURES], raw["survived"]
X_train_raw, X_test_raw, y_train, y_test = train_test_split(
    X_raw, y, test_size=0.2, random_state=86, stratify=y)


def prepare(df: pd.DataFrame, stats: dict) -> pd.DataFrame:
    """Turn raw passenger rows into numeric model inputs using training-set statistics."""
    out = df.copy()
    out["age"] = out["age"].fillna(stats["age_median"])
    out["fare"] = np.log1p(out["fare"].fillna(stats["fare_median"]))   # tame the long tail
    out["embarked"] = out["embarked"].fillna("S")
    out["is_child"] = (out["age"] < 12).astype(int)
    out["family"] = out["sibsp"] + out["parch"]
    out["female"] = (out["sex"] == "female").astype(int)
    out = pd.get_dummies(out.drop(columns=["sex"]), columns=["pclass", "embarked"], dtype=int)
    out = out.reindex(columns=stats["columns"], fill_value=0) if "columns" in stats else out
    return out


stats = {"age_median": X_train_raw["age"].median(), "fare_median": X_train_raw["fare"].median()}
X_train = prepare(X_train_raw, stats)
stats["columns"] = list(X_train.columns)             # remember the exact column layout
X_test = prepare(X_test_raw, stats)

baseline = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
model = LogisticRegression(max_iter=2000).fit(X_train, y_train)

print(f"Training on {len(X_train)} passengers, testing on {len(X_test)}")
print(f"Baseline accuracy (predict 'died' for everyone): {baseline.score(X_test, y_test):.1%}")
print(f"Logistic regression accuracy:                    {model.score(X_test, y_test):.1%}")

print("\nWhat the model learned (positive = raises the chance of survival):")
weights = pd.Series(model.coef_[0], index=X_train.columns).sort_values()
for name, w in weights.items():
    bar = "+" * int(abs(w) * 4) if w > 0 else "-" * int(abs(w) * 4)
    print(f"  {name:<12} {w:+.2f}  {bar}")
print(f"  Being female multiplies the odds of survival by {np.exp(weights['female']):.1f}")

people = pd.DataFrame([
    {"pclass": 1, "sex": "female", "age": 30, "sibsp": 1, "parch": 0, "fare": 80, "embarked": "C"},
    {"pclass": 3, "sex": "male", "age": 25, "sibsp": 0, "parch": 0, "fare": 8, "embarked": "S"},
    {"pclass": 2, "sex": "male", "age": 6, "sibsp": 1, "parch": 1, "fare": 26, "embarked": "S"},
    {"pclass": 3, "sex": "female", "age": 40, "sibsp": 1, "parch": 4, "fare": 31, "embarked": "S"},
], index=["Rose (1st, 30)", "Jack (3rd, 25)", "boy (2nd, 6)", "mother of 4 (3rd)"])
chances = model.predict_proba(prepare(people, stats))[:, 1]
print("\nSurvival chances:")
for name, p in zip(people.index, chances):
    print(f"  {name:<18} {p:5.0%}  -> {'survives' if p >= 0.5 else 'does not survive'}")

# How probability changes with age, for each class and sex
ages = np.arange(1, 75)
fig, ax = plt.subplots(figsize=(8, 4.5))
for pclass in (1, 2, 3):
    for sex, style in (("female", "-"), ("male", "--")):
        grid = pd.DataFrame({"pclass": pclass, "sex": sex, "age": ages, "sibsp": 0,
                             "parch": 0, "fare": raw.loc[raw.pclass == pclass, "fare"].median(),
                             "embarked": "S"})
        ax.plot(ages, model.predict_proba(prepare(grid, stats))[:, 1], style,
                label=f"{sex}, class {pclass}")
ax.axhline(0.5, color="grey", lw=0.8)
ax.set(title="Predicted survival chance by age", xlabel="Age", ylabel="P(survived)", ylim=(0, 1))
ax.legend(ncols=2, fontsize=8, loc="lower left")
fig.tight_layout()
fig.savefig("survival_by_age.png", dpi=120)
print("\nSaved survival_by_age.png")
