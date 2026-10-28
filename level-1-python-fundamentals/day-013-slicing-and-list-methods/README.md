# Day 13: Slicing and list methods

**Level 1, Python Fundamentals.** Project: **Grade-book statistics**

Today you take parts of lists with slicing, sort them, and use built-in functions to summarise numbers.

## Lesson

### Slicing

`lst[start:stop]` gives a new list from `start` up to but not including `stop`. Leave a side blank to mean "from the beginning" or "to the end". A third number is the step. Slicing works on strings too.

```python
nums = [10, 20, 30, 40, 50]
print(nums[1:3])    # [20, 30]
print(nums[:2])     # [10, 20]
print(nums[-2:])    # [40, 50]
print(nums[::2])    # [10, 30, 50]
print(nums[::-1])   # reversed copy
print("Python"[0:3])  # Pyt
```

### sort() versus sorted()

`lst.sort()` sorts the list **in place** and returns `None`. `sorted(lst)` returns a **new** sorted list and leaves the original alone. Add `reverse=True` for descending order. A classic bug is `lst = lst.sort()`, which sets the list to `None`.

```python
marks = [72, 95, 58]
ranked = sorted(marks, reverse=True)
print(marks, ranked)
marks.sort()
print(marks)
```

Output:

```text
[72, 95, 58] [95, 72, 58]
[58, 72, 95]
```

### Summary functions

`min()`, `max()`, `sum()` and `len()` work on any list of numbers. The average is `sum(lst) / len(lst)`. `lst.count(x)` counts how often a value appears and `lst.index(x)` finds its position.


## Exercises

1. Given `days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]`, slice out the weekdays and the weekend.

<details><summary>Solution</summary>

```python
weekdays = days[:5]
weekend = days[5:]
```

</details>

2. Check if a word is a palindrome (same backwards) using slicing.

<details><summary>Solution</summary>

```python
word = input("Word: ").lower()
print(word == word[::-1])
```

</details>

3. Given `temps = [22, 25, 19, 30, 28]`, print the hottest, coldest and average.

<details><summary>Solution</summary>

```python
temps = [22, 25, 19, 30, 28]
print(max(temps), min(temps), sum(temps) / len(temps))
```

</details>

## Project: Grade-book statistics

Let a teacher enter scores until they type `done`, then print the count, highest, lowest, average, the top three, and how many passed.

Files in this folder: `day13_gradebook.py`.

Sample output:

```text
Score: 67
Score: 88
Score: 45
Score: done

Students: 3
Highest:  88.0
Lowest:   45.0
Average:  66.7
Top 3:    [88.0, 67.0, 45.0]
Passed:   2 of 3
```

### Key lines explained

- `if entry == "done": break`: We check for the word before converting, because `float("done")` would crash.
- `if not scores:`: Without this guard, `sum(scores) / len(scores)` would divide by zero when nothing was entered.
- `ranked[:3]`: A slice of the first three. If there are fewer than three scores, slicing simply returns what exists, with no error.
- `sorted(scores, reverse=True)`: A new list, so `scores` keeps the original entry order.

### Stretch goals

- Print the median: the middle value of the sorted list.
- Reject scores outside 0 to 100.

## Test it

- [ ] Type `done` immediately.
- [ ] Enter a single score.
- [ ] Enter two scores; the top 3 shows just two.
- [ ] Check the average by hand for one run.
