# day07_checks.py
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
    print("Grade F")
