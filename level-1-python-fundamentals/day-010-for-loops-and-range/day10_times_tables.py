# day10_times_tables.py
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
    print(line)
