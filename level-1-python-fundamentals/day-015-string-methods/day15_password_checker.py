# day15_password_checker.py
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
    print("To improve it: " + ", ".join(tips) + ".")
