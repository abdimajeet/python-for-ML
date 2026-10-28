# day91_digits_pca.py
# PCA on handwritten digits: visualise, measure, reconstruct, and compress.

import matplotlib.pyplot as plt
import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.manifold import TSNE
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

digits = load_digits()
X, y = digits.data, digits.target
print(f"{X.shape[0]} images of {X.shape[1]} pixels each (8x8, values 0-16)")

# 1. How much variance does each component keep?
pca_full = PCA().fit(X)
cumulative = np.cumsum(pca_full.explained_variance_ratio_)
for target in (0.5, 0.8, 0.9, 0.95, 0.99):
    print(f"  {np.argmax(cumulative >= target) + 1:>2} components keep {target:.0%} of the variance")

# 2. Plot in 2-D: PCA vs t-SNE
pca_2d = PCA(n_components=2).fit_transform(X)
tsne_2d = TSNE(n_components=2, init="pca", random_state=91).fit_transform(X)
fig, axes = plt.subplots(1, 2, figsize=(13, 6))
for ax, points, title in ((axes[0], pca_2d, f"PCA (keeps {cumulative[1]:.0%} of variance)"),
                          (axes[1], tsne_2d, "t-SNE")):
    scatter = ax.scatter(points[:, 0], points[:, 1], c=y, cmap="tab10", s=8, alpha=0.7)
    for digit in range(10):
        cx, cy = np.median(points[y == digit], axis=0)
        ax.text(cx, cy, str(digit), fontsize=16, weight="bold", ha="center", va="center",
                bbox={"boxstyle": "circle", "fc": "white", "alpha": 0.8})
    ax.set_title(title)
    ax.set_xticks([])
    ax.set_yticks([])
fig.suptitle("1,797 handwritten digits squeezed from 64 dimensions to 2")
fig.tight_layout()
fig.savefig("digits_2d.png", dpi=110)
print("\nSaved digits_2d.png")

# Which digits overlap most in the PCA plot? Compare distances between digit centres.
centres = np.array([pca_2d[y == d].mean(axis=0) for d in range(10)])
pairs = [(np.linalg.norm(centres[a] - centres[b]), a, b) for a in range(10) for b in range(a + 1, 10)]
print("Closest digit pairs in the PCA plot:", ", ".join(f"{a}&{b}" for _, a, b in sorted(pairs)[:3]))

# 3. Reconstruct digits from a few components
fig, axes = plt.subplots(4, 6, figsize=(8, 5.6))
examples = X[:6]
for row, k in enumerate((2, 10, 30, 64)):
    pca_k = PCA(n_components=k).fit(X)
    rebuilt = pca_k.inverse_transform(pca_k.transform(examples))
    for col in range(6):
        axes[row, col].imshow(rebuilt[col].reshape(8, 8), cmap="gray_r")
        axes[row, col].axis("off")
    axes[row, 0].set_title(f"{k} components", fontsize=9, loc="left")
fig.tight_layout()
fig.savefig("digits_reconstructed.png", dpi=110)
print("Saved digits_reconstructed.png")

# 4. Does compression hurt a classifier?
print("\n5-fold accuracy of logistic regression:")
for k in (5, 10, 20, 40, None):
    steps = [StandardScaler()] + ([PCA(n_components=k)] if k else []) + [LogisticRegression(max_iter=5000)]
    score = cross_val_score(make_pipeline(*steps), X, y, cv=5).mean()
    label = f"{k} components" if k else "all 64 pixels"
    print(f"  {label:<15} {score:.3f}")
