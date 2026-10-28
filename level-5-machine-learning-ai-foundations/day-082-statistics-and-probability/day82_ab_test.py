# day82_ab_test.py
# Is the new checkout page better? Answer it with simulation, not formulas.

import numpy as np

rng = np.random.default_rng(82)


def run_experiment(visitors: int, rate_a: float, rate_b: float) -> tuple[np.ndarray, np.ndarray]:
    """Return arrays of 0/1 outcomes (1 = bought) for each group."""
    a = rng.random(visitors) < rate_a
    b = rng.random(visitors) < rate_b
    return a.astype(int), b.astype(int)


def permutation_p_value(a: np.ndarray, b: np.ndarray, rounds: int = 5_000) -> float:
    """How often does shuffling the labels give a difference at least this big?"""
    observed = b.mean() - a.mean()
    pooled = np.concatenate([a, b])
    count = 0
    for _ in range(rounds):
        rng.shuffle(pooled)                      # pretend the page made no difference
        fake_a, fake_b = pooled[:len(a)], pooled[len(a):]
        if fake_b.mean() - fake_a.mean() >= observed:
            count += 1
    return count / rounds


def bootstrap_lift(a: np.ndarray, b: np.ndarray, rounds: int = 5_000) -> tuple[float, float]:
    """95% confidence interval for the relative lift (b - a) / a."""
    lifts = []
    for _ in range(rounds):
        ra = rng.choice(a, len(a)).mean()
        rb = rng.choice(b, len(b)).mean()
        lifts.append((rb - ra) / ra)
    low, high = np.percentile(lifts, [2.5, 97.5])
    return float(low), float(high)


def power(visitors: int, rate_a: float, rate_b: float, experiments: int = 300) -> float:
    """Fraction of experiments that detect a real effect (z-test, one-sided, 5% level)."""
    detected = 0
    for _ in range(experiments):
        a, b = run_experiment(visitors, rate_a, rate_b)
        pa, pb = a.mean(), b.mean()
        pooled = (a.sum() + b.sum()) / (2 * visitors)
        se = np.sqrt(2 * pooled * (1 - pooled) / visitors)
        if se > 0 and (pb - pa) / se > 1.645:
            detected += 1
    return detected / experiments


def report(name: str, a: np.ndarray, b: np.ndarray) -> None:
    pa, pb = a.mean(), b.mean()
    p = permutation_p_value(a, b)
    low, high = bootstrap_lift(a, b)
    print(f"\n{name}: {len(a):,} visitors per page")
    print(f"  A converts {pa:.2%}, B converts {pb:.2%} (lift {(pb - pa) / pa:+.1%})")
    print(f"  p-value {p:.3f}; 95% CI for the lift: {low:+.1%} to {high:+.1%}")
    if p < 0.05 and low > 0:
        print("  Verdict: B is very likely better.")
    else:
        print("  Verdict: not enough evidence. Keep testing or accept there may be no difference.")


def main() -> None:
    TRUE_A, TRUE_B = 0.040, 0.048          # B really is 20% better

    a, b = run_experiment(500, TRUE_A, TRUE_B)
    report("Small test", a, b)

    a, b = run_experiment(20_000, TRUE_A, TRUE_B)
    report("Large test", a, b)

    a, b = run_experiment(20_000, TRUE_A, TRUE_A)
    report("A/A test (both pages identical)", a, b)

    print("\nHow many visitors do we need? (chance of detecting the real 20% lift)")
    for n in (1_000, 5_000, 10_000, 20_000):
        print(f"  {n:>6,} per page: {power(n, TRUE_A, TRUE_B):.0%}")


if __name__ == "__main__":
    main()
