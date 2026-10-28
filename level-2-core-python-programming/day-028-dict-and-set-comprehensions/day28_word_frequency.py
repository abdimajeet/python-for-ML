# day28_word_frequency.py
# Counts word frequency in a text and draws a bar chart.

from collections import Counter

TEXT = """Python is a programming language that lets you work quickly
and integrate systems more effectively. Python is powerful, and fast;
plays well with others; runs everywhere; is friendly and easy to learn.
Python is used for web development, data analysis, machine learning,
and automation. Learning Python is a great first step into machine learning."""

STOP_WORDS = {"a", "an", "and", "the", "is", "to", "for", "of", "in", "that",
              "with", "you", "it", "into", "more", "are", "on", "be"}
PUNCTUATION = ".,;:!?\"'()"


def tokenize(text):
    """Split text into clean lowercase words."""
    return [w.strip(PUNCTUATION).lower() for w in text.split() if w.strip(PUNCTUATION)]


def count_words(words):
    counts = {}
    for w in words:
        counts[w] = counts.get(w, 0) + 1
    return counts


def bar_chart(pairs, width=30):
    biggest = pairs[0][1]
    for word, count in pairs:
        bar = "█" * round(count / biggest * width)
        print(f"{word:>12} | {bar} {count}")


def main():
    text = input("Paste text (or press Enter to use the sample): ").strip() or TEXT

    words = tokenize(text)
    counts = count_words(words)
    meaningful = {w: c for w, c in counts.items() if w not in STOP_WORDS}
    repeated = {w for w, c in meaningful.items() if c > 1}

    print()
    print(f"Total words:       {len(words)}")
    print(f"Unique words:      {len(counts)}")
    print(f"Repeated keywords: {', '.join(sorted(repeated))}")
    print()

    top = Counter(meaningful).most_common(8)
    if top:
        bar_chart(top)


main()
