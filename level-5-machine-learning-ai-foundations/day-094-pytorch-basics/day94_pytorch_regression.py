# day94_pytorch_regression.py
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
          f"(true rule gives [6.5, 5.0])")
