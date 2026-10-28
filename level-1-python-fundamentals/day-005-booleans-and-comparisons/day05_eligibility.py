# day05_eligibility.py
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
print("Gets a senior discount:", is_senior)
