# day26_dice_and_passwords.py
# A dice roller (random) and a password generator (secrets).

import random
import secrets
import string


def parse_dice(notation):
    """Turn '3d6+2' into (3, 6, 2). '+N' is optional."""
    notation = notation.lower().replace(" ", "")
    bonus = 0
    if "+" in notation:
        notation, bonus_text = notation.split("+")
        bonus = int(bonus_text)
    count_text, sides_text = notation.split("d")
    count = int(count_text) if count_text else 1   # "d20" means 1d20
    return count, int(sides_text), bonus


def roll(count, sides, bonus=0):
    rolls = [random.randint(1, sides) for _ in range(count)]
    return rolls, sum(rolls) + bonus


def make_password(length=16):
    """Return a password containing at least one of each character type."""
    pools = [string.ascii_lowercase, string.ascii_uppercase,
             string.digits, "!@#$%^&*-_=+?"]
    if length < len(pools):
        length = len(pools)

    chars = [secrets.choice(pool) for pool in pools]   # one from each pool
    everything = "".join(pools)
    while len(chars) < length:
        chars.append(secrets.choice(everything))

    secrets.SystemRandom().shuffle(chars)   # secure shuffle
    return "".join(chars)


def main():
    while True:
        print()
        print("1) Roll dice  2) Make password  3) Quit")
        choice = input("Choose: ")
        if choice == "1":
            notation = input("Dice (e.g. 2d6, d20, 3d8+4): ")
            count, sides, bonus = parse_dice(notation)
            rolls, total = roll(count, sides, bonus)
            extra = f" + {bonus}" if bonus else ""
            print(f"Rolls: {rolls}{extra}  →  total {total}")
        elif choice == "2":
            length = int(input("Length (at least 4): "))
            print("Password:", make_password(length))
        elif choice == "3":
            break


main()
