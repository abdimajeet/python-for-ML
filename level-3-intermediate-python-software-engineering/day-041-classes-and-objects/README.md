# Day 41: Classes and objects

**Level 3, Intermediate Python & Software Engineering.** Project: **Pet simulator**

Object-oriented programming (OOP) bundles data and the functions that work on it into one unit. You've been using objects since Day 2; today you create your own.

## Lesson

### You already use objects

Every value in Python is an **object**. A string like `"hi"` holds data (its characters) and has **methods** (`upper`, `split`). A list holds items and has `append`. A **class** is the blueprint; an object made from it is an **instance**. `type("hi")` prints `<class 'str'>`.


### Defining a class

`class` defines a blueprint. Class names use **CapWords**. Calling the class like a function, `Dog()`, creates a new instance. You can attach data to an instance with a dot.

```python
class Dog:
    pass            # an empty class body

rex = Dog()
rex.name = "Rex"
print(rex.name)
print(type(rex))
```

Output:

```text
Rex
<class '__main__.Dog'>
```

### Methods and self

A function defined inside a class is a **method**. Its first parameter, always called `self`, is the instance the method was called on. When you write `rex.bark()`, Python calls `Dog.bark(rex)` behind the scenes, so `self` is `rex`.

```python
class Dog:
    def bark(self):
        print(f"{self.name} says woof!")

rex = Dog()
rex.name = "Rex"
rex.bark()
```

Output:

```text
Rex says woof!
```

### Each instance has its own data

Two instances of the same class are separate objects with separate attributes. Changing one doesn't affect the other. This is the main advantage over the dicts you used in Level 2: the data _and_ the behaviour travel together.


### Why OOP?

Classes model things in your problem: a bank account, a player, a dataset. In ML you'll use them constantly: a scikit-learn model is an object you `fit()` and `predict()` with, and a PyTorch network is a class you write yourself.


## Exercises

1. Make a class `Car` with a method `honk` that prints `"Beep!"`. Create two cars and honk both.

<details><summary>Solution</summary>

```python
class Car:
    def honk(self):
        print("Beep!")

a = Car()
b = Car()
a.honk()
b.honk()
```

</details>

2. Give each car a `colour` attribute and a method `describe` that prints it.

<details><summary>Solution</summary>

```python
class Car:
    def describe(self):
        print(f"A {self.colour} car")

c = Car()
c.colour = "red"
c.describe()
```

</details>

3. What happens if you call `describe` on a car that never had `colour` set? Why is that a problem? (Tomorrow fixes it.)

<details><summary>Solution</summary>

```python
# AttributeError: 'Car' object has no attribute 'colour'
# Nothing guarantees every Car gets a colour. A constructor (__init__) will.
```

</details>

## Project: Pet simulator

Create a virtual pet that gets hungry and bored over time. You can feed it, play with it and let it sleep. Its state is stored on the object and changed by its methods. (Today uses a small `__init__` method to set up each pet; tomorrow explains it fully.)

Files in this folder: `day41_pet.py`.

### Key lines explained

- `def __init__(self, name):`: A special method Python calls automatically when you create a pet with `Pet("Pixel")`. It sets the starting attributes. Tomorrow's lesson covers it.
- `self.hunger = min(10, self.hunger + 1)`: Methods change the object's own attributes through `self`. `min` keeps the value at 10 or below.
- `self.mood()`: One method can call another on the same object, again through `self`.
- `actions = {"f": pet.feed, ...}`: `pet.feed` without parentheses is a **bound method**: a function already tied to this pet. Calling `actions["f"]()` feeds this particular pet.
- `if self.energy < 2: ... return`: Objects can enforce their own rules: the pet refuses to play when exhausted.

### Stretch goals

- Create two pets and let the player switch between them.
- Add an age attribute that grows each turn, and let the pet grow from baby to adult.

## Test it

- [ ] Wait several turns without doing anything and watch the mood fall.
- [ ] Play until the pet is too tired.
- [ ] Feed it when it's already full: the hunger shouldn't go below 0.
