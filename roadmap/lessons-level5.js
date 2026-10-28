// Level 5 lessons: Days 81-100. Code fields use String.raw so backslashes stay literal.
window.LESSONS = window.LESSONS || {};
(function (L) {
const R = String.raw;

L[81] = {
  intro: "Welcome to Level 5. Machine learning is mostly numbers arranged in vectors and matrices, so we start with the linear algebra you actually need, done in NumPy. No proofs: just what each operation means and why ML uses it.",
  lesson: [
    {h: "Vectors: a list of numbers with a meaning",
     p: "A <b>vector</b> is an ordered list of numbers. In ML, one row of data is a vector: a house might be <code>[120, 3, 15]</code> for size, bedrooms and age. Adding vectors adds element by element, and multiplying by a number (a <b>scalar</b>) scales every element. NumPy does both without loops.",
     code: R`import numpy as np

a = np.array([2, 1])
b = np.array([1, 3])
print(a + b, 3 * a)`,
     out: "[3 4] [6 3]"},
    {h: "The dot product",
     p: "The dot product multiplies matching elements and adds the results: <code>a·b = a1*b1 + a2*b2 + ...</code>. It is the single most important operation in ML. A linear model's prediction is a dot product of the input with its weights: <code>price = 2000*size + 5000*bedrooms - 300*age</code>. Write it as <code>a @ b</code> or <code>np.dot(a, b)</code>.",
     code: R`house = np.array([120, 3, 15])
weights = np.array([2000, 5000, -300])
print(house @ weights)`,
     out: "250500"},
    {h: "Length and similarity",
     p: "The length (or <b>norm</b>) of a vector is <code>np.linalg.norm(v)</code>, Pythagoras in any number of dimensions. Dividing the dot product by both lengths gives the <b>cosine similarity</b>: 1 means pointing the same way, 0 means unrelated, -1 means opposite. Search engines and recommendation systems compare things this way.",
     code: R`def cosine(u, v):
    return u @ v / (np.linalg.norm(u) * np.linalg.norm(v))

print(round(cosine(np.array([1, 2]), np.array([2, 4])), 3),
      round(cosine(np.array([1, 0]), np.array([0, 1])), 3))`,
     out: "1.0 0.0"},
    {h: "Matrices and matrix multiplication",
     p: "A <b>matrix</b> is a 2-D grid: a whole dataset is a matrix with one row per example and one column per feature. <code>X @ w</code> takes the dot product of <b>every row</b> with the weights, so it predicts for all examples at once. For <code>A @ B</code> the inner sizes must match: (3×2) @ (2×4) gives (3×4). <code>A.T</code> is the transpose (rows become columns).",
     code: R`X = np.array([[120, 3, 15],
              [80, 2, 40],
              [200, 5, 2]])
print(X @ weights)
print(X.shape, X.T.shape)`,
     out: "[250500 158000 424400]\n(3, 3) (3, 3)"},
    {h: "Solving equations and the identity",
     p: "<code>np.linalg.solve(A, b)</code> finds <code>x</code> so that <code>A @ x == b</code>. That is exactly what fitting a model means: finding weights that reproduce the answers. The identity matrix <code>np.eye(n)</code> is the matrix version of 1, and <code>np.linalg.inv(A)</code> is the inverse. In practice, prefer <code>solve</code>; it is faster and more accurate than computing an inverse."}
  ],
  exercises: [
    {q: "Compute the dot product of <code>[1, 2, 3]</code> and <code>[4, 5, 6]</code> by hand, then check with NumPy.", hint: "1*4 + 2*5 + 3*6.", sol: R`import numpy as np
print(np.array([1, 2, 3]) @ np.array([4, 5, 6]))   # 32`},
    {q: "Make a 2×3 matrix and a 3×2 matrix of your choice. What shape is their product? What happens if you multiply the 2×3 matrix by itself?", sol: R`A = np.arange(6).reshape(2, 3)
B = np.arange(6).reshape(3, 2)
print((A @ B).shape)    # (2, 2)
# A @ A raises ValueError: the inner sizes (3 and 2) don't match`},
    {q: "Solve: <code>2x + y = 5</code> and <code>x - y = 1</code>.", sol: R`A = np.array([[2, 1], [1, -1]])
b = np.array([5, 1])
print(np.linalg.solve(A, b))   # [2. 1.]`}
  ],
  project: {
    title: "Linear algebra toolkit",
    brief: "Build a small toolkit: dot product and matrix multiplication written by hand (then checked against NumPy), cosine similarity used to recommend movies to a user, solving a system of equations, and rotating points with a matrix. Writing the loops once makes the NumPy one-liners mean something.",
    file: "day81_linalg.py",
    code: R`# day81_linalg.py
# Vectors and matrices by hand, then with NumPy, then used for something real.

import numpy as np


# ---------- 1. By hand ----------
def dot(u: list[float], v: list[float]) -> float:
    if len(u) != len(v):
        raise ValueError("vectors must be the same length")
    return sum(a * b for a, b in zip(u, v))


def matmul(A: list[list[float]], B: list[list[float]]) -> list[list[float]]:
    if len(A[0]) != len(B):
        raise ValueError(f"can't multiply {len(A)}x{len(A[0])} by {len(B)}x{len(B[0])}")
    columns = list(zip(*B))                       # B's columns
    return [[dot(row, col) for col in columns] for row in A]


# ---------- 2. Similarity and recommendations ----------
MOVIES = ["Inception", "Interstellar", "The Notebook", "Titanic", "Toy Story", "Up"]
# Ratings from 1 to 5; 0 means "not seen".
RATINGS = {
    "Amina": [5, 5, 1, 2, 3, 4],
    "Omar":  [4, 5, 0, 1, 2, 3],
    "Sara":  [1, 1, 5, 5, 3, 0],
    "Yusuf": [2, 0, 4, 5, 4, 3],
    "Hodan": [3, 3, 3, 3, 5, 5],
}


def cosine(u: np.ndarray, v: np.ndarray) -> float:
    return float(u @ v / (np.linalg.norm(u) * np.linalg.norm(v)))


def recommend(user: str) -> tuple[str, str | None]:
    """Find the most similar other user, then suggest a film they liked that the user hasn't seen."""
    me = np.array(RATINGS[user])
    others = {name: cosine(me, np.array(r)) for name, r in RATINGS.items() if name != user}
    twin = max(others, key=others.get)
    twin_ratings = np.array(RATINGS[twin])
    unseen = [i for i in range(len(MOVIES)) if me[i] == 0]
    if not unseen:
        return twin, None
    best = max(unseen, key=lambda i: twin_ratings[i])
    return twin, MOVIES[best]


# ---------- 3. Solving equations ----------
def solve_prices() -> np.ndarray:
    """3 coffees + 2 cakes = 13, 1 coffee + 4 cakes = 11, 2 coffees + 1 cake + 1 juice = 10."""
    A = np.array([[3, 2, 0],
                  [1, 4, 0],
                  [2, 1, 1]], dtype=float)
    b = np.array([13, 11, 10], dtype=float)
    return np.linalg.solve(A, b)


# ---------- 4. Matrices as transformations ----------
def rotation(degrees: float) -> np.ndarray:
    t = np.radians(degrees)
    return np.array([[np.cos(t), -np.sin(t)],
                     [np.sin(t),  np.cos(t)]])


def main() -> None:
    np.set_printoptions(suppress=True, precision=2)

    print("1. By hand vs NumPy")
    u, v = [1, 2, 3], [4, 5, 6]
    print(f"   dot: {dot(u, v)} vs {np.dot(u, v)}")
    A = [[1, 2], [3, 4], [5, 6]]
    B = [[7, 8, 9], [10, 11, 12]]
    print(f"   matmul by hand: {matmul(A, B)}")
    print(f"   same as NumPy:  {np.array_equal(matmul(A, B), np.array(A) @ np.array(B))}")

    print("\n2. Who is most like whom?")
    names = list(RATINGS)
    M = np.array([RATINGS[n] for n in names], dtype=float)
    unit = M / np.linalg.norm(M, axis=1, keepdims=True)    # every row has length 1
    similarity = unit @ unit.T                              # all pairs in one multiplication
    print("         " + "".join(f"{n:>7}" for n in names))
    for name, row in zip(names, similarity):
        print(f"   {name:<6}" + "".join(f"{s:7.2f}" for s in row))
    for user in ("Omar", "Sara"):
        twin, film = recommend(user)
        print(f"   {user} is most like {twin}; suggestion: {film}")

    print("\n3. Cafe prices from three receipts")
    coffee, cake, juice = solve_prices()
    print(f"   coffee {coffee:.2f}, cake {cake:.2f}, juice {juice:.2f}")

    print("\n4. Rotating a square by 90 degrees")
    square = np.array([[0, 0], [1, 0], [1, 1], [0, 1]], dtype=float)
    print("   ", (square @ rotation(90).T).round(2).tolist())


if __name__ == "__main__":
    main()`,
    explain: [
      ["columns = list(zip(*B))", "<code>zip(*B)</code> turns rows into columns. Each cell of the result is a row of A dotted with a column of B, which is the definition of matrix multiplication."],
      ["unit = M / np.linalg.norm(M, axis=1, keepdims=True)", "Divides each row by its own length. <code>keepdims=True</code> keeps the result as a column so broadcasting lines up row by row."],
      ["similarity = unit @ unit.T", "With unit-length rows, the dot product <b>is</b> the cosine similarity. One matrix multiplication compares every user with every other user."],
      ["best = max(unseen, key=lambda i: twin_ratings[i])", "Among films the user hasn't seen, pick the one their most similar user rated highest. This is the core idea of collaborative filtering."],
      ["np.linalg.solve(A, b)", "Each receipt is one equation, so three receipts give three equations in three unknowns."],
      ["square @ rotation(90).T", "Points are rows here, so we multiply by the transpose. Every point is rotated in one operation."]
    ],
    stretch: ["Add a rating for yourself and see what the toolkit recommends.", "Time <code>matmul</code> against <code>@</code> on 200×200 random matrices. How much faster is NumPy?", "Add a <code>scale(sx, sy)</code> matrix and combine it with a rotation by multiplying the two matrices."]
  },
  tests: ["Check the dot product of [1, 2, 3] and [4, 5, 6] gives 32 both ways.", "The diagonal of the similarity table should be all 1.00. Why?", "Check the cafe prices by putting them back into the three receipts.", "After a 90-degree rotation, the point (1, 0) should become (0, 1)."]
};

L[82] = {
  intro: "Models make predictions under uncertainty, and statistics is how we reason about that uncertainty. Today you'll describe data, meet the normal distribution, and use simulation to answer a real question: did a change on a website actually help?",
  lesson: [
    {h: "Centre and spread",
     p: "The <b>mean</b> is the average; the <b>median</b> is the middle value and ignores extreme outliers. <b>Variance</b> is the average squared distance from the mean; its square root, the <b>standard deviation</b>, is in the original units. A small standard deviation means values cluster tightly.",
     code: R`import numpy as np

salaries = np.array([30, 32, 35, 36, 40, 250])   # one CEO
print(salaries.mean().round(1), np.median(salaries), salaries.std().round(1))`,
     out: "70.5 35.5 80.3"},
    {h: "Random numbers and distributions",
     p: "<code>rng = np.random.default_rng(42)</code> creates a reproducible random generator; the seed means you get the same numbers every run. A <b>distribution</b> describes how likely each value is. <code>rng.normal(mean, sd, size)</code> gives the bell curve (heights, measurement errors); <code>rng.binomial(n, p)</code> counts successes, such as how many of 1,000 visitors buy something; <code>rng.uniform</code> makes every value equally likely."},
    {h: "Sampling and the law of large numbers",
     p: "We rarely see a whole population, only a <b>sample</b>. A sample mean wobbles around the true value, and the wobble shrinks as the sample grows (roughly with the square root of its size). That's why 10 users prove nothing and 10,000 users can.",
     code: R`rng = np.random.default_rng(1)
for n in (10, 1_000, 100_000):
    flips = rng.integers(0, 2, size=n)
    print(n, flips.mean().round(3))`,
     out: "10 0.5\n1000 0.489\n100000 0.5"},
    {h: "Simulation instead of formulas",
     p: "Many statistics questions can be answered by simulating the situation thousands of times and counting. Question: \"if the change did nothing, how often would we see a difference this big just by luck?\" That fraction is the <b>p-value</b>. A small p-value (say below 0.05) means luck is an unlikely explanation. It does <b>not</b> tell you how big or important the effect is."},
    {h: "Confidence intervals by bootstrapping",
     p: "To see how uncertain an estimate is, <b>bootstrap</b>: resample your data with replacement many times, recompute the statistic each time, and look at the middle 95% of the results. That range is a 95% confidence interval. <code>np.percentile(values, [2.5, 97.5])</code> finds its ends."}
  ],
  exercises: [
    {q: "Generate 10,000 heights with mean 170 and standard deviation 8. What fraction is above 186?", hint: "186 is two standard deviations above the mean.", sol: R`rng = np.random.default_rng(0)
h = rng.normal(170, 8, 10_000)
print((h > 186).mean())   # about 0.023`},
    {q: "Simulate rolling two dice 100,000 times. How often is the total 7?", sol: R`rng = np.random.default_rng(0)
totals = rng.integers(1, 7, 100_000) + rng.integers(1, 7, 100_000)
print((totals == 7).mean())   # about 1/6`},
    {q: "Bootstrap a 95% confidence interval for the median of <code>[12, 15, 9, 22, 17, 14, 30, 11]</code>.", sol: R`data = np.array([12, 15, 9, 22, 17, 14, 30, 11])
rng = np.random.default_rng(0)
medians = [np.median(rng.choice(data, len(data))) for _ in range(5000)]
print(np.percentile(medians, [2.5, 97.5]))`}
  ],
  project: {
    title: "A/B test simulator",
    brief: "An online shop shows half its visitors a new checkout page (B) and half the old one (A). Simulate the experiment, then decide whether B is really better: a permutation test for the p-value, a bootstrap confidence interval for the lift, and a power simulation that shows how many visitors you need before trusting the result.",
    file: "day82_ab_test.py",
    code: R`# day82_ab_test.py
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
    main()`,
    explain: [
      ["a = rng.random(visitors) < rate_a", "Each visitor gets a random number between 0 and 1; those below the true rate \"buy\". The comparison makes a True/False array that we convert to 1/0."],
      ["rng.shuffle(pooled)", "The heart of the permutation test. If the page made no difference, the A and B labels are meaningless, so shuffling them shows what pure luck looks like."],
      ["rng.choice(a, len(a))", "Resampling with replacement: a new dataset of the same size where some visitors appear twice and some not at all. Repeating this shows how much the estimate could vary."],
      ["np.percentile(lifts, [2.5, 97.5])", "The middle 95% of the bootstrapped lifts is the confidence interval."],
      ["if (pb - pa) / se > 1.645", "A quick z-test inside the power simulation, where speed matters. 1.645 is the cut-off for a one-sided test at the 5% level."],
      ["report(\"A/A test ...\")", "A sanity check used in real companies: with two identical pages, the test should usually say \"not enough evidence\"."]
    ],
    stretch: ["Change <code>TRUE_B</code> to 0.044 (a 10% lift). How many visitors do you now need for 80% power?", "Run the A/A test 100 times and count how often it wrongly says B is better. It should be about 5%.", "Plot a histogram of the bootstrapped lifts with Matplotlib."]
  },
  tests: ["Run it twice: the seed means you get identical numbers.", "The small test will probably say \"not enough evidence\" even though B really is better. Explain why.", "Check that power rises as the number of visitors grows.", "Change the seed and see how the small test's verdict changes."]
};

L[83] = {
  intro: "Almost every ML model learns the same way: start with a guess, measure how wrong it is, and nudge the guess in the direction that reduces the error. That direction comes from the derivative. Today you'll build gradient descent from scratch.",
  lesson: [
    {h: "A derivative is a slope",
     p: "The derivative of a function at a point tells you how steeply it rises there. If <code>f(x) = x²</code>, the slope at <code>x = 3</code> is 6: nudge <code>x</code> up a little and <code>f</code> rises about six times as much. You can estimate any slope numerically by trying a tiny step on each side.",
     code: R`def slope(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)

print(round(slope(lambda x: x ** 2, 3), 4))`,
     out: "6.0"},
    {h: "Walking downhill",
     p: "To find the lowest point of a function, repeat: <code>x = x - learning_rate * slope(x)</code>. A positive slope means \"uphill to the right\", so we step left, and vice versa. Near the bottom the slope shrinks, so the steps shrink too.",
     code: R`f = lambda x: (x - 3) ** 2 + 2
x = 0.0
for step in range(25):
    x -= 0.1 * slope(f, x)
print(round(x, 3), round(f(x), 3))`,
     out: "2.989 2.0"},
    {h: "The learning rate",
     p: "The <b>learning rate</b> sets the step size. Too small and training crawls; too large and you overshoot the bottom and may bounce further away each step (<b>diverge</b>). Choosing it is one of the first things you tune in any model."},
    {h: "Gradients: slopes in many directions",
     p: "With several parameters, the <b>gradient</b> is a vector of slopes, one per parameter (each found while holding the others fixed, called a <b>partial derivative</b>). It points straight uphill, so subtracting it moves downhill in all directions at once. A model with a million weights works exactly like this, just with a longer vector."},
    {h: "Minima, local and global",
     p: "Gradient descent stops wherever the slope is zero. For bowl-shaped functions (like the loss of linear regression) that's the single global minimum. Bumpy functions can trap it in a <b>local minimum</b>, which is why the starting point and learning rate matter in neural networks."}
  ],
  exercises: [
    {q: "Estimate the slope of <code>f(x) = x³</code> at <code>x = 2</code>. The exact answer is 12.", sol: R`print(slope(lambda x: x ** 3, 2))`},
    {q: "Minimise <code>f(x) = (x + 4)² </code> starting from <code>x = 10</code>. Try learning rates 0.01, 0.1 and 1.1 for 50 steps. What happens with each?", sol: R`for lr in (0.01, 0.1, 1.1):
    x = 10.0
    for _ in range(50):
        x -= lr * 2 * (x + 4)
    print(lr, x)
# 0.01 is still far away, 0.1 reaches -4, 1.1 explodes`},
    {q: "Write the gradient of <code>f(x, y) = x² + 3y²</code> as a function that returns a NumPy array.", sol: R`def grad(p):
    x, y = p
    return np.array([2 * x, 6 * y])`}
  ],
  project: {
    title: "Gradient descent from scratch",
    brief: "Write a reusable <code>gradient_descent</code> function that works for any number of parameters, using numerical gradients. Use it on a 1-D curve, compare learning rates, minimise a 2-D \"valley\" function, show how momentum helps, and save a plot of the paths it takes.",
    file: "day83_gradient_descent.py",
    code: R`# day83_gradient_descent.py
# Gradient descent for any function, with numerical gradients and a picture of the path.

import numpy as np
import matplotlib.pyplot as plt


def numerical_gradient(f, params: np.ndarray, h: float = 1e-6) -> np.ndarray:
    """Estimate each partial derivative by nudging one parameter at a time."""
    grad = np.zeros_like(params)
    for i in range(len(params)):
        step = np.zeros_like(params)
        step[i] = h
        grad[i] = (f(params + step) - f(params - step)) / (2 * h)
    return grad


def gradient_descent(f, start, learning_rate=0.1, steps=100, momentum=0.0, tol=1e-8):
    """Return the list of points visited. Stops early when the steps become tiny."""
    params = np.array(start, dtype=float)
    velocity = np.zeros_like(params)
    path = [params.copy()]
    for _ in range(steps):
        grad = numerical_gradient(f, params)
        velocity = momentum * velocity - learning_rate * grad
        params = params + velocity
        path.append(params.copy())
        if not np.all(np.isfinite(params)):
            print("    diverged!")
            break
        if np.linalg.norm(velocity) < tol:
            break
    return np.array(path)


def bowl(p):
    return (p[0] - 3) ** 2 + 2


def valley(p):
    """A long narrow valley: easy to fall into, slow to walk along."""
    x, y = p
    return 0.1 * (x - 4) ** 2 + 3 * (y + 1) ** 2


def main() -> None:
    print("1. One parameter: minimum of (x - 3)^2 + 2 is at x = 3")
    for lr in (0.01, 0.1, 0.9, 1.05):
        path = gradient_descent(bowl, [0.0], learning_rate=lr, steps=50)
        print(f"   lr={lr:<5} after {len(path) - 1:>2} steps: x = {path[-1][0]:10.4f}")

    print("\n2. Two parameters: the valley's minimum is at (4, -1)")
    plain = gradient_descent(valley, [-4.0, 2.0], learning_rate=0.15, steps=200)
    fast = gradient_descent(valley, [-4.0, 2.0], learning_rate=0.15, steps=200, momentum=0.7)
    for name, path in (("plain", plain), ("momentum", fast)):
        x, y = path[-1]
        print(f"   {name:<9} {len(path) - 1:>3} steps -> ({x:.3f}, {y:.3f}), loss {valley(path[-1]):.6f}")

    # Picture: contour lines of the valley with both paths drawn on top
    xs, ys = np.meshgrid(np.linspace(-5, 8, 200), np.linspace(-3, 3, 200))
    zs = 0.1 * (xs - 4) ** 2 + 3 * (ys + 1) ** 2
    fig, ax = plt.subplots(figsize=(8, 4))
    ax.contour(xs, ys, zs, levels=25, cmap="Greys", linewidths=0.6)
    ax.plot(plain[:, 0], plain[:, 1], "o-", ms=3, label=f"plain ({len(plain) - 1} steps)")
    ax.plot(fast[:, 0], fast[:, 1], "o-", ms=3, label=f"momentum ({len(fast) - 1} steps)")
    ax.plot(4, -1, "r*", ms=14, label="minimum")
    ax.set(title="Gradient descent on a narrow valley", xlabel="x", ylabel="y")
    ax.legend()
    fig.tight_layout()
    fig.savefig("gradient_paths.png", dpi=120)
    print("\nSaved gradient_paths.png")


if __name__ == "__main__":
    main()`,
    explain: [
      ["step[i] = h", "Nudges one parameter at a time while the others stay fixed. That is exactly what a partial derivative means."],
      ["velocity = momentum * velocity - learning_rate * grad", "With <code>momentum=0</code> this is plain gradient descent. With momentum, each step remembers part of the previous one, like a ball rolling downhill, so it speeds up along the valley floor."],
      ["if not np.all(np.isfinite(params))", "A learning rate that is too large makes the numbers explode to infinity. Detecting it gives a clear message instead of nonsense."],
      ["if np.linalg.norm(velocity) < tol", "Stop early once the steps are tiny: we've arrived."],
      ["np.meshgrid(...)", "Builds a grid of (x, y) points so we can compute the function everywhere and draw its contour lines, like a hiking map."]
    ],
    stretch: ["Add a function with two minima, such as <code>x**4 - 3*x**2 + x</code>, and show that different starting points end in different places.", "Replace the numerical gradient for <code>valley</code> with the exact one (<code>[0.2*(x-4), 6*(y+1)]</code>) and compare speed.", "Animate the path with <code>matplotlib.animation.FuncAnimation</code>."]
  },
  tests: ["With lr=0.1 the bowl should end very close to x = 3.", "With lr=1.05 it should diverge. Explain why from the update rule.", "Momentum should reach the valley's minimum in fewer steps than plain descent.", "Open <code>gradient_paths.png</code>: does the plain path zig-zag across the valley?"]
};

L[84] = {
  intro: "Today you put the last three days together: data in a matrix, a prediction as a dot product, and gradient descent to find the best weights. The result is linear regression, built with nothing but NumPy.",
  lesson: [
    {h: "The model",
     p: "Linear regression predicts a number as a weighted sum of the inputs plus a constant: <code>price = w1*size + w2*bedrooms + w3*age + b</code>. The weights say how much each feature matters, and <code>b</code> (the <b>bias</b> or intercept) is the starting value. For all houses at once: <code>predictions = X @ w + b</code>."},
    {h: "The loss function",
     p: "To learn, we need one number that says how wrong the model is. The <b>mean squared error</b> (MSE) averages the squared differences between predictions and true values. Squaring makes all errors positive and punishes big misses heavily. Training means finding the <code>w</code> and <code>b</code> that make the MSE as small as possible.",
     code: R`import numpy as np

y_true = np.array([200, 150, 300])
y_pred = np.array([210, 140, 270])
mse = ((y_pred - y_true) ** 2).mean()
print(mse, np.sqrt(mse).round(1))`,
     out: "366.6666666666667 19.1"},
    {h: "The gradient of the MSE",
     p: "For linear regression the gradient has a neat formula, so we don't need numerical estimates. With <code>error = X @ w + b - y</code>: the gradient for <code>w</code> is <code>2 * X.T @ error / n</code> and for <code>b</code> it's <code>2 * error.mean()</code>. Each step moves every weight against its share of the error."},
    {h: "Feature scaling",
     p: "House size runs into hundreds, bedrooms go from 1 to 6. With raw features, one learning rate is too big for one and too small for the other. <b>Standardising</b> each column to mean 0 and standard deviation 1 (<code>(X - mean) / std</code>) puts them on an equal footing, and gradient descent becomes fast and stable. Remember to apply the same <code>mean</code> and <code>std</code> to new data."},
    {h: "Checking the result",
     p: "<b>RMSE</b> (square root of MSE) is in the target's units: \"typically off by 19k\". <b>R²</b> compares the model with always guessing the average: 1 is perfect, 0 is no better than the average. Linear regression also has an exact solution (the <b>normal equation</b>), which we can use to check our gradient descent."}
  ],
  exercises: [
    {q: "Standardise the column <code>[50, 100, 150]</code> by hand and with NumPy.", sol: R`x = np.array([50, 100, 150])
print((x - x.mean()) / x.std())   # [-1.22  0.    1.22]`},
    {q: "Write <code>r2(y_true, y_pred)</code> = 1 - (sum of squared errors) / (sum of squared differences from the mean).", sol: R`def r2(y_true, y_pred):
    ss_res = ((y_true - y_pred) ** 2).sum()
    ss_tot = ((y_true - y_true.mean()) ** 2).sum()
    return 1 - ss_res / ss_tot`},
    {q: "Why should you not compute <code>mean</code> and <code>std</code> on the test data when scaling it?", sol: R`# The test set stands in for future data you haven't seen.
# Using its statistics leaks information and makes the score look better than reality.
# Always reuse the training mean and std.`}
  ],
  project: {
    title: "House price predictor",
    brief: "Generate a realistic dataset of 500 houses, split it into training and test sets, standardise the features, and train linear regression with your own gradient descent. Compare it with the exact normal-equation solution, report RMSE and R² on the test set, show which features matter most, and predict prices for new houses.",
    file: "day84_house_prices.py",
    code: R`# day84_house_prices.py
# Linear regression from scratch: data, scaling, gradient descent, evaluation.

import numpy as np

rng = np.random.default_rng(84)
FEATURES = ["size_m2", "bedrooms", "age_years", "distance_km"]


def make_houses(n: int = 500) -> tuple[np.ndarray, np.ndarray]:
    size = rng.normal(110, 35, n).clip(30, 300)
    bedrooms = np.clip(np.round(size / 35 + rng.normal(0, 0.7, n)), 1, 6)
    age = rng.uniform(0, 60, n)
    distance = rng.gamma(2.0, 4.0, n)                 # km from the city centre
    price = (1_800 * size + 9_000 * bedrooms - 900 * age - 3_500 * distance
             + 40_000 + rng.normal(0, 18_000, n))      # in dollars, plus noise
    X = np.column_stack([size, bedrooms, age, distance])
    return X, price


def train_test_split(X, y, test_fraction=0.2):
    order = rng.permutation(len(X))
    cut = int(len(X) * (1 - test_fraction))
    train, test = order[:cut], order[cut:]
    return X[train], X[test], y[train], y[test]


class Scaler:
    def fit(self, X):
        self.mean, self.std = X.mean(axis=0), X.std(axis=0)
        return self

    def transform(self, X):
        return (X - self.mean) / self.std


class LinearRegressionGD:
    def __init__(self, learning_rate=0.1, epochs=500):
        self.learning_rate, self.epochs = learning_rate, epochs

    def fit(self, X, y):
        n, d = X.shape
        self.w, self.b = np.zeros(d), 0.0
        self.history = []
        for _ in range(self.epochs):
            error = X @ self.w + self.b - y
            self.history.append((error ** 2).mean())
            self.w -= self.learning_rate * 2 * X.T @ error / n
            self.b -= self.learning_rate * 2 * error.mean()
        return self

    def predict(self, X):
        return X @ self.w + self.b


def rmse(y, p):
    return float(np.sqrt(((y - p) ** 2).mean()))


def r2(y, p):
    return float(1 - ((y - p) ** 2).sum() / ((y - y.mean()) ** 2).sum())


def main() -> None:
    X, y = make_houses()
    X_train, X_test, y_train, y_test = train_test_split(X, y)
    scaler = Scaler().fit(X_train)                     # statistics from training data only
    Xs_train, Xs_test = scaler.transform(X_train), scaler.transform(X_test)

    model = LinearRegressionGD().fit(Xs_train, y_train)
    print(f"Trained on {len(X_train)} houses, tested on {len(X_test)}")
    for epoch in (0, 10, 50, 499):
        print(f"  epoch {epoch:>3}: training RMSE {np.sqrt(model.history[epoch]):>10,.0f}")

    # Exact answer for comparison: add a column of ones for the bias, then solve
    A = np.column_stack([np.ones(len(Xs_train)), Xs_train])
    exact = np.linalg.solve(A.T @ A, A.T @ y_train)
    print(f"\nGradient descent and the normal equation agree: "
          f"{np.allclose(np.r_[model.b, model.w], exact, rtol=1e-3)}")

    baseline = np.full(len(y_test), y_train.mean())
    pred = model.predict(Xs_test)
    print(f"\nTest RMSE: model {rmse(y_test, pred):,.0f} vs always-guess-the-mean {rmse(y_test, baseline):,.0f}")
    print(f"Test R²:   {r2(y_test, pred):.3f}")

    print("\nWhat moves the price? (effect of one standard deviation)")
    for name, w in sorted(zip(FEATURES, model.w), key=lambda t: -abs(t[1])):
        print(f"  {name:<12} {w:>+10,.0f}")

    new = np.array([[80, 2, 30, 3.0], [150, 4, 5, 12.0], [220, 5, 1, 1.5]])
    print("\nPredictions for new houses:")
    for house, price in zip(new, model.predict(scaler.transform(new))):
        print(f"  {house[0]:>4.0f} m², {house[1]:.0f} bed, {house[2]:>2.0f} yrs, {house[3]:>4.1f} km -> {price:>10,.0f}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["price = (1_800 * size + ...)", "We know the true rule because we invented it. That lets us check whether the model rediscovers it, a common trick for testing ML code."],
      ["scaler = Scaler().fit(X_train)", "Mean and standard deviation come from the training set only, and are reused for the test set and new houses."],
      ["error = X @ self.w + self.b - y", "Predictions for every training house at once, minus the truth."],
      ["self.w -= self.learning_rate * 2 * X.T @ error / n", "The MSE gradient for the weights. <code>X.T @ error</code> adds up how much each feature contributed to the errors."],
      ["np.linalg.solve(A.T @ A, A.T @ y_train)", "The normal equation, the exact least-squares answer. If gradient descent is correct, both agree."],
      ["baseline = np.full(len(y_test), y_train.mean())", "Always compare against a dumb baseline. A model is only useful if it beats \"guess the average\"."]
    ],
    stretch: ["Train without scaling (use the raw <code>X</code>) and find a learning rate that works. What goes wrong?", "Convert the weights back to dollars per m², per bedroom and so on by dividing by <code>scaler.std</code>. Compare with the true rule.", "Plot <code>model.history</code> to show the loss curve."]
  },
  tests: ["The training RMSE should fall quickly, then level off.", "Gradient descent and the normal equation should agree.", "The model's test RMSE should be far lower than the baseline's, and R² well above 0.8.", "Size should be the most important feature."]
};

L[85] = {
  intro: "You've built linear regression by hand. Now meet scikit-learn, the library that wraps dozens of models behind one consistent interface. Learn the workflow once and you can use any of them.",
  lesson: [
    {h: "The estimator interface",
     p: "Every scikit-learn model is an <b>estimator</b> with the same methods: <code>model.fit(X, y)</code> learns from data, <code>model.predict(X)</code> makes predictions, and <code>model.score(X, y)</code> gives a default metric (R² for regression). Learned values end with an underscore, such as <code>model.coef_</code>. Install with <code>pip install scikit-learn</code>; import it as <code>sklearn</code>.",
     code: R`from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4]])
y = np.array([3, 5, 7, 9])
model = LinearRegression().fit(X, y)
print(model.coef_, round(model.intercept_, 2), model.predict([[10]]))`,
     out: "[2.] 1.0 [21.]"},
    {h: "Train/test split",
     p: "A model must be judged on data it hasn't seen, or you only measure memory. <code>train_test_split(X, y, test_size=0.2, random_state=0)</code> shuffles and splits in one line. <code>random_state</code> makes the split reproducible. Look at the test set <b>once</b>, at the end; don't tune on it."},
    {h: "Baselines first",
     p: "<code>DummyRegressor(strategy=\"mean\")</code> always predicts the training average. It is the bar every real model must clear. If a fancy model barely beats it, the features probably don't carry much signal."},
    {h: "Regression metrics",
     p: "<code>sklearn.metrics</code> has them all: <code>mean_absolute_error</code> (MAE, average miss in real units, easy to explain), <code>root_mean_squared_error</code> (punishes big misses), and <code>r2_score</code>. Report at least one metric people can understand, such as \"off by 43 points on average\"."},
    {h: "Built-in datasets",
     p: "scikit-learn ships small datasets for practice, loaded with functions like <code>load_diabetes()</code>, <code>load_breast_cancer()</code> and <code>load_digits()</code>. Pass <code>as_frame=True</code> to get pandas objects with column names. They come with the library, so no download is needed."}
  ],
  exercises: [
    {q: "Load the diabetes dataset as a DataFrame and print its shape and column names.", sol: R`from sklearn.datasets import load_diabetes
data = load_diabetes(as_frame=True)
print(data.frame.shape, list(data.feature_names))`},
    {q: "Fit a <code>LinearRegression</code> using only the <code>bmi</code> column. What R² does it get on a test set?", sol: R`from sklearn.model_selection import train_test_split
X = data.frame[["bmi"]]
y = data.target
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)
print(LinearRegression().fit(X_tr, y_tr).score(X_te, y_te))`},
    {q: "What does <code>random_state</code> do, and why should you set it?", sol: R`# It fixes the random shuffling so the split (and results) are the same every run.
