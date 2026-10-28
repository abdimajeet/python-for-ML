# day12_todo.py
# A to-do list that lives in memory while the program runs.

tasks = []

while True:
    print()
    print("1) View tasks  2) Add task  3) Remove task  4) Quit")
    choice = input("Choose: ")

    if choice == "1":
        if not tasks:
            print("Nothing to do!")
        else:
            number = 1
            for task in tasks:
                print(number, "-", task)
                number += 1

    elif choice == "2":
        task = input("New task: ")
        tasks.append(task)
        print("Added.")

    elif choice == "3":
        number = int(input("Task number to remove: "))
        if 1 <= number <= len(tasks):
            removed = tasks.pop(number - 1)
            print("Removed:", removed)
        else:
            print("No task with that number.")

    elif choice == "4":
        print("Goodbye!")
        break

    else:
        print("Please choose 1 to 4.")
