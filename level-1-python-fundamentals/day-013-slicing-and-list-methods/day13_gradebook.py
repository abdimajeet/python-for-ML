# day13_gradebook.py
# Collects scores, then prints statistics about them.

scores = []

print("Enter scores one at a time. Type 'done' to finish.")
while True:
    entry = input("Score: ")
    if entry == "done":
        break
    scores.append(float(entry))

if not scores:
    print("No scores entered.")
else:
    ranked = sorted(scores, reverse=True)
    average = sum(scores) / len(scores)

    passed = 0
    for s in scores:
        if s >= 50:
            passed += 1

    print()
    print("Students:", len(scores))
    print("Highest: ", max(scores))
    print("Lowest:  ", min(scores))
    print("Average: ", round(average, 1))
    print("Top 3:   ", ranked[:3])
    print("Passed:  ", passed, "of", len(scores))
