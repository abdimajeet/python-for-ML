# day20_adventure.py
# Level 1 capstone: a small text adventure.

ROOMS = {
    "Hall": {
        "description": "A dusty hall. Portraits watch you.",
        "exits": {"east": "Garden"},
        "item": "lamp",
    },
    "Garden": {
        "description": "An overgrown garden under a grey sky.",
        "exits": {"west": "Hall", "north": "Library", "east": "Shed", "south": "Gate"},
        "item": None,
    },
    "Library": {
        "description": "Shelves of old books. Something glints on a desk.",
        "exits": {"south": "Garden"},
        "item": "key",
    },
    "Shed": {
        "description": "A cramped shed that smells of oil.",
        "exits": {"west": "Garden"},
        "item": "map",
    },
    "Gate": {
        "description": "A heavy iron gate. It is locked.",
        "exits": {"north": "Garden"},
        "item": None,
    },
}

HELP = "Commands: go <direction>, take, inventory, look, help, quit"

current = "Hall"
inventory = []
visited = set()
moves = 0

print("=== Escape the Manor ===")
print("Find the key and reach the gate.")
print(HELP)

while True:
    room = ROOMS[current]

    # show the room when the player first arrives
    if current not in visited:
        print()
        print(f"-- {current} --")
        print(room["description"])
        visited.add(current)

    # win condition
    if current == "Gate" and "key" in inventory:
        print("The key turns. The gate creaks open. You escaped!")
        break

    command = input("> ").strip().lower()
    parts = command.split()
    if not parts:
        continue
    verb = parts[0]
    target = parts[1] if len(parts) > 1 else ""

    if verb == "quit":
        print("You give up and sit down in the dust.")
        break

    elif verb == "help":
        print(HELP)

    elif verb == "look":
        print(room["description"])
        if room["item"]:
            print(f"You see a {room['item']}.")
        print("Exits:", ", ".join(room["exits"]))

    elif verb == "go":
        if target in room["exits"]:
            current = room["exits"][target]
            moves += 1
            visited.discard(current)   # describe the room again on entry
        else:
            print("You can't go that way.")

    elif verb == "take":
        if room["item"]:
            inventory.append(room["item"])
            print(f"You take the {room['item']}.")
            room["item"] = None
        else:
            print("There is nothing here to take.")

    elif verb == "inventory":
        if inventory:
            print("You carry:", ", ".join(inventory))
        else:
            print("Your pockets are empty.")

    else:
        print("I don't understand. Type 'help'.")

print(f"Moves made: {moves}")
