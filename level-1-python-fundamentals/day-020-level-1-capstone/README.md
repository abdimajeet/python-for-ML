# Day 20: Level 1 capstone

**Level 1, Python Fundamentals.** Project: **Text adventure game**

Capstone day. You combine every Level 1 skill into a text adventure game. Take two days if you need them.

## Lesson

### Design the data first

A game world is data. Each room is a dict with a description, its exits (a dict mapping a direction to another room's name), and an optional item. All rooms live in one dict keyed by room name. The player is just a current room name and an inventory list.


### The game loop

Most games follow the same loop: show the state, read a command, update the state, check for a win or loss, then repeat. Write that loop with comments first, as on Day 8.


### Parsing commands

`command.split()` turns "go north" into `["go", "north"]`. The first word is the verb and the rest is the target. Check the length of the list before indexing, so a one-word command doesn't crash.

```python
parts = "take lamp".split()
verb = parts[0]
target = parts[1] if len(parts) > 1 else ""
print(verb, target)
```

Output:

```text
take lamp
```

### Review checklist

This project uses: variables, strings and f-strings, input, conditionals, `while` and `for` loops, lists, dicts, nested data, sets and string methods. If any of those feel shaky, revisit that day before moving on to Level 2.


## Exercises

1. Sketch your own map on paper first: at least five rooms, how they connect, and where the items are.

<details><summary>Solution</summary>

```python
# Example layout:
#        [Library]
#            |
# [Hall] - [Garden] - [Shed]
#            |
#        [Gate]  (needs the key)
```

</details>

2. Write just the `ROOMS` dict for your map and print the description of each room in a loop.

<details><summary>Solution</summary>

```python
for name, room in ROOMS.items():
    print(name, "-", room["description"])
```

</details>

## Project: Text adventure game

Explore a small world, pick up items, and escape through the locked gate. The player wins by reaching the gate with the key, and the game supports the commands `go`, `take`, `inventory`, `look`, `help` and `quit`.

Files in this folder: `day20_adventure.py`.

### Key lines explained

- `ROOMS = {...}`: The whole world is nested data: a dict of dicts, each holding another dict of exits. To add a room you edit data, not logic.
- `room = ROOMS[current]`: At the top of each loop we fetch the current room once, so the code below can use the short name `room`.
- `target = parts[1] if len(parts) > 1 else ""`: A **conditional expression**: a one-line if/else that produces a value. It avoids an IndexError when the command is a single word.
- `room["item"] = None`: Dicts are mutable, so changing the room here changes it in ROOMS too. The item stays taken if you come back.
- `visited`: A set of rooms already described; checking membership in a set is fast and order doesn't matter.

### Stretch goals

- Make the Library dark until you carry the lamp.
- Add a move limit, or a creature that blocks a door until you give it an item.
- Write your own world from the map you sketched.

## Test it

- [ ] Win the game in as few moves as possible. What is the minimum?
- [ ] Try to go through the gate without the key.
- [ ] Take the same item twice.
- [ ] Enter an empty command, a single word, and nonsense.
- [ ] Show the finished game to someone and let them play without help.
