# Day 87: Model evaluation

**Level 5, Machine Learning & AI Foundations.** Project: **Classifier evaluation report**

"95% accurate" can describe a useless model. Today you learn to evaluate classifiers properly: which mistakes it makes, how the threshold trades one mistake for another, and how cross-validation gives a score you can trust.

## Lesson

### Why accuracy misleads

If 1% of transactions are fraud, a model that always says "not fraud" is 99% accurate and catches nothing. When classes are unbalanced, or when one mistake costs more than the other, you need more detailed measures.


### The confusion matrix

Count the four outcomes. **True positives** (TP): said yes, was yes. **False positives** (FP): said yes, was no (a false alarm). **False negatives** (FN): said no, was yes (a miss). **True negatives** (TN). `confusion_matrix(y_true, y_pred)` returns `[[TN, FP], [FN, TP]]`.

```python
from sklearn.metrics import confusion_matrix

y_true = [1, 1, 1, 0, 0, 0, 0, 0]
y_pred = [1, 1, 0, 1, 0, 0, 0, 0]
print(confusion_matrix(y_true, y_pred))
```

Output:

```text
[[4 1]
 [1 2]]
```

### Precision, recall and F1

**Precision** = TP / (TP + FP): when the model says yes, how often is it right? **Recall** = TP / (TP + FN): of all real yeses, how many did it find? A cancer screen needs high recall (don't miss anyone); a spam filter needs high precision (don't bin real email). **F1** combines both into one number. `classification_report` prints all of them.


### Thresholds and ROC AUC

Lowering the threshold catches more positives (recall rises) but raises more false alarms (precision falls). The **ROC curve** shows this trade-off at every threshold, and the area under it (**AUC**) summarises ranking quality: 0.5 is a coin flip, 1.0 is perfect. Choose the threshold based on what the mistakes cost.


### Cross-validation

One train/test split is one roll of the dice. **k-fold cross-validation** splits the data into k parts, trains k times, each time testing on a different part, and averages. `cross_val_score(model, X, y, cv=5)` does it in one line and the spread shows how stable the score is. Use `StratifiedKFold` to keep class proportions in each fold.


## Exercises

1. From the confusion matrix above, compute precision and recall by hand.

<details><summary>Solution</summary>

```python
# TP=2, FP=1, FN=1
# precision = 2 / (2 + 1) = 0.67
# recall    = 2 / (2 + 1) = 0.67
```

</details>

2. A model predicts fraud for 50 transactions; 40 really are fraud. There were 200 frauds in total. What are precision and recall?

<details><summary>Solution</summary>

```python
# precision = 40 / 50 = 0.8
# recall    = 40 / 200 = 0.2   (it misses most fraud)
```

</details>

3. Run 5-fold cross-validation of `LogisticRegression(max_iter=5000)` on `load_breast_cancer` and print the mean and standard deviation.

<details><summary>Solution</summary>

```python
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
X, y = load_breast_cancer(return_X_y=True)
scores = cross_val_score(LogisticRegression(max_iter=5000), X, y, cv=5)
print(scores.mean().round(3), scores.std().round(3))
```

</details>

## Project: Classifier evaluation report

Train a classifier that flags breast tumours as malignant from 30 measurements, then write a proper evaluation: confusion matrix, precision and recall, ROC AUC, a threshold table showing the trade-off, and cross-validated scores. The script writes `evaluation_report.md` and two charts, the kind of report a team would want before trusting a medical model.

Files in this folder: `day87_evaluation_report.py`.

### Key lines explained

- `X, y = data.data, 1 - data.target`: The dataset codes malignant as 0. Flipping it makes "positive" mean cancer, so precision and recall talk about the class we care about.
- `make_pipeline(StandardScaler(), LogisticRegression(...))`: Glues scaling and the model into one estimator, so cross-validation re-fits the scaler inside each fold. Day 88 covers pipelines properly.
- `tn, fp, fn, tp = cm.ravel()`: `ravel` flattens the 2×2 matrix in the order TN, FP, FN, TP.
- `(proba >= t).astype(int)`: Applying your own threshold to the probabilities instead of relying on `predict`'s fixed 0.5.
- `cross_validate(..., scoring=[...])`: Like `cross_val_score` but with several metrics at once. The ± is the standard deviation across folds.
- `{chr(10).join(cv_lines)}`: `chr(10)` is a newline. Backslashes aren't allowed inside f-string braces before Python 3.12, so this is a portable trick.

### Stretch goals

- Pick the highest threshold that still catches every cancer in the test set and add it to the report.
- Compare with `DummyClassifier(strategy="most_frequent")`: what's its accuracy, and what's its recall?
- Add a precision-recall curve with `PrecisionRecallDisplay`.

## Test it

- [ ] Accuracy should be around 95% or higher, with AUC near 0.99. This particular test split may look almost perfect; the cross-validation scores are lower and more honest, because one split can be lucky.
- [ ] In the threshold table, recall should rise as the threshold falls.
- [ ] Open `evaluation_report.md` in VS Code's preview and check the chart appears.
- [ ] Explain to someone why a lower threshold could be the right choice here.
