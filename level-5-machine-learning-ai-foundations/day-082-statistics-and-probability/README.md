# Day 82: Statistics and probability

**Level 5, Machine Learning & AI Foundations.** Project: **A/B test simulator**

Models make predictions under uncertainty, and statistics is how we reason about that uncertainty. Today you'll describe data, meet the normal distribution, and use simulation to answer a real question: did a change on a website actually help?

## Lesson

### Centre and spread

The **mean** is the average; the **median** is the middle value and ignores extreme outliers. **Variance** is the average squared distance from the mean; its square root, the **standard deviation**, is in the original units. A small standard deviation means values cluster tightly.

```python
import numpy as np

salaries = np.array([30, 32, 35, 36, 40, 250])   # one CEO
print(salaries.mean().round(1), np.median(salaries), salaries.std().round(1))
```

Output:

```text
70.5 35.5 80.3
```

### Random numbers and distributions

`rng = np.random.default_rng(42)` creates a reproducible random generator; the seed means you get the same numbers every run. A **distribution** describes how likely each value is. `rng.normal(mean, sd, size)` gives the bell curve (heights, measurement errors); `rng.binomial(n, p)` counts successes, such as how many of 1,000 visitors buy something; `rng.uniform` makes every value equally likely.


### Sampling and the law of large numbers

We rarely see a whole population, only a **sample**. A sample mean wobbles around the true value, and the wobble shrinks as the sample grows (roughly with the square root of its size). That's why 10 users prove nothing and 10,000 users can.

```python
rng = np.random.default_rng(1)
for n in (10, 1_000, 100_000):
    flips = rng.integers(0, 2, size=n)
    print(n, flips.mean().round(3))
```

Output:

```text
10 0.5
1000 0.489
100000 0.5
```

### Simulation instead of formulas

Many statistics questions can be answered by simulating the situation thousands of times and counting. Question: "if the change did nothing, how often would we see a difference this big just by luck?" That fraction is the **p-value**. A small p-value (say below 0.05) means luck is an unlikely explanation. It does **not** tell you how big or important the effect is.


### Confidence intervals by bootstrapping

To see how uncertain an estimate is, **bootstrap**: resample your data with replacement many times, recompute the statistic each time, and look at the middle 95% of the results. That range is a 95% confidence interval. `np.percentile(values, [2.5, 97.5])` finds its ends.


## Exercises

1. Generate 10,000 heights with mean 170 and standard deviation 8. What fraction is above 186?

   _Hint: 186 is two standard deviations above the mean._

<details><summary>Solution</summary>

```python
rng = np.random.default_rng(0)
h = rng.normal(170, 8, 10_000)
print((h > 186).mean())   # about 0.023
```

</details>

2. Simulate rolling two dice 100,000 times. How often is the total 7?

<details><summary>Solution</summary>

```python
rng = np.random.default_rng(0)
totals = rng.integers(1, 7, 100_000) + rng.integers(1, 7, 100_000)
print((totals == 7).mean())   # about 1/6
```

</details>

3. Bootstrap a 95% confidence interval for the median of `[12, 15, 9, 22, 17, 14, 30, 11]`.

<details><summary>Solution</summary>

```python
data = np.array([12, 15, 9, 22, 17, 14, 30, 11])
rng = np.random.default_rng(0)
medians = [np.median(rng.choice(data, len(data))) for _ in range(5000)]
print(np.percentile(medians, [2.5, 97.5]))
```

</details>

## Project: A/B test simulator

An online shop shows half its visitors a new checkout page (B) and half the old one (A). Simulate the experiment, then decide whether B is really better: a permutation test for the p-value, a bootstrap confidence interval for the lift, and a power simulation that shows how many visitors you need before trusting the result.

Files in this folder: `day82_ab_test.py`.

### Key lines explained

- `a = rng.random(visitors) < rate_a`: Each visitor gets a random number between 0 and 1; those below the true rate "buy". The comparison makes a True/False array that we convert to 1/0.
- `rng.shuffle(pooled)`: The heart of the permutation test. If the page made no difference, the A and B labels are meaningless, so shuffling them shows what pure luck looks like.
- `rng.choice(a, len(a))`: Resampling with replacement: a new dataset of the same size where some visitors appear twice and some not at all. Repeating this shows how much the estimate could vary.
- `np.percentile(lifts, [2.5, 97.5])`: The middle 95% of the bootstrapped lifts is the confidence interval.
- `if (pb - pa) / se > 1.645`: A quick z-test inside the power simulation, where speed matters. 1.645 is the cut-off for a one-sided test at the 5% level.
- `report("A/A test ...")`: A sanity check used in real companies: with two identical pages, the test should usually say "not enough evidence".

### Stretch goals

- Change `TRUE_B` to 0.044 (a 10% lift). How many visitors do you now need for 80% power?
- Run the A/A test 100 times and count how often it wrongly says B is better. It should be about 5%.
- Plot a histogram of the bootstrapped lifts with Matplotlib.

## Test it

- [ ] Run it twice: the seed means you get identical numbers.
- [ ] The small test will probably say "not enough evidence" even though B really is better. Explain why.
- [ ] Check that power rises as the number of visitors grows.
- [ ] Change the seed and see how the small test's verdict changes.
