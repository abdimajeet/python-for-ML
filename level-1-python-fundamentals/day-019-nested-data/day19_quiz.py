# day19_quiz.py
# A multiple-choice quiz driven entirely by data.

QUIZ = [
    {
        "question": "What does len('python') return?",
        "options": {"a": "5", "b": "6", "c": "7", "d": "An error"},
        "answer": "b",
    },
    {
        "question": "Which type is immutable?",
        "options": {"a": "list", "b": "dict", "c": "tuple", "d": "set"},
        "answer": "c",
    },
    {
        "question": "What is 7 // 2?",
        "options": {"a": "3.5", "b": "3", "c": "4", "d": "1"},
        "answer": "b",
    },
    {
        "question": "Which creates an empty set?",
        "options": {"a": "{}", "b": "[]", "c": "set()", "d": "()"},
        "answer": "c",
    },
]

score = 0
mistakes = []

for number, item in enumerate(QUIZ, start=1):
    print()
    print(f"Q{number}. {item['question']}")
    for letter, text in item["options"].items():
        print(f"   {letter}) {text}")

    reply = input("Your answer: ").strip().lower()
    while reply not in item["options"]:
        reply = input("Please type a, b, c or d: ").strip().lower()

    if reply == item["answer"]:
        print("Correct!")
        score += 1
    else:
        right = item["answer"]
        print(f"Wrong. The answer was {right}) {item['options'][right]}")
        mistakes.append(item["question"])

print()
print(f"You scored {score} out of {len(QUIZ)} ({score / len(QUIZ):.0%}).")
if mistakes:
    print("Questions to review:")
    for q in mistakes:
        print(" -", q)
