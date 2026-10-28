# Day 84: Linear regression from scratch

**Level 5, Machine Learning & AI Foundations.** Project: **House price predictor**

Today you put the last three days together: data in a matrix, a prediction as a dot product, and gradient descent to find the best weights. The result is linear regression, built with nothing but NumPy.

## Lesson

### The model

Linear regression predicts a number as a weighted sum of the inputs plus a constant: `price = w1*size + w2*bedrooms + w3*age + b`. The weights say how much each feature matters, and `b` (the **bias** or intercept) is the starting value. For all houses at once: `predictions = X @ w + b`.


### The loss function

To learn, we need one number that says how wrong the model is. The **mean squared error** (MSE) averages the squared differences between predictions and true values. Squaring makes all errors positive and punishes big misses heavily. Training means finding the `w` and `b` that make the MSE as small as possible.

```python
import numpy as np

y_true = np.array([200, 150, 300])
y_pred = np.array([210, 140, 270])
mse = ((y_pred - y_true) ** 2).mean()
print(mse, np.sqrt(mse).round(1))
```

Output:

```text
366.6666666666667 19.1
```

### The gradient of the MSE

For linear regression the gradient has a neat formula, so we don't need numerical estimates. With `error = X @ w + b - y`: the gradient for `w` is `2 * X.T @ error / n` and for `b` it's `2 * error.mean()`. Each step moves every weight against its share of the error.


### Feature scaling

House size runs into hundreds, bedrooms go from 1 to 6. With raw features, one learning rate is too big for one and too small for the other. **Standardising** each column to mean 0 and standard deviation 1 (`(X - mean) / std`) puts them on an equal footing, and gradient descent becomes fast and stable. Remember to apply the same `mean` and `std` to new data.


### Checking the result

**RMSE** (square root of MSE) is in the target's units: "typically off by 19k". **R²** compares the model with always guessing the average: 1 is perfect, 0 is no better than the average. Linear regression also has an exact solution (the **normal equation**), which we can use to check our gradient descent.


## Exercises

1. Standardise the column `[50, 100, 150]` by hand and with NumPy.

<details><summary>Solution</summary>

```python
x = np.array([50, 100, 150])
print((x - x.mean()) / x.std())   # [-1.22  0.    1.22]
```

</details>

2. Write `r2(y_true, y_pred)` = 1 - (sum of squared errors) / (sum of squared differences from the mean).

<details><summary>Solution</summary>

```python
def r2(y_true, y_pred):
    ss_res = ((y_true - y_pred) ** 2).sum()
    ss_tot = ((y_true - y_true.mean()) ** 2).sum()
    return 1 - ss_res / ss_tot
```

</details>

3. Why should you not compute `mean` and `std` on the test data when scaling it?

<details><summary>Solution</summary>

```python
# The test set stands in for future data you haven't seen.
# Using its statistics leaks information and makes the score look better than reality.
# Always reuse the training mean and std.
```

</details>

## Project: House price predictor

Generate a realistic dataset of 500 houses, split it into training and test sets, standardise the features, and train linear regression with your own gradient descent. Compare it with the exact normal-equation solution, report RMSE and R² on the test set, show which features matter most, and predict prices for new houses.

Files in this folder: `day84_house_prices.py`.

### Key lines explained

- `price = (1_800 * size + ...)`: We know the true rule because we invented it. That lets us check whether the model rediscovers it, a common trick for testing ML code.
- `scaler = Scaler().fit(X_train)`: Mean and standard deviation come from the training set only, and are reused for the test set and new houses.
- `error = X @ self.w + self.b - y`: Predictions for every training house at once, minus the truth.
- `self.w -= self.learning_rate * 2 * X.T @ error / n`: The MSE gradient for the weights. `X.T @ error` adds up how much each feature contributed to the errors.
- `np.linalg.solve(A.T @ A, A.T @ y_train)`: The normal equation, the exact least-squares answer. If gradient descent is correct, both agree.
- `baseline = np.full(len(y_test), y_train.mean())`: Always compare against a dumb baseline. A model is only useful if it beats "guess the average".

### Stretch goals

- Train without scaling (use the raw `X`) and find a learning rate that works. What goes wrong?
- Convert the weights back to dollars per m², per bedroom and so on by dividing by `scaler.std`. Compare with the true rule.
- Plot `model.history` to show the loss curve.

## Test it

- [ ] The training RMSE should fall quickly, then level off.
- [ ] Gradient descent and the normal equation should agree.
- [ ] The model's test RMSE should be far lower than the baseline's, and R² well above 0.8.
- [ ] Size should be the most important feature.
