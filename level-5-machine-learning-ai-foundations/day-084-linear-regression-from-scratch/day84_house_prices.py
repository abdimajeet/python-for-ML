# day84_house_prices.py
# Linear regression from scratch: data, scaling, gradient descent, evaluation.

import numpy as np

rng = np.random.default_rng(84)
FEATURES = ["size_m2", "bedrooms", "age_years", "distance_km"]


def make_houses(n: int = 500) -> tuple[np.ndarray, np.ndarray]:
    size = rng.normal(110, 35, n).clip(30, 300)
    bedrooms = np.clip(np.round(size / 35 + rng.normal(0, 0.7, n)), 1, 6)
    age = rng.uniform(0, 60, n)
    distance = rng.gamma(2.0, 4.0, n)                 # km from the city centre
    price = (1_800 * size + 9_000 * bedrooms - 900 * age - 3_500 * distance
             + 40_000 + rng.normal(0, 18_000, n))      # in dollars, plus noise
    X = np.column_stack([size, bedrooms, age, distance])
    return X, price


def train_test_split(X, y, test_fraction=0.2):
    order = rng.permutation(len(X))
    cut = int(len(X) * (1 - test_fraction))
    train, test = order[:cut], order[cut:]
    return X[train], X[test], y[train], y[test]


class Scaler:
    def fit(self, X):
        self.mean, self.std = X.mean(axis=0), X.std(axis=0)
        return self

    def transform(self, X):
        return (X - self.mean) / self.std


class LinearRegressionGD:
    def __init__(self, learning_rate=0.1, epochs=500):
        self.learning_rate, self.epochs = learning_rate, epochs

    def fit(self, X, y):
        n, d = X.shape
        self.w, self.b = np.zeros(d), 0.0
        self.history = []
        for _ in range(self.epochs):
            error = X @ self.w + self.b - y
            self.history.append((error ** 2).mean())
            self.w -= self.learning_rate * 2 * X.T @ error / n
            self.b -= self.learning_rate * 2 * error.mean()
        return self

    def predict(self, X):
        return X @ self.w + self.b


def rmse(y, p):
    return float(np.sqrt(((y - p) ** 2).mean()))


def r2(y, p):
    return float(1 - ((y - p) ** 2).sum() / ((y - y.mean()) ** 2).sum())


def main() -> None:
    X, y = make_houses()
    X_train, X_test, y_train, y_test = train_test_split(X, y)
    scaler = Scaler().fit(X_train)                     # statistics from training data only
    Xs_train, Xs_test = scaler.transform(X_train), scaler.transform(X_test)

    model = LinearRegressionGD().fit(Xs_train, y_train)
    print(f"Trained on {len(X_train)} houses, tested on {len(X_test)}")
    for epoch in (0, 10, 50, 499):
        print(f"  epoch {epoch:>3}: training RMSE {np.sqrt(model.history[epoch]):>10,.0f}")

    # Exact answer for comparison: add a column of ones for the bias, then solve
    A = np.column_stack([np.ones(len(Xs_train)), Xs_train])
    exact = np.linalg.solve(A.T @ A, A.T @ y_train)
    print(f"\nGradient descent and the normal equation agree: "
          f"{np.allclose(np.r_[model.b, model.w], exact, rtol=1e-3)}")

    baseline = np.full(len(y_test), y_train.mean())
    pred = model.predict(Xs_test)
    print(f"\nTest RMSE: model {rmse(y_test, pred):,.0f} vs always-guess-the-mean {rmse(y_test, baseline):,.0f}")
    print(f"Test R²:   {r2(y_test, pred):.3f}")

    print("\nWhat moves the price? (effect of one standard deviation)")
    for name, w in sorted(zip(FEATURES, model.w), key=lambda t: -abs(t[1])):
        print(f"  {name:<12} {w:>+10,.0f}")

    new = np.array([[80, 2, 30, 3.0], [150, 4, 5, 12.0], [220, 5, 1, 1.5]])
    print("\nPredictions for new houses:")
    for house, price in zip(new, model.predict(scaler.transform(new))):
        print(f"  {house[0]:>4.0f} m², {house[1]:.0f} bed, {house[2]:>2.0f} yrs, {house[3]:>4.1f} km -> {price:>10,.0f}")


if __name__ == "__main__":
    main()
