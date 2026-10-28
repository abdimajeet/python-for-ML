# Day 86: Classification

**Level 5, Machine Learning & AI Foundations.** Project: **Titanic survival classifier**

Regression predicts a number; **classification** predicts a category: spam or not, survived or not, which digit. Today's model, logistic regression, is the classic starting point, and it gives probabilities, not just yes or no.

## Lesson

### From scores to probabilities

Logistic regression computes the same weighted sum as linear regression, `z = X @ w + b`, then squashes it through the **sigmoid** function `1 / (1 + e^-z)`, which turns any number into a probability between 0 and 1. A big positive `z` means "very likely yes", zero means 50/50.

```python
import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

print(sigmoid(np.array([-4, 0, 4])).round(3))
```

Output:

```text
[0.018 0.5   0.982]
```

### Decisions and the decision boundary

To turn a probability into a class, compare it with a **threshold**, usually 0.5. The set of inputs where the probability is exactly 0.5 is the **decision boundary**; for logistic regression it's a straight line (or flat surface). Points on one side are predicted "yes", on the other "no".


### Training uses a different loss

Classification uses **log loss** (cross-entropy) instead of MSE. It punishes a confident wrong answer very heavily: predicting 0.99 for something that didn't happen costs far more than predicting 0.6. scikit-learn minimises it for you with `LogisticRegression().fit(X, y)`.


### predict vs predict_proba

`model.predict(X)` gives the class labels. `model.predict_proba(X)` gives one column per class with the probabilities; `[:, 1]` is the probability of class 1. Probabilities are often more useful: a doctor wants to know "80% risk", not just "sick".


### Preparing real data

Models need numbers with no gaps. Fill missing values (using statistics from the training set), turn text categories into 0/1 columns with `pd.get_dummies`, and keep the columns identical between training and new data. Tomorrow's lessons automate this; today we do it by hand to see each step.


## Exercises

1. What probability does the sigmoid give for `z = 2`? And for `z = -2`? Notice anything?

<details><summary>Solution</summary>

```python
print(sigmoid(2), sigmoid(-2))   # 0.881 and 0.119, they add up to 1
```

</details>

2. Fit a `LogisticRegression` on `X = [[1], [2], [3], [6], [7], [8]]` with `y = [0, 0, 0, 1, 1, 1]`. What is the probability of class 1 at `x = 4.5`?

<details><summary>Solution</summary>

```python
from sklearn.linear_model import LogisticRegression
m = LogisticRegression().fit([[1], [2], [3], [6], [7], [8]], [0, 0, 0, 1, 1, 1])
print(m.predict_proba([[4.5]])[0, 1])   # about 0.5, it's the boundary
```

</details>

3. Turn the column `["S", "C", "S", "Q"]` into dummy columns.

<details><summary>Solution</summary>

```python
import pandas as pd
print(pd.get_dummies(pd.Series(["S", "C", "S", "Q"]), prefix="port", dtype=int))
```

</details>

## Project: Titanic survival classifier

Use the Titanic data you explored on Day 79 to predict who survived. Clean and encode the features by hand, train logistic regression, compare it against the "everyone died" baseline, explain what the weights mean, and predict survival chances for some invented passengers (including one like you). Needs `pip install scikit-learn seaborn`; the dataset downloads the first time.

Files in this folder: `day86_titanic_classifier.py`.

### Key lines explained

- `stratify=y`: Keeps the same proportion of survivors in the training and test sets. Use it whenever classes are unbalanced.
- `stats = {"age_median": X_train_raw["age"].median(), ...}`: Gaps are filled with values learned from the training passengers only, so nothing leaks from the test set.
- `out.reindex(columns=stats["columns"], fill_value=0)`: New data might lack a category (say, nobody from port Q), which would give fewer dummy columns. Reindexing forces the exact training layout.
- `np.log1p(out["fare"])`: Fares range from 0 to 512. A log squeezes that long tail so a few rich passengers don't dominate.
- `np.exp(weights['female'])`: Logistic weights are in "log-odds". `exp` turns one into an odds multiplier that's easier to say out loud.
- `model.predict_proba(...)[:, 1]`: Column 1 is the probability of class 1 (survived).

### Stretch goals

- Remove `sex` from the features. How much accuracy is lost?
- Change the threshold from 0.5 to 0.4 and count how many more survivors you catch. Day 87 explores this trade-off.
- Add a feature from the passenger's title (Mr, Mrs, Miss, Master) using the `who` column.

## Test it

- [ ] Accuracy should be clearly above the baseline (roughly 77–80% vs 62%).
- [ ] The `female` weight should be the largest positive one.
- [ ] Change the age of the boy to 40. His chance should fall.
- [ ] Open `survival_by_age.png` and describe it in one sentence.
