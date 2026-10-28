# Day 44: Inheritance

**Level 3, Intermediate Python & Software Engineering.** Project: **Employee payroll system**

Inheritance lets one class build on another: a subclass gets everything from its parent and can add or change behaviour.

## Lesson

### Subclasses

Put the parent class in brackets: `class Manager(Employee):`. The subclass **inherits** every attribute and method. Use inheritance for a true **is-a** relationship: a manager _is an_ employee.

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Cat(Animal):
    def speak(self):            # override the parent's method
        return "Meow"

print(Cat("Tom").name, Cat("Tom").speak())
```

Output:

```text
Tom Meow
```

### super()

`super()` calls the parent's version of a method. Most often it's used in `__init__` so the parent sets up its attributes, and the child then adds its own.

```python
class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)      # parent sets self.name
        self.breed = breed
```

### Polymorphism

Code that works with the parent type also works with every subclass. A loop can call `speak()` on a mix of animals, and each answers in its own way. The calling code doesn't need `if` statements for each type.

```python
for pet in [Cat("Tom"), Dog("Rex", "lab")]:
    print(pet.name, pet.speak())
```

### isinstance and checking types

`isinstance(x, Animal)` is True for an Animal or any subclass. Prefer polymorphism (each class knows its behaviour) over long chains of `isinstance` checks.


### Keep hierarchies shallow

One or two levels of inheritance is usually plenty. Deep hierarchies are hard to follow. Tomorrow's topic, composition, is often the better choice.


## Exercises

1. Make a `Shape` class with an `area()` that returns 0, then `Circle` and `Square` subclasses that override it.

<details><summary>Solution</summary>

```python
import math

class Shape:
    def area(self):
        return 0

class Circle(Shape):
    def __init__(self, r):
        self.r = r
    def area(self):
        return math.pi * self.r ** 2

class Square(Shape):
    def __init__(self, side):
        self.side = side
    def area(self):
        return self.side ** 2
```

</details>

2. Print the total area of a list containing circles and squares.

<details><summary>Solution</summary>

```python
shapes = [Circle(1), Square(2), Circle(0.5)]
print(sum(s.area() for s in shapes))
```

</details>

3. Add a `describe()` method in Shape that uses `type(self).__name__` and `self.area()`. Does it work for subclasses without changes?

<details><summary>Solution</summary>

```python
class Shape:
    def describe(self):
        return f"{type(self).__name__} with area {self.area():.2f}"
# Yes: each subclass inherits describe, and self.area() calls its own version.
```

</details>

## Project: Employee payroll system

Model salaried, hourly and commission-based employees, plus managers who get a team bonus. Every type has a `monthly_pay()` method, so the payroll code treats them all the same.

Files in this folder: `day44_payroll.py`.

Sample output:

```text
ID   Name          Role         Monthly pay
-------------------------------------------
1    Amina         manager         6,450.00
4    Yusuf         commission      4,550.00
3    Sara          hourly          4,005.00
2    Omar          salaried        4,000.00
-------------------------------------------
Total                             19,005.00
```

### Key lines explained

- `raise NotImplementedError(...)`: The base class promises a `monthly_pay` method but can't know how to calculate it. Forgetting to override it in a subclass gives a clear error.
- `super().__init__(emp_id, name)`: Each subclass lets its parent set up the shared attributes, then adds its own. No code is duplicated.
- `return super().monthly_pay() + self.sales * self.rate`: A commission employee's pay is the salaried pay _plus_ commission. `super()` reuses the parent's calculation.
- `for e in sorted(employees, key=lambda e: e.monthly_pay(), ...)`: Polymorphism: the payroll never checks types. Each object calculates its own pay.
- `{self.name!r}`: `!r` in an f-string uses `repr()`, which adds quotes around strings.

### Stretch goals

- Add an `Intern` class with a fixed monthly stipend.
- Add a tax calculation in the base class that every subclass inherits.

## Test it

- [ ] Check Sara by hand: 160 × 22.50 + 12 × 1.5 × 22.50.
- [ ] Create a plain `Employee` and call `monthly_pay()`.
- [ ] Add a second manager who manages the first one.