# That makes experiments reproducible and comparisons between models fair.`}
  ],
  project: {
    title: "Regression with scikit-learn",
    brief: "Predict how much a diabetes patient's condition progresses over a year from ten medical measurements. Follow the full workflow: explore, split, fit a baseline, then compare three models (linear regression, ridge and a k-nearest-neighbours regressor) on the same test set, and explain which features matter.",
    file: "day85_sklearn_regression.py",
    code: R`# day85_sklearn_regression.py
# The scikit-learn workflow on a real medical dataset.

import pandas as pd
from sklearn.datasets import load_diabetes
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error, r2_score, root_mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsRegressor

# 1. Load and look
data = load_diabetes(as_frame=True)
df = data.frame
print(f"{len(df)} patients, {len(data.feature_names)} features")
print("Target = disease progression after one year "
      f"(range {df['target'].min():.0f} to {df['target'].max():.0f}, mean {df['target'].mean():.0f})")
print("\nCorrelation of each feature with the target:")
print(df.corr()["target"].drop("target").sort_values(ascending=False).round(2).to_string())

# 2. Split once, before any modelling
X, y = df[data.feature_names], df["target"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=85)

# 3. Compare models on identical data
models = {
    "baseline (mean)": DummyRegressor(strategy="mean"),
    "linear regression": LinearRegression(),
    "ridge": Ridge(alpha=0.1),
    "k-nearest neighbours": KNeighborsRegressor(n_neighbors=15),
}
rows = []
for name, model in models.items():
    model.fit(X_train, y_train)
    pred = model.predict(X_test)
    rows.append({
        "model": name,
        "MAE": mean_absolute_error(y_test, pred),
        "RMSE": root_mean_squared_error(y_test, pred),
        "R2": r2_score(y_test, pred),
    })
results = pd.DataFrame(rows).set_index("model").round(2)
print("\nTest-set results:")
print(results.to_string())

best = results["MAE"].idxmin()
gain = results.loc["baseline (mean)", "MAE"] - results.loc[best, "MAE"]
print(f"\nBest model: {best}. It is off by {results.loc[best, 'MAE']:.0f} points on average, "
      f"{gain:.0f} better than guessing the mean.")

# 4. What did the linear model learn?
coefs = pd.Series(models["linear regression"].coef_, index=data.feature_names)
print("\nLinear regression weights (features are already scaled in this dataset):")
print(coefs.sort_values(key=abs, ascending=False).round(0).to_string())

# 5. Look at a few individual predictions
sample = X_test.head(5)
check = pd.DataFrame({
    "actual": y_test.head(5).values,
    "predicted": models[best].predict(sample).round(0),
})
check["miss"] = (check["predicted"] - check["actual"]).round(0)
print("\nFive test patients:")
print(check.to_string(index=False))`,
    explain: [
      ["load_diabetes(as_frame=True)", "A real dataset of 442 patients that ships with scikit-learn. <code>as_frame=True</code> gives a DataFrame with named columns."],
      ["train_test_split(X, y, test_size=0.2, random_state=85)", "Splits before any modelling, so nothing about the test patients influences training."],
      ["for name, model in models.items():", "Because every estimator has <code>fit</code> and <code>predict</code>, one loop compares four very different models. That shared interface is scikit-learn's big idea."],
      ["DummyRegressor(strategy=\"mean\")", "The baseline. A real model has to beat it to be worth anything."],
      ["coefs.sort_values(key=abs, ascending=False)", "Sorts by size regardless of sign, so the strongest effects come first whether they push the target up or down."]
    ],
    stretch: ["Try <code>alpha</code> values of 0.01, 1 and 10 for Ridge. What happens to the weights and the score?", "Change <code>n_neighbors</code> from 1 to 50 and plot the test MAE.", "Use only the three most correlated features. How much accuracy do you lose?"]
  },
  tests: ["Every model should beat the baseline's MAE.", "R² on this dataset is modest (around 0.4 to 0.5): medical data is noisy. That's normal, not a bug.", "Change <code>random_state</code> and see how much the scores move. That variation is why Day 87 introduces cross-validation.", "In the correlation list, <code>bmi</code> and <code>s5</code> should come top. In the weights, <code>s1</code> and <code>s2</code> get large opposite weights because they measure almost the same thing; Day 92's regularisation tames this."]
};

L[86] = {
  intro: "Regression predicts a number; <b>classification</b> predicts a category: spam or not, survived or not, which digit. Today's model, logistic regression, is the classic starting point, and it gives probabilities, not just yes or no.",
  lesson: [
    {h: "From scores to probabilities",
     p: "Logistic regression computes the same weighted sum as linear regression, <code>z = X @ w + b</code>, then squashes it through the <b>sigmoid</b> function <code>1 / (1 + e^-z)</code>, which turns any number into a probability between 0 and 1. A big positive <code>z</code> means \"very likely yes\", zero means 50/50.",
     code: R`import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

print(sigmoid(np.array([-4, 0, 4])).round(3))`,
     out: "[0.018 0.5   0.982]"},
    {h: "Decisions and the decision boundary",
     p: "To turn a probability into a class, compare it with a <b>threshold</b>, usually 0.5. The set of inputs where the probability is exactly 0.5 is the <b>decision boundary</b>; for logistic regression it's a straight line (or flat surface). Points on one side are predicted \"yes\", on the other \"no\"."},
    {h: "Training uses a different loss",
     p: "Classification uses <b>log loss</b> (cross-entropy) instead of MSE. It punishes a confident wrong answer very heavily: predicting 0.99 for something that didn't happen costs far more than predicting 0.6. scikit-learn minimises it for you with <code>LogisticRegression().fit(X, y)</code>."},
    {h: "predict vs predict_proba",
     p: "<code>model.predict(X)</code> gives the class labels. <code>model.predict_proba(X)</code> gives one column per class with the probabilities; <code>[:, 1]</code> is the probability of class 1. Probabilities are often more useful: a doctor wants to know \"80% risk\", not just \"sick\"."},
    {h: "Preparing real data",
     p: "Models need numbers with no gaps. Fill missing values (using statistics from the training set), turn text categories into 0/1 columns with <code>pd.get_dummies</code>, and keep the columns identical between training and new data. Tomorrow's lessons automate this; today we do it by hand to see each step."}
  ],
  exercises: [
    {q: "What probability does the sigmoid give for <code>z = 2</code>? And for <code>z = -2</code>? Notice anything?", sol: R`print(sigmoid(2), sigmoid(-2))   # 0.881 and 0.119, they add up to 1`},
    {q: "Fit a <code>LogisticRegression</code> on <code>X = [[1], [2], [3], [6], [7], [8]]</code> with <code>y = [0, 0, 0, 1, 1, 1]</code>. What is the probability of class 1 at <code>x = 4.5</code>?", sol: R`from sklearn.linear_model import LogisticRegression
m = LogisticRegression().fit([[1], [2], [3], [6], [7], [8]], [0, 0, 0, 1, 1, 1])
print(m.predict_proba([[4.5]])[0, 1])   # about 0.5, it's the boundary`},
    {q: "Turn the column <code>[\"S\", \"C\", \"S\", \"Q\"]</code> into dummy columns.", sol: R`import pandas as pd
print(pd.get_dummies(pd.Series(["S", "C", "S", "Q"]), prefix="port", dtype=int))`}
  ],
  project: {
    title: "Titanic survival classifier",
    brief: "Use the Titanic data you explored on Day 79 to predict who survived. Clean and encode the features by hand, train logistic regression, compare it against the \"everyone died\" baseline, explain what the weights mean, and predict survival chances for some invented passengers (including one like you). Needs <code>pip install scikit-learn seaborn</code>; the dataset downloads the first time.",
    file: "day86_titanic_classifier.py",
    code: R`# day86_titanic_classifier.py
# Logistic regression on the Titanic passengers.

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

FEATURES = ["pclass", "sex", "age", "sibsp", "parch", "fare", "embarked"]

raw = sns.load_dataset("titanic")
X_raw, y = raw[FEATURES], raw["survived"]
X_train_raw, X_test_raw, y_train, y_test = train_test_split(
    X_raw, y, test_size=0.2, random_state=86, stratify=y)


def prepare(df: pd.DataFrame, stats: dict) -> pd.DataFrame:
    """Turn raw passenger rows into numeric model inputs using training-set statistics."""
    out = df.copy()
    out["age"] = out["age"].fillna(stats["age_median"])
    out["fare"] = np.log1p(out["fare"].fillna(stats["fare_median"]))   # tame the long tail
    out["embarked"] = out["embarked"].fillna("S")
    out["is_child"] = (out["age"] < 12).astype(int)
    out["family"] = out["sibsp"] + out["parch"]
    out["female"] = (out["sex"] == "female").astype(int)
    out = pd.get_dummies(out.drop(columns=["sex"]), columns=["pclass", "embarked"], dtype=int)
    out = out.reindex(columns=stats["columns"], fill_value=0) if "columns" in stats else out
    return out


stats = {"age_median": X_train_raw["age"].median(), "fare_median": X_train_raw["fare"].median()}
X_train = prepare(X_train_raw, stats)
stats["columns"] = list(X_train.columns)             # remember the exact column layout
X_test = prepare(X_test_raw, stats)

baseline = DummyClassifier(strategy="most_frequent").fit(X_train, y_train)
model = LogisticRegression(max_iter=2000).fit(X_train, y_train)

print(f"Training on {len(X_train)} passengers, testing on {len(X_test)}")
print(f"Baseline accuracy (predict 'died' for everyone): {baseline.score(X_test, y_test):.1%}")
print(f"Logistic regression accuracy:                    {model.score(X_test, y_test):.1%}")

print("\nWhat the model learned (positive = raises the chance of survival):")
weights = pd.Series(model.coef_[0], index=X_train.columns).sort_values()
for name, w in weights.items():
    bar = "+" * int(abs(w) * 4) if w > 0 else "-" * int(abs(w) * 4)
    print(f"  {name:<12} {w:+.2f}  {bar}")
print(f"  Being female multiplies the odds of survival by {np.exp(weights['female']):.1f}")

people = pd.DataFrame([
    {"pclass": 1, "sex": "female", "age": 30, "sibsp": 1, "parch": 0, "fare": 80, "embarked": "C"},
    {"pclass": 3, "sex": "male", "age": 25, "sibsp": 0, "parch": 0, "fare": 8, "embarked": "S"},
    {"pclass": 2, "sex": "male", "age": 6, "sibsp": 1, "parch": 1, "fare": 26, "embarked": "S"},
    {"pclass": 3, "sex": "female", "age": 40, "sibsp": 1, "parch": 4, "fare": 31, "embarked": "S"},
], index=["Rose (1st, 30)", "Jack (3rd, 25)", "boy (2nd, 6)", "mother of 4 (3rd)"])
chances = model.predict_proba(prepare(people, stats))[:, 1]
print("\nSurvival chances:")
for name, p in zip(people.index, chances):
    print(f"  {name:<18} {p:5.0%}  -> {'survives' if p >= 0.5 else 'does not survive'}")

# How probability changes with age, for each class and sex
ages = np.arange(1, 75)
fig, ax = plt.subplots(figsize=(8, 4.5))
for pclass in (1, 2, 3):
    for sex, style in (("female", "-"), ("male", "--")):
        grid = pd.DataFrame({"pclass": pclass, "sex": sex, "age": ages, "sibsp": 0,
                             "parch": 0, "fare": raw.loc[raw.pclass == pclass, "fare"].median(),
                             "embarked": "S"})
        ax.plot(ages, model.predict_proba(prepare(grid, stats))[:, 1], style,
                label=f"{sex}, class {pclass}")
ax.axhline(0.5, color="grey", lw=0.8)
ax.set(title="Predicted survival chance by age", xlabel="Age", ylabel="P(survived)", ylim=(0, 1))
ax.legend(ncols=2, fontsize=8, loc="lower left")
fig.tight_layout()
fig.savefig("survival_by_age.png", dpi=120)
print("\nSaved survival_by_age.png")`,
    explain: [
      ["stratify=y", "Keeps the same proportion of survivors in the training and test sets. Use it whenever classes are unbalanced."],
      ["stats = {\"age_median\": X_train_raw[\"age\"].median(), ...}", "Gaps are filled with values learned from the training passengers only, so nothing leaks from the test set."],
      ["out.reindex(columns=stats[\"columns\"], fill_value=0)", "New data might lack a category (say, nobody from port Q), which would give fewer dummy columns. Reindexing forces the exact training layout."],
      ["np.log1p(out[\"fare\"])", "Fares range from 0 to 512. A log squeezes that long tail so a few rich passengers don't dominate."],
      ["np.exp(weights['female'])", "Logistic weights are in \"log-odds\". <code>exp</code> turns one into an odds multiplier that's easier to say out loud."],
      ["model.predict_proba(...)[:, 1]", "Column 1 is the probability of class 1 (survived)."]
    ],
    stretch: ["Remove <code>sex</code> from the features. How much accuracy is lost?", "Change the threshold from 0.5 to 0.4 and count how many more survivors you catch. Day 87 explores this trade-off.", "Add a feature from the passenger's title (Mr, Mrs, Miss, Master) using the <code>who</code> column."]
  },
  tests: ["Accuracy should be clearly above the baseline (roughly 77–80% vs 62%).", "The <code>female</code> weight should be the largest positive one.", "Change the age of the boy to 40. His chance should fall.", "Open <code>survival_by_age.png</code> and describe it in one sentence."]
};

