# day41_pet.py
# A virtual pet whose state lives inside an object.

import random


class Pet:
    def __init__(self, name):
        self.name = name
        self.hunger = 3      # 0 = full, 10 = starving
        self.boredom = 3     # 0 = happy, 10 = very bored
        self.energy = 7      # 0 = exhausted, 10 = full of energy

    def mood(self):
        worst = max(self.hunger, self.boredom, 10 - self.energy)
        if worst <= 3:
            return "happy"
        if worst <= 6:
            return "okay"
        if worst <= 8:
            return "grumpy"
        return "miserable"

    def status(self):
        print(f"{self.name} is {self.mood()}. "
              f"Hunger {self.hunger}/10, boredom {self.boredom}/10, energy {self.energy}/10")

    def pass_time(self):
        self.hunger = min(10, self.hunger + 1)
        self.boredom = min(10, self.boredom + 1)
        self.energy = max(0, self.energy - 1)

    def feed(self):
        self.hunger = max(0, self.hunger - 4)
        print(f"{self.name} munches happily.")

    def play(self):
        if self.energy < 2:
            print(f"{self.name} is too tired to play.")
            return
        self.boredom = max(0, self.boredom - 5)
        self.energy -= 2
        print(f"You play {random.choice(['fetch', 'tag', 'hide and seek'])} with {self.name}.")

    def sleep(self):
        self.energy = 10
        print(f"{self.name} curls up and sleeps. Zzz...")


def main():
    pet = Pet(input("Name your pet: ").strip() or "Pixel")
    actions = {"f": pet.feed, "p": pet.play, "s": pet.sleep}

    while True:
        print()
        pet.status()
        choice = input("f)eed  p)lay  s)leep  w)ait  q)uit: ").strip().lower()
        if choice == "q":
            print(f"Goodbye from {pet.name}!")
            break
        if choice in actions:
            actions[choice]()
        pet.pass_time()


if __name__ == "__main__":
    main()
