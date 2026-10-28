# day06_bmi.py
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
print("That is classed as", category + ".")
