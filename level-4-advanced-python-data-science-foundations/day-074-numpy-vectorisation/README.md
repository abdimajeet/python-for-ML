# Day 74: NumPy vectorisation

**Level 4, Advanced Python & Data Science Foundations.** Project: **Image filters on pixel arrays**

Vectorisation means replacing Python loops with whole-array operations that run in fast C code. Today you learn vectorisation, broadcasting and boolean masks, and use them to build image filters.

## Lesson

### Vectorised operations

Arithmetic, comparisons and maths functions (`np.sqrt`, `np.exp`, `np.log`) apply element by element to entire arrays. The loop still happens, but in optimised C code, often 50 to 100 times faster than a Python loop.

```python
import numpy as np, time

x = np.random.default_rng(0).random(1_000_000)

start = time.perf_counter()
slow = [v * v + 1 for v in x]
print("loop ", time.perf_counter() - start)

start = time.perf_counter()
fast = x * x + 1
print("numpy", time.perf_counter() - start)
```

### Broadcasting

When shapes differ, NumPy stretches the smaller array to match, without copying. Shapes are compared from the right: each dimension must be equal or 1. A (3, 4) array plus a (4,) row adds the row to every row; plus a (3, 1) column adds the column to every column.

```python
m = np.arange(12).reshape(3, 4)
print(m - m.mean(axis=0))          # (3,4) - (4,): centre each column
print(m / m.sum(axis=1, keepdims=True))   # (3,4) / (3,1): each row sums to 1
```

### Boolean masks and np.where

A comparison makes a boolean array; using it as an index selects matching elements, or assigns to them. `np.where(cond, a, b)` chooses element by element. Combine conditions with `&`, `|` and `~`, with parentheses around each one.

```python
temps = np.array([18, 25, 31, 22, 35])
print(temps[temps > 24])
print(np.where(temps > 30, "hot", "ok"))
temps[(temps > 20) & (temps < 30)] = 0
```

### Images are arrays

A colour image is a 3-D array of shape (height, width, 3): red, green and blue values from 0 to 255 for each pixel. Pillow (`pip install pillow`) loads images, and `np.asarray(img)` turns one into an array. Every filter is just array maths. This is also exactly how image data enters neural networks (Day 95).


## Exercises

1. Normalise an array to the range 0 to 1 with `(x - min) / (max - min)` in one line.

<details><summary>Solution</summary>

```python
x = np.array([3.0, 7.0, 1.0, 9.0])
print((x - x.min()) / (x.max() - x.min()))
```

</details>

2. Create a 10×10 multiplication table with broadcasting (no loops).

<details><summary>Solution</summary>

```python
n = np.arange(1, 11)
print(n[:, None] * n)      # (10,1) * (10,) -> (10,10)
```

</details>

3. Replace every negative value in an array with 0 using a mask, then using `np.where`.

<details><summary>Solution</summary>

```python
a = np.array([3, -1, 4, -5])
b = a.copy(); b[b < 0] = 0
c = np.where(a < 0, 0, a)
# also: np.maximum(a, 0) or np.clip(a, 0, None)
```

</details>

## Project: Image filters on pixel arrays

Build a set of photo filters using only NumPy array operations: greyscale, invert, brightness, sepia, blur, edge detection and a colour-splash effect. Use your own photo, or the program generates a test image. Results are saved side by side. Needs `pip install numpy pillow`.

Files in this folder: `day74_filters.py`.

### Key lines explained

- `y, x = np.mgrid[0:h, 0:w]`: Two arrays holding every pixel's row and column number, so formulas like a circle can be computed for all pixels at once.
- `img[..., :3] @ weights`: `@` is matrix multiplication. Multiplying each pixel's (R, G, B) by the weights and summing gives its brightness, for all pixels in one step.
- `img.astype(int) + amount`: uint8 values wrap around (250 + 10 becomes 4!), so we convert to int, add, clip to 0–255, and convert back.
- `padded[dy:dy + h, dx:dx + w]`: The blur adds shifted copies of the whole image. The double loop runs only (2r+1)² times, not once per pixel.
- `np.where(is_red[..., None], img, greyscale(img))`: `[..., None]` adds a dimension so the (h, w) mask broadcasts across the 3 colour channels.

### Stretch goals

- Add a pixelate filter: shrink by taking every 10th pixel with slicing, then enlarge with `np.repeat`.
- Run your filters on a photo of your own: `python day74_filters.py photo.jpg`.

## Test it

- [ ] Open `filtered/all.png` and check each filter looks right.
- [ ] Inverting twice must give back the original: `(invert(invert(img)) == img).all()`.
- [ ] Time `box_blur` and compare with a version that loops over every pixel (use a small image!).
