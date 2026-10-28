# Day 96: Text and NLP basics

**Level 5, Machine Learning & AI Foundations.** Project: **Movie review sentiment classifier**

Models need numbers, but much of the world's data is text: reviews, emails, messages. Today you'll learn the classic way to turn text into numbers (tokens, bags of words and TF-IDF) and build a sentiment classifier for movie reviews.

## Lesson

### Tokenising

**Tokenising** splits text into units, usually words. The simplest approach lowercases the text and finds runs of letters with a regular expression. Real tokenisers also handle punctuation, contractions and other languages, and large language models split text into sub-word pieces.

```python
import re

def tokenize(text):
    return re.findall(r"[a-z']+", text.lower())

print(tokenize("Not bad at all! I LOVED the ending."))
```

Output:

```text
['not', 'bad', 'at', 'all', 'i', 'loved', 'the', 'ending']
```

### Bag of words

A **bag of words** represents a document by counting how often each vocabulary word appears, ignoring order. Each document becomes a row with one column per word in the vocabulary, mostly zeros. `CountVectorizer` builds the vocabulary and the counts for you.

```python
from sklearn.feature_extraction.text import CountVectorizer

docs = ["great film", "terrible film", "great great acting"]
cv = CountVectorizer()
counts = cv.fit_transform(docs)
print(cv.get_feature_names_out())
print(counts.toarray())
```

Output:

```text
['acting' 'film' 'great' 'terrible']
[[0 1 1 0]
 [0 1 0 1]
 [1 0 2 0]]
```

### TF-IDF

Common words like "the" and "film" appear everywhere and say little. **TF-IDF** (term frequency × inverse document frequency) gives a word more weight the more often it appears in **this** document and the rarer it is **across** documents. `TfidfVectorizer` works like `CountVectorizer`; each row is also scaled to length 1.


### N-grams catch negation

A bag of single words sees "not good" as "not" + "good", which looks positive. Adding **bigrams** (pairs of neighbouring words) with `ngram_range=(1, 2)` gives the model "not good" as a feature of its own. The vocabulary grows quickly, so `min_df=2` (ignore words seen in fewer than 2 documents) keeps it manageable.


### Text pipelines

A vectoriser is a transformer, so it goes in a pipeline: `make_pipeline(TfidfVectorizer(), LogisticRegression())` takes raw strings in `fit` and `predict`. Linear models work well on text because each word gets its own weight, and those weights tell you which words push towards positive or negative.


## Exercises

1. Count the 3 most common words in a paragraph of your choice using `tokenize` and `Counter`.

<details><summary>Solution</summary>

```python
from collections import Counter
text = "the cat sat on the mat and the dog sat on the cat"
print(Counter(tokenize(text)).most_common(3))
```

</details>

2. Use `CountVectorizer(ngram_range=(1, 2))` on `["not good", "very good"]` and print the vocabulary.

<details><summary>Solution</summary>

```python
cv = CountVectorizer(ngram_range=(1, 2)).fit(["not good", "very good"])
print(cv.get_feature_names_out())   # ['good' 'not' 'not good' 'very' 'very good']
```

</details>

3. Use `stop_words="english"` in a `CountVectorizer`. Which words disappear from `"this is the best film of the year"`?

<details><summary>Solution</summary>

```python
cv = CountVectorizer(stop_words="english").fit(["this is the best film of the year"])
print(cv.get_feature_names_out())   # ['best' 'film' 'year']
```

</details>

## Project: Movie review sentiment classifier

Train a classifier that decides whether a movie review is positive or negative. Start with your own tokeniser and word counts to see the data, then compare bag-of-words and TF-IDF pipelines with cross-validation, inspect the words the model relies on, test it on new sentences (including tricky negations), and save it. The project includes a small labelled dataset of 100 reviews in `reviews.csv`; save both files in a `day96_sentiment` folder.

Files in this folder: `reviews.csv`, `day96_sentiment.py`.

### Key lines explained

- `Counter(w for text in ... for w in tokenize(text))`: A generator with two `for` clauses walks every word of every review in one pass, and `Counter` tallies them.
- `(reviews["label"] == "pos").astype(int)`: Turns the text labels into 1 for positive and 0 for negative.
- `TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)`: Single words plus word pairs, weighted by TF-IDF. `sublinear_tf` uses the log of counts so repeating a word ten times doesn't count ten times as much.
- `LogisticRegression(C=10, ...)`: A higher C means weaker regularisation. With only 100 short reviews, the model needs freedom to give individual words strong weights.
- `TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5))`: Uses chunks of 3 to 5 characters instead of whole words, so "bored", "boring" and "boredom" share features. On tiny datasets this often helps, because the model sees each word stem more often.
- `vocab[order[-10:]][::-1]`: `argsort` orders the weights from most negative to most positive, so the last ten are the strongest positive words; `[::-1]` lists them strongest first.
- `model.predict_proba(new_reviews)`: The pipeline takes raw strings; vectorising happens inside it automatically.

### Stretch goals

- Download the 50,000-review IMDB dataset (search for "Large Movie Review Dataset"), load it into the same pipeline and compare accuracy. More data matters more than clever models here.
- Add 10 reviews of your own to `reviews.csv`, especially tricky ones with sarcasm.
- Write `classify.py` that loads the saved model and classifies whatever you type.

## Test it

- [ ] With only 100 reviews, expect roughly 60 to 70% accuracy: better than guessing (50%), but tiny data limits every method. That is the real lesson, and the IMDB stretch (about 90%) shows what more data does.
- [ ] Check the top features make sense. With character chunks you'll see pieces like `' bor'` (from boring and bored) and `'reat'` (from great).
- [ ] Look at the mixed review ("effects were great but ... boring mess"). What does the model say, and what would you say?
- [ ] Explain why "It was not good" is hard for a bag of words.
