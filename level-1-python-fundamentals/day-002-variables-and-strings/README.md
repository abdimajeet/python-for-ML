# Day 2: Variables and strings

**Level 1, Python Fundamentals.** Project: **Mad Libs story generator**

Variables let a program remember values. Today you store text, ask the user for input, and combine strings.

## Lesson

### A variable is a name for a value

`name = "Amina"` creates the value `"Amina"` and attaches the name `name` to it. The `=` means **assign**, not "equals". You don't declare a type first, as you might in Java; Python works out the type from the value. You can point a name at a new value later.

```python
city = "Nairobi"
print(city)
city = "Mogadishu"   # the name now points at a new value
print(city)
```

Output:

```text
Nairobi
Mogadishu
```

### Naming rules and style

Names may contain letters, digits and underscores, but cannot start with a digit. They are case-sensitive: `Age` and `age` are different. You can't use keywords like `if`, `for` or `class`. Python style (called PEP 8) uses **snake_case**: lowercase words joined by underscores, like `first_name`. Pick names that say what the value means.


### Strings

A **string** (`str`) is text. Use single or double quotes, whichever avoids clashing with quotes inside the text. `+` joins strings (concatenation). `type()` tells you what kind of value you have.

```python
first = "Abdy"
last = 'Rahman'
full = first + " " + last
print(full)
print(type(full))
print("It's fine")      # double quotes so the apostrophe is safe
```

Output:

```text
Abdy Rahman
<class 'str'>
It's fine
```

### Getting input

`input("prompt")` shows the prompt, waits for the user to type and press Enter, and **returns** what they typed as a string. You usually store that in a variable.

```python
colour = input("Favourite colour? ")
print("You like " + colour)
```

Output:

```text
Favourite colour? green
You like green
```

### print() with several arguments

Separate several values with commas and `print()` puts a space between them. This works with any type, whereas `+` only joins strings to strings.

```python
name = "Sam"
print("Hello", name, "!")
```

Output:

```text
Hello Sam !
```

## Exercises

1. Which of these are valid names? `2nd_place`, `second_place`, `class`, `my-name`, `_total`

<details><summary>Solution</summary>

```python
# valid:   second_place, _total
# invalid: 2nd_place (starts with a digit)
#          class (keyword)
#          my-name (hyphen means minus)
```

</details>

2. Ask for the user's first and last name, then greet them with both on one line.

<details><summary>Solution</summary>

```python
first = input("First name: ")
last = input("Last name: ")
print("Welcome, " + first + " " + last + "!")
```

</details>

3. Store your favourite movie in a variable, print it, change the variable to a different movie, and print it again.

<details><summary>Solution</summary>

```python
movie = "Inception"
print(movie)
movie = "Interstellar"
print(movie)
```

</details>

## Project: Mad Libs story generator

Ask the user for a few words, then print a funny story built from them. This practises variables, `input()` and string concatenation.

Files in this folder: `day02_mad_libs.py`.

Sample output:

```text
Enter an adjective (e.g. sleepy): sleepy
Enter an animal: camel
...
Yesterday a sleepy camel was dancing around the market, looking for mangoes.
```

### Key lines explained

- `adjective = input(...)`: `input()` pauses until the user presses Enter, then the typed text is stored under the name `adjective`.
- `story = (...)`: The `+` operator glues the strings together. Note the spaces inside quotes such as `" "`; without them the words would run together.
- `( ... ) across lines`: Wrapping an expression in parentheses lets it span several lines, which keeps long lines readable.

### Stretch goals

- Write a second story that reuses some of the same words.
- Ask for the user's name and make them the hero of the story.

## Test it

- [ ] Run it twice with different words.
- [ ] Press Enter without typing anything. What happens to the story, and why?
- [ ] Check there are no missing or double spaces in the output.
