// Level 1 lessons: Days 1-20. Code fields use String.raw so backslashes stay literal.
window.LESSONS = window.LESSONS || {};
(function (L) {
const R = String.raw;

L[1] = {
  intro: "Today you install Python, learn the two ways to run it, and write your first program.",
  lesson: [
    {h: "What Python is",
     p: "Python is an <b>interpreted</b> language. You write plain text in a <code>.py</code> file, and a program called the <b>interpreter</b> reads it and runs it line by line, top to bottom. There is no separate compile step like in C or Java. When people say \"install Python\", they mean install that interpreter."},
    {h: "Install Python",
     p: "Download the latest Python 3 from <b>python.org/downloads</b>. On Windows, tick <b>Add python.exe to PATH</b> on the first installer screen; this lets you type <code>python</code> in any terminal. On macOS, run the installer from python.org. Then open a terminal (PowerShell on Windows, Terminal on macOS) and check it worked:",
     code: R`python --version
# on macOS/Linux you may need:
python3 --version`,
     out: "Python 3.13.0"},
    {h: "Install VS Code",
     p: "Download VS Code from <b>code.visualstudio.com</b>. Open it, go to the Extensions panel (the four-squares icon), search <b>Python</b>, and install the one published by Microsoft. Make a folder called <code>python-100-days</code> and open it with <b>File → Open Folder</b>. Everything for this course lives there."},
    {h: "Way 1: the interactive interpreter (REPL)",
     p: "Type <code>python</code> (or <code>python3</code>) in the terminal and press Enter. The <code>&gt;&gt;&gt;</code> prompt means Python is waiting for one line. It runs it immediately and shows the result. This is great for quick experiments. Type <code>exit()</code> to leave.",
     code: R`>>> 2 + 3
5
>>> "hello".upper()
'HELLO'
>>> exit()`},
    {h: "Way 2: running a file",
     p: "Real programs live in files. Create <code>hello.py</code> in your folder, type the line below, save, and run it from the terminal. In VS Code you can also press the ▶ button in the top right.",
     code: R`print("Hello, Python!")`,
     out: "Hello, Python!"},
    {h: "print() and comments",
     p: "<code>print()</code> is a <b>function</b>: a named piece of code you call with parentheses. Whatever you put inside the parentheses is its <b>argument</b>. Text must be inside quotes, either <code>\"double\"</code> or <code>'single'</code>. A line starting with <code>#</code> is a <b>comment</b>; Python ignores it, so it is a note for humans. Calling <code>print()</code> with nothing inside prints an empty line.",
     code: R`# This is a comment. Python skips it.
print("Line one")
print()            # an empty line
print('Line three')`,
     out: "Line one\n\nLine three"}
  ],
  exercises: [
    {q: "In the REPL, calculate how many minutes are in a week.", hint: "7 days × 24 hours × 60 minutes. Use <code>*</code> to multiply.", sol: R`>>> 7 * 24 * 60
10080`},
    {q: "Write <code>three_lines.py</code> that prints your name, your city, and your favourite food on three separate lines.", sol: R`print("AbdyRahman")
print("My city")
print("Rice and chicken")`},
    {q: "Add a comment above each line of the previous program saying what it prints. Run it again; the output should not change.", sol: R`# my name
print("AbdyRahman")
# where I live
print("My city")
# what I like to eat
print("Rice and chicken")`},
    {q: "Run <code>print(\"Hello\"</code> (missing the closing bracket). Read the error. What word does Python use for this kind of error?", hint: "Look at the last line of the message.", sol: R`SyntaxError: '(' was never closed
# A SyntaxError means the code is not valid Python, so nothing runs.`}
  ],
  project: {
    title: "Personal intro card printer",
    brief: "Write a program that prints a small card introducing you, framed with text characters. This practises running a file, using <code>print()</code>, and writing comments.",
    file: "day01_intro_card.py",
    code: R`# day01_intro_card.py
# Prints a framed introduction card.

print("+--------------------------------+")
print("|            ABOUT ME            |")
print("+--------------------------------+")
print("| Name:   AbdyRahman             |")
print("| Goal:   Python for ML and AI   |")
print("| Today:  Day 1 of 100           |")
print("+--------------------------------+")
print()
print("Let's begin!")`,
    explain: [
      ["# day01_intro_card.py", "A comment naming the file. Comments at the top tell a reader what the program does."],
      ["print(\"+----...\")", "Each <code>print()</code> call writes one line and then moves to the next line."],
      ["print()", "With no argument it prints a blank line, which spaces the card from the closing message."]
    ],
    out: "+--------------------------------+\n|            ABOUT ME            |\n+--------------------------------+\n| Name:   AbdyRahman             |\n| Goal:   Python for ML and AI   |\n| Today:  Day 1 of 100           |\n+--------------------------------+\n\nLet's begin!",
    stretch: ["Add two more rows: a hobby and a language you already know.", "Make the right-hand border line up on every row."]
  },
  tests: ["Run the file from the terminal with <code>python day01_intro_card.py</code>, not only with the ▶ button.", "Check every row's right border lines up.", "Delete one closing quote, run it, read the error, then fix it."]
};

L[2] = {
  intro: "Variables let a program remember values. Today you store text, ask the user for input, and combine strings.",
  lesson: [
    {h: "A variable is a name for a value",
     p: "<code>name = \"Amina\"</code> creates the value <code>\"Amina\"</code> and attaches the name <code>name</code> to it. The <code>=</code> means <b>assign</b>, not \"equals\". You don't declare a type first, as you might in Java; Python works out the type from the value. You can point a name at a new value later.",
     code: R`city = "Nairobi"
print(city)
city = "Mogadishu"   # the name now points at a new value
print(city)`,
     out: "Nairobi\nMogadishu"},
    {h: "Naming rules and style",
     p: "Names may contain letters, digits and underscores, but cannot start with a digit. They are case-sensitive: <code>Age</code> and <code>age</code> are different. You can't use keywords like <code>if</code>, <code>for</code> or <code>class</code>. Python style (called PEP 8) uses <b>snake_case</b>: lowercase words joined by underscores, like <code>first_name</code>. Pick names that say what the value means."},
    {h: "Strings",
     p: "A <b>string</b> (<code>str</code>) is text. Use single or double quotes, whichever avoids clashing with quotes inside the text. <code>+</code> joins strings (concatenation). <code>type()</code> tells you what kind of value you have.",
     code: R`first = "Abdy"
last = 'Rahman'
full = first + " " + last
print(full)
print(type(full))
print("It's fine")      # double quotes so the apostrophe is safe`,
     out: "Abdy Rahman\n<class 'str'>\nIt's fine"},
    {h: "Getting input",
     p: "<code>input(\"prompt\")</code> shows the prompt, waits for the user to type and press Enter, and <b>returns</b> what they typed as a string. You usually store that in a variable.",
     code: R`colour = input("Favourite colour? ")
print("You like " + colour)`,
     out: "Favourite colour? green\nYou like green"},
    {h: "print() with several arguments",
     p: "Separate several values with commas and <code>print()</code> puts a space between them. This works with any type, whereas <code>+</code> only joins strings to strings.",
     code: R`name = "Sam"
print("Hello", name, "!")`,
     out: "Hello Sam !"}
  ],
  exercises: [
    {q: "Which of these are valid names? <code>2nd_place</code>, <code>second_place</code>, <code>class</code>, <code>my-name</code>, <code>_total</code>", sol: R`# valid:   second_place, _total
# invalid: 2nd_place (starts with a digit)
#          class (keyword)
#          my-name (hyphen means minus)`},
    {q: "Ask for the user's first and last name, then greet them with both on one line.", sol: R`first = input("First name: ")
last = input("Last name: ")
print("Welcome, " + first + " " + last + "!")`},
    {q: "Store your favourite movie in a variable, print it, change the variable to a different movie, and print it again.", sol: R`movie = "Inception"
print(movie)
movie = "Interstellar"
print(movie)`}
  ],
  project: {
    title: "Mad Libs story generator",
    brief: "Ask the user for a few words, then print a funny story built from them. This practises variables, <code>input()</code> and string concatenation.",
    file: "day02_mad_libs.py",
    code: R`# day02_mad_libs.py
# Builds a short story from words the user types.

print("Let's write a silly story together!")
print()

adjective = input("Enter an adjective (e.g. sleepy): ")
animal = input("Enter an animal: ")
verb = input("Enter a verb ending in -ing: ")
place = input("Enter a place: ")
food = input("Enter a food: ")

story = ("Yesterday a " + adjective + " " + animal +
         " was " + verb + " around " + place +
         ", looking for " + food + ".")

print()
print("Here is your story:")
print(story)`,
    explain: [
      ["adjective = input(...)", "<code>input()</code> pauses until the user presses Enter, then the typed text is stored under the name <code>adjective</code>."],
      ["story = (...)", "The <code>+</code> operator glues the strings together. Note the spaces inside quotes such as <code>\" \"</code>; without them the words would run together."],
      ["( ... ) across lines", "Wrapping an expression in parentheses lets it span several lines, which keeps long lines readable."]
    ],
    out: "Enter an adjective (e.g. sleepy): sleepy\nEnter an animal: camel\n...\nYesterday a sleepy camel was dancing around the market, looking for mangoes.",
    stretch: ["Write a second story that reuses some of the same words.", "Ask for the user's name and make them the hero of the story."]
  },
  tests: ["Run it twice with different words.", "Press Enter without typing anything. What happens to the story, and why?", "Check there are no missing or double spaces in the output."]
};

L[3] = {
  intro: "Python is an excellent calculator. Today you learn its number types and arithmetic operators.",
  lesson: [
    {h: "int and float",
     p: "<code>int</code> is a whole number like <code>42</code> or <code>-7</code>. <code>float</code> is a number with a decimal point like <code>3.14</code>. Python ints can be as large as you like; there is no overflow.",
     code: R`apples = 12
price = 0.75
print(type(apples), type(price))`,
     out: "<class 'int'> <class 'float'>"},
    {h: "Arithmetic operators",
     p: "<code>+ - *</code> work as you expect. <code>/</code> <b>always</b> gives a float, even for <code>10 / 2</code>. <code>//</code> is floor division (divides and drops the remainder). <code>%</code> is the remainder (modulo). <code>**</code> is power.",
     code: R`print(10 / 3)    # 3.3333333333333335
print(10 // 3)   # 3
print(10 % 3)    # 1
print(2 ** 10)   # 1024
print(10 / 2)    # 5.0, still a float`},
    {h: "Order of operations",
     p: "Python follows the usual maths order: <code>**</code> first, then <code>* / // %</code>, then <code>+ -</code>. Use parentheses to make the order obvious.",
     code: R`print(2 + 3 * 4)     # 14
print((2 + 3) * 4)   # 20`},
    {h: "Updating a variable",
     p: "<code>total += 5</code> is short for <code>total = total + 5</code>. The same works with <code>-=</code>, <code>*=</code> and <code>/=</code>.",
     code: R`score = 10
score += 5
score *= 2
print(score)`,
     out: "30"},
    {h: "Rounding and float surprises",
     p: "Floats are stored in binary, so some decimals can't be exact. <code>0.1 + 0.2</code> gives <code>0.30000000000000004</code>. That's normal in every language. Use <code>round(value, 2)</code> when showing money.",
     code: R`print(0.1 + 0.2)
print(round(0.1 + 0.2, 2))
print(round(7.456, 1))`,
     out: "0.30000000000000004\n0.3\n7.5"}
  ],
  exercises: [
    {q: "How many full hours and leftover minutes are in 200 minutes? Use <code>//</code> and <code>%</code>.", sol: R`minutes = 200
print(minutes // 60, "hours and", minutes % 60, "minutes")
# 3 hours and 20 minutes`},
    {q: "Calculate the area of a circle with radius 5 (use 3.14159 for π) and round it to 2 decimals.", sol: R`radius = 5
area = 3.14159 * radius ** 2
print(round(area, 2))   # 78.54`},
    {q: "Is 1234 even? Print the remainder when divided by 2.", sol: R`print(1234 % 2)   # 0 means even`}
  ],
  project: {
    title: "Tip and bill splitter",
    brief: "Given a bill, a tip percentage and a number of people, calculate the tip, the total and what each person pays. For today the values are written in the code; tomorrow you'll read them from the user.",
    file: "day03_tip_splitter.py",
    code: R`# day03_tip_splitter.py
# Splits a restaurant bill, including tip, between friends.

bill = 84.50          # cost of the meal
tip_percent = 15      # tip as a percentage
people = 4            # number of people paying

tip = bill * tip_percent / 100
total = bill + tip
each = total / people

print("Bill:      ", bill)
print("Tip:       ", round(tip, 2))
print("Total:     ", round(total, 2))
print("Each pays: ", round(each, 2))`,
    explain: [
      ["tip = bill * tip_percent / 100", "Multiplication and division have the same priority and run left to right: 84.5 × 15 = 1267.5, then ÷ 100 = 12.675."],
      ["each = total / people", "<code>/</code> gives a float, which is what we want for money."],
      ["round(tip, 2)", "Rounds to 2 decimal places for display; the stored value is unchanged."]
    ],
    out: "Bill:       84.5\nTip:        12.68\nTotal:      97.17\nEach pays:  24.29",
    stretch: ["Change the values and check the answers with a calculator.", "Also print how much tip each person contributes."]
  },
  tests: ["Set people to 1; each pays should equal the total.", "Set tip_percent to 0; the total should equal the bill.", "Set people to 0 and run it. Read the error; you'll learn to prevent it on Day 8."]
};

L[4] = {
  intro: "Everything from <code>input()</code> is text. Today you learn to convert between types so you can do maths with what users type.",
  lesson: [
    {h: "The problem",
     p: "<code>input()</code> always returns a <code>str</code>, even if the user types digits. Adding two strings joins them, so you get a surprising answer.",
     code: R`a = input("First number: ")   # user types 5
b = input("Second number: ")  # user types 5
print(a + b)`,
     out: "55"},
    {h: "Converting types",
     p: "<code>int()</code>, <code>float()</code> and <code>str()</code> create a new value of that type from another value. Wrap <code>input()</code> in one to get a number.",
     code: R`a = int(input("First number: "))
b = int(input("Second number: "))
print(a + b)            # 10

price = float("19.99")  # str to float
label = str(42)         # int to str
print("Item " + label)`},
    {h: "What can be converted",
     p: "<code>int(\"12\")</code> works, but <code>int(\"12.5\")</code> and <code>int(\"twelve\")</code> raise a <b>ValueError</b>. <code>int(3.9)</code> gives <code>3</code>; it cuts off the decimals rather than rounding. For now, type valid input; on Day 31 you'll learn to handle bad input gracefully.",
     code: R`print(int(3.9))        # 3
print(float("2"))      # 2.0
print(int(float("12.5")))  # 12`},
    {h: "Why str() matters for printing",
     p: "<code>\"Age: \" + 30</code> is a <b>TypeError</b> because Python won't silently mix text and numbers. Either convert with <code>str(30)</code> or use commas in <code>print()</code>."}
  ],
  exercises: [
    {q: "Ask for the user's birth year and print how old they turn this year.", sol: R`year = int(input("Birth year: "))
print("You turn", 2026 - year, "this year")`},
    {q: "Predict, then run: <code>print(\"3\" * 3)</code> and <code>print(int(\"3\") * 3)</code>.", sol: R`print("3" * 3)       # 333  (string repeated)
print(int("3") * 3)  # 9`},
    {q: "Ask for a price with decimals and print it with 16% VAT added.", sol: R`price = float(input("Price: "))
print("With VAT:", round(price * 1.16, 2))`}
  ],
  project: {
    title: "Unit converter",
    brief: "Ask the user for a distance in kilometres and a temperature in Celsius, then print both converted. Each conversion reads a string, converts it to a float, calculates, and prints a rounded answer.",
    file: "day04_unit_converter.py",
    code: R`# day04_unit_converter.py
# Converts kilometres to miles and Celsius to Fahrenheit.

KM_TO_MILES = 0.621371   # constants are written in CAPITALS by convention

print("=== Unit Converter ===")

km = float(input("Distance in kilometres: "))
miles = km * KM_TO_MILES
print(km, "km is", round(miles, 2), "miles")

print()

celsius = float(input("Temperature in Celsius: "))
fahrenheit = celsius * 9 / 5 + 32
print(celsius, "°C is", round(fahrenheit, 1), "°F")`,
    explain: [
      ["KM_TO_MILES = 0.621371", "A value that never changes. Python has no true constants; capital letters just tell readers \"don't change this\"."],
      ["float(input(...))", "Read inside-out: <code>input()</code> runs first and returns text, then <code>float()</code> turns it into a number."],
      ["celsius * 9 / 5 + 32", "The standard formula. Multiplication and division happen before the addition."]
    ],
    out: "=== Unit Converter ===\nDistance in kilometres: 10\n10.0 km is 6.21 miles\n\nTemperature in Celsius: 37\n37.0 °C is 98.6 °F",
    stretch: ["Add kilograms to pounds (1 kg = 2.20462 lb).", "Go back to yesterday's tip splitter and make it ask for its three values."]
  },
  tests: ["0 °C should give 32 °F and 100 °C should give 212 °F.", "-40 °C should give -40 °F.", "Type <code>ten</code> for the distance and read the ValueError."]
};

L[5] = {
  intro: "Programs make decisions by asking yes-or-no questions. Today you meet <code>bool</code> values and comparison operators.",
  lesson: [
    {h: "True and False",
     p: "<code>bool</code> has exactly two values: <code>True</code> and <code>False</code>, with capital letters. They are what comparisons produce.",
     code: R`is_raining = False
print(type(is_raining))`,
     out: "<class 'bool'>"},
    {h: "Comparison operators",
     p: "<code>==</code> equal, <code>!=</code> not equal, <code>&lt;</code> <code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code>. Each comparison gives a bool. Don't confuse <code>=</code> (assign) with <code>==</code> (compare).",
     code: R`age = 20
print(age >= 18)     # True
print(age == 21)     # False
print(age != 21)     # True
print("cat" == "Cat")  # False, case matters`},
    {h: "== versus is",
     p: "<code>==</code> asks \"do these have the same value?\". <code>is</code> asks \"are these the very same object in memory?\". For everyday comparisons always use <code>==</code>. The one common use of <code>is</code> is checking <code>x is None</code>, which you'll meet later."},
    {h: "Truthiness",
     p: "Any value can be treated as true or false. Empty things and zero are <b>falsy</b>: <code>0</code>, <code>0.0</code>, <code>\"\"</code>, and later empty lists. Everything else is <b>truthy</b>. <code>bool()</code> shows you which.",
     code: R`print(bool(0), bool(5))
print(bool(""), bool("hi"))`,
     out: "False True\nFalse True"}
  ],
  exercises: [
    {q: "Ask for a number and print whether it is greater than 100.", sol: R`n = float(input("Number: "))
print("Greater than 100:", n > 100)`},
    {q: "Ask for a password and print whether it equals <code>\"python123\"</code>.", sol: R`pw = input("Password: ")
print("Correct:", pw == "python123")`},
    {q: "Predict each result, then check: <code>bool(\" \")</code>, <code>10 / 2 == 5</code>, <code>\"10\" == 10</code>.", sol: R`print(bool(" "))   # True, a space is not empty
print(10 / 2 == 5)  # True, 5.0 equals 5
print("10" == 10)   # False, a str never equals an int`}
  ],
  project: {
    title: "Eligibility checker",
    brief: "Ask for someone's age and height, then print a list of yes/no answers about what they can do. Tomorrow you'll use these same comparisons to make the program choose what to say.",
    file: "day05_eligibility.py",
    code: R`# day05_eligibility.py
# Answers yes/no questions about a person using comparisons.

name = input("Name: ")
age = int(input("Age: "))
height_cm = int(input("Height in cm: "))

can_vote = age >= 18
is_teen = age >= 13
tall_enough = height_cm >= 140   # rule for a theme-park ride
is_senior = age >= 65

print()
print("Results for", name)
print("Can vote:              ", can_vote)
print("Is at least 13:        ", is_teen)
print("Can ride the coaster:  ", tall_enough)
print("Gets a senior discount:", is_senior)`,
    explain: [
      ["can_vote = age >= 18", "The comparison runs first and produces <code>True</code> or <code>False</code>, which is then stored in <code>can_vote</code>."],
      ["print(\"Can vote:\", can_vote)", "Bools print as the words <code>True</code> and <code>False</code>."]
    ],
    out: "Results for Amina\nCan vote:               True\nIs at least 13:         True\nCan ride the coaster:   True\nGets a senior discount: False",
    stretch: ["Add a check for whether the person can get a driving licence where you live.", "Ask for a second person's age and print whether they are older than the first."]
  },
  tests: ["Try exactly 18. Should <code>can_vote</code> be True? Check whether <code>&gt;=</code> or <code>&gt;</code> is right.", "Try 0 and 120.", "Check every label lines up."]
};

L[6] = {
  intro: "With <code>if</code> statements your program finally chooses what to do. You also meet Python's most distinctive rule: indentation is part of the syntax.",
  lesson: [
    {h: "if",
     p: "An <code>if</code> line ends with a colon. The lines underneath that belong to it are <b>indented</b> by 4 spaces. Python uses indentation instead of the curly braces other languages use. If the condition is True, the indented block runs.",
     code: R`temperature = 31
if temperature > 30:
    print("It's hot!")
    print("Drink water.")
print("This always runs.")`},
    {h: "else and elif",
     p: "<code>else</code> runs when the <code>if</code> was False. <code>elif</code> (short for \"else if\") adds more conditions. Python checks from the top and runs <b>only the first</b> branch that is True.",
     code: R`score = 72
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"
print("Grade:", grade)`,
     out: "Grade: C"},
    {h: "Why order matters",
     p: "If you wrote <code>score >= 70</code> first, a score of 95 would get a C because that branch is True and the checking stops. Put the most specific or highest condition first."},
    {h: "Nesting",
     p: "An <code>if</code> can sit inside another. Each level indents 4 more spaces. Keep nesting shallow; on Day 7 you'll learn <code>and</code>/<code>or</code>, which often removes the need for it.",
     code: R`has_ticket = True
age = 15
if has_ticket:
    if age >= 18:
        print("Enjoy the film")
    else:
        print("You need an adult with you")
else:
    print("Buy a ticket first")`}
  ],
  exercises: [
    {q: "Ask for a number and print whether it is positive, negative, or zero.", sol: R`n = float(input("Number: "))
if n > 0:
    print("Positive")
elif n < 0:
    print("Negative")
else:
    print("Zero")`},
    {q: "Ask for a number and print \"even\" or \"odd\".", hint: "Use <code>%</code> from Day 3.", sol: R`n = int(input("Number: "))
if n % 2 == 0:
    print("even")
else:
    print("odd")`},
    {q: "This code has a bug. Find it without running it: <code>if x > 5</code> on one line and <code>print(\"big\")</code> on the next, not indented.", sol: R`# Two problems: the colon is missing, and the body is not indented.
if x > 5:
    print("big")`}
  ],
  project: {
    title: "BMI calculator",
    brief: "Ask for weight and height, calculate body-mass index, and print the category. BMI = weight (kg) ÷ height (m)². Categories: under 18.5 underweight, under 25 normal, under 30 overweight, 30 and above obese.",
    file: "day06_bmi.py",
    code: R`# day06_bmi.py
# Calculates body-mass index and reports its category.

weight = float(input("Weight in kg: "))
height_cm = float(input("Height in cm: "))

height_m = height_cm / 100
bmi = weight / height_m ** 2

if bmi < 18.5:
    category = "underweight"
elif bmi < 25:
    category = "a healthy weight"
elif bmi < 30:
    category = "overweight"
else:
    category = "obese"

print("Your BMI is", round(bmi, 1))
print("That is classed as", category + ".")`,
    explain: [
      ["height_m ** 2", "<code>**</code> runs before <code>/</code>, so the height is squared first, which is what the formula needs."],
      ["elif bmi < 25:", "We only reach this if <code>bmi &lt; 18.5</code> was False, so here we already know the BMI is at least 18.5. No need to write <code>18.5 &lt;= bmi</code>."],
      ["category = ...", "Each branch stores a word, and one print at the end uses it. That's tidier than four separate print calls."]
    ],
    out: "Weight in kg: 70\nHeight in cm: 175\nYour BMI is 22.9\nThat is classed as a healthy weight.",
    stretch: ["Tell the user the healthy weight range for their height.", "Ask whether they want metric or imperial units."]
  },
  tests: ["Test each boundary: a BMI of exactly 18.5, 25 and 30. Which category should each get?", "Try a height of 0 and read the error.", "Indent one line wrongly and read the IndentationError."]
};

L[7] = {
  intro: "Real decisions often depend on several conditions at once. Today you combine conditions with <code>and</code>, <code>or</code> and <code>not</code>.",
  lesson: [
    {h: "and, or, not",
     p: "<code>a and b</code> is True only if both are True. <code>a or b</code> is True if at least one is. <code>not a</code> flips True and False. Python uses these English words instead of symbols like <code>&amp;&amp;</code> and <code>||</code>.",
     code: R`age = 25
has_id = True
print(age >= 18 and has_id)   # True
print(age < 13 or age > 65)   # False
print(not has_id)             # False`},
    {h: "Chained comparisons",
     p: "Python lets you write a range check the way you would in maths. <code>13 &lt;= age &lt;= 19</code> means <code>13 &lt;= age and age &lt;= 19</code>.",
     code: R`age = 16
if 13 <= age <= 19:
    print("Teenager")`},
    {h: "Short-circuiting",
     p: "Python stops as soon as it knows the answer. In <code>a and b</code>, if <code>a</code> is False then <code>b</code> is never checked. That lets you guard risky checks: <code>count != 0 and total / count > 5</code> never divides by zero."},
    {h: "Use parentheses when mixing",
     p: "<code>not</code> runs first, then <code>and</code>, then <code>or</code>. When you mix <code>and</code> with <code>or</code>, add parentheses so nobody (including you) has to remember that."}
  ],
  exercises: [
    {q: "Ask for a username and password. Print \"Welcome\" only if the username is <code>admin</code> and the password is <code>1234</code>.", sol: R`user = input("Username: ")
pw = input("Password: ")
if user == "admin" and pw == "1234":
    print("Welcome")
else:
    print("Access denied")`},
    {q: "Ask what day it is. Print \"Weekend!\" if it is Saturday or Sunday.", sol: R`day = input("Day: ")
if day == "Saturday" or day == "Sunday":
    print("Weekend!")
else:
    print("Weekday")`},
    {q: "Ask for a number and say whether it is between 1 and 10 inclusive, using a chained comparison.", sol: R`n = int(input("Number: "))
if 1 <= n <= 10:
    print("In range")
else:
    print("Out of range")`}
  ],
  project: {
    title: "Leap-year and grade checker",
    brief: "Two small programs in one file. First, decide if a year is a leap year: divisible by 4, except century years, which must be divisible by 400. Then turn a score from 0 to 100 into a letter grade, rejecting impossible scores.",
    file: "day07_checks.py",
    code: R`# day07_checks.py
# Part 1: leap years. Part 2: letter grades.

year = int(input("Enter a year: "))

if (year % 4 == 0 and year % 100 != 0) or year % 400 == 0:
    print(year, "is a leap year.")
else:
    print(year, "is not a leap year.")

print()

score = int(input("Enter a score (0-100): "))

if score < 0 or score > 100:
    print("That score is not possible.")
elif score >= 90:
    print("Grade A")
elif score >= 80:
    print("Grade B")
elif score >= 70:
    print("Grade C")
elif score >= 60:
    print("Grade D")
else:
    print("Grade F")`,
    explain: [
      ["(year % 4 == 0 and year % 100 != 0)", "Divisible by 4 but not a century year. The parentheses make it obvious this pair goes together."],
      ["or year % 400 == 0", "Century years like 2000 still count if divisible by 400. 1900 fails both parts, so it's not a leap year."],
      ["if score < 0 or score > 100:", "Checking for bad input first is called a <b>guard</b>. The grade branches below can then trust the score."]
    ],
    out: "Enter a year: 2024\n2024 is a leap year.\n\nEnter a score (0-100): 85\nGrade B",
    stretch: ["Rewrite the score guard using <code>not (0 &lt;= score &lt;= 100)</code>.", "Add + and - grades, like B+ for 87 to 89."]
  },
  tests: ["Years: 2024 (yes), 2023 (no), 1900 (no), 2000 (yes).", "Scores: -5, 0, 59, 60, 100, 101.", "Remove the parentheses in the leap-year line. Does it still give the same results? Think about why."]
};

L[8] = {
  intro: "No new syntax today. You combine everything so far into a complete program, and learn to plan a program before writing it.",
  lesson: [
    {h: "Plan before you code",
     p: "Write the steps in plain words first, as comments. For a calculator: 1) show the options, 2) read two numbers, 3) read the choice, 4) do the matching calculation, 5) print the answer. Then fill in the code under each comment. This habit matters more than any syntax."},
    {h: "Menus",
     p: "A menu prints numbered options and reads the user's choice as a string. Comparing with strings like <code>\"1\"</code> avoids converting the choice and avoids a crash if the user types a letter.",
     code: R`print("1) Add")
print("2) Subtract")
choice = input("Choose 1 or 2: ")
if choice == "1":
    print("You chose add")`},
    {h: "Validating input",
     p: "Check for bad situations before they cause errors. Dividing by zero raises <code>ZeroDivisionError</code>, so check the divisor first. An unknown menu choice should get a helpful message, not silence."}
  ],
  exercises: [
    {q: "Write only the plan (as comments) for a program that converts a number of seconds into hours, minutes and seconds.", sol: R`# 1. ask for total seconds and convert to int
# 2. hours = seconds // 3600
# 3. remaining = seconds % 3600
# 4. minutes = remaining // 60, secs = remaining % 60
# 5. print all three`},
    {q: "Now write the code under each comment.", sol: R`total = int(input("Seconds: "))
hours = total // 3600
remaining = total % 3600
minutes = remaining // 60
secs = remaining % 60
print(hours, "h", minutes, "m", secs, "s")`}
  ],
  project: {
    title: "Four-function calculator",
    brief: "Ask for two numbers and an operation, then print the result. Handle division by zero and unknown operations with clear messages.",
    file: "day08_calculator.py",
    code: R`# day08_calculator.py
# A calculator for +, -, * and /.

print("=== Calculator ===")

# 1. read the numbers
a = float(input("First number: "))
b = float(input("Second number: "))

# 2. show the menu and read the choice
print("Choose an operation:")
print("  +  add")
print("  -  subtract")
print("  *  multiply")
print("  /  divide")
op = input("Operation: ")

# 3. calculate
if op == "+":
    print(a, "+", b, "=", a + b)
elif op == "-":
    print(a, "-", b, "=", a - b)
elif op == "*":
    print(a, "*", b, "=", a * b)
elif op == "/":
    if b == 0:
        print("You can't divide by zero.")
    else:
        print(a, "/", b, "=", round(a / b, 4))
else:
    print("Unknown operation:", op)`,
    explain: [
      ["# 1. read the numbers", "The plan stays in the code as comments, so the structure is easy to follow."],
      ["if b == 0:", "A nested check inside the division branch. We only divide when it's safe."],
      ["else: print(\"Unknown operation:\", op)", "The final <code>else</code> catches anything the user typed that isn't one of the four symbols."]
    ],
    out: "First number: 12\nSecond number: 4\nOperation: /\n12.0 / 4.0 = 3.0",
    stretch: ["Add <code>**</code> for power and <code>%</code> for remainder.", "Show results without <code>.0</code> when the answer is a whole number. Hint: <code>result == int(result)</code>."]
  },
  tests: ["Try every operation once.", "Divide by 0.", "Type <code>x</code> as the operation.", "Use negative and decimal numbers."]
};

L[9] = {
  intro: "Loops repeat code. Today you learn <code>while</code>, which repeats as long as a condition is True, and you use the <code>random</code> module for the first time.",
  lesson: [
    {h: "while",
     p: "A <code>while</code> loop checks its condition, runs its block, then checks again. Something inside the loop must eventually make the condition False, or it runs forever.",
     code: R`count = 1
while count <= 3:
    print("Count:", count)
    count += 1
print("Done")`,
     out: "Count: 1\nCount: 2\nCount: 3\nDone"},
    {h: "Infinite loops and Ctrl+C",
     p: "If you forget <code>count += 1</code>, the loop never ends. Press <b>Ctrl+C</b> in the terminal to stop a running program. Every programmer does this regularly."},
    {h: "break and continue",
     p: "<code>break</code> leaves the loop immediately. <code>continue</code> skips the rest of this round and goes back to the condition. <code>while True:</code> with a <code>break</code> inside is a common pattern for \"keep asking until the user gets it right\".",
     code: R`while True:
    answer = input("Type yes to stop: ")
    if answer == "yes":
        break
    print("Still going...")
print("Stopped")`},
    {h: "Importing random",
     p: "Python ships with a <b>standard library</b> of modules. <code>import random</code> loads one, and then <code>random.randint(1, 10)</code> gives a random int from 1 to 10, <b>including both ends</b>. The dot means \"the <code>randint</code> inside <code>random</code>\".",
     code: R`import random
print(random.randint(1, 6))   # like rolling a die`}
  ],
  exercises: [
    {q: "Print the numbers 10 down to 1, then \"Liftoff!\", using a while loop.", sol: R`n = 10
while n >= 1:
    print(n)
    n -= 1
print("Liftoff!")`},
    {q: "Keep asking for numbers and adding them up until the user enters 0. Then print the total.", sol: R`total = 0
while True:
    n = float(input("Number (0 to stop): "))
    if n == 0:
        break
    total += n
print("Total:", total)`},
    {q: "Roll a die (1 to 6) repeatedly until you get a 6. Print each roll and how many rolls it took.", sol: R`import random
rolls = 0
while True:
    roll = random.randint(1, 6)
    rolls += 1
    print("Rolled", roll)
    if roll == 6:
        break
print("Took", rolls, "rolls")`}
  ],
  project: {
    title: "Number-guessing game",
    brief: "The computer picks a number from 1 to 100. The player guesses until correct, getting \"too high\" or \"too low\" hints each time. At the end, show how many guesses it took.",
    file: "day09_guessing_game.py",
    code: R`# day09_guessing_game.py
# Guess the secret number with higher/lower hints.

import random

secret = random.randint(1, 100)
attempts = 0

print("I'm thinking of a number between 1 and 100.")

while True:
    guess = int(input("Your guess: "))
    attempts += 1

    if guess < secret:
        print("Too low.")
    elif guess > secret:
        print("Too high.")
    else:
        print("Correct! It was", secret)
        break

print("You got it in", attempts, "attempts.")
if attempts <= 7:
    print("Excellent strategy!")`,
    explain: [
      ["import random", "Imports go at the top of the file so readers see what the program depends on."],
      ["while True:", "The loop has no natural end condition; the <code>break</code> in the correct-guess branch ends it."],
      ["attempts += 1", "Counted straight after reading the guess, so every guess is counted, including the correct one."],
      ["if attempts <= 7:", "With halving (guess 50, then 25 or 75...) you can always win in 7 guesses. That's the binary search you'll study on Day 36."]
    ],
    out: "I'm thinking of a number between 1 and 100.\nYour guess: 50\nToo low.\nYour guess: 75\nToo high.\nYour guess: 62\nCorrect! It was 62\nYou got it in 3 attempts.\nExcellent strategy!",
    stretch: ["Limit the player to 10 guesses and reveal the number if they run out.", "Ask \"Play again?\" at the end and wrap the whole game in another loop."]
  },
  tests: ["To test quickly, temporarily add <code>print(secret)</code> after picking it. Remove it before publishing.", "Guess the right number first time; it should say 1 attempt.", "Type a word instead of a number and note the error for Day 31."]
};

L[10] = {
  intro: "<code>for</code> loops go through a sequence one item at a time. Today you use them with <code>range()</code> and with strings.",
  lesson: [
    {h: "for and range()",
     p: "<code>range(5)</code> produces 0, 1, 2, 3, 4: it starts at 0 and <b>stops before</b> 5. <code>range(1, 6)</code> gives 1 to 5. <code>range(0, 20, 5)</code> counts in steps of 5. The loop variable takes each value in turn.",
     code: R`for i in range(1, 4):
    print("Round", i)

for n in range(10, 0, -3):
    print(n)`,
     out: "Round 1\nRound 2\nRound 3\n10\n7\n4\n1"},
    {h: "Looping over a string",
     p: "Python's <code>for</code> loops over the <b>items</b> of something, not just numbers. A string is a sequence of characters, so you can loop over it directly. This is what \"thinking in Python\" means: loop over the thing itself, not over index numbers.",
     code: R`for letter in "Python":
    print(letter)`},
    {h: "for or while?",
     p: "Use <code>for</code> when you know what you're looping over (a range, a string, a list). Use <code>while</code> when you loop until something happens, like a correct guess."},
    {h: "Nested loops and print(end=)",
     p: "A loop inside a loop runs the inner loop fully for each outer step. <code>print(x, end=\" \")</code> ends with a space instead of a new line, so several prints share one line.",
     code: R`for row in range(1, 4):
    for col in range(1, 4):
        print(row * col, end=" ")
    print()   # new line after each row`,
     out: "1 2 3 \n2 4 6 \n3 6 9 "}
  ],
  exercises: [
    {q: "Print the sum of all numbers from 1 to 100.", sol: R`total = 0
for n in range(1, 101):
    total += n
print(total)   # 5050`},
    {q: "Count the vowels in a word the user types.", sol: R`word = input("Word: ")
vowels = 0
for ch in word:
    if ch in "aeiouAEIOU":
        vowels += 1
print("Vowels:", vowels)`},
    {q: "Print a triangle of stars with 5 rows (1 star, then 2, up to 5).", hint: "<code>\"*\" * 3</code> gives <code>***</code>.", sol: R`for i in range(1, 6):
    print("*" * i)`}
  ],
  project: {
    title: "Multiplication table generator",
    brief: "Ask the user for a number and a size, print that number's times table, then print a full grid of tables from 1 up to the size with the columns lined up.",
    file: "day10_times_tables.py",
    code: R`# day10_times_tables.py
# Prints a single times table and then a full grid.

number = int(input("Which times table? "))
size = int(input("Up to what? "))

print()
print("The", number, "times table:")
for i in range(1, size + 1):
    print(number, "x", i, "=", number * i)

print()
print("Full grid up to", size)
for row in range(1, size + 1):
    line = ""
    for col in range(1, size + 1):
        cell = str(row * col)
        line += cell.rjust(4)   # pad on the left to width 4
    print(line)`,
    explain: [
      ["range(1, size + 1)", "We add 1 because <code>range</code> stops before its end value. Without it, a size of 10 would stop at 9."],
      ["line = \"\"", "Starts each row as an empty string. The inner loop adds one cell at a time."],
      ["cell.rjust(4)", "A string method that pads the text with spaces on the left until it's 4 characters wide, so the columns line up. You'll learn more string methods on Day 15."]
    ],
    out: "The 7 times table:\n7 x 1 = 7\n7 x 2 = 14\n...\nFull grid up to 5\n   1   2   3   4   5\n   2   4   6   8  10\n   3   6   9  12  15\n   4   8  12  16  20\n   5  10  15  20  25",
    stretch: ["Add a header row and a header column to the grid.", "Only print the even results in the single table."]
  },
  tests: ["Size 1 should print a single row.", "Size 12: do the columns still line up? What width would work for 3-digit numbers?", "Change <code>size + 1</code> to <code>size</code> and see the off-by-one bug."]
};

L[11] = {
  intro: "Errors are messages, not failures. Today you learn to read a traceback, recognise the common errors, and debug methodically.",
  lesson: [
    {h: "Reading a traceback",
     p: "When Python crashes it prints a <b>traceback</b>. Read it <b>from the bottom up</b>. The last line names the error type and gives a message. The line above shows the file, the line number, and the code that failed.",
     code: R`Traceback (most recent call last):
  File "/home/abdy/day11.py", line 3, in <module>
    total = price * qty
NameError: name 'qty' is not defined`},
    {h: "The errors you'll see most",
     p: "<b>SyntaxError</b>: not valid Python, such as a missing colon or quote. <b>IndentationError</b>: inconsistent spacing. <b>NameError</b>: a name that doesn't exist, often a typo. <b>TypeError</b>: an operation on the wrong type, like <code>\"a\" + 1</code>. <b>ValueError</b>: the right type but a bad value, like <code>int(\"abc\")</code>. <b>ZeroDivisionError</b>: dividing by zero."},
    {h: "Logic errors",
     p: "The hardest bugs produce no error at all: the program runs and gives the wrong answer. To find them, <b>print the values</b> at key points and compare them with what you expected.",
     code: R`average = 10 + 20 / 2          # expected 15
print("DEBUG average =", average)  # shows 20.0, so precedence is the bug
average = (10 + 20) / 2`},
    {h: "A debugging routine",
     p: "1) Read the whole error message. 2) Go to the line it names, and also look at the line above. 3) Say what you expected versus what happened. 4) Change one thing at a time and rerun. 5) If you're stuck, print variables. Pasting the last line of the error into a search engine is also a normal, professional move."}
  ],
  exercises: [
    {q: "Name the error each line will cause: a) <code>print(\"hi)</code> b) <code>print(Name)</code> when only <code>name</code> exists c) <code>\"5\" + 5</code> d) <code>int(\"5.5\")</code>", sol: R`# a) SyntaxError: unterminated string
# b) NameError: names are case-sensitive
# c) TypeError: can't add str and int
# d) ValueError: "5.5" isn't a valid int`},
    {q: "This should print the average of 4, 8 and 9 (7.0) but prints 15.0. Fix it: <code>print(4 + 8 + 9 / 3)</code>", sol: R`print((4 + 8 + 9) / 3)   # 7.0`}
  ],
  project: {
    title: "Bug hunt",
    brief: "Below are ten broken programs. Copy the broken version into <code>day11_bugs.py</code>, run it, read the error, and fix it. Do them one at a time. The solution shows the fixed versions with what was wrong; only open it after trying.",
    file: "day11_bugs.py",
    starter: R`# 1
print("Welcome to the bug hunt)

# 2
name = "Abdy"
print("Hello " + nmae)

# 3
age = input("Age: ")
print("Next year you will be", age + 1)

# 4
if 5 > 3
    print("five is bigger")

# 5
for i in range(3):
print(i)

# 6
count = 0
while count < 3:
    print(count)
# (runs forever: press Ctrl+C)

# 7
price = 10
print("Price: " + price)

# 8
total = 100
people = 0
print(total / people)

# 9  (no error, wrong answer: should print 1 to 5)
for i in range(1, 5):
    print(i)

# 10 (no error, wrong answer: 90 should be an A)
score = 90
if score >= 50:
    print("Pass")
elif score >= 90:
    print("A")`,
    code: R`# 1  SyntaxError: the closing quote was missing
print("Welcome to the bug hunt")

# 2  NameError: typo in the variable name
name = "Abdy"
print("Hello " + name)

# 3  TypeError: input() returns a str
age = int(input("Age: "))
print("Next year you will be", age + 1)

# 4  SyntaxError: missing colon
if 5 > 3:
    print("five is bigger")

# 5  IndentationError: the loop body must be indented
for i in range(3):
    print(i)

# 6  Infinite loop: count never changed
count = 0
while count < 3:
    print(count)
    count += 1

# 7  TypeError: convert the number to a str, or use a comma
price = 10
print("Price: " + str(price))

# 8  ZeroDivisionError: guard against zero
total = 100
people = 0
if people > 0:
    print(total / people)
else:
    print("No people to split between")

# 9  Off-by-one: range stops before its end value
for i in range(1, 6):
    print(i)

# 10 Logic error: most specific condition first
score = 90
if score >= 90:
    print("A")
elif score >= 50:
    print("Pass")`,
    explain: [
      ["Bugs 1 to 8", "Each one produces a traceback. The last line of each traceback told you exactly what kind of problem it was."],
      ["Bugs 9 and 10", "Logic errors. Python can't detect these; only testing against expected results catches them."]
    ],
    stretch: ["Write three new buggy programs for a friend to fix, or swap with me and I'll fix yours.", "Keep a file called <code>my_errors.md</code> and note each new error you meet in the coming days."]
  },
  tests: ["Each fixed program runs without a traceback.", "Bugs 9 and 10 now print the expected result.", "For each bug, you can explain in one sentence what the error message meant."]
};

L[12] = {
  intro: "A list holds many values in order under one name. It's the most-used data structure in Python.",
  lesson: [
    {h: "Creating lists and indexing",
     p: "Write a list with square brackets and commas. Items can be any type. Indexing starts at <b>0</b>. Negative indexes count from the end, so <code>[-1]</code> is the last item. <code>len()</code> gives the length.",
     code: R`fruits = ["apple", "banana", "mango"]
print(fruits[0])     # apple
print(fruits[-1])    # mango
print(len(fruits))   # 3`},
    {h: "Lists can change",
     p: "Lists are <b>mutable</b>: you can change them after creating them. <code>append(x)</code> adds to the end, <code>insert(i, x)</code> adds at a position, <code>remove(x)</code> deletes the first matching value, <code>pop(i)</code> removes and returns the item at index <code>i</code>, and <code>lst[i] = x</code> replaces one.",
     code: R`fruits.append("orange")
fruits.insert(0, "kiwi")
fruits.remove("banana")
last = fruits.pop()       # removes "orange"
fruits[0] = "lemon"
print(fruits, last)`,
     out: "['lemon', 'apple', 'mango'] orange"},
    {h: "Checking membership",
     p: "<code>x in my_list</code> is True if the value is in the list. Use it before <code>remove()</code>, which raises a ValueError if the item isn't there.",
     code: R`if "apple" in fruits:
    fruits.remove("apple")`},
    {h: "Looping over a list",
     p: "Loop over items directly, just like strings. An empty list is falsy, so <code>if not tasks:</code> means \"if there are no tasks\".",
     code: R`for fruit in fruits:
    print("I like", fruit)`}
  ],
  exercises: [
    {q: "Make a list of 5 numbers. Print the first, the last, and the length.", sol: R`nums = [4, 8, 15, 16, 23]
print(nums[0], nums[-1], len(nums))`},
    {q: "Start with an empty list. Ask for 3 names and append each one. Print the list.", sol: R`names = []
for i in range(3):
    names.append(input("Name: "))
print(names)`},
    {q: "Given <code>scores = [55, 90, 72]</code>, loop through and print only the scores of 70 or more.", sol: R`scores = [55, 90, 72]
for s in scores:
    if s >= 70:
        print(s)`}
  ],
  project: {
    title: "To-do list",
    brief: "A menu-driven to-do list that lets the user view, add and remove tasks until they quit. Tasks live in a list while the program runs; on Day 32 you'll save them to a file.",
    file: "day12_todo.py",
    code: R`# day12_todo.py
# A to-do list that lives in memory while the program runs.

tasks = []

while True:
    print()
    print("1) View tasks  2) Add task  3) Remove task  4) Quit")
    choice = input("Choose: ")

    if choice == "1":
        if not tasks:
            print("Nothing to do!")
        else:
            number = 1
            for task in tasks:
                print(number, "-", task)
                number += 1

    elif choice == "2":
        task = input("New task: ")
        tasks.append(task)
        print("Added.")

    elif choice == "3":
        number = int(input("Task number to remove: "))
        if 1 <= number <= len(tasks):
            removed = tasks.pop(number - 1)
            print("Removed:", removed)
        else:
            print("No task with that number.")

    elif choice == "4":
        print("Goodbye!")
        break

    else:
        print("Please choose 1 to 4.")`,
    explain: [
      ["tasks = []", "An empty list, created once before the loop so it keeps its contents between menu choices."],
      ["if not tasks:", "An empty list is falsy, so this reads as \"if there are no tasks\"."],
      ["tasks.pop(number - 1)", "Users count from 1 but Python counts from 0, so we subtract 1. <code>pop</code> returns the removed task so we can show it."],
      ["1 <= number <= len(tasks)", "A guard so a bad number gives a message instead of an IndexError."]
    ],
    stretch: ["Add an option to mark a task as done by adding \"✓ \" to the start of its text.", "On Day 25 you'll learn <code>enumerate()</code>, which replaces the manual <code>number</code> counter."]
  },
  tests: ["View the list when it is empty.", "Add three tasks, remove the middle one, and check the numbering.", "Try to remove task 0 and task 99.", "Type a letter in the menu."]
};

L[13] = {
  intro: "Today you take parts of lists with slicing, sort them, and use built-in functions to summarise numbers.",
  lesson: [
    {h: "Slicing",
     p: "<code>lst[start:stop]</code> gives a new list from <code>start</code> up to but not including <code>stop</code>. Leave a side blank to mean \"from the beginning\" or \"to the end\". A third number is the step. Slicing works on strings too.",
     code: R`nums = [10, 20, 30, 40, 50]
print(nums[1:3])    # [20, 30]
print(nums[:2])     # [10, 20]
print(nums[-2:])    # [40, 50]
print(nums[::2])    # [10, 30, 50]
print(nums[::-1])   # reversed copy
print("Python"[0:3])  # Pyt`},
    {h: "sort() versus sorted()",
     p: "<code>lst.sort()</code> sorts the list <b>in place</b> and returns <code>None</code>. <code>sorted(lst)</code> returns a <b>new</b> sorted list and leaves the original alone. Add <code>reverse=True</code> for descending order. A classic bug is <code>lst = lst.sort()</code>, which sets the list to <code>None</code>.",
     code: R`marks = [72, 95, 58]
ranked = sorted(marks, reverse=True)
print(marks, ranked)
marks.sort()
print(marks)`,
     out: "[72, 95, 58] [95, 72, 58]\n[58, 72, 95]"},
    {h: "Summary functions",
     p: "<code>min()</code>, <code>max()</code>, <code>sum()</code> and <code>len()</code> work on any list of numbers. The average is <code>sum(lst) / len(lst)</code>. <code>lst.count(x)</code> counts how often a value appears and <code>lst.index(x)</code> finds its position."}
  ],
  exercises: [
    {q: "Given <code>days = [\"Mon\",\"Tue\",\"Wed\",\"Thu\",\"Fri\",\"Sat\",\"Sun\"]</code>, slice out the weekdays and the weekend.", sol: R`weekdays = days[:5]
weekend = days[5:]`},
    {q: "Check if a word is a palindrome (same backwards) using slicing.", sol: R`word = input("Word: ").lower()
print(word == word[::-1])`},
    {q: "Given <code>temps = [22, 25, 19, 30, 28]</code>, print the hottest, coldest and average.", sol: R`temps = [22, 25, 19, 30, 28]
print(max(temps), min(temps), sum(temps) / len(temps))`}
  ],
  project: {
    title: "Grade-book statistics",
    brief: "Let a teacher enter scores until they type <code>done</code>, then print the count, highest, lowest, average, the top three, and how many passed.",
    file: "day13_gradebook.py",
    code: R`# day13_gradebook.py
# Collects scores, then prints statistics about them.

scores = []

print("Enter scores one at a time. Type 'done' to finish.")
while True:
    entry = input("Score: ")
    if entry == "done":
        break
    scores.append(float(entry))

if not scores:
    print("No scores entered.")
else:
    ranked = sorted(scores, reverse=True)
    average = sum(scores) / len(scores)

    passed = 0
    for s in scores:
        if s >= 50:
            passed += 1

    print()
    print("Students:", len(scores))
    print("Highest: ", max(scores))
    print("Lowest:  ", min(scores))
    print("Average: ", round(average, 1))
    print("Top 3:   ", ranked[:3])
    print("Passed:  ", passed, "of", len(scores))`,
    explain: [
      ["if entry == \"done\": break", "We check for the word before converting, because <code>float(\"done\")</code> would crash."],
      ["if not scores:", "Without this guard, <code>sum(scores) / len(scores)</code> would divide by zero when nothing was entered."],
      ["ranked[:3]", "A slice of the first three. If there are fewer than three scores, slicing simply returns what exists, with no error."],
      ["sorted(scores, reverse=True)", "A new list, so <code>scores</code> keeps the original entry order."]
    ],
    out: "Score: 67\nScore: 88\nScore: 45\nScore: done\n\nStudents: 3\nHighest:  88.0\nLowest:   45.0\nAverage:  66.7\nTop 3:    [88.0, 67.0, 45.0]\nPassed:   2 of 3",
    stretch: ["Print the median: the middle value of the sorted list.", "Reject scores outside 0 to 100."]
  },
  tests: ["Type <code>done</code> immediately.", "Enter a single score.", "Enter two scores; the top 3 shows just two.", "Check the average by hand for one run."]
};

L[14] = {
  intro: "Tuples are like lists that can't change. Today you learn when to use them and how unpacking makes code cleaner.",
  lesson: [
    {h: "Tuples",
     p: "Write a tuple with parentheses. Index and slice it like a list, but you can't append, remove or change items: it's <b>immutable</b>. A one-item tuple needs a trailing comma: <code>(5,)</code>.",
     code: R`point = (3, 4)
print(point[0])
colours = ("red", "green", "blue")
# colours[0] = "pink"  -> TypeError`},
    {h: "When to use which",
     p: "Use a <b>list</b> for a collection of similar things that grows or shrinks, like tasks. Use a <b>tuple</b> for a fixed group where each position has a meaning, like (x, y) or (name, price), or for values that must not change by accident."},
    {h: "Unpacking",
     p: "You can assign a tuple's items to several names in one line. The number of names must match. This makes swapping two variables a one-liner.",
     code: R`x, y = (3, 4)
name, price = ("Tea", 1.5)
a, b = 1, 2
a, b = b, a      # swap
print(a, b)`,
     out: "2 1"},
    {h: "Unpacking in loops, and random.choice",
     p: "Looping over a list of tuples lets you unpack each one in the <code>for</code> line. <code>random.choice(seq)</code> picks a random item from a list or tuple.",
     code: R`import random
items = [("Tea", 1.5), ("Cake", 3.0)]
for name, price in items:
    print(name, "costs", price)
print(random.choice(("heads", "tails")))`}
  ],
  exercises: [
    {q: "Store your date of birth as a tuple (day, month, year) and unpack it into three variables.", sol: R`dob = (14, 3, 2001)
day, month, year = dob
print(day, month, year)`},
    {q: "Swap two variables without a temporary variable.", sol: R`a = "left"
b = "right"
a, b = b, a`},
    {q: "Simulate 10 coin flips with <code>random.choice</code> and count the heads.", sol: R`import random
heads = 0
for i in range(10):
    if random.choice(("heads", "tails")) == "heads":
        heads += 1
print("Heads:", heads)`}
  ],
  project: {
    title: "Rock, paper, scissors",
    brief: "Play best-of-five against the computer. The valid moves and the winning pairs are stored as tuples, which makes the rules data rather than a long chain of <code>if</code> statements.",
    file: "day14_rps.py",
    code: R`# day14_rps.py
# Rock, paper, scissors: first to 3 wins.

import random

MOVES = ("rock", "paper", "scissors")
# Each pair is (winner, loser).
WINS = (("rock", "scissors"), ("scissors", "paper"), ("paper", "rock"))

player_score, computer_score = 0, 0

while player_score < 3 and computer_score < 3:
    player = input("rock, paper or scissors? ").lower()
    if player not in MOVES:
        print("That's not a valid move.")
        continue

    computer = random.choice(MOVES)
    print("Computer chose", computer)

    if player == computer:
        print("Draw.")
    elif (player, computer) in WINS:
        print("You win this round!")
        player_score += 1
    else:
        print("Computer wins this round.")
        computer_score += 1

    print("Score:", player_score, "-", computer_score)
    print()

if player_score == 3:
    print("You won the match!")
else:
    print("The computer won the match.")`,
    explain: [
      ["MOVES = (...)", "A tuple because the moves never change. Capital letters mark it as a constant."],
      ["WINS = ((\"rock\", \"scissors\"), ...)", "A tuple of tuples. Each inner pair means \"the first beats the second\"."],
      ["(player, computer) in WINS", "Builds a pair from this round's moves and checks whether it appears in WINS. One line replaces six <code>if</code> checks."],
      ["continue", "Skips the rest of the round for invalid input and goes back to the loop condition, without changing scores."],
      [".lower()", "A string method (more on Day 15) so \"Rock\" and \"ROCK\" also work."]
    ],
    stretch: ["Add lizard and Spock. You only need to change the two tuples, not the logic.", "Let the player choose how many wins the match needs."]
  },
  tests: ["Type \"Rock\" with a capital letter.", "Type an invalid move; the score shouldn't change.", "Play a full match and check the final message matches the score."]
};

L[15] = {
  intro: "Strings come with dozens of built-in methods. Today you learn the most useful ones and how to examine text character by character.",
  lesson: [
    {h: "Methods return new strings",
     p: "Strings are immutable, so string methods never change the original. They <b>return</b> a new string, which you must store or use. <code>name.upper()</code> on its own line does nothing visible.",
     code: R`name = "  amina  "
clean = name.strip().title()
print("[" + name + "]", "[" + clean + "]")`,
     out: "[  amina  ] [Amina]"},
    {h: "The everyday methods",
     p: "<code>upper()</code>, <code>lower()</code>, <code>title()</code> change case. <code>strip()</code> removes spaces at both ends. <code>replace(a, b)</code> swaps text. <code>startswith()</code> and <code>endswith()</code> test the ends. <code>find(x)</code> returns the position or -1. <code>count(x)</code> counts occurrences.",
     code: R`email = "Abdy@Example.com"
print(email.lower())
print(email.endswith(".com"))
print(email.find("@"))
print("banana".count("a"))`},
    {h: "split and join",
     p: "<code>split()</code> breaks a string into a list of words; <code>split(\",\")</code> splits on commas. <code>\" \".join(list)</code> does the reverse, gluing a list of strings with the separator.",
     code: R`words = "learn python today".split()
print(words)
print("-".join(words))`,
     out: "['learn', 'python', 'today']\nlearn-python-today"},
    {h: "Character checks",
     p: "<code>isdigit()</code>, <code>isalpha()</code>, <code>isupper()</code>, <code>islower()</code> and <code>isspace()</code> return bools. Combined with a <code>for</code> loop they let you inspect every character. <code>\"x\" in text</code> checks for a substring."}
  ],
  exercises: [
    {q: "Ask for a full name typed messily (extra spaces, wrong case) and print it tidy.", sol: R`raw = input("Full name: ")
print(raw.strip().title())`},
    {q: "Count the words in a sentence.", sol: R`sentence = input("Sentence: ")
print(len(sentence.split()), "words")`},
    {q: "Turn \"hello world from python\" into \"Hello_World_From_Python\".", sol: R`text = "hello world from python"
print("_".join(text.title().split()))`},
    {q: "Ask for a phone number and print whether it is all digits.", sol: R`phone = input("Phone: ").replace(" ", "")
print(phone.isdigit())`}
  ],
  project: {
    title: "Password strength checker",
    brief: "Check a password against five rules (length of 8 or more, an uppercase letter, a lowercase letter, a digit, a symbol), give it a score, and list what is missing.",
    file: "day15_password_checker.py",
    code: R`# day15_password_checker.py
# Scores a password and explains how to improve it.

password = input("Enter a password to check: ")

has_upper = False
has_lower = False
has_digit = False
has_symbol = False

for ch in password:
    if ch.isupper():
        has_upper = True
    elif ch.islower():
        has_lower = True
    elif ch.isdigit():
        has_digit = True
    elif not ch.isspace():
        has_symbol = True

long_enough = len(password) >= 8

tips = []
if not long_enough:
    tips.append("use at least 8 characters")
if not has_upper:
    tips.append("add an uppercase letter")
if not has_lower:
    tips.append("add a lowercase letter")
if not has_digit:
    tips.append("add a number")
if not has_symbol:
    tips.append("add a symbol like ! or #")

score = 5 - len(tips)

if score == 5:
    rating = "strong"
elif score >= 3:
    rating = "medium"
else:
    rating = "weak"

print("Score:", score, "/ 5  (" + rating + ")")
if tips:
    print("To improve it: " + ", ".join(tips) + ".")`,
    explain: [
      ["has_upper = False ...", "<b>Flags</b>: bools that start False and flip to True when we find what we're looking for."],
      ["elif not ch.isspace():", "Any character that isn't a letter, digit or space counts as a symbol."],
      ["score = 5 - len(tips)", "Each missing rule added one tip, so the number of rules met is 5 minus the tips. One list does two jobs."],
      ["\", \".join(tips)", "Turns the list into one readable sentence."]
    ],
    out: "Enter a password to check: hello123\nScore: 3 / 5  (medium)\nTo improve it: add an uppercase letter, add a symbol like ! or #.",
    stretch: ["Reject passwords that contain the word \"password\" in any case.", "Add a rule against three identical characters in a row."]
  },
  tests: ["An empty password should score 0.", "<code>Tr0ub4dor&amp;3</code> should score 5.", "Try passwords with spaces in them."]
};

L[16] = {
  intro: "f-strings are the modern way to put values into text. Today you learn to format numbers and line up columns.",
  lesson: [
    {h: "f-strings",
     p: "Put <code>f</code> before the opening quote, then write any expression inside <code>{ }</code>. No <code>str()</code> or <code>+</code> needed. This is the way most Python code builds text today.",
     code: R`name = "Abdy"
day = 16
print(f"Hi {name}, this is day {day} of 100.")
print(f"{day * 2} is double the day")`,
     out: "Hi Abdy, this is day 16 of 100.\n32 is double the day"},
    {h: "Number formatting",
     p: "Add a colon and a format spec after the value. <code>:.2f</code> means 2 decimal places. <code>:,</code> adds thousands separators. <code>:%</code> shows a fraction as a percentage.",
     code: R`price = 1234.5
print(f"{price:.2f}")     # 1234.50
print(f"{price:,.2f}")    # 1,234.50
print(f"{0.256:.1%}")     # 25.6%`},
    {h: "Width and alignment",
     p: "A number after the colon sets a width. <code>&lt;</code> aligns left, <code>&gt;</code> right, <code>^</code> centre. Combine with decimals like <code>:&gt;8.2f</code>. You can also choose a fill character, as in <code>:-^30</code>.",
     code: R`print(f"[{'tea':<8}]")
print(f"[{'tea':>8}]")
print(f"[{'tea':^8}]")
print(f"{'MENU':-^20}")`,
     out: "[tea     ]\n[     tea]\n[  tea   ]\n--------MENU--------"},
    {h: "Multi-line strings",
     p: "Triple quotes <code>\"\"\"...\"\"\"</code> let a string span several lines. They work with <code>f</code> too."}
  ],
  exercises: [
    {q: "Rewrite <code>print(\"Total: \" + str(round(t, 2)))</code> as an f-string.", sol: R`print(f"Total: {t:.2f}")`},
    {q: "Print the numbers 1 to 10 with their squares and cubes in three right-aligned columns of width 6.", sol: R`for n in range(1, 11):
    print(f"{n:>6}{n**2:>6}{n**3:>6}")`},
    {q: "Given a population of 1380004385, print it with commas.", sol: R`print(f"{1380004385:,}")   # 1,380,004,385`}
  ],
  project: {
    title: "Shop receipt printer",
    brief: "Print a neat receipt from a list of (item, quantity, unit price) tuples, with aligned columns, a subtotal, tax and a total.",
    file: "day16_receipt.py",
    code: R`# day16_receipt.py
# Prints a formatted receipt.

SHOP = "Corner Café"
TAX_RATE = 0.16
WIDTH = 36

items = [
    ("Coffee", 2, 3.50),
    ("Croissant", 3, 2.25),
    ("Orange juice", 1, 4.00),
    ("Sandwich", 2, 6.75),
]

print("=" * WIDTH)
print(f"{SHOP:^{WIDTH}}")
print("=" * WIDTH)
print(f"{'Item':<16}{'Qty':>4}{'Price':>8}{'Total':>8}")
print("-" * WIDTH)

subtotal = 0
for name, qty, price in items:
    line_total = qty * price
    subtotal += line_total
    print(f"{name:<16}{qty:>4}{price:>8.2f}{line_total:>8.2f}")

tax = subtotal * TAX_RATE
total = subtotal + tax

print("-" * WIDTH)
print(f"{'Subtotal':<28}{subtotal:>8.2f}")
print(f"{'Tax (' + str(int(TAX_RATE * 100)) + '%)':<28}{tax:>8.2f}")
print(f"{'TOTAL':<28}{total:>8.2f}")
print("=" * WIDTH)
print(f"{'Thank you!':^{WIDTH}}")`,
    explain: [
      ["f\"{SHOP:^{WIDTH}}\"", "The width itself can come from a variable using nested braces. Change WIDTH and everything re-centres."],
      ["for name, qty, price in items:", "Tuple unpacking from Day 14: each tuple splits into three names."],
      ["{price:>8.2f}", "Right-aligned in 8 characters with 2 decimals, so all the decimal points line up."],
      ["16 + 4 + 8 + 8 = 36", "The column widths add up to WIDTH, which keeps the rules and the columns the same length."]
    ],
    out: "====================================\n            Corner Café\n====================================\nItem             Qty   Price   Total\n------------------------------------\nCoffee             2    3.50    7.00\nCroissant          3    2.25    6.75\nOrange juice       1    4.00    4.00\nSandwich           2    6.75   13.50\n------------------------------------\nSubtotal                       31.25\nTax (16%)                       5.00\nTOTAL                          36.25\n====================================\n             Thank you!",
    stretch: ["Let the user type items until they enter a blank name.", "Add a 10% discount line when the subtotal is over 30."]
  },
  tests: ["Add an item with a long name (over 16 characters). What breaks? Fix it by shortening with a slice.", "Check the total by hand.", "Change WIDTH and see what still lines up."]
};

L[17] = {
  intro: "Dictionaries map keys to values, like a real dictionary maps words to meanings. They are everywhere in Python and in ML code.",
  lesson: [
    {h: "Creating and reading",
     p: "Write a dict with curly braces and <code>key: value</code> pairs. Read a value with <code>d[key]</code>. Keys are usually strings and must be unique. If the key is missing, <code>d[key]</code> raises a <b>KeyError</b>, whereas <code>d.get(key)</code> returns <code>None</code> or a default you give it.",
     code: R`ages = {"Amina": 24, "Omar": 31}
print(ages["Amina"])
print(ages.get("Sara"))        # None
print(ages.get("Sara", 0))     # 0`},
    {h: "Adding, changing and deleting",
     p: "Assigning to a key adds it if it's new or replaces it if it exists. <code>del d[key]</code> or <code>d.pop(key)</code> removes it. <code>key in d</code> checks if a key exists.",
     code: R`ages["Sara"] = 19      # add
ages["Omar"] = 32      # update
del ages["Amina"]
print("Sara" in ages, ages)`,
     out: "True {'Omar': 32, 'Sara': 19}"},
    {h: "Looping",
     p: "Looping over a dict gives its keys. <code>.items()</code> gives (key, value) pairs you can unpack. <code>.keys()</code> and <code>.values()</code> give one side. Dicts remember the order you inserted things.",
     code: R`for name, age in ages.items():
    print(f"{name} is {age}")`},
    {h: "Why dicts are fast",
     p: "Looking up a key in a dict is nearly instant even with millions of entries, while searching a list checks every item. When you find yourself searching a list for something by name, a dict is usually the better choice."}
  ],
  exercises: [
    {q: "Make a dict of three countries and their capitals, then print each pair with an f-string.", sol: R`capitals = {"Kenya": "Nairobi", "Somalia": "Mogadishu", "Egypt": "Cairo"}
for country, city in capitals.items():
    print(f"The capital of {country} is {city}")`},
    {q: "Ask for a country and print its capital, or \"Unknown\" if it's not in the dict, without an error.", sol: R`country = input("Country: ")
print(capitals.get(country, "Unknown"))`},
    {q: "Count how many times each letter appears in a word, using a dict.", sol: R`word = "banana"
counts = {}
for ch in word:
    counts[ch] = counts.get(ch, 0) + 1
print(counts)   # {'b': 1, 'a': 3, 'n': 2}`}
  ],
  project: {
    title: "Contact book",
    brief: "A menu-driven contact book that maps names to phone numbers. Users can add, look up, update, delete and list contacts.",
    file: "day17_contacts.py",
    code: R`# day17_contacts.py
# A contact book backed by a dictionary.

contacts = {}

while True:
    print()
    print("1) Add/update  2) Look up  3) Delete  4) List all  5) Quit")
    choice = input("Choose: ")

    if choice == "1":
        name = input("Name: ").strip().title()
        phone = input("Phone: ").strip()
        if name in contacts:
            print(f"Updated {name}.")
        else:
            print(f"Added {name}.")
        contacts[name] = phone

    elif choice == "2":
        name = input("Name: ").strip().title()
        phone = contacts.get(name)
        if phone:
            print(f"{name}: {phone}")
        else:
            print(f"No contact called {name}.")

    elif choice == "3":
        name = input("Name: ").strip().title()
        if name in contacts:
            del contacts[name]
            print(f"Deleted {name}.")
        else:
            print(f"No contact called {name}.")

    elif choice == "4":
        if not contacts:
            print("Your contact book is empty.")
        for name in sorted(contacts):
            print(f"{name:<20}{contacts[name]}")

    elif choice == "5":
        print("Goodbye!")
        break

    else:
        print("Please choose 1 to 5.")`,
    explain: [
      [".strip().title()", "Normalising names means \"amina \" and \"Amina\" are treated as the same key."],
      ["contacts[name] = phone", "The same line both adds and updates. We check <code>name in contacts</code> beforehand only to choose the message."],
      ["contacts.get(name)", "Returns <code>None</code> for a missing name, which is falsy, so <code>if phone:</code> handles both cases without a KeyError."],
      ["sorted(contacts)", "Sorting a dict gives its keys in alphabetical order."]
    ],
    stretch: ["Store an email too, using a dict as the value: <code>{\"phone\": ..., \"email\": ...}</code>. That's tomorrow's next step.", "Add a search that finds every name containing some text."]
  },
  tests: ["Add a contact, then add the same name with different capitals. It should update, not duplicate.", "Look up and delete a name that doesn't exist.", "List an empty book."]
};

L[18] = {
  intro: "Sets hold unique items and make comparisons between groups easy. Today you compare the vocabulary of two texts.",
  lesson: [
    {h: "Creating sets",
     p: "Write a set with curly braces, or convert something with <code>set()</code>. Duplicates disappear automatically, and the order is not guaranteed. An empty set must be <code>set()</code>, because <code>{}</code> is an empty dict.",
     code: R`nums = {3, 1, 3, 2, 1}
print(nums)                    # {1, 2, 3}
letters = set("hello")
print(letters)                 # {'h', 'e', 'l', 'o'} in some order
empty = set()`},
    {h: "Adding, removing and membership",
     p: "<code>add(x)</code> adds, <code>discard(x)</code> removes without an error if it's missing. <code>x in s</code> is as fast as dict lookup, much faster than a list."},
    {h: "Set operations",
     p: "<code>a | b</code> union (in either), <code>a &amp; b</code> intersection (in both), <code>a - b</code> difference (in a but not b), <code>a ^ b</code> symmetric difference (in exactly one).",
     code: R`python_class = {"Amina", "Omar", "Sara"}
ml_class = {"Omar", "Sara", "Yusuf"}
print(python_class & ml_class)   # in both
print(python_class | ml_class)   # everyone
print(python_class - ml_class)   # only Python
print(python_class ^ ml_class)   # only one class`},
    {h: "Removing duplicates from a list",
     p: "<code>list(set(items))</code> removes duplicates but loses the order. <code>sorted(set(items))</code> gives the unique items in sorted order."}
  ],
  exercises: [
    {q: "Given <code>[3, 7, 3, 9, 7, 1]</code>, print the unique values sorted.", sol: R`print(sorted(set([3, 7, 3, 9, 7, 1])))   # [1, 3, 7, 9]`},
    {q: "Check whether two words use exactly the same letters, ignoring repeats.", sol: R`a = input("Word 1: ").lower()
b = input("Word 2: ").lower()
print(set(a) == set(b))`},
    {q: "Print the letters that two names have in common.", sol: R`print(set("amina") & set("yasmin"))`}
  ],
  project: {
    title: "Text comparer",
    brief: "Ask for two pieces of text, clean them into sets of lowercase words, then report the shared words, the words unique to each, and a similarity score.",
    file: "day18_text_compare.py",
    code: R`# day18_text_compare.py
# Compares the vocabulary of two texts using sets.

PUNCTUATION = ".,!?;:\"'()"

text_a = input("First text:  ")
text_b = input("Second text: ")

words_a = set()
for word in text_a.lower().split():
    words_a.add(word.strip(PUNCTUATION))

words_b = set()
for word in text_b.lower().split():
    words_b.add(word.strip(PUNCTUATION))

words_a.discard("")
words_b.discard("")

shared = words_a & words_b
only_a = words_a - words_b
only_b = words_b - words_a
everything = words_a | words_b

print()
print(f"Shared words ({len(shared)}):", ", ".join(sorted(shared)))
print(f"Only in first ({len(only_a)}):", ", ".join(sorted(only_a)))
print(f"Only in second ({len(only_b)}):", ", ".join(sorted(only_b)))

if everything:
    similarity = len(shared) / len(everything)
    print(f"Similarity: {similarity:.0%}")`,
    explain: [
      ["word.strip(PUNCTUATION)", "<code>strip</code> with an argument removes any of those characters from both ends, so \"python!\" becomes \"python\"."],
      ["words_a.discard(\"\")", "A word made only of punctuation, like \"--\", strips down to an empty string; this removes it."],
      ["len(shared) / len(everything)", "This is the <b>Jaccard similarity</b>, a measure used in real text analysis and ML. It's 1.0 for identical vocabularies and 0 when nothing is shared."],
      ["if everything:", "Guards against dividing by zero when both texts are empty."]
    ],
    out: "First text:  I love learning Python!\nSecond text: Python is fun and I love it.\n\nShared words (3): i, love, python\nOnly in first (1): learning\nOnly in second (4): and, fun, is, it\nSimilarity: 38%",
    stretch: ["Ignore common words like \"the\", \"a\" and \"and\" by keeping them in a set and subtracting it.", "Compare two paragraphs from different news articles."]
  },
  tests: ["Two identical texts should be 100%.", "Two texts with no common words should be 0%.", "Check that \"Python\" and \"python!\" count as the same word."]
};

L[19] = {
  intro: "Real data is nested: lists of dicts, dicts of lists. Today you learn to build and navigate these structures, which is exactly what JSON and API data look like.",
  lesson: [
    {h: "A list of dicts",
     p: "Each dict is one record, and the list holds many records. This is the shape of a table, and it's how you'll handle data in Level 2 and in pandas later.",
     code: R`students = [
    {"name": "Amina", "score": 88},
    {"name": "Omar", "score": 72},
]
print(students[1]["name"])     # Omar
for s in students:
    print(f"{s['name']}: {s['score']}")`},
    {h: "Read the access path left to right",
     p: "<code>students[1][\"name\"]</code> means: take <code>students</code>, get item 1 (a dict), then get its <code>\"name\"</code>. With deeper nesting, just keep going one step at a time. If you get lost, <code>print()</code> each step."},
    {h: "A dict of lists",
     p: "Useful for grouping. Each key holds a list you can append to.",
     code: R`groups = {"A": ["Amina"], "B": []}
groups["B"].append("Omar")
print(groups)`,
     out: "{'A': ['Amina'], 'B': ['Omar']}"},
    {h: "Quotes inside f-strings",
     p: "Inside an f-string that uses double quotes, use single quotes for dict keys: <code>f\"{s['name']}\"</code>. Mixing them avoids ending the string early."}
  ],
  exercises: [
    {q: "From the <code>students</code> list above, print the name of the highest scorer.", sol: R`best = students[0]
for s in students:
    if s["score"] > best["score"]:
        best = s
print(best["name"])`},
    {q: "Given <code>library = {\"fiction\": [\"Dune\", \"Emma\"], \"science\": [\"Cosmos\"]}</code>, print each genre and how many books it has.", sol: R`for genre, books in library.items():
    print(f"{genre}: {len(books)} books")`},
    {q: "Add a book \"Sapiens\" to a new genre \"history\".", sol: R`library["history"] = ["Sapiens"]`}
  ],
  project: {
    title: "Quiz app with score tracking",
    brief: "Store the quiz as a list of dicts, each with a question, four options and the right answer. Ask each question, track the score, and show a review of wrong answers at the end.",
    file: "day19_quiz.py",
    code: R`# day19_quiz.py
# A multiple-choice quiz driven entirely by data.

QUIZ = [
    {
        "question": "What does len('python') return?",
        "options": {"a": "5", "b": "6", "c": "7", "d": "An error"},
        "answer": "b",
    },
    {
        "question": "Which type is immutable?",
        "options": {"a": "list", "b": "dict", "c": "tuple", "d": "set"},
        "answer": "c",
    },
    {
        "question": "What is 7 // 2?",
        "options": {"a": "3.5", "b": "3", "c": "4", "d": "1"},
        "answer": "b",
    },
    {
        "question": "Which creates an empty set?",
        "options": {"a": "{}", "b": "[]", "c": "set()", "d": "()"},
        "answer": "c",
    },
]

score = 0
mistakes = []

for number, item in enumerate(QUIZ, start=1):
    print()
    print(f"Q{number}. {item['question']}")
    for letter, text in item["options"].items():
        print(f"   {letter}) {text}")

    reply = input("Your answer: ").strip().lower()
    while reply not in item["options"]:
        reply = input("Please type a, b, c or d: ").strip().lower()

    if reply == item["answer"]:
        print("Correct!")
        score += 1
    else:
        right = item["answer"]
        print(f"Wrong. The answer was {right}) {item['options'][right]}")
        mistakes.append(item["question"])

print()
print(f"You scored {score} out of {len(QUIZ)} ({score / len(QUIZ):.0%}).")
if mistakes:
    print("Questions to review:")
    for q in mistakes:
        print(" -", q)`,
    explain: [
      ["QUIZ = [ {...}, ... ]", "The questions are data, separate from the logic. Adding a question means adding a dict, with no new code."],
      ["\"options\": {\"a\": ..., ...}", "A dict inside a dict inside a list. <code>item[\"options\"][right]</code> walks two levels deep."],
      ["enumerate(QUIZ, start=1)", "Gives (number, item) pairs so we don't need a manual counter. You'll study it properly on Day 25."],
      ["while reply not in item[\"options\"]:", "<code>in</code> on a dict checks its keys, so only a, b, c or d gets through."]
    ],
    stretch: ["Shuffle the question order with <code>random.shuffle(QUIZ)</code>.", "Write 10 questions about what you learned this week."]
  },
  tests: ["Answer everything right, then everything wrong.", "Type an invalid letter and uppercase letters.", "Add a fifth question and check it works with no other changes."]
};

L[20] = {
  intro: "Capstone day. You combine every Level 1 skill into a text adventure game. Take two days if you need them.",
  lesson: [
    {h: "Design the data first",
     p: "A game world is data. Each room is a dict with a description, its exits (a dict mapping a direction to another room's name), and an optional item. All rooms live in one dict keyed by room name. The player is just a current room name and an inventory list."},
    {h: "The game loop",
     p: "Most games follow the same loop: show the state, read a command, update the state, check for a win or loss, then repeat. Write that loop with comments first, as on Day 8."},
    {h: "Parsing commands",
     p: "<code>command.split()</code> turns \"go north\" into <code>[\"go\", \"north\"]</code>. The first word is the verb and the rest is the target. Check the length of the list before indexing, so a one-word command doesn't crash.",
     code: R`parts = "take lamp".split()
verb = parts[0]
target = parts[1] if len(parts) > 1 else ""
print(verb, target)`,
     out: "take lamp"},
    {h: "Review checklist",
     p: "This project uses: variables, strings and f-strings, input, conditionals, <code>while</code> and <code>for</code> loops, lists, dicts, nested data, sets and string methods. If any of those feel shaky, revisit that day before moving on to Level 2."}
  ],
  exercises: [
    {q: "Sketch your own map on paper first: at least five rooms, how they connect, and where the items are.", sol: R`# Example layout:
#        [Library]
#            |
# [Hall] - [Garden] - [Shed]
#            |
#        [Gate]  (needs the key)`},
    {q: "Write just the <code>ROOMS</code> dict for your map and print the description of each room in a loop.", sol: R`for name, room in ROOMS.items():
    print(name, "-", room["description"])`}
  ],
  project: {
    title: "Text adventure game",
    brief: "Explore a small world, pick up items, and escape through the locked gate. The player wins by reaching the gate with the key, and the game supports the commands <code>go</code>, <code>take</code>, <code>inventory</code>, <code>look</code>, <code>help</code> and <code>quit</code>.",
    file: "day20_adventure.py",
    code: R`# day20_adventure.py
# Level 1 capstone: a small text adventure.

ROOMS = {
    "Hall": {
        "description": "A dusty hall. Portraits watch you.",
        "exits": {"east": "Garden"},
        "item": "lamp",
    },
    "Garden": {
        "description": "An overgrown garden under a grey sky.",
        "exits": {"west": "Hall", "north": "Library", "east": "Shed", "south": "Gate"},
        "item": None,
    },
    "Library": {
        "description": "Shelves of old books. Something glints on a desk.",
        "exits": {"south": "Garden"},
        "item": "key",
    },
    "Shed": {
        "description": "A cramped shed that smells of oil.",
        "exits": {"west": "Garden"},
        "item": "map",
    },
    "Gate": {
        "description": "A heavy iron gate. It is locked.",
        "exits": {"north": "Garden"},
        "item": None,
    },
}

HELP = "Commands: go <direction>, take, inventory, look, help, quit"

current = "Hall"
inventory = []
visited = set()
moves = 0

print("=== Escape the Manor ===")
print("Find the key and reach the gate.")
print(HELP)

while True:
    room = ROOMS[current]

    # show the room when the player first arrives
    if current not in visited:
        print()
        print(f"-- {current} --")
        print(room["description"])
        visited.add(current)

    # win condition
    if current == "Gate" and "key" in inventory:
        print("The key turns. The gate creaks open. You escaped!")
        break

    command = input("> ").strip().lower()
    parts = command.split()
    if not parts:
        continue
    verb = parts[0]
    target = parts[1] if len(parts) > 1 else ""

    if verb == "quit":
        print("You give up and sit down in the dust.")
        break

    elif verb == "help":
        print(HELP)

    elif verb == "look":
        print(room["description"])
        if room["item"]:
            print(f"You see a {room['item']}.")
        print("Exits:", ", ".join(room["exits"]))

    elif verb == "go":
        if target in room["exits"]:
            current = room["exits"][target]
            moves += 1
            visited.discard(current)   # describe the room again on entry
        else:
            print("You can't go that way.")

    elif verb == "take":
        if room["item"]:
            inventory.append(room["item"])
            print(f"You take the {room['item']}.")
            room["item"] = None
        else:
            print("There is nothing here to take.")

    elif verb == "inventory":
        if inventory:
            print("You carry:", ", ".join(inventory))
        else:
            print("Your pockets are empty.")

    else:
        print("I don't understand. Type 'help'.")

print(f"Moves made: {moves}")`,
    explain: [
      ["ROOMS = {...}", "The whole world is nested data: a dict of dicts, each holding another dict of exits. To add a room you edit data, not logic."],
      ["room = ROOMS[current]", "At the top of each loop we fetch the current room once, so the code below can use the short name <code>room</code>."],
      ["target = parts[1] if len(parts) > 1 else \"\"", "A <b>conditional expression</b>: a one-line if/else that produces a value. It avoids an IndexError when the command is a single word."],
      ["room[\"item\"] = None", "Dicts are mutable, so changing the room here changes it in ROOMS too. The item stays taken if you come back."],
      ["visited", "A set of rooms already described; checking membership in a set is fast and order doesn't matter."]
    ],
    stretch: ["Make the Library dark until you carry the lamp.", "Add a move limit, or a creature that blocks a door until you give it an item.", "Write your own world from the map you sketched."]
  },
  tests: ["Win the game in as few moves as possible. What is the minimum?", "Try to go through the gate without the key.", "Take the same item twice.", "Enter an empty command, a single word, and nonsense.", "Show the finished game to someone and let them play without help."]
};

})(window.LESSONS);
