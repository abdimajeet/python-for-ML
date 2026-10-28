# Day 58: SQL fundamentals

**Level 3, Intermediate Python & Software Engineering.** Project: **Movie database explorer**

Databases store data safely and let you ask complex questions about it. Today you learn SQL, the language of relational databases, using SQLite, which is built into Python.

## Lesson

### Tables, rows and columns

A relational database stores data in **tables**, like spreadsheets with strict columns. Each row is a record. A **primary key** uniquely identifies each row. A **foreign key** in one table points to a row in another, which is how tables relate.


### SQLite in Python

SQLite keeps a whole database in a single file, and the `sqlite3` module ships with Python. Connect, run SQL with `execute`, and `commit` changes.

```python
import sqlite3

conn = sqlite3.connect("shop.db")
conn.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL
    )
""")
conn.execute("INSERT INTO products (name, price) VALUES (?, ?)", ("Tea", 4.5))
conn.commit()
```

### SELECT

`SELECT` asks questions. `WHERE` filters rows, `ORDER BY` sorts, `LIMIT` keeps the first few. `COUNT`, `SUM`, `AVG`, `MIN` and `MAX` summarise, and `GROUP BY` summarises per group.

```python
SELECT name, price FROM products WHERE price < 10 ORDER BY price DESC LIMIT 5;
SELECT category, COUNT(*), AVG(price) FROM products GROUP BY category;
```

### JOIN

`JOIN` combines rows from related tables using the keys. This is the core power of relational databases.

```python
SELECT movies.title, directors.name
FROM movies
JOIN directors ON movies.director_id = directors.id
WHERE directors.name = 'Christopher Nolan';
```

### Always use placeholders

Never put user input into SQL with f-strings. Someone could type SQL code and change your query: this is called **SQL injection**, one of the most common security bugs. Use `?` placeholders and pass values separately; sqlite3 handles them safely.

```python
# WRONG: f"SELECT * FROM users WHERE name = '{name}'"
rows = conn.execute("SELECT * FROM users WHERE name = ?", (name,)).fetchall()
```

## Exercises

1. Create a `students` table with id, name and score, insert three rows with `executemany`, and select those with a score above 70.

<details><summary>Solution</summary>

```python
conn = sqlite3.connect(":memory:")   # a temporary in-memory database
conn.execute("CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, score INTEGER)")
conn.executemany("INSERT INTO students (name, score) VALUES (?, ?)",
                 [("Amina", 88), ("Omar", 64), ("Sara", 91)])
print(conn.execute("SELECT name FROM students WHERE score > 70").fetchall())
```

</details>

2. Get the average score and the best student with SQL.

<details><summary>Solution</summary>

```python
print(conn.execute("SELECT AVG(score) FROM students").fetchone()[0])
print(conn.execute("SELECT name FROM students ORDER BY score DESC LIMIT 1").fetchone()[0])
```

</details>

3. Explain why this is dangerous: `conn.execute(f"DELETE FROM students WHERE name = '{name}'")` if `name` is `x' OR '1'='1`.

<details><summary>Solution</summary>

```python
# The query becomes: DELETE FROM students WHERE name = 'x' OR '1'='1'
# '1'='1' is always true, so every student is deleted. Use ? placeholders.
```

</details>

## Project: Movie database explorer

Create a small movie database with three related tables (directors, movies, ratings), fill it with sample data, then answer interesting questions with SQL: joins, grouping, and searches typed by the user (safely, with placeholders).

Files in this folder: `day58_movies.py`.

### Key lines explained

- `REFERENCES directors(id)`: A foreign key: each movie points to its director's row. That's what JOINs follow.
- `CHECK (stars BETWEEN 1 AND 5)`: The database itself refuses invalid ratings, whatever code inserts them.
- `conn.row_factory = sqlite3.Row`: Rows behave like dicts, so you can write `row["title"]` and get column names with `keys()`.
- `with conn:`: A transaction: if any insert fails, all of them are undone, so the database is never half-filled.
- `WHERE title LIKE ?  with (f"%{text}%",)`: The `%` wildcards are part of the value, not the SQL, so the search is still injection-safe.

### Stretch goals

- Add a menu option to rate a movie, inserting into `ratings`.
- Install "DB Browser for SQLite" and open `movies.db` to explore it visually.

## Test it

- [ ] Run every menu option.
- [ ] Search for `' OR 1=1 --`: it should simply find nothing.
- [ ] Delete `movies.db` and run again; the sample data is recreated.