L[87] = {
  intro: "\"95% accurate\" can describe a useless model. Today you learn to evaluate classifiers properly: which mistakes it makes, how the threshold trades one mistake for another, and how cross-validation gives a score you can trust.",
  lesson: [
    {h: "Why accuracy misleads",
     p: "If 1% of transactions are fraud, a model that always says \"not fraud\" is 99% accurate and catches nothing. When classes are unbalanced, or when one mistake costs more than the other, you need more detailed measures."},
    {h: "The confusion matrix",
     p: "Count the four outcomes. <b>True positives</b> (TP): said yes, was yes. <b>False positives</b> (FP): said yes, was no (a false alarm). <b>False negatives</b> (FN): said no, was yes (a miss). <b>True negatives</b> (TN). <code>confusion_matrix(y_true, y_pred)</code> returns <code>[[TN, FP], [FN, TP]]</code>.",
     code: R`from sklearn.metrics import confusion_matrix

y_true = [1, 1, 1, 0, 0, 0, 0, 0]
y_pred = [1, 1, 0, 1, 0, 0, 0, 0]
print(confusion_matrix(y_true, y_pred))`,
     out: "[[4 1]\n [1 2]]"},
    {h: "Precision, recall and F1",
     p: "<b>Precision</b> = TP / (TP + FP): when the model says yes, how often is it right? <b>Recall</b> = TP / (TP + FN): of all real yeses, how many did it find? A cancer screen needs high recall (don't miss anyone); a spam filter needs high precision (don't bin real email). <b>F1</b> combines both into one number. <code>classification_report</code> prints all of them."},
    {h: "Thresholds and ROC AUC",
     p: "Lowering the threshold catches more positives (recall rises) but raises more false alarms (precision falls). The <b>ROC curve</b> shows this trade-off at every threshold, and the area under it (<b>AUC</b>) summarises ranking quality: 0.5 is a coin flip, 1.0 is perfect. Choose the threshold based on what the mistakes cost."},
    {h: "Cross-validation",
     p: "One train/test split is one roll of the dice. <b>k-fold cross-validation</b> splits the data into k parts, trains k times, each time testing on a different part, and averages. <code>cross_val_score(model, X, y, cv=5)</code> does it in one line and the spread shows how stable the score is. Use <code>StratifiedKFold</code> to keep class proportions in each fold."}
  ],
  exercises: [
    {q: "From the confusion matrix above, compute precision and recall by hand.", sol: R`# TP=2, FP=1, FN=1
# precision = 2 / (2 + 1) = 0.67
# recall    = 2 / (2 + 1) = 0.67`},
    {q: "A model predicts fraud for 50 transactions; 40 really are fraud. There were 200 frauds in total. What are precision and recall?", sol: R`# precision = 40 / 50 = 0.8
# recall    = 40 / 200 = 0.2   (it misses most fraud)`},
    {q: "Run 5-fold cross-validation of <code>LogisticRegression(max_iter=5000)</code> on <code>load_breast_cancer</code> and print the mean and standard deviation.", sol: R`from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
X, y = load_breast_cancer(return_X_y=True)
scores = cross_val_score(LogisticRegression(max_iter=5000), X, y, cv=5)
print(scores.mean().round(3), scores.std().round(3))`}
  ],
  project: {
    title: "Classifier evaluation report",
    brief: "Train a classifier that flags breast tumours as malignant from 30 measurements, then write a proper evaluation: confusion matrix, precision and recall, ROC AUC, a threshold table showing the trade-off, and cross-validated scores. The script writes <code>evaluation_report.md</code> and two charts, the kind of report a team would want before trusting a medical model.",
    file: "day87_evaluation_report.py",
    code: R`# day87_evaluation_report.py
# Evaluate a cancer classifier properly and write the results to a Markdown report.

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (ConfusionMatrixDisplay, RocCurveDisplay, classification_report,
                             confusion_matrix, precision_score, recall_score, roc_auc_score)
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

HERE = Path(__file__).parent

# In this dataset 0 = malignant, 1 = benign. Flip it so 1 means "cancer", the thing we want to catch.
data = load_breast_cancer()
X, y = data.data, 1 - data.target
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=87, stratify=y)

model = make_pipeline(StandardScaler(), LogisticRegression(max_iter=5000))
model.fit(X_train, y_train)
proba = model.predict_proba(X_test)[:, 1]
pred = (proba >= 0.5).astype(int)

cm = confusion_matrix(y_test, pred)
tn, fp, fn, tp = cm.ravel()
report = classification_report(y_test, pred, target_names=["benign", "malignant"], digits=3)
auc = roc_auc_score(y_test, proba)
print(f"Test set: {len(y_test)} tumours, {y_test.sum()} malignant")
print(report)
print(f"Missed cancers (false negatives): {fn};  false alarms: {fp};  ROC AUC: {auc:.3f}")

# The threshold trade-off
rows = []
for t in (0.1, 0.2, 0.3, 0.5, 0.7, 0.9):
    p = (proba >= t).astype(int)
    rows.append((t, precision_score(y_test, p), recall_score(y_test, p),
                 int(((p == 0) & (y_test == 1)).sum()), int(((p == 1) & (y_test == 0)).sum())))
print("\nthreshold  precision  recall  missed  false alarms")
for t, prec, rec, missed, alarms in rows:
    print(f"   {t:.1f}       {prec:.3f}    {rec:.3f}    {missed:>3}      {alarms:>3}")

# Cross-validation on the whole dataset for a more reliable estimate
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=87)
scores = cross_validate(model, X, y, cv=cv, scoring=["accuracy", "precision", "recall", "roc_auc"])
print("\n5-fold cross-validation:")
cv_lines = []
for metric in ("accuracy", "precision", "recall", "roc_auc"):
    values = scores[f"test_{metric}"]
    line = f"{metric:<10} {values.mean():.3f} ± {values.std():.3f}"
    cv_lines.append(f"| {metric} | {values.mean():.3f} | {values.std():.3f} |")
    print("  " + line)

# Charts
fig, axes = plt.subplots(1, 2, figsize=(10, 4))
ConfusionMatrixDisplay(cm, display_labels=["benign", "malignant"]).plot(ax=axes[0], colorbar=False)
axes[0].set_title("Confusion matrix (threshold 0.5)")
RocCurveDisplay.from_predictions(y_test, proba, ax=axes[1], name="logistic regression")
axes[1].plot([0, 1], [0, 1], "k--", lw=0.8, label="coin flip")
axes[1].set_title(f"ROC curve (AUC = {auc:.3f})")
axes[1].legend()
fig.tight_layout()
fig.savefig(HERE / "evaluation_charts.png", dpi=120)

# Markdown report
threshold_rows = "\n".join(f"| {t:.1f} | {p:.3f} | {r:.3f} | {m} | {a} |" for t, p, r, m, a in rows)
md = f"""# Breast cancer classifier: evaluation

**Model:** standard scaling + logistic regression, 30 features.
**Test set:** {len(y_test)} tumours ({y_test.sum()} malignant), never used in training.

## Results at threshold 0.5
- Caught **{tp} of {tp + fn}** malignant tumours (recall {tp / (tp + fn):.1%}).
- Missed **{fn}** cancers and raised **{fp}** false alarms.
- ROC AUC: **{auc:.3f}**.

![charts](evaluation_charts.png)

## Choosing a threshold
Missing a cancer is far worse than a false alarm (which only leads to another test),
so a threshold below 0.5 is worth considering.

| threshold | precision | recall | missed cancers | false alarms |
|---|---|---|---|---|
{threshold_rows}

## Cross-validation (5 folds, whole dataset)
| metric | mean | std |
|---|---|---|
{chr(10).join(cv_lines)}

## Limitations
- 569 tumours from one hospital; performance elsewhere is unknown.
- Probabilities have not been checked for calibration.
"""
(HERE / "evaluation_report.md").write_text(md, encoding="utf-8")
print("\nWrote evaluation_report.md and evaluation_charts.png")`,
    explain: [
      ["X, y = data.data, 1 - data.target", "The dataset codes malignant as 0. Flipping it makes \"positive\" mean cancer, so precision and recall talk about the class we care about."],
      ["make_pipeline(StandardScaler(), LogisticRegression(...))", "Glues scaling and the model into one estimator, so cross-validation re-fits the scaler inside each fold. Day 88 covers pipelines properly."],
      ["tn, fp, fn, tp = cm.ravel()", "<code>ravel</code> flattens the 2×2 matrix in the order TN, FP, FN, TP."],
      ["(proba >= t).astype(int)", "Applying your own threshold to the probabilities instead of relying on <code>predict</code>'s fixed 0.5."],
      ["cross_validate(..., scoring=[...])", "Like <code>cross_val_score</code> but with several metrics at once. The ± is the standard deviation across folds."],
      ["{chr(10).join(cv_lines)}", "<code>chr(10)</code> is a newline. Backslashes aren't allowed inside f-string braces before Python 3.12, so this is a portable trick."]
    ],
    stretch: ["Pick the highest threshold that still catches every cancer in the test set and add it to the report.", "Compare with <code>DummyClassifier(strategy=\"most_frequent\")</code>: what's its accuracy, and what's its recall?", "Add a precision-recall curve with <code>PrecisionRecallDisplay</code>."]
  },
  tests: ["Accuracy should be around 95% or higher, with AUC near 0.99. This particular test split may look almost perfect; the cross-validation scores are lower and more honest, because one split can be lucky.", "In the threshold table, recall should rise as the threshold falls.", "Open <code>evaluation_report.md</code> in VS Code's preview and check the chart appears.", "Explain to someone why a lower threshold could be the right choice here."]
};

L[88] = {
  intro: "Real datasets mix numbers, categories and missing values. Today you learn to transform them properly with scikit-learn's preprocessing tools, and to bundle every step with the model in a <b>pipeline</b> so nothing can leak or be forgotten.",
  lesson: [
    {h: "Scaling numbers",
     p: "<code>StandardScaler</code> rescales each column to mean 0 and standard deviation 1. Like every transformer it has <code>fit</code> (learn the mean and std from training data) and <code>transform</code> (apply them). <code>fit_transform</code> does both on the training set; on test data you only <code>transform</code>. Many models (linear, k-nearest neighbours, neural networks) need it; trees don't."},
    {h: "Encoding categories",
     p: "<code>OneHotEncoder</code> turns a text column into one 0/1 column per category. Use <code>handle_unknown=\"ignore\"</code> so a category never seen in training becomes all zeros instead of crashing. For ordered categories (small, medium, large), <code>OrdinalEncoder</code> keeps the order as 0, 1, 2.",
     code: R`from sklearn.preprocessing import OneHotEncoder
import pandas as pd

enc = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
enc.fit(pd.DataFrame({"city": ["Nairobi", "Mogadishu", "Nairobi"]}))
print(enc.get_feature_names_out(), enc.transform(pd.DataFrame({"city": ["Mogadishu", "Paris"]})))`,
     out: "['city_Mogadishu' 'city_Nairobi'] [[1. 0.]\n [0. 0.]]"},
    {h: "Filling gaps",
     p: "<code>SimpleImputer(strategy=\"median\")</code> fills missing numbers with the training median; <code>strategy=\"most_frequent\"</code> works for categories. <code>add_indicator=True</code> also adds a \"was missing\" column, because sometimes the gap itself carries information."},
    {h: "ColumnTransformer",
     p: "<code>ColumnTransformer</code> applies different steps to different columns: impute and scale the numbers, impute and one-hot the categories, and join the results. You describe it as a list of <code>(name, transformer, columns)</code>."},
    {h: "Pipelines prevent leakage",
     p: "<code>Pipeline([(\"prep\", preprocessor), (\"model\", Ridge())])</code> chains everything into one estimator. Calling <code>fit</code> fits each step on the training data only; <code>predict</code> applies the same steps to new data. Cross-validation re-fits the whole pipeline inside each fold, so test folds never influence preprocessing. Save the pipeline and you've saved the whole recipe."}
  ],
  exercises: [
    {q: "Scale <code>[[1], [2], [3]]</code> with <code>StandardScaler</code>, then transform <code>[[4]]</code> with the same scaler.", sol: R`from sklearn.preprocessing import StandardScaler
s = StandardScaler().fit([[1], [2], [3]])
print(s.transform([[4]]))   # [[2.449...]]`},
    {q: "Use <code>SimpleImputer(strategy=\"median\")</code> on <code>[[1], [None], [5], [7]]</code>.", sol: R`from sklearn.impute import SimpleImputer
import numpy as np
print(SimpleImputer(strategy="median").fit_transform(np.array([[1], [np.nan], [5], [7]])))`},
    {q: "Explain in one sentence what goes wrong if you scale the whole dataset before splitting it.", sol: R`# The scaler's mean and std include the test rows, so information about the test set
# leaks into training and the test score becomes optimistic.`}
  ],
  project: {
    title: "Housing pipeline",
    brief: "Build a complete preprocessing + model pipeline for a messy housing dataset with numbers, categories and gaps. Cross-validate it, compare a few models fairly, show what the pipeline produces internally, and save the fitted pipeline with <code>joblib</code> so a new script can load it and price houses from plain dictionaries.",
    file: "day88_housing_pipeline.py",
    code: R`# day88_housing_pipeline.py
# Preprocessing and model in one pipeline, cross-validated, saved and reloaded.

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyRegressor
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.model_selection import KFold, cross_val_score, train_test_split
from sklearn.neighbors import KNeighborsRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder, StandardScaler

rng = np.random.default_rng(88)
NUMERIC = ["size_m2", "rooms", "year_built", "distance_km"]
NOMINAL = ["neighbourhood", "house_type"]
ORDINAL = ["condition"]
CONDITIONS = ["poor", "fair", "good", "excellent"]


def make_housing(n: int = 1200) -> pd.DataFrame:
    hoods = {"Riverside": 1.25, "Old Town": 1.10, "Hillview": 1.00, "Industrial": 0.80, "Airport": 0.85}
    df = pd.DataFrame({
        "size_m2": rng.normal(105, 35, n).clip(25, 320).round(),
        "year_built": rng.integers(1950, 2025, n),
        "distance_km": rng.gamma(2, 4, n).round(1),
        "neighbourhood": rng.choice(list(hoods), n, p=[0.15, 0.2, 0.3, 0.2, 0.15]),
        "house_type": rng.choice(["flat", "terraced", "detached"], n, p=[0.45, 0.35, 0.2]),
        "condition": rng.choice(CONDITIONS, n, p=[0.1, 0.3, 0.45, 0.15]),
    })
    df["rooms"] = np.clip((df["size_m2"] / 28 + rng.normal(0, 0.8, n)).round(), 1, 9)
    price = (1_900 * df["size_m2"] + 6_000 * df["rooms"] + 400 * (df["year_built"] - 1950)
             - 2_800 * df["distance_km"]
             + df["house_type"].map({"flat": 0, "terraced": 15_000, "detached": 45_000})
             + df["condition"].map(dict(zip(CONDITIONS, [-30_000, -8_000, 0, 25_000]))))
    df["price"] = (price * df["neighbourhood"].map(hoods) + rng.normal(0, 15_000, n)).round(-2)
    for col, frac in (("size_m2", 0.05), ("year_built", 0.08), ("condition", 0.06), ("house_type", 0.03)):
        df.loc[rng.random(n) < frac, col] = np.nan            # real data has gaps
    return df


def build_preprocessor() -> ColumnTransformer:
    numeric = Pipeline([("impute", SimpleImputer(strategy="median", add_indicator=True)),
                        ("scale", StandardScaler())])
    nominal = Pipeline([("impute", SimpleImputer(strategy="most_frequent")),
                        ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))])
    ordinal = Pipeline([("impute", SimpleImputer(strategy="most_frequent")),
                        ("order", OrdinalEncoder(categories=[CONDITIONS])),
                        ("scale", StandardScaler())])
    return ColumnTransformer([("num", numeric, NUMERIC),
                              ("nom", nominal, NOMINAL),
                              ("ord", ordinal, ORDINAL)])


def main() -> None:
    df = make_housing()
    print(f"{len(df)} houses. Missing values per column:")
    print(df.isna().sum()[lambda s: s > 0].to_string())

    X, y = df.drop(columns="price"), df["price"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=88)

    candidates = {
        "baseline": DummyRegressor(),
        "ridge": Ridge(alpha=1.0),
        "knn (k=10)": KNeighborsRegressor(n_neighbors=10),
    }
    cv = KFold(n_splits=5, shuffle=True, random_state=88)
    print("\n5-fold cross-validated MAE on the training set:")
    for name, model in candidates.items():
        pipe = Pipeline([("prep", build_preprocessor()), ("model", model)])
        mae = -cross_val_score(pipe, X_train, y_train, cv=cv, scoring="neg_mean_absolute_error")
        print(f"  {name:<11} {mae.mean():>9,.0f} ± {mae.std():,.0f}")

    final = Pipeline([("prep", build_preprocessor()), ("model", Ridge(alpha=1.0))])
    final.fit(X_train, y_train)
    test_mae = np.abs(final.predict(X_test) - y_test).mean()
    print(f"\nChosen: ridge. Test MAE {test_mae:,.0f} (typical price {y.median():,.0f})")

    names = final.named_steps["prep"].get_feature_names_out()
    print(f"\nThe preprocessor turns 7 raw columns into {len(names)} model inputs:")
    print("  " + ", ".join(n.split("__")[1] for n in names))

    joblib.dump(final, "housing_model.joblib")
    loaded = joblib.load("housing_model.joblib")
    new_houses = pd.DataFrame([
        {"size_m2": 70, "rooms": 3, "year_built": 1985, "distance_km": 2.5,
         "neighbourhood": "Old Town", "house_type": "flat", "condition": "good"},
        {"size_m2": 180, "rooms": 6, "year_built": None, "distance_km": 9.0,
         "neighbourhood": "Riverside", "house_type": "detached", "condition": "excellent"},
        {"size_m2": 95, "rooms": 4, "year_built": 2010, "distance_km": 4.0,
         "neighbourhood": "Brand New Estate", "house_type": "terraced", "condition": None},
    ])
    print("\nReloaded model, pricing new houses (note the gaps and the unknown neighbourhood):")
    for (_, house), price in zip(new_houses.iterrows(), loaded.predict(new_houses)):
        print(f"  {house['size_m2']:>4.0f} m² {house['house_type']:<9} in {house['neighbourhood']:<17} -> {price:>10,.0f}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["df.loc[rng.random(n) < frac, col] = np.nan", "Knocks random holes in a few columns so the pipeline has to cope with missing data, as it would in real life."],
      ["SimpleImputer(strategy=\"median\", add_indicator=True)", "Fills gaps with the training median and adds a column saying which values were missing."],
      ["OrdinalEncoder(categories=[CONDITIONS])", "Condition has a natural order, so it becomes 0 to 3 rather than four unrelated columns."],
      ["ColumnTransformer([...])", "Routes each group of columns through its own mini-pipeline and joins the outputs side by side."],
      ["-cross_val_score(..., scoring=\"neg_mean_absolute_error\")", "scikit-learn always maximises scores, so error metrics are negated. The minus sign turns them back into normal MAE."],
      ["joblib.dump(final, \"housing_model.joblib\")", "Saves the whole fitted pipeline: imputers, encoders, scaler and model. Loading it gives back an object that takes raw rows."]
    ],
    stretch: ["Remove the scaler from the numeric pipeline and rerun. Which model suffers most, and why?", "Add a feature <code>age = 2026 - year_built</code> with a <code>FunctionTransformer</code>.", "Write <code>price_house.py</code> that loads the saved model and asks the user for a house's details with <code>input()</code>."]
  },
  tests: ["Ridge should beat the baseline's MAE by a wide margin.", "Check that the house in \"Brand New Estate\" gets a price instead of an error. Which setting makes that possible?", "Delete <code>housing_model.joblib</code>, rerun, and confirm it's recreated.", "Count the model inputs and explain where each one comes from."]
};

L[89] = {
  intro: "Decision trees make predictions by asking a series of yes/no questions, the way a person might. They handle mixed data with no scaling, can be read like a flowchart, and when you grow hundreds of them into a <b>random forest</b>, they become one of the most reliable models for tabular data.",
  lesson: [
    {h: "How a tree decides",
     p: "A tree starts with all the data and picks the question that best separates the classes, for example \"credit score below 620?\". It repeats on each side until the groups are pure or a limit is reached. To predict, a new example walks down the questions to a leaf. <code>export_text(tree, feature_names=...)</code> prints the rules."},
    {h: "Choosing splits",
     p: "\"Best\" means the split that most reduces <b>impurity</b>. <b>Gini impurity</b> is 0 for a group that's all one class and highest for a 50/50 mix. The tree tries every feature and threshold and keeps the one with the biggest drop. You never compute this yourself, but it explains why trees need no scaling: only the order of values matters."},
    {h: "Trees overfit",
     p: "Left unlimited, a tree keeps splitting until every training example sits in its own leaf: 100% training accuracy and poor results on new data. Limit it with <code>max_depth</code>, <code>min_samples_leaf</code> or <code>max_leaf_nodes</code>. Always compare training and test scores; a big gap means overfitting.",
     code: R`from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = load_breast_cancer(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)
for depth in (2, None):
    t = DecisionTreeClassifier(max_depth=depth, random_state=0).fit(X_tr, y_tr)
    print(depth, round(t.score(X_tr, y_tr), 3), round(t.score(X_te, y_te), 3))`,
     out: "2 0.941 0.937\nNone 1.0 0.881"},
    {h: "Random forests",
     p: "A <b>random forest</b> trains many trees, each on a random sample of the rows and considering a random subset of features at each split, then lets them vote. Individual trees overfit in different ways and their errors cancel out. <code>RandomForestClassifier(n_estimators=300)</code> is a strong default for almost any table of data."},
    {h: "Which features matter?",
     p: "<code>model.feature_importances_</code> shows how much each feature reduced impurity across the forest. It's fast but favours features with many unique values. <b>Permutation importance</b> is more honest: shuffle one column in the test set and measure how much the score drops. If shuffling a feature doesn't hurt, the model wasn't really using it."}
  ],
  exercises: [
    {q: "Train a <code>DecisionTreeClassifier(max_depth=2)</code> on the iris dataset and print its rules with <code>export_text</code>.", sol: R`from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_text
iris = load_iris()
t = DecisionTreeClassifier(max_depth=2).fit(iris.data, iris.target)
print(export_text(t, feature_names=iris.feature_names))`},
    {q: "Compute the Gini impurity of a group with 8 approved and 2 rejected loans. (Gini = 1 - sum of squared class proportions.)", sol: R`p = [0.8, 0.2]
print(1 - sum(x ** 2 for x in p))   # 0.32`},
    {q: "Compare a single tree with a 200-tree random forest on the breast cancer test set.", sol: R`from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=200, random_state=0).fit(X_tr, y_tr)
print(rf.score(X_te, y_te))`}
  ],
  project: {
    title: "Loan approval model",
    brief: "A lender wants a model that predicts whether a loan application will be approved, and wants to understand its reasoning. Generate realistic applicants, train a shallow tree you can read as rules, show how an unlimited tree overfits, train a random forest, explain predictions with feature and permutation importance, and walk one applicant through the decision.",
    file: "day89_loan_model.py",
    code: R`# day89_loan_model.py
# Readable decision tree vs accurate random forest, with explanations.

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, export_text

rng = np.random.default_rng(89)


def make_applicants(n: int = 3000) -> pd.DataFrame:
    df = pd.DataFrame({
        "income": rng.lognormal(10.6, 0.5, n).round(-2),            # yearly
        "credit_score": rng.normal(660, 70, n).clip(300, 850).round(),
        "years_employed": rng.exponential(5, n).round(1),
        "existing_debt": rng.lognormal(8.5, 1.0, n).round(-2),
        "past_default": rng.random(n) < 0.08,
        "purpose": rng.choice(["home", "car", "education", "business", "holiday"], n),
    })
    df["loan_amount"] = (df["income"] * rng.uniform(0.1, 1.2, n)).round(-2)
    burden = (df["loan_amount"] + df["existing_debt"]) / df["income"]
    score = (0.02 * (df["credit_score"] - 620) - 2.5 * (burden - 0.8) + 0.08 * df["years_employed"]
             - 2.5 * df["past_default"] + df["purpose"].map({"home": 0.4, "car": 0.2, "education": 0.3,
                                                             "business": -0.3, "holiday": -0.6}))
    df["approved"] = (score + rng.normal(0, 0.6, n) > 0).astype(int)
    return df


def to_features(df: pd.DataFrame) -> pd.DataFrame:
    X = df.drop(columns="approved").copy()
    X["debt_to_income"] = ((X["loan_amount"] + X["existing_debt"]) / X["income"]).round(3)
    X["past_default"] = X["past_default"].astype(int)
    return pd.get_dummies(X, columns=["purpose"], dtype=int)


def main() -> None:
    df = make_applicants()
    X, y = to_features(df), df["approved"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=89, stratify=y)
    print(f"{len(df)} applications, {y.mean():.0%} approved")

    print("\nA tree you can read (max_depth=3):")
    small = DecisionTreeClassifier(max_depth=3, random_state=89).fit(X_train, y_train)
    print(export_text(small, feature_names=list(X.columns), decimals=2))

    models = {
        "tree, depth 3": small,
        "tree, unlimited": DecisionTreeClassifier(random_state=89).fit(X_train, y_train),
        "random forest": RandomForestClassifier(n_estimators=300, min_samples_leaf=2,
                                                n_jobs=-1, random_state=89).fit(X_train, y_train),
    }
    print(f"{'model':<17}{'train':>7}{'test':>7}")
    for name, m in models.items():
        print(f"{name:<17}{m.score(X_train, y_train):>7.3f}{m.score(X_test, y_test):>7.3f}")

    forest = models["random forest"]
    built_in = pd.Series(forest.feature_importances_, index=X.columns)
    perm = permutation_importance(forest, X_test, y_test, n_repeats=10, random_state=89, n_jobs=-1)
    shuffled = pd.Series(perm.importances_mean, index=X.columns)
    table = pd.DataFrame({"impurity": built_in, "permutation": shuffled}).sort_values("permutation", ascending=False)
    print("\nFeature importance (permutation = accuracy lost when the column is shuffled):")
    print(table.round(3).head(8).to_string())

    applicant = X_test.iloc[[0]]
    chance = forest.predict_proba(applicant)[0, 1]
    print("\nOne applicant:")
    print(applicant.T.rename(columns={applicant.index[0]: "value"}).head(6).to_string())
    print(f"Forest's approval probability: {chance:.0%}")
    print("Path through the small tree:")
    tree = small.tree_
    node = 0
    while tree.children_left[node] != -1:
        feature = X.columns[tree.feature[node]]
        value = applicant.iloc[0][feature]
        goes_left = value <= tree.threshold[node]
        print(f"  {feature} = {value:g} {'<=' if goes_left else '>'} {tree.threshold[node]:.2f}")
        node = tree.children_left[node] if goes_left else tree.children_right[node]
    counts = tree.value[node][0]
    print(f"  -> leaf says {'approve' if counts.argmax() == 1 else 'reject'}")


if __name__ == "__main__":
    main()`,
    explain: [
      ["score = (0.02 * (credit_score - 620) - 2.5 * (burden - 0.8) ...)", "The hidden rule behind approvals. The model never sees it; it must rediscover which factors matter from the examples."],
      ["X[\"debt_to_income\"] = ...", "Feature engineering: lenders think in ratios, so giving the model the ratio directly makes its job easier and its rules clearer."],
      ["export_text(small, ...)", "Prints the tree as nested if/else rules a loan officer can read and challenge."],
      ["RandomForestClassifier(n_estimators=300, min_samples_leaf=2, n_jobs=-1)", "300 trees, each leaf holding at least 2 applicants, trained on all CPU cores."],
      ["permutation_importance(forest, X_test, y_test, ...)", "Shuffles each column of the test set 10 times and records how much accuracy drops."],
      ["while tree.children_left[node] != -1:", "Walks the fitted tree by hand. A node with no children (-1) is a leaf."]
    ],
    stretch: ["Use <code>sklearn.tree.plot_tree</code> to draw the small tree and save it as a PNG.", "Compare approval rates by <code>purpose</code> in the data and in the model's predictions. Is the model treating groups differently? Discuss whether that's fair.", "Try <code>HistGradientBoostingClassifier</code> and compare it with the forest."]
  },
  tests: ["The unlimited tree should score 1.000 on training data and noticeably lower on the test set.", "The forest should have the best test score.", "The top split of the small tree should use credit score or debt-to-income.", "Pick another applicant (<code>iloc[[5]]</code>) and follow their path."]
};

