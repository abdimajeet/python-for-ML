# day36_algorithms.py
# Classic search and sort algorithms that count their comparisons.

import random
import time


def linear_search(items, target):
    steps = 0
    for i, item in enumerate(items):
        steps += 1
        if item == target:
            return i, steps
    return -1, steps


def binary_search(items, target):
    low, high, steps = 0, len(items) - 1, 0
    while low <= high:
        steps += 1
        mid = (low + high) // 2
        if items[mid] == target:
            return mid, steps
        if items[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1, steps


def bubble_sort(items):
    items = items[:]                     # sort a copy
    steps = 0
    for end in range(len(items) - 1, 0, -1):
        swapped = False
        for i in range(end):
            steps += 1
            if items[i] > items[i + 1]:
                items[i], items[i + 1] = items[i + 1], items[i]
                swapped = True
        if not swapped:                  # already sorted: stop early
            break
    return items, steps


def selection_sort(items):
    items = items[:]
    steps = 0
    for i in range(len(items)):
        smallest = i
        for j in range(i + 1, len(items)):
            steps += 1
            if items[j] < items[smallest]:
                smallest = j
        items[i], items[smallest] = items[smallest], items[i]
    return items, steps


def main():
    random.seed(1)
    print(f"{'n':>6}{'linear':>10}{'binary':>8}{'bubble':>12}{'selection':>12}{'sorted() ms':>13}")
    for n in (10, 100, 1000, 3000):
        data = random.sample(range(n * 10), n)
        target = data[-1]                       # worst-ish case for linear search
        ordered = sorted(data)

        _, lin = linear_search(data, target)
        _, bin_steps = binary_search(ordered, target)
        bubbled, bub = bubble_sort(data)
        selected, sel = selection_sort(data)
        assert bubbled == selected == ordered   # all three must agree

        start = time.perf_counter()
        sorted(data)
        ms = (time.perf_counter() - start) * 1000

        print(f"{n:>6}{lin:>10}{bin_steps:>8}{bub:>12,}{sel:>12,}{ms:>13.3f}")


if __name__ == "__main__":
    main()
