# day58_movies.py
# Explores a movie database with SQL.

import sqlite3
from pathlib import Path

DB_FILE = Path(__file__).parent / "movies.db"

SCHEMA = """
CREATE TABLE IF NOT EXISTS directors (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    country TEXT
);
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER,
    genre TEXT,
    director_id INTEGER REFERENCES directors(id)
);
CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(id),
    reviewer TEXT,
    stars INTEGER CHECK (stars BETWEEN 1 AND 5)
);
"""

DIRECTORS = [("Christopher Nolan", "UK"), ("Hayao Miyazaki", "Japan"),
             ("Greta Gerwig", "USA"), ("Bong Joon-ho", "South Korea")]
MOVIES = [("Inception", 2010, "sci-fi", 1), ("Interstellar", 2014, "sci-fi", 1),
          ("Oppenheimer", 2023, "drama", 1), ("Spirited Away", 2001, "animation", 2),
          ("My Neighbor Totoro", 1988, "animation", 2), ("Little Women", 2019, "drama", 3),
          ("Barbie", 2023, "comedy", 3), ("Parasite", 2019, "thriller", 4)]
RATINGS = [(1, "amina", 5), (1, "omar", 4), (2, "amina", 5), (2, "sara", 4), (3, "omar", 4),
           (4, "sara", 5), (4, "amina", 5), (5, "omar", 4), (6, "sara", 4), (7, "omar", 3),
           (7, "amina", 4), (8, "sara", 5), (8, "omar", 5), (8, "amina", 5)]


def connect():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row          # access columns by name
    conn.executescript(SCHEMA)
    if conn.execute("SELECT COUNT(*) FROM movies").fetchone()[0] == 0:
        with conn:                           # a transaction: all or nothing
            conn.executemany("INSERT INTO directors (name, country) VALUES (?, ?)", DIRECTORS)
            conn.executemany("INSERT INTO movies (title, year, genre, director_id) VALUES (?, ?, ?, ?)", MOVIES)
            conn.executemany("INSERT INTO ratings (movie_id, reviewer, stars) VALUES (?, ?, ?)", RATINGS)
    return conn


QUERIES = {
    "1": ("Top rated movies", """
        SELECT m.title, d.name AS director, ROUND(AVG(r.stars), 2) AS avg_stars, COUNT(r.id) AS votes
        FROM movies m
        JOIN directors d ON m.director_id = d.id
        LEFT JOIN ratings r ON r.movie_id = m.id
        GROUP BY m.id
        ORDER BY avg_stars DESC, votes DESC
    """),
    "2": ("Movies per genre", """
        SELECT genre, COUNT(*) AS movies, MIN(year) AS earliest, MAX(year) AS latest
        FROM movies GROUP BY genre ORDER BY movies DESC
    """),
    "3": ("Directors' averages", """
        SELECT d.name, d.country, COUNT(DISTINCT m.id) AS movies, ROUND(AVG(r.stars), 2) AS avg_stars
        FROM directors d
        JOIN movies m ON m.director_id = d.id
        JOIN ratings r ON r.movie_id = m.id
        GROUP BY d.id ORDER BY avg_stars DESC
    """),
}


def print_rows(rows):
    if not rows:
        print("No results.")
        return
    columns = rows[0].keys()
    print("  ".join(f"{c:<20}" for c in columns))
    for row in rows:
        print("  ".join(f"{str(row[c]):<20}" for c in columns))


def main():
    conn = connect()
    while True:
        print()
        for key, (label, _) in QUERIES.items():
            print(f"{key}) {label}")
        print("4) Search titles  5) Movies from a year range  q) Quit")
        choice = input("Choose: ").strip().lower()

        if choice in QUERIES:
            print_rows(conn.execute(QUERIES[choice][1]).fetchall())
        elif choice == "4":
            text = input("Title contains: ")
            print_rows(conn.execute(
                "SELECT title, year, genre FROM movies WHERE title LIKE ? ORDER BY year",
                (f"%{text}%",)).fetchall())
        elif choice == "5":
            try:
                start, end = int(input("From year: ")), int(input("To year: "))
            except ValueError:
                print("Years must be numbers.")
                continue
            print_rows(conn.execute(
                "SELECT title, year FROM movies WHERE year BETWEEN ? AND ? ORDER BY year",
                (start, end)).fetchall())
        elif choice == "q":
            break
    conn.close()


if __name__ == "__main__":
    main()
