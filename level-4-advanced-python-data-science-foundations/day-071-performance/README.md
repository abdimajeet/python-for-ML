# Day 71: Performance

**Level 4, Advanced Python & Data Science Foundations.** Project: **Profile and speed up a slow script**

Before optimising, measure. Today you learn to time code with `timeit`, find bottlenecks with `cProfile`, and apply the optimisations that matter most in Python.

## Lesson

### Rules of optimisation

1) Make it work and test it first. 2) Measure to find where the time actually goes; it's rarely where you'd guess. 3) Optimise only the slow part, and keep the tests passing. A 10× improvement in a function that takes 1% of the time saves almost nothing.


### timeit for small snippets

`timeit` runs code many times and reports the time, avoiding one-off noise. In Jupyter, `%timeit expr` does the same.

```python
import timeit

data = list(range(10_000))
as_set = set(data)
print(timeit.timeit(lambda: 9_999 in data, number=1000))
print(timeit.timeit(lambda: 9_999 in as_set, number=1000))
```

### cProfile for whole programs

`python -m cProfile -s cumulative my_script.py` lists every function with how many times it was called and how long it took. Look at `cumtime` (time including everything it called) to find the expensive branch, then `tottime` to find the function doing the work itself.

```python
import cProfile
import pstats

cProfile.run("main()", "profile.out")
pstats.Stats("profile.out").sort_stats("cumulative").print_stats(10)
```

### The optimisations that matter

**Choose the right data structure**: set/dict lookups are O(1), list searches O(n). **Don't repeat work**: move calculations out of loops, cache results. **Use built-ins and comprehensions**: `sum`, `sorted`, `"".join` run in C. **Avoid building strings with += in loops**. **Vectorise** numeric work with NumPy (Day 74). Only after all that consider parallelism.


## Exercises

1. Use `timeit` to compare building a string of 10,000 numbers with `+=` versus `"".join`.

<details><summary>Solution</summary>

```python
import timeit

def concat():
    s = ""
    for i in range(10_000):
        s += str(i)
    return s

def joined():
    return "".join(str(i) for i in range(10_000))

print(timeit.timeit(concat, number=100))
print(timeit.timeit(joined, number=100))
```

</details>

2. Profile your Day 36 algorithms script with cProfile. Which function has the highest tottime?

<details><summary>Solution</summary>

```python
# python -m cProfile -s tottime day36_algorithms.py
# bubble_sort and selection_sort dominate: they're O(n²).
```

</details>

## Project: Profile and speed up a slow script

A deliberately slow "customer report" script finds repeat customers, matches orders to products and builds a text report. Profile it, find the bottlenecks, and write a fast version. Both versions must produce identical output, which a check at the end confirms.

Files in this folder: `day71_optimise.py`.

### Key lines explained

- `find_product_slow ... for p in PRODUCTS`: Called 20,000 times, each scanning up to 2,000 products: about 20 million comparisons. The profile shows it at the top.
- `price_of = {p["id"]: p["price"] for p in PRODUCTS}`: Built once, then every lookup is instant. This single change gives most of the speed-up.
- `if o["customer"] in seen:  (a list)`: List membership checks every element. Counting with a dict replaces two O(n) lists.
- `"".join(...)`: Builds the final string in one step instead of copying it again on every `+=`.
- `assert slow == fast`: Optimisation must never change results. Always compare against the slow, trusted version.

### Stretch goals

- Profile your Day 40 finance app's report with a few thousand fake transactions.
- Try `collections.Counter` and `defaultdict` in the fast version. Is it faster or just shorter?

## Test it

- [ ] The assert must pass: identical output.
- [ ] Read the profile: which function has the most calls? Which the most tottime?
- [ ] Double the number of orders: how does each version's time change? (Linear versus much worse.)
