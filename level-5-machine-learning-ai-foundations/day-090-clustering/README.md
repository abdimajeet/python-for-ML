# Day 90: Clustering

**Level 5, Machine Learning & AI Foundations.** Project: **Customer segmentation**

So far every dataset came with answers to learn from. In **unsupervised learning** there are no labels; the model looks for structure on its own. Clustering groups similar items together, and businesses use it to find customer segments.

## Lesson

### Supervised vs unsupervised

Supervised learning has an `X` and a `y`: inputs and correct answers. Unsupervised learning only has `X`. Clustering asks "which examples belong together?" There's no single right answer, so you judge results by whether they're useful and make sense.


### k-means in four steps

1) Choose `k`, the number of clusters, and place k centres at random. 2) Assign each point to its nearest centre. 3) Move each centre to the mean of its points. 4) Repeat steps 2 and 3 until nothing changes. `KMeans(n_clusters=4, n_init=10)` runs it 10 times from different starts and keeps the best.

```python
import numpy as np
from sklearn.cluster import KMeans

points = np.array([[1, 1], [1.5, 2], [1, 1.5], [8, 8], [9, 8.5], [8.5, 9]])
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(points)
print(km.labels_, km.cluster_centers_.round(2).tolist())
```

Output:

```text
[1 1 1 0 0 0] [[8.5, 8.5], [1.17, 1.5]]
```

### Scaling matters even more

k-means uses distance, so a feature measured in thousands (yearly spend) would swamp one measured in single digits (visits per month). Always standardise first. Skewed features like money often work better after a log transform.


### Choosing k

**Inertia** (the total squared distance from points to their centres) always falls as k grows, so look for the **elbow** where it stops falling steeply. The **silhouette score** (-1 to 1) measures how much closer points are to their own cluster than to the next one; higher is better. Then check that the clusters make business sense.


### Describing clusters

A cluster number means nothing to a marketing team. Profile each one with `df.groupby("cluster").mean()`, compare it with the overall average, and give it a name like "loyal big spenders" or "lapsed customers".


## Exercises

1. In the example above, add the point `[5, 5]`. Which cluster does `km.predict` put it in?

<details><summary>Solution</summary>

```python
print(km.predict([[5, 5]]))
```

</details>

2. Compute the silhouette score of the two-cluster example.

<details><summary>Solution</summary>

```python
from sklearn.metrics import silhouette_score
print(silhouette_score(points, km.labels_))   # close to 1: very clear clusters
```

</details>

3. Why might you apply `np.log1p` to a spending column before clustering?

<details><summary>Solution</summary>

```python
# Spending is usually skewed: a few customers spend 100x the rest.
# The log compresses those extremes so they don't form their own clusters or dominate distances.
```

</details>

## Project: Customer segmentation

A shop has 2,000 customers described by yearly spend, visits, basket size, days since their last visit and how many product categories they buy. Find natural segments with k-means: prepare the features, choose k with the elbow and silhouette, profile and name each segment, chart them, and save the labelled customers to CSV for the marketing team.

Files in this folder: `day90_segmentation.py`.

### Key lines explained

- `"true_type": name`: We hide the real customer types in the data so we can check afterwards whether clustering found them. With real customers you won't have this luxury.
- `X[col] = np.log1p(X[col])`: Money and day counts are skewed; the log keeps a few extreme customers from dominating the distances.
- `silhouette_score(X, km.labels_, sample_size=1500, ...)`: Silhouette compares every pair of points, which is slow for big data. Sampling 1,500 points gives a good estimate quickly.
- `name_segment(profile, overall)`: Turns numbers into names by comparing each cluster with the average customer. In a real project you'd agree these rules with the business.
- `pd.crosstab(df["true_type"], df["segment"])`: A table of hidden type against found segment. A clean diagonal means the clusters match reality.

### Stretch goals

- Run k-means with k = 6 and describe the extra segments. Are they useful or just splitting hairs?
- Suggest one marketing action for each segment and add it to the CSV.
- Try `AgglomerativeClustering` and compare the crosstab.

## Test it

- [ ] The silhouette score should peak at k = 4.
- [ ] Each hidden type should land almost entirely in one segment.
- [ ] "Lapsed" customers should have the highest days since last visit.
- [ ] Open `customer_segments.csv` and check every row has a segment.