L[90] = {
  intro: "So far every dataset came with answers to learn from. In <b>unsupervised learning</b> there are no labels; the model looks for structure on its own. Clustering groups similar items together, and businesses use it to find customer segments.",
  lesson: [
    {h: "Supervised vs unsupervised",
     p: "Supervised learning has an <code>X</code> and a <code>y</code>: inputs and correct answers. Unsupervised learning only has <code>X</code>. Clustering asks \"which examples belong together?\" There's no single right answer, so you judge results by whether they're useful and make sense."},
    {h: "k-means in four steps",
     p: "1) Choose <code>k</code>, the number of clusters, and place k centres at random. 2) Assign each point to its nearest centre. 3) Move each centre to the mean of its points. 4) Repeat steps 2 and 3 until nothing changes. <code>KMeans(n_clusters=4, n_init=10)</code> runs it 10 times from different starts and keeps the best.",
     code: R`import numpy as np
from sklearn.cluster import KMeans

points = np.array([[1, 1], [1.5, 2], [1, 1.5], [8, 8], [9, 8.5], [8.5, 9]])
km = KMeans(n_clusters=2, n_init=10, random_state=0).fit(points)
print(km.labels_, km.cluster_centers_.round(2).tolist())`,
     out: "[1 1 1 0 0 0] [[8.5, 8.5], [1.17, 1.5]]"},
    {h: "Scaling matters even more",
     p: "k-means uses distance, so a feature measured in thousands (yearly spend) would swamp one measured in single digits (visits per month). Always standardise first. Skewed features like money often work better after a log transform."},
    {h: "Choosing k",
     p: "<b>Inertia</b> (the total squared distance from points to their centres) always falls as k grows, so look for the <b>elbow</b> where it stops falling steeply. The <b>silhouette score</b> (-1 to 1) measures how much closer points are to their own cluster than to the next one; higher is better. Then check that the clusters make business sense."},
    {h: "Describing clusters",
     p: "A cluster number means nothing to a marketing team. Profile each one with <code>df.groupby(\"cluster\").mean()</code>, compare it with the overall average, and give it a name like \"loyal big spenders\" or \"lapsed customers\"."}
  ],
  exercises: [
    {q: "In the example above, add the point <code>[5, 5]</code>. Which cluster does <code>km.predict</code> put it in?", sol: R`print(km.predict([[5, 5]]))`},
    {q: "Compute the silhouette score of the two-cluster example.", sol: R`from sklearn.metrics import silhouette_score
print(silhouette_score(points, km.labels_))   # close to 1: very clear clusters`},
    {q: "Why might you apply <code>np.log1p</code> to a spending column before clustering?", sol: R`# Spending is usually skewed: a few customers spend 100x the rest.
# The log compresses those extremes so they don't form their own clusters or dominate distances.`}
  ],
  project: {
    title: "Customer segmentation",
    brief: "A shop has 2,000 customers described by yearly spend, visits, basket size, days since their last visit and how many product categories they buy. Find natural segments with k-means: prepare the features, choose k with the elbow and silhouette, profile and name each segment, chart them, and save the labelled customers to CSV for the marketing team.",
    file: "day90_segmentation.py",
    code: R`# day90_segmentation.py
# Customer segmentation with k-means.

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

rng = np.random.default_rng(90)
FEATURES = ["yearly_spend", "visits_per_month", "avg_basket", "days_since_last", "categories"]


def make_customers() -> pd.DataFrame:
    """Four hidden customer types. The clustering never sees the 'true_type' column."""
    types = {  # count, spend, visits, basket, days since last, categories
        "loyal": (400, 2400, 8, 25, 5, 6),
        "occasional": (900, 450, 1.5, 25, 40, 3),
        "big-basket": (350, 1900, 2, 80, 20, 4),
        "lapsed": (350, 300, 0.4, 60, 200, 2),
    }
    parts = []
    for name, (n, spend, visits, basket, days, cats) in types.items():
        parts.append(pd.DataFrame({
            "yearly_spend": rng.lognormal(np.log(spend), 0.35, n).round(2),
            "visits_per_month": rng.gamma(visits * 4, 0.25, n).round(1),
            "avg_basket": rng.lognormal(np.log(basket), 0.3, n).round(2),
            "days_since_last": rng.gamma(4, days / 4, n).round(),
            "categories": np.clip(rng.poisson(cats, n), 1, 10),
            "true_type": name,
        }))
    return pd.concat(parts, ignore_index=True).sample(frac=1, random_state=90).reset_index(drop=True)


def prepare(df: pd.DataFrame) -> np.ndarray:
    X = df[FEATURES].copy()
    for col in ("yearly_spend", "avg_basket", "days_since_last", "visits_per_month"):
        X[col] = np.log1p(X[col])                       # tame long tails
    return StandardScaler().fit_transform(X)


def name_segment(profile: pd.Series, overall: pd.Series) -> str:
    if profile["days_since_last"] > 2 * overall["days_since_last"]:
        return "lapsed"
    if profile["visits_per_month"] > 1.5 * overall["visits_per_month"]:
        return "loyal regulars"
    if profile["avg_basket"] > 1.5 * overall["avg_basket"]:
        return "big-basket shoppers"
    return "occasional shoppers"


def main() -> None:
    df = make_customers()
    X = prepare(df)

    print(" k   inertia   silhouette")
    scores = {}
    for k in range(2, 9):
        km = KMeans(n_clusters=k, n_init=10, random_state=90).fit(X)
        scores[k] = silhouette_score(X, km.labels_, sample_size=1500, random_state=90)
        print(f"{k:>2} {km.inertia_:>9.0f}   {scores[k]:.3f}")
    best_k = max(scores, key=scores.get)
    print(f"Best silhouette at k = {best_k}")

    km = KMeans(n_clusters=best_k, n_init=10, random_state=90).fit(X)
    df["cluster"] = km.labels_
    overall = df[FEATURES].mean()
    profiles = df.groupby("cluster")[FEATURES].mean()
    names = {c: name_segment(profiles.loc[c], overall) for c in profiles.index}
    df["segment"] = df["cluster"].map(names)

    summary = df.groupby("segment")[FEATURES].mean().round(1)
    summary.insert(0, "customers", df["segment"].value_counts())
    summary["share_of_revenue"] = (df.groupby("segment")["yearly_spend"].sum() / df["yearly_spend"].sum()).round(2)
    print("\nSegment profiles:")
    print(summary.sort_values("customers", ascending=False).to_string())

    print("\nHow well did we recover the hidden types?")
    print(pd.crosstab(df["true_type"], df["segment"]).to_string())

    fig, ax = plt.subplots(figsize=(7, 5))
    for segment, group in df.groupby("segment"):
        ax.scatter(group["visits_per_month"], group["yearly_spend"], s=8, alpha=0.6, label=segment)
    ax.set(xscale="log", yscale="log", xlabel="Visits per month (log scale)",
           ylabel="Yearly spend (log scale)", title="Customer segments")
    ax.legend(markerscale=2)
    fig.tight_layout()
    fig.savefig("segments.png", dpi=120)
    df.drop(columns="true_type").to_csv("customer_segments.csv", index=False)
    print("\nSaved segments.png and customer_segments.csv")


if __name__ == "__main__":
    main()`,
    explain: [
      ["\"true_type\": name", "We hide the real customer types in the data so we can check afterwards whether clustering found them. With real customers you won't have this luxury."],
      ["X[col] = np.log1p(X[col])", "Money and day counts are skewed; the log keeps a few extreme customers from dominating the distances."],
      ["silhouette_score(X, km.labels_, sample_size=1500, ...)", "Silhouette compares every pair of points, which is slow for big data. Sampling 1,500 points gives a good estimate quickly."],
      ["name_segment(profile, overall)", "Turns numbers into names by comparing each cluster with the average customer. In a real project you'd agree these rules with the business."],
      ["pd.crosstab(df[\"true_type\"], df[\"segment\"])", "A table of hidden type against found segment. A clean diagonal means the clusters match reality."]
    ],
    stretch: ["Run k-means with k = 6 and describe the extra segments. Are they useful or just splitting hairs?", "Suggest one marketing action for each segment and add it to the CSV.", "Try <code>AgglomerativeClustering</code> and compare the crosstab."]
  },
  tests: ["The silhouette score should peak at k = 4.", "Each hidden type should land almost entirely in one segment.", "\"Lapsed\" customers should have the highest days since last visit.", "Open <code>customer_segments.csv</code> and check every row has a segment."]
};

L[91] = {
  intro: "A tiny 8×8 image of a digit is already 64 numbers, and real data can have thousands of columns. You can't plot 64 dimensions, but <b>dimensionality reduction</b> can squeeze them into 2 while keeping most of the structure. Today's tool is PCA.",
  lesson: [
    {h: "The curse of many dimensions",
     p: "More columns aren't always better. Many features are redundant (neighbouring pixels are almost the same), they slow models down, and in high dimensions everything ends up far from everything else, which hurts distance-based models. Reducing dimensions can make data easier to see, faster to model, and sometimes more accurate."},
    {h: "What PCA does",
     p: "<b>Principal Component Analysis</b> finds the directions along which the data varies most. The first principal component is the single direction with the most spread; the second is the next most, at right angles to the first, and so on. Projecting onto the first few components keeps as much variation as possible in fewer numbers. PCA needs centred data and usually scaled data.",
     code: R`import numpy as np
from sklearn.decomposition import PCA

rng = np.random.default_rng(0)
x = rng.normal(size=500)
data = np.column_stack([x, 2 * x + rng.normal(scale=0.3, size=500)])   # two related columns
pca = PCA().fit(data)
print(pca.explained_variance_ratio_.round(3))`,
     out: "[0.997 0.003]"},
    {h: "Explained variance",
     p: "<code>explained_variance_ratio_</code> tells you what share of the total variation each component keeps. Above, one component keeps 99.7% because the two columns are almost the same information. <code>np.cumsum</code> of the ratios shows how many components you need for, say, 95%. Or pass <code>PCA(n_components=0.95)</code> and let it choose."},
    {h: "Going back: reconstruction",
     p: "<code>pca.inverse_transform(reduced)</code> maps the compressed numbers back to the original space. With few components you get a blurry version of the input; with more, it sharpens. The difference shows what information was thrown away, and this is the idea behind compression."},
    {h: "PCA in a pipeline",
     p: "Because PCA is a transformer, it slots into a pipeline before a model: <code>make_pipeline(StandardScaler(), PCA(n_components=30), LogisticRegression())</code>. For visualising clusters there's also <b>t-SNE</b> (<code>sklearn.manifold.TSNE</code>), which often separates groups more clearly but is slower, can't transform new data, and its distances shouldn't be read literally."}
  ],
  exercises: [
    {q: "Load <code>load_digits()</code>. How many images are there, and how many features does each have?", sol: R`from sklearn.datasets import load_digits
digits = load_digits()
print(digits.data.shape)   # (1797, 64)`},
    {q: "How many principal components do you need to keep 90% of the digits' variance?", sol: R`pca = PCA().fit(digits.data)
print(np.argmax(np.cumsum(pca.explained_variance_ratio_) >= 0.90) + 1)`},
    {q: "Reduce the digits to 2 components and print the shape of the result.", sol: R`two_d = PCA(n_components=2).fit_transform(digits.data)
print(two_d.shape)   # (1797, 2)`}
  ],
  project: {
    title: "Handwritten digits in 2-D",
    brief: "Squeeze 1,797 handwritten digits from 64 dimensions down to 2 and plot them, so you can see which digits the data naturally separates and which it confuses. Measure how much variance each component keeps, rebuild digits from a few components to see what's lost, and test whether PCA can shrink the data without hurting a classifier.",
    file: "day91_digits_pca.py",
    code: R`# day91_digits_pca.py
# PCA on handwritten digits: visualise, measure, reconstruct, and compress.

import matplotlib.pyplot as plt
import numpy as np
from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.manifold import TSNE
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

digits = load_digits()
X, y = digits.data, digits.target
print(f"{X.shape[0]} images of {X.shape[1]} pixels each (8x8, values 0-16)")

# 1. How much variance does each component keep?
pca_full = PCA().fit(X)
cumulative = np.cumsum(pca_full.explained_variance_ratio_)
for target in (0.5, 0.8, 0.9, 0.95, 0.99):
    print(f"  {np.argmax(cumulative >= target) + 1:>2} components keep {target:.0%} of the variance")

# 2. Plot in 2-D: PCA vs t-SNE
pca_2d = PCA(n_components=2).fit_transform(X)
tsne_2d = TSNE(n_components=2, init="pca", random_state=91).fit_transform(X)
fig, axes = plt.subplots(1, 2, figsize=(13, 6))
for ax, points, title in ((axes[0], pca_2d, f"PCA (keeps {cumulative[1]:.0%} of variance)"),
                          (axes[1], tsne_2d, "t-SNE")):
    scatter = ax.scatter(points[:, 0], points[:, 1], c=y, cmap="tab10", s=8, alpha=0.7)
    for digit in range(10):
        cx, cy = np.median(points[y == digit], axis=0)
        ax.text(cx, cy, str(digit), fontsize=16, weight="bold", ha="center", va="center",
                bbox={"boxstyle": "circle", "fc": "white", "alpha": 0.8})
    ax.set_title(title)
    ax.set_xticks([])
    ax.set_yticks([])
fig.suptitle("1,797 handwritten digits squeezed from 64 dimensions to 2")
fig.tight_layout()
fig.savefig("digits_2d.png", dpi=110)
print("\nSaved digits_2d.png")

# Which digits overlap most in the PCA plot? Compare distances between digit centres.
centres = np.array([pca_2d[y == d].mean(axis=0) for d in range(10)])
pairs = [(np.linalg.norm(centres[a] - centres[b]), a, b) for a in range(10) for b in range(a + 1, 10)]
print("Closest digit pairs in the PCA plot:", ", ".join(f"{a}&{b}" for _, a, b in sorted(pairs)[:3]))

# 3. Reconstruct digits from a few components
fig, axes = plt.subplots(4, 6, figsize=(8, 5.6))
examples = X[:6]
for row, k in enumerate((2, 10, 30, 64)):
    pca_k = PCA(n_components=k).fit(X)
    rebuilt = pca_k.inverse_transform(pca_k.transform(examples))
    for col in range(6):
        axes[row, col].imshow(rebuilt[col].reshape(8, 8), cmap="gray_r")
        axes[row, col].axis("off")
    axes[row, 0].set_title(f"{k} components", fontsize=9, loc="left")
fig.tight_layout()
fig.savefig("digits_reconstructed.png", dpi=110)
print("Saved digits_reconstructed.png")

# 4. Does compression hurt a classifier?
print("\n5-fold accuracy of logistic regression:")
for k in (5, 10, 20, 40, None):
    steps = [StandardScaler()] + ([PCA(n_components=k)] if k else []) + [LogisticRegression(max_iter=5000)]
    score = cross_val_score(make_pipeline(*steps), X, y, cv=5).mean()
    label = f"{k} components" if k else "all 64 pixels"
    print(f"  {label:<15} {score:.3f}")`,
    explain: [
      ["np.argmax(cumulative >= target) + 1", "<code>argmax</code> on a True/False array returns the first True. Adding 1 converts a position to a count."],
      ["TSNE(n_components=2, init=\"pca\", random_state=91)", "t-SNE arranges points so that neighbours stay neighbours. It usually separates the digits better than PCA, but it can only describe this dataset, not transform new images."],
      ["np.median(points[y == digit], axis=0)", "The middle of each digit's cloud, where we print a big label so the plot is readable."],
      ["pca_k.inverse_transform(pca_k.transform(examples))", "Compress to k numbers and back to 64 pixels. The blur shows what k components can't capture."],
      ["steps = [StandardScaler()] + ([PCA(n_components=k)] if k else []) + [...]", "Builds the pipeline with or without PCA, so the comparison is fair: same scaler, same model, only the compression changes."]
    ],
    stretch: ["Colour the PCA plot by a single digit (say 8) against all others to see where it hides.", "Try PCA on the Day 90 customers and plot the segments in 2-D.", "Time the 20-component pipeline against the full one. How much faster is it?"]
  },
  tests: ["About 21 components should keep 90% of the variance.", "In <code>digits_2d.png</code>, 0, 6 and 4 should form clear groups in PCA, while t-SNE separates nearly all ten.", "In <code>digits_reconstructed.png</code>, the 2-component row should be blurry and the 64-component row exact.", "With about 20 to 40 components, accuracy should be close to using all pixels."]
};

L[92] = {
  intro: "A model that's perfect on training data and poor on new data has <b>overfitted</b>: it memorised instead of learning. Today you'll see overfitting and underfitting happen, control them with regularisation, and tune settings with a grid search without fooling yourself.",
  lesson: [
    {h: "Underfitting and overfitting",
     p: "An <b>underfit</b> model is too simple to capture the pattern (a straight line through a curve): it does badly on training and test data alike. An <b>overfit</b> model is so flexible it follows the noise: excellent on training data, poor on test data. The goal is the sweet spot in between, and you find it by watching the <b>validation</b> score, never the training score."},
    {h: "Bias and variance",
     p: "<b>Bias</b> is error from wrong assumptions (too simple). <b>Variance</b> is error from being too sensitive to the particular training sample (too complex): retrain on slightly different data and the predictions jump around. More complexity lowers bias and raises variance. More data lowers variance, which is why big datasets allow big models."},
    {h: "Regularisation",
     p: "Regularisation penalises complexity during training. <b>Ridge</b> (L2) adds a penalty on the size of the weights, pulling them towards zero; <b>Lasso</b> (L1) can set some exactly to zero, which also selects features. A bigger <code>alpha</code> means a stronger pull. In <code>LogisticRegression</code> and <code>SVC</code> the knob is <code>C</code>, which works the other way: smaller <code>C</code> means stronger regularisation."},
    {h: "Hyperparameters and grid search",
     p: "<b>Hyperparameters</b> are settings you choose before training, like <code>max_depth</code>, <code>alpha</code> or <code>n_neighbors</code>. <code>GridSearchCV(pipeline, param_grid, cv=5)</code> tries every combination with cross-validation on the training data and refits the best one. Parameters inside a pipeline are named <code>step__param</code>, such as <code>\"svc__C\"</code>.",
     code: R`from sklearn.model_selection import GridSearchCV
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC

pipe = make_pipeline(StandardScaler(), SVC())
grid = {"svc__C": [0.1, 1, 10], "svc__gamma": ["scale", 0.01]}
search = GridSearchCV(pipe, grid, cv=5)   # 6 combinations x 5 folds = 30 fits`},
    {h: "The three-way split",
     p: "If you tune on the test set, the test score stops being honest: you've chosen whatever got lucky on it. The discipline: split off a test set first and lock it away; tune with cross-validation on the training set; evaluate the final model on the test set <b>once</b>. A learning curve (score versus training size) tells you whether more data would help."}
  ],
  exercises: [
    {q: "A model scores 0.99 on training data and 0.70 on validation. Overfitting or underfitting? Name two fixes.", sol: R`# Overfitting. Fixes: more regularisation (or a simpler model, e.g. smaller max_depth),
# more training data, fewer or better features.`},
    {q: "Fit <code>Ridge</code> with alpha 0.01, 1 and 100 on the diabetes data and print the largest absolute weight each time.", sol: R`from sklearn.datasets import load_diabetes
from sklearn.linear_model import Ridge
X, y = load_diabetes(return_X_y=True)
for a in (0.01, 1, 100):
    print(a, abs(Ridge(alpha=a).fit(X, y).coef_).max().round(1))`},
    {q: "How many model fits does a grid search with 4 values of C, 3 of gamma and cv=5 perform (not counting the final refit)?", sol: R`print(4 * 3 * 5)   # 60`}
  ],
  project: {
    title: "Tune a model properly",
    brief: "Three experiments in one script. First, watch underfitting and overfitting happen as you raise the degree of a polynomial fitted to noisy data. Second, rescue the overfit model with Ridge regularisation. Third, tune a support vector classifier on the digits with a grid search, following the train/validate/test discipline, and draw a learning curve.",
    file: "day92_tuning.py",
    code: R`# day92_tuning.py
# Overfitting, regularisation and honest hyperparameter tuning.

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from sklearn.datasets import load_digits
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import GridSearchCV, learning_curve, train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.svm import SVC

rng = np.random.default_rng(92)

# ---------- 1. Polynomial degree: from underfitting to overfitting ----------
x = np.sort(rng.uniform(0, 1, 40))
y = np.sin(2 * np.pi * x) + rng.normal(0, 0.25, 40)
x_val = rng.uniform(0, 1, 200)
y_val = np.sin(2 * np.pi * x_val) + rng.normal(0, 0.25, 200)
X, X_val = x.reshape(-1, 1), x_val.reshape(-1, 1)

print("1. Fitting a noisy sine curve with polynomials")
print("   degree   train MSE   validation MSE")
fits = {}
for degree in (1, 3, 5, 9, 15):
    model = make_pipeline(PolynomialFeatures(degree), StandardScaler(), LinearRegression()).fit(X, y)
    fits[degree] = model
    train = mean_squared_error(y, model.predict(X))
    val = mean_squared_error(y_val, model.predict(X_val))
    note = "  <- underfit" if degree == 1 else "  <- overfit" if degree == 15 else ""
    print(f"   {degree:>6}   {train:9.3f}   {val:14.3f}{note}")

# ---------- 2. Regularisation tames the degree-15 model ----------
print("\n2. Degree 15 with Ridge regularisation")
print("   alpha     validation MSE   largest weight")
for alpha in (1e-6, 1e-3, 0.1, 1, 10):
    model = make_pipeline(PolynomialFeatures(15), StandardScaler(), Ridge(alpha=alpha)).fit(X, y)
    val = mean_squared_error(y_val, model.predict(X_val))
    biggest = np.abs(model[-1].coef_).max()
    print(f"   {alpha:<8g} {val:14.3f}   {biggest:14.1f}")

grid_x = np.linspace(0, 1, 300).reshape(-1, 1)
fig, ax = plt.subplots(figsize=(7, 4))
ax.scatter(x, y, color="black", s=15, label="training data")
ax.plot(grid_x, np.sin(2 * np.pi * grid_x), "k:", label="true curve")
for degree, style in ((1, "-"), (3, "-"), (15, "--")):
    ax.plot(grid_x, fits[degree].predict(grid_x), style, label=f"degree {degree}")
ax.set(ylim=(-2, 2), title="Underfitting (1), a good fit (3) and overfitting (15)")
ax.legend(fontsize=8)
fig.tight_layout()
fig.savefig("overfitting.png", dpi=120)

# ---------- 3. Honest tuning on the digits ----------
print("\n3. Tuning an SVM on handwritten digits")
X_d, y_d = load_digits(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X_d, y_d, test_size=0.2, random_state=92, stratify=y_d)

pipe = make_pipeline(StandardScaler(), SVC())
grid = {"svc__C": [0.1, 1, 10, 100], "svc__gamma": ["scale", 0.001, 0.01, 0.1]}
search = GridSearchCV(pipe, grid, cv=5, n_jobs=-1).fit(X_train, y_train)

table = pd.DataFrame(search.cv_results_["params"])
table["cv_accuracy"] = search.cv_results_["mean_test_score"]
pivot = table.pivot(index="svc__C", columns="svc__gamma", values="cv_accuracy")
print("   Cross-validated accuracy for each combination (rows C, columns gamma):")
print("   " + pivot.round(3).to_string().replace("\n", "\n   "))
print(f"   Best: {search.best_params_}, CV accuracy {search.best_score_:.3f}")
print(f"   Test accuracy, measured once at the end: {search.score(X_test, y_test):.3f}")

sizes, train_scores, val_scores = learning_curve(
    search.best_estimator_, X_train, y_train, cv=5, train_sizes=np.linspace(0.1, 1.0, 6), n_jobs=-1)
fig, ax = plt.subplots(figsize=(6, 4))
ax.plot(sizes, train_scores.mean(axis=1), "o-", label="training")
ax.plot(sizes, val_scores.mean(axis=1), "o-", label="cross-validation")
ax.set(xlabel="Training examples", ylabel="Accuracy", title="Learning curve of the tuned SVM")
ax.legend()
fig.tight_layout()
fig.savefig("learning_curve.png", dpi=120)
print("\nSaved overfitting.png and learning_curve.png")`,
    explain: [
      ["PolynomialFeatures(degree)", "Adds columns x², x³ … up to x to the power of <code>degree</code>, so a linear model can draw curves. More degrees means more flexibility."],
      ["note = \"  <- underfit\" if degree == 1 else ...", "Labels the two extremes. Degree 15 has the lowest training error of all, yet its validation error is worse than degree 3, 5 or 9: the signature of overfitting."],
      ["model[-1].coef_", "A pipeline can be indexed like a list; <code>[-1]</code> is the final step, the Ridge model. Its weights shrink as alpha grows."],
      ["GridSearchCV(pipe, grid, cv=5, n_jobs=-1)", "16 combinations × 5 folds, run in parallel. Only training data is used; the test set stays locked away."],
      ["search.score(X_test, y_test)", "The one and only time the test set is used, to report how the chosen model does on unseen data."],
      ["learning_curve(...)", "Retrains on growing slices of the training data. If the validation line is still climbing at the end, more data would help."]
    ],
    stretch: ["Replace the grid search with <code>RandomizedSearchCV</code> and a wider range of C values (use <code>scipy.stats.loguniform</code>).", "Try <code>Lasso</code> in experiment 2 and count how many weights become exactly zero.", "Add a validation curve for <code>max_depth</code> of a decision tree on the Day 89 loan data."]
  },
  tests: ["Degree 1 should have high error everywhere; degree 15 should have the lowest training error but a higher validation error than degree 3 or 5.", "Ridge with a moderate alpha should bring the degree-15 validation error down.", "The best SVM should reach about 98% cross-validated accuracy, and the test accuracy should be similar.", "Open both PNGs and explain each in one sentence."]
};

