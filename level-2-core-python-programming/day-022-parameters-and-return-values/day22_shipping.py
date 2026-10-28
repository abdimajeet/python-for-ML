# day22_shipping.py
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


main()
