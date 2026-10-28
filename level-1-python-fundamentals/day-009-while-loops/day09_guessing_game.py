# day09_guessing_game.py
# Guess the secret number with higher/lower hints.

import random

secret = random.randint(1, 100)
attempts = 0

print("I'm thinking of a number between 1 and 100.")

while True:
    guess = int(input("Your guess: "))
    attempts += 1

    if guess < secret:
        print("Too low.")
    elif guess > secret:
        print("Too high.")
    else:
        print("Correct! It was", secret)
        break

print("You got it in", attempts, "attempts.")
if attempts <= 7:
    print("Excellent strategy!")
