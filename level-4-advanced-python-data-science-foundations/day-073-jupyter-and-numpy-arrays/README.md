# Day 73: Jupyter and NumPy arrays

**Level 4, Advanced Python & Data Science Foundations.** Project: **Exam score statistics**

NumPy is the foundation of nearly all data science and ML in Python. Today you set up Jupyter notebooks and learn NumPy arrays: creating them, their shapes, indexing and simple statistics.

## Lesson

### Jupyter notebooks

A notebook mixes code, output, charts and notes in cells you run one at a time, which is ideal for exploring data. Install with `pip install jupyter numpy` in your venv. In VS Code, create a `.ipynb` file, or put `# %%` lines in a normal `.py` file: each section becomes a runnable cell ("Run Cell" appears above it). Today's project uses the `# %%` style.


### Arrays

`np.array` holds many numbers of **one type** in a compact block of memory. Unlike lists, maths applies to every element at once. Key attributes: `shape` (size along each dimension), `ndim`, `dtype` (the element type) and `size`.

```python
import numpy as np

a = np.array([3, 1, 4, 1, 5])
print(a * 2, a.sum(), a.mean())

m = np.array([[1, 2, 3], [4, 5, 6]])
print(m.shape, m.ndim, m.dtype)
```

Output:

```text
[ 6  2  8  2 10] 14 2.8
(2, 3) 2 int64
```

### Creating arrays

`np.zeros((3, 4))`, `np.ones`, `np.arange(0, 10, 2)`, `np.linspace(0, 1, 5)` (evenly spaced). For random data use a generator: `rng = np.random.default_rng(42)`, then `rng.integers`, `rng.normal`, `rng.random`. `reshape` changes the shape without copying data.

```python
rng = np.random.default_rng(42)
scores = rng.integers(40, 100, size=(4, 3))   # 4 students, 3 subjects
print(scores)
print(np.arange(12).reshape(3, 4))
```

### Indexing and slicing in 2-D

`m[row, col]` gets one element. `m[1]` is a whole row, `m[:, 0]` a whole column, `m[:2, 1:]` a block. Slices are **views** that share memory with the original; use `.copy()` for an independent array.


### Axes

Statistics can run over the whole array or along an axis. For a 2-D array, `axis=0` goes down the rows (one result per column) and `axis=1` goes across the columns (one result per row). This idea is everywhere in pandas and ML.

```python
print(scores.mean(axis=0))   # average per subject (column)
print(scores.mean(axis=1))   # average per student (row)
```

## Exercises

1. Create an array of the numbers 1 to 20 and print the even ones, the sum and the standard deviation.

<details><summary>Solution</summary>

```python
a = np.arange(1, 21)
print(a[a % 2 == 0], a.sum(), a.std())
```

</details>

2. Make a 5×5 array of zeros and set its border to 1 with slicing.

<details><summary>Solution</summary>

```python
m = np.zeros((5, 5), dtype=int)
m[0, :] = m[-1, :] = 1
m[:, 0] = m[:, -1] = 1
print(m)
```

</details>

3. Generate 1,000 numbers from a normal distribution with mean 170 and standard deviation 8 (heights). Check the mean and std are close.

<details><summary>Solution</summary>

```python
rng = np.random.default_rng(0)
heights = rng.normal(170, 8, size=1000)
print(heights.mean().round(1), heights.std().round(1))
```

</details>

## Project: Exam score statistics

Analyse exam scores for a class of 30 students across 5 subjects, stored in a 2-D NumPy array. Compute per-student and per-subject statistics, rank students, find each subject's top student, standardise scores to z-scores, and find correlated subjects. Written as notebook cells with `# %%`. Needs `pip install numpy`.

Files in this folder: `day73_exam_stats.py`.

### Key lines explained

- `ability + subject_bias + noise`: **Broadcasting** (tomorrow's topic): a (30, 1) column, a (5,) row and a (30, 5) grid combine into a (30, 5) result.
- `for name, col in zip(subjects, scores.T):`: `.T` transposes the array, so looping gives one subject column at a time.
- `(col >= 50).mean()`: A comparison gives an array of True/False; the mean of booleans is the fraction that are True.
- `np.argsort(averages)[::-1]`: `argsort` returns the positions that would sort the array; reversing gives best first.
- `np.corrcoef(scores.T)`: Pearson correlation between every pair of subjects. Maths and Physics should stand out, because the data was built that way.

### Stretch goals

- Give each subject a weight and compute weighted averages with `np.average(scores, axis=1, weights=...)`.
- Convert the file to a real notebook: in VS Code, right-click and choose "Export current Python file as Jupyter Notebook".

## Test it

- [ ] Run each cell separately in VS Code with "Run Cell".
- [ ] Check one student's average by hand.
- [ ] Change the seed: the statistics change, but Maths–Physics stays the strongest correlation.
