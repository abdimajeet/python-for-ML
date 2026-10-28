# Day 93: Neural network from scratch

**Level 5, Machine Learning & AI Foundations.** Project: **Tiny network that learns XOR**

Neural networks power image recognition, translation and chatbots. Underneath, they're stacks of the logistic-regression-like units you already know, trained with gradient descent. Today you'll build one in NumPy and teach it XOR, a problem no straight line can solve.

## Lesson

### A neuron

A **neuron** computes a weighted sum of its inputs plus a bias, then applies an **activation function**: `a = activation(x @ w + b)`. With a sigmoid activation, one neuron **is** logistic regression. Its decision boundary is a straight line, so it can't learn XOR (output 1 when exactly one input is 1).


### Layers and activations

Put several neurons side by side and you have a **layer**; feed one layer's outputs into the next and you have a network. The **hidden layer** learns new features from the inputs, and the output layer combines them. The activation must be non-linear, or stacked layers would collapse into one linear model. Common choices: `tanh`, `sigmoid`, and `ReLU` (`max(0, z)`).

```python
import numpy as np

z = np.array([-2.0, 0.0, 2.0])
print(np.tanh(z).round(3), np.maximum(0, z))
```

Output:

```text
[-0.964  0.     0.964] [0. 0. 2.]
```

### The forward pass

Prediction is called the **forward pass**: `h = tanh(X @ W1 + b1)`, then `out = sigmoid(h @ W2 + b2)`. With 2 inputs, 4 hidden neurons and 1 output, `W1` is 2×4 and `W2` is 4×1. Weights start as small random numbers; if they all started equal, every hidden neuron would learn the same thing.


### Backpropagation

To train, we need the gradient of the loss with respect to every weight. **Backpropagation** is the chain rule applied layer by layer from the output backwards: work out how the loss changes with the output, then how the output changes with the hidden layer, then with the first weights. Each layer passes an error signal back to the one before it. Libraries like PyTorch do this automatically, but doing it once by hand removes the mystery.


### Checking your gradients

Hand-written backprop is easy to get subtly wrong. A **gradient check** compares one of your gradients with the numerical slope from Day 83 (nudge one weight, measure the loss). If they agree to several decimal places, your backprop is right.


## Exercises

1. Write `relu` and its derivative (1 where z > 0, otherwise 0) using NumPy.

<details><summary>Solution</summary>

```python
def relu(z):
    return np.maximum(0, z)

def relu_grad(z):
    return (z > 0).astype(float)
```

</details>

2. If the input has 3 features, the hidden layer has 5 neurons and there are 2 outputs, what shapes are W1, b1, W2 and b2?

<details><summary>Solution</summary>

```python
# W1: (3, 5)  b1: (5,)  W2: (5, 2)  b2: (2,)
```

</details>

3. The derivative of `tanh(z)` is `1 - tanh(z)**2`. Check it numerically at z = 0.5.

<details><summary>Solution</summary>

```python
z, h = 0.5, 1e-6
print((np.tanh(z + h) - np.tanh(z - h)) / (2 * h), 1 - np.tanh(z) ** 2)
```

</details>

## Project: Tiny network that learns XOR

Build a two-layer neural network from scratch in NumPy: forward pass, binary cross-entropy loss, backpropagation and gradient descent. Show that logistic regression fails on XOR while the network succeeds, verify the backprop with a gradient check, and print what the network has learned across the input space.

Files in this folder: `day93_xor_network.py`.

### Key lines explained

- `self.h = np.tanh(X @ self.W1 + self.b1)`: The hidden layer: four neurons, each a weighted sum of the inputs passed through tanh.
- `d_out = (self.out - target) / n`: When a sigmoid output is paired with cross-entropy loss, the derivative simplifies beautifully to prediction minus target.
- `d_h = d_out @ self.W2.T * (1 - self.h ** 2)`: The error signal flows back through W2, then through tanh (whose derivative is 1 - tanh²). This line is backpropagation.
- `setattr(self, name, getattr(self, name) - lr * g)`: Gradient descent on every parameter by name, so the loop doesn't repeat itself four times.
- `for idx in np.ndindex(param.shape):`: Visits every single weight. Nudging each one and measuring the loss gives a numerical gradient to compare with backprop.

### Stretch goals

- Change the hidden layer to 2 neurons, then 1. Does it still learn? Try a few seeds.
- Replace tanh with ReLU (and its derivative) and compare training speed.
- Train the network on the `make_moons` dataset from scikit-learn and print its accuracy.

## Test it

- [ ] The single neuron should output about 0.5 for every input.
- [ ] The gradient check should print a number around 1e-10 or smaller.
- [ ] The loss should fall steadily and the final predictions should be 0 1 1 0.
- [ ] Break the backprop on purpose (drop `(1 - self.h ** 2)`) and watch the gradient check catch it.