L[93] = {
  intro: "Neural networks power image recognition, translation and chatbots. Underneath, they're stacks of the logistic-regression-like units you already know, trained with gradient descent. Today you'll build one in NumPy and teach it XOR, a problem no straight line can solve.",
  lesson: [
    {h: "A neuron",
     p: "A <b>neuron</b> computes a weighted sum of its inputs plus a bias, then applies an <b>activation function</b>: <code>a = activation(x @ w + b)</code>. With a sigmoid activation, one neuron <b>is</b> logistic regression. Its decision boundary is a straight line, so it can't learn XOR (output 1 when exactly one input is 1)."},
    {h: "Layers and activations",
     p: "Put several neurons side by side and you have a <b>layer</b>; feed one layer's outputs into the next and you have a network. The <b>hidden layer</b> learns new features from the inputs, and the output layer combines them. The activation must be non-linear, or stacked layers would collapse into one linear model. Common choices: <code>tanh</code>, <code>sigmoid</code>, and <code>ReLU</code> (<code>max(0, z)</code>).",
     code: R`import numpy as np

z = np.array([-2.0, 0.0, 2.0])
print(np.tanh(z).round(3), np.maximum(0, z))`,
     out: "[-0.964  0.     0.964] [0. 0. 2.]"},
    {h: "The forward pass",
     p: "Prediction is called the <b>forward pass</b>: <code>h = tanh(X @ W1 + b1)</code>, then <code>out = sigmoid(h @ W2 + b2)</code>. With 2 inputs, 4 hidden neurons and 1 output, <code>W1</code> is 2×4 and <code>W2</code> is 4×1. Weights start as small random numbers; if they all started equal, every hidden neuron would learn the same thing."},
    {h: "Backpropagation",
     p: "To train, we need the gradient of the loss with respect to every weight. <b>Backpropagation</b> is the chain rule applied layer by layer from the output backwards: work out how the loss changes with the output, then how the output changes with the hidden layer, then with the first weights. Each layer passes an error signal back to the one before it. Libraries like PyTorch do this automatically, but doing it once by hand removes the mystery."},
    {h: "Checking your gradients",
     p: "Hand-written backprop is easy to get subtly wrong. A <b>gradient check</b> compares one of your gradients with the numerical slope from Day 83 (nudge one weight, measure the loss). If they agree to several decimal places, your backprop is right."}
  ],
  exercises: [
    {q: "Write <code>relu</code> and its derivative (1 where z > 0, otherwise 0) using NumPy.", sol: R`def relu(z):
    return np.maximum(0, z)

def relu_grad(z):
    return (z > 0).astype(float)`},
    {q: "If the input has 3 features, the hidden layer has 5 neurons and there are 2 outputs, what shapes are W1, b1, W2 and b2?", sol: R`# W1: (3, 5)  b1: (5,)  W2: (5, 2)  b2: (2,)`},
    {q: "The derivative of <code>tanh(z)</code> is <code>1 - tanh(z)**2</code>. Check it numerically at z = 0.5.", sol: R`z, h = 0.5, 1e-6
print((np.tanh(z + h) - np.tanh(z - h)) / (2 * h), 1 - np.tanh(z) ** 2)`}
  ],
  project: {
    title: "Tiny network that learns XOR",
    brief: "Build a two-layer neural network from scratch in NumPy: forward pass, binary cross-entropy loss, backpropagation and gradient descent. Show that logistic regression fails on XOR while the network succeeds, verify the backprop with a gradient check, and print what the network has learned across the input space.",
    file: "day93_xor_network.py",
    code: R`# day93_xor_network.py
# A neural network from scratch: forward pass, backprop, gradient check.

import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]], dtype=float)
y = np.array([[0], [1], [1], [0]], dtype=float)          # XOR


def sigmoid(z):
    return 1 / (1 + np.exp(-z))


def bce(pred, target):
    """Binary cross-entropy: the loss for yes/no outputs."""
    pred = np.clip(pred, 1e-9, 1 - 1e-9)
    return float(-(target * np.log(pred) + (1 - target) * np.log(1 - pred)).mean())


class TinyNet:
    def __init__(self, n_in=2, n_hidden=4, seed=93):
        rng = np.random.default_rng(seed)
        self.W1 = rng.normal(0, 1, (n_in, n_hidden))
        self.b1 = np.zeros(n_hidden)
        self.W2 = rng.normal(0, 1, (n_hidden, 1))
        self.b2 = np.zeros(1)

    def forward(self, X):
        self.X = X
        self.h = np.tanh(X @ self.W1 + self.b1)          # hidden layer
        self.out = sigmoid(self.h @ self.W2 + self.b2)   # output layer
        return self.out

    def backward(self, target):
        """Gradients of the BCE loss with respect to every parameter (chain rule, layer by layer)."""
        n = len(target)
        d_out = (self.out - target) / n                  # sigmoid + BCE simplify to this
        grads = {"W2": self.h.T @ d_out, "b2": d_out.sum(axis=0)}
        d_h = d_out @ self.W2.T * (1 - self.h ** 2)      # back through W2, then through tanh
        grads["W1"] = self.X.T @ d_h
        grads["b1"] = d_h.sum(axis=0)
        return grads

    def train(self, X, y, lr=1.0, epochs=3000, report_every=500):
        for epoch in range(epochs + 1):
            pred = self.forward(X)
            if epoch % report_every == 0:
                print(f"  epoch {epoch:>4}: loss {bce(pred, y):.4f}  outputs {pred.ravel().round(2)}")
            for name, g in self.backward(y).items():
                setattr(self, name, getattr(self, name) - lr * g)


def gradient_check(net: TinyNet) -> float:
    """Largest difference between backprop gradients and numerical estimates."""
    net.forward(X)
    analytic = net.backward(y)
    worst = 0.0
    for name in ("W1", "b1", "W2", "b2"):
        param = getattr(net, name)
        for idx in np.ndindex(param.shape):
            original = param[idx]
            param[idx] = original + 1e-5
            plus = bce(net.forward(X), y)
            param[idx] = original - 1e-5
            minus = bce(net.forward(X), y)
            param[idx] = original
            worst = max(worst, abs((plus - minus) / 2e-5 - analytic[name][idx]))
    return worst


def main() -> None:
    print("1. Logistic regression (a single neuron) on XOR")
    w, b = np.zeros((2, 1)), np.zeros(1)
    for _ in range(3000):
        p = sigmoid(X @ w + b)
        w -= 1.0 * X.T @ (p - y) / 4
        b -= 1.0 * (p - y).mean()
    print(f"  outputs {sigmoid(X @ w + b).ravel().round(2)}  -> stuck at 0.5, no straight line works")

    print("\n2. Gradient check before training")
    print(f"  largest difference: {gradient_check(TinyNet()):.2e}  (tiny = backprop is correct)")

    print("\n3. Training a 2-4-1 network")
    net = TinyNet()
    net.train(X, y)
    predictions = (net.forward(X) > 0.5).astype(int).ravel()
    print(f"  final predictions {predictions}, targets {y.ravel().astype(int)}")

    print("\n4. What the network learned (output for inputs between 0 and 1):")
    steps = np.linspace(0, 1, 6)
    print("       x2=" + "".join(f"{v:>5.1f}" for v in steps))
    for a in steps:
        row = net.forward(np.array([[a, b] for b in steps]))
        print(f"  x1={a:.1f}  " + "".join(f"{v:>5.2f}" for v in row.ravel()))
    print("  High values sit near (0, 1) and (1, 0): a curved boundary a single neuron can't draw.")


if __name__ == "__main__":
    main()`,
    explain: [
      ["self.h = np.tanh(X @ self.W1 + self.b1)", "The hidden layer: four neurons, each a weighted sum of the inputs passed through tanh."],
      ["d_out = (self.out - target) / n", "When a sigmoid output is paired with cross-entropy loss, the derivative simplifies beautifully to prediction minus target."],
      ["d_h = d_out @ self.W2.T * (1 - self.h ** 2)", "The error signal flows back through W2, then through tanh (whose derivative is 1 - tanh²). This line is backpropagation."],
      ["setattr(self, name, getattr(self, name) - lr * g)", "Gradient descent on every parameter by name, so the loop doesn't repeat itself four times."],
      ["for idx in np.ndindex(param.shape):", "Visits every single weight. Nudging each one and measuring the loss gives a numerical gradient to compare with backprop."]
    ],
    stretch: ["Change the hidden layer to 2 neurons, then 1. Does it still learn? Try a few seeds.", "Replace tanh with ReLU (and its derivative) and compare training speed.", "Train the network on the <code>make_moons</code> dataset from scikit-learn and print its accuracy."]
  },
  tests: ["The single neuron should output about 0.5 for every input.", "The gradient check should print a number around 1e-10 or smaller.", "The loss should fall steadily and the final predictions should be 0 1 1 0.", "Break the backprop on purpose (drop <code>(1 - self.h ** 2)</code>) and watch the gradient check catch it."]
};

L[94] = {
  intro: "PyTorch is one of the main libraries for deep learning. It gives you NumPy-like arrays that can run on a GPU and, crucially, computes gradients automatically. Today you'll redo linear regression in PyTorch to learn its building blocks before training real networks tomorrow.",
  lesson: [
    {h: "Installing and tensors",
     p: "Install with <code>pip install torch</code> (pytorch.org shows the right command for your computer and GPU). A <b>tensor</b> is PyTorch's array: <code>torch.tensor([[1., 2.], [3., 4.]])</code>. It has a <code>shape</code>, a <code>dtype</code> (usually <code>torch.float32</code>) and supports the same maths as NumPy, including <code>@</code>. Convert with <code>torch.from_numpy(arr)</code> and <code>tensor.numpy()</code>.",
     code: R`import torch

a = torch.tensor([[1., 2.], [3., 4.]])
print(a.shape, a.dtype)
print(a @ a, a.mean().item())`,
     out: "torch.Size([2, 2]) torch.float32\ntensor([[ 7., 10.],\n        [15., 22.]]) 2.5"},
    {h: "Autograd",
     p: "Create a tensor with <code>requires_grad=True</code> and PyTorch records every operation on it. Call <code>.backward()</code> on a final single number (like a loss) and it fills <code>.grad</code> with the gradient: the backpropagation you wrote by hand yesterday, done for you.",
     code: R`x = torch.tensor(3.0, requires_grad=True)
y = x ** 2 + 2 * x
y.backward()
print(x.grad)   # dy/dx = 2x + 2`,
     out: "tensor(8.)"},
    {h: "Modules, loss functions and optimisers",
     p: "<code>torch.nn</code> has ready-made layers: <code>nn.Linear(3, 1)</code> holds a weight matrix and bias. Loss functions like <code>nn.MSELoss()</code> compare predictions with targets. An optimiser such as <code>torch.optim.SGD(model.parameters(), lr=0.1)</code> applies the update. You'll also meet <code>Adam</code>, which adapts the step size for each parameter and is a common default."},
    {h: "The training loop",
     p: "Every PyTorch training loop has the same five lines: <code>pred = model(X)</code>, <code>loss = loss_fn(pred, y)</code>, <code>optimizer.zero_grad()</code> (clear old gradients, because PyTorch adds them up), <code>loss.backward()</code>, <code>optimizer.step()</code>. When you're only predicting, wrap the code in <code>with torch.no_grad():</code> to skip the bookkeeping."},
    {h: "Devices",
     p: "Tensors live on a <b>device</b>: <code>\"cpu\"</code>, <code>\"cuda\"</code> (NVIDIA GPU) or <code>\"mps\"</code> (Apple silicon). Move models and data with <code>.to(device)</code>; everything in one calculation must be on the same device. Small models like today's run fine on a CPU."}
  ],
  exercises: [
    {q: "Create a 3×3 tensor of random numbers with <code>torch.rand</code> and print its largest value as a Python number.", sol: R`t = torch.rand(3, 3)
print(t.max().item())`},
    {q: "Use autograd to find the derivative of <code>f(x) = x³ - 4x</code> at x = 2.", sol: R`x = torch.tensor(2.0, requires_grad=True)
(x ** 3 - 4 * x).backward()
print(x.grad)   # 3x² - 4 = 8`},
    {q: "Print which device your computer can use.", sol: R`device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
print(device)`}
  ],
  project: {
    title: "Linear regression in PyTorch",
    brief: "Generate data from a known rule, then learn it three ways: with raw tensors and autograd (you write the update), with <code>nn.Linear</code> and an optimiser (the standard way), and with mini-batches from a <code>DataLoader</code>. Compare the learned parameters with the truth, then save and reload the model.",
    file: "day94_pytorch_regression.py",
    code: R`# day94_pytorch_regression.py
# Linear regression three ways in PyTorch.

import torch
from torch import nn
from torch.utils.data import DataLoader, TensorDataset

torch.manual_seed(94)
device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
print(f"Using device: {device}")

# Data from a known rule: y = 3*x1 - 2*x2 + 0.5*x3 + 5 + noise
TRUE_W = torch.tensor([[3.0], [-2.0], [0.5]])
TRUE_B = 5.0
X = torch.randn(1000, 3)
y = X @ TRUE_W + TRUE_B + 0.3 * torch.randn(1000, 1)
X, y = X.to(device), y.to(device)


def show(name, w, b):
    w = [round(v, 3) for v in w.detach().cpu().ravel().tolist()]
    b = float(torch.as_tensor(b).detach().cpu().ravel()[0])
    print(f"  {name:<22} w = {w}, b = {b:.3f}")


# ---------- 1. Raw tensors + autograd ----------
print("\n1. Autograd with a hand-written update")
w = torch.zeros(3, 1, device=device, requires_grad=True)
b = torch.zeros(1, device=device, requires_grad=True)
for epoch in range(200):
    loss = ((X @ w + b - y) ** 2).mean()
    loss.backward()                      # fills w.grad and b.grad
    with torch.no_grad():                # the update itself must not be tracked
        w -= 0.1 * w.grad
        b -= 0.1 * b.grad
        w.grad.zero_()
        b.grad.zero_()
    if epoch % 50 == 0:
        print(f"  epoch {epoch:>3}: loss {loss.item():.4f}")
show("learned", w, b)

# ---------- 2. nn.Linear + optimiser ----------
print("\n2. nn.Linear, MSELoss and SGD")
model = nn.Linear(3, 1).to(device)
loss_fn = nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
for epoch in range(200):
    pred = model(X)
    loss = loss_fn(pred, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
show("learned", model.weight.T, model.bias)

# ---------- 3. Mini-batches with a DataLoader ----------
print("\n3. Mini-batches of 32 with Adam")
loader = DataLoader(TensorDataset(X, y), batch_size=32, shuffle=True)
model = nn.Linear(3, 1).to(device)
optimizer = torch.optim.Adam(model.parameters(), lr=0.05)
for epoch in range(20):
    total = 0.0
    for xb, yb in loader:
        loss = loss_fn(model(xb), yb)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total += loss.item() * len(xb)
    if epoch % 5 == 0 or epoch == 19:
        print(f"  epoch {epoch:>2}: average loss {total / len(X):.4f}")
show("learned", model.weight.T, model.bias)
show("truth", TRUE_W, TRUE_B)

# ---------- Save, reload, predict ----------
torch.save(model.state_dict(), "linear_model.pt")
reloaded = nn.Linear(3, 1)
reloaded.load_state_dict(torch.load("linear_model.pt", map_location="cpu"))
reloaded.eval()
with torch.no_grad():
    new = torch.tensor([[1.0, 1.0, 1.0], [0.0, 0.0, 0.0]])
    print(f"\nReloaded model predicts {[round(v, 2) for v in reloaded(new).ravel().tolist()]} "
          f"(true rule gives [6.5, 5.0])")`,
    explain: [
      ["torch.manual_seed(94)", "Makes the random data and the starting weights identical every run."],
      ["loss.backward()", "Autograd walks back through every operation that produced <code>loss</code> and stores the gradient in each tensor's <code>.grad</code>."],
      ["with torch.no_grad():", "The update step shouldn't itself become part of the graph we differentiate, so we switch tracking off for it."],
      ["optimizer.zero_grad()", "PyTorch adds new gradients to old ones. Forgetting to clear them is one of the most common PyTorch bugs."],
      ["DataLoader(TensorDataset(X, y), batch_size=32, shuffle=True)", "Feeds the data in shuffled mini-batches. Each update is cheaper and noisier, which is how all large models are trained."],
      ["torch.save(model.state_dict(), ...)", "Saves just the learned numbers. To reload, build the same architecture and load the numbers into it."]
    ],
    stretch: ["Add a hidden layer with <code>nn.Sequential(nn.Linear(3, 16), nn.ReLU(), nn.Linear(16, 1))</code> and fit <code>y = x1 * x2</code>, which a straight line can't.", "Plot the loss per epoch for SGD and Adam on the same chart.", "Run with a learning rate of 1.5 in part 2 and explain what happens."]
  },
  tests: ["All three methods should learn weights close to [3, -2, 0.5] and a bias close to 5.", "The loss should level off around 0.09 (the noise is 0.3, and 0.3² = 0.09).", "Delete <code>optimizer.zero_grad()</code> in part 2 and describe what happens.", "Check that <code>linear_model.pt</code> was created and the reloaded predictions are close to [6.5, 5.0]."]
};

L[95] = {
  intro: "Time to train a real neural network on a famous dataset: MNIST, 70,000 handwritten digits. You'll use the full PyTorch toolkit (datasets, data loaders, a convolutional network, training and evaluation loops) and reach about 99% accuracy.",
  lesson: [
    {h: "Datasets and transforms",
     p: "<code>torchvision</code> (installed with <code>pip install torchvision</code>) provides famous datasets and image tools. <code>datasets.MNIST(root=\"data\", train=True, download=True, transform=...)</code> downloads 60,000 training and 10,000 test images of 28×28 pixels. A <b>transform</b> prepares each image: <code>ToTensor()</code> turns pixels into numbers between 0 and 1, and <code>Normalize</code> centres them."},
    {h: "Convolutional layers",
     p: "A fully connected layer treats an image as a flat list and ignores which pixels are neighbours. A <b>convolutional</b> layer (<code>nn.Conv2d</code>) slides small filters (say 3×3) across the image, so the same filter detects an edge or curve wherever it appears. <b>Pooling</b> (<code>nn.MaxPool2d(2)</code>) halves the size, keeping the strongest signals. Stacking them learns edges, then strokes, then whole digit shapes."},
    {h: "Classification with many classes",
     p: "For 10 classes the final layer outputs 10 numbers called <b>logits</b>, one score per digit. <code>nn.CrossEntropyLoss</code> applies softmax (turning scores into probabilities that add up to 1) and the log loss in one step. The prediction is the class with the highest score: <code>logits.argmax(dim=1)</code>."},
    {h: "train() and eval() modes",
     p: "Some layers behave differently while training. <code>nn.Dropout</code> randomly switches off neurons during training to fight overfitting, but must be off when predicting. Call <code>model.train()</code> before training and <code>model.eval()</code> before evaluating, and evaluate inside <code>torch.no_grad()</code>."},
    {h: "Watching training",
     p: "Record the training loss and the test accuracy after every <b>epoch</b> (one full pass over the training data) and plot them. If training loss keeps falling while test accuracy drops, you're overfitting. Save the model's <code>state_dict</code> when you're happy with it."}
  ],
  exercises: [
    {q: "Load the MNIST training set and print the shape of the first image and its label.", sol: R`from torchvision import datasets, transforms
train = datasets.MNIST("data", train=True, download=True, transform=transforms.ToTensor())
image, label = train[0]
print(image.shape, label)   # torch.Size([1, 28, 28]) 5`},
    {q: "Apply softmax to the logits <code>[2.0, 1.0, 0.1]</code>. Which class wins, and with what probability?", sol: R`import torch
print(torch.softmax(torch.tensor([2.0, 1.0, 0.1]), dim=0))   # class 0, about 0.66`},
    {q: "An image of shape (1, 28, 28) goes through <code>Conv2d(1, 16, 3, padding=1)</code> then <code>MaxPool2d(2)</code>. What's the output shape?", sol: R`# Conv with padding=1 keeps 28x28 and makes 16 channels: (16, 28, 28)
# Pooling halves it: (16, 14, 14)`}
  ],
  project: {
    title: "MNIST digit classifier",
    brief: "Train a small convolutional network to read handwritten digits. The script downloads MNIST (about 12 MB, first run only), trains for a few epochs while recording loss and accuracy, reports per-digit accuracy and the most common confusions, saves a chart of training progress and a gallery of mistakes, and saves the model. It takes a few minutes on a laptop CPU and seconds on a GPU.",
    file: "day95_mnist.py",
    code: R`# day95_mnist.py
# A convolutional network for handwritten digits.

import time
from collections import Counter

import matplotlib.pyplot as plt
import torch
from torch import nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms

EPOCHS = 3
BATCH_SIZE = 128
torch.manual_seed(95)
device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"

transform = transforms.Compose([
    transforms.ToTensor(),                          # pixels 0-255 -> 0.0-1.0, shape (1, 28, 28)
    transforms.Normalize((0.1307,), (0.3081,)),     # MNIST's mean and standard deviation
])
train_set = datasets.MNIST("data", train=True, download=True, transform=transform)
test_set = datasets.MNIST("data", train=False, download=True, transform=transform)
train_loader = DataLoader(train_set, batch_size=BATCH_SIZE, shuffle=True)
test_loader = DataLoader(test_set, batch_size=1000)


class DigitNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 16, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),   # -> 16 x 14 x 14
            nn.Conv2d(16, 32, kernel_size=3, padding=1), nn.ReLU(), nn.MaxPool2d(2),  # -> 32 x 7 x 7
        )
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(32 * 7 * 7, 128), nn.ReLU(),
            nn.Dropout(0.25),
            nn.Linear(128, 10),                                                     # one score per digit
        )

    def forward(self, x):
        return self.classifier(self.features(x))


def train_one_epoch(model, loader, loss_fn, optimizer) -> float:
    model.train()
    total = 0.0
    for images, labels in loader:
        images, labels = images.to(device), labels.to(device)
        loss = loss_fn(model(images), labels)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()
        total += loss.item() * len(images)
    return total / len(loader.dataset)


@torch.no_grad()
def evaluate(model, loader):
    model.eval()
    preds, targets = [], []
    for images, labels in loader:
        preds.append(model(images.to(device)).argmax(dim=1).cpu())
        targets.append(labels)
    return torch.cat(preds), torch.cat(targets)


def main() -> None:
    model = DigitNet().to(device)
    n_params = sum(p.numel() for p in model.parameters())
    print(f"Device: {device}. {len(train_set):,} training and {len(test_set):,} test images. "
          f"Model has {n_params:,} parameters.")
    loss_fn = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

    history = []
    for epoch in range(1, EPOCHS + 1):
        start = time.perf_counter()
        loss = train_one_epoch(model, train_loader, loss_fn, optimizer)
        preds, targets = evaluate(model, test_loader)
        accuracy = (preds == targets).float().mean().item()
        history.append((loss, accuracy))
        print(f"  epoch {epoch}: train loss {loss:.4f}, test accuracy {accuracy:.2%} "
              f"({time.perf_counter() - start:.0f}s)")

    print("\nAccuracy per digit:")
    for d in range(10):
        mask = targets == d
        print(f"  {d}: {(preds[mask] == d).float().mean().item():.2%}")
    wrong = preds != targets
    confusions = Counter(zip(targets[wrong].tolist(), preds[wrong].tolist()))
    print(f"\n{int(wrong.sum())} mistakes. Most common (true -> predicted):",
          ", ".join(f"{t}->{p} x{n}" for (t, p), n in confusions.most_common(5)))

    fig, axes = plt.subplots(1, 2, figsize=(9, 3.5))
    epochs = range(1, EPOCHS + 1)
    axes[0].plot(epochs, [h[0] for h in history], "o-")
    axes[0].set(title="Training loss", xlabel="Epoch")
    axes[1].plot(epochs, [h[1] for h in history], "o-", color="green")
    axes[1].set(title="Test accuracy", xlabel="Epoch")
    fig.tight_layout()
    fig.savefig("mnist_training.png", dpi=110)

    idx = wrong.nonzero().ravel()[:12]
    fig, axes = plt.subplots(2, 6, figsize=(9, 3.6))
    for ax, i in zip(axes.ravel(), idx.tolist()):
        image, label = test_set[i]
        ax.imshow(image.squeeze() * 0.3081 + 0.1307, cmap="gray_r")    # undo the normalisation
        ax.set_title(f"true {label}, said {preds[i].item()}", fontsize=8)
        ax.axis("off")
    fig.suptitle("Some mistakes. Would you have got them right?")
    fig.tight_layout()
    fig.savefig("mnist_mistakes.png", dpi=110)

    torch.save(model.state_dict(), "mnist_cnn.pt")
    print("\nSaved mnist_training.png, mnist_mistakes.png and mnist_cnn.pt")


if __name__ == "__main__":
    main()`,
    explain: [
      ["transforms.Normalize((0.1307,), (0.3081,))", "Centres the pixel values using MNIST's known mean and standard deviation, the image version of standard scaling."],
      ["class DigitNet(nn.Module):", "Every PyTorch model is a class: layers are created in <code>__init__</code> and used in <code>forward</code>. Calling <code>model(images)</code> runs <code>forward</code>."],
      ["nn.Linear(32 * 7 * 7, 128)", "After two rounds of pooling, 28×28 has become 7×7 with 32 channels; <code>Flatten</code> turns that into 1,568 numbers for the dense layers."],
      ["@torch.no_grad()", "Used as a decorator, it switches off gradient tracking for the whole evaluation function. Faster and uses less memory."],
      ["model(images.to(device)).argmax(dim=1)", "For each image, the position of the highest of the 10 scores is the predicted digit."],
      ["Counter(zip(targets[wrong].tolist(), preds[wrong].tolist()))", "Counts each (true, predicted) pair among the mistakes, revealing which digits get mixed up."]
    ],
    stretch: ["Replace the network with a plain <code>nn.Sequential(nn.Flatten(), nn.Linear(784, 128), nn.ReLU(), nn.Linear(128, 10))</code>. How much accuracy do the convolutions add?", "Draw your own digit in an image editor, resize it to 28×28, and classify it with the saved model.", "Try <code>datasets.FashionMNIST</code>: the same code classifies clothing."]
  },
  tests: ["Test accuracy should be about 98% after the first epoch and close to 99% after the third.", "Check that <code>data/MNIST</code> was created and isn't downloaded again on the second run.", "Look at <code>mnist_mistakes.png</code>: many mistakes are genuinely ambiguous handwriting.", "Add <code>data/</code> and <code>*.pt</code> to your <code>.gitignore</code> before publishing: don't commit datasets or large model files."]
};

