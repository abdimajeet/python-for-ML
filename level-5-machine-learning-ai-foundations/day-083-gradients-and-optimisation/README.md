# Day 83: Gradients and optimisation

**Level 5, Machine Learning & AI Foundations.** Project: **Gradient descent from scratch**

Almost every ML model learns the same way: start with a guess, measure how wrong it is, and nudge the guess in the direction that reduces the error. That direction comes from the derivative. Today you'll build gradient descent from scratch.

## Lesson

### A derivative is a slope

The derivative of a function at a point tells you how steeply it rises there. If `f(x) = x²`, the slope at `x = 3` is 6: nudge `x` up a little and `f` rises about six times as much. You can estimate any slope numerically by trying a tiny step on each side.

```python
def slope(f, x, h=1e-5):
    return (f(x + h) - f(x - h)) / (2 * h)

print(round(slope(lambda x: x ** 2, 3), 4))
```

Output:

```text
6.0
```

### Walking downhill

To find the lowest point of a function, repeat: `x = x - learning_rate * slope(x)`. A positive slope means "uphill to the right", so we step left, and vice versa. Near the bottom the slope shrinks, so the steps shrink too.

```python
f = lambda x: (x - 3) ** 2 + 2
x = 0.0
for step in range(25):
    x -= 0.1 * slope(f, x)
print(round(x, 3), round(f(x), 3))
```

Output:

```text
2.989 2.0
```

### The learning rate

The **learning rate** sets the step size. Too small and training crawls; too large and you overshoot the bottom and may bounce further away each step (**diverge**). Choosing it is one of the first things you tune in any model.


### Gradients: slopes in many directions

With several parameters, the **gradient** is a vector of slopes, one per parameter (each found while holding the others fixed, called a **partial derivative**). It points straight uphill, so subtracting it moves downhill in all directions at once. A model with a million weights works exactly like this, just with a longer vector.


### Minima, local and global

Gradient descent stops wherever the slope is zero. For bowl-shaped functions (like the loss of linear regression) that's the single global minimum. Bumpy functions can trap it in a **local minimum**, which is why the starting point and learning rate matter in neural networks.


## Exercises

1. Estimate the slope of `f(x) = x³` at `x = 2`. The exact answer is 12.

<details><summary>Solution</summary>

```python
print(slope(lambda x: x ** 3, 2))
```

</details>

2. Minimise `f(x) = (x + 4)² ` starting from `x = 10`. Try learning rates 0.01, 0.1 and 1.1 for 50 steps. What happens with each?

<details><summary>Solution</summary>

```python
for lr in (0.01, 0.1, 1.1):
    x = 10.0
    for _ in range(50):
        x -= lr * 2 * (x + 4)
    print(lr, x)
# 0.01 is still far away, 0.1 reaches -4, 1.1 explodes
```

</details>

3. Write the gradient of `f(x, y) = x² + 3y²` as a function that returns a NumPy array.

<details><summary>Solution</summary>

```python
def grad(p):
    x, y = p
    return np.array([2 * x, 6 * y])
```

</details>

## Project: Gradient descent from scratch

Write a reusable `gradient_descent` function that works for any number of parameters, using numerical gradients. Use it on a 1-D curve, compare learning rates, minimise a 2-D "valley" function, show how momentum helps, and save a plot of the paths it takes.

Files in this folder: `day83_gradient_descent.py`.

### Key lines explained

- `step[i] = h`: Nudges one parameter at a time while the others stay fixed. That is exactly what a partial derivative means.
- `velocity = momentum * velocity - learning_rate * grad`: With `momentum=0` this is plain gradient descent. With momentum, each step remembers part of the previous one, like a ball rolling downhill, so it speeds up along the valley floor.
- `if not np.all(np.isfinite(params))`: A learning rate that is too large makes the numbers explode to infinity. Detecting it gives a clear message instead of nonsense.
- `if np.linalg.norm(velocity) < tol`: Stop early once the steps are tiny: we've arrived.
- `np.meshgrid(...)`: Builds a grid of (x, y) points so we can compute the function everywhere and draw its contour lines, like a hiking map.

### Stretch goals

- Add a function with two minima, such as `x**4 - 3*x**2 + x`, and show that different starting points end in different places.
- Replace the numerical gradient for `valley` with the exact one (`[0.2*(x-4), 6*(y+1)]`) and compare speed.
- Animate the path with `matplotlib.animation.FuncAnimation`.

## Test it

- [ ] With lr=0.1 the bowl should end very close to x = 3.
- [ ] With lr=1.05 it should diverge. Explain why from the update rule.
- [ ] Momentum should reach the valley's minimum in fewer steps than plain descent.
- [ ] Open `gradient_paths.png`: does the plain path zig-zag across the valley?
