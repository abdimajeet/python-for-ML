# day02_mad_libs.py
# Builds a short story from words the user types.

print("Let's write a silly story together!")
print()

adjective = input("Enter an adjective (e.g. sleepy): ")
animal = input("Enter an animal: ")
verb = input("Enter a verb ending in -ing: ")
place = input("Enter a place: ")
food = input("Enter a food: ")

story = ("Yesterday a " + adjective + " " + animal +
         " was " + verb + " around " + place +
         ", looking for " + food + ".")

print()
print("Here is your story:")
print(story)