const REVIEWS = R`text,label
"An absolute joy from start to finish. The cast is wonderful and the script is sharp.",pos
"I laughed, I cried, and I want to watch it again tomorrow.",pos
"Beautifully shot, with a soundtrack that stays with you for days.",pos
"One of the best films I have seen this year. Highly recommended.",pos
"The acting is superb and the story is genuinely moving.",pos
"A clever, funny and surprisingly touching comedy.",pos
"Brilliant direction and a lead performance that deserves every award.",pos
"I was hooked from the first scene. Gripping and smart.",pos
"Warm, charming and full of heart. My whole family loved it.",pos
"The best animated movie in years, with jokes for kids and adults.",pos
"A masterpiece. Every frame is carefully crafted.",pos
"Tense, exciting and perfectly paced. I never checked my watch.",pos
"Fantastic chemistry between the two leads. Pure delight.",pos
"An inspiring true story told with great care and honesty.",pos
"Visually stunning and emotionally powerful.",pos
"The plot twists are brilliant and the ending is perfect.",pos
"Great fun. Exactly what a summer blockbuster should be.",pos
"A thoughtful film that rewards your attention. Excellent.",pos
"I loved every minute. The dialogue is witty and natural.",pos
"Funny, fresh and full of great performances.",pos
"A wonderful surprise. Much better than I expected.",pos
"The documentary is fascinating and beautifully edited.",pos
"Strong performances all round and a story that really matters.",pos
"Not a single boring moment. Superb entertainment.",pos
"An unforgettable experience. I left the cinema smiling.",pos
"Rich characters, great music and a lovely message.",pos
"Smart writing and terrific acting make this a must see.",pos
"It is rare to find a sequel this good. Even better than the first.",pos
"A beautiful, gentle film about friendship. I adored it.",pos
"Thrilling action scenes and a villain you will remember.",pos
"Heartfelt and hilarious. A perfect Friday night movie.",pos
"The cinematography is gorgeous and the story is compelling.",pos
"I did not expect much but it was genuinely great.",pos
"A powerful, well acted drama. It stayed with me all week.",pos
"Delightful from beginning to end. Wonderful cast.",pos
"Creative, original and very entertaining.",pos
"An excellent thriller with a clever plot.",pos
"The kids loved it and honestly so did I.",pos
"Moving and beautifully performed. A small gem.",pos
"Easily the funniest film I have seen in ages.",pos
"Not bad at all. In fact it was really enjoyable.",pos
"The story is simple but told with real skill and warmth.",pos
"Great performances and a script full of surprises.",pos
"A stylish, confident debut from an exciting new director.",pos
"I would happily watch this again. Highly enjoyable.",pos
"Wonderful music, wonderful acting, wonderful film.",pos
"Fresh and exciting. The best thriller this year.",pos
"Touching, funny and beautifully made.",pos
"An epic adventure with real emotion at its core.",pos
"Loved it. Smart, fun and full of heart.",pos
"A complete waste of time. Boring and far too long.",neg
"The plot makes no sense and the acting is wooden.",neg
"I walked out after an hour. Dull and predictable.",neg
"Terrible script, flat jokes and a lazy ending.",neg
"One of the worst films I have ever seen.",neg
"Painfully slow. Nothing happens for the first hour.",neg
"The special effects look cheap and the story is a mess.",neg
"I was bored from start to finish.",neg
"A disappointing sequel that ruins everything the original did well.",neg
"The dialogue is awful and the characters are annoying.",neg
"Not funny at all. I did not laugh once.",neg
"Predictable, clichéd and forgettable.",neg
"Too long, too loud and too stupid.",neg
"The lead actor seems bored and so was I.",neg
"A confusing mess with no likeable characters.",neg
"Terrible pacing and a plot full of holes.",neg
"I want my money back. Truly dreadful.",neg
"The trailer was better than the whole film.",neg
"Badly written and badly acted. Avoid.",neg
"It tries hard to be clever but it is just boring.",neg
"The jokes fall flat and the story drags.",neg
"Ugly to look at and painful to sit through.",neg
"A lazy remake with none of the charm of the original.",neg
"The worst ending I have seen in years. So disappointing.",neg
"Nothing original here. Seen it all before, done better.",neg
"Not good. The story is thin and the acting is poor.",neg
"I fell asleep halfway through. Utterly dull.",neg
"An awful film with a terrible soundtrack.",neg
"Messy, noisy and completely pointless.",neg
"The characters are flat and the twists are obvious.",neg
"A boring documentary that says nothing new.",neg
"The kids were bored and so were the adults.",neg
"Cheap, lazy and badly edited.",neg
"I really wanted to like it but it was a mess.",neg
"Dreadful acting and a script that makes no sense.",neg
"Overlong and self important. A real chore.",neg
"The action scenes are confusing and the plot is silly.",neg
"Not worth watching. Weak story and weak performances.",neg
"It was not funny, not clever and not interesting.",neg
"A forgettable thriller with no thrills at all.",neg
"The worst sequel of the year. Avoid at all costs.",neg
"Slow, dull and far too long for such a thin story.",neg
"An embarrassing film. Poorly made in every way.",neg
"The music is annoying and the jokes are worse.",neg
"Disappointing. The book was so much better.",neg
"Flat, lifeless and boring.",neg
"Terrible from beginning to end.",neg
"A dull story with awful dialogue.",neg
"Avoid this one. It is a mess.",neg
"Poor acting and a ridiculous plot.",neg`;

L[96] = {
  intro: "Models need numbers, but much of the world's data is text: reviews, emails, messages. Today you'll learn the classic way to turn text into numbers (tokens, bags of words and TF-IDF) and build a sentiment classifier for movie reviews.",
  lesson: [
    {h: "Tokenising",
     p: "<b>Tokenising</b> splits text into units, usually words. The simplest approach lowercases the text and finds runs of letters with a regular expression. Real tokenisers also handle punctuation, contractions and other languages, and large language models split text into sub-word pieces.",
     code: R`import re

def tokenize(text):
    return re.findall(r"[a-z']+", text.lower())

print(tokenize("Not bad at all! I LOVED the ending."))`,
     out: "['not', 'bad', 'at', 'all', 'i', 'loved', 'the', 'ending']"},
    {h: "Bag of words",
     p: "A <b>bag of words</b> represents a document by counting how often each vocabulary word appears, ignoring order. Each document becomes a row with one column per word in the vocabulary, mostly zeros. <code>CountVectorizer</code> builds the vocabulary and the counts for you.",
     code: R`from sklearn.feature_extraction.text import CountVectorizer

docs = ["great film", "terrible film", "great great acting"]
cv = CountVectorizer()
counts = cv.fit_transform(docs)
print(cv.get_feature_names_out())
print(counts.toarray())`,
     out: "['acting' 'film' 'great' 'terrible']\n[[0 1 1 0]\n [0 1 0 1]\n [1 0 2 0]]"},
    {h: "TF-IDF",
     p: "Common words like \"the\" and \"film\" appear everywhere and say little. <b>TF-IDF</b> (term frequency × inverse document frequency) gives a word more weight the more often it appears in <b>this</b> document and the rarer it is <b>across</b> documents. <code>TfidfVectorizer</code> works like <code>CountVectorizer</code>; each row is also scaled to length 1."},
    {h: "N-grams catch negation",
     p: "A bag of single words sees \"not good\" as \"not\" + \"good\", which looks positive. Adding <b>bigrams</b> (pairs of neighbouring words) with <code>ngram_range=(1, 2)</code> gives the model \"not good\" as a feature of its own. The vocabulary grows quickly, so <code>min_df=2</code> (ignore words seen in fewer than 2 documents) keeps it manageable."},
    {h: "Text pipelines",
     p: "A vectoriser is a transformer, so it goes in a pipeline: <code>make_pipeline(TfidfVectorizer(), LogisticRegression())</code> takes raw strings in <code>fit</code> and <code>predict</code>. Linear models work well on text because each word gets its own weight, and those weights tell you which words push towards positive or negative."}
  ],
  exercises: [
    {q: "Count the 3 most common words in a paragraph of your choice using <code>tokenize</code> and <code>Counter</code>.", sol: R`from collections import Counter
text = "the cat sat on the mat and the dog sat on the cat"
print(Counter(tokenize(text)).most_common(3))`},
    {q: "Use <code>CountVectorizer(ngram_range=(1, 2))</code> on <code>[\"not good\", \"very good\"]</code> and print the vocabulary.", sol: R`cv = CountVectorizer(ngram_range=(1, 2)).fit(["not good", "very good"])
print(cv.get_feature_names_out())   # ['good' 'not' 'not good' 'very' 'very good']`},
    {q: "Use <code>stop_words=\"english\"</code> in a <code>CountVectorizer</code>. Which words disappear from <code>\"this is the best film of the year\"</code>?", sol: R`cv = CountVectorizer(stop_words="english").fit(["this is the best film of the year"])
print(cv.get_feature_names_out())   # ['best' 'film' 'year']`}
  ],
  project: {
    title: "Movie review sentiment classifier",
    brief: "Train a classifier that decides whether a movie review is positive or negative. Start with your own tokeniser and word counts to see the data, then compare bag-of-words and TF-IDF pipelines with cross-validation, inspect the words the model relies on, test it on new sentences (including tricky negations), and save it. The project includes a small labelled dataset of 100 reviews in <code>reviews.csv</code>; save both files in a <code>day96_sentiment</code> folder.",
    file: "day96_sentiment",
    files: [["reviews.csv", REVIEWS], ["day96_sentiment.py", R`# day96_sentiment.py
# Sentiment analysis with bag-of-words and TF-IDF.

import re
from collections import Counter
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.pipeline import make_pipeline

HERE = Path(__file__).parent
reviews = pd.read_csv(HERE / "reviews.csv")
print(f"{len(reviews)} reviews: {reviews['label'].value_counts().to_dict()}")


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z']+", text.lower())


# 1. Look at the words before modelling
for label in ("pos", "neg"):
    words = Counter(w for text in reviews.loc[reviews.label == label, "text"] for w in tokenize(text))
    common = [w for w, _ in words.most_common(40) if len(w) > 3][:8]
    print(f"  common words in {label} reviews: {', '.join(common)}")

X, y = reviews["text"], (reviews["label"] == "pos").astype(int)

# 2. Compare text representations with cross-validation
candidates = {
    "word counts": CountVectorizer(),
    "word counts + bigrams": CountVectorizer(ngram_range=(1, 2)),
    "tf-idf": TfidfVectorizer(),
    "tf-idf + bigrams": TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True),
    "tf-idf, character 3-5": TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5)),
}
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=96)
print("\n5-fold accuracy:")
results = {}
for name, vectorizer in candidates.items():
    pipe = make_pipeline(vectorizer, LogisticRegression(C=10, max_iter=1000))
    scores = cross_val_score(pipe, X, y, cv=cv)
    results[name] = scores.mean()
    print(f"  {name:<22} {scores.mean():.3f} ± {scores.std():.3f}")

# 3. Train the best representation on all the data and look inside
best = max(results, key=results.get)
model = make_pipeline(candidates[best], LogisticRegression(C=10, max_iter=1000))
model.fit(X, y)
vocab = model[0].get_feature_names_out()
weights = model[-1].coef_[0]
order = np.argsort(weights)
print(f"\nBest: {best}, with {len(vocab):,} features")
print("Most positive:", ", ".join(repr(v) for v in vocab[order[-10:]][::-1]))
print("Most negative:", ", ".join(repr(v) for v in vocab[order[:10]]))

# 4. Try it on new reviews
new_reviews = [
    "What a wonderful, moving film. The cast is brilliant.",
    "Dull story and terrible acting. I was so bored.",
    "Not bad at all, actually really enjoyable.",
    "It was not good.",
    "The effects were great but the plot was a boring mess.",
]
print("\nNew reviews:")
for text, p in zip(new_reviews, model.predict_proba(new_reviews)[:, 1]):
    verdict = "positive" if p >= 0.5 else "negative"
    print(f"  {p:4.0%} {verdict:<8}  {text}")

joblib.dump(model, HERE / "sentiment_model.joblib")
print("\nSaved sentiment_model.joblib")`]],
    explain: [
      ["Counter(w for text in ... for w in tokenize(text))", "A generator with two <code>for</code> clauses walks every word of every review in one pass, and <code>Counter</code> tallies them."],
      ["(reviews[\"label\"] == \"pos\").astype(int)", "Turns the text labels into 1 for positive and 0 for negative."],
      ["TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True)", "Single words plus word pairs, weighted by TF-IDF. <code>sublinear_tf</code> uses the log of counts so repeating a word ten times doesn't count ten times as much."],
      ["LogisticRegression(C=10, ...)", "A higher C means weaker regularisation. With only 100 short reviews, the model needs freedom to give individual words strong weights."],
      ["TfidfVectorizer(analyzer=\"char_wb\", ngram_range=(3, 5))", "Uses chunks of 3 to 5 characters instead of whole words, so \"bored\", \"boring\" and \"boredom\" share features. On tiny datasets this often helps, because the model sees each word stem more often."],
      ["vocab[order[-10:]][::-1]", "<code>argsort</code> orders the weights from most negative to most positive, so the last ten are the strongest positive words; <code>[::-1]</code> lists them strongest first."],
      ["model.predict_proba(new_reviews)", "The pipeline takes raw strings; vectorising happens inside it automatically."]
    ],
    stretch: ["Download the 50,000-review IMDB dataset (search for \"Large Movie Review Dataset\"), load it into the same pipeline and compare accuracy. More data matters more than clever models here.", "Add 10 reviews of your own to <code>reviews.csv</code>, especially tricky ones with sarcasm.", "Write <code>classify.py</code> that loads the saved model and classifies whatever you type."]
  },
  tests: ["With only 100 reviews, expect roughly 60 to 70% accuracy: better than guessing (50%), but tiny data limits every method. That is the real lesson, and the IMDB stretch (about 90%) shows what more data does.", "Check the top features make sense. With character chunks you'll see pieces like <code>' bor'</code> (from boring and bored) and <code>'reat'</code> (from great).", "Look at the mixed review (\"effects were great but ... boring mess\"). What does the model say, and what would you say?", "Explain why \"It was not good\" is hard for a bag of words."]
};

L[97] = {
  intro: "A model on your laptop helps nobody else. Today you'll serve one as a web API with FastAPI, so any app, website or colleague can send data and get predictions back, and you'll test the API automatically.",
  lesson: [
    {h: "Saving and loading models",
     p: "Train once, save, load many times. <code>joblib.dump(pipeline, \"model.joblib\")</code> saves a scikit-learn pipeline, including all preprocessing. Load it with <code>joblib.load</code> in the same library versions it was trained with, so record those versions (in <code>requirements.txt</code> or a metadata file). Only load model files you trust: loading can run code."},
    {h: "What an API is",
     p: "A web API is a program that answers HTTP requests. A client sends a <code>POST</code> request to <code>/predict</code> with a JSON body like <code>{\"size_m2\": 80, ...}</code>, and the server replies with JSON like <code>{\"price\": 215000}</code>. You used APIs as a client on Days 56 and 70; now you're building the server."},
    {h: "FastAPI basics",
     p: "Install with <code>pip install fastapi uvicorn</code>. You create an <code>app = FastAPI()</code> and decorate functions with the path they answer: <code>@app.get(\"/health\")</code>. Run it with <code>uvicorn app:app --reload</code> and visit <code>http://127.0.0.1:8000/docs</code> for free interactive documentation where you can try every endpoint.",
     code: R`from fastapi import FastAPI

app = FastAPI()

@app.get("/hello/{name}")
def hello(name: str):
    return {"message": f"Hello {name}"}`},
    {h: "Validating input with Pydantic",
     p: "Define the expected input as a <b>Pydantic</b> model, a class with type hints. FastAPI checks every request against it and automatically returns a clear 422 error for bad data (a missing field, text where a number should be, a value out of range). <code>Field(gt=0, le=1000)</code> adds limits and <code>Literal[\"flat\", \"terraced\"]</code> restricts choices. Your prediction code only ever sees clean data."},
    {h: "Testing an API",
     p: "<code>fastapi.testclient.TestClient(app)</code> lets pytest call your API without starting a server: <code>client.post(\"/predict\", json={...})</code> returns a response with <code>.status_code</code> and <code>.json()</code>. Test the happy path, invalid input, and edge cases, just as you did on Day 52."}
  ],
  exercises: [
    {q: "Add a <code>GET /add</code> endpoint that takes query parameters <code>a</code> and <code>b</code> (numbers) and returns their sum.", sol: R`@app.get("/add")
def add(a: float, b: float):
    return {"sum": a + b}
# visit /add?a=2&b=3`},
    {q: "Write a Pydantic model <code>Student</code> with a name and an age between 5 and 120.", sol: R`from pydantic import BaseModel, Field

class Student(BaseModel):
    name: str
    age: int = Field(ge=5, le=120)`},
    {q: "What status code does FastAPI return when the request body fails validation?", sol: R`# 422 Unprocessable Content, with a JSON explanation of which field failed and why.`}
  ],
  project: {
    title: "Prediction API",
    brief: "Serve a house-price model over HTTP. <code>train_model.py</code> trains a pipeline (like Day 88's) and saves it with its metadata. <code>app.py</code> is a FastAPI service with health, single-prediction and batch-prediction endpoints and strict input validation. <code>test_app.py</code> checks it with pytest. Run <code>python train_model.py</code>, then <code>uvicorn app:app --reload</code>, and open <code>/docs</code>.",
    file: "day97_prediction_api",
    files: [["requirements.txt", R`fastapi
uvicorn
scikit-learn
pandas
numpy
joblib
httpx
pytest`], ["train_model.py", R`# train_model.py
# Train the house-price pipeline and save it with metadata.

import json
from datetime import datetime, timezone

import joblib
import numpy as np
import pandas as pd
import sklearn
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

NUMERIC = ["size_m2", "rooms", "year_built", "distance_km"]
CATEGORICAL = ["neighbourhood", "house_type"]
NEIGHBOURHOODS = {"Riverside": 1.25, "Old Town": 1.10, "Hillview": 1.00, "Industrial": 0.80, "Airport": 0.85}
HOUSE_TYPES = {"flat": 0, "terraced": 15_000, "detached": 45_000}


def make_data(n: int = 2000, seed: int = 97) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    df = pd.DataFrame({
        "size_m2": rng.normal(105, 35, n).clip(25, 320).round(),
        "year_built": rng.integers(1950, 2025, n),
        "distance_km": rng.gamma(2, 4, n).round(1),
        "neighbourhood": rng.choice(list(NEIGHBOURHOODS), n),
        "house_type": rng.choice(list(HOUSE_TYPES), n, p=[0.45, 0.35, 0.2]),
    })
    df["rooms"] = np.clip((df["size_m2"] / 28 + rng.normal(0, 0.8, n)).round(), 1, 9)
    base = (1_900 * df["size_m2"] + 6_000 * df["rooms"] + 400 * (df["year_built"] - 1950)
            - 2_800 * df["distance_km"] + df["house_type"].map(HOUSE_TYPES))
    df["price"] = (base * df["neighbourhood"].map(NEIGHBOURHOODS) + rng.normal(0, 15_000, n)).round(-2)
    return df


def main() -> None:
    df = make_data()
    X, y = df[NUMERIC + CATEGORICAL], df["price"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=97)
    model = Pipeline([
        ("prep", ColumnTransformer([
            ("num", SimpleImputer(strategy="median"), NUMERIC),
            ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL),
        ])),
        ("model", RandomForestRegressor(n_estimators=200, min_samples_leaf=2, random_state=97, n_jobs=-1)),
    ])
    model.fit(X_train, y_train)
    mae = mean_absolute_error(y_test, model.predict(X_test))
    joblib.dump(model, "model.joblib")
    metadata = {
        "model": "RandomForestRegressor in a preprocessing pipeline",
        "trained_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "test_mae": round(mae),
        "features": NUMERIC + CATEGORICAL,
        "neighbourhoods": list(NEIGHBOURHOODS),
        "sklearn_version": sklearn.__version__,
    }
    with open("model_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)
    print(f"Saved model.joblib (test MAE {mae:,.0f}) and model_metadata.json")


if __name__ == "__main__":
    main()`], ["app.py", R`# app.py
# A FastAPI service that serves house-price predictions.
# Run: uvicorn app:app --reload   then open http://127.0.0.1:8000/docs

import json
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

HERE = Path(__file__).parent
state = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model once when the server starts, not on every request."""
    model_path = HERE / "model.joblib"
    if not model_path.exists():
        raise RuntimeError("model.joblib not found. Run 'python train_model.py' first.")
    state["model"] = joblib.load(model_path)
    state["metadata"] = json.loads((HERE / "model_metadata.json").read_text(encoding="utf-8"))
    yield
    state.clear()


app = FastAPI(title="House price API", version="1.0", lifespan=lifespan)


class House(BaseModel):
    size_m2: float = Field(gt=10, le=1000, description="Floor area in square metres")
    rooms: int = Field(ge=1, le=20)
    year_built: int | None = Field(default=None, ge=1800, le=2030, description="Leave out if unknown")
    distance_km: float = Field(ge=0, le=100, description="Distance from the city centre")
    neighbourhood: str = Field(min_length=1, examples=["Old Town"])
    house_type: Literal["flat", "terraced", "detached"]


class Prediction(BaseModel):
    price: float
    model_test_mae: int
    known_neighbourhood: bool


def predict_prices(houses: list[House]) -> list[Prediction]:
    df = pd.DataFrame([h.model_dump() for h in houses])
    prices = state["model"].predict(df)
    known = state["metadata"]["neighbourhoods"]
    return [Prediction(price=round(float(p), -2),
                       model_test_mae=state["metadata"]["test_mae"],
                       known_neighbourhood=h.neighbourhood in known)
            for h, p in zip(houses, prices)]


@app.get("/health")
def health():
    return {"status": "ok", "model_trained_at": state["metadata"]["trained_at"]}


@app.get("/model")
def model_info():
    return state["metadata"]


@app.post("/predict", response_model=Prediction)
def predict(house: House):
    return predict_prices([house])[0]


@app.post("/predict/batch", response_model=list[Prediction])
def predict_batch(houses: list[House]):
    if not houses:
        raise HTTPException(status_code=400, detail="Send at least one house")
    if len(houses) > 1000:
        raise HTTPException(status_code=413, detail="At most 1000 houses per request")
    return predict_prices(houses)`], ["test_app.py", R`# test_app.py
# Run: pytest -v   (after python train_model.py)

from fastapi.testclient import TestClient

from app import app

FLAT = {"size_m2": 70, "rooms": 3, "year_built": 1985, "distance_km": 2.5,
        "neighbourhood": "Old Town", "house_type": "flat"}


def client():
    return TestClient(app)


def test_health():
    with client() as c:
        r = c.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_predict_returns_a_sensible_price():
    with client() as c:
        r = c.post("/predict", json=FLAT)
    assert r.status_code == 200
    body = r.json()
    assert 50_000 < body["price"] < 1_000_000
    assert body["known_neighbourhood"] is True


def test_bigger_house_costs_more():
    with client() as c:
        small = c.post("/predict", json=FLAT).json()["price"]
        big = c.post("/predict", json={**FLAT, "size_m2": 200, "rooms": 7}).json()["price"]
    assert big > small


def test_year_built_is_optional():
    house = {k: v for k, v in FLAT.items() if k != "year_built"}
    with client() as c:
        assert c.post("/predict", json=house).status_code == 200


def test_unknown_neighbourhood_is_flagged():
    with client() as c:
        body = c.post("/predict", json={**FLAT, "neighbourhood": "Moon Base"}).json()
    assert body["known_neighbourhood"] is False


def test_invalid_input_is_rejected():
    with client() as c:
        assert c.post("/predict", json={**FLAT, "size_m2": -5}).status_code == 422
        assert c.post("/predict", json={**FLAT, "house_type": "castle"}).status_code == 422
        missing = {k: v for k, v in FLAT.items() if k != "rooms"}
        assert c.post("/predict", json=missing).status_code == 422


def test_batch():
    with client() as c:
        r = c.post("/predict/batch", json=[FLAT, {**FLAT, "house_type": "detached"}])
        assert r.status_code == 200
        assert len(r.json()) == 2
        assert c.post("/predict/batch", json=[]).status_code == 400`]],
    explain: [
      ["@asynccontextmanager async def lifespan(app)", "Code before <code>yield</code> runs once at start-up, code after it at shutdown. Loading the model here means each request is fast."],
      ["year_built: int | None = Field(default=None, ...)", "An optional field: clients may leave it out, and the pipeline's imputer fills the gap with the training median."],
      ["house_type: Literal[\"flat\", \"terraced\", \"detached\"]", "Only these three strings are accepted. Anything else is rejected with a 422 before your code runs."],
      ["pd.DataFrame([h.model_dump() for h in houses])", "<code>model_dump()</code> turns each validated Pydantic object into a dict; a list of dicts becomes a DataFrame with the column names the pipeline expects."],
      ["@app.post(\"/predict\", response_model=Prediction)", "<code>response_model</code> documents and checks the shape of the reply, so clients know exactly what they'll get."],
      ["with TestClient(app) as c:", "Using the client as a context manager runs the lifespan, so the model is loaded during the tests just as in production."]
    ],
    stretch: ["Call your running API from another script with <code>requests.post</code> (Day 56 skills).", "Add a <code>/predict/explain</code> endpoint that returns how the price changes if the house were 10 m² bigger.", "Write a <code>Dockerfile</code> so the API runs anywhere with <code>docker run</code>."]
  },
  tests: ["Run <code>python train_model.py</code>, then <code>pytest -v</code>: 7 tests should pass.", "Start the server and try <code>/predict</code> from the <code>/docs</code> page.", "Send a house with <code>size_m2: \"big\"</code> and read the 422 error message.", "Add <code>model.joblib</code> to <code>.gitignore</code> and note in your README how to recreate it."]
};

