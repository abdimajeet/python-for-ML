# day43_numbers.py
# Fraction and Vector classes built with special methods.

import math


class Fraction:
    def __init__(self, numerator, denominator=1):
        if denominator == 0:
            raise ZeroDivisionError("Denominator can't be zero")
        if denominator < 0:                      # keep the sign on top
            numerator, denominator = -numerator, -denominator
        common = math.gcd(numerator, denominator)
        self.num = numerator // common
        self.den = denominator // common

    def __repr__(self):
        return f"Fraction({self.num}, {self.den})"

    def __str__(self):
        return str(self.num) if self.den == 1 else f"{self.num}/{self.den}"

    def __add__(self, other):
        return Fraction(self.num * other.den + other.num * self.den, self.den * other.den)

    def __sub__(self, other):
        return Fraction(self.num * other.den - other.num * self.den, self.den * other.den)

    def __mul__(self, other):
        return Fraction(self.num * other.num, self.den * other.den)

    def __truediv__(self, other):
        return Fraction(self.num * other.den, self.den * other.num)

    def __eq__(self, other):
        if not isinstance(other, Fraction):
            return NotImplemented
        return self.num == other.num and self.den == other.den

    def __lt__(self, other):
        return self.num * other.den < other.num * self.den

    def __float__(self):
        return self.num / self.den


class Vector:
    def __init__(self, *components):
        self.components = list(components)

    def __repr__(self):
        return f"Vector{tuple(self.components)}"

    def __len__(self):
        return len(self.components)

    def __getitem__(self, index):
        return self.components[index]

    def _check(self, other):
        if len(self) != len(other):
            raise ValueError("Vectors must be the same length")

    def __add__(self, other):
        self._check(other)
        return Vector(*[a + b for a, b in zip(self, other)])

    def __sub__(self, other):
        self._check(other)
        return Vector(*[a - b for a, b in zip(self, other)])

    def __mul__(self, scalar):
        return Vector(*[a * scalar for a in self])

    __rmul__ = __mul__          # so 3 * v works as well as v * 3

    def dot(self, other):
        self._check(other)
        return sum(a * b for a, b in zip(self, other))

    def __abs__(self):
        return math.sqrt(self.dot(self))

    def __eq__(self, other):
        return isinstance(other, Vector) and self.components == other.components


def main():
    half, third = Fraction(1, 2), Fraction(1, 3)
    print(f"{half} + {third} = {half + third}")
    print(f"{half} - {third} = {half - third}")
    print(f"{half} * {third} = {half * third}")
    print(f"{half} / {third} = {half / third}")
    print("Sorted:", sorted([Fraction(3, 4), half, Fraction(2, 3), third]))
    print("6/8 == 3/4:", Fraction(6, 8) == Fraction(3, 4))
    print("As a float:", float(Fraction(7, 8)))

    v, w = Vector(3, 4), Vector(1, -2)
    print()
    print("v + w =", v + w)
    print("3 * v =", 3 * v)
    print("v · w =", v.dot(w))
    print("|v|   =", abs(v))
    print("v[0]  =", v[0], " len(v) =", len(v))


if __name__ == "__main__":
    main()
