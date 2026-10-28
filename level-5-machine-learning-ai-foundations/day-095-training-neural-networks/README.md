# Day 95: Training neural networks

**Level 5, Machine Learning & AI Foundations.** Project: **MNIST digit classifier**

Time to train a real neural network on a famous dataset: MNIST, 70,000 handwritten digits. You'll use the full PyTorch toolkit (datasets, data loaders, a convolutional network, training and evaluation loops) and reach about 99% accuracy.

## Lesson

### Datasets and transforms

`torchvision` (installed with `pip install torchvision`) provides famous datasets and image tools. `datasets.MNIST(root="data", train=True, download=True, transform=...)` downloads 60,000 training and 10,000 test images of 28×28 pixels. A **transform** prepares each image: `ToTensor()` turns pixels into numbers between 0 and 1, and `Normalize` centres them.


### Convolutional layers

A fully connected layer treats an image as a flat list and ignores which pixels are neighbours. A **convolutional** layer (`nn.Conv2d`) slides small filters (say 3×3) across the image, so the same filter detects an edge or curve wherever it appears. **Pooling** (`nn.MaxPool2d(2)`) halves the size, keeping the strongest signals. Stacking them learns edges, then strokes, then whole digit shapes.


### Classification with many classes

For 10 classes the final layer outputs 10 numbers called **logits**, one score per digit. `nn.CrossEntropyLoss` applies softmax (turning scores into probabilities that add up to 1) and the log loss in one step. The prediction is the class with the highest score: `logits.argmax(dim=1)`.


### train() and eval() modes

Some layers behave differently while training. `nn.Dropout` randomly switches off neurons during training to fight overfitting, but must be off when predicting. Call `model.train()` before training and `model.eval()` before evaluating, and evaluate inside `torch.no_grad()`.


### Watching training

Record the training loss and the test accuracy after every **epoch** (one full pass over the training data) and plot them. If training loss keeps falling while test accuracy drops, you're overfitting. Save the model's `state_dict` when you're happy with it.


## Exercises

1. Load the MNIST training set and print the shape of the first image and its label.

<details><summary>Solution</summary>

```python
from torchvision import datasets, transforms
train = datasets.MNIST("data", train=True, download=True, transform=transforms.ToTensor())
image, label = train[0]
print(image.shape, label)   # torch.Size([1, 28, 28]) 5
```

</details>

2. Apply softmax to the logits `[2.0, 1.0, 0.1]`. Which class wins, and with what probability?

<details><summary>Solution</summary>

```python
import torch
print(torch.softmax(torch.tensor([2.0, 1.0, 0.1]), dim=0))   # class 0, about 0.66
```

</details>

3. An image of shape (1, 28, 28) goes through `Conv2d(1, 16, 3, padding=1)` then `MaxPool2d(2)`. What's the output shape?

<details><summary>Solution</summary>

```python
# Conv with padding=1 keeps 28x28 and makes 16 channels: (16, 28, 28)
# Pooling halves it: (16, 14, 14)
```

</details>

## Project: MNIST digit classifier

Train a small convolutional network to read handwritten digits. The script downloads MNIST (about 12 MB, first run only), trains for a few epochs while recording loss and accuracy, reports per-digit accuracy and the most common confusions, saves a chart of training progress and a gallery of mistakes, and saves the model. It takes a few minutes on a laptop CPU and seconds on a GPU.

Files in this folder: `day95_mnist.py`.

### Key lines explained

- `transforms.Normalize((0.1307,), (0.3081,))`: Centres the pixel values using MNIST's known mean and standard deviation, the image version of standard scaling.
- `class DigitNet(nn.Module):`: Every PyTorch model is a class: layers are created in `__init__` and used in `forward`. Calling `model(images)` runs `forward`.
- `nn.Linear(32 * 7 * 7, 128)`: After two rounds of pooling, 28×28 has become 7×7 with 32 channels; `Flatten` turns that into 1,568 numbers for the dense layers.
- `@torch.no_grad()`: Used as a decorator, it switches off gradient tracking for the whole evaluation function. Faster and uses less memory.
- `model(images.to(device)).argmax(dim=1)`: For each image, the position of the highest of the 10 scores is the predicted digit.
- `Counter(zip(targets[wrong].tolist(), preds[wrong].tolist()))`: Counts each (true, predicted) pair among the mistakes, revealing which digits get mixed up.

### Stretch goals

- Replace the network with a plain `nn.Sequential(nn.Flatten(), nn.Linear(784, 128), nn.ReLU(), nn.Linear(128, 10))`. How much accuracy do the convolutions add?
- Draw your own digit in an image editor, resize it to 28×28, and classify it with the saved model.
- Try `datasets.FashionMNIST`: the same code classifies clothing.

## Test it

- [ ] Test accuracy should be about 98% after the first epoch and close to 99% after the third.
- [ ] Check that `data/MNIST` was created and isn't downloaded again on the second run.
- [ ] Look at `mnist_mistakes.png`: many mistakes are genuinely ambiguous handwriting.
- [ ] Add `data/` and `*.pt` to your `.gitignore` before publishing: don't commit datasets or large model files.
