# day04_unit_converter.py
# Converts kilometres to miles and Celsius to Fahrenheit.

KM_TO_MILES = 0.621371   # constants are written in CAPITALS by convention

print("=== Unit Converter ===")

km = float(input("Distance in kilometres: "))
miles = km * KM_TO_MILES
print(km, "km is", round(miles, 2), "miles")

print()

celsius = float(input("Temperature in Celsius: "))
fahrenheit = celsius * 9 / 5 + 32
print(celsius, "°C is", round(fahrenheit, 1), "°F")
