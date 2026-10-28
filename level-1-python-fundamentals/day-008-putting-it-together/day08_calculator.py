# day08_calculator.py
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
    print("Unknown operation:", op)
