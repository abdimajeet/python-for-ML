# day87_evaluation_report.py
# Evaluate a cancer classifier properly and write the results to a Markdown report.

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (ConfusionMatrixDisplay, RocCurveDisplay, classification_report,
                             confusion_matrix, precision_score, recall_score, roc_auc_score)
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

HERE = Path(__file__).parent

# In this dataset 0 = malignant, 1 = benign. Flip it so 1 means "cancer", the thing we want to catch.
data = load_breast_cancer()
X, y = data.data, 1 - data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=87, stratify=y)

model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000))
model.fit(X_train, y_train)
proba = model.predict_proba(X_test)[:, 1]
pred = (proba >= 0.5).astype(int)

cm = confusion_matrix(y_test, pred)
tn, fp, fn, tp = cm.ravel()
report = classification_report(y_test, pred, target_names=["benign", "malignant"], digits=3)
auc = roc_auc_score(y_test, proba)
print(f"Test set: {len(y_test)} tumours, {y_test.sum()} malignant")
print(report)
print(f"Missed cancers (false negatives): {fn};  false alarms: {fp};  ROC AUC: {auc:.3f}")

# The threshold trade-off
rows = []
for t in (0.1, 0.2, 0.3, 0.5, 0.7, 0.9):
    p = (proba >= t).astype(int)
    rows.append((t, precision_score(y_test, p), recall_score(y_test, p),
                 int(((p == 0) & (y_test == 1)).sum()), int(((p == 1) & (y_test == 0)).sum())))
print("\nthreshold  precision  recall  missed  false alarms")
for t, prec, rec, missed, alarms in rows:
    print(f"   {t:.1f}       {prec:.3f}    {rec:.3f}    {missed:>3}      {alarms:>3}")

# Cross-validation on the whole dataset for a more reliable estimate
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=87)
scores = cross_validate(model, X, y, cv=cv, scoring=["accuracy", "precision", "recall", "roc_auc"])
print("\n5-fold cross-validation:")
cv_lines = []
for metric in ("accuracy", "precision", "recall", "roc_auc"):
    values = scores[f"test_{metric}"]
    line = f"{metric:<10} {values.mean():.3f} ± {values.std():.3f}"
    cv_lines.append(f"| {metric} | {values.mean():.3f} | {values.std():.3f} |")
    print("  " + line)

# Charts
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
ConfusionMatrixDisplay(cm, display_labels=["benign", "malignant"]).plot(ax=axes[0], colorbar=False)
axes[0].set_title("Confusion matrix (threshold 0.5)")
RocCurveDisplay.from_predictions(y_test, proba, ax=axes[1], name="logistic regression")
axes[1].plot([0, 1], [0, 1], "k--", lw=0.8, label="coin flip")
axes[1].set_title(f"ROC curve (AUC = {auc:.3f})")
axes[1].legend()
fig.tight_layout()
fig.savefig(HERE / "evaluation_charts.png", dpi=120)

# Markdown report
threshold_rows = "\n".join(f"| {t:.1f} | {p:.3f} | {r:.3f} | {m} | {a} |" for t, p, r, m, a in rows)
md = f"""# Breast cancer classifier: evaluation

**Model:** standard scaling + logistic regression, 30 features.
**Test set:** {len(y_test)} tumours ({y_test.sum()} malignant), never used in training.

## Results at threshold 0.5
- Caught **{tp} of {tp + fn}** malignant tumours (recall {tp / (tp + fn):.1%}).
- Missed **{fn}** cancers and raised **{fp}** false alarms.
- ROC AUC: **{auc:.3f}**.

![charts](evaluation_charts.png)

## Choosing a threshold
Missing a cancer is far worse than a false alarm (which only leads to another test),
so a threshold below 0.5 is worth considering.

| threshold | precision | recall | missed cancers | false alarms |
|---|---|---|---|---|
{threshold_rows}

## Cross-validation (5 folds, whole dataset)
| metric | mean | std |
|---|---|---|
{chr(10).join(cv_lines)}

## Limitations
- 569 tumours from one hospital; performance elsewhere is unknown.
- Probabilities have not been checked for calibration.
"""
(HERE / "evaluation_report.md").write_text(md, encoding="utf-8")
print("\nWrote evaluation_report.md and evaluation_charts.png")
