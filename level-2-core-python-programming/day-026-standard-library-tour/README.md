# Day 26: Standard library tour

**Level 2, Core Python Programming.** Project: **Dice roller and password generator**

Python comes with "batteries included": a large standard library. Today you tour four modules: `math`, `random`, `string` and `secrets`.

## Lesson

### Ways to import

`import math` then `math.sqrt(9)` keeps the module name visible, which is clearest. `from math import sqrt` imports one name. `import random as rnd` gives a shorter alias. Avoid `from math import *`, which dumps every name into your file.

```python
import math
from random import randint

print(math.sqrt(16), randint(1, 6))
```

### math

`math.pi`, `math.sqrt`, `math.ceil` (round up), `math.floor` (round down), `math.pow`, `math.log`, `math.isclose(a, b)` for comparing floats safely.

```python
import math
print(math.ceil(4.1), math.floor(4.9))
print(math.isclose(0.1 + 0.2, 0.3))
```

Output:

```text
5 4
True
```

### random

`randint(a, b)`, `random()` (a float from 0 to 1), `choice(seq)`, `sample(seq, k)` (k unique items), `shuffle(list)` (in place). `random.seed(42)` makes results repeatable, which is very important in ML experiments.

```python
import random
random.seed(42)
print(random.sample(range(1, 50), 6))
```

### string and secrets

`string.ascii_letters`, `string.digits` and `string.punctuation` are ready-made character sets. `random` is predictable by design, so for passwords and tokens use `secrets`, which uses the operating system's secure randomness: `secrets.choice(chars)`, `secrets.token_hex(16)`.


### Reading the docs

Every module is documented at **docs.python.org/3/library**. In the interpreter, `dir(math)` lists what a module contains and `help(math.ceil)` explains one function.


## Exercises

1. How many 4-seater cars are needed for 23 people? Use `math.ceil`.

<details><summary>Solution</summary>

```python
import math
print(math.ceil(23 / 4))   # 6
```

</details>

2. Simulate a lottery draw: 6 unique numbers from 1 to 49, sorted.

<details><summary>Solution</summary>

```python
import random
print(sorted(random.sample(range(1, 50), 6)))
```

</details>

3. Generate a 6-digit verification code securely.

<details><summary>Solution</summary>

```python
import secrets
import string
code = ""
for i in range(6):
    code += secrets.choice(string.digits)
print(code)
```

</details>

## Project: Dice roller and password generator

A two-tool program. The dice roller understands tabletop notation like `3d6+2` (three six-sided dice plus 2). The password generator builds a secure password of a chosen length that is guaranteed to include every character type.

Files in this folder: `day26_dice_and_passwords.py`.

### Key lines explained

- `notation, bonus_text = notation.split("+")`: Splitting "3d6+2" gives two parts. We reuse the name `notation` for the dice part.
- `int(count_text) if count_text else 1`: "d20".split("d") gives `['', '20']`; an empty count means one die.
- `[random.randint(1, sides) for _ in range(count)]`: A list comprehension (Day 27) that rolls once per die. `_` is the conventional name for a loop variable you don't use.
- `chars = [secrets.choice(pool) for pool in pools]`: Guarantees at least one character from each pool before filling the rest randomly.
- `secrets.SystemRandom().shuffle(chars)`: Shuffling stops the guaranteed characters always being at the start, which would make passwords more predictable.

### Stretch goals

- Support minus modifiers like `2d6-1`.
- Add a passphrase option that joins 4 random words from a word list with hyphens.

## Test it

- [ ] Roll `1d1` a few times; it should always be 1.
- [ ] Roll `d20` and `3d6+2`.
- [ ] Generate a 4-character password and check it has one of each type.
- [ ] Type `abc` as dice notation and read the error. You'll handle it on Day 31.
