# Day 89: Trees and forests

**Level 5, Machine Learning & AI Foundations.** Project: **Loan approval model**

Decision trees make predictions by asking a series of yes/no questions, the way a person might. They handle mixed data with no scaling, can be read like a flowchart, and when you grow hundreds of them into a **random forest**, they become one of the most reliable models for tabular data.

## Lesson

### How a tree decides

A tree starts with all the data and picks the question that best separates the classes, for example "credit score below 620?". It repeats on each side until the groups are pure or a limit is reached. To predict, a new example walks down the questions to a leaf. `export_text(tree, feature_names=...)` prints the rules.


### Choosing splits

"Best" means the split that most reduces **impurity**. **Gini impurity** is 0 for a group that's all one class and highest for a 50/50 mix. The tree tries every feature and threshold and keeps the one with the biggest drop. You never compute this yourself, but it explains why trees need no scaling: only the order of values matters.


### Trees overfit

Left unlimited, a tree keeps splitting until every training example sits in its own leaf: 100% training accuracy and poor results on new data. Limit it with `max_depth`, `min_samples_leaf` or `max_leaf_nodes`. Always compare training and test scores; a big gap means overfitting.

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)
for depth in (2, None):
    t = DecisionTreeClassifier(max_depth=depth, random_state=0).fit(X_tr, y_tr)
    print(depth, round(t.score(X_tr, y_tr), 3), round(t.score(X_te, y_te), 3))
```

Output:

```text
2 0.941 0.937
None 1.0 0.881
```

### Random forests

A **random forest** trains many trees, each on a random sample of the rows and considering a random subset of features at each split, then lets them vote. Individual trees overfit in different ways and their errors cancel out. `RandomForestClassifier(n_estimators=300)` is a strong default for almost any table of data.


### Which features matter?

`model.feature_importances_` shows how much each feature reduced impurity across the forest. It's fast but favours features with many unique values. **Permutation importance** is more honest: shuffle one column in the test set and measure how much the score drops. If shuffling a feature doesn't hurt, the model wasn't really using it.


## Exercises

1. Train a `DecisionTreeClassifier(max_depth=2)` on the iris dataset and print its rules with `export_text`.

<details><summary>Solution</summary>

```python
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_text
iris = load_iris()
t = DecisionTreeClassifier(max_depth=2).fit(iris.data, iris.target)
print(export_text(t, feature_names=iris.feature_names))
```

</details>

2. Compute the Gini impurity of a group with 8 approved and 2 rejected loans. (Gini = 1 - sum of squared class proportions.)

<details><summary>Solution</summary>

```python
p = [0.8, 0.2]
print(1 - sum(x ** 2 for x in p))   # 0.32
```

</details>

3. Compare a single tree with a 200-tree random forest on the breast cancer test set.

<details><summary>Solution</summary>

```python
from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=200, random_state=0).fit(X_tr, y_tr)
print(rf.score(X_te, y_te))
```

</details>

## Project: Loan approval model

A lender wants a model that predicts whether a loan application will be approved, and wants to understand its reasoning. Generate realistic applicants, train a shallow tree you can read as rules, show how an unlimited tree overfits, train a random forest, explain predictions with feature and permutation importance, and walk one applicant through the decision.

Files in this folder: `day89_loan_model.py`.

### Key lines explained

- `score = (0.02 * (credit_score - 620) - 2.5 * (burden - 0.8) ...)`: The hidden rule behind approvals. The model never sees it; it must rediscover which factors matter from the examples.
- `X["debt_to_income"] = ...`: Feature engineering: lenders think in ratios, so giving the model the ratio directly makes its job easier and its rules clearer.
- `export_text(small, ...)`: Prints the tree as nested if/else rules a loan officer can read and challenge.
- `RandomForestClassifier(n_estimators=300, min_samples_leaf=2, n_jobs=-1)`: 300 trees, each leaf holding at least 2 applicants, trained on all CPU cores.
- `permutation_importance(forest, X_test, y_test, ...)`: Shuffles each column of the test set 10 times and records how much accuracy drops.
- `while tree.children_left[node] != -1:`: Walks the fitted tree by hand. A node with no children (-1) is a leaf.

### Stretch goals

- Use `sklearn.tree.plot_tree` to draw the small tree and save it as a PNG.
- Compare approval rates by `purpose` in the data and in the model's predictions. Is the model treating groups differently? Discuss whether that's fair.
- Try `HistGradientBoostingClassifier` and compare it with the forest.

## Test it

- [ ] The unlimited tree should score 1.000 on training data and noticeably lower on the test set.
- [ ] The forest should have the best test score.
- [ ] The top split of the small tree should use credit score or debt-to-income.
- [ ] Pick another applicant (`iloc[[5]]`) and follow their path.
