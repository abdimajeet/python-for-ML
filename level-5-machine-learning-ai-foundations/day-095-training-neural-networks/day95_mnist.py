# day95_mnist.py
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
    main()
