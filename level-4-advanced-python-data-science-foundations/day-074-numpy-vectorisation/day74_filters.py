# day74_filters.py
# Image filters written as NumPy array operations.

import sys
from pathlib import Path

import numpy as np
from PIL import Image

OUT = Path(__file__).parent / "filtered"


def test_image(h=240, w=320):
    """A colourful generated image: gradients, a circle and stripes."""
    y, x = np.mgrid[0:h, 0:w]
    img = np.zeros((h, w, 3))
    img[..., 0] = x / w * 255                     # red increases to the right
    img[..., 1] = y / h * 255                     # green increases downwards
    img[..., 2] = 128 + 127 * np.sin(x / 15)      # blue stripes
    circle = (x - w * 0.6) ** 2 + (y - h * 0.5) ** 2 < (h * 0.3) ** 2
    img[circle] = [230, 40, 40]                   # a red circle
    return img.astype(np.uint8)


def greyscale(img):
    weights = np.array([0.299, 0.587, 0.114])    # how bright each channel looks to us
    grey = img[..., :3] @ weights                # (h, w, 3) @ (3,) -> (h, w)
    return np.stack([grey] * 3, axis=-1).astype(np.uint8)


def invert(img):
    return 255 - img


def brightness(img, amount=60):
    return np.clip(img.astype(int) + amount, 0, 255).astype(np.uint8)


def sepia(img):
    matrix = np.array([[0.393, 0.769, 0.189],
                       [0.349, 0.686, 0.168],
                       [0.272, 0.534, 0.131]])
    return np.clip(img[..., :3] @ matrix.T, 0, 255).astype(np.uint8)


def box_blur(img, radius=4):
    """Average each pixel with its neighbours, using shifted copies instead of loops over pixels."""
    padded = np.pad(img.astype(float), ((radius, radius), (radius, radius), (0, 0)), mode="edge")
    h, w = img.shape[:2]
    total = np.zeros(img.shape, dtype=float)
    size = 2 * radius + 1
    for dy in range(size):
        for dx in range(size):
            total += padded[dy:dy + h, dx:dx + w]
    return (total / size ** 2).astype(np.uint8)


def edges(img, threshold=15):
    grey = greyscale(img)[..., 0].astype(float)
    gx = np.zeros_like(grey)
    gy = np.zeros_like(grey)
    gx[:, 1:-1] = grey[:, 2:] - grey[:, :-2]      # horizontal change
    gy[1:-1, :] = grey[2:, :] - grey[:-2, :]      # vertical change
    magnitude = np.hypot(gx, gy)
    out = np.where(magnitude > threshold, 255, 0).astype(np.uint8)
    return np.stack([out] * 3, axis=-1)


def colour_splash(img):
    """Keep strongly red pixels in colour, make everything else grey."""
    r, g, b = (img[..., c].astype(int) for c in range(3))
    is_red = (r > 150) & (r > g + 60) & (r > b + 60)
    return np.where(is_red[..., None], img[..., :3], greyscale(img))


FILTERS = {"greyscale": greyscale, "invert": invert, "bright": brightness, "sepia": sepia,
           "blur": box_blur, "edges": edges, "splash": colour_splash}


def main():
    if len(sys.argv) > 1:
        img = np.asarray(Image.open(sys.argv[1]).convert("RGB"))
    else:
        img = test_image()
    print(f"Image: shape {img.shape}, dtype {img.dtype}, mean brightness {img.mean():.0f}")

    OUT.mkdir(exist_ok=True)
    tiles = [img]
    for name, func in FILTERS.items():
        result = func(img)
        Image.fromarray(result).save(OUT / f"{name}.png")
        tiles.append(result)
        print(f"  {name:<10} -> {OUT.name}/{name}.png")

    row1 = np.concatenate(tiles[:4], axis=1)
    row2 = np.concatenate(tiles[4:], axis=1)
    Image.fromarray(np.concatenate([row1, row2], axis=0)).save(OUT / "all.png")
    print(f"Contact sheet saved to {OUT.name}/all.png")


if __name__ == "__main__":
    main()
