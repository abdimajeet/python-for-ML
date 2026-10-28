# day71_optimise.py
# A slow report, its profile, and an optimised version with the same output.

import cProfile
import io
import pstats
import random
import time

random.seed(42)
PRODUCTS = [{"id": i, "name": f"Product {i}", "price": round(random.uniform(1, 100), 2)}
            for i in range(2_000)]
ORDERS = [{"customer": f"C{random.randint(1, 3_000)}", "product_id": random.randint(0, 1_999),
           "qty": random.randint(1, 5)} for _ in range(20_000)]


# ---------- slow version ----------

def find_product_slow(product_id):
    for p in PRODUCTS:                      # O(n) search every time
        if p["id"] == product_id:
            return p


def repeat_customers_slow(orders):
    seen, repeats = [], []
    for o in orders:
        if o["customer"] in seen:           # list membership: O(n)
            if o["customer"] not in repeats:
                repeats.append(o["customer"])
        else:
            seen.append(o["customer"])
    return sorted(repeats)


def report_slow(orders):
    totals = {}
    for o in orders:
        product = find_product_slow(o["product_id"])
        totals[o["customer"]] = totals.get(o["customer"], 0) + product["price"] * o["qty"]
    repeats = repeat_customers_slow(orders)
    text = ""
    for c in repeats:
        text += f"{c}: {totals[c]:.2f}\n"   # string += in a loop
    return text


# ---------- fast version ----------

def report_fast(orders):
    price_of = {p["id"]: p["price"] for p in PRODUCTS}      # build a lookup once
    totals, counts = {}, {}
    for o in orders:
        c = o["customer"]
        totals[c] = totals.get(c, 0) + price_of[o["product_id"]] * o["qty"]
        counts[c] = counts.get(c, 0) + 1
    repeats = sorted(c for c, n in counts.items() if n > 1)
    return "".join(f"{c}: {totals[c]:.2f}\n" for c in repeats)


def timed(func, *args):
    start = time.perf_counter()
    result = func(*args)
    return result, time.perf_counter() - start


def main():
    print("Profiling the slow version (top 5 by total time):")
    profiler = cProfile.Profile()
    profiler.enable()
    slow, _ = timed(report_slow, ORDERS)
    profiler.disable()
    out = io.StringIO()
    pstats.Stats(profiler, stream=out).sort_stats("tottime").print_stats(5)
    print("\n".join(out.getvalue().splitlines()[4:16]))

    slow, t_slow = timed(report_slow, ORDERS)
    fast, t_fast = timed(report_fast, ORDERS)
    assert slow == fast, "the optimised version must give identical output"

    print(f"Slow: {t_slow:.3f}s   Fast: {t_fast:.4f}s   Speed-up: {t_slow / t_fast:,.0f}x")
    print(f"Repeat customers: {slow.count(chr(10)):,}")
    print("First lines of the report:")
    print("".join(fast.splitlines(keepends=True)[:3]))


if __name__ == "__main__":
    main()
