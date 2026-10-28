# day83_gradient_descent.py
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
    main()
