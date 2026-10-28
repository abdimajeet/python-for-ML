# Day 9: while loops

**Level 1, Python Fundamentals.** Project: **Number-guessing game**

Loops repeat code. Today you learn `while`, which repeats as long as a condition is True, and you use the `random` module for the first time.

## Lesson

### while

A `while` loop checks its condition, runs its block, then checks again. Something inside the loop must eventually make the condition False, or it runs forever.

```python
count = 1
while count <= 3:
    print("Count:", count)
    count += 1
print("Done")
```

Output:

```text
Count: 1
Count: 2
Count: 3
Done
```

### Infinite loops and Ctrl+C

If you forget `count += 1`, the loop never ends. Press **Ctrl+C** in the terminal to stop a running program. Every programmer does this regularly.


### break and continue

`break` leaves the loop immediately. `continue` skips the rest of this round and goes back to the condition. `while True:` with a `break` inside is a common pattern for "keep asking until the user gets it right".

```python
while True:
    answer = input("Type yes to stop: ")
    if answer == "yes":
        break
    print("Still going...")
print("Stopped")
```

### Importing random

Python ships with a **standard library** of modules. `import random` loads one, and then `random.randint(1, 10)` gives a random int from 1 to 10, **including both ends**. The dot means "the `randint` inside `random`".

```python
import random
print(random.randint(1, 6))   # like rolling a die
```

## Exercises

1. Print the numbers 10 down to 1, then "Liftoff!", using a while loop.

<details><summary>Solution</summary>

```python
n = 10
while n >= 1:
    print(n)
    n -= 1
print("Liftoff!")
```

</details>

2. Keep asking for numbers and adding them up until the user enters 0. Then print the total.

<details><summary>Solution</summary>

```python
total = 0
while True:
    n = float(input("Number (0 to stop): "))
    if n == 0:
        break
    total += n
print("Total:", total)
```

</details>

3. Roll a die (1 to 6) repeatedly until you get a 6. Print each roll and how many rolls it took.

<details><summary>Solution</summary>

```python
import random
rolls = 0
while True:
    roll = random.randint(1, 6)
    rolls += 1
    print("Rolled", roll)
    if roll == 6:
        break
print("Took", rolls, "rolls")
```

</details>

## Project: Number-guessing game

The computer picks a number from 1 to 100. The player guesses until correct, getting "too high" or "too low" hints each time. At the end, show how many guesses it took.

Files in this folder: `day09_guessing_game.py`.

Sample output:

```text
I'm thinking of a number between 1 and 100.
Your guess: 50
Too low.
Your guess: 75
Too high.
Your guess: 62
Correct! It was 62
You got it in 3 attempts.
Excellent strategy!
```

### Key lines explained

- `import random`: Imports go at the top of the file so readers see what the program depends on.
- `while True:`: The loop has no natural end condition; the `break` in the correct-guess branch ends it.
- `attempts += 1`: Counted straight after reading the guess, so every guess is counted, including the correct one.
- `if attempts <= 7:`: With halving (guess 50, then 25 or 75...) you can always win in 7 guesses. That's the binary search you'll study on Day 36.

### Stretch goals

- Limit the player to 10 guesses and reveal the number if they run out.
- Ask "Play again?" at the end and wrap the whole game in another loop.

## Test it

- [ ] To test quickly, temporarily add `print(secret)` after picking it. Remove it before publishing.
- [ ] Guess the right number first time; it should say 1 attempt.
- [ ] Type a word instead of a number and note the error for Day 31.
