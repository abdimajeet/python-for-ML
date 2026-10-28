# train_model.py
# Train the house-price pipeline and save it with metadata.

import json
from datetime import datetime, timezone

import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

NUMERIC = ["size_m2", "rooms", "year_built", "distance_km"]
CATEGORICAL = ["neighbourhood", "house_type"]
NEIGHBOURHOODS = {"Riverside": 1.25, "Old Town": 1.10, "Hillview": 1.00, "Industrial": 0.80, "Airport": 0.85}
HOUSE_TYPES = {"flat": 0, "terraced": 15_000, "detached": 45_000}


def make_data(n: int = 2000, seed: int = 97) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    df = pd.DataFrame({
        "size_m2": rng.normal(105, 35, n).clip(25, 320).round(),
        "year_built": rng.integers(1950, 2025, n),
        "distance_km": rng.gamma(2, 4, n).round(1),
        "neighbourhood": rng.choice(list(NEIGHBOURHOODS), n),
        "house_type": rng.choice(list(HOUSE_TYPES), n, p=[0.45, 0.35, 0.2]),
    })
    df["rooms"] = np.clip((df["size_m2"] / 28 + rng.normal(0, 0.8, n)).round(), 1, 9)
    base = (1_900 * df["size_m2"] + 6_000 * df["rooms"] + 400 * (df["year_built"] - 1950)
            - 2_800 * df["distance_km"] + df["house_type"].map(HOUSE_TYPES))
    df["price"] = (base * df["neighbourhood"].map(NEIGHBOURHOODS) + rng.normal(0, 15_000, n)).round(-2)
    return df


def main() -> None:
    df = make_data()
    X, y = df[NUMERIC + CATEGORICAL], df["price"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=97)
    model = Pipeline([
        ("prep", ColumnTransformer([
            ("num", SimpleImputer(strategy="median"), NUMERIC),
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ])),
        ("model", RandomForestRegressor(n_estimators=200, min_samples_leaf=2, random_state=97, n_jobs=-1)),
    ])
    model.fit(X_train, y_train)
    mae = mean_absolute_error(y_test, model.predict(X_test))
    joblib.dump(model, "model.joblib")
    metadata = {
        "model": "RandomForestRegressor in a preprocessing pipeline",
        "trained_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "test_mae": round(mae),
        "features": NUMERIC + CATEGORICAL,
        "neighbourhoods": list(NEIGHBOURHOODS),
        "sklearn_version": sklearn.__version__,
    }
    with open("model_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved model.joblib (test MAE {mae:,.0f}) and model_metadata.json")


if __name__ == "__main__":
    main()
