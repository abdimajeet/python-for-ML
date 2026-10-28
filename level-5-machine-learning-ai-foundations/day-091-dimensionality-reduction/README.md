# Day 91: Dimensionality reduction

**Level 5, Machine Learning & AI Foundations.** Project: **Handwritten digits in 2-D**

A tiny 8×8 image of a digit is already 64 numbers, and real data can have thousands of columns. You can't plot 64 dimensions, but **dimensionality reduction** can squeeze them into 2 while keeping most of the structure. Today's tool is PCA.

## Lesson

### The curse of many dimensions

More columns aren't always better. Many features are redundant (neighbouring pixels are almost the same), they slow models down, and in high dimensions everything ends up far from everything else, which hurts distance-based models. Reducing dimensions can make data easier to see, faster to model, and sometimes more accurate.


### What PCA does

**Principal Component Analysis** finds the directions along which the data varies most. The first principal component is the single direction with the most spread; the second is the next most, at right angles to the first, and so on. Projecting onto the first few components keeps as much variation as possible in fewer numbers. PCA needs centred data and usually scaled data.

```python
import numpy as np
from sklearn.decomposition import PCA

rng = np.random.default_rng(0)
x = rng.normal(size=500)
data = np.column_stack([x, 2 * x + rng.normal(scale=0.3, size=500)])   # two related columns
pca = PCA().fit(data)
print(pca.explained_variance_ratio_.round(3))
```

Output:

```text
[0.997 0.003]
```

### Explained variance

`explained_variance_ratio_` tells you what share of the total variation each component keeps. Above, one component keeps 99.7% because the two columns are almost the same information. `np.cumsum` of the ratios shows how many components you need for, say, 95%. Or pass `PCA(n_components=0.95)` and let it choose.


### Going back: reconstruction

`pca.inverse_transform(reduced)` maps the compressed numbers back to the original space. With few components you get a blurry version of the input; with more, it sharpens. The difference shows what information was thrown away, and this is the idea behind compression.


### PCA in a pipeline

Because PCA is a transformer, it slots into a pipeline before a model: `make_pipeline(StandardScaler(), PCA(n_components=30), LogisticRegression())`. For visualising clusters there's also **t-SNE** (`sklearn.manifold.TSNE`), which often separates groups more clearly but is slower, can't transform new data, and its distances shouldn't be read literally.


## Exercises

1. Load `load_digits()`. How many images are there, and how many features does each have?

<details><summary>Solution</summary>

```python
from sklearn.datasets import load_digits
digits = load_digits()
print(digits.data.shape)   # (1797, 64)
```

</details>

2. How many principal components do you need to keep 90% of the digits' variance?

<details><summary>Solution</summary>

```python
pca = PCA().fit(digits.data)
print(np.argmax(np.cumsum(pca.explained_variance_ratio_) >= 0.90) + 1)
```

</details>

3. Reduce the digits to 2 components and print the shape of the result.

<details><summary>Solution</summary>

```python
two_d = PCA(n_components=2).fit_transform(digits.data)
print(two_d.shape)   # (1797, 2)
```

</details>

## Project: Handwritten digits in 2-D

Squeeze 1,797 handwritten digits from 64 dimensions down to 2 and plot them, so you can see which digits the data naturally separates and which it confuses. Measure how much variance each component keeps, rebuild digits from a few components to see what's lost, and test whether PCA can shrink the data without hurting a classifier.

Files in this folder: `day91_digits_pca.py`.

### Key lines explained

- `np.argmax(cumulative >= target) + 1`: `argmax` on a True/False array returns the first True. Adding 1 converts a position to a count.
- `TSNE(n_components=2, init="pca", random_state=91)`: t-SNE arranges points so that neighbours stay neighbours. It usually separates the digits better than PCA, but it can only describe this dataset, not transform new images.
- `np.median(points[y == digit], axis=0)`: The middle of each digit's cloud, where we print a big label so the plot is readable.
- `pca_k.inverse_transform(pca_k.transform(examples))`: Compress to k numbers and back to 64 pixels. The blur shows what k components can't capture.
- `steps = [StandardScaler()] + ([PCA(n_components=k)] if k else []) + [...]`: Builds the pipeline with or without PCA, so the comparison is fair: same scaler, same model, only the compression changes.

### Stretch goals

- Colour the PCA plot by a single digit (say 8) against all others to see where it hides.
- Try PCA on the Day 90 customers and plot the segments in 2-D.
- Time the 20-component pipeline against the full one. How much faster is it?

## Test it

- [ ] About 21 components should keep 90% of the variance.
- [ ] In `digits_2d.png`, 0, 6 and 4 should form clear groups in PCA, while t-SNE separates nearly all ten.
- [ ] In `digits_reconstructed.png`, the 2-component row should be blurry and the 64-component row exact.
- [ ] With about 20 to 40 components, accuracy should be close to using all pixels.
