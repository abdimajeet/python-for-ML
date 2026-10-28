# day25_report_cards.py
# Builds report cards from parallel lists using built-in functions.

names = ["Amina", "Omar", "Sara", "Yusuf", "Hodan"]
maths = [88, 45, 92, 67, 74]
english = [79, 58, 85, 49, 90]
science = [91, 52, 77, 71, 66]

PASS_MARK = 50
SUBJECTS = ("Maths", "English", "Science")


def grade(average):
    if average >= 85:
        return "A"
    if average >= 70:
        return "B"
    if average >= 55:
        return "C"
    return "D"


def passed(mark):
    return mark >= PASS_MARK


print(f"{'#':<3}{'Name':<8}{'Maths':>7}{'Eng':>6}{'Sci':>6}{'Avg':>7}  Grade  Note")
print("-" * 52)

averages = []
for number, (name, m, e, s) in enumerate(zip(names, maths, english, science), start=1):
    marks = [m, e, s]
    avg = sum(marks) / len(marks)
    averages.append(avg)

    if all(map(passed, marks)):
        note = "passed all"
    else:
        failed = [subj for subj, mark in zip(SUBJECTS, marks) if not passed(mark)]
        note = "resit " + ", ".join(failed)
    if any([mark >= 90 for mark in marks]):
        note += ", award!"

    print(f"{number:<3}{name:<8}{m:>7}{e:>6}{s:>6}{avg:>7.1f}  {grade(avg):^5}  {note}")

print()
best_index = averages.index(max(averages))
print(f"Class average: {sum(averages) / len(averages):.1f}")
print(f"Top student:   {names[best_index]} ({max(averages):.1f})")
print(f"Maths passes:  {len(list(filter(passed, maths)))} of {len(maths)}")
