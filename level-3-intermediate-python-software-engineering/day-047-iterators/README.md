# Day 47: Iterators

**Level 3, Intermediate Python & Software Engineering.** Project: **Music playlist iterator**

Every `for` loop uses Python's iterator protocol. Today you learn how it works and make your own objects loopable.

## Lesson

### Iterables and iterators

An **iterable** is anything you can loop over: lists, strings, dicts, files. Calling `iter()` on it gives an **iterator**, an object that produces one value each time you call `next()` and raises `StopIteration` when it runs out.

```python
it = iter(["a", "b"])
print(next(it))
print(next(it))
print(next(it))   # StopIteration
```

### What a for loop really does

`for x in items:` calls `iter(items)` once, then calls `next()` repeatedly until StopIteration, which it catches quietly. That's the whole trick.

```python
items = [1, 2, 3]
it = iter(items)
while True:
    try:
        x = next(it)
    except StopIteration:
        break
    print(x)
```

### Writing an iterator class

An iterator needs `__iter__` (returning itself) and `__next__` (returning the next value or raising StopIteration).

```python
class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

print(list(Countdown(3)))
```

Output:

```text
[3, 2, 1]
```

### Iterators get used up

An iterator can only be looped over once. A container class (like a playlist) should therefore return a **new** iterator from `__iter__` each time, so it can be looped over again and again.


## Exercises

1. Call `iter()` and `next()` by hand on the string "hi".

<details><summary>Solution</summary>

```python
it = iter("hi")
print(next(it), next(it))   # h i
```

</details>

2. Write an iterator class `EvenNumbers(limit)` producing 0, 2, 4, up to the limit.

<details><summary>Solution</summary>

```python
class EvenNumbers:
    def __init__(self, limit):
        self.limit = limit
        self.n = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self.n > self.limit:
            raise StopIteration
        value = self.n
        self.n += 2
        return value

print(list(EvenNumbers(8)))
```

</details>

3. Loop over the same `EvenNumbers(4)` object twice. Why is the second loop empty?

<details><summary>Solution</summary>

```python
evens = EvenNumbers(4)
print(list(evens))   # [0, 2, 4]
print(list(evens))   # []  the iterator is already used up
```

</details>

## Project: Music playlist iterator

A `Playlist` container that can be looped over normally, plus separate iterator classes for shuffle play and repeat play. It shows the difference between an iterable container and the iterators it creates.

Files in this folder: `day47_playlist.py`.

### Key lines explained

- `return iter(self.songs)`: The playlist is an **iterable**, not an iterator. Each `for` loop gets a fresh iterator over the list, so you can loop as many times as you like.
- `random.Random(seed).shuffle(self.order)`: A private random generator with an optional seed: the same seed always gives the same order, which makes shuffles testable.
- `self.songs[self.played % len(self.songs)]`: The remainder wraps the position back to 0 after the last song.
- `sum(song.seconds for song in self)`: Inside the class, `self` is loopable too, because `__iter__` is defined.
- `{song.artist for song in mix}`: Comprehensions work with any iterable, including your own classes.

### Stretch goals

- Add a `by_artist(name)` iterator.
- Make `RepeatIterator` stop after a total listening time instead of a number of plays.

## Test it

- [ ] Loop over the playlist twice; both loops should print every song.
- [ ] Loop over the same `mix.shuffled()` object twice. What happens?
- [ ] Call `repeat(5)` on an empty playlist.
