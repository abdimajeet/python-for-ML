# day85_sklearn_regression.py
# The scikit-learn workflow on a real medical dataset.

import pandas as pd
from sklearn.datasets import load_diabetes
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error, r2_score, root_mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsRegressor

# 1. Load and look
data = load_diabetes(as_frame=True)
df = data.frame
print(f"{len(df)} patients, {len(data.feature_names)} features")
print("Target = disease progression after one year "
      f"(range {df['target'].min():.0f} to {df['target'].max():.0f}, mean {df['target'].mean():.0f})")
print("\nCorrelation of each feature with the target:")
print(df.corr()["target"].drop("target").sort_values(ascending=False).round(2).to_string())

# 2. Split once, before any modelling
X, y = df[data.feature_names], df["target"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=85)

# 3. Compare models on identical data
models = {
    "baseline (mean)": DummyRegressor(strategy="mean"),
    "linear regression": LinearRegression(),
    "ridge": Ridge(alpha=0.1),
    "k-nearest neighbours": KNeighborsRegressor(n_neighbors=15),
}
rows = []
for name, model in models.items():
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    rows.append({
        "model": name,
        "MAE": mean_absolute_error(y_test, pred),
        "RMSE": root_mean_squared_error(y_test, pred),
        "R2": r2_score(y_test, pred),
    })
results = pd.DataFrame(rows).set_index("model").round(2)
print("\nTest-set results:")
print(results.to_string())

best = results["MAE"].idxmin()
gain = results.loc["baseline (mean)", "MAE"] - results.loc[best, "MAE"]
print(f"\nBest model: {best}. It is off by {results.loc[best, 'MAE']:.0f} points on average, "
      f"{gain:.0f} better than guessing the mean.")

# 4. What did the linear model learn?
coefs = pd.Series(models["linear regression"].coef_, index=data.feature_names)
print("\nLinear regression weights (features are already scaled in this dataset):")
print(coefs.sort_values(key=abs, ascending=False).round(0).to_string())

# 5. Look at a few individual predictions
sample = X_test.head(5)
check = pd.DataFrame({
    "actual": y_test.head(5).values,
    "predicted": models[best].predict(sample).round(0),
})
check["miss"] = (check["predicted"] - check["actual"]).round(0)
print("\nFive test patients:")
print(check.to_string(index=False))
