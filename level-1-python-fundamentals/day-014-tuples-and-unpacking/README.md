# Day 14: Tuples and unpacking

**Level 1, Python Fundamentals.** Project: **Rock, paper, scissors**

Tuples are like lists that can't change. Today you learn when to use them and how unpacking makes code cleaner.

## Lesson

### Tuples

Write a tuple with parentheses. Index and slice it like a list, but you can't append, remove or change items: it's **immutable**. A one-item tuple needs a trailing comma: `(5,)`.

```python
point = (3, 4)
print(point[0])
colours = ("red", "green", "blue")
# colours[0] = "pink"  -> TypeError
```

### When to use which

Use a **list** for a collection of similar things that grows or shrinks, like tasks. Use a **tuple** for a fixed group where each position has a meaning, like (x, y) or (name, price), or for values that must not change by accident.


### Unpacking

You can assign a tuple's items to several names in one line. The number of names must match. This makes swapping two variables a one-liner.

```python
x, y = (3, 4)
name, price = ("Tea", 1.5)
a, b = 1, 2
a, b = b, a      # swap
print(a, b)
```

Output:

```text
2 1
```

### Unpacking in loops, and random.choice

Looping over a list of tuples lets you unpack each one in the `for` line. `random.choice(seq)` picks a random item from a list or tuple.

```python
import random
items = [("Tea", 1.5), ("Cake", 3.0)]
for name, price in items:
    print(name, "costs", price)
print(random.choice(("heads", "tails")))
```

## Exercises

1. Store your date of birth as a tuple (day, month, year) and unpack it into three variables.

<details><summary>Solution</summary>

```python
dob = (14, 3, 2001)
day, month, year = dob
print(day, month, year)
```

</details>

2. Swap two variables without a temporary variable.

<details><summary>Solution</summary>

```python
a = "left"
b = "right"
a, b = b, a
```

</details>

3. Simulate 10 coin flips with `random.choice` and count the heads.

<details><summary>Solution</summary>

```python
import random
heads = 0
for i in range(10):
    if random.choice(("heads", "tails")) == "heads":
        heads += 1
print("Heads:", heads)
```

</details>

## Project: Rock, paper, scissors

Play best-of-five against the computer. The valid moves and the winning pairs are stored as tuples, which makes the rules data rather than a long chain of `if` statements.

Files in this folder: `day14_rps.py`.

### Key lines explained

- `MOVES = (...)`: A tuple because the moves never change. Capital letters mark it as a constant.
- `WINS = (("rock", "scissors"), ...)`: A tuple of tuples. Each inner pair means "the first beats the second".
- `(player, computer) in WINS`: Builds a pair from this round's moves and checks whether it appears in WINS. One line replaces six `if` checks.
- `continue`: Skips the rest of the round for invalid input and goes back to the loop condition, without changing scores.
- `.lower()`: A string method (more on Day 15) so "Rock" and "ROCK" also work.

### Stretch goals

- Add lizard and Spock. You only need to change the two tuples, not the logic.
- Let the player choose how many wins the match needs.

## Test it

- [ ] Type "Rock" with a capital letter.
- [ ] Type an invalid move; the score shouldn't change.
- [ ] Play a full match and check the final message matches the score.
