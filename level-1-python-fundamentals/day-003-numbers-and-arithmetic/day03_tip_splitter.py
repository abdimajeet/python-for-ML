# day03_tip_splitter.py
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
print("Each pays: ", round(each, 2))