L[98] = {
  intro: "Large language models (LLMs) like Claude can explain, summarise, write and reason in plain language, and you can use them from Python through an API. Today you'll learn how those calls work, what they cost, and how to handle the answers safely, then build a study assistant for this course.",
  lesson: [
    {h: "How an LLM API works",
     p: "You send a request with a <b>model</b> name, a list of <b>messages</b> and a limit on the answer length, and you get back the model's reply. The API is <b>stateless</b>: it remembers nothing between calls, so to hold a conversation you send the whole history every time. Each message has a <code>role</code>: <code>\"user\"</code> for your side and <code>\"assistant\"</code> for the model's."},
    {h: "API keys and cost",
     p: "Create an account and API key at console.anthropic.com. The key is like a password that can spend money: store it in an environment variable called <code>ANTHROPIC_API_KEY</code>, never in your code, and never commit it to GitHub. You pay per <b>token</b> (a token is roughly three-quarters of a word), with separate prices for input and output. The response's <code>usage</code> tells you exactly how many tokens each call used. Set a monthly spending limit in the console while you learn."},
    {h: "Your first call",
     p: "Install the official library with <code>pip install anthropic</code>. The client reads your key from the environment. The reply's <code>content</code> is a list of <b>blocks</b>; the answer text is in blocks whose <code>type</code> is <code>\"text\"</code>. (The model may also return other block types, such as its internal reasoning, so always check the type.)",
     code: R`import anthropic

client = anthropic.Anthropic()          # reads ANTHROPIC_API_KEY
response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1000,
    system="You are a friendly Python tutor. Answer in under 100 words.",
    messages=[{"role": "user", "content": "What is a list comprehension?"}],
)
for block in response.content:
    if block.type == "text":
        print(block.text)
print(response.usage.input_tokens, response.usage.output_tokens)`},
    {h: "System prompts and streaming",
     p: "The <code>system</code> prompt sets the model's role and rules for the whole conversation: who it is, how long to answer, what to avoid. Clear, specific instructions work better than vague ones. For chat apps, <b>stream</b> the reply with <code>client.messages.stream(...)</code> so words appear as they're generated instead of after a long pause; <code>stream.text_stream</code> yields the text piece by piece."},
    {h: "Handling responses safely",
     p: "Check <code>stop_reason</code>: <code>\"end_turn\"</code> means a complete answer, <code>\"max_tokens\"</code> means it was cut off, and <code>\"refusal\"</code> means the model declined. Catch the library's specific errors: <code>AuthenticationError</code> (bad key), <code>RateLimitError</code> (slow down), <code>APIConnectionError</code> (network). And remember LLMs can be confidently wrong: for a study assistant, check important facts against the lesson or the docs."}
  ],
  exercises: [
    {q: "Set your API key as an environment variable without putting it in code. (Windows PowerShell and macOS/Linux differ.)", sol: R`# macOS / Linux (add to ~/.zshrc or ~/.bashrc to make it permanent):
#   export ANTHROPIC_API_KEY="sk-ant-..."
# Windows PowerShell:
#   setx ANTHROPIC_API_KEY "sk-ant-..."   (then open a new terminal)
import os
print("key found" if os.environ.get("ANTHROPIC_API_KEY") else "no key")`},
    {q: "Write a two-turn conversation by hand: ask a question, append the assistant's reply to <code>messages</code>, then ask a follow-up that depends on it.", sol: R`messages = [{"role": "user", "content": "Give me one Python tip."}]
r = client.messages.create(model="claude-opus-5-5", max_tokens=500, messages=messages)
messages.append({"role": "assistant", "content": r.content})
messages.append({"role": "user", "content": "Show me an example of that tip."})
r = client.messages.create(model="claude-opus-5-5", max_tokens=500, messages=messages)`},
    {q: "Stream a short poem about NumPy and print it as it arrives.", sol: R`with client.messages.stream(
    model="claude-opus-5-5", max_tokens=500,
    messages=[{"role": "user", "content": "A four-line poem about NumPy."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)`}
  ],
  project: {
    title: "Small study-assistant chatbot",
    brief: "Build \"Study Buddy\", a terminal chatbot that tutors you on this course. It keeps the conversation history, streams answers, has commands for quizzes and explanations, can reset or save the conversation to Markdown, shows how many tokens you've used, and handles errors and refusals gracefully. Needs <code>pip install anthropic</code> and an <code>ANTHROPIC_API_KEY</code>. Each message costs a small amount, so keep an eye on <code>/usage</code>.",
    file: "day98_study_buddy.py",
    code: R`# day98_study_buddy.py
# A terminal study assistant built on the Claude API.

import os
import sys
from datetime import datetime
from pathlib import Path

import anthropic

MODEL = "claude-opus-5-5"
SYSTEM = """You are Study Buddy, a patient tutor for someone learning Python and machine learning
through a 100-day course. Explain ideas in plain language, with a short code example when it helps.
Now and then, ask a question back to check understanding. When asked for a quiz, ask three short
questions one at a time and wait for each answer before giving feedback. If you are not sure about
something, say so. Keep answers under about 200 words unless asked for more."""

HELP = """Commands:
  /quiz <topic>     quiz me on a topic
  /explain <idea>   explain an idea simply
  /reset            start a new conversation
  /save             save the conversation as Markdown
  /usage            tokens used so far
  /quit             exit
Anything else is sent as a normal message."""


def blocks_for_history(content):
    """Return the assistant turn to keep in the history.

    Blocks are kept as the API returned them (including any reasoning blocks).
    If the server switched to a fallback model part-way through an answer, the
    API docs say to keep only text blocks from before the switch.
    """
    switches = [i for i, block in enumerate(content) if block.type == "fallback"]
    if not switches:
        return content
    last = switches[-1]
    return [b for i, b in enumerate(content) if i > last or b.type == "text"]


class StudyBuddy:
    def __init__(self, client: anthropic.Anthropic):
        self.client = client
        self.messages = []
        self.transcript = []                 # (speaker, text) pairs for /save
        self.input_tokens = 0
        self.output_tokens = 0

    def ask(self, text: str) -> str:
        self.messages.append({"role": "user", "content": text})
        try:
            with self.client.beta.messages.stream(
                model=MODEL,
                max_tokens=4000,
                system=SYSTEM,
                messages=self.messages,
                output_config={"effort": "low"},            # quick, conversational answers
                betas=["server-side-fallback-2026-07-01"],
                fallbacks="default",                        # retry on another model if this one declines
            ) as stream:
                for piece in stream.text_stream:
                    print(piece, end="", flush=True)
                final = stream.get_final_message()
        except anthropic.AuthenticationError:
            return self._fail("Your API key was rejected. Check ANTHROPIC_API_KEY.")
        except anthropic.RateLimitError:
            return self._fail("Too many requests. Wait a minute and try again.")
        except anthropic.APIStatusError as error:
            return self._fail(f"The API returned an error ({error.status_code}). Try again later.")
        except anthropic.APIConnectionError:
            return self._fail("Couldn't reach the API. Check your internet connection.")
        print()

        self.input_tokens += final.usage.input_tokens
        self.output_tokens += final.usage.output_tokens
        if final.stop_reason == "refusal":
            return self._fail("Study Buddy can't help with that one. Try asking another way.")
        if final.stop_reason == "max_tokens":
            print("[The answer was cut short. Ask me to continue.]")

        reply = "".join(block.text for block in final.content if block.type == "text")
        self.messages.append({"role": "assistant", "content": blocks_for_history(final.content)})
        self.transcript += [("You", text), ("Study Buddy", reply)]
        return reply

    def _fail(self, message: str) -> str:
        self.messages.pop()                  # forget the question that failed
        print(f"\n[{message}]")
        return ""

    def reset(self) -> None:
        self.messages.clear()
        self.transcript.clear()

    def save(self) -> Path:
        path = Path(f"study_session_{datetime.now():%Y%m%d_%H%M}.md")
        lines = [f"# Study session, {datetime.now():%d %B %Y}\n"]
        lines += [f"**{who}:** {text}\n" for who, text in self.transcript]
        path.write_text("\n".join(lines), encoding="utf-8")
        return path


def main() -> None:
    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("No API key found. Set the ANTHROPIC_API_KEY environment variable first (see the lesson).")
    buddy = StudyBuddy(anthropic.Anthropic())
    print("Study Buddy is ready. Type /help for commands.\n")
    while True:
        try:
            text = input("you> ").strip()
        except (EOFError, KeyboardInterrupt):
            text = "/quit"
        if not text:
            continue
        command, _, rest = text.partition(" ")
        if command == "/quit":
            print(f"Bye! You used {buddy.input_tokens + buddy.output_tokens:,} tokens this session.")
            break
        elif command == "/help":
            print(HELP)
        elif command == "/reset":
            buddy.reset()
            print("Started a new conversation.")
        elif command == "/save":
            print(f"Saved to {buddy.save()}")
        elif command == "/usage":
            print(f"Input tokens: {buddy.input_tokens:,}  Output tokens: {buddy.output_tokens:,}")
        elif command == "/quiz":
            print("buddy> ", end="")
            buddy.ask(f"Quiz me on {rest or 'what I have learned so far'}. Start with the first question.")
        elif command == "/explain":
            print("buddy> ", end="")
            buddy.ask(f"Explain {rest} simply, with a tiny example.")
        else:
            print("buddy> ", end="")
            buddy.ask(text)


if __name__ == "__main__":
    main()`,
    explain: [
      ["anthropic.Anthropic()", "Creates the client. It finds your API key in the environment, so the key never appears in your code."],
      ["self.client.beta.messages.stream(...)", "Streams the answer so it appears word by word. It's on the <code>beta</code> namespace because of the fallback option below."],
      ["output_config={\"effort\": \"low\"}", "Tells the model not to think long before answering. Chat replies are fast and cheaper at low effort; raise it for hard questions."],
      ["betas=[...], fallbacks=\"default\"", "If the model's safety checks decline a request by mistake, the server retries on another suitable model instead of failing. It's off unless you ask for it, and recommended for this model."],
      ["self.messages.append({\"role\": \"assistant\", \"content\": blocks_for_history(final.content)})", "The API is stateless, so the history grows each turn and is sent with every request. The reply is stored exactly as returned, which is what the API expects."],
      ["except anthropic.AuthenticationError:", "Specific errors get specific advice. The order matters: the more specific error classes come before the general <code>APIStatusError</code>."],
      ["self.messages.pop()", "If a request fails, the unanswered question is removed so the history stays a clean back-and-forth."]
    ],
    stretch: ["Add <code>/level easy|normal|hard</code>, which adds a system-style instruction to the next message to change the difficulty.", "Load a lesson file from this course and ask questions about it (put its text in the first user message).", "Track the cost in dollars from the token counts using the current prices on the pricing page."]
  },
  tests: ["Run it without an API key set: you should get a clear message, not a crash. Then set a deliberately wrong key and check you get the \"key was rejected\" message.", "Ask a question, then a follow-up that says \"give another example of that\". The answer should show it remembers.", "Try <code>/quiz list comprehensions</code>, answer the questions, then <code>/save</code> and open the Markdown file.", "Check <code>/usage</code> grows with each message. Why does input usage grow faster than output?"]
};

