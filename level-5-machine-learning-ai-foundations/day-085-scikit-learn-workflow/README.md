# Day 85: scikit-learn workflow

**Level 5, Machine Learning & AI Foundations.** Project: **Regression with scikit-learn**

You've built linear regression by hand. Now meet scikit-learn, the library that wraps dozens of models behind one consistent interface. Learn the workflow once and you can use any of them.

## Lesson

### The estimator interface

Every scikit-learn model is an **estimator** with the same methods: `model.fit(X, y)` learns from data, `model.predict(X)` makes predictions, and `model.score(X, y)` gives a default metric (R² for regression). Learned values end with an underscore, such as `model.coef_`. Install with `pip install scikit-learn`; import it as `sklearn`.

```python
from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4]])
y = np.array([3, 5, 7, 9])
model = LinearRegression().fit(X, y)
print(model.coef_, round(model.intercept_, 2), model.predict([[10]]))
```

Output:

```text
[2.] 1.0 [21.]
```

### Train/test split

A model must be judged on data it hasn't seen, or you only measure memory. `train_test_split(X, y, test_size=0.2, random_state=0)` shuffles and splits in one line. `random_state` makes the split reproducible. Look at the test set **once**, at the end; don't tune on it.


### Baselines first

`DummyRegressor(strategy="mean")` always predicts the training average. It is the bar every real model must clear. If a fancy model barely beats it, the features probably don't carry much signal.


### Regression metrics

`sklearn.metrics` has them all: `mean_absolute_error` (MAE, average miss in real units, easy to explain), `root_mean_squared_error` (punishes big misses), and `r2_score`. Report at least one metric people can understand, such as "off by 43 points on average".


### Built-in datasets

scikit-learn ships small datasets for practice, loaded with functions like `load_diabetes()`, `load_breast_cancer()` and `load_digits()`. Pass `as_frame=True` to get pandas objects with column names. They come with the library, so no download is needed.


## Exercises

1. Load the diabetes dataset as a DataFrame and print its shape and column names.

<details><summary>Solution</summary>

```python
from sklearn.datasets import load_diabetes
data = load_diabetes(as_frame=True)
print(data.frame.shape, list(data.feature_names))
```

</details>

2. Fit a `LinearRegression` using only the `bmi` column. What R² does it get on a test set?

<details><summary>Solution</summary>

```python
from sklearn.model_selection import train_test_split
X = data.frame[["bmi"]]
y = data.target
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)
print(LinearRegression().fit(X_tr, y_tr).score(X_te, y_te))
```

</details>

3. What does `random_state` do, and why should you set it?

<details><summary>Solution</summary>

```python
# It fixes the random shuffling so the split (and results) are the same every run.
# That makes experiments reproducible and comparisons between models fair.
```

</details>

## Project: Regression with scikit-learn

Predict how much a diabetes patient's condition progresses over a year from ten medical measurements. Follow the full workflow: explore, split, fit a baseline, then compare three models (linear regression, ridge and a k-nearest-neighbours regressor) on the same test set, and explain which features matter.

Files in this folder: `day85_sklearn_regression.py`.

### Key lines explained

- `load_diabetes(as_frame=True)`: A real dataset of 442 patients that ships with scikit-learn. `as_frame=True` gives a DataFrame with named columns.
- `train_test_split(X, y, test_size=0.2, random_state=85)`: Splits before any modelling, so nothing about the test patients influences training.
- `for name, model in models.items():`: Because every estimator has `fit` and `predict`, one loop compares four very different models. That shared interface is scikit-learn's big idea.
- `DummyRegressor(strategy="mean")`: The baseline. A real model has to beat it to be worth anything.
- `coefs.sort_values(key=abs, ascending=False)`: Sorts by size regardless of sign, so the strongest effects come first whether they push the target up or down.

### Stretch goals

- Try `alpha` values of 0.01, 1 and 10 for Ridge. What happens to the weights and the score?
- Change `n_neighbors` from 1 to 50 and plot the test MAE.
- Use only the three most correlated features. How much accuracy do you lose?

## Test it

- [ ] Every model should beat the baseline's MAE.
- [ ] R² on this dataset is modest (around 0.4 to 0.5): medical data is noisy. That's normal, not a bug.
- [ ] Change `random_state` and see how much the scores move. That variation is why Day 87 introduces cross-validation.
- [ ] In the correlation list, `bmi` and `s5` should come top. In the weights, `s1` and `s2` get large opposite weights because they measure almost the same thing; Day 92's regularisation tames this.
