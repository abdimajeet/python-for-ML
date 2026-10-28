# day18_text_compare.py
# Compares the vocabulary of two texts using sets.

PUNCTUATION = ".,!?;:\"'()"

text_a = input("First text:  ")
text_b = input("Second text: ")

words_a = set()
for word in text_a.lower().split():
    words_a.add(word.strip(PUNCTUATION))

words_b = set()
for word in text_b.lower().split():
    words_b.add(word.strip(PUNCTUATION))

words_a.discard("")
words_b.discard("")

shared = words_a & words_b
only_a = words_a - words_b
only_b = words_b - words_a
everything = words_a | words_b

print()
print(f"Shared words ({len(shared)}):", ", ".join(sorted(shared)))
print(f"Only in first ({len(only_a)}):", ", ".join(sorted(only_a)))
print(f"Only in second ({len(only_b)}):", ", ".join(sorted(only_b)))

if everything:
    similarity = len(shared) / len(everything)
    print(f"Similarity: {similarity:.0%}")
