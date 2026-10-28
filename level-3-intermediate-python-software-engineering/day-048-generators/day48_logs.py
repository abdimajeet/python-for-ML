# day48_logs.py
# Analyses a large log file with a pipeline of generators.

import random
from datetime import datetime, timedelta
from pathlib import Path

LOG_FILE = Path(__file__).parent / "server.log"
PAGES = ["/", "/login", "/products", "/cart", "/checkout", "/api/data"]
STATUSES = [200] * 90 + [301] * 3 + [404] * 4 + [500] * 3


def make_fake_log(lines=200_000, seed=1):
    """Write a log file with one request per line."""
    rng = random.Random(seed)
    time = datetime(2026, 10, 1)
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        for _ in range(lines):
            time += timedelta(seconds=rng.randint(0, 3))
            ip = f"10.0.{rng.randint(0, 255)}.{rng.randint(1, 254)}"
            f.write(f"{time.isoformat()} {ip} GET {rng.choice(PAGES)} "
                    f"{rng.choice(STATUSES)} {rng.randint(5, 900)}ms\n")


def read_lines(path):
    with open(path, encoding="utf-8") as f:
        for line in f:
            yield line.rstrip("\n")


def parse(lines):
    for line in lines:
        parts = line.split()
        if len(parts) != 6:
            continue                      # skip malformed lines
        time, ip, method, page, status, duration = parts
        yield {"time": time, "ip": ip, "page": page,
               "status": int(status), "ms": int(duration.removesuffix("ms"))}


def only_errors(records):
    for r in records:
        if r["status"] >= 400:
            yield r


def summarise(records):
    count, slowest, by_page = 0, None, {}
    for r in records:
        count += 1
        by_page[r["page"]] = by_page.get(r["page"], 0) + 1
        if slowest is None or r["ms"] > slowest["ms"]:
            slowest = r
    return count, slowest, by_page


def main():
    if not LOG_FILE.exists():
        print("Creating a 200,000-line log file...")
        make_fake_log()
    size_mb = LOG_FILE.stat().st_size / 1_000_000
    print(f"{LOG_FILE.name}: {size_mb:.1f} MB\n")

    errors = only_errors(parse(read_lines(LOG_FILE)))   # nothing has run yet
    count, slowest, by_page = summarise(errors)          # now it streams

    print(f"Error responses: {count:,}")
    print(f"Slowest error:   {slowest['page']} took {slowest['ms']}ms at {slowest['time']}")
    print("Errors by page:")
    for page, n in sorted(by_page.items(), key=lambda kv: kv[1], reverse=True):
        print(f"  {page:<12}{n:>6,}")

    first_404 = next(r for r in parse(read_lines(LOG_FILE)) if r["status"] == 404)
    print(f"\nFirst 404: {first_404['page']} from {first_404['ip']}")


if __name__ == "__main__":
    main()
