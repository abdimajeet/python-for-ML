# Day 81: Linear algebra with NumPy

**Level 5, Machine Learning & AI Foundations.** Project: **Linear algebra toolkit**

Welcome to Level 5. Machine learning is mostly numbers arranged in vectors and matrices, so we start with the linear algebra you actually need, done in NumPy. No proofs: just what each operation means and why ML uses it.

## Lesson

### Vectors: a list of numbers with a meaning

A **vector** is an ordered list of numbers. In ML, one row of data is a vector: a house might be `[120, 3, 15]` for size, bedrooms and age. Adding vectors adds element by element, and multiplying by a number (a **scalar**) scales every element. NumPy does both without loops.

```python
import numpy as np

a = np.array([2, 1])
b = np.array([1, 3])
print(a + b, 3 * a)
```

Output:

```text
[3 4] [6 3]
```

### The dot product

The dot product multiplies matching elements and adds the results: `a·b = a1*b1 + a2*b2 + ...`. It is the single most important operation in ML. A linear model's prediction is a dot product of the input with its weights: `price = 2000*size + 5000*bedrooms - 300*age`. Write it as `a @ b` or `np.dot(a, b)`.

```python
house = np.array([120, 3, 15])
weights = np.array([2000, 5000, -300])
print(house @ weights)
```

Output:

```text
250500
```

### Length and similarity

The length (or **norm**) of a vector is `np.linalg.norm(v)`, Pythagoras in any number of dimensions. Dividing the dot product by both lengths gives the **cosine similarity**: 1 means pointing the same way, 0 means unrelated, -1 means opposite. Search engines and recommendation systems compare things this way.

```python
def cosine(u, v):
    return u @ v / (np.linalg.norm(u) * np.linalg.norm(v))

print(round(cosine(np.array([1, 2]), np.array([2, 4])), 3),
      round(cosine(np.array([1, 0]), np.array([0, 1])), 3))
```

Output:

```text
1.0 0.0
```

### Matrices and matrix multiplication

A **matrix** is a 2-D grid: a whole dataset is a matrix with one row per example and one column per feature. `X @ w` takes the dot product of **every row** with the weights, so it predicts for all examples at once. For `A @ B` the inner sizes must match: (3×2) @ (2×4) gives (3×4). `A.T` is the transpose (rows become columns).

```python
X = np.array([[120, 3, 15],
              [80, 2, 40],
              [200, 5, 2]])
print(X @ weights)
print(X.shape, X.T.shape)
```

Output:

```text
[250500 158000 424400]
(3, 3) (3, 3)
```

### Solving equations and the identity

`np.linalg.solve(A, b)` finds `x` so that `A @ x == b`. That is exactly what fitting a model means: finding weights that reproduce the answers. The identity matrix `np.eye(n)` is the matrix version of 1, and `np.linalg.inv(A)` is the inverse. In practice, prefer `solve`; it is faster and more accurate than computing an inverse.


## Exercises

1. Compute the dot product of `[1, 2, 3]` and `[4, 5, 6]` by hand, then check with NumPy.

   _Hint: 1*4 + 2*5 + 3*6._

<details><summary>Solution</summary>

```python
import numpy as np
print(np.array([1, 2, 3]) @ np.array([4, 5, 6]))   # 32
```

</details>

2. Make a 2×3 matrix and a 3×2 matrix of your choice. What shape is their product? What happens if you multiply the 2×3 matrix by itself?

<details><summary>Solution</summary>

```python
A = np.arange(6).reshape(2, 3)
B = np.arange(6).reshape(3, 2)
print((A @ B).shape)    # (2, 2)
# A @ A raises ValueError: the inner sizes (3 and 2) don't match
```

</details>

3. Solve: `2x + y = 5` and `x - y = 1`.

<details><summary>Solution</summary>

```python
A = np.array([[2, 1], [1, -1]])
b = np.array([5, 1])
print(np.linalg.solve(A, b))   # [2. 1.]
```

</details>

## Project: Linear algebra toolkit

Build a small toolkit: dot product and matrix multiplication written by hand (then checked against NumPy), cosine similarity used to recommend movies to a user, solving a system of equations, and rotating points with a matrix. Writing the loops once makes the NumPy one-liners mean something.

Files in this folder: `day81_linalg.py`.

### Key lines explained

- `columns = list(zip(*B))`: `zip(*B)` turns rows into columns. Each cell of the result is a row of A dotted with a column of B, which is the definition of matrix multiplication.
- `unit = M / np.linalg.norm(M, axis=1, keepdims=True)`: Divides each row by its own length. `keepdims=True` keeps the result as a column so broadcasting lines up row by row.
- `similarity = unit @ unit.T`: With unit-length rows, the dot product **is** the cosine similarity. One matrix multiplication compares every user with every other user.
- `best = max(unseen, key=lambda i: twin_ratings[i])`: Among films the user hasn't seen, pick the one their most similar user rated highest. This is the core idea of collaborative filtering.
- `np.linalg.solve(A, b)`: Each receipt is one equation, so three receipts give three equations in three unknowns.
- `square @ rotation(90).T`: Points are rows here, so we multiply by the transpose. Every point is rotated in one operation.

### Stretch goals

- Add a rating for yourself and see what the toolkit recommends.
- Time `matmul` against `@` on 200×200 random matrices. How much faster is NumPy?
- Add a `scale(sx, sy)` matrix and combine it with a rotation by multiplying the two matrices.

## Test it

- [ ] Check the dot product of [1, 2, 3] and [4, 5, 6] gives 32 both ways.
- [ ] The diagonal of the similarity table should be all 1.00. Why?
- [ ] Check the cafe prices by putting them back into the three receipts.
- [ ] After a 90-degree rotation, the point (1, 0) should become (0, 1).
