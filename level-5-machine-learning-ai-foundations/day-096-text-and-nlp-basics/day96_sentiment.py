# day96_sentiment.py
# Sentiment analysis with bag-of-words and TF-IDF.

import re
from collections import Counter
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline

HERE = Path(__file__).parent
reviews = pd.read_csv(HERE / "reviews.csv")
print(f"{len(reviews)} reviews: {reviews['label'].value_counts().to_dict()}")


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z']+", text.lower())


# 1. Look at the words before modelling
for label in ("pos", "neg"):
    words = Counter(w for text in reviews.loc[reviews.label == label, "text"] for w in tokenize(text))
    common = [w for w, _ in words.most_common(40) if len(w) > 3][:8]
    print(f"  common words in {label} reviews: {', '.join(common)}")

X, y = reviews["text"], (reviews["label"] == "pos").astype(int)

# 2. Compare text representations with cross-validation
candidates = {
    "word counts": CountVectorizer(),
    "word counts + bigrams": CountVectorizer(ngram_range=(1, 2)),
    "tf-idf": TfidfVectorizer(),
    "tf-idf + bigrams": TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True),
    "tf-idf, character 3-5": TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5)),
}
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=96)
print("\n5-fold accuracy:")
results = {}
for name, vectorizer in candidates.items():
    pipe = make_pipeline(vectorizer, LogisticRegression(C=10, max_iter=1000))
    scores = cross_val_score(pipe, X, y, cv=cv)
    results[name] = scores.mean()
    print(f"  {name:<22} {scores.mean():.3f} ± {scores.std():.3f}")

# 3. Train the best representation on all the data and look inside
best = max(results, key=results.get)
model = make_pipeline(candidates[best], LogisticRegression(C=10, max_iter=1000))
model.fit(X, y)
vocab = model[0].get_feature_names_out()
weights = model[-1].coef_[0]
order = np.argsort(weights)
print(f"\nBest: {best}, with {len(vocab):,} features")
print("Most positive:", ", ".join(repr(v) for v in vocab[order[-10:]][::-1]))
print("Most negative:", ", ".join(repr(v) for v in vocab[order[:10]]))

# 4. Try it on new reviews
new_reviews = [
    "What a wonderful, moving film. The cast is brilliant.",
    "Dull story and terrible acting. I was so bored.",
    "Not bad at all, actually really enjoyable.",
    "It was not good.",
    "The effects were great but the plot was a boring mess.",
]
print("\nNew reviews:")
for text, p in zip(new_reviews, model.predict_proba(new_reviews)[:, 1]):
    verdict = "positive" if p >= 0.5 else "negative"
    print(f"  {p:4.0%} {verdict:<8}  {text}")

joblib.dump(model, HERE / "sentiment_model.joblib")
print("\nSaved sentiment_model.joblib")
