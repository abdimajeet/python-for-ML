# Day 28: Dict and set comprehensions

**Level 2, Core Python Programming.** Project: **Word frequency counter**

The comprehension idea also works for dicts and sets. Today you use them to count and transform data, then build a word-frequency counter.

## Lesson

### Dict comprehensions

`{key_expr: value_expr for item in iterable}` builds a dict. You can filter with `if` just like list comprehensions.

```python
words = ["apple", "fig", "banana"]
lengths = {w: len(w) for w in words}
print(lengths)
```

Output:

```text
{'apple': 5, 'fig': 3, 'banana': 6}
```

### Transforming existing dicts

Loop over `.items()` to build a modified copy, such as filtering or inverting a dict (swapping keys and values).

```python
prices = {"tea": 1.5, "cake": 3.0, "juice": 2.5}
expensive = {k: v for k, v in prices.items() if v > 2}
by_price = {v: k for k, v in prices.items()}
print(expensive)
print(by_price)
```

### Set comprehensions

Curly braces with a single expression make a set, so duplicates disappear.

```python
emails = ["a@x.com", "b@y.org", "c@x.com"]
domains = {e.split("@")[1] for e in emails}
print(domains)
```

Output:

```text
{'x.com', 'y.org'}
```

### Counting with dicts

Counting is one of the most common jobs in data work. The loop pattern from Day 17 is `counts[w] = counts.get(w, 0) + 1`. The standard library also offers `collections.Counter`, which does it for you and has a `most_common(n)` method.

```python
from collections import Counter
c = Counter("mississippi")
print(c.most_common(2))
```

Output:

```text
[('i', 4), ('s', 4)]
```

## Exercises

1. Build a dict mapping the numbers 1 to 5 to their cubes.

<details><summary>Solution</summary>

```python
cubes = {n: n ** 3 for n in range(1, 6)}
```

</details>

2. From `scores = {"Amina": 88, "Omar": 45, "Sara": 72}`, keep only students who passed (50 or more).

<details><summary>Solution</summary>

```python
passed = {name: s for name, s in scores.items() if s >= 50}
```

</details>

3. Get the set of first letters of the words in a sentence, lowercase.

<details><summary>Solution</summary>

```python
firsts = {w[0].lower() for w in sentence.split()}
```

</details>

## Project: Word frequency counter

Read a block of text, clean it into words, count each word, remove common filler words, and show the top words with a simple text bar chart. This kind of counting is the first step of many natural-language-processing pipelines.

Files in this folder: `day28_word_frequency.py`.

### Key lines explained

- `[w.strip(PUNCTUATION).lower() for w in text.split() if w.strip(PUNCTUATION)]`: Cleans each word and drops anything that was only punctuation, such as a lone dash. In NLP this step is called **tokenising**.
- `counts.get(w, 0) + 1`: The hand-written counting pattern. We write it ourselves once so that `Counter` isn't magic.
- `{w: c for w, c in counts.items() if w not in STOP_WORDS}`: A dict comprehension that filters out filler words. Checking `in` a set is fast.
- `Counter(meaningful).most_common(8)`: Turning our dict into a `Counter` gives us `most_common`, which returns (word, count) pairs, largest first.
- `round(count / biggest * width)`: Scales every bar relative to the most common word, so the longest bar is always 30 characters.

### Stretch goals

- Read the text from a file instead, after tomorrow's lesson.
- Count bigrams: pairs of neighbouring words, using `zip(words, words[1:])`.

## Test it

- [ ] Use the sample text: "python" should be top.
- [ ] Paste a paragraph from a news article.
- [ ] Paste text that is only stop words; the chart should be skipped without an error.
