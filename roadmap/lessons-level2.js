// Level 2 lessons: Days 21-40. Code fields use String.raw so backslashes stay literal.
window.LESSONS = window.LESSONS || {};
(function (L) {
const R = String.raw;

L[21] = {
  intro: "Functions are named, reusable blocks of code. They are the main tool for organising programs, and every level from here builds on them.",
  lesson: [
    {h: "Defining and calling",
     p: "<code>def</code> defines a function: a name, parentheses, a colon, and an indented body. Defining it does not run it. The body runs only when you <b>call</b> the function with its name and parentheses. Python reads files top to bottom, so a function must be defined before the line that calls it runs.",
     code: R`def greet():
    print("Hello!")
    print("Welcome to Level 2.")

greet()
greet()`,
     out: "Hello!\nWelcome to Level 2.\nHello!\nWelcome to Level 2."},
    {h: "Parameters",
     p: "Names inside the parentheses are <b>parameters</b>. The values you pass when calling are <b>arguments</b>. Inside the function, parameters behave like ordinary variables.",
     code: R`def greet(name):
    print(f"Hello, {name}!")

greet("Amina")
greet("Omar")`},
    {h: "return sends a value back",
     p: "<code>return</code> ends the function and hands a value back to the caller, who can store it or use it in an expression. This is different from <code>print()</code>, which only shows text on screen. A function with no <code>return</code> gives back <code>None</code>.",
     code: R`def square(n):
    return n * n

area = square(4) + square(3)
print(area)

result = print("hi")   # print returns None
print(result)`,
     out: "25\nhi\nNone"},
    {h: "Docstrings",
     p: "A string on the first line of a function body is its <b>docstring</b>. It documents what the function does, and editors show it when you hover over a call. Write one for every function that isn't obvious.",
     code: R`def celsius_to_fahrenheit(c):
    """Convert a temperature from Celsius to Fahrenheit."""
    return c * 9 / 5 + 32`},
    {h: "Why bother?",
     p: "Functions let you <b>name</b> an idea, <b>reuse</b> it without copying code, and <b>test</b> one piece at a time. A good function does one job, and its name says what that job is. If you can't name it, it's probably doing too much."}
  ],
  exercises: [
    {q: "Write <code>is_even(n)</code> that returns <code>True</code> or <code>False</code>. Test it with a few numbers.", sol: R`def is_even(n):
    return n % 2 == 0

print(is_even(4), is_even(7))   # True False`},
    {q: "Write <code>initials(full_name)</code> that returns the initials, e.g. <code>\"Abdy Rahman\"</code> gives <code>\"A.R.\"</code>.", sol: R`def initials(full_name):
    result = ""
    for word in full_name.split():
        result += word[0].upper() + "."
    return result

print(initials("Abdy Rahman"))`},
    {q: "What does this print, and why? <code>def f(): print(\"x\")</code> then <code>y = f()</code> then <code>print(y)</code>.", sol: R`# x      (printed while f runs)
# None   (f has no return, so y is None)`}
  ],
  project: {
    title: "Refactor the calculator into functions",
    brief: "Take your Day 8 calculator and reorganise it into small functions: one per operation, one to read a number, one to pick the right operation, and a <code>main()</code> that runs the program in a loop. Same behaviour, cleaner structure.",
    file: "day21_calculator_functions.py",
    code: R`# day21_calculator_functions.py
# The Day 8 calculator, rebuilt from small functions.


def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    """Divide a by b. Returns None if b is zero."""
    if b == 0:
        return None
    return a / b


def get_number(prompt):
    """Ask for a number and return it as a float."""
    return float(input(prompt))


def calculate(a, op, b):
    """Apply the operator symbol op to a and b."""
    if op == "+":
        return add(a, b)
    elif op == "-":
        return subtract(a, b)
    elif op == "*":
        return multiply(a, b)
    elif op == "/":
        return divide(a, b)
    else:
        return None


def main():
    print("=== Calculator === (type q to quit)")
    while True:
        op = input("Operation (+ - * /): ").strip()
        if op == "q":
            print("Goodbye!")
            break
        if op not in ("+", "-", "*", "/"):
            print("Unknown operation.")
            continue

        a = get_number("First number: ")
        b = get_number("Second number: ")
        result = calculate(a, op, b)

        if result is None:
            print("That can't be calculated (division by zero?).")
        else:
            print(f"{a} {op} {b} = {round(result, 4)}")
        print()


main()`,
    explain: [
      ["def divide(a, b): ... return None", "Instead of printing an error, the function reports the problem through its return value. The caller decides what to say. That keeps the calculation separate from the user interface."],
      ["def calculate(a, op, b):", "This function only maps a symbol to a function. Notice how each <code>return</code> ends the function immediately, so no <code>else</code> chain is really needed."],
      ["if result is None:", "<code>is None</code> is the correct way to check for <code>None</code> (Day 5 mentioned this)."],
      ["def main(): ... main()", "Putting the program's top-level flow in <code>main()</code> is a common convention. The last line calls it to start everything."]
    ],
    stretch: ["Add a <code>power(a, b)</code> function and the <code>**</code> operator.", "Keep a list of past results inside <code>main()</code> and add an <code>h</code> command to show the history."]
  },
  tests: ["Each operation still gives the same answers as your Day 8 version.", "Divide by zero.", "In the interpreter, import nothing, just paste the <code>add</code> function and call it directly. Being able to test one function alone is the point of functions."]
};

L[22] = {
  intro: "Today you learn the different ways to pass arguments, how default values work, and how to return more than one value.",
  lesson: [
    {h: "Positional and keyword arguments",
     p: "Arguments match parameters by position, or you can name them with <b>keyword arguments</b>. Keywords make calls easier to read and let you pass them in any order. Positional arguments must come before keyword ones.",
     code: R`def describe(name, age, city):
    print(f"{name}, {age}, from {city}")

describe("Amina", 24, "Hargeisa")
describe(city="Nairobi", name="Omar", age=31)`},
    {h: "Default values",
     p: "A parameter with <code>=value</code> in the definition is optional. If the caller leaves it out, the default is used. Parameters with defaults must come after those without.",
     code: R`def power(base, exponent=2):
    return base ** exponent

print(power(5))      # 25
print(power(2, 10))  # 1024`},
    {h: "Returning several values",
     p: "Return several values separated by commas. Python packs them into a tuple, and the caller can unpack them (Day 14).",
     code: R`def min_max(numbers):
    return min(numbers), max(numbers)

low, high = min_max([4, 9, 1, 7])
print(low, high)`,
     out: "1 9"},
    {h: "Early return and guard clauses",
     p: "You can <code>return</code> early when input is bad. This keeps the main logic unindented and easy to read.",
     code: R`def average(numbers):
    if not numbers:
        return 0
    return sum(numbers) / len(numbers)`},
    {h: "The mutable default trap",
     p: "Never use a list or dict as a default value, like <code>def add(item, items=[])</code>. The default is created <b>once</b>, when the function is defined, and shared between calls. Use <code>None</code> and create the list inside: <code>if items is None: items = []</code>."}
  ],
  exercises: [
    {q: "Write <code>greet(name, greeting=\"Hello\")</code> and call it once with and once without the greeting.", sol: R`def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Sara"))
print(greet("Sara", greeting="Salaam"))`},
    {q: "Write <code>divide_with_remainder(a, b)</code> that returns the quotient and remainder. Unpack the result.", sol: R`def divide_with_remainder(a, b):
    return a // b, a % b

q, r = divide_with_remainder(17, 5)
print(q, r)   # 3 2`},
    {q: "Write <code>stats(numbers)</code> returning count, total and average, returning <code>(0, 0, 0)</code> for an empty list.", sol: R`def stats(numbers):
    if not numbers:
        return 0, 0, 0
    total = sum(numbers)
    return len(numbers), total, total / len(numbers)`}
  ],
  project: {
    title: "Shipping cost calculator",
    brief: "Write functions that price a parcel by weight and distance, with an optional express service and an optional insurance rate, and estimate the delivery time. The main program asks for details and prints a quote.",
    file: "day22_shipping.py",
    code: R`# day22_shipping.py
# Quotes a shipping price and delivery time.

BASE_FEE = 5.00
PER_KG = 1.20
PER_KM = 0.05


def shipping_cost(weight_kg, distance_km, express=False, insured_value=0):
    """Return the price of sending a parcel."""
    cost = BASE_FEE + weight_kg * PER_KG + distance_km * PER_KM
    if express:
        cost *= 1.5
    if insured_value > 0:
        cost += insured_value * 0.02   # 2% of the declared value
    return round(cost, 2)


def delivery_days(distance_km, express=False):
    """Estimate working days: 1 day plus 1 per 500 km, halved for express."""
    days = 1 + int(distance_km // 500)
    if express:
        days = max(1, days // 2)
    return days


def quote(weight_kg, distance_km, express=False, insured_value=0):
    """Return the price and the delivery estimate together."""
    price = shipping_cost(weight_kg, distance_km, express, insured_value)
    days = delivery_days(distance_km, express)
    return price, days


def ask_yes_no(question):
    return input(question + " (y/n): ").strip().lower() == "y"


def main():
    weight = float(input("Parcel weight in kg: "))
    distance = float(input("Distance in km: "))
    express = ask_yes_no("Express delivery?")
    insured = 0
    if ask_yes_no("Add insurance?"):
        insured = float(input("Declared value: "))

    price, days = quote(weight, distance, express=express, insured_value=insured)

    service = "Express" if express else "Standard"
    print()
    print(f"{service} delivery")
    print(f"Price:    {price:.2f}")
    print(f"Arrives:  in about {days} working day(s)")

    # Compare with the other service
    other_price, other_days = quote(weight, distance, not express, insured)
    other = "Standard" if express else "Express"
    print(f"({other} would cost {other_price:.2f} and take {other_days} day(s))")


main()`,
    explain: [
      ["express=False, insured_value=0", "Defaults make the common case short: <code>shipping_cost(2, 100)</code> works, and callers add options only when needed."],
      ["days = max(1, days // 2)", "<code>max</code> picks the larger value, so express is never quoted as 0 days."],
      ["return price, days", "Two values come back as a tuple. <code>price, days = quote(...)</code> unpacks them."],
      ["quote(weight, distance, express=express, insured_value=insured)", "Keyword arguments make it clear which value is which. The later call uses positions, which works but is harder to read. Compare them."],
      ["\"Express\" if express else \"Standard\"", "The conditional expression from Day 20, choosing a word in one line."]
    ],
    out: "Parcel weight in kg: 3\nDistance in km: 1200\nExpress delivery? (y/n): n\nAdd insurance? (y/n): n\n\nStandard delivery\nPrice:    68.60\nArrives:  in about 3 working day(s)\n(Express would cost 102.90 and take 1 day(s))",
    stretch: ["Add a <code>max_weight=30</code> parameter and return <code>None</code> for parcels that are too heavy.", "Add a discount parameter for business customers."]
  },
  tests: ["Check one price by hand: 5 + 3 × 1.2 + 1200 × 0.05 = 68.60.", "A short distance with express should never give 0 days.", "In the interpreter, call <code>shipping_cost(1, 10)</code> and <code>shipping_cost(1, 10, True)</code> directly."]
};

L[23] = {
  intro: "Scope decides where a name can be seen. Understanding it explains many confusing bugs and leads to cleaner functions.",
  lesson: [
    {h: "Local variables",
     p: "A variable created inside a function is <b>local</b>: it exists only while that call runs and can't be seen outside. Each call gets fresh local variables.",
     code: R`def make_total():
    total = 10
    return total

make_total()
print(total)   # NameError: total only existed inside the function`},
    {h: "Reading globals, and the LEGB rule",
     p: "When Python looks up a name, it searches <b>L</b>ocal, then <b>E</b>nclosing functions, then <b>G</b>lobal (the file), then <b>B</b>uilt-in names like <code>print</code>. So a function <i>can read</i> a global variable.",
     code: R`TAX = 0.16

def with_tax(price):
    return price * (1 + TAX)   # reads the global TAX

print(with_tax(100))`},
    {h: "Assigning makes a name local",
     p: "If a function <b>assigns</b> to a name anywhere in its body, that name is local for the whole function. That's why this fails with <b>UnboundLocalError</b>: the <code>count</code> inside is local, and it's read before it's assigned.",
     code: R`count = 0

def increment():
    count = count + 1   # UnboundLocalError

increment()`},
    {h: "global, and why to avoid it",
     p: "Writing <code>global count</code> inside the function fixes the error, but it makes the function depend on hidden state that any code can change. The cleaner pattern is: <b>pass values in as arguments and return the result</b>.",
     code: R`def increment(count):
    return count + 1

count = 0
count = increment(count)
print(count)`,
     out: "1"},
    {h: "Mutating versus reassigning",
     p: "If you pass a list into a function and the function <b>changes</b> it with <code>append</code>, the caller sees the change, because both names point at the same list. Reassigning the parameter with <code>=</code> doesn't affect the caller. You'll use this in today's project.",
     code: R`def add_item(items):
    items.append("new")     # changes the shared list

def replace(items):
    items = ["other"]       # only rebinds the local name

stuff = []
add_item(stuff)
replace(stuff)
print(stuff)`,
     out: "['new']"}
  ],
  exercises: [
    {q: "Predict the output, then run it: <code>x = 5</code>, <code>def f(): x = 10; return x</code>, then <code>print(f(), x)</code>.", sol: R`# 10 5
# The x inside f is local; the global x is untouched.`},
    {q: "Rewrite this to avoid <code>global</code>: a <code>score</code> global and a function <code>add_points(n)</code> that adds <code>n</code> to it.", sol: R`def add_points(score, n):
    return score + n

score = 0
score = add_points(score, 10)`},
    {q: "Write <code>remove_negatives(numbers)</code> that removes negative numbers from the list it is given, changing it in place. Hint: build a new list and use slice assignment <code>numbers[:] = ...</code>.", sol: R`def remove_negatives(numbers):
    kept = []
    for n in numbers:
        if n >= 0:
            kept.append(n)
    numbers[:] = kept     # replaces the contents of the same list

data = [3, -1, 4, -5]
remove_negatives(data)
print(data)   # [3, 4]`}
  ],
  project: {
    title: "Bank account simulator",
    brief: "Simulate one bank account with deposits, withdrawals and a transaction history. Use no global variables: the balance is passed into each function and returned, and the history list is shared and appended to.",
    file: "day23_bank.py",
    code: R`# day23_bank.py
# A bank account built without global variables.

MIN_BALANCE = 0


def record(history, kind, amount, balance):
    """Append one transaction to the shared history list."""
    history.append((kind, amount, balance))


def deposit(balance, amount, history):
    if amount <= 0:
        print("Deposits must be positive.")
        return balance
    balance += amount
    record(history, "deposit", amount, balance)
    return balance


def withdraw(balance, amount, history):
    if amount <= 0:
        print("Withdrawals must be positive.")
        return balance
    if balance - amount < MIN_BALANCE:
        print(f"Insufficient funds. Balance is {balance:.2f}.")
        return balance
    balance -= amount
    record(history, "withdraw", amount, balance)
    return balance


def show_history(history):
    if not history:
        print("No transactions yet.")
        return
    print(f"{'Type':<10}{'Amount':>10}{'Balance':>10}")
    for kind, amount, balance in history:
        print(f"{kind:<10}{amount:>10.2f}{balance:>10.2f}")


def main():
    balance = 0.0
    history = []

    while True:
        print()
        print(f"Balance: {balance:.2f}")
        print("1) Deposit  2) Withdraw  3) History  4) Quit")
        choice = input("Choose: ")

        if choice == "1":
            balance = deposit(balance, float(input("Amount: ")), history)
        elif choice == "2":
            balance = withdraw(balance, float(input("Amount: ")), history)
        elif choice == "3":
            show_history(history)
        elif choice == "4":
            print("Goodbye!")
            break
        else:
            print("Please choose 1 to 4.")


main()`,
    explain: [
      ["balance = deposit(balance, ..., history)", "A number can't be changed in place, so the function returns the new balance and <code>main</code> stores it. Forgetting the <code>balance =</code> part is a classic bug: try removing it."],
      ["history.append((kind, amount, balance))", "Lists can be changed in place, so appending inside <code>record</code> is visible in <code>main</code> without returning anything."],
      ["return balance (in the error branches)", "Even when nothing changes, the function returns the balance so the caller's assignment keeps working."],
      ["balance = 0.0 inside main()", "All the state lives in <code>main</code>'s local variables. No other function can change it behind your back."]
    ],
    stretch: ["Add an overdraft limit by changing <code>MIN_BALANCE</code> to -100 and testing.", "Add monthly interest as a function <code>apply_interest(balance, rate, history)</code>."]
  },
  tests: ["Withdraw more than the balance.", "Deposit a negative number.", "Remove <code>balance =</code> from the deposit line and see the balance never change. Then put it back."]
};

L[24] = {
  intro: "Some functions need to accept any number of arguments, like <code>print()</code> does. Today you learn <code>*args</code> and <code>**kwargs</code>, and the matching unpacking syntax.",
  lesson: [
    {h: "*args collects extra positional arguments",
     p: "A parameter starting with <code>*</code> gathers any extra positional arguments into a <b>tuple</b>. The name <code>args</code> is just a convention; <code>*toppings</code> works too.",
     code: R`def total(*numbers):
    print(numbers)
    return sum(numbers)

print(total(1, 2, 3))
print(total())`,
     out: "(1, 2, 3)\n6\n()\n0"},
    {h: "**kwargs collects extra keyword arguments",
     p: "A parameter starting with <code>**</code> gathers extra keyword arguments into a <b>dict</b>.",
     code: R`def profile(name, **details):
    print(name)
    for key, value in details.items():
        print(f"  {key}: {value}")

profile("Amina", city="Hargeisa", language="Python")`},
    {h: "Order of parameters",
     p: "The order in a definition is: normal parameters, <code>*args</code>, keyword parameters with defaults, then <code>**kwargs</code>. A parameter after <code>*args</code> can only be passed by keyword.",
     code: R`def order(size, *toppings, delivery=False, **extras):
    ...`},
    {h: "Unpacking when calling",
     p: "The same symbols work the other way when calling: <code>*list</code> spreads a list into positional arguments, and <code>**dict</code> spreads a dict into keyword arguments.",
     code: R`nums = [3, 8, 1]
print(max(*nums))          # same as max(3, 8, 1)

settings = {"sep": " | ", "end": "!\n"}
print("a", "b", "c", **settings)`,
     out: "8\na | b | c!"}
  ],
  exercises: [
    {q: "Write <code>average(*nums)</code> that works with any number of arguments and returns 0 if there are none.", sol: R`def average(*nums):
    if not nums:
        return 0
    return sum(nums) / len(nums)

print(average(2, 4, 9))`},
    {q: "Write <code>make_tag(tag, text, **attrs)</code> that returns HTML like <code>&lt;a href=\"x\"&gt;text&lt;/a&gt;</code>.", sol: R`def make_tag(tag, text, **attrs):
    parts = ""
    for key, value in attrs.items():
        parts += f' {key}="{value}"'
    return f"<{tag}{parts}>{text}</{tag}>"

print(make_tag("a", "Home", href="/", title="Go home"))`},
    {q: "Given <code>point = (3, 4)</code> and <code>def distance(x, y)</code>, call it by unpacking the tuple.", sol: R`def distance(x, y):
    return (x ** 2 + y ** 2) ** 0.5

point = (3, 4)
print(distance(*point))   # 5.0`}
  ],
  project: {
    title: "Pizza order builder",
    brief: "A function builds a pizza from a size, any number of toppings, and optional extras passed as keyword arguments. It returns a dict describing the order. The main program takes a whole order of several pizzas and prints a bill.",
    file: "day24_pizza.py",
    code: R`# day24_pizza.py
# Builds pizza orders using *args and **kwargs.

SIZES = {"small": 8.00, "medium": 10.00, "large": 12.50}
TOPPING_PRICE = 1.25
EXTRA_PRICES = {"extra_cheese": 1.50, "stuffed_crust": 2.00, "gluten_free": 2.50}


def make_pizza(size, *toppings, **extras):
    """Return a dict describing one pizza and its price."""
    if size not in SIZES:
        raise ValueError(f"Unknown size: {size}")

    price = SIZES[size] + TOPPING_PRICE * len(toppings)
    chosen_extras = []
    for name, wanted in extras.items():
        if wanted and name in EXTRA_PRICES:
            price += EXTRA_PRICES[name]
            chosen_extras.append(name.replace("_", " "))

    return {
        "size": size,
        "toppings": toppings,
        "extras": chosen_extras,
        "price": round(price, 2),
    }


def describe(pizza):
    text = pizza["size"].title() + " pizza"
    if pizza["toppings"]:
        text += " with " + ", ".join(pizza["toppings"])
    if pizza["extras"]:
        text += " (+ " + ", ".join(pizza["extras"]) + ")"
    return text


def ask_for_pizza():
    size = input("Size (small/medium/large): ").strip().lower()
    raw = input("Toppings, separated by commas: ")
    toppings = []
    for t in raw.split(","):
        if t.strip():
            toppings.append(t.strip())
    cheese = input("Extra cheese? (y/n): ").strip().lower() == "y"
    return make_pizza(size, *toppings, extra_cheese=cheese)


def main():
    order = [
        make_pizza("large", "mushroom", "olives", extra_cheese=True),
        make_pizza("small"),
    ]
    print("Two pizzas are already in the basket. Add one more:")
    order.append(ask_for_pizza())

    print()
    total = 0
    for number, pizza in enumerate(order, start=1):
        print(f"{number}. {describe(pizza):<55}{pizza['price']:>7.2f}")
        total += pizza["price"]
    print(f"{'TOTAL':<58}{total:>7.2f}")


main()`,
    explain: [
      ["def make_pizza(size, *toppings, **extras):", "<code>toppings</code> becomes a tuple of however many toppings were passed; <code>extras</code> becomes a dict of the keyword options."],
      ["raise ValueError(...)", "A preview of Day 31: a function can stop with an error when it gets impossible input. Try ordering a \"huge\" pizza."],
      ["make_pizza(size, *toppings, extra_cheese=cheese)", "<code>*toppings</code> spreads the list from the user into separate arguments, which the function's <code>*toppings</code> then gathers back up."],
      ["if wanted and name in EXTRA_PRICES:", "Unknown extras are ignored rather than crashing, and <code>extra_cheese=False</code> adds nothing."]
    ],
    stretch: ["Add a <code>**extras</code> option <code>discount_code=\"SAVE10\"</code> that takes 10% off.", "Let the user keep adding pizzas until they enter an empty size."]
  },
  tests: ["A pizza with no toppings.", "Five toppings: is the price 5 × 1.25 more?", "Type an unknown size and read the ValueError message.", "Toppings typed with extra spaces, like <code>ham ,  pineapple</code>."]
};

L[25] = {
  intro: "Python's built-in functions replace many hand-written loops. Today you learn the ones you'll use constantly, including in data science.",
  lesson: [
    {h: "enumerate",
     p: "<code>enumerate(items)</code> gives (index, item) pairs. Use <code>start=1</code> for human numbering. It replaces manual counters.",
     code: R`for i, fruit in enumerate(["apple", "mango"], start=1):
    print(i, fruit)`,
     out: "1 apple\n2 mango"},
    {h: "zip",
     p: "<code>zip(a, b)</code> pairs items from several sequences by position. It stops at the shortest one. <code>dict(zip(keys, values))</code> builds a dict from two lists.",
     code: R`names = ["Amina", "Omar"]
scores = [88, 72]
for name, score in zip(names, scores):
    print(name, score)
print(dict(zip(names, scores)))`},
    {h: "map and filter",
     p: "<code>map(func, items)</code> applies a function to every item. <code>filter(func, items)</code> keeps items where the function returns True. Both are <b>lazy</b>: they produce values on demand, so wrap them in <code>list()</code> to see the result. Note that you pass the function itself, <code>int</code>, not a call, <code>int()</code>.",
     code: R`nums = list(map(int, "4,8,15".split(",")))
print(nums)

def is_positive(n):
    return n > 0

print(list(filter(is_positive, [3, -1, 0, 7])))`,
     out: "[4, 8, 15]\n[3, 7]"},
    {h: "any and all",
     p: "<code>any(items)</code> is True if at least one item is truthy; <code>all(items)</code> is True if every item is.",
     code: R`marks = [55, 72, 49]
print(all([m >= 50 for m in marks]))   # False
print(any([m >= 70 for m in marks]))   # True`},
    {h: "Others worth knowing",
     p: "<code>sum</code>, <code>min</code>, <code>max</code>, <code>len</code>, <code>sorted</code>, <code>reversed</code>, <code>round</code>, <code>abs</code>, <code>range</code>, <code>isinstance(x, int)</code> and <code>type</code>. Run <code>help(zip)</code> in the interpreter to read any built-in's documentation."}
  ],
  exercises: [
    {q: "Print a numbered list of three goals starting at 1 using <code>enumerate</code>.", sol: R`goals = ["Learn Python", "Build projects", "Study ML"]
for i, goal in enumerate(goals, start=1):
    print(f"{i}. {goal}")`},
    {q: "Given <code>prices = [\"3.5\", \"2\", \"10.25\"]</code>, compute the total using <code>map</code>.", sol: R`prices = ["3.5", "2", "10.25"]
print(sum(map(float, prices)))   # 15.75`},
    {q: "Check whether every character of a code like <code>\"A1B2\"</code> is a letter or digit using <code>all</code>.", sol: R`code = "A1B2"
print(all([ch.isalnum() for ch in code]))`}
  ],
  project: {
    title: "Class report card generator",
    brief: "You have parallel lists of student names and their marks in three subjects. Combine them with <code>zip</code>, number them with <code>enumerate</code>, and use <code>all</code>, <code>any</code>, <code>map</code> and <code>filter</code> to produce a report card and a class summary.",
    file: "day25_report_cards.py",
    code: R`# day25_report_cards.py
# Builds report cards from parallel lists using built-in functions.

names = ["Amina", "Omar", "Sara", "Yusuf", "Hodan"]
maths = [88, 45, 92, 67, 74]
english = [79, 58, 85, 49, 90]
science = [91, 52, 77, 71, 66]

PASS_MARK = 50
SUBJECTS = ("Maths", "English", "Science")


def grade(average):
    if average >= 85:
        return "A"
    if average >= 70:
        return "B"
    if average >= 55:
        return "C"
    return "D"


def passed(mark):
    return mark >= PASS_MARK


print(f"{'#':<3}{'Name':<8}{'Maths':>7}{'Eng':>6}{'Sci':>6}{'Avg':>7}  Grade  Note")
print("-" * 52)

averages = []
for number, (name, m, e, s) in enumerate(zip(names, maths, english, science), start=1):
    marks = [m, e, s]
    avg = sum(marks) / len(marks)
    averages.append(avg)

    if all(map(passed, marks)):
        note = "passed all"
    else:
        failed = [subj for subj, mark in zip(SUBJECTS, marks) if not passed(mark)]
        note = "resit " + ", ".join(failed)
    if any([mark >= 90 for mark in marks]):
        note += ", award!"

    print(f"{number:<3}{name:<8}{m:>7}{e:>6}{s:>6}{avg:>7.1f}  {grade(avg):^5}  {note}")

print()
best_index = averages.index(max(averages))
print(f"Class average: {sum(averages) / len(averages):.1f}")
print(f"Top student:   {names[best_index]} ({max(averages):.1f})")
print(f"Maths passes:  {len(list(filter(passed, maths)))} of {len(maths)}")`,
    explain: [
      ["enumerate(zip(names, maths, english, science), start=1)", "<code>zip</code> makes one tuple per student; <code>enumerate</code> numbers them. The loop target <code>number, (name, m, e, s)</code> unpacks both levels at once."],
      ["all(map(passed, marks))", "<code>map</code> runs <code>passed</code> on each mark, giving True/False values, and <code>all</code> checks them. Note <code>passed</code> without parentheses: we hand over the function itself."],
      ["[subj for subj, mark in zip(...) if not passed(mark)]", "A list comprehension: a preview of Day 27. It builds the list of failed subjects in one line."],
      ["averages.index(max(averages))", "Finds the position of the highest average so we can look up the matching name."],
      ["len(list(filter(passed, maths)))", "<code>filter</code> is lazy, so we turn it into a list before counting."]
    ],
    stretch: ["Add a fourth subject. How many lines did you have to change?", "Print the subject with the highest class average."]
  },
  tests: ["Check one student's average by hand.", "Make one list shorter than the others. What does <code>zip</code> do? Why is that dangerous?", "Change <code>PASS_MARK</code> to 60 and check the notes update."]
};

L[26] = {
  intro: "Python comes with \"batteries included\": a large standard library. Today you tour four modules: <code>math</code>, <code>random</code>, <code>string</code> and <code>secrets</code>.",
  lesson: [
    {h: "Ways to import",
     p: "<code>import math</code> then <code>math.sqrt(9)</code> keeps the module name visible, which is clearest. <code>from math import sqrt</code> imports one name. <code>import random as rnd</code> gives a shorter alias. Avoid <code>from math import *</code>, which dumps every name into your file.",
     code: R`import math
from random import randint

print(math.sqrt(16), randint(1, 6))`},
    {h: "math",
     p: "<code>math.pi</code>, <code>math.sqrt</code>, <code>math.ceil</code> (round up), <code>math.floor</code> (round down), <code>math.pow</code>, <code>math.log</code>, <code>math.isclose(a, b)</code> for comparing floats safely.",
     code: R`import math
print(math.ceil(4.1), math.floor(4.9))
print(math.isclose(0.1 + 0.2, 0.3))`,
     out: "5 4\nTrue"},
    {h: "random",
     p: "<code>randint(a, b)</code>, <code>random()</code> (a float from 0 to 1), <code>choice(seq)</code>, <code>sample(seq, k)</code> (k unique items), <code>shuffle(list)</code> (in place). <code>random.seed(42)</code> makes results repeatable, which is very important in ML experiments.",
     code: R`import random
random.seed(42)
print(random.sample(range(1, 50), 6))`},
    {h: "string and secrets",
     p: "<code>string.ascii_letters</code>, <code>string.digits</code> and <code>string.punctuation</code> are ready-made character sets. <code>random</code> is predictable by design, so for passwords and tokens use <code>secrets</code>, which uses the operating system's secure randomness: <code>secrets.choice(chars)</code>, <code>secrets.token_hex(16)</code>."},
    {h: "Reading the docs",
     p: "Every module is documented at <b>docs.python.org/3/library</b>. In the interpreter, <code>dir(math)</code> lists what a module contains and <code>help(math.ceil)</code> explains one function."}
  ],
  exercises: [
    {q: "How many 4-seater cars are needed for 23 people? Use <code>math.ceil</code>.", sol: R`import math
print(math.ceil(23 / 4))   # 6`},
    {q: "Simulate a lottery draw: 6 unique numbers from 1 to 49, sorted.", sol: R`import random
print(sorted(random.sample(range(1, 50), 6)))`},
    {q: "Generate a 6-digit verification code securely.", sol: R`import secrets
import string
code = ""
for i in range(6):
    code += secrets.choice(string.digits)
print(code)`}
  ],
  project: {
    title: "Dice roller and password generator",
    brief: "A two-tool program. The dice roller understands tabletop notation like <code>3d6+2</code> (three six-sided dice plus 2). The password generator builds a secure password of a chosen length that is guaranteed to include every character type.",
    file: "day26_dice_and_passwords.py",
    code: R`# day26_dice_and_passwords.py
# A dice roller (random) and a password generator (secrets).

import random
import secrets
import string


def parse_dice(notation):
    """Turn '3d6+2' into (3, 6, 2). '+N' is optional."""
    notation = notation.lower().replace(" ", "")
    bonus = 0
    if "+" in notation:
        notation, bonus_text = notation.split("+")
        bonus = int(bonus_text)
    count_text, sides_text = notation.split("d")
    count = int(count_text) if count_text else 1   # "d20" means 1d20
    return count, int(sides_text), bonus


def roll(count, sides, bonus=0):
    rolls = [random.randint(1, sides) for _ in range(count)]
    return rolls, sum(rolls) + bonus


def make_password(length=16):
    """Return a password containing at least one of each character type."""
    pools = [string.ascii_lowercase, string.ascii_uppercase,
             string.digits, "!@#$%^&*-_=+?"]
    if length < len(pools):
        length = len(pools)

    chars = [secrets.choice(pool) for pool in pools]   # one from each pool
    everything = "".join(pools)
    while len(chars) < length:
        chars.append(secrets.choice(everything))

    secrets.SystemRandom().shuffle(chars)   # secure shuffle
    return "".join(chars)


def main():
    while True:
        print()
        print("1) Roll dice  2) Make password  3) Quit")
        choice = input("Choose: ")
        if choice == "1":
            notation = input("Dice (e.g. 2d6, d20, 3d8+4): ")
            count, sides, bonus = parse_dice(notation)
            rolls, total = roll(count, sides, bonus)
            extra = f" + {bonus}" if bonus else ""
            print(f"Rolls: {rolls}{extra}  →  total {total}")
        elif choice == "2":
            length = int(input("Length (at least 4): "))
            print("Password:", make_password(length))
        elif choice == "3":
            break


main()`,
    explain: [
      ["notation, bonus_text = notation.split(\"+\")", "Splitting \"3d6+2\" gives two parts. We reuse the name <code>notation</code> for the dice part."],
      ["int(count_text) if count_text else 1", "\"d20\".split(\"d\") gives <code>['', '20']</code>; an empty count means one die."],
      ["[random.randint(1, sides) for _ in range(count)]", "A list comprehension (Day 27) that rolls once per die. <code>_</code> is the conventional name for a loop variable you don't use."],
      ["chars = [secrets.choice(pool) for pool in pools]", "Guarantees at least one character from each pool before filling the rest randomly."],
      ["secrets.SystemRandom().shuffle(chars)", "Shuffling stops the guaranteed characters always being at the start, which would make passwords more predictable."]
    ],
    stretch: ["Support minus modifiers like <code>2d6-1</code>.", "Add a passphrase option that joins 4 random words from a word list with hyphens."]
  },
  tests: ["Roll <code>1d1</code> a few times; it should always be 1.", "Roll <code>d20</code> and <code>3d6+2</code>.", "Generate a 4-character password and check it has one of each type.", "Type <code>abc</code> as dice notation and read the error. You'll handle it on Day 31."]
};

L[27] = {
  intro: "List comprehensions build a new list from an existing one in a single, readable line. They are one of the most \"Pythonic\" features and appear everywhere in data code.",
  lesson: [
    {h: "The pattern",
     p: "<code>[expression for item in iterable]</code> means: for each item, compute the expression and collect the results. It replaces the four-line \"empty list, loop, append\" pattern.",
     code: R`# loop version
squares = []
for n in range(1, 6):
    squares.append(n * n)

# comprehension version
squares = [n * n for n in range(1, 6)]
print(squares)`,
     out: "[1, 4, 9, 16, 25]"},
    {h: "Filtering with if",
     p: "Add <code>if condition</code> at the end to keep only some items.",
     code: R`words = ["apple", "fig", "banana", "kiwi"]
long_words = [w.upper() for w in words if len(w) > 4]
print(long_words)`,
     out: "['APPLE', 'BANANA']"},
    {h: "Choosing a value with if/else",
     p: "To transform every item differently, put a conditional expression at the <b>front</b>. Note the difference: an <code>if</code> at the end filters; an <code>if ... else</code> at the front chooses.",
     code: R`marks = [45, 80, 62]
labels = ["pass" if m >= 50 else "fail" for m in marks]
print(labels)`},
    {h: "Generator expressions",
     p: "Use round brackets instead of square ones and you get a <b>generator expression</b>, which produces values one at a time without building a list. Pass one straight into <code>sum</code>, <code>max</code>, <code>any</code> or <code>all</code>.",
     code: R`total = sum(n * n for n in range(1_000_000))
print(any(m < 50 for m in marks))`},
    {h: "Keep them readable",
     p: "A comprehension should fit on one line and be readable in one go. If you need several conditions, nested loops, or side effects like <code>print</code>, use a normal loop."}
  ],
  exercises: [
    {q: "Make a list of the even numbers from 1 to 20.", sol: R`evens = [n for n in range(1, 21) if n % 2 == 0]`},
    {q: "Given <code>names = [\" amina\", \"OMAR \", \"sara\"]</code>, clean them into title case without spaces.", sol: R`clean = [n.strip().title() for n in names]`},
    {q: "Convert a list of Celsius temperatures to Fahrenheit, rounded to 1 decimal.", sol: R`celsius = [0, 21.5, 37, -5]
fahrenheit = [round(c * 9 / 5 + 32, 1) for c in celsius]`},
    {q: "Rewrite as a comprehension: a loop that appends <code>len(word)</code> for every word in a sentence.", sol: R`lengths = [len(word) for word in sentence.split()]`}
  ],
  project: {
    title: "Data filter toolkit",
    brief: "Given an inventory as a list of dicts, write small functions that each answer one question using a comprehension, then a menu that lets the user filter products by category and maximum price.",
    file: "day27_filter_toolkit.py",
    code: R`# day27_filter_toolkit.py
# Answers questions about an inventory using comprehensions.

PRODUCTS = [
    {"name": "Laptop", "category": "electronics", "price": 899.00, "stock": 4},
    {"name": "Headphones", "category": "electronics", "price": 59.99, "stock": 0},
    {"name": "Desk lamp", "category": "home", "price": 24.50, "stock": 12},
    {"name": "Notebook", "category": "stationery", "price": 3.20, "stock": 150},
    {"name": "Office chair", "category": "home", "price": 149.00, "stock": 2},
    {"name": "Pen set", "category": "stationery", "price": 7.80, "stock": 0},
    {"name": "Monitor", "category": "electronics", "price": 179.00, "stock": 6},
]


def in_stock(products):
    return [p for p in products if p["stock"] > 0]


def names(products):
    return [p["name"] for p in products]


def categories(products):
    return sorted(set(p["category"] for p in products))


def with_vat(products, rate=0.16):
    return [{**p, "price": round(p["price"] * (1 + rate), 2)} for p in products]


def stock_value(products):
    return sum(p["price"] * p["stock"] for p in products)


def search(products, category=None, max_price=None):
    return [
        p for p in products
        if (category is None or p["category"] == category)
        and (max_price is None or p["price"] <= max_price)
    ]


def main():
    print("Out of stock:", names([p for p in PRODUCTS if p["stock"] == 0]))
    print("Categories:  ", categories(PRODUCTS))
    print(f"Stock value:  {stock_value(PRODUCTS):,.2f}")
    print()

    category = input(f"Category {categories(PRODUCTS)} or blank for all: ").strip().lower()
    limit = input("Maximum price, or blank for no limit: ").strip()

    results = search(
        in_stock(PRODUCTS),
        category=category or None,
        max_price=float(limit) if limit else None,
    )
    if not results:
        print("Nothing matches.")
    for p in with_vat(results):
        print(f"  {p['name']:<14}{p['price']:>9.2f} incl. VAT   ({p['stock']} left)")


main()`,
    explain: [
      ["[p for p in products if p[\"stock\"] > 0]", "Each helper is a one-line comprehension that answers one question. Small, named functions like these are easy to test and combine."],
      ["sorted(set(p[\"category\"] for p in products))", "A generator expression feeds a set (removing duplicates), which is then sorted into a list."],
      ["{**p, \"price\": ...}", "<code>**p</code> copies every key from the original dict into a new one, then the price is overridden. The original products are never changed."],
      ["(category is None or p[\"category\"] == category)", "If no category was given, the condition is True for everything, so that filter is effectively switched off."],
      ["category or None", "An empty string is falsy, so a blank answer becomes <code>None</code>, meaning \"no filter\"."]
    ],
    stretch: ["Add <code>cheapest(products, n)</code> that returns the n cheapest product names.", "Add a filter for minimum stock."]
  },
  tests: ["Leave both questions blank: all in-stock products appear.", "Choose <code>home</code> with a limit of 100.", "Choose a category that doesn't exist.", "Check that <code>PRODUCTS</code> prices are unchanged after calling <code>with_vat</code>."]
};

L[28] = {
  intro: "The comprehension idea also works for dicts and sets. Today you use them to count and transform data, then build a word-frequency counter.",
  lesson: [
    {h: "Dict comprehensions",
     p: "<code>{key_expr: value_expr for item in iterable}</code> builds a dict. You can filter with <code>if</code> just like list comprehensions.",
     code: R`words = ["apple", "fig", "banana"]
lengths = {w: len(w) for w in words}
print(lengths)`,
     out: "{'apple': 5, 'fig': 3, 'banana': 6}"},
    {h: "Transforming existing dicts",
     p: "Loop over <code>.items()</code> to build a modified copy, such as filtering or inverting a dict (swapping keys and values).",
     code: R`prices = {"tea": 1.5, "cake": 3.0, "juice": 2.5}
expensive = {k: v for k, v in prices.items() if v > 2}
by_price = {v: k for k, v in prices.items()}
print(expensive)
print(by_price)`},
    {h: "Set comprehensions",
     p: "Curly braces with a single expression make a set, so duplicates disappear.",
     code: R`emails = ["a@x.com", "b@y.org", "c@x.com"]
domains = {e.split("@")[1] for e in emails}
print(domains)`,
     out: "{'x.com', 'y.org'}"},
    {h: "Counting with dicts",
     p: "Counting is one of the most common jobs in data work. The loop pattern from Day 17 is <code>counts[w] = counts.get(w, 0) + 1</code>. The standard library also offers <code>collections.Counter</code>, which does it for you and has a <code>most_common(n)</code> method.",
     code: R`from collections import Counter
c = Counter("mississippi")
print(c.most_common(2))`,
     out: "[('i', 4), ('s', 4)]"}
  ],
  exercises: [
    {q: "Build a dict mapping the numbers 1 to 5 to their cubes.", sol: R`cubes = {n: n ** 3 for n in range(1, 6)}`},
    {q: "From <code>scores = {\"Amina\": 88, \"Omar\": 45, \"Sara\": 72}</code>, keep only students who passed (50 or more).", sol: R`passed = {name: s for name, s in scores.items() if s >= 50}`},
    {q: "Get the set of first letters of the words in a sentence, lowercase.", sol: R`firsts = {w[0].lower() for w in sentence.split()}`}
  ],
  project: {
    title: "Word frequency counter",
    brief: "Read a block of text, clean it into words, count each word, remove common filler words, and show the top words with a simple text bar chart. This kind of counting is the first step of many natural-language-processing pipelines.",
    file: "day28_word_frequency.py",
    code: R`# day28_word_frequency.py
# Counts word frequency in a text and draws a bar chart.

from collections import Counter

TEXT = """Python is a programming language that lets you work quickly
and integrate systems more effectively. Python is powerful, and fast;
plays well with others; runs everywhere; is friendly and easy to learn.
Python is used for web development, data analysis, machine learning,
and automation. Learning Python is a great first step into machine learning."""

STOP_WORDS = {"a", "an", "and", "the", "is", "to", "for", "of", "in", "that",
              "with", "you", "it", "into", "more", "are", "on", "be"}
PUNCTUATION = ".,;:!?\"'()"


def tokenize(text):
    """Split text into clean lowercase words."""
    return [w.strip(PUNCTUATION).lower() for w in text.split() if w.strip(PUNCTUATION)]


def count_words(words):
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts


def bar_chart(pairs, width=30):
    biggest = pairs[0][1]
    for word, count in pairs:
        bar = "█" * round(count / biggest * width)
        print(f"{word:>12} | {bar} {count}")


def main():
    text = input("Paste text (or press Enter to use the sample): ").strip() or TEXT

    words = tokenize(text)
    counts = count_words(words)
    meaningful = {w: c for w, c in counts.items() if w not in STOP_WORDS}
    repeated = {w for w, c in meaningful.items() if c > 1}

    print()
    print(f"Total words:       {len(words)}")
    print(f"Unique words:      {len(counts)}")
    print(f"Repeated keywords: {', '.join(sorted(repeated))}")
    print()

    top = Counter(meaningful).most_common(8)
    if top:
        bar_chart(top)


main()`,
    explain: [
      ["[w.strip(PUNCTUATION).lower() for w in text.split() if w.strip(PUNCTUATION)]", "Cleans each word and drops anything that was only punctuation, such as a lone dash. In NLP this step is called <b>tokenising</b>."],
      ["counts.get(w, 0) + 1", "The hand-written counting pattern. We write it ourselves once so that <code>Counter</code> isn't magic."],
      ["{w: c for w, c in counts.items() if w not in STOP_WORDS}", "A dict comprehension that filters out filler words. Checking <code>in</code> a set is fast."],
      ["Counter(meaningful).most_common(8)", "Turning our dict into a <code>Counter</code> gives us <code>most_common</code>, which returns (word, count) pairs, largest first."],
      ["round(count / biggest * width)", "Scales every bar relative to the most common word, so the longest bar is always 30 characters."]
    ],
    stretch: ["Read the text from a file instead, after tomorrow's lesson.", "Count bigrams: pairs of neighbouring words, using <code>zip(words, words[1:])</code>."]
  },
  tests: ["Use the sample text: \"python\" should be top.", "Paste a paragraph from a news article.", "Paste text that is only stop words; the chart should be skipped without an error."]
};

L[29] = {
  intro: "Until now, everything disappeared when the program ended. Today you read and write text files, so programs can remember things.",
  lesson: [
    {h: "Opening a file with with",
     p: "<code>open(path, mode)</code> opens a file. Always use it in a <code>with</code> block, which closes the file automatically, even if an error happens. Give <code>encoding=\"utf-8\"</code> so accented letters and emoji work the same on every computer.",
     code: R`with open("notes.txt", "w", encoding="utf-8") as f:
    f.write("First line\n")
    f.write("Second line\n")`},
    {h: "Modes",
     p: "<code>\"r\"</code> read (the default; the file must exist). <code>\"w\"</code> write: creates the file, or <b>erases</b> it if it exists. <code>\"a\"</code> append: adds to the end. <code>write()</code> does not add a newline for you; include <code>\\n</code> yourself."},
    {h: "Reading",
     p: "<code>f.read()</code> returns the whole file as one string. Looping over the file object gives one line at a time, which also works for huge files. Each line still ends with <code>\\n</code>, so use <code>rstrip(\"\\n\")</code> or <code>strip()</code>.",
     code: R`with open("notes.txt", encoding="utf-8") as f:
    for number, line in enumerate(f, start=1):
        print(number, line.rstrip("\n"))`,
     out: "1 First line\n2 Second line"},
    {h: "Where is the file?",
     p: "A relative path like <code>\"notes.txt\"</code> is relative to the <b>current working directory</b>: the folder your terminal is in when you run the program, not necessarily where the script is. If a file \"disappears\", check where you ran from. Day 30 shows a more reliable way."},
    {h: "Checking a file exists",
     p: "Reading a missing file raises <code>FileNotFoundError</code>. For now, check first with <code>os.path.exists(path)</code>. On Day 31 you'll learn to handle the error directly."}
  ],
  exercises: [
    {q: "Write three of your goals to <code>goals.txt</code>, one per line, then read them back and print them numbered.", sol: R`goals = ["Learn Python", "Build 100 projects", "Study ML"]
with open("goals.txt", "w", encoding="utf-8") as f:
    for g in goals:
        f.write(g + "\n")

with open("goals.txt", encoding="utf-8") as f:
    for i, line in enumerate(f, start=1):
        print(i, line.strip())`},
    {q: "Count the lines, words and characters in a text file.", sol: R`with open("goals.txt", encoding="utf-8") as f:
    text = f.read()
print(len(text.splitlines()), len(text.split()), len(text))`},
    {q: "Append a new goal without erasing the others.", sol: R`with open("goals.txt", "a", encoding="utf-8") as f:
    f.write("Get a job in AI\n")`}
  ],
  project: {
    title: "Daily journal app",
    brief: "A journal that stores entries in <code>journal.txt</code>. Users can write an entry (saved with today's date), read every entry, and search for a word. Entries survive after the program closes.",
    file: "day29_journal.py",
    code: R`# day29_journal.py
# A journal saved to a text file.

import os
from datetime import date

JOURNAL_FILE = "journal.txt"
SEPARATOR = "---"


def add_entry(text):
    today = date.today().isoformat()          # e.g. "2026-10-24"
    with open(JOURNAL_FILE, "a", encoding="utf-8") as f:
        f.write(f"{today}\n{text}\n{SEPARATOR}\n")


def read_entries():
    """Return a list of (date, text) tuples."""
    if not os.path.exists(JOURNAL_FILE):
        return []
    with open(JOURNAL_FILE, encoding="utf-8") as f:
        content = f.read()

    entries = []
    for block in content.split(SEPARATOR + "\n"):
        lines = block.strip().split("\n", 1)   # split off the first line only
        if len(lines) == 2:
            entries.append((lines[0], lines[1]))
    return entries


def show(entries):
    if not entries:
        print("No entries found.")
    for day, text in entries:
        print(f"\n[{day}]\n{text}")


def main():
    while True:
        print("\n1) Write  2) Read all  3) Search  4) Quit")
        choice = input("Choose: ")
        if choice == "1":
            print("Write your entry. Press Enter on an empty line to finish.")
            lines = []
            while True:
                line = input()
                if not line:
                    break
                lines.append(line)
            if lines:
                add_entry("\n".join(lines))
                print("Saved.")
        elif choice == "2":
            show(read_entries())
        elif choice == "3":
            word = input("Search for: ").lower()
            show([(d, t) for d, t in read_entries() if word in t.lower()])
        elif choice == "4":
            break


main()`,
    explain: [
      ["from datetime import date", "A preview of Day 38. <code>date.today().isoformat()</code> gives a date string like <code>2026-10-24</code>, which also sorts correctly as text."],
      ["open(JOURNAL_FILE, \"a\", ...)", "Append mode adds each entry to the end and creates the file the first time."],
      ["f\"{today}\\n{text}\\n{SEPARATOR}\\n\"", "We decide the file format ourselves: a date line, the text, then a separator line. Reading must follow the same format."],
      ["block.strip().split(\"\\n\", 1)", "The second argument limits it to one split, so multi-line entries stay in one piece."],
      ["if not os.path.exists(JOURNAL_FILE): return []", "On the very first run there's no file yet. Returning an empty list lets the rest of the program carry on."]
    ],
    stretch: ["Add a mood rating from 1 to 5 to each entry.", "Show how many entries you wrote this month."]
  },
  tests: ["Read before writing anything.", "Write two entries, quit, run again and read: both should be there.", "Write an entry containing the separator <code>---</code>. What breaks? Day 32 will show a better format (JSON).", "Open <code>journal.txt</code> in VS Code and look at the format."]
};

L[30] = {
  intro: "Programs often need to work with folders full of files. Today you learn <code>pathlib</code>, the modern way to handle paths, and you build a tool that tidies a folder.",
  lesson: [
    {h: "Path objects",
     p: "<code>from pathlib import Path</code>. A <code>Path</code> represents a location on disk. Join parts with <code>/</code>, which works on Windows and macOS alike. <code>Path.home()</code> is your home folder and <code>Path.cwd()</code> the current one.",
     code: R`from pathlib import Path

downloads = Path.home() / "Downloads"
report = downloads / "report.pdf"
print(report)
print(report.name, report.stem, report.suffix)`,
     out: "/home/abdy/Downloads/report.pdf\nreport.pdf report .pdf"},
    {h: "Asking questions",
     p: "<code>exists()</code>, <code>is_file()</code>, <code>is_dir()</code>, <code>stat().st_size</code> (size in bytes). <code>Path(__file__).parent</code> is the folder the script itself is in, which fixes yesterday's working-directory problem."},
    {h: "Listing a folder",
     p: "<code>folder.iterdir()</code> gives every item directly inside. <code>folder.glob(\"*.txt\")</code> matches a pattern; <code>rglob</code> also searches subfolders.",
     code: R`for item in Path.cwd().iterdir():
    kind = "folder" if item.is_dir() else "file"
    print(f"{kind:<7}{item.name}")

python_files = list(Path.cwd().glob("*.py"))`},
    {h: "Making, moving and reading",
     p: "<code>mkdir(parents=True, exist_ok=True)</code> creates a folder and doesn't fail if it already exists. <code>path.rename(new_path)</code> moves or renames. <code>path.read_text(encoding=\"utf-8\")</code> and <code>write_text()</code> are shortcuts for small files."},
    {h: "Be careful with real files",
     p: "Code that moves or deletes files can do damage quickly. Professional tools offer a <b>dry run</b>: print what would happen, and only act after confirmation. Always test on a copy of a folder first."}
  ],
  exercises: [
    {q: "Print the name and size in KB of every file in your current folder.", sol: R`from pathlib import Path
for p in Path.cwd().iterdir():
    if p.is_file():
        print(f"{p.name:<30}{p.stat().st_size / 1024:>8.1f} KB")`},
    {q: "Create a folder <code>practice/2026/october</code> in one line.", sol: R`Path("practice/2026/october").mkdir(parents=True, exist_ok=True)`},
    {q: "Count how many <code>.py</code> files are in your course folder, including subfolders.", sol: R`print(len(list(Path.cwd().rglob("*.py"))))`}
  ],
  project: {
    title: "Downloads folder organiser",
    brief: "Sort the files in a folder into subfolders by type (Images, Documents, Audio, and so on). It starts in dry-run mode and shows the plan; it only moves files after you type <code>yes</code>. Files with the same name are never overwritten.",
    file: "day30_organiser.py",
    code: R`# day30_organiser.py
# Sorts files into subfolders by type, with a dry run first.

from pathlib import Path

CATEGORIES = {
    "Images": {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"},
    "Documents": {".pdf", ".docx", ".doc", ".txt", ".md", ".pptx", ".xlsx", ".csv"},
    "Audio": {".mp3", ".wav", ".m4a"},
    "Video": {".mp4", ".mov", ".mkv"},
    "Archives": {".zip", ".rar", ".7z", ".tar", ".gz"},
    "Code": {".py", ".js", ".html", ".css", ".ipynb", ".json"},
}


def category_for(path):
    suffix = path.suffix.lower()
    for name, suffixes in CATEGORIES.items():
        if suffix in suffixes:
            return name
    return "Other"


def safe_target(folder, filename):
    """Return a path in folder that doesn't exist yet, adding (1), (2)..."""
    target = folder / filename
    counter = 1
    while target.exists():
        target = folder / f"{Path(filename).stem} ({counter}){Path(filename).suffix}"
        counter += 1
    return target


def plan_moves(folder):
    moves = []
    for item in sorted(folder.iterdir()):
        if item.is_file() and not item.name.startswith("."):
            moves.append((item, folder / category_for(item)))
    return moves


def main():
    answer = input("Folder to organise (blank for Downloads): ").strip()
    folder = Path(answer).expanduser() if answer else Path.home() / "Downloads"

    if not folder.is_dir():
        print(f"{folder} is not a folder.")
        return

    moves = plan_moves(folder)
    if not moves:
        print("Nothing to organise.")
        return

    print(f"\nDry run: {len(moves)} file(s) would be moved:")
    for source, dest_folder in moves:
        print(f"  {source.name:<40} → {dest_folder.name}/")

    if input("\nType yes to move them: ").strip().lower() != "yes":
        print("Nothing was moved.")
        return

    for source, dest_folder in moves:
        dest_folder.mkdir(exist_ok=True)
        source.rename(safe_target(dest_folder, source.name))
    print(f"Moved {len(moves)} file(s).")


main()`,
    explain: [
      ["CATEGORIES = {\"Images\": {\".jpg\", ...}}", "A dict of sets. The rules are data, so adding a category means adding one line."],
      ["path.suffix.lower()", "Makes <code>.JPG</code> and <code>.jpg</code> match the same rule."],
      ["def safe_target(...)", "If <code>photo.jpg</code> already exists in Images, the file becomes <code>photo (1).jpg</code>. Without this, <code>rename</code> could overwrite a file on some systems."],
      ["plan_moves then confirm", "The program separates <b>deciding</b> what to do from <b>doing</b> it. That makes the dry run possible and the logic easy to test."],
      ["not item.name.startswith(\".\")", "Skips hidden system files like <code>.DS_Store</code>."]
    ],
    stretch: ["Add an undo log: write each move to a text file and add an option to reverse it.", "Sort Images further by year using the file's modification time."]
  },
  tests: ["Make a test folder with a few empty files of different types (create them with <code>Path(\"test/a.pdf\").touch()</code>). Never test on your real Downloads first.", "Answer <code>no</code>: nothing should move.", "Run it twice with a duplicate file name.", "Give a folder path that doesn't exist."]
};

L[31] = {
  intro: "Real programs meet bad input, missing files and network failures. Exception handling lets your program respond sensibly instead of crashing.",
  lesson: [
    {h: "try and except",
     p: "Put risky code in a <code>try</code> block. If an error of the named type happens, Python jumps to the matching <code>except</code> block instead of crashing.",
     code: R`try:
    age = int(input("Age: "))
    print("Next year:", age + 1)
except ValueError:
    print("Please type a whole number.")`},
    {h: "Several excepts, and the error object",
     p: "You can catch different errors separately. <code>as e</code> gives you the error object, and <code>str(e)</code> is its message.",
     code: R`try:
    a = float(input("a: "))
    b = float(input("b: "))
    print(a / b)
except ValueError:
    print("Those weren't numbers.")
except ZeroDivisionError as e:
    print("Maths error:", e)`},
    {h: "else and finally",
     p: "<code>else</code> runs only if no error happened. <code>finally</code> always runs, error or not, which is useful for cleanup. Keep the <code>try</code> block small, containing only the line that might fail.",
     code: R`try:
    f = open("data.txt", encoding="utf-8")
except FileNotFoundError:
    print("No data yet.")
else:
    print(f.read())
    f.close()
finally:
    print("Finished loading.")`},
    {h: "Never catch everything silently",
     p: "A bare <code>except:</code> or <code>except Exception: pass</code> hides real bugs, including typos. Catch the <b>specific</b> errors you expect and know how to handle. Let everything else crash loudly so you can fix it."},
    {h: "Raising your own errors",
     p: "<code>raise ValueError(\"message\")</code> stops a function when it receives input it can't handle. The caller can then decide what to do. You saw this on Day 24.",
     code: R`def set_age(age):
    if age < 0:
        raise ValueError("Age can't be negative")
    return age`}
  ],
  exercises: [
    {q: "Write <code>ask_int(prompt)</code> that keeps asking until the user types a valid whole number, then returns it.", sol: R`def ask_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("That's not a whole number. Try again.")`},
    {q: "Read a file whose name the user types; print a friendly message if it doesn't exist.", sol: R`name = input("File: ")
try:
    with open(name, encoding="utf-8") as f:
        print(f.read())
except FileNotFoundError:
    print(f"There is no file called {name}.")`},
    {q: "Look up a key in a dict with <code>[]</code> and handle a <code>KeyError</code>.", sol: R`stock = {"apple": 3}
try:
    print(stock["mango"])
except KeyError:
    print("We don't sell that.")`}
  ],
  project: {
    title: "Crash-proof calculator",
    brief: "A calculator that no input can crash. It reads expressions like <code>12 / 4</code> or <code>2 ** 8</code>, validates every part, raises clear errors from the calculation function, and catches them in the main loop. Try your hardest to break it.",
    file: "day31_safe_calculator.py",
    code: R`# day31_safe_calculator.py
# A calculator that handles every kind of bad input.

OPERATIONS = {
    "+": lambda a, b: a + b,
    "-": lambda a, b: a - b,
    "*": lambda a, b: a * b,
    "/": lambda a, b: a / b,
    "**": lambda a, b: a ** b,
    "%": lambda a, b: a % b,
}


def parse(expression):
    """Split '12 / 4' into (12.0, '/', 4.0). Raises ValueError if malformed."""
    parts = expression.split()
    if len(parts) != 3:
        raise ValueError("Write it as: number operator number, with spaces.")
    left, op, right = parts
    if op not in OPERATIONS:
        raise ValueError(f"Unknown operator '{op}'. Use one of: {' '.join(OPERATIONS)}")
    try:
        return float(left), op, float(right)
    except ValueError:
        raise ValueError("Both sides must be numbers.")


def calculate(a, op, b):
    if op in ("/", "%") and b == 0:
        raise ZeroDivisionError("You can't divide by zero.")
    if op == "**" and abs(b) > 1000:
        raise OverflowError("That exponent is too large.")
    return OPERATIONS[op](a, b)


def main():
    print("Type a calculation like 12 / 4, or q to quit.")
    while True:
        expression = input("> ").strip()
        if expression.lower() == "q":
            break
        try:
            a, op, b = parse(expression)
            result = calculate(a, op, b)
        except (ValueError, ZeroDivisionError, OverflowError) as error:
            print("Error:", error)
        else:
            if isinstance(result, float) and result.is_integer():
                result = int(result)
            print("=", result)


main()`,
    explain: [
      ["OPERATIONS = {\"+\": lambda a, b: a + b, ...}", "A dict mapping symbols to small anonymous functions. <code>lambda</code> is covered properly on Day 37; here it simply means \"a function of a and b that returns a + b\"."],
      ["raise ValueError(\"Write it as...\")", "<code>parse</code> doesn't print anything. It raises errors with helpful messages and lets the caller decide how to show them."],
      ["try: return float(left), ... except ValueError: raise ValueError(...)", "We catch Python's technical message and replace it with one a user understands."],
      ["except (ValueError, ZeroDivisionError, OverflowError) as error:", "A tuple of error types catches any of them in one block. We catch only the errors we expect."],
      ["else: ... print(\"=\", result)", "The <code>else</code> block runs only when nothing failed, keeping the success path separate."]
    ],
    stretch: ["Remember the last result as <code>ans</code> so the user can type <code>ans * 2</code>.", "Add <code>sqrt 9</code> as a two-part expression."]
  },
  tests: ["Try: <code>12/4</code> without spaces, <code>a + 1</code>, <code>5 ^ 2</code>, <code>1 / 0</code>, <code>2 ** 99999</code>, an empty line, and <code>1 + 2 + 3</code>.", "Every case should print a message and keep the program running.", "Press Ctrl+C: that still stops the program, which is correct."]
};

L[32] = {
  intro: "JSON is the most common format for saving structured data and exchanging it between programs and web APIs. Today your to-do list learns to remember.",
  lesson: [
    {h: "What JSON looks like",
     p: "JSON (JavaScript Object Notation) is text that looks almost exactly like Python dicts and lists. Objects use <code>{}</code>, arrays <code>[]</code>, strings must use double quotes, and it has <code>true</code>, <code>false</code> and <code>null</code>.",
     code: R`{
  "name": "Amina",
  "age": 24,
  "skills": ["python", "sql"],
  "employed": true,
  "manager": null
}`},
    {h: "Type mapping",
     p: "dict ↔ object, list ↔ array, str ↔ string, int/float ↔ number, True/False ↔ true/false, None ↔ null. Tuples become arrays and come back as lists. Sets and dates can't be saved directly; convert them first (to a list, or to a date string)."},
    {h: "Saving and loading files",
     p: "<code>json.dump(data, f)</code> writes to an open file. <code>json.load(f)</code> reads it back. <code>indent=2</code> makes the file readable by humans.",
     code: R`import json

data = {"tasks": ["study", "exercise"], "streak": 5}
with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2)

with open("data.json", encoding="utf-8") as f:
    loaded = json.load(f)
print(loaded["streak"])`,
     out: "5"},
    {h: "Strings instead of files",
     p: "<code>json.dumps(data)</code> (with an s, for \"string\") returns JSON text; <code>json.loads(text)</code> parses it. You'll use these with web APIs on Day 56."},
    {h: "When the file is broken",
     p: "If a JSON file was edited badly, <code>json.load</code> raises <code>json.JSONDecodeError</code>. A robust program catches it alongside <code>FileNotFoundError</code>."}
  ],
  exercises: [
    {q: "Save a dict of three friends and their birthdays to <code>friends.json</code> with indentation, then open the file in VS Code.", sol: R`import json
friends = {"Amina": "03-14", "Omar": "07-02", "Sara": "11-30"}
with open("friends.json", "w", encoding="utf-8") as f:
    json.dump(friends, f, indent=2)`},
    {q: "Load it back and add a new friend, then save again.", sol: R`with open("friends.json", encoding="utf-8") as f:
    friends = json.load(f)
friends["Yusuf"] = "01-09"
with open("friends.json", "w", encoding="utf-8") as f:
    json.dump(friends, f, indent=2)`},
    {q: "What does <code>json.dumps({\"ok\": True, \"x\": None})</code> return?", sol: R`'{"ok": true, "x": null}'`}
  ],
  project: {
    title: "To-do list that remembers",
    brief: "Upgrade the Day 12 to-do list. Each task is now a dict with a title, a done flag and a priority, and the list is saved to <code>tasks.json</code> after every change. A missing or corrupted file is handled gracefully.",
    file: "day32_todo_json.py",
    code: R`# day32_todo_json.py
# A to-do list saved to JSON.

import json
from pathlib import Path

DATA_FILE = Path(__file__).parent / "tasks.json"


def load_tasks():
    try:
        with open(DATA_FILE, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except json.JSONDecodeError:
        print("Warning: tasks.json was damaged. Starting with an empty list.")
        return []


def save_tasks(tasks):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(tasks, f, indent=2)


def show(tasks):
    if not tasks:
        print("Nothing to do!")
        return
    for i, t in enumerate(tasks, start=1):
        mark = "x" if t["done"] else " "
        flag = " !" if t["priority"] == "high" else ""
        print(f"{i:>2}. [{mark}] {t['title']}{flag}")


def pick(tasks, verb):
    """Ask for a task number and return its index, or None."""
    try:
        n = int(input(f"Number to {verb}: "))
    except ValueError:
        print("Please type a number.")
        return None
    if 1 <= n <= len(tasks):
        return n - 1
    print("No task with that number.")
    return None


def main():
    tasks = load_tasks()
    while True:
        print()
        show(tasks)
        print("\na) Add  d) Done/undone  r) Remove  c) Clear finished  q) Quit")
        choice = input("Choose: ").strip().lower()

        if choice == "a":
            title = input("Task: ").strip()
            if title:
                high = input("High priority? (y/n): ").strip().lower() == "y"
                tasks.append({"title": title, "done": False,
                              "priority": "high" if high else "normal"})
        elif choice == "d":
            i = pick(tasks, "toggle")
            if i is not None:
                tasks[i]["done"] = not tasks[i]["done"]
        elif choice == "r":
            i = pick(tasks, "remove")
            if i is not None:
                print("Removed:", tasks.pop(i)["title"])
        elif choice == "c":
            tasks = [t for t in tasks if not t["done"]]
        elif choice == "q":
            break
        else:
            continue
        save_tasks(tasks)


main()`,
    explain: [
      ["DATA_FILE = Path(__file__).parent / \"tasks.json\"", "Saves next to the script, wherever you run it from. This fixes the working-directory surprise from Day 29."],
      ["except FileNotFoundError: return []", "The first run has no file; that's normal, not an error the user needs to see."],
      ["{\"title\": ..., \"done\": False, \"priority\": ...}", "Each task is a dict, so adding a field later (like a due date) doesn't break anything."],
      ["if i is not None:", "Index 0 is a valid task but is falsy, so <code>if i:</code> would be a bug. Always compare with <code>None</code> explicitly."],
      ["save_tasks(tasks) at the bottom of the loop", "Every action that changes something reaches this line; invalid choices <code>continue</code> past it."]
    ],
    stretch: ["Add a due date stored as a <code>\"YYYY-MM-DD\"</code> string, and show overdue tasks first (after Day 38).", "Sort high-priority tasks to the top when displaying."]
  },
  tests: ["Add tasks, quit, run again: they're still there.", "Open <code>tasks.json</code> and edit a title by hand; the program should load it.", "Break the file on purpose (delete a bracket) and run again.", "Try removing task 0 and typing letters as the number."]
};

L[33] = {
  intro: "CSV files are the universal format for tables: spreadsheets export them, datasets come as them, and pandas reads them. Today you read and write CSV with the <code>csv</code> module.",
  lesson: [
    {h: "What CSV is",
     p: "Comma-Separated Values: one row per line, columns separated by commas, usually with a header row. A value containing a comma is wrapped in quotes. That quoting is why you should use the <code>csv</code> module rather than <code>split(\",\")</code>.",
     code: R`date,category,amount,note
2026-10-01,food,12.50,"Lunch, with friends"
2026-10-02,transport,3.00,Bus`},
    {h: "Reading rows as dicts",
     p: "<code>csv.DictReader</code> uses the header row as keys, giving one dict per row. Every value is a <b>string</b>, so convert numbers yourself. Open CSV files with <code>newline=\"\"</code>, as the documentation recommends.",
     code: R`import csv
with open("expenses.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):
        print(row["category"], float(row["amount"]))`},
    {h: "Writing rows",
     p: "<code>csv.DictWriter(f, fieldnames=[...])</code> writes dicts. Call <code>writeheader()</code> once for a new file. In append mode, only write the header if the file is new.",
     code: R`rows = [{"name": "Amina", "score": 88}, {"name": "Omar", "score": 72}]
with open("scores.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "score"])
    writer.writeheader()
    writer.writerows(rows)`},
    {h: "Plain reader and writer",
     p: "<code>csv.reader</code> gives each row as a list, and <code>csv.writer</code> writes lists. DictReader is usually clearer because you use column names instead of positions."}
  ],
  exercises: [
    {q: "Write a CSV of three countries with their population, then read it back and print the total population.", sol: R`import csv
rows = [{"country": "Kenya", "population": 55}, {"country": "Somalia", "population": 18},
        {"country": "Ethiopia", "population": 126}]
with open("countries.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["country", "population"])
    w.writeheader()
    w.writerows(rows)

with open("countries.csv", newline="", encoding="utf-8") as f:
    print(sum(int(r["population"]) for r in csv.DictReader(f)))`},
    {q: "Open your CSV in a spreadsheet program (Excel, Google Sheets or LibreOffice). Then save a sheet from there as CSV and read it in Python.", sol: R`# No code solution: the point is to see that the same file
# works in both worlds. That's why data scientists love CSV.`}
  ],
  project: {
    title: "Expense tracker",
    brief: "Record expenses (date, category, amount, note) to <code>expenses.csv</code>. List them, total them by category with a percentage breakdown, and filter by month.",
    file: "day33_expenses.py",
    code: R`# day33_expenses.py
# Tracks expenses in a CSV file.

import csv
from datetime import date
from pathlib import Path

CSV_FILE = Path(__file__).parent / "expenses.csv"
FIELDS = ["date", "category", "amount", "note"]


def load_expenses():
    if not CSV_FILE.exists():
        return []
    with open(CSV_FILE, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row["amount"] = float(row["amount"])
    return rows


def add_expense(category, amount, note=""):
    is_new = not CSV_FILE.exists()
    with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        if is_new:
            writer.writeheader()
        writer.writerow({"date": date.today().isoformat(), "category": category,
                         "amount": f"{amount:.2f}", "note": note})


def totals_by_category(expenses):
    totals = {}
    for e in expenses:
        totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]
    return totals


def show_list(expenses):
    for e in expenses:
        print(f"{e['date']}  {e['category']:<12}{e['amount']:>9.2f}  {e['note']}")
    print(f"{'':12}{'TOTAL':<12}{sum(e['amount'] for e in expenses):>9.2f}")


def show_summary(expenses):
    totals = totals_by_category(expenses)
    grand = sum(totals.values())
    for category in sorted(totals, key=totals.get, reverse=True):
        share = totals[category] / grand
        print(f"{category:<12}{totals[category]:>9.2f}  {share:>5.0%}  {'#' * round(share * 30)}")


def main():
    while True:
        print("\n1) Add  2) List  3) Summary  4) This month  5) Quit")
        choice = input("Choose: ")
        if choice == "1":
            category = input("Category: ").strip().lower() or "other"
            try:
                amount = float(input("Amount: "))
            except ValueError:
                print("Amount must be a number.")
                continue
            add_expense(category, amount, input("Note: ").strip())
            print("Saved.")
        elif choice in ("2", "3", "4"):
            expenses = load_expenses()
            if choice == "4":
                month = date.today().isoformat()[:7]          # "2026-10"
                expenses = [e for e in expenses if e["date"].startswith(month)]
            if not expenses:
                print("No expenses recorded.")
            elif choice == "3":
                show_summary(expenses)
            else:
                show_list(expenses)
        elif choice == "5":
            break


main()`,
    explain: [
      ["newline=\"\"", "Stops the csv module from writing blank lines between rows on Windows."],
      ["row[\"amount\"] = float(row[\"amount\"])", "CSV values are always strings. We convert once when loading, so the rest of the program works with numbers."],
      ["is_new = not CSV_FILE.exists()", "Checked before opening, because opening in append mode creates the file."],
      ["sorted(totals, key=totals.get, reverse=True)", "Sorts the categories by their total, biggest first. <code>key=</code> is explained fully on Day 37."],
      ["date.today().isoformat()[:7]", "ISO dates start with year-month, so slicing gives the current month and <code>startswith</code> filters by it."]
    ],
    stretch: ["Add a monthly budget per category and warn when you go over.", "Export the summary to a second CSV file."]
  },
  tests: ["Add a note containing a comma, then list: it should display correctly.", "Open <code>expenses.csv</code> in a spreadsheet.", "Type <code>ten</code> as an amount.", "Run the summary with one category only."]
};

L[34] = {
  intro: "As programs grow, one file isn't enough. Today you split code into modules and a package, and learn how Python's import system finds them.",
  lesson: [
    {h: "Every .py file is a module",
     p: "If <code>helpers.py</code> sits next to <code>main.py</code>, then <code>import helpers</code> in main loads it, and you call <code>helpers.greet()</code>. Python runs the imported file's top-level code once, the first time it's imported.",
     code: R`# helpers.py
def greet(name):
    return f"Hello, {name}"

# main.py
import helpers
print(helpers.greet("Amina"))`},
    {h: "if __name__ == \"__main__\":",
     p: "When a file is run directly, its <code>__name__</code> is <code>\"__main__\"</code>. When it's imported, <code>__name__</code> is the module name. So code under this check runs only when you run the file, not when another file imports it. Put your <code>main()</code> call there from now on.",
     code: R`def main():
    print("Running as a program")

if __name__ == "__main__":
    main()`},
    {h: "Packages",
     p: "A <b>package</b> is a folder of modules with an <code>__init__.py</code> file (it can be empty). Import from it with dots: <code>from expense_tracker.storage import load_expenses</code>. Inside the package, modules can import each other with a leading dot: <code>from .storage import load_expenses</code>.",
     code: R`day34_expenses/
├── main.py
└── expense_tracker/
    ├── __init__.py
    ├── storage.py
    ├── reports.py
    └── cli.py`},
    {h: "How to split code",
     p: "Group by responsibility. A common split is: <b>storage</b> (reading and writing data), <b>logic</b> (calculations, no input or print), and <b>interface</b> (menus, input, printing). Logic modules that never call <code>input()</code> or <code>print()</code> are the easiest to test and reuse."},
    {h: "Running it",
     p: "Run <code>python main.py</code> from the <code>day34_expenses</code> folder. Python looks for imports in the folder of the script you ran, then the standard library, then installed packages. Never name your own file <code>random.py</code> or <code>csv.py</code>, or it will hide the real module."}
  ],
  exercises: [
    {q: "Create <code>mathtools.py</code> with <code>area_circle(r)</code> and <code>area_square(s)</code>, then import and use them from <code>main.py</code> in two different ways.", sol: R`# main.py
import mathtools
from mathtools import area_square

print(mathtools.area_circle(2))
print(area_square(3))`},
    {q: "Add a test call to the bottom of <code>mathtools.py</code> under <code>if __name__ == \"__main__\":</code>. Run both files and notice when it runs.", sol: R`# bottom of mathtools.py
if __name__ == "__main__":
    print(area_circle(1))   # only when running mathtools.py directly`}
  ],
  project: {
    title: "Expense tracker as a package",
    brief: "Reorganise yesterday's expense tracker into a package with three modules: storage, reports and the command-line interface. <code>main.py</code> just starts it. Behaviour stays exactly the same; only the structure changes.",
    file: "day34_expenses/",
    files: [
      ["expense_tracker/__init__.py", R`"""Expense tracker package: storage, reports and command-line interface."""`],
      ["expense_tracker/storage.py", R`"""Reading and writing expenses to CSV. No printing here."""

import csv
from datetime import date
from pathlib import Path

CSV_FILE = Path(__file__).parent.parent / "expenses.csv"
FIELDS = ["date", "category", "amount", "note"]


def load_expenses(path=CSV_FILE):
    if not path.exists():
        return []
    with open(path, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row["amount"] = float(row["amount"])
    return rows


def add_expense(category, amount, note="", path=CSV_FILE):
    is_new = not path.exists()
    with open(path, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        if is_new:
            writer.writeheader()
        writer.writerow({"date": date.today().isoformat(), "category": category,
                         "amount": f"{amount:.2f}", "note": note})`],
      ["expense_tracker/reports.py", R`"""Calculations on lists of expenses. No input or printing here."""


def total(expenses):
    return sum(e["amount"] for e in expenses)


def totals_by_category(expenses):
    totals = {}
    for e in expenses:
        totals[e["category"]] = totals.get(e["category"], 0) + e["amount"]
    return totals


def for_month(expenses, month):
    """month is a 'YYYY-MM' string."""
    return [e for e in expenses if e["date"].startswith(month)]


def breakdown(expenses):
    """Return (category, amount, share) tuples, biggest first."""
    totals = totals_by_category(expenses)
    grand = sum(totals.values())
    ordered = sorted(totals, key=totals.get, reverse=True)
    return [(c, totals[c], totals[c] / grand) for c in ordered]


if __name__ == "__main__":
    sample = [{"date": "2026-10-01", "category": "food", "amount": 10.0},
              {"date": "2026-10-02", "category": "bus", "amount": 5.0}]
    print(breakdown(sample))`],
      ["expense_tracker/cli.py", R`"""The text menu: all input() and print() calls live here."""

from datetime import date

from .reports import breakdown, for_month, total
from .storage import add_expense, load_expenses


def show_list(expenses):
    for e in expenses:
        print(f"{e['date']}  {e['category']:<12}{e['amount']:>9.2f}  {e['note']}")
    print(f"{'':12}{'TOTAL':<12}{total(expenses):>9.2f}")


def show_summary(expenses):
    for category, amount, share in breakdown(expenses):
        print(f"{category:<12}{amount:>9.2f}  {share:>5.0%}  {'#' * round(share * 30)}")


def main():
    while True:
        print("\n1) Add  2) List  3) Summary  4) This month  5) Quit")
        choice = input("Choose: ")
        if choice == "1":
            category = input("Category: ").strip().lower() or "other"
            try:
                amount = float(input("Amount: "))
            except ValueError:
                print("Amount must be a number.")
                continue
            add_expense(category, amount, input("Note: ").strip())
            print("Saved.")
        elif choice in ("2", "3", "4"):
            expenses = load_expenses()
            if choice == "4":
                expenses = for_month(expenses, date.today().isoformat()[:7])
            if not expenses:
                print("No expenses recorded.")
            elif choice == "3":
                show_summary(expenses)
            else:
                show_list(expenses)
        elif choice == "5":
            break`],
      ["main.py", R`"""Start the expense tracker."""

from expense_tracker.cli import main

if __name__ == "__main__":
    main()`]
    ],
    explain: [
      ["expense_tracker/__init__.py", "Marks the folder as a package. A docstring is enough content."],
      ["Path(__file__).parent.parent / \"expenses.csv\"", "<code>storage.py</code> is inside the package folder, so we go up two levels to keep the CSV next to <code>main.py</code>."],
      ["path=CSV_FILE parameters", "Functions accept a path but default to the real file. Tests on Day 52 will pass a temporary file instead."],
      ["from .reports import ...", "The dot means \"from this package\". Relative imports keep the package working even if you rename its folder."],
      ["reports.py has no input() or print()", "Pure calculation functions. The <code>__main__</code> block lets you check them quickly with <code>python -m expense_tracker.reports</code>."]
    ],
    stretch: ["Add an <code>export.py</code> module that writes the summary to a CSV.", "Run <code>python -m expense_tracker.reports</code> from the project folder and explain why <code>-m</code> is needed."]
  },
  tests: ["Run <code>python main.py</code> and check everything works exactly like Day 33.", "Copy yesterday's <code>expenses.csv</code> next to <code>main.py</code>; your old data should load.", "In the interpreter, <code>from expense_tracker.reports import total</code> and call it on a small list."]
};

L[35] = {
  intro: "Recursion is when a function calls itself. It's the natural way to handle things that contain smaller versions of themselves, like folders inside folders.",
  lesson: [
    {h: "The two parts",
     p: "Every recursive function needs a <b>base case</b>, where it returns without calling itself, and a <b>recursive case</b>, where it calls itself on a <b>smaller</b> problem. Each call moves closer to the base case.",
     code: R`def countdown(n):
    if n == 0:              # base case
        print("Liftoff!")
        return
    print(n)
    countdown(n - 1)        # smaller problem

countdown(3)`,
     out: "3\n2\n1\nLiftoff!"},
    {h: "Returning values",
     p: "The classic example is factorial: 5! = 5 × 4!. Each call waits for the smaller call's answer, then uses it.",
     code: R`def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))   # 120`},
    {h: "The call stack",
     p: "Each call is placed on the <b>call stack</b> until it returns. <code>factorial(3)</code> waits for <code>factorial(2)</code>, which waits for <code>factorial(1)</code>, which returns 1; then the answers flow back up. Python limits the depth to about 1000 calls. Forget the base case and you get <b>RecursionError</b>."},
    {h: "When to use it",
     p: "For simple counting, a loop is clearer and faster in Python. Recursion shines with <b>nested structures</b>: folder trees, nested lists, JSON documents, and tree-shaped data, including the decision trees you'll build on Day 89.",
     code: R`def flatten(items):
    result = []
    for item in items:
        if isinstance(item, list):
            result.extend(flatten(item))   # recurse into sub-lists
        else:
            result.append(item)
    return result

print(flatten([1, [2, [3, 4]], 5]))`,
     out: "[1, 2, 3, 4, 5]"}
  ],
  exercises: [
    {q: "Write a recursive <code>sum_list(numbers)</code>. Hint: the sum is the first item plus the sum of the rest.", sol: R`def sum_list(numbers):
    if not numbers:
        return 0
    return numbers[0] + sum_list(numbers[1:])`},
    {q: "Write a recursive <code>reverse(text)</code>.", sol: R`def reverse(text):
    if len(text) <= 1:
        return text
    return reverse(text[1:]) + text[0]`},
    {q: "Write <code>depth(items)</code> that returns how deeply a list is nested: <code>[1, [2, [3]]]</code> gives 3.", sol: R`def depth(items):
    if not isinstance(items, list):
        return 0
    deepest = 0
    for item in items:
        deepest = max(deepest, depth(item))
    return 1 + deepest`}
  ],
  project: {
    title: "Folder tree printer",
    brief: "Print a folder and everything inside it as a tree, like the <code>tree</code> command, with sizes, a depth limit, and a summary of files, folders and total size.",
    file: "day35_tree.py",
    code: R`# day35_tree.py
# Prints a folder as a tree using recursion.

from pathlib import Path

SKIP = {".git", "__pycache__", ".venv", "node_modules"}


def human_size(num_bytes):
    for unit in ("B", "KB", "MB", "GB"):
        if num_bytes < 1024:
            return f"{num_bytes:.0f} {unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f} TB"


def tree(folder, prefix="", depth=0, max_depth=3):
    """Print the contents of folder. Returns (files, folders, bytes)."""
    try:
        items = sorted(folder.iterdir(), key=lambda p: (p.is_file(), p.name.lower()))
    except PermissionError:
        print(prefix + "└── [permission denied]")
        return 0, 0, 0

    items = [p for p in items if p.name not in SKIP and not p.name.startswith(".")]
    files, folders, size = 0, 0, 0

    for index, item in enumerate(items):
        is_last = index == len(items) - 1
        branch = "└── " if is_last else "├── "

        if item.is_dir():
            folders += 1
            print(f"{prefix}{branch}{item.name}/")
            if depth + 1 < max_depth:
                extension = "    " if is_last else "│   "
                f, d, s = tree(item, prefix + extension, depth + 1, max_depth)
                files, folders, size = files + f, folders + d, size + s
        else:
            item_size = item.stat().st_size
            files += 1
            size += item_size
            print(f"{prefix}{branch}{item.name}  ({human_size(item_size)})")

    return files, folders, size


def main():
    answer = input("Folder (blank for this one): ").strip()
    root = Path(answer).expanduser() if answer else Path.cwd()
    if not root.is_dir():
        print("That isn't a folder.")
        return
    max_depth = int(input("How many levels deep? ") or 3)

    print(f"{root.name}/")
    files, folders, size = tree(root, max_depth=max_depth)
    print(f"\n{folders} folders, {files} files, {human_size(size)} shown")


if __name__ == "__main__":
    main()`,
    explain: [
      ["f, d, s = tree(item, prefix + extension, depth + 1, max_depth)", "The recursive case: the same function handles a sub-folder, with a longer prefix and a depth one greater. Its totals are added to ours."],
      ["if depth + 1 < max_depth:", "A depth limit doubles as a base case. The other base case is a folder with no sub-folders: the loop simply finishes."],
      ["\"    \" if is_last else \"│   \"", "Under the last item there's no vertical line to continue, which is what makes the drawing look right."],
      ["key=lambda p: (p.is_file(), p.name.lower())", "Folders sort first (False before True), then alphabetically. More on <code>lambda</code> keys on Day 37."],
      ["except PermissionError:", "Some system folders can't be read. We show a note and carry on rather than crashing the whole tree."]
    ],
    stretch: ["Show only files with a given extension, such as <code>.py</code>.", "Add an option to list the 5 biggest files found."]
  },
  tests: ["Run it on your <code>python-100-days</code> folder.", "Try depth 1 and depth 10.", "Run it on an empty folder.", "Compare the file count with your operating system's file explorer."]
};

L[36] = {
  intro: "Today is about thinking like a programmer: breaking down problems, writing classic algorithms by hand, and measuring how fast they are.",
  lesson: [
    {h: "A problem-solving routine",
     p: "1) Restate the problem in your own words. 2) Work through a small example by hand. 3) Write the steps in plain language. 4) Turn the steps into code. 5) Test with normal cases, edge cases (empty, one item, duplicates) and large inputs."},
    {h: "Linear search",
     p: "Check each item in turn until you find the target. It works on any list, but in the worst case it checks every item.",
     code: R`def linear_search(items, target):
    for i, item in enumerate(items):
        if item == target:
            return i
    return -1`},
    {h: "Binary search",
     p: "On a <b>sorted</b> list, look at the middle item. If the target is smaller, discard the right half; if larger, discard the left. Each step halves the remaining list. It's the strategy from the Day 9 guessing game.",
     code: R`def binary_search(items, target):
    low, high = 0, len(items) - 1
    while low <= high:
        mid = (low + high) // 2
        if items[mid] == target:
            return mid
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`},
    {h: "Big-O: how work grows",
     p: "Big-O describes how the number of steps grows with input size <i>n</i>. Linear search is <b>O(n)</b>: double the list, double the work. Binary search is <b>O(log n)</b>: a million items need only about 20 steps. Simple sorts like bubble sort are <b>O(n²)</b>: double the list, four times the work. Python's built-in <code>sorted</code> is <b>O(n log n)</b>."},
    {h: "Bubble sort",
     p: "Repeatedly walk through the list swapping neighbours that are in the wrong order. Large values \"bubble\" to the end. You'll never use it in real code (use <code>sorted</code>), but writing it trains your thinking about loops and indexes."}
  ],
  exercises: [
    {q: "By hand: how many steps would binary search need, at most, for 1,000 items? For 1,000,000?", sol: R`# 2**10 = 1024, so about 10 steps for 1,000.
# 2**20 is about 1,000,000, so about 20 steps.`},
    {q: "Write <code>find_max(numbers)</code> without using <code>max()</code>.", sol: R`def find_max(numbers):
    best = numbers[0]
    for n in numbers[1:]:
        if n > best:
            best = n
    return best`},
    {q: "Write <code>has_duplicates(items)</code> two ways: with nested loops (O(n²)) and with a set (O(n)).", sol: R`def has_duplicates_slow(items):
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if items[i] == items[j]:
                return True
    return False

def has_duplicates_fast(items):
    return len(set(items)) != len(items)`}
  ],
  project: {
    title: "Search and sort by hand",
    brief: "Implement linear search, binary search, bubble sort and selection sort, each counting its comparisons. Then race them on lists of growing size and see Big-O with your own eyes.",
    file: "day36_algorithms.py",
    code: R`# day36_algorithms.py
# Classic search and sort algorithms that count their comparisons.

import random
import time


def linear_search(items, target):
    steps = 0
    for i, item in enumerate(items):
        steps += 1
        if item == target:
            return i, steps
    return -1, steps


def binary_search(items, target):
    low, high, steps = 0, len(items) - 1, 0
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if items[mid] == target:
            return mid, steps
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1, steps


def bubble_sort(items):
    items = items[:]                     # sort a copy
    steps = 0
    for end in range(len(items) - 1, 0, -1):
        swapped = False
        for i in range(end):
            steps += 1
            if items[i] > items[i + 1]:
                items[i], items[i + 1] = items[i + 1], items[i]
                swapped = True
        if not swapped:                  # already sorted: stop early
            break
    return items, steps


def selection_sort(items):
    items = items[:]
    steps = 0
    for i in range(len(items)):
        smallest = i
        for j in range(i + 1, len(items)):
            steps += 1
            if items[j] < items[smallest]:
                smallest = j
        items[i], items[smallest] = items[smallest], items[i]
    return items, steps


def main():
    random.seed(1)
    print(f"{'n':>6}{'linear':>10}{'binary':>8}{'bubble':>12}{'selection':>12}{'sorted() ms':>13}")
    for n in (10, 100, 1000, 3000):
        data = random.sample(range(n * 10), n)
        target = data[-1]                       # worst-ish case for linear search
        ordered = sorted(data)

        _, lin = linear_search(data, target)
        _, bin_steps = binary_search(ordered, target)
        bubbled, bub = bubble_sort(data)
        selected, sel = selection_sort(data)
        assert bubbled == selected == ordered   # all three must agree

        start = time.perf_counter()
        sorted(data)
        ms = (time.perf_counter() - start) * 1000

        print(f"{n:>6}{lin:>10}{bin_steps:>8}{bub:>12,}{sel:>12,}{ms:>13.3f}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["items = items[:]", "Copying first means the function doesn't change the caller's list. Each sort gets the same unsorted data."],
      ["items[i], items[i + 1] = items[i + 1], items[i]", "Tuple unpacking swaps two items in one line, with no temporary variable."],
      ["if not swapped: break", "An optimisation: a pass with no swaps means the list is sorted."],
      ["assert bubbled == selected == ordered", "<code>assert</code> stops the program if the condition is False. It's a quick self-check that your algorithms are correct, and a preview of testing on Day 52."],
      ["time.perf_counter()", "A precise clock for measuring how long code takes. More on performance on Day 71."]
    ],
    stretch: ["Add insertion sort.", "Plot the step counts later, on Day 78, to see the curves."]
  },
  tests: ["Search for a value that isn't in the list.", "Sort an empty list and a one-item list.", "Look at the table: when n grows 10×, how much do linear and bubble sort steps grow?"]
};

L[37] = {
  intro: "Sorting real data means sorting by a field: by score, by date, by name. Today you learn <code>key=</code> functions and <code>lambda</code>.",
  lesson: [
    {h: "Functions are values",
     p: "In Python you can pass a function to another function, like you passed <code>int</code> to <code>map</code> on Day 25. <code>sorted</code>, <code>min</code>, <code>max</code> and <code>list.sort</code> accept a <code>key</code> function: they call it on each item and sort by its result.",
     code: R`words = ["banana", "Fig", "apple"]
print(sorted(words))              # capitals first
print(sorted(words, key=str.lower))
print(sorted(words, key=len))`,
     out: "['Fig', 'apple', 'banana']\n['apple', 'banana', 'Fig']\n['Fig', 'apple', 'banana']"},
    {h: "lambda",
     p: "<code>lambda x: expression</code> creates a small function without a name. It's handy for one-off keys. <code>lambda p: p[\"score\"]</code> is the same as a <code>def</code> that returns <code>p[\"score\"]</code>.",
     code: R`players = [{"name": "Amina", "score": 88}, {"name": "Omar", "score": 95}]
best = max(players, key=lambda p: p["score"])
print(best["name"])`,
     out: "Omar"},
    {h: "Sorting by several fields",
     p: "Return a tuple from the key. Tuples compare item by item, so ties on the first field are broken by the second. To sort one numeric field descending and another ascending, negate the number.",
     code: R`# highest score first, then fastest time
ranked = sorted(results, key=lambda r: (-r["score"], r["time"]))`},
    {h: "When not to use lambda",
     p: "If the logic needs more than one simple expression, or you use it more than once, write a normal named <code>def</code>. Don't assign a lambda to a name (<code>f = lambda x: ...</code>); that's what <code>def</code> is for."}
  ],
  exercises: [
    {q: "Sort <code>[(\"Amina\", 24), (\"Omar\", 31), (\"Sara\", 19)]</code> by age, youngest first.", sol: R`people = [("Amina", 24), ("Omar", 31), ("Sara", 19)]
print(sorted(people, key=lambda p: p[1]))`},
    {q: "Find the longest word in a sentence with <code>max</code> and a key.", sol: R`print(max(sentence.split(), key=len))`},
    {q: "Sort a dict of word counts by count, highest first, and print the top 3.", sol: R`counts = {"python": 5, "data": 3, "ml": 7, "ai": 2}
for word, n in sorted(counts.items(), key=lambda kv: kv[1], reverse=True)[:3]:
    print(word, n)`}
  ],
  project: {
    title: "Game leaderboard ranker",
    brief: "Rank game results by score (highest first), breaking ties by fastest time, then by name. Show proper ranks where tied players share a position, and let the user re-sort the table by any column.",
    file: "day37_leaderboard.py",
    code: R`# day37_leaderboard.py
# Ranks players with multi-field sort keys.

RESULTS = [
    {"name": "Amina", "score": 920, "time": 312, "level": 7},
    {"name": "Omar", "score": 1050, "time": 340, "level": 8},
    {"name": "Sara", "score": 920, "time": 298, "level": 7},
    {"name": "Yusuf", "score": 780, "time": 250, "level": 6},
    {"name": "Hodan", "score": 1050, "time": 340, "level": 9},
    {"name": "Bilal", "score": 640, "time": 410, "level": 5},
]


def rank_key(r):
    """Highest score, then fastest time, then name A-Z."""
    return (-r["score"], r["time"], r["name"])


def with_ranks(results):
    """Return (rank, result) pairs. Equal score and time share a rank."""
    ordered = sorted(results, key=rank_key)
    ranked = []
    for position, r in enumerate(ordered, start=1):
        if ranked and (r["score"], r["time"]) == (ranked[-1][1]["score"], ranked[-1][1]["time"]):
            rank = ranked[-1][0]
        else:
            rank = position
        ranked.append((rank, r))
    return ranked


def show(rows):
    print(f"{'#':>3}  {'Name':<8}{'Score':>7}{'Time':>7}{'Level':>7}")
    for rank, r in rows:
        print(f"{rank:>3}  {r['name']:<8}{r['score']:>7}{r['time']:>6}s{r['level']:>7}")


def main():
    show(with_ranks(RESULTS))

    fastest = min(RESULTS, key=lambda r: r["time"])
    print(f"\nFastest run: {fastest['name']} ({fastest['time']}s)")

    columns = {"n": "name", "s": "score", "t": "time", "l": "level"}
    while True:
        choice = input("\nSort by n)ame s)core t)ime l)evel, or q to quit: ").strip().lower()
        if choice == "q":
            break
        if choice not in columns:
            continue
        field = columns[choice]
        descending = field in ("score", "level")
        rows = sorted(RESULTS, key=lambda r: r[field], reverse=descending)
        show(list(enumerate(rows, start=1)))


if __name__ == "__main__":
    main()`,
    explain: [
      ["return (-r[\"score\"], r[\"time\"], r[\"name\"])", "A tuple key. The minus sign makes higher scores sort first while time still sorts lowest first."],
      ["def rank_key(r):", "The main ranking rule is a named function because it's important and documented. Short one-off keys stay as lambdas."],
      ["ranked[-1][1][\"score\"]", "<code>ranked[-1]</code> is the previous (rank, result) pair; <code>[1]</code> is its result dict. Ties copy the previous rank, giving 1, 1, 3."],
      ["key=lambda r: r[field]", "The lambda uses the <code>field</code> variable chosen by the user, so one line handles every column."]
    ],
    out: "  #  Name      Score   Time  Level\n  1  Hodan      1050   340s      9\n  1  Omar       1050   340s      8\n  3  Sara        920   298s      7\n  4  Amina       920   312s      7\n  5  Yusuf       780   250s      6\n  6  Bilal       640   410s      5",
    stretch: ["Break remaining ties by level, highest first.", "Load the results from a CSV file using Day 33's code."]
  },
  tests: ["Check that Hodan and Omar share rank 1 and the next rank is 3.", "Sort by each column.", "Add a player with the same score as Sara but a slower time."]
};

L[38] = {
  intro: "Dates are everywhere in real data: timestamps, deadlines, birthdays. Today you learn the <code>datetime</code> module properly.",
  lesson: [
    {h: "date, datetime and timedelta",
     p: "<code>date</code> is a calendar day, <code>datetime</code> a day plus a time, and <code>timedelta</code> a duration. Subtracting two dates gives a timedelta; adding a timedelta to a date gives a new date.",
     code: R`from datetime import date, datetime, timedelta

today = date.today()
exam = date(2026, 12, 15)
print((exam - today).days, "days to go")
print(today + timedelta(weeks=2))
print(datetime.now())`},
    {h: "Parsing and formatting",
     p: "<code>strptime</code> (string parse time) reads text into a datetime using a format; <code>strftime</code> (string format time) writes one out. Common codes: <code>%Y</code> year, <code>%m</code> month, <code>%d</code> day, <code>%H:%M</code> time, <code>%A</code> weekday name, <code>%B</code> month name.",
     code: R`d = datetime.strptime("24/10/2026", "%d/%m/%Y").date()
print(d.strftime("%A %d %B %Y"))
print(d.isoformat())`,
     out: "Saturday 24 October 2026\n2026-10-24"},
    {h: "ISO format",
     p: "<code>YYYY-MM-DD</code> is the international standard. It sorts correctly as text, and <code>date.fromisoformat(\"2026-10-24\")</code> reads it without a format string. Use it for storing dates in files."},
    {h: "Comparing and replacing",
     p: "Dates compare with <code>&lt;</code> and <code>==</code>. <code>d.replace(year=2027)</code> returns a copy with one part changed. Watch out: replacing the year of 29 February in a non-leap year raises ValueError.",
     code: R`birthday = date(2004, 2, 29)
try:
    print(birthday.replace(year=2027))
except ValueError:
    print("No 29 February in 2027")`}
  ],
  exercises: [
    {q: "Print what weekday you were born on.", sol: R`from datetime import date
print(date(2001, 3, 14).strftime("%A"))`},
    {q: "Print the date 100 days from today.", sol: R`print(date.today() + timedelta(days=100))`},
    {q: "Read a date typed like <code>2026-12-31</code> and say whether it's in the past or future.", sol: R`d = date.fromisoformat(input("Date (YYYY-MM-DD): "))
print("future" if d > date.today() else "past or today")`}
  ],
  project: {
    title: "Birthday and event countdown",
    brief: "Enter your birthday to get your exact age and a countdown to your next birthday, then see a sorted countdown for a list of upcoming events. Handles 29 February birthdays and bad date input.",
    file: "day38_countdown.py",
    code: R`# day38_countdown.py
# Age, next birthday and event countdowns.

from datetime import date

EVENTS = {
    "Finish Level 2": "2026-11-15",
    "Start Machine Learning": "2027-01-20",
    "Python 100 complete": "2027-02-01",
}


def ask_date(prompt):
    while True:
        text = input(prompt).strip()
        try:
            return date.fromisoformat(text)
        except ValueError:
            print("Please use the format YYYY-MM-DD, e.g. 2001-03-14.")


def age_on(birthday, today):
    years = today.year - birthday.year
    if (today.month, today.day) < (birthday.month, birthday.day):
        years -= 1            # birthday hasn't happened yet this year
    return years


def next_birthday(birthday, today):
    for year in (today.year, today.year + 1):
        try:
            candidate = birthday.replace(year=year)
        except ValueError:                     # 29 February in a non-leap year
            candidate = date(year, 3, 1)
        if candidate >= today:
            return candidate


def describe(days):
    if days == 0:
        return "today!"
    if days < 0:
        return f"{-days} days ago"
    weeks, rest = divmod(days, 7)
    return f"in {days} days ({weeks} weeks, {rest} days)"


def main():
    today = date.today()
    birthday = ask_date("Your birthday (YYYY-MM-DD): ")
    if birthday > today:
        print("That's in the future!")
        return

    upcoming = next_birthday(birthday, today)
    print(f"\nYou are {age_on(birthday, today)} years old.")
    print(f"You were born on a {birthday.strftime('%A')}.")
    print(f"Next birthday: {upcoming.strftime('%A %d %B %Y')}, {describe((upcoming - today).days)}")
    print(f"You have been alive for {(today - birthday).days:,} days.")

    print("\nEvents:")
    events = sorted((date.fromisoformat(d), name) for name, d in EVENTS.items())
    for when, name in events:
        print(f"  {when:%d %b %Y}  {name:<24}{describe((when - today).days)}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["(today.month, today.day) < (birthday.month, birthday.day)", "Tuple comparison checks month first, then day, which is exactly \"has the birthday happened yet this year?\"."],
      ["except ValueError: candidate = date(year, 3, 1)", "A 29 February birthday is celebrated on 1 March in non-leap years."],
      ["divmod(days, 7)", "A built-in that returns <code>(days // 7, days % 7)</code> in one call."],
      ["sorted((date.fromisoformat(d), name) for ...)", "Tuples sort by their first item, so putting the date first sorts events chronologically."],
      ["f\"{when:%d %b %Y}\"", "f-strings accept date format codes directly after the colon."]
    ],
    stretch: ["Load events from a JSON file and add a menu to add new ones.", "Show how many working days (Monday to Friday) remain until each event."]
  },
  tests: ["Use a birthday that was yesterday and one that is tomorrow.", "Use 2004-02-29.", "Type <code>14/03/2001</code> and check the error message.", "Check your age by hand."]
};

L[39] = {
  intro: "Python's real power comes from the hundreds of thousands of third-party packages on PyPI. Today you learn to install them safely in a virtual environment.",
  lesson: [
    {h: "Why virtual environments",
     p: "Different projects need different packages and versions. A <b>virtual environment</b> (venv) is a private folder of packages for one project, so installing something for one project can't break another. Every serious Python project, especially ML projects, uses one."},
    {h: "Create and activate",
     p: "From your project folder, create a venv called <code>.venv</code>, then activate it. Your prompt shows <code>(.venv)</code> when it's active. <code>deactivate</code> turns it off. In VS Code, run <b>Python: Select Interpreter</b> and choose the <code>.venv</code> one.",
     code: R`python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate`},
    {h: "pip",
     p: "With the venv active, <code>pip</code> installs into it. <code>pip list</code> shows what's installed, and <code>pip show qrcode</code> gives details. Packages come from <b>pypi.org</b>; check a package's page before installing, because anyone can publish there.",
     code: R`pip install "qrcode[pil]"
pip list
pip install --upgrade qrcode
pip uninstall qrcode`},
    {h: "requirements.txt",
     p: "<code>pip freeze &gt; requirements.txt</code> records the exact versions you installed. Anyone (including future you) can recreate the environment with <code>pip install -r requirements.txt</code>. Commit <code>requirements.txt</code> to Git, but never the <code>.venv</code> folder: add <code>.venv/</code> to <code>.gitignore</code>.",
     code: R`pip freeze > requirements.txt
pip install -r requirements.txt`}
  ],
  exercises: [
    {q: "Create a venv in a new folder <code>day39</code>, activate it, and run <code>pip list</code>. How many packages are there?", sol: R`# Only pip itself (and maybe setuptools): a fresh environment is nearly empty.`},
    {q: "Install the <code>rich</code> package and print a coloured message with it.", sol: R`# pip install rich
from rich import print
print("[bold green]Day 39 complete![/bold green]")`},
    {q: "Create <code>requirements.txt</code> and a <code>.gitignore</code> that ignores <code>.venv/</code>.", sol: R`pip freeze > requirements.txt
echo ".venv/" > .gitignore`}
  ],
  project: {
    title: "QR code generator",
    brief: "Use the third-party <code>qrcode</code> package to turn text, links or Wi-Fi details into QR code images, and preview the code right in the terminal. Set it up properly with a venv and <code>requirements.txt</code>.",
    file: "day39_qr/",
    files: [
      ["setup (terminal)", R`mkdir day39_qr
cd day39_qr
python -m venv .venv
# activate it (see the lesson), then:
pip install "qrcode[pil]"
pip freeze > requirements.txt
echo ".venv/" > .gitignore`],
      ["qr_maker.py", R`# qr_maker.py
# Creates QR code images with the third-party qrcode package.

from pathlib import Path

import qrcode

OUTPUT = Path(__file__).parent / "codes"


def wifi_text(name, password, security="WPA"):
    """The standard text format phones understand for joining Wi-Fi."""
    return f"WIFI:T:{security};S:{name};P:{password};;"


def make_qr(data, filename):
    qr = qrcode.QRCode(border=2)
    qr.add_data(data)
    qr.make(fit=True)

    qr.print_ascii(invert=True)          # preview in the terminal

    OUTPUT.mkdir(exist_ok=True)
    path = OUTPUT / f"{filename}.png"
    qr.make_image(fill_color="black", back_color="white").save(path)
    return path


def main():
    print("1) Text or link  2) Wi-Fi login")
    choice = input("Choose: ").strip()
    if choice == "2":
        data = wifi_text(input("Network name: "), input("Password: "))
    else:
        data = input("Text or link: ").strip()

    if not data:
        print("Nothing to encode.")
        return

    name = input("File name (no extension): ").strip() or "qr"
    path = make_qr(data, name)
    print(f"Saved {path}")


if __name__ == "__main__":
    main()`]
    ],
    explain: [
      ["import qrcode", "Third-party imports go after standard-library imports, separated by a blank line. This only works when the venv with qrcode installed is active."],
      ["qrcode.QRCode(border=2)", "Creating an object and then calling its methods (<code>add_data</code>, <code>make</code>) is how many libraries work. You'll build your own classes on Day 41."],
      ["qr.print_ascii(invert=True)", "Draws the code with text blocks so you can scan it straight from the terminal."],
      ["\"WIFI:T:WPA;S:...;P:...;;\"", "A real standard: scanning this with a phone camera offers to join the network."],
      ["requirements.txt", "Lists qrcode and its dependency (Pillow) with exact versions."]
    ],
    stretch: ["Read a list of links from a text file and create one QR image per line.", "Add a coloured version using <code>fill_color=\"darkblue\"</code>."]
  },
  tests: ["Scan the terminal preview and the PNG with your phone.", "Deactivate the venv and run the script: read the <code>ModuleNotFoundError</code>, then reactivate.", "Delete <code>.venv</code>, recreate it, and reinstall with <code>pip install -r requirements.txt</code>."]
};

L[40] = {
  intro: "Level 2 capstone. You build a personal finance app that combines functions, modules, files, JSON, CSV, exceptions, comprehensions, sorting and dates. Take two or three days if you need them.",
  lesson: [
    {h: "Plan the features",
     p: "Record income and expenses with a date, category and note. Set a monthly budget per category. See a monthly report with income, spending, balance and budget warnings. Search transactions. Export a month to CSV for a spreadsheet. Everything is saved to a JSON file."},
    {h: "Plan the structure",
     p: "Use the Day 34 split. <code>storage.py</code> loads and saves JSON. <code>finance.py</code> holds pure calculation functions with no <code>input</code> or <code>print</code>. <code>app.py</code> has the menus. <code>main.py</code> starts it.",
     code: R`day40_finance/
├── main.py
├── finance_app/
│   ├── __init__.py
│   ├── storage.py
│   ├── finance.py
│   └── app.py
└── data.json        (created on first run)`},
    {h: "Plan the data",
     p: "One JSON document holds everything. Amounts are positive; the <code>type</code> field says income or expense. Dates are ISO strings so they sort and filter as text.",
     code: R`{
  "budgets": {"food": 200, "transport": 60},
  "transactions": [
    {"date": "2026-10-03", "type": "expense", "category": "food",
     "amount": 12.5, "note": "Lunch"}
  ]
}`},
    {h: "Review checklist",
     p: "If any of these feel shaky, revisit the day before starting: functions and return values (21–22), scope (23), built-ins (25), comprehensions (27–28), files and paths (29–30), exceptions (31), JSON (32), CSV (33), packages (34), sorting with keys (37) and dates (38)."}
  ],
  exercises: [
    {q: "Before reading the code, write <code>finance.py</code>'s function list yourself: name, parameters and what each returns.", sol: R`# month_of(t) -> "YYYY-MM"
# for_month(transactions, month) -> list
# summary(transactions) -> (income, spending, balance)
# spending_by_category(transactions) -> dict
# budget_status(transactions, budgets) -> list of (category, spent, budget, share)
# search(transactions, text) -> list`},
    {q: "Write the <code>summary</code> function using generator expressions.", sol: R`def summary(transactions):
    income = sum(t["amount"] for t in transactions if t["type"] == "income")
    spending = sum(t["amount"] for t in transactions if t["type"] == "expense")
    return income, spending, income - spending`}
  ],
  project: {
    title: "Personal finance command-line app",
    brief: "Build the app described in the lesson. Try writing each module yourself first, using the plan, then compare with the code below. Run it with <code>python main.py</code> from the <code>day40_finance</code> folder.",
    file: "day40_finance/",
    files: [
      ["finance_app/__init__.py", R`"""Personal finance app: storage, calculations and menus."""`],
      ["finance_app/storage.py", R`"""Load and save the app's data as JSON."""

import json
from pathlib import Path

DATA_FILE = Path(__file__).parent.parent / "data.json"


def load(path=DATA_FILE):
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        data = {}
    except json.JSONDecodeError:
        backup = path.with_suffix(".broken.json")
        path.replace(backup)
        print(f"Your data file was damaged and was moved to {backup.name}.")
        data = {}
    return {"budgets": data.get("budgets", {}),
            "transactions": data.get("transactions", [])}


def save(data, path=DATA_FILE):
    temp = path.with_suffix(".tmp")
    with open(temp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    temp.replace(path)          # swap in the new file only once it is fully written`],
      ["finance_app/finance.py", R`"""Pure calculations on transactions. No input() or print() here."""

import csv


def month_of(t):
    return t["date"][:7]


def for_month(transactions, month):
    return [t for t in transactions if month_of(t) == month]


def summary(transactions):
    income = sum(t["amount"] for t in transactions if t["type"] == "income")
    spending = sum(t["amount"] for t in transactions if t["type"] == "expense")
    return income, spending, income - spending


def spending_by_category(transactions):
    totals = {}
    for t in transactions:
        if t["type"] == "expense":
            totals[t["category"]] = totals.get(t["category"], 0) + t["amount"]
    return totals


def budget_status(transactions, budgets):
    """Return (category, spent, budget, share) for each budgeted category, worst first."""
    spent = spending_by_category(transactions)
    rows = [(c, spent.get(c, 0), b, spent.get(c, 0) / b) for c, b in budgets.items() if b > 0]
    return sorted(rows, key=lambda r: r[3], reverse=True)


def search(transactions, text):
    text = text.lower()
    return [t for t in transactions
            if text in t["note"].lower() or text in t["category"].lower()]


def months(transactions):
    return sorted({month_of(t) for t in transactions}, reverse=True)


def export_csv(transactions, path):
    fields = ["date", "type", "category", "amount", "note"]
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(sorted(transactions, key=lambda t: t["date"]))
    return len(transactions)`],
      ["finance_app/app.py", R`"""Menus and input. Uses storage and finance."""

from datetime import date
from pathlib import Path

from . import finance, storage


def ask_amount(prompt):
    while True:
        try:
            value = float(input(prompt))
            if value > 0:
                return round(value, 2)
            print("Enter a positive amount.")
        except ValueError:
            print("Enter a number, e.g. 12.50")


def ask_date():
    text = input("Date (YYYY-MM-DD, blank for today): ").strip()
    if not text:
        return date.today().isoformat()
    try:
        return date.fromisoformat(text).isoformat()
    except ValueError:
        print("Invalid date, using today.")
        return date.today().isoformat()


def ask_month(data):
    available = finance.months(data["transactions"])
    default = date.today().isoformat()[:7]
    if available:
        print("Months with data:", ", ".join(available))
    return input(f"Month (YYYY-MM, blank for {default}): ").strip() or default


def print_rows(rows):
    for t in sorted(rows, key=lambda t: t["date"]):
        sign = "+" if t["type"] == "income" else "-"
        print(f"  {t['date']}  {t['category']:<12}{sign}{t['amount']:>9.2f}  {t['note']}")


def add_transaction(data, kind):
    data["transactions"].append({
        "date": ask_date(),
        "type": kind,
        "category": input("Category: ").strip().lower() or "other",
        "amount": ask_amount("Amount: "),
        "note": input("Note: ").strip(),
    })
    storage.save(data)
    print("Saved.")


def report(data):
    month = ask_month(data)
    rows = finance.for_month(data["transactions"], month)
    if not rows:
        print("No transactions that month.")
        return
    income, spending, balance = finance.summary(rows)
    print(f"\n=== {month} ===")
    print(f"Income   {income:>10.2f}")
    print(f"Spending {spending:>10.2f}")
    print(f"Balance  {balance:>10.2f}")

    print("\nSpending by category:")
    by_cat = finance.spending_by_category(rows)
    for cat in sorted(by_cat, key=by_cat.get, reverse=True):
        print(f"  {cat:<12}{by_cat[cat]:>9.2f}")

    status = finance.budget_status(rows, data["budgets"])
    if status:
        print("\nBudgets:")
        for cat, spent, budget, share in status:
            warning = "  OVER BUDGET" if share > 1 else ("  close" if share > 0.8 else "")
            print(f"  {cat:<12}{spent:>8.2f} / {budget:<8.2f}{share:>5.0%}{warning}")


def set_budget(data):
    category = input("Category: ").strip().lower()
    if category:
        data["budgets"][category] = ask_amount("Monthly budget: ")
        storage.save(data)
        print("Budget saved.")


def main():
    data = storage.load()
    actions = {
        "1": ("Add expense", lambda: add_transaction(data, "expense")),
        "2": ("Add income", lambda: add_transaction(data, "income")),
        "3": ("Monthly report", lambda: report(data)),
        "4": ("Set a budget", lambda: set_budget(data)),
        "5": ("Search", lambda: print_rows(finance.search(data["transactions"], input("Search: ")))),
        "6": ("Export month to CSV", lambda: export(data)),
    }
    while True:
        print()
        for key, (label, _) in actions.items():
            print(f"{key}) {label}")
        print("q) Quit")
        choice = input("Choose: ").strip().lower()
        if choice == "q":
            break
        if choice in actions:
            actions[choice][1]()


def export(data):
    month = ask_month(data)
    rows = finance.for_month(data["transactions"], month)
    path = Path.cwd() / f"finance-{month}.csv"
    count = finance.export_csv(rows, path)
    print(f"Exported {count} transactions to {path.name}")`],
      ["main.py", R`"""Start the personal finance app."""

from finance_app.app import main

if __name__ == "__main__":
    main()`]
    ],
    explain: [
      ["data.get(\"budgets\", {})", "Fills in anything missing, so an empty, damaged or older data file still gives the app the shape it expects."],
      ["temp.replace(path)", "Writing to a temporary file and then swapping it in means a crash mid-save can never leave a half-written data file. Real applications do this."],
      ["finance.py has no input() or print()", "All the logic can be tested with plain lists of dicts, which is exactly what you'll do on Day 52."],
      ["actions = {\"1\": (\"Add expense\", lambda: ...)}", "A dict of menu entries: each holds a label and a function to call. Adding a menu item is one line, and the loop never changes."],
      ["sorted(rows, key=lambda r: r[3], reverse=True)", "Budgets closest to or over their limit are listed first."]
    ],
    stretch: ["Add recurring transactions, such as rent on the 1st of every month.", "Add a yearly report with a text bar chart per month.", "Import transactions from a bank's CSV export."]
  },
  tests: ["Add income and several expenses across two months, then run each report.", "Set a budget lower than what you spent and check the warning.", "Search by part of a note.", "Export a month and open the CSV in a spreadsheet.", "Quit and restart: everything should still be there.", "Break <code>data.json</code> by hand and check the app recovers and keeps a backup."]
};

})(window.LESSONS);
