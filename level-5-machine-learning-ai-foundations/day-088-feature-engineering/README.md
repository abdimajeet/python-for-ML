# Day 88: Feature engineering

**Level 5, Machine Learning & AI Foundations.** Project: **Housing pipeline**

Real datasets mix numbers, categories and missing values. Today you learn to transform them properly with scikit-learn's preprocessing tools, and to bundle every step with the model in a **pipeline** so nothing can leak or be forgotten.

## Lesson

### Scaling numbers

`StandardScaler` rescales each column to mean 0 and standard deviation 1. Like every transformer it has `fit` (learn the mean and std from training data) and `transform` (apply them). `fit_transform` does both on the training set; on test data you only `transform`. Many models (linear, k-nearest neighbours, neural networks) need it; trees don't.


### Encoding categories

`OneHotEncoder` turns a text column into one 0/1 column per category. Use `handle_unknown="ignore"` so a category never seen in training becomes all zeros instead of crashing. For ordered categories (small, medium, large), `OrdinalEncoder` keeps the order as 0, 1, 2.

```python
from sklearn.preprocessing import OneHotEncoder
import pandas as pd

enc = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
enc.fit(pd.DataFrame({"city": ["Nairobi", "Mogadishu", "Nairobi"]}))
print(enc.get_feature_names_out(), enc.transform(pd.DataFrame({"city": ["Mogadishu", "Paris"]})))
```

Output:

```text
['city_Mogadishu' 'city_Nairobi'] [[1. 0.]
 [0. 0.]]
```

### Filling gaps

`SimpleImputer(strategy="median")` fills missing numbers with the training median; `strategy="most_frequent"` works for categories. `add_indicator=True` also adds a "was missing" column, because sometimes the gap itself carries information.


### ColumnTransformer

`ColumnTransformer` applies different steps to different columns: impute and scale the numbers, impute and one-hot the categories, and join the results. You describe it as a list of `(name, transformer, columns)`.


### Pipelines prevent leakage

`Pipeline([("prep", preprocessor), ("model", Ridge())])` chains everything into one estimator. Calling `fit` fits each step on the training data only; `predict` applies the same steps to new data. Cross-validation re-fits the whole pipeline inside each fold, so test folds never influence preprocessing. Save the pipeline and you've saved the whole recipe.


## Exercises

1. Scale `[[1], [2], [3]]` with `StandardScaler`, then transform `[[4]]` with the same scaler.

<details><summary>Solution</summary>

```python
from sklearn.preprocessing import StandardScaler
s = StandardScaler().fit([[1], [2], [3]])
print(s.transform([[4]]))   # [[2.449...]]
```

</details>

2. Use `SimpleImputer(strategy="median")` on `[[1], [None], [5], [7]]`.

<details><summary>Solution</summary>

```python
from sklearn.impute import SimpleImputer
import numpy as np
print(SimpleImputer(strategy="median").fit_transform(np.array([[1], [np.nan], [5], [7]])))
```

</details>

3. Explain in one sentence what goes wrong if you scale the whole dataset before splitting it.

<details><summary>Solution</summary>

```python
# The scaler's mean and std include the test rows, so information about the test set
# leaks into training and the test score becomes optimistic.
```

</details>

## Project: Housing pipeline

Build a complete preprocessing + model pipeline for a messy housing dataset with numbers, categories and gaps. Cross-validate it, compare a few models fairly, show what the pipeline produces internally, and save the fitted pipeline with `joblib` so a new script can load it and price houses from plain dictionaries.

Files in this folder: `day88_housing_pipeline.py`.

### Key lines explained

- `df.loc[rng.random(n) < frac, col] = np.nan`: Knocks random holes in a few columns so the pipeline has to cope with missing data, as it would in real life.
- `SimpleImputer(strategy="median", add_indicator=True)`: Fills gaps with the training median and adds a column saying which values were missing.
- `OrdinalEncoder(categories=[CONDITIONS])`: Condition has a natural order, so it becomes 0 to 3 rather than four unrelated columns.
- `ColumnTransformer([...])`: Routes each group of columns through its own mini-pipeline and joins the outputs side by side.
- `-cross_val_score(..., scoring="neg_mean_absolute_error")`: scikit-learn always maximises scores, so error metrics are negated. The minus sign turns them back into normal MAE.
- `joblib.dump(final, "housing_model.joblib")`: Saves the whole fitted pipeline: imputers, encoders, scaler and model. Loading it gives back an object that takes raw rows.

### Stretch goals

- Remove the scaler from the numeric pipeline and rerun. Which model suffers most, and why?
- Add a feature `age = 2026 - year_built` with a `FunctionTransformer`.
- Write `price_house.py` that loads the saved model and asks the user for a house's details with `input()`.

## Test it

- [ ] Ridge should beat the baseline's MAE by a wide margin.
- [ ] Check that the house in "Brand New Estate" gets a price instead of an error. Which setting makes that possible?
- [ ] Delete `housing_model.joblib`, rerun, and confirm it's recreated.
- [ ] Count the model inputs and explain where each one comes from.
