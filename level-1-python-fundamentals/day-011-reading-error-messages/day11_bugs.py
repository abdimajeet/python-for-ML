# 1  SyntaxError: the closing quote was missing
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
    print("Pass")
