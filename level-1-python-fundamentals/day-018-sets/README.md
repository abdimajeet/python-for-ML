# Day 18: Sets

**Level 1, Python Fundamentals.** Project: **Text comparer**

Sets hold unique items and make comparisons between groups easy. Today you compare the vocabulary of two texts.

## Lesson

### Creating sets

Write a set with curly braces, or convert something with `set()`. Duplicates disappear automatically, and the order is not guaranteed. An empty set must be `set()`, because `{}` is an empty dict.

```python
nums = {3, 1, 3, 2, 1}
print(nums)                    # {1, 2, 3}
letters = set("hello")
print(letters)                 # {'h', 'e', 'l', 'o'} in some order
empty = set()
```

### Adding, removing and membership

`add(x)` adds, `discard(x)` removes without an error if it's missing. `x in s` is as fast as dict lookup, much faster than a list.


### Set operations

`a | b` union (in either), `a & b` intersection (in both), `a - b` difference (in a but not b), `a ^ b` symmetric difference (in exactly one).

```python
python_class = {"Amina", "Omar", "Sara"}
ml_class = {"Omar", "Sara", "Yusuf"}
print(python_class & ml_class)   # in both
print(python_class | ml_class)   # everyone
print(python_class - ml_class)   # only Python
print(python_class ^ ml_class)   # only one class
```

### Removing duplicates from a list

`list(set(items))` removes duplicates but loses the order. `sorted(set(items))` gives the unique items in sorted order.


## Exercises

1. Given `[3, 7, 3, 9, 7, 1]`, print the unique values sorted.

<details><summary>Solution</summary>

```python
print(sorted(set([3, 7, 3, 9, 7, 1])))   # [1, 3, 7, 9]
```

</details>

2. Check whether two words use exactly the same letters, ignoring repeats.

<details><summary>Solution</summary>

```python
a = input("Word 1: ").lower()
b = input("Word 2: ").lower()
print(set(a) == set(b))
```

</details>

3. Print the letters that two names have in common.

<details><summary>Solution</summary>

```python
print(set("amina") & set("yasmin"))
```

</details>

## Project: Text comparer

Ask for two pieces of text, clean them into sets of lowercase words, then report the shared words, the words unique to each, and a similarity score.

Files in this folder: `day18_text_compare.py`.

Sample output:

```text
First text:  I love learning Python!
Second text: Python is fun and I love it.

Shared words (3): i, love, python
Only in first (1): learning
Only in second (4): and, fun, is, it
Similarity: 38%
```

### Key lines explained

- `word.strip(PUNCTUATION)`: `strip` with an argument removes any of those characters from both ends, so "python!" becomes "python".
- `words_a.discard("")`: A word made only of punctuation, like "--", strips down to an empty string; this removes it.
- `len(shared) / len(everything)`: This is the **Jaccard similarity**, a measure used in real text analysis and ML. It's 1.0 for identical vocabularies and 0 when nothing is shared.
- `if everything:`: Guards against dividing by zero when both texts are empty.

### Stretch goals

- Ignore common words like "the", "a" and "and" by keeping them in a set and subtracting it.
- Compare two paragraphs from different news articles.

## Test it

- [ ] Two identical texts should be 100%.
- [ ] Two texts with no common words should be 0%.
- [ ] Check that "Python" and "python!" count as the same word.
