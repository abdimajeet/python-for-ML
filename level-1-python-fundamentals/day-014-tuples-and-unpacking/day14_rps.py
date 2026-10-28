# day14_rps.py
# Rock, paper, scissors: first to 3 wins.

import random

MOVES = ("rock", "paper", "scissors")
# Each pair is (winner, loser).
WINS = (("rock", "scissors"), ("scissors", "paper"), ("paper", "rock"))

player_score, computer_score = 0, 0

while player_score < 3 and computer_score < 3:
    player = input("rock, paper or scissors? ").lower()
    if player not in MOVES:
        print("That's not a valid move.")
        continue

    computer = random.choice(MOVES)
    print("Computer chose", computer)

    if player == computer:
        print("Draw.")
    elif (player, computer) in WINS:
        print("You win this round!")
        player_score += 1
    else:
        print("Computer wins this round.")
        computer_score += 1

    print("Score:", player_score, "-", computer_score)
    print()

if player_score == 3:
    print("You won the match!")
else:
    print("The computer won the match.")
