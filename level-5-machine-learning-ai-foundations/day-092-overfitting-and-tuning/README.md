# Day 92: Overfitting and tuning

**Level 5, Machine Learning & AI Foundations.** Project: **Tune a model properly**

A model that's perfect on training data and poor on new data has **overfitted**: it memorised instead of learning. Today you'll see overfitting and underfitting happen, control them with regularisation, and tune settings with a grid search without fooling yourself.

## Lesson

### Underfitting and overfitting

An **underfit** model is too simple to capture the pattern (a straight line through a curve): it does badly on training and test data alike. An **overfit** model is so flexible it follows the noise: excellent on training data, poor on test data. The goal is the sweet spot in between, and you find it by watching the **validation** score, never the training score.


### Bias and variance

**Bias** is error from wrong assumptions (too simple). **Variance** is error from being too sensitive to the particular training sample (too complex): retrain on slightly different data and the predictions jump around. More complexity lowers bias and raises variance. More data lowers variance, which is why big datasets allow big models.


### Regularisation

Regularisation penalises complexity during training. **Ridge** (L2) adds a penalty on the size of the weights, pulling them towards zero; **Lasso** (L1) can set some exactly to zero, which also selects features. A bigger `alpha` means a stronger pull. In `LogisticRegression` and `SVC` the knob is `C`, which works the other way: smaller `C` means stronger regularisation.


### Hyperparameters and grid search

**Hyperparameters** are settings you choose before training, like `max_depth`, `alpha` or `n_neighbors`. `GridSearchCV(pipeline, param_grid, cv=5)` tries every combination with cross-validation on the training data and refits the best one. Parameters inside a pipeline are named `step__param`, such as `"svc__C"`.

```python
from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

pipe = make_pipeline(StandardScaler(), SVC())
grid = {"svc__C": [0.1, 1, 10], "svc__gamma": ["scale", 0.01]}
search = GridSearchCV(pipe, grid, cv=5)   # 6 combinations x 5 folds = 30 fits
```

### The three-way split

If you tune on the test set, the test score stops being honest: you've chosen whatever got lucky on it. The discipline: split off a test set first and lock it away; tune with cross-validation on the training set; evaluate the final model on the test set **once**. A learning curve (score versus training size) tells you whether more data would help.


## Exercises

1. A model scores 0.99 on training data and 0.70 on validation. Overfitting or underfitting? Name two fixes.

<details><summary>Solution</summary>

```python
# Overfitting. Fixes: more regularisation (or a simpler model, e.g. smaller max_depth),
# more training data, fewer or better features.
```

</details>

2. Fit `Ridge` with alpha 0.01, 1 and 100 on the diabetes data and print the largest absolute weight each time.

<details><summary>Solution</summary>

```python
from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
X, y = load_diabetes(return_X_y=True)
for a in (0.01, 1, 100):
    print(a, abs(Ridge(alpha=a).fit(X, y).coef_).max().round(1))
```

</details>

3. How many model fits does a grid search with 4 values of C, 3 of gamma and cv=5 perform (not counting the final refit)?

<details><summary>Solution</summary>

```python
print(4 * 3 * 5)   # 60
```

</details>

## Project: Tune a model properly

Three experiments in one script. First, watch underfitting and overfitting happen as you raise the degree of a polynomial fitted to noisy data. Second, rescue the overfit model with Ridge regularisation. Third, tune a support vector classifier on the digits with a grid search, following the train/validate/test discipline, and draw a learning curve.

Files in this folder: `day92_tuning.py`.

### Key lines explained

- `PolynomialFeatures(degree)`: Adds columns x², x³ … up to x to the power of `degree`, so a linear model can draw curves. More degrees means more flexibility.
- `note = "  <- underfit" if degree == 1 else ...`: Labels the two extremes. Degree 15 has the lowest training error of all, yet its validation error is worse than degree 3, 5 or 9: the signature of overfitting.
- `model[-1].coef_`: A pipeline can be indexed like a list; `[-1]` is the final step, the Ridge model. Its weights shrink as alpha grows.
- `GridSearchCV(pipe, grid, cv=5, n_jobs=-1)`: 16 combinations × 5 folds, run in parallel. Only training data is used; the test set stays locked away.
- `search.score(X_test, y_test)`: The one and only time the test set is used, to report how the chosen model does on unseen data.
- `learning_curve(...)`: Retrains on growing slices of the training data. If the validation line is still climbing at the end, more data would help.

### Stretch goals

- Replace the grid search with `RandomizedSearchCV` and a wider range of C values (use `scipy.stats.loguniform`).
- Try `Lasso` in experiment 2 and count how many weights become exactly zero.
- Add a validation curve for `max_depth` of a decision tree on the Day 89 loan data.

## Test it

- [ ] Degree 1 should have high error everywhere; degree 15 should have the lowest training error but a higher validation error than degree 3 or 5.
- [ ] Ridge with a moderate alpha should bring the degree-15 validation error down.
- [ ] The best SVM should reach about 98% cross-validated accuracy, and the test accuracy should be similar.
- [ ] Open both PNGs and explain each in one sentence.
