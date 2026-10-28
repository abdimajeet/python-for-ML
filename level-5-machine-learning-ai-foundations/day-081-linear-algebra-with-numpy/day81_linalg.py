# day81_linalg.py
# Vectors and matrices by hand, then with NumPy, then used for something real.

import numpy as np


# ---------- 1. By hand ----------
def dot(u: list[float], v: list[float]) -> float:
    if len(u) != len(v):
        raise ValueError("vectors must be the same length")
    return sum(a * b for a, b in zip(u, v))


def matmul(A: list[list[float]], B: list[list[float]]) -> list[list[float]]:
    if len(A[0]) != len(B):
        raise ValueError(f"can't multiply {len(A)}x{len(A[0])} by {len(B)}x{len(B[0])}")
    columns = list(zip(*B))                       # B's columns
    return [[dot(row, col) for col in columns] for row in A]


# ---------- 2. Similarity and recommendations ----------
MOVIES = ["Inception", "Interstellar", "The Notebook", "Titanic", "Toy Story", "Up"]
# Ratings from 1 to 5; 0 means "not seen".
RATINGS = {
    "Amina": [5, 5, 1, 2, 3, 4],
    "Omar":  [4, 5, 0, 1, 2, 3],
    "Sara":  [1, 1, 5, 5, 3, 0],
    "Yusuf": [2, 0, 4, 5, 4, 3],
    "Hodan": [3, 3, 3, 3, 5, 5],
}


def cosine(u: np.ndarray, v: np.ndarray) -> float:
    return float(u @ v / (np.linalg.norm(u) * np.linalg.norm(v)))


def recommend(user: str) -> tuple[str, str | None]:
    """Find the most similar other user, then suggest a film they liked that the user hasn't seen."""
    me = np.array(RATINGS[user])
    others = {name: cosine(me, np.array(r)) for name, r in RATINGS.items() if name != user}
    twin = max(others, key=others.get)
    twin_ratings = np.array(RATINGS[twin])
    unseen = [i for i in range(len(MOVIES)) if me[i] == 0]
    if not unseen:
        return twin, None
    best = max(unseen, key=lambda i: twin_ratings[i])
    return twin, MOVIES[best]


# ---------- 3. Solving equations ----------
def solve_prices() -> np.ndarray:
    """3 coffees + 2 cakes = 13, 1 coffee + 4 cakes = 11, 2 coffees + 1 cake + 1 juice = 10."""
    A = np.array([[3, 2, 0],
                  [1, 4, 0],
                  [2, 1, 1]], dtype=float)
    b = np.array([13, 11, 10], dtype=float)
    return np.linalg.solve(A, b)


# ---------- 4. Matrices as transformations ----------
def rotation(degrees: float) -> np.ndarray:
    t = np.radians(degrees)
    return np.array([[np.cos(t), -np.sin(t)],
                     [np.sin(t),  np.cos(t)]])


def main() -> None:
    np.set_printoptions(suppress=True, precision=2)

    print("1. By hand vs NumPy")
    u, v = [1, 2, 3], [4, 5, 6]
    print(f"   dot: {dot(u, v)} vs {np.dot(u, v)}")
    A = [[1, 2], [3, 4], [5, 6]]
    B = [[7, 8, 9], [10, 11, 12]]
    print(f"   matmul by hand: {matmul(A, B)}")
    print(f"   same as NumPy:  {np.array_equal(matmul(A, B), np.array(A) @ np.array(B))}")

    print("\n2. Who is most like whom?")
    names = list(RATINGS)
    M = np.array([RATINGS[n] for n in names], dtype=float)
    unit = M / np.linalg.norm(M, axis=1, keepdims=True)    # every row has length 1
    similarity = unit @ unit.T                              # all pairs in one multiplication
    print("         " + "".join(f"{n:>7}" for n in names))
    for name, row in zip(names, similarity):
        print(f"   {name:<6}" + "".join(f"{s:7.2f}" for s in row))
    for user in ("Omar", "Sara"):
        twin, film = recommend(user)
        print(f"   {user} is most like {twin}; suggestion: {film}")

    print("\n3. Cafe prices from three receipts")
    coffee, cake, juice = solve_prices()
    print(f"   coffee {coffee:.2f}, cake {cake:.2f}, juice {juice:.2f}")

    print("\n4. Rotating a square by 90 degrees")
    square = np.array([[0, 0], [1, 0], [1, 1], [0, 1]], dtype=float)
    print("   ", (square @ rotation(90).T).round(2).tolist())


if __name__ == "__main__":
    main()