L[99] = {
  intro: "A single script is fine for experiments, but real ML code needs to be reproducible, configurable, testable and installable. Today you'll turn a model into a proper Python package with a config file, a command-line interface and tests: the structure professional ML projects use.",
  lesson: [
    {h: "Why structure matters",
     p: "A notebook that worked once is hard to rerun, review or share. Splitting code into modules with clear jobs (load data, build the model, train, predict) makes each part testable and reusable. A <code>src/</code> layout keeps your package separate from scripts and tests, so tests run against the installed package, as a user would."},
    {h: "Reproducibility",
     p: "Someone (including future you) should get the same results from the same code and data. Fix every random seed (<code>random_state</code>), record library versions, keep settings in a config file instead of scattered through the code, and save the config alongside each trained model and its metrics. Then any result can be traced back to exactly how it was produced."},
    {h: "Config files with TOML",
     p: "TOML is a simple, readable config format, and Python 3.11+ reads it with the built-in <code>tomllib</code>. Loading the config into dataclasses gives you attribute access, type hints and one place to validate it.",
     code: R`import tomllib

text = """
[model]
kind = "random_forest"
n_estimators = 200
"""
config = tomllib.loads(text)
print(config["model"]["kind"], config["model"]["n_estimators"])`,
     out: "random_forest 200"},
    {h: "pyproject.toml and installable packages",
     p: "<code>pyproject.toml</code> describes your package: name, version, dependencies, and command-line entry points. <code>pip install -e .</code> installs it in <b>editable</b> mode, so code changes take effect immediately. A <code>[project.scripts]</code> entry like <code>wine-ml = \"wine_ml.cli:main\"</code> creates a real terminal command."},
    {h: "Testing ML code",
     p: "You can't assert an exact accuracy, but you can test a lot: the config loads and rejects bad values; the model builds for every supported kind; predictions have the right shape and valid labels; probabilities add up to 1; training twice with the same seed gives identical results; and accuracy stays above a sensible minimum. These tests catch most of the bugs that silently ruin ML projects."}
  ],
  exercises: [
    {q: "Write a dataclass <code>TrainConfig</code> with <code>seed: int = 42</code> and <code>test_size: float = 0.2</code>, and a <code>__post_init__</code> that rejects a test_size outside 0 to 1.", sol: R`from dataclasses import dataclass

@dataclass
class TrainConfig:
    seed: int = 42
    test_size: float = 0.2

    def __post_init__(self):
        if not 0 < self.test_size < 1:
            raise ValueError("test_size must be between 0 and 1")`},
    {q: "Write a pytest test that checks training twice with the same seed gives the same predictions.", sol: R`def test_reproducible():
    a = train_model(seed=1).predict(X_test)
    b = train_model(seed=1).predict(X_test)
    assert (a == b).all()`},
    {q: "What's the difference between <code>pip install .</code> and <code>pip install -e .</code>?", sol: R`# pip install .     copies the package into site-packages; later code edits need a reinstall.
# pip install -e .  links to your source folder; edits take effect immediately (editable).`}
  ],
  project: {
    title: "Refactor an ML project into a package",
    brief: "Turn a wine classifier into a small, professional package called <code>wine_ml</code>: settings in <code>config.toml</code>, separate modules for config, data, model, training and prediction, a <code>wine-ml</code> command with <code>train</code> and <code>predict</code> subcommands, saved artifacts with metrics and the config used, and a pytest suite. From the <code>day99_wine_ml</code> folder run <code>pip install -e \".[dev]\"</code>, then <code>wine-ml train</code>, <code>wine-ml predict new_wines.csv</code> and <code>pytest -v</code>.",
    file: "day99_wine_ml",
    files: [["pyproject.toml", R`[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"

[project]
name = "wine-ml"
version = "0.1.0"
description = "A reproducible wine classifier, structured as a Python package"
requires-python = ">=3.11"
dependencies = ["scikit-learn>=1.4", "pandas>=2.0", "joblib"]

[project.optional-dependencies]
dev = ["pytest"]

[project.scripts]
wine-ml = "wine_ml.cli:main"

[tool.setuptools.packages.find]
where = ["src"]

[tool.pytest.ini_options]
testpaths = ["tests"]`], ["config.toml", R`# Every setting that affects results lives here, not in the code.

[data]
test_size = 0.25
seed = 99

[model]
kind = "random_forest"        # or "logistic_regression"
n_estimators = 200            # random forest only
max_depth = 6                 # random forest only
C = 1.0                       # logistic regression only

[output]
dir = "artifacts"`], ["new_wines.csv", R`alcohol,malic_acid,ash,alcalinity_of_ash,magnesium,total_phenols,flavanoids,nonflavanoid_phenols,proanthocyanins,color_intensity,hue,od280/od315_of_diluted_wines,proline
14.2,1.76,2.45,15.2,112.0,3.27,3.39,0.34,1.97,6.75,1.05,2.85,1450.0
12.0,0.92,2.0,19.0,86.0,2.42,2.26,0.3,1.43,2.5,1.38,3.12,278.0
13.5,3.12,2.62,24.0,123.0,1.4,1.57,0.22,1.25,8.6,0.59,1.3,500.0`], ["src/wine_ml/__init__.py", R`"""A reproducible wine classifier."""

__version__ = "0.1.0"`], ["src/wine_ml/__main__.py", R`from wine_ml.cli import main

main()`], ["src/wine_ml/config.py", R`"""Load and validate settings from a TOML file."""

import tomllib
from dataclasses import asdict, dataclass
from pathlib import Path

MODEL_KINDS = ("random_forest", "logistic_regression")


@dataclass(frozen=True)
class DataConfig:
    test_size: float = 0.25
    seed: int = 0

    def __post_init__(self):
        if not 0 < self.test_size < 1:
            raise ValueError(f"data.test_size must be between 0 and 1, got {self.test_size}")


@dataclass(frozen=True)
class ModelConfig:
    kind: str = "random_forest"
    n_estimators: int = 100
    max_depth: int | None = None
    C: float = 1.0

    def __post_init__(self):
        if self.kind not in MODEL_KINDS:
            raise ValueError(f"model.kind must be one of {MODEL_KINDS}, got {self.kind!r}")


@dataclass(frozen=True)
class Config:
    data: DataConfig
    model: ModelConfig
    output_dir: Path

    def to_dict(self) -> dict:
        return {"data": asdict(self.data), "model": asdict(self.model), "output_dir": str(self.output_dir)}


def load_config(path: str | Path) -> Config:
    path = Path(path)
    with path.open("rb") as f:
        raw = tomllib.load(f)
    output_dir = Path(raw.get("output", {}).get("dir", "artifacts"))
    if not output_dir.is_absolute():
        output_dir = path.parent / output_dir          # relative to the config file
    return Config(
        data=DataConfig(**raw.get("data", {})),
        model=ModelConfig(**raw.get("model", {})),
        output_dir=output_dir,
    )`], ["src/wine_ml/data.py", R`"""Loading and splitting the data."""

import pandas as pd
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split

from wine_ml.config import DataConfig

FEATURES = list(load_wine().feature_names)
CLASS_NAMES = ["cultivar A", "cultivar B", "cultivar C"]


def load_data() -> tuple[pd.DataFrame, pd.Series]:
    data = load_wine(as_frame=True)
    return data.data, data.target


def split(X: pd.DataFrame, y: pd.Series, cfg: DataConfig):
    return train_test_split(X, y, test_size=cfg.test_size, random_state=cfg.seed, stratify=y)`], ["src/wine_ml/model.py", R`"""Building the model from the config."""

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from wine_ml.config import ModelConfig


def build_model(cfg: ModelConfig, seed: int) -> Pipeline:
    if cfg.kind == "random_forest":
        estimator = RandomForestClassifier(n_estimators=cfg.n_estimators, max_depth=cfg.max_depth,
                                           random_state=seed)
    elif cfg.kind == "logistic_regression":
        estimator = LogisticRegression(C=cfg.C, max_iter=5000)
    else:
        raise ValueError(f"Unknown model kind: {cfg.kind}")
    return Pipeline([("scale", StandardScaler()), ("model", estimator)])`], ["src/wine_ml/train.py", R`"""Train, evaluate and save a model with everything needed to reproduce it."""

import json
import logging
import platform

import joblib
import sklearn
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import cross_val_score

from wine_ml import __version__
from wine_ml.config import Config
from wine_ml.data import load_data, split
from wine_ml.model import build_model

log = logging.getLogger(__name__)


def train(cfg: Config) -> dict:
    X, y = load_data()
    X_train, X_test, y_train, y_test = split(X, y, cfg.data)
    model = build_model(cfg.model, seed=cfg.data.seed)

    cv_scores = cross_val_score(model, X_train, y_train, cv=5)
    log.info("Cross-validated accuracy %.3f ± %.3f", cv_scores.mean(), cv_scores.std())
    model.fit(X_train, y_train)
    pred = model.predict(X_test)

    metrics = {
        "cv_accuracy": round(float(cv_scores.mean()), 4),
        "test_accuracy": round(float(accuracy_score(y_test, pred)), 4),
        "test_f1_macro": round(float(f1_score(y_test, pred, average="macro")), 4),
        "n_train": len(X_train),
        "n_test": len(X_test),
    }
    cfg.output_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, cfg.output_dir / "model.joblib")
    record = {
        "metrics": metrics,
        "config": cfg.to_dict(),
        "versions": {"wine_ml": __version__, "sklearn": sklearn.__version__,
                     "python": platform.python_version()},
    }
    (cfg.output_dir / "metrics.json").write_text(json.dumps(record, indent=2), encoding="utf-8")
    log.info("Saved model and metrics to %s", cfg.output_dir)
    return metrics`], ["src/wine_ml/predict.py", R`"""Load a trained model and make predictions."""

from pathlib import Path

import joblib
import pandas as pd

from wine_ml.data import CLASS_NAMES, FEATURES


def load_model(output_dir: Path):
    path = Path(output_dir) / "model.joblib"
    if not path.exists():
        raise FileNotFoundError(f"No model at {path}. Run 'wine-ml train' first.")
    return joblib.load(path)


def predict(model, rows: pd.DataFrame) -> pd.DataFrame:
    missing = set(FEATURES) - set(rows.columns)
    if missing:
        raise ValueError(f"Missing columns: {sorted(missing)}")
    proba = model.predict_proba(rows[FEATURES])
    best = proba.argmax(axis=1)
    return pd.DataFrame({
        "prediction": [CLASS_NAMES[i] for i in best],
        "confidence": proba.max(axis=1).round(3),
    })`], ["src/wine_ml/cli.py", R`"""Command-line interface: wine-ml train | predict."""

import argparse
import logging
import sys

import pandas as pd

from wine_ml.config import load_config
from wine_ml.predict import load_model, predict
from wine_ml.train import train


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="wine-ml", description="Train and use a wine classifier.")
    parser.add_argument("--config", default="config.toml", help="path to the TOML config file")
    parser.add_argument("-v", "--verbose", action="store_true", help="show progress messages")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("train", help="train a model and save it with its metrics")
    p_predict = sub.add_parser("predict", help="predict the cultivar for rows in a CSV file")
    p_predict.add_argument("csv", help="CSV file with the 13 measurement columns")
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.INFO if args.verbose else logging.WARNING,
                        format="%(levelname)s %(name)s: %(message)s")
    try:
        cfg = load_config(args.config)
        if args.command == "train":
            metrics = train(cfg)
            print(f"Trained {cfg.model.kind}: test accuracy {metrics['test_accuracy']:.1%}, "
                  f"cross-validated {metrics['cv_accuracy']:.1%}. Saved to {cfg.output_dir}/")
        else:
            rows = pd.read_csv(args.csv)
            results = predict(load_model(cfg.output_dir), rows)
            print(results.to_string(index=False))
    except (FileNotFoundError, ValueError) as error:
        print(f"error: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())`], ["tests/conftest.py", R`from pathlib import Path

import pytest

from wine_ml.config import load_config

PROJECT = Path(__file__).parent.parent


@pytest.fixture
def cfg(tmp_path):
    """The real config, but writing artifacts to a temporary folder."""
    base = load_config(PROJECT / "config.toml")
    return type(base)(data=base.data, model=base.model, output_dir=tmp_path / "artifacts")`], ["tests/test_config.py", R`from pathlib import Path

import pytest

from wine_ml.config import DataConfig, ModelConfig, load_config

PROJECT = Path(__file__).parent.parent


def test_project_config_loads():
    cfg = load_config(PROJECT / "config.toml")
    assert cfg.model.kind == "random_forest"
    assert 0 < cfg.data.test_size < 1


def test_rejects_unknown_model_kind():
    with pytest.raises(ValueError, match="model.kind"):
        ModelConfig(kind="magic")


@pytest.mark.parametrize("size", [0, 1, 1.5, -0.2])
def test_rejects_bad_test_size(size):
    with pytest.raises(ValueError):
        DataConfig(test_size=size)


def test_reads_toml_file(tmp_path):
    path = tmp_path / "c.toml"
    path.write_text('[model]\nkind = "logistic_regression"\nC = 0.5\n')
    cfg = load_config(path)
    assert cfg.model.kind == "logistic_regression"
    assert cfg.model.C == 0.5
    assert cfg.output_dir == tmp_path / "artifacts"`], ["tests/test_model.py", R`import json

import numpy as np
import pytest

from wine_ml.config import ModelConfig
from wine_ml.data import FEATURES, load_data
from wine_ml.model import build_model
from wine_ml.predict import load_model, predict
from wine_ml.train import train


@pytest.mark.parametrize("kind", ["random_forest", "logistic_regression"])
def test_every_kind_trains_and_predicts(kind):
    X, y = load_data()
    model = build_model(ModelConfig(kind=kind), seed=0).fit(X, y)
    proba = model.predict_proba(X.head(10))
    assert proba.shape == (10, 3)
    assert np.allclose(proba.sum(axis=1), 1)


def test_training_is_reproducible(cfg):
    assert train(cfg) == train(cfg)


def test_accuracy_is_good_enough(cfg):
    assert train(cfg)["test_accuracy"] >= 0.9


def test_artifacts_are_saved(cfg):
    train(cfg)
    record = json.loads((cfg.output_dir / "metrics.json").read_text())
    assert record["config"]["model"]["kind"] == cfg.model.kind
    assert "sklearn" in record["versions"]


def test_predict_from_saved_model(cfg):
    train(cfg)
    X, _ = load_data()
    result = predict(load_model(cfg.output_dir), X.head(5))
    assert len(result) == 5
    assert result["confidence"].between(0, 1).all()


def test_predict_rejects_missing_columns(cfg):
    train(cfg)
    X, _ = load_data()
    with pytest.raises(ValueError, match="Missing columns"):
        predict(load_model(cfg.output_dir), X.drop(columns=FEATURES[0]).head(2))`], ["README.md", R`# wine-ml

A small, reproducible classifier that identifies the cultivar of a wine from 13 chemical
measurements, structured as an installable Python package.

## Setup

    python -m venv .venv
    source .venv/bin/activate        # Windows: .venv\Scripts\activate
    pip install -e ".[dev]"

## Usage

    wine-ml train                    # trains with config.toml, saves to artifacts/
    wine-ml predict new_wines.csv    # predicts each row of a CSV file
    wine-ml --config other.toml train

Change the model or its settings in config.toml; nothing in the code needs editing.
Every run saves artifacts/metrics.json with the metrics, the exact config and library versions.

## Tests

    pytest -v

## Layout

    src/wine_ml/config.py    settings from TOML, validated
    src/wine_ml/data.py      loading and splitting
    src/wine_ml/model.py     building the pipeline
    src/wine_ml/train.py     training, evaluation, saving
    src/wine_ml/predict.py   loading and predicting
    src/wine_ml/cli.py       the wine-ml command`]],
    explain: [
      ["[project.scripts] wine-ml = \"wine_ml.cli:main\"", "After <code>pip install -e .</code>, typing <code>wine-ml</code> in the terminal calls <code>main()</code> in <code>cli.py</code>."],
      ["@dataclass(frozen=True)", "Config objects can't be changed after loading, so no code can quietly alter a setting halfway through a run."],
      ["output_dir = path.parent / output_dir", "Relative paths in the config are resolved next to the config file, so the command works from any folder."],
      ["record = {\"metrics\": ..., \"config\": ..., \"versions\": ...}", "Saving the config and library versions with every model is what makes a result reproducible months later."],
      ["def main(argv: list[str] | None = None) -> int:", "Taking <code>argv</code> as a parameter lets tests call <code>main([\"train\"])</code> directly; returning an exit code lets scripts detect failures."],
      ["def test_training_is_reproducible(cfg):", "Two runs with the same config must give identical metrics. If this test ever fails, some randomness isn't seeded."]
    ],
    stretch: ["Add an <code>evaluate</code> subcommand that loads the saved model and prints a classification report.", "Add a third model kind (for example <code>knn</code>) with its settings in the config, plus a test.", "Add a GitHub Actions workflow that runs <code>pytest</code> on every push (Day 55 skills)."]
  },
  tests: ["<code>pip install -e \".[dev]\"</code>, then <code>pytest -v</code>: 14 tests should pass.", "<code>wine-ml train</code> then <code>wine-ml predict new_wines.csv</code>: the three rows should be cultivars A, B and C.", "Change <code>kind</code> to <code>logistic_regression</code> in <code>config.toml</code>, retrain, and compare <code>artifacts/metrics.json</code>.", "Set <code>kind = \"magic\"</code> and check you get a clear error instead of a traceback."]
};

L[100] = {
  intro: "Day 100. The final capstone brings the whole journey together: a real dataset, a well-evaluated model, an API with a small web page, tests, documentation and a polished GitHub repository. Give it a week, not a day. This is the project you'll show people.",
  lesson: [
    {h: "Choosing your capstone",
     p: "The example below classifies penguin species, but the best capstone answers a question <b>you</b> care about. Good choices have a clear prediction target, at least a few hundred rows of real data, and a user who would benefit: exam scores at your school, house prices in your city, crop yields, football results, or text you collect. Write one sentence: \"Given X, predict Y, so that Z can decide W.\""},
    {h: "The end-to-end workflow",
     p: "Every ML project follows the same path, and you've practised each step: <b>1</b> get and understand the data (Days 75–80); <b>2</b> set a baseline (Day 85); <b>3</b> build a pipeline and compare models with cross-validation (Days 87–92); <b>4</b> evaluate once on a held-out test set and study the errors; <b>5</b> save the model with its metadata (Day 99); <b>6</b> serve it through an API (Day 97); <b>7</b> test it; <b>8</b> document it."},
    {h: "Model cards",
     p: "A <b>model card</b> is a short document that travels with a model: what it predicts, what data it was trained on, how well it performs (overall and for important subgroups), and its limitations and risks. Writing one forces you to think about who could be harmed by mistakes, and it's what experienced reviewers look for first."},
    {h: "A portfolio-quality repository",
     p: "Recruiters and collaborators spend about a minute on a repository. Make it count: a README that opens with what the project does and a screenshot, how to run it in three commands, results in a small table, and what you'd do next. Keep data and large model files out of Git (<code>.gitignore</code>), pin dependencies in <code>requirements.txt</code>, and make sure the tests pass on a fresh clone."},
    {h: "Deploying (optional)",
     p: "To let anyone try it, deploy the API. Services such as Render, Railway and Hugging Face Spaces can run a FastAPI app from a GitHub repository, often for free at small scale. The usual start command is <code>uvicorn app:app --host 0.0.0.0 --port $PORT</code>. Train the model during the build step or include a small model file, and never put secrets in the repository."}
  ],
  exercises: [
    {q: "Write the one-sentence problem statement for your own capstone idea.", sol: R`# Example: "Given a penguin's island, sex and body measurements, predict its species,
# so that field researchers can label observations quickly and flag unusual ones."`},
    {q: "List three ways your model could be wrong in a way that matters, and who would be affected.", sol: R`# 1. A species that is rare in the training data gets misclassified more often.
# 2. Measurements taken differently (another team's equipment) shift the inputs.
# 3. A penguin from an island not in the data gets a confident but meaningless answer.`},
    {q: "Write a <code>.gitignore</code> for an ML project.", sol: R`__pycache__/
.venv/
data/
*.joblib
*.pt
.env
.ipynb_checkpoints/`}
  ],
  project: {
    title: "End-to-end ML application",
    brief: "Build a complete penguin species predictor: <code>train.py</code> loads and cleans the data, compares a baseline with two models by cross-validation, evaluates the winner on a test set, and saves the model, its metrics and a model card. <code>app.py</code> serves predictions through a FastAPI JSON endpoint and a simple web page with a form. <code>test_app.py</code> tests it, and <code>README.md</code> is a template for your portfolio write-up. Run <code>pip install -r requirements.txt</code>, <code>python train.py</code>, <code>pytest -v</code>, then <code>uvicorn app:app --reload</code> and open <code>http://127.0.0.1:8000</code>. When it's working, we'll set up its GitHub repository together.",
    file: "day100_penguin_app",
    files: [["requirements.txt", R`fastapi
uvicorn
scikit-learn
pandas
seaborn
joblib
httpx
pytest`], [".gitignore", R`__pycache__/
.venv/
*.joblib
.pytest_cache/`], ["train.py", R`# train.py
# Data -> baseline -> model comparison -> test evaluation -> saved model and model card.

import json
from datetime import date

import joblib
import pandas as pd
import seaborn as sns
import sklearn
from sklearn.compose import ColumnTransformer
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import StratifiedKFold, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

NUMERIC = ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]
CATEGORICAL = ["island", "sex"]
SEED = 100


def load() -> pd.DataFrame:
    df = sns.load_dataset("penguins")                 # downloads the first time
    before = len(df)
    df = df.dropna(subset=NUMERIC)                    # rows with no measurements at all
    print(f"Loaded {before} penguins, dropped {before - len(df)} with no measurements.")
    return df


def make_pipeline(model) -> Pipeline:
    prep = ColumnTransformer([
        ("num", Pipeline([("impute", SimpleImputer(strategy="median")), ("scale", StandardScaler())]), NUMERIC),
        ("cat", Pipeline([("impute", SimpleImputer(strategy="constant", fill_value="unknown")),
                          ("onehot", OneHotEncoder(handle_unknown="ignore"))]), CATEGORICAL),
    ])
    return Pipeline([("prep", prep), ("model", model)])


def main() -> None:
    df = load()
    X, y = df[NUMERIC + CATEGORICAL], df["species"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=SEED, stratify=y)

    candidates = {
        "baseline (most common species)": DummyClassifier(strategy="most_frequent"),
        "logistic regression": LogisticRegression(max_iter=2000),
        "random forest": RandomForestClassifier(n_estimators=300, random_state=SEED),
    }
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEED)
    scores = {}
    print("\n5-fold cross-validated accuracy on the training set:")
    for name, model in candidates.items():
        result = cross_val_score(make_pipeline(model), X_train, y_train, cv=cv)
        scores[name] = result.mean()
        print(f"  {name:<32} {result.mean():.3f} ± {result.std():.3f}")
    best_name = max(scores, key=scores.get)

    model = make_pipeline(candidates[best_name]).fit(X_train, y_train)
    pred = model.predict(X_test)
    test_acc = accuracy_score(y_test, pred)
    print(f"\nChosen: {best_name}. Test accuracy: {test_acc:.3f}")
    print(classification_report(y_test, pred, digits=3))
    labels = sorted(y.unique())
    cm = pd.DataFrame(confusion_matrix(y_test, pred, labels=labels), index=labels, columns=labels)
    print("Confusion matrix (rows = true species):")
    print(cm.to_string())

    joblib.dump(model, "model.joblib")
    metadata = {
        "model": best_name,
        "trained_on": date.today().isoformat(),
        "features": NUMERIC + CATEGORICAL,
        "species": labels,
        "islands": sorted(df["island"].unique()),
        "cv_accuracy": round(scores[best_name], 4),
        "test_accuracy": round(test_acc, 4),
        "n_train": len(X_train),
        "n_test": len(X_test),
        "sklearn_version": sklearn.__version__,
    }
    with open("model_metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    counts = y.value_counts()
    card = f"""# Model card: penguin species classifier

## What it does
Predicts the species of a penguin (Adelie, Chinstrap or Gentoo) from bill length and depth,
flipper length, body mass, island and sex.

## Data
Palmer Penguins: {len(df)} penguins measured on three islands in Antarctica, 2007-2009.
Species counts: {", ".join(f"{s} {n}" for s, n in counts.items())}.
Rows without any measurements were dropped; missing sex is treated as "unknown".

## Performance
- Model: {best_name}, chosen by 5-fold cross-validation ({scores[best_name]:.1%}).
- Accuracy on {len(X_test)} held-out penguins: **{test_acc:.1%}**.
- The most common baseline scores {scores["baseline (most common species)"]:.1%}.

## Limitations
- Trained on three islands only. Penguins from other places may be measured or behave differently.
- Chinstrap penguins are the smallest group, so their predictions are the least certain.
- Island is a strong clue in this data (Gentoo appear only on Biscoe), which may not hold elsewhere.

## Intended use
Learning and demonstration. Not for scientific decisions without expert review.
"""
    with open("MODEL_CARD.md", "w", encoding="utf-8") as f:
        f.write(card)
    print("\nSaved model.joblib, model_metadata.json and MODEL_CARD.md")


if __name__ == "__main__":
    main()`], ["app.py", R`# app.py
# Penguin species predictor: a JSON API plus a small web page.
# Run: uvicorn app:app --reload   then open http://127.0.0.1:8000

import json
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field

HERE = Path(__file__).parent
state = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not (HERE / "model.joblib").exists():
        raise RuntimeError("model.joblib not found. Run 'python train.py' first.")
    state["model"] = joblib.load(HERE / "model.joblib")
    state["meta"] = json.loads((HERE / "model_metadata.json").read_text(encoding="utf-8"))
    yield
    state.clear()


app = FastAPI(title="Penguin species predictor", version="1.0", lifespan=lifespan)


class Penguin(BaseModel):
    bill_length_mm: float = Field(gt=20, lt=80)
    bill_depth_mm: float = Field(gt=10, lt=30)
    flipper_length_mm: float = Field(gt=150, lt=260)
    body_mass_g: float = Field(gt=2000, lt=7000)
    island: Literal["Biscoe", "Dream", "Torgersen"]
    sex: Literal["Male", "Female"] | None = None


class Prediction(BaseModel):
    species: str
    confidence: float
    probabilities: dict[str, float]


@app.get("/health")
def health():
    meta = state["meta"]
    return {"status": "ok", "model": meta["model"], "test_accuracy": meta["test_accuracy"]}


@app.post("/predict", response_model=Prediction)
def predict(penguin: Penguin):
    row = pd.DataFrame([penguin.model_dump()])
    model = state["model"]
    proba = model.predict_proba(row)[0]
    probabilities = {species: round(float(p), 3) for species, p in zip(model.classes_, proba)}
    species = max(probabilities, key=probabilities.get)
    return Prediction(species=species, confidence=probabilities[species], probabilities=probabilities)


PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Penguin predictor</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 34rem; margin: 2rem auto; padding: 0 1rem; }
  label { display: block; margin-top: .8rem; }
  input, select, button { font-size: 1rem; padding: .4rem; width: 100%; box-sizing: border-box; }
  button { margin-top: 1rem; cursor: pointer; }
  #result { margin-top: 1.2rem; font-size: 1.2rem; }
</style>
</head>
<body>
<h1>Which penguin is it?</h1>
<form id="form">
  <label>Bill length (mm) <input name="bill_length_mm" type="number" step="0.1" value="45"></label>
  <label>Bill depth (mm) <input name="bill_depth_mm" type="number" step="0.1" value="15"></label>
  <label>Flipper length (mm) <input name="flipper_length_mm" type="number" value="215"></label>
  <label>Body mass (g) <input name="body_mass_g" type="number" value="5000"></label>
  <label>Island <select name="island"><option>Biscoe</option><option>Dream</option><option>Torgersen</option></select></label>
  <label>Sex <select name="sex"><option value="">Unknown</option><option>Female</option><option>Male</option></select></label>
  <button>Predict</button>
</form>
<div id="result"></div>
<script>
document.getElementById("form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  for (const key of ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]) {
    data[key] = Number(data[key]);
  }
  if (!data.sex) delete data.sex;
  const response = await fetch("/predict", {
    method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)
  });
  const result = document.getElementById("result");
  if (!response.ok) { result.textContent = "Please check the values: they look out of range."; return; }
  const body = await response.json();
  result.textContent = body.species + " (" + Math.round(body.confidence * 100) + "% confident)";
});
</script>
</body>
</html>"""


@app.get("/", response_class=HTMLResponse)
def home():
    return PAGE`], ["test_app.py", R`# test_app.py
# Run: pytest -v   (after python train.py)

import pytest
from fastapi.testclient import TestClient

from app import app

GENTOO = {"bill_length_mm": 47.5, "bill_depth_mm": 15.0, "flipper_length_mm": 217,
          "body_mass_g": 5100, "island": "Biscoe", "sex": "Male"}
ADELIE = {"bill_length_mm": 38.8, "bill_depth_mm": 18.3, "flipper_length_mm": 190,
          "body_mass_g": 3700, "island": "Torgersen", "sex": "Female"}
CHINSTRAP = {"bill_length_mm": 49.0, "bill_depth_mm": 18.5, "flipper_length_mm": 196,
             "body_mass_g": 3750, "island": "Dream", "sex": "Female"}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_health(client):
    assert client.get("/health").json()["status"] == "ok"


def test_home_page_has_a_form(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "<form" in r.text


@pytest.mark.parametrize("penguin, species", [(GENTOO, "Gentoo"), (ADELIE, "Adelie"), (CHINSTRAP, "Chinstrap")])
def test_typical_penguins(client, penguin, species):
    body = client.post("/predict", json=penguin).json()
    assert body["species"] == species
    assert body["confidence"] > 0.6


def test_probabilities_add_up_to_one(client):
    probs = client.post("/predict", json=GENTOO).json()["probabilities"]
    assert abs(sum(probs.values()) - 1) < 0.01


def test_sex_is_optional(client):
    penguin = {k: v for k, v in ADELIE.items() if k != "sex"}
    assert client.post("/predict", json=penguin).status_code == 200


def test_rejects_impossible_values(client):
    assert client.post("/predict", json={**GENTOO, "body_mass_g": 50}).status_code == 422
    assert client.post("/predict", json={**GENTOO, "island": "Mars"}).status_code == 422`], ["README.md", R`# Penguin species predictor

Predicts a penguin's species from its measurements, served through a small web app.
<!-- Add a screenshot of the web page here: ![screenshot](screenshot.png) -->

## Results

| Model | Cross-validated accuracy | Test accuracy |
|---|---|---|
| Most common species (baseline) | fill in | |
| Logistic regression | fill in | |
| Random forest | fill in | fill in |

See MODEL_CARD.md for the data, limitations and intended use.

## Run it

    pip install -r requirements.txt
    python train.py            # trains and saves the model
    pytest -v                  # 8 tests
    uvicorn app:app --reload   # then open http://127.0.0.1:8000

API docs are at http://127.0.0.1:8000/docs.

## How it works

1. Data: Palmer Penguins (344 penguins, 3 species, 3 islands).
2. Preprocessing: median imputation and scaling for measurements, one-hot encoding for island and sex.
3. Model selection: 5-fold cross-validation against a baseline.
4. Serving: FastAPI with input validation and a small HTML form.

## What I learned
<!-- Two or three honest sentences: what was hard, what surprised you. -->

## Next steps
<!-- For example: deploy it, add a chart of the decision boundary, try more data. -->`]],
    explain: [
      ["best_name = max(scores, key=scores.get)", "The model is chosen by cross-validation on the training set only. The test set is used once, afterwards, to report the final score."],
      ["SimpleImputer(strategy=\"constant\", fill_value=\"unknown\")", "A missing sex becomes its own category instead of a guess, so the model can still use the other features."],
      ["card = f\"\"\"# Model card ...\"\"\"", "The model card is generated from the real numbers on every training run, so it can never go out of date."],
      ["sex: Literal[\"Male\", \"Female\"] | None = None", "Optional in the API too, matching how the model was trained."],
      ["probabilities = {species: ... for species, p in zip(model.classes_, proba)}", "<code>classes_</code> holds the species names in the same order as the probability columns."],
      ["fetch(\"/predict\", {method: \"POST\", ...})", "The web page is just another client of your API: it sends the form as JSON and shows the answer."]
    ],
    stretch: ["Replace penguins with your own dataset and problem: this is the real capstone.", "Deploy the app to Render or Hugging Face Spaces and put the link at the top of your README.", "Add a chart of the decision boundary (bill length against flipper length) to the README.", "Show the model's probabilities as bars on the web page."]
  },
  tests: ["<code>python train.py</code>, then <code>pytest -v</code>: 8 tests should pass.", "Open the web page, enter a penguin and check the answer against <code>MODEL_CARD.md</code>.", "Clone your finished repository into a new folder, follow only your README, and make sure everything works.", "Ask a friend to read your README for one minute, then tell you what the project does."]
};

})(window.LESSONS);
