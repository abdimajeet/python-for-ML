# day92_tuning.py
# Overfitting, regularisation and honest hyperparameter tuning.

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.datasets import load_digits
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import GridSearchCV, learning_curve, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.svm import SVC

rng = np.random.default_rng(92)

# ---------- 1. Polynomial degree: from underfitting to overfitting ----------
x = np.sort(rng.uniform(0, 1, 40))
y = np.sin(2 * np.pi * x) + rng.normal(0, 0.25, 40)
x_val = rng.uniform(0, 1, 200)
y_val = np.sin(2 * np.pi * x_val) + rng.normal(0, 0.25, 200)
X, X_val = x.reshape(-1, 1), x_val.reshape(-1, 1)

print("1. Fitting a noisy sine curve with polynomials")
print("   degree   train MSE   validation MSE")
fits = {}
for degree in (1, 3, 5, 9, 15):
    model = make_pipeline(PolynomialFeatures(degree), StandardScaler(), LinearRegression()).fit(X, y)
    fits[degree] = model
    train = mean_squared_error(y, model.predict(X))
    val = mean_squared_error(y_val, model.predict(X_val))
    note = "  <- underfit" if degree == 1 else "  <- overfit" if degree == 15 else ""
    print(f"   {degree:>6}   {train:9.3f}   {val:14.3f}{note}")

# ---------- 2. Regularisation tames the degree-15 model ----------
print("\n2. Degree 15 with Ridge regularisation")
print("   alpha     validation MSE   largest weight")
for alpha in (1e-6, 1e-3, 0.1, 1, 10):
    model = make_pipeline(PolynomialFeatures(15), StandardScaler(), Ridge(alpha=alpha)).fit(X, y)
    val = mean_squared_error(y_val, model.predict(X_val))
    biggest = np.abs(model[-1].coef_).max()
    print(f"   {alpha:<8g} {val:14.3f}   {biggest:14.1f}")

grid_x = np.linspace(0, 1, 300).reshape(-1, 1)
fig, ax = plt.subplots(figsize=(7, 4))
ax.scatter(x, y, color="black", s=15, label="training data")
ax.plot(grid_x, np.sin(2 * np.pi * grid_x), "k:", label="true curve")
for degree, style in ((1, "-"), (3, "-"), (15, "--")):
    ax.plot(grid_x, fits[degree].predict(grid_x), style, label=f"degree {degree}")
ax.set(ylim=(-2, 2), title="Underfitting (1), a good fit (3) and overfitting (15)")
ax.legend(fontsize=8)
fig.tight_layout()
fig.savefig("overfitting.png", dpi=120)

# ---------- 3. Honest tuning on the digits ----------
print("\n3. Tuning an SVM on handwritten digits")
X_d, y_d = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X_d, y_d, test_size=0.2, random_state=92, stratify=y_d)

pipe = make_pipeline(StandardScaler(), SVC())
grid = {"svc__C": [0.1, 1, 10, 100], "svc__gamma": ["scale", 0.001, 0.01, 0.1]}
search = GridSearchCV(pipe, grid, cv=5, n_jobs=-1).fit(X_train, y_train)

table = pd.DataFrame(search.cv_results_["params"])
table["cv_accuracy"] = search.cv_results_["mean_test_score"]
pivot = table.pivot(index="svc__C", columns="svc__gamma", values="cv_accuracy")
print("   Cross-validated accuracy for each combination (rows C, columns gamma):")
print("   " + pivot.round(3).to_string().replace("\n", "\n   "))
print(f"   Best: {search.best_params_}, CV accuracy {search.best_score_:.3f}")
print(f"   Test accuracy, measured once at the end: {search.score(X_test, y_test):.3f}")

sizes, train_scores, val_scores = learning_curve(
    search.best_estimator_, X_train, y_train, cv=5, train_sizes=np.linspace(0.1, 1.0, 6), n_jobs=-1)
fig, ax = plt.subplots(figsize=(6, 4))
ax.plot(sizes, train_scores.mean(axis=1), "o-", label="training")
ax.plot(sizes, val_scores.mean(axis=1), "o-", label="cross-validation")
ax.set(xlabel="Training examples", ylabel="Accuracy", title="Learning curve of the tuned SVM")
ax.legend()
fig.tight_layout()
fig.savefig("learning_curve.png", dpi=120)
print("\nSaved overfitting.png and learning_curve.png")
