# day88_housing_pipeline.py
# Preprocessing and model in one pipeline, cross-validated, saved and reloaded.

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.model_selection import KFold, cross_val_score, train_test_split
from sklearn.neighbors import KNeighborsRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler

rng = np.random.default_rng(88)
NUMERIC = ["size_m2", "rooms", "year_built", "distance_km"]
NOMINAL = ["neighbourhood", "house_type"]
ORDINAL = ["condition"]
CONDITIONS = ["poor", "fair", "good", "excellent"]


def make_housing(n: int = 1200) -> pd.DataFrame:
    hoods = {"Riverside": 1.25, "Old Town": 1.10, "Hillview": 1.00, "Industrial": 0.80, "Airport": 0.85}
    df = pd.DataFrame({
        "size_m2": rng.normal(105, 35, n).clip(25, 320).round(),
        "year_built": rng.integers(1950, 2025, n),
        "distance_km": rng.gamma(2, 4, n).round(1),
        "neighbourhood": rng.choice(list(hoods), n, p=[0.15, 0.2, 0.3, 0.2, 0.15]),
        "house_type": rng.choice(["flat", "terraced", "detached"], n, p=[0.45, 0.35, 0.2]),
        "condition": rng.choice(CONDITIONS, n, p=[0.1, 0.3, 0.45, 0.15]),
    })
    df["rooms"] = np.clip((df["size_m2"] / 28 + rng.normal(0, 0.8, n)).round(), 1, 9)
    price = (1_900 * df["size_m2"] + 6_000 * df["rooms"] + 400 * (df["year_built"] - 1950)
             - 2_800 * df["distance_km"]
             + df["house_type"].map({"flat": 0, "terraced": 15_000, "detached": 45_000})
             + df["condition"].map(dict(zip(CONDITIONS, [-30_000, -8_000, 0, 25_000]))))
    df["price"] = (price * df["neighbourhood"].map(hoods) + rng.normal(0, 15_000, n)).round(-2)
    for col, frac in (("size_m2", 0.05), ("year_built", 0.08), ("condition", 0.06), ("house_type", 0.03)):
        df.loc[rng.random(n) < frac, col] = np.nan            # real data has gaps
    return df


def build_preprocessor() -> ColumnTransformer:
    numeric = Pipeline([("impute", SimpleImputer(strategy="median", add_indicator=True)),
                        ("scale", StandardScaler())])
    nominal = Pipeline([("impute", SimpleImputer(strategy="most_frequent")),
                        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))])
    ordinal = Pipeline([("impute", SimpleImputer(strategy="most_frequent")),
                        ("order", OrdinalEncoder(categories=[CONDITIONS])),
                        ("scale", StandardScaler())])
    return ColumnTransformer([("num", numeric, NUMERIC),
                              ("nom", nominal, NOMINAL),
                              ("ord", ordinal, ORDINAL)])


def main() -> None:
    df = make_housing()
    print(f"{len(df)} houses. Missing values per column:")
    print(df.isna().sum()[lambda s: s > 0].to_string())

    X, y = df.drop(columns="price"), df["price"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=88)

    candidates = {
        "baseline": DummyRegressor(),
        "ridge": Ridge(alpha=1.0),
        "knn (k=10)": KNeighborsRegressor(n_neighbors=10),
    }
    cv = KFold(n_splits=5, shuffle=True, random_state=88)
    print("\n5-fold cross-validated MAE on the training set:")
    for name, model in candidates.items():
        pipe = Pipeline([("prep", build_preprocessor()), ("model", model)])
        mae = -cross_val_score(pipe, X_train, y_train, cv=cv, scoring="neg_mean_absolute_error")
        print(f"  {name:<11} {mae.mean():>9,.0f} ± {mae.std():,.0f}")

    final = Pipeline([("prep", build_preprocessor()), ("model", Ridge(alpha=1.0))])
    final.fit(X_train, y_train)
    test_mae = np.abs(final.predict(X_test) - y_test).mean()
    print(f"\nChosen: ridge. Test MAE {test_mae:,.0f} (typical price {y.median():,.0f})")

    names = final.named_steps["prep"].get_feature_names_out()
    print(f"\nThe preprocessor turns 7 raw columns into {len(names)} model inputs:")
    print("  " + ", ".join(n.split("__")[1] for n in names))

    joblib.dump(final, "housing_model.joblib")
    loaded = joblib.load("housing_model.joblib")
    new_houses = pd.DataFrame([
        {"size_m2": 70, "rooms": 3, "year_built": 1985, "distance_km": 2.5,
         "neighbourhood": "Old Town", "house_type": "flat", "condition": "good"},
        {"size_m2": 180, "rooms": 6, "year_built": None, "distance_km": 9.0,
         "neighbourhood": "Riverside", "house_type": "detached", "condition": "excellent"},
        {"size_m2": 95, "rooms": 4, "year_built": 2010, "distance_km": 4.0,
         "neighbourhood": "Brand New Estate", "house_type": "terraced", "condition": None},
    ])
    print("\nReloaded model, pricing new houses (note the gaps and the unknown neighbourhood):")
    for (_, house), price in zip(new_houses.iterrows(), loaded.predict(new_houses)):
        print(f"  {house['size_m2']:>4.0f} m² {house['house_type']:<9} in {house['neighbourhood']:<17} -> {price:>10,.0f}")


if __name__ == "__main__":
    main()
