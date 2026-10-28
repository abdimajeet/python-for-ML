# Day 46: Encapsulation

**Level 3, Intermediate Python & Software Engineering.** Project: **Thermostat with safe limits**

Encapsulation means an object protects its own data so it can never get into an invalid state. Today you learn Python's conventions for private data and the `@property` decorator.

## Lesson

### The problem

Attributes can be changed by anyone: `account.balance = -1_000_000`. Nothing stops invalid values, and the bug shows up far from where it was caused.


### Python's privacy conventions

Python has no truly private attributes. A single leading underscore, `self._balance`, means "internal: please don't touch from outside". Everyone respects it. A double underscore, `self.__balance`, triggers **name mangling** to avoid clashes in subclasses; you rarely need it.


### @property

`@property` turns a method into something that reads like an attribute. Add a **setter** to validate new values. Users still write `t.target = 21`, but your code checks it first.

```python
class Thermostat:
    def __init__(self, target):
        self.target = target          # goes through the setter

    @property
    def target(self):
        return self._target

    @target.setter
    def target(self, value):
        if not 10 <= value <= 30:
            raise ValueError("Target must be between 10 and 30")
        self._target = value

t = Thermostat(21)
t.target = 24
print(t.target)
t.target = 99          # ValueError
```

### Read-only and computed properties

A property without a setter is read-only. Properties can also compute a value each time it's read, so it can never be out of date.

```python
class Rectangle:
    def __init__(self, w, h):
        self.w, self.h = w, h

    @property
    def area(self):           # computed, read-only
        return self.w * self.h

print(Rectangle(3, 4).area)   # no parentheses
```

### Start simple

Begin with plain attributes. Python lets you switch to a property later without changing any code that uses the class, so you don't need Java-style `get_x()` / `set_x()` methods.


## Exercises

1. Add a property `perimeter` to the Rectangle above.

<details><summary>Solution</summary>

```python
    @property
    def perimeter(self):
        return 2 * (self.w + self.h)
```

</details>

2. Make a `Person` whose `age` setter rejects negative numbers and non-integers.

<details><summary>Solution</summary>

```python
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if not isinstance(value, int) or value < 0:
            raise ValueError("Age must be a non-negative whole number")
        self._age = value
```

</details>

3. Make a `Temperature` class storing Celsius, with a `fahrenheit` property that can be read and set.

<details><summary>Solution</summary>

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9
```

</details>

## Project: Thermostat with safe limits

Model a smart thermostat. The target temperature is validated, the mode is restricted to a fixed set, the heating state is computed from the readings, and history is read-only from outside. Users interact through a small command prompt.

Files in this folder: `day46_thermostat.py`.

### Key lines explained

- `self.target = target  (in __init__)`: Even the constructor goes through the setter, so an invalid starting value is rejected too.
- `value = round(float(value), 1)`: The setter accepts text like "22" from the prompt and normalises it.
- `@property def action(self):`: Computed from the current state each time, so it can never be stale. There's no setter: `t.action = "heating"` raises an AttributeError.
- `return tuple(self._history)`: Returning a tuple copy means outside code can read the history but can't append to or erase it.
- `def _log(self, message):`: The underscore says this is for the class's own use.

### Stretch goals

- Add an eco mode that lowers the target by 2 degrees at night.
- Add a `schedule` of times and targets, and apply it in `tick()`.

## Test it

- [ ] `target 35` and `mode warm` should be rejected.
- [ ] Set `room 15`, then `wait 15`: it should heat up and then go idle.
- [ ] In the interpreter, try `t.action = "heating"` and `t.history.append("x")`.
