# day93_xor_network.py
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
    main()
