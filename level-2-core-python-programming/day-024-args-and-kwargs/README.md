# Day 24: *args and **kwargs

**Level 2, Core Python Programming.** Project: **Pizza order builder**

Some functions need to accept any number of arguments, like `print()` does. Today you learn `*args` and `**kwargs`, and the matching unpacking syntax.

## Lesson

### *args collects extra positional arguments

A parameter starting with `*` gathers any extra positional arguments into a **tuple**. The name `args` is just a convention; `*toppings` works too.

```python
def total(*numbers):
    print(numbers)
    return sum(numbers)

print(total(1, 2, 3))
print(total())
```

Output:

```text
(1, 2, 3)
6
()
0
```

### **kwargs collects extra keyword arguments

A parameter starting with `**` gathers extra keyword arguments into a **dict**.

```python
def profile(name, **details):
    print(name)
    for key, value in details.items():
        print(f"  {key}: {value}")

profile("Amina", city="Hargeisa", language="Python")
```

### Order of parameters

The order in a definition is: normal parameters, `*args`, keyword parameters with defaults, then `**kwargs`. A parameter after `*args` can only be passed by keyword.

```python
def order(size, *toppings, delivery=False, **extras):
    ...
```

### Unpacking when calling

The same symbols work the other way when calling: `*list` spreads a list into positional arguments, and `**dict` spreads a dict into keyword arguments.

```python
nums = [3, 8, 1]
print(max(*nums))          # same as max(3, 8, 1)

settings = {"sep": " | ", "end": "!\n"}
print("a", "b", "c", **settings)
```

Output:

```text
8
a | b | c!
```

## Exercises

1. Write `average(*nums)` that works with any number of arguments and returns 0 if there are none.

<details><summary>Solution</summary>

```python
def average(*nums):
    if not nums:
        return 0
    return sum(nums) / len(nums)

print(average(2, 4, 9))
```

</details>

2. Write `make_tag(tag, text, **attrs)` that returns HTML like `<a href="x">text</a>`.

<details><summary>Solution</summary>

```python
def make_tag(tag, text, **attrs):
    parts = ""
    for key, value in attrs.items():
        parts += f' {key}="{value}"'
    return f"<{tag}{parts}>{text}</{tag}>"

print(make_tag("a", "Home", href="/", title="Go home"))
```

</details>

3. Given `point = (3, 4)` and `def distance(x, y)`, call it by unpacking the tuple.

<details><summary>Solution</summary>

```python
def distance(x, y):
    return (x ** 2 + y ** 2) ** 0.5

point = (3, 4)
print(distance(*point))   # 5.0
```

</details>

## Project: Pizza order builder

A function builds a pizza from a size, any number of toppings, and optional extras passed as keyword arguments. It returns a dict describing the order. The main program takes a whole order of several pizzas and prints a bill.

Files in this folder: `day24_pizza.py`.

### Key lines explained

- `def make_pizza(size, *toppings, **extras):`: `toppings` becomes a tuple of however many toppings were passed; `extras` becomes a dict of the keyword options.
- `raise ValueError(...)`: A preview of Day 31: a function can stop with an error when it gets impossible input. Try ordering a "huge" pizza.
- `make_pizza(size, *toppings, extra_cheese=cheese)`: `*toppings` spreads the list from the user into separate arguments, which the function's `*toppings` then gathers back up.
- `if wanted and name in EXTRA_PRICES:`: Unknown extras are ignored rather than crashing, and `extra_cheese=False` adds nothing.

### Stretch goals

- Add a `**extras` option `discount_code="SAVE10"` that takes 10% off.
- Let the user keep adding pizzas until they enter an empty size.

## Test it

- [ ] A pizza with no toppings.
- [ ] Five toppings: is the price 5 × 1.25 more?
- [ ] Type an unknown size and read the ValueError message.
- [ ] Toppings typed with extra spaces, like `ham ,  pineapple`.
