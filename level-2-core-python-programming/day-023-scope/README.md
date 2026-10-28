# Day 23: Scope

**Level 2, Core Python Programming.** Project: **Bank account simulator**

Scope decides where a name can be seen. Understanding it explains many confusing bugs and leads to cleaner functions.

## Lesson

### Local variables

A variable created inside a function is **local**: it exists only while that call runs and can't be seen outside. Each call gets fresh local variables.

```python
def make_total():
    total = 10
    return total

make_total()
print(total)   # NameError: total only existed inside the function
```

### Reading globals, and the LEGB rule

When Python looks up a name, it searches **L**ocal, then **E**nclosing functions, then **G**lobal (the file), then **B**uilt-in names like `print`. So a function _can read_ a global variable.

```python
TAX = 0.16

def with_tax(price):
    return price * (1 + TAX)   # reads the global TAX

print(with_tax(100))
```

### Assigning makes a name local

If a function **assigns** to a name anywhere in its body, that name is local for the whole function. That's why this fails with **UnboundLocalError**: the `count` inside is local, and it's read before it's assigned.

```python
count = 0

def increment():
    count = count + 1   # UnboundLocalError

increment()
```

### global, and why to avoid it

Writing `global count` inside the function fixes the error, but it makes the function depend on hidden state that any code can change. The cleaner pattern is: **pass values in as arguments and return the result**.

```python
def increment(count):
    return count + 1

count = 0
count = increment(count)
print(count)
```

Output:

```text
1
```

### Mutating versus reassigning

If you pass a list into a function and the function **changes** it with `append`, the caller sees the change, because both names point at the same list. Reassigning the parameter with `=` doesn't affect the caller. You'll use this in today's project.

```python
def add_item(items):
    items.append("new")     # changes the shared list

def replace(items):
    items = ["other"]       # only rebinds the local name

stuff = []
add_item(stuff)
replace(stuff)
print(stuff)
```

Output:

```text
['new']
```

## Exercises

1. Predict the output, then run it: `x = 5`, `def f(): x = 10; return x`, then `print(f(), x)`.

<details><summary>Solution</summary>

```python
# 10 5
# The x inside f is local; the global x is untouched.
```

</details>

2. Rewrite this to avoid `global`: a `score` global and a function `add_points(n)` that adds `n` to it.

<details><summary>Solution</summary>

```python
def add_points(score, n):
    return score + n

score = 0
score = add_points(score, 10)
```

</details>

3. Write `remove_negatives(numbers)` that removes negative numbers from the list it is given, changing it in place. Hint: build a new list and use slice assignment `numbers[:] = ...`.

<details><summary>Solution</summary>

```python
def remove_negatives(numbers):
    kept = []
    for n in numbers:
        if n >= 0:
            kept.append(n)
    numbers[:] = kept     # replaces the contents of the same list

data = [3, -1, 4, -5]
remove_negatives(data)
print(data)   # [3, 4]
```

</details>

## Project: Bank account simulator

Simulate one bank account with deposits, withdrawals and a transaction history. Use no global variables: the balance is passed into each function and returned, and the history list is shared and appended to.

Files in this folder: `day23_bank.py`.

### Key lines explained

- `balance = deposit(balance, ..., history)`: A number can't be changed in place, so the function returns the new balance and `main` stores it. Forgetting the `balance =` part is a classic bug: try removing it.
- `history.append((kind, amount, balance))`: Lists can be changed in place, so appending inside `record` is visible in `main` without returning anything.
- `return balance (in the error branches)`: Even when nothing changes, the function returns the balance so the caller's assignment keeps working.
- `balance = 0.0 inside main()`: All the state lives in `main`'s local variables. No other function can change it behind your back.

### Stretch goals

- Add an overdraft limit by changing `MIN_BALANCE` to -100 and testing.
- Add monthly interest as a function `apply_interest(balance, rate, history)`.

## Test it

- [ ] Withdraw more than the balance.
- [ ] Deposit a negative number.
- [ ] Remove `balance =` from the deposit line and see the balance never change. Then put it back.
