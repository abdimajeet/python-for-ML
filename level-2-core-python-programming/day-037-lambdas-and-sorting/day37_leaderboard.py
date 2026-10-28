# day37_leaderboard.py
# Ranks players with multi-field sort keys.

RESULTS = [
    {"name": "Amina", "score": 920, "time": 312, "level": 7},
    {"name": "Omar", "score": 1050, "time": 340, "level": 8},
    {"name": "Sara", "score": 920, "time": 298, "level": 7},
    {"name": "Yusuf", "score": 780, "time": 250, "level": 6},
    {"name": "Hodan", "score": 1050, "time": 340, "level": 9},
    {"name": "Bilal", "score": 640, "time": 410, "level": 5},
]


def rank_key(r):
    """Highest score, then fastest time, then name A-Z."""
    return (-r["score"], r["time"], r["name"])


def with_ranks(results):
    """Return (rank, result) pairs. Equal score and time share a rank."""
    ordered = sorted(results, key=rank_key)
    ranked = []
    for position, r in enumerate(ordered, start=1):
        if ranked and (r["score"], r["time"]) == (ranked[-1][1]["score"], ranked[-1][1]["time"]):
            rank = ranked[-1][0]
        else:
            rank = position
        ranked.append((rank, r))
    return ranked


def show(rows):
    print(f"{'#':>3}  {'Name':<8}{'Score':>7}{'Time':>7}{'Level':>7}")
    for rank, r in rows:
        print(f"{rank:>3}  {r['name']:<8}{r['score']:>7}{r['time']:>6}s{r['level']:>7}")


def main():
    show(with_ranks(RESULTS))

    fastest = min(RESULTS, key=lambda r: r["time"])
    print(f"\nFastest run: {fastest['name']} ({fastest['time']}s)")

    columns = {"n": "name", "s": "score", "t": "time", "l": "level"}
    while True:
        choice = input("\nSort by n)ame s)core t)ime l)evel, or q to quit: ").strip().lower()
        if choice == "q":
            break
        if choice not in columns:
            continue
        field = columns[choice]
        descending = field in ("score", "level")
        rows = sorted(RESULTS, key=lambda r: r[field], reverse=descending)
        show(list(enumerate(rows, start=1)))


if __name__ == "__main__":
    main()
