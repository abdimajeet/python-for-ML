# train.py
# Data -> baseline -> model comparison -> test evaluation -> saved model and model card.

import json
from datetime import date

import joblib
import pandas as pd
import seaborn as sns
import sklearn
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

NUMERIC = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
CATEGORICAL = ["island", "sex"]
SEED = 100


def load() -> pd.DataFrame:
    df = sns.load_dataset("penguins")                 # downloads the first time
    before = len(df)
    df = df.dropna(subset=NUMERIC)                    # rows with no measurements at all
    print(f"Loaded {before} penguins, dropped {before - len(df)} with no measurements.")
    return df


def make_pipeline(model) -> Pipeline:
    prep = ColumnTransformer([
        ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]), NUMERIC),
        ("cat", Pipeline([("impute", SimpleImputer(strategy="constant", fill_value="unknown")),
                          ("onehot", OneHotEncoder(handle_unknown="ignore"))]), CATEGORICAL),
    ])
    return Pipeline([("prep", prep), ("model", model)])


def main() -> None:
    df = load()
    X, y = df[NUMERIC + CATEGORICAL], df["species"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=SEED, stratify=y)

    candidates = {
        "baseline (most common species)": DummyClassifier(strategy="most_frequent"),
        "logistic regression": LogisticRegression(max_iter=2000),
        "random forest": RandomForestClassifier(n_estimators=300, random_state=SEED),
    }
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    scores = {}
    print("\n5-fold cross-validated accuracy on the training set:")
    for name, model in candidates.items():
        result = cross_val_score(make_pipeline(model), X_train, y_train, cv=cv)
        scores[name] = result.mean()
        print(f"  {name:<32} {result.mean():.3f} ± {result.std():.3f}")
    best_name = max(scores, key=scores.get)

    model = make_pipeline(candidates[best_name]).fit(X_train, y_train)
    pred = model.predict(X_test)
    test_acc = accuracy_score(y_test, pred)
    print(f"\nChosen: {best_name}. Test accuracy: {test_acc:.3f}")
    print(classification_report(y_test, pred, digits=3))
    labels = sorted(y.unique())
    cm = pd.DataFrame(confusion_matrix(y_test, pred, labels=labels), index=labels, columns=labels)
    print("Confusion matrix (rows = true species):")
    print(cm.to_string())

    joblib.dump(model, "model.joblib")
    metadata = {
        "model": best_name,
        "trained_on": date.today().isoformat(),
        "features": NUMERIC + CATEGORICAL,
        "species": labels,
        "islands": sorted(df["island"].unique()),
        "cv_accuracy": round(scores[best_name], 4),
        "test_accuracy": round(test_acc, 4),
        "n_train": len(X_train),
        "n_test": len(X_test),
        "sklearn_version": sklearn.__version__,
    }
    with open("model_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    counts = y.value_counts()
    card = f"""# Model card: penguin species classifier

## What it does
Predicts the species of a penguin (Adelie, Chinstrap or Gentoo) from bill length and depth,
flipper length, body mass, island and sex.

## Data
Palmer Penguins: {len(df)} penguins measured on three islands in Antarctica, 2007-2009.
Species counts: {", ".join(f"{s} {n}" for s, n in counts.items())}.
Rows without any measurements were dropped; missing sex is treated as "unknown".

## Performance
- Model: {best_name}, chosen by 5-fold cross-validation ({scores[best_name]:.1%}).
- Accuracy on {len(X_test)} held-out penguins: **{test_acc:.1%}**.
- The most common baseline scores {scores["baseline (most common species)"]:.1%}.

## Limitations
- Trained on three islands only. Penguins from other places may be measured or behave differently.
- Chinstrap penguins are the smallest group, so their predictions are the least certain.
- Island is a strong clue in this data (Gentoo appear only on Biscoe), which may not hold elsewhere.

## Intended use
Learning and demonstration. Not for scientific decisions without expert review.
"""
    with open("MODEL_CARD.md", "w", encoding="utf-8") as f:
        f.write(card)
    print("\nSaved model.joblib, model_metadata.json and MODEL_CARD.md")


if __name__ == "__main__":
    main()
