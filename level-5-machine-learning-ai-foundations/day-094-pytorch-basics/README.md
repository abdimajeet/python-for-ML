# Day 94: PyTorch basics

**Level 5, Machine Learning & AI Foundations.** Project: **Linear regression in PyTorch**

PyTorch is one of the main libraries for deep learning. It gives you NumPy-like arrays that can run on a GPU and, crucially, computes gradients automatically. Today you'll redo linear regression in PyTorch to learn its building blocks before training real networks tomorrow.

## Lesson

### Installing and tensors

Install with `pip install torch` (pytorch.org shows the right command for your computer and GPU). A **tensor** is PyTorch's array: `torch.tensor([[1., 2.], [3., 4.]])`. It has a `shape`, a `dtype` (usually `torch.float32`) and supports the same maths as NumPy, including `@`. Convert with `torch.from_numpy(arr)` and `tensor.numpy()`.

```python
import torch

a = torch.tensor([[1., 2.], [3., 4.]])
print(a.shape, a.dtype)
print(a @ a, a.mean().item())
```

Output:

```text
torch.Size([2, 2]) torch.float32
tensor([[ 7., 10.],
        [15., 22.]]) 2.5
```

### Autograd

Create a tensor with `requires_grad=True` and PyTorch records every operation on it. Call `.backward()` on a final single number (like a loss) and it fills `.grad` with the gradient: the backpropagation you wrote by hand yesterday, done for you.

```python
x = torch.tensor(3.0, requires_grad=True)
y = x ** 2 + 2 * x
y.backward()
print(x.grad)   # dy/dx = 2x + 2
```

Output:

```text
tensor(8.)
```

### Modules, loss functions and optimisers

`torch.nn` has ready-made layers: `nn.Linear(3, 1)` holds a weight matrix and bias. Loss functions like `nn.MSELoss()` compare predictions with targets. An optimiser such as `torch.optim.SGD(model.parameters(), lr=0.1)` applies the update. You'll also meet `Adam`, which adapts the step size for each parameter and is a common default.


### The training loop

Every PyTorch training loop has the same five lines: `pred = model(X)`, `loss = loss_fn(pred, y)`, `optimizer.zero_grad()` (clear old gradients, because PyTorch adds them up), `loss.backward()`, `optimizer.step()`. When you're only predicting, wrap the code in `with torch.no_grad():` to skip the bookkeeping.


### Devices

Tensors live on a **device**: `"cpu"`, `"cuda"` (NVIDIA GPU) or `"mps"` (Apple silicon). Move models and data with `.to(device)`; everything in one calculation must be on the same device. Small models like today's run fine on a CPU.


## Exercises

1. Create a 3×3 tensor of random numbers with `torch.rand` and print its largest value as a Python number.

<details><summary>Solution</summary>

```python
t = torch.rand(3, 3)
print(t.max().item())
```

</details>

2. Use autograd to find the derivative of `f(x) = x³ - 4x` at x = 2.

<details><summary>Solution</summary>

```python
x = torch.tensor(2.0, requires_grad=True)
(x ** 3 - 4 * x).backward()
print(x.grad)   # 3x² - 4 = 8
```

</details>

3. Print which device your computer can use.

<details><summary>Solution</summary>

```python
device = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
print(device)
```

</details>

## Project: Linear regression in PyTorch

Generate data from a known rule, then learn it three ways: with raw tensors and autograd (you write the update), with `nn.Linear` and an optimiser (the standard way), and with mini-batches from a `DataLoader`. Compare the learned parameters with the truth, then save and reload the model.

Files in this folder: `day94_pytorch_regression.py`.

### Key lines explained

- `torch.manual_seed(94)`: Makes the random data and the starting weights identical every run.
- `loss.backward()`: Autograd walks back through every operation that produced `loss` and stores the gradient in each tensor's `.grad`.
- `with torch.no_grad():`: The update step shouldn't itself become part of the graph we differentiate, so we switch tracking off for it.
- `optimizer.zero_grad()`: PyTorch adds new gradients to old ones. Forgetting to clear them is one of the most common PyTorch bugs.
- `DataLoader(TensorDataset(X, y), batch_size=32, shuffle=True)`: Feeds the data in shuffled mini-batches. Each update is cheaper and noisier, which is how all large models are trained.
- `torch.save(model.state_dict(), ...)`: Saves just the learned numbers. To reload, build the same architecture and load the numbers into it.

### Stretch goals

- Add a hidden layer with `nn.Sequential(nn.Linear(3, 16), nn.ReLU(), nn.Linear(16, 1))` and fit `y = x1 * x2`, which a straight line can't.
- Plot the loss per epoch for SGD and Adam on the same chart.
- Run with a learning rate of 1.5 in part 2 and explain what happens.

## Test it

- [ ] All three methods should learn weights close to [3, -2, 0.5] and a bias close to 5.
- [ ] The loss should level off around 0.09 (the noise is 0.3, and 0.3² = 0.09).
- [ ] Delete `optimizer.zero_grad()` in part 2 and describe what happens.
- [ ] Check that `linear_model.pt` was created and the reloaded predictions are close to [6.5, 5.0].
