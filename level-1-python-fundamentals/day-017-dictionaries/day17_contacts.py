# day17_contacts.py
# A contact book backed by a dictionary.

contacts = {}

while True:
    print()
    print("1) Add/update  2) Look up  3) Delete  4) List all  5) Quit")
    choice = input("Choose: ")

    if choice == "1":
        name = input("Name: ").strip().title()
        phone = input("Phone: ").strip()
        if name in contacts:
            print(f"Updated {name}.")
        else:
            print(f"Added {name}.")
        contacts[name] = phone

    elif choice == "2":
        name = input("Name: ").strip().title()
        phone = contacts.get(name)
        if phone:
            print(f"{name}: {phone}")
        else:
            print(f"No contact called {name}.")

    elif choice == "3":
        name = input("Name: ").strip().title()
        if name in contacts:
            del contacts[name]
            print(f"Deleted {name}.")
        else:
            print(f"No contact called {name}.")

    elif choice == "4":
        if not contacts:
            print("Your contact book is empty.")
        for name in sorted(contacts):
            print(f"{name:<20}{contacts[name]}")

    elif choice == "5":
        print("Goodbye!")
        break

    else:
        print("Please choose 1 to 5.")
