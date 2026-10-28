# Day 10: for loops and range()

**Level 1, Python Fundamentals.** Project: **Multiplication table generator**

`for` loops go through a sequence one item at a time. Today you use them with `range()` and with strings.

## Lesson

### for and range()

`range(5)` produces 0, 1, 2, 3, 4: it starts at 0 and **stops before** 5. `range(1, 6)` gives 1 to 5. `range(0, 20, 5)` counts in steps of 5. The loop variable takes each value in turn.

```python
for i in range(1, 4):
    print("Round", i)

for n in range(10, 0, -3):
    print(n)
```

Output:

```text
Round 1
Round 2
Round 3
10
7
4
1
```

### Looping over a string

Python's `for` loops over the **items** of something, not just numbers. A string is a sequence of characters, so you can loop over it directly. This is what "thinking in Python" means: loop over the thing itself, not over index numbers.

```python
for letter in "Python":
    print(letter)
```

### for or while?

Use `for` when you know what you're looping over (a range, a string, a list). Use `while` when you loop until something happens, like a correct guess.


### Nested loops and print(end=)

A loop inside a loop runs the inner loop fully for each outer step. `print(x, end=" ")` ends with a space instead of a new line, so several prints share one line.

```python
for row in range(1, 4):
    for col in range(1, 4):
        print(row * col, end=" ")
    print()   # new line after each row
```

Output:

```text
1 2 3 
2 4 6 
3 6 9 
```

## Exercises

1. Print the sum of all numbers from 1 to 100.

<details><summary>Solution</summary>

```python
total = 0
for n in range(1, 101):
    total += n
print(total)   # 5050
```

</details>

2. Count the vowels in a word the user types.

<details><summary>Solution</summary>

```python
word = input("Word: ")
vowels = 0
for ch in word:
    if ch in "aeiouAEIOU":
        vowels += 1
print("Vowels:", vowels)
```

</details>

3. Print a triangle of stars with 5 rows (1 star, then 2, up to 5).

   _Hint: `"*" * 3` gives `***`._

<details><summary>Solution</summary>

```python
for i in range(1, 6):
    print("*" * i)
```

</details>

## Project: Multiplication table generator

Ask the user for a number and a size, print that number's times table, then print a full grid of tables from 1 up to the size with the columns lined up.

Files in this folder: `day10_times_tables.py`.

Sample output:

```text
The 7 times table:
7 x 1 = 7
7 x 2 = 14
...
Full grid up to 5
   1   2   3   4   5
   2   4   6   8  10
   3   6   9  12  15
   4   8  12  16  20
   5  10  15  20  25
```

### Key lines explained

- `range(1, size + 1)`: We add 1 because `range` stops before its end value. Without it, a size of 10 would stop at 9.
- `line = ""`: Starts each row as an empty string. The inner loop adds one cell at a time.
- `cell.rjust(4)`: A string method that pads the text with spaces on the left until it's 4 characters wide, so the columns line up. You'll learn more string methods on Day 15.

### Stretch goals

- Add a header row and a header column to the grid.
- Only print the even results in the single table.

## Test it

- [ ] Size 1 should print a single row.
- [ ] Size 12: do the columns still line up? What width would work for 3-digit numbers?
- [ ] Change `size + 1` to `size` and see the off-by-one bug.
