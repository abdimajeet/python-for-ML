# Day 37: Lambdas and sorting

**Level 2, Core Python Programming.** Project: **Game leaderboard ranker**

Sorting real data means sorting by a field: by score, by date, by name. Today you learn `key=` functions and `lambda`.

## Lesson

### Functions are values

In Python you can pass a function to another function, like you passed `int` to `map` on Day 25. `sorted`, `min`, `max` and `list.sort` accept a `key` function: they call it on each item and sort by its result.

```python
words = ["banana", "Fig", "apple"]
print(sorted(words))              # capitals first
print(sorted(words, key=str.lower))
print(sorted(words, key=len))
```

Output:

```text
['Fig', 'apple', 'banana']
['apple', 'banana', 'Fig']
['Fig', 'apple', 'banana']
```

### lambda

`lambda x: expression` creates a small function without a name. It's handy for one-off keys. `lambda p: p["score"]` is the same as a `def` that returns `p["score"]`.

```python
players = [{"name": "Amina", "score": 88}, {"name": "Omar", "score": 95}]
best = max(players, key=lambda p: p["score"])
print(best["name"])
```

Output:

```text
Omar
```

### Sorting by several fields

Return a tuple from the key. Tuples compare item by item, so ties on the first field are broken by the second. To sort one numeric field descending and another ascending, negate the number.

```python
# highest score first, then fastest time
ranked = sorted(results, key=lambda r: (-r["score"], r["time"]))
```

### When not to use lambda

If the logic needs more than one simple expression, or you use it more than once, write a normal named `def`. Don't assign a lambda to a name (`f = lambda x: ...`); that's what `def` is for.


## Exercises

1. Sort `[("Amina", 24), ("Omar", 31), ("Sara", 19)]` by age, youngest first.

<details><summary>Solution</summary>

```python
people = [("Amina", 24), ("Omar", 31), ("Sara", 19)]
print(sorted(people, key=lambda p: p[1]))
```

</details>

2. Find the longest word in a sentence with `max` and a key.

<details><summary>Solution</summary>

```python
print(max(sentence.split(), key=len))
```

</details>

3. Sort a dict of word counts by count, highest first, and print the top 3.

<details><summary>Solution</summary>

```python
counts = {"python": 5, "data": 3, "ml": 7, "ai": 2}
for word, n in sorted(counts.items(), key=lambda kv: kv[1], reverse=True)[:3]:
    print(word, n)
```

</details>

## Project: Game leaderboard ranker

Rank game results by score (highest first), breaking ties by fastest time, then by name. Show proper ranks where tied players share a position, and let the user re-sort the table by any column.

Files in this folder: `day37_leaderboard.py`.

Sample output:

```text
  #  Name      Score   Time  Level
  1  Hodan      1050   340s      9
  1  Omar       1050   340s      8
  3  Sara        920   298s      7
  4  Amina       920   312s      7
  5  Yusuf       780   250s      6
  6  Bilal       640   410s      5
```

### Key lines explained

- `return (-r["score"], r["time"], r["name"])`: A tuple key. The minus sign makes higher scores sort first while time still sorts lowest first.
- `def rank_key(r):`: The main ranking rule is a named function because it's important and documented. Short one-off keys stay as lambdas.
- `ranked[-1][1]["score"]`: `ranked[-1]` is the previous (rank, result) pair; `[1]` is its result dict. Ties copy the previous rank, giving 1, 1, 3.
- `key=lambda r: r[field]`: The lambda uses the `field` variable chosen by the user, so one line handles every column.

### Stretch goals

- Break remaining ties by level, highest first.
- Load the results from a CSV file using Day 33's code.

## Test it

- [ ] Check that Hodan and Omar share rank 1 and the next rank is 3.
- [ ] Sort by each column.
- [ ] Add a player with the same score as Sara but a slower time.
