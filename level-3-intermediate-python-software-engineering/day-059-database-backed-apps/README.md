# Day 59: Database-backed apps

**Level 3, Intermediate Python & Software Engineering.** Project: **Habit tracker on SQLite**

Today you build a full CRUD application (Create, Read, Update, Delete) on SQLite, with the database code separated into a class so the rest of the program never writes SQL.

## Lesson

### CRUD in SQL

**Create** is `INSERT`, **Read** is `SELECT`, **Update** is `UPDATE ... SET ... WHERE`, and **Delete** is `DELETE ... WHERE`. Forgetting the `WHERE` on UPDATE or DELETE changes every row, so always double-check it.

```python
conn.execute("UPDATE habits SET name = ? WHERE id = ?", ("Read 20 pages", 3))
conn.execute("DELETE FROM habits WHERE id = ?", (3,))
cursor = conn.execute("INSERT INTO habits (name) VALUES (?)", ("Walk",))
print(cursor.lastrowid)    # the new row's id
```

### Schema design

Store each fact once. A habit tracker has `habits` (one row per habit) and `check_ins` (one row per habit per day). A `UNIQUE(habit_id, day)` constraint stops double check-ins, and `ON DELETE CASCADE` removes a habit's check-ins when the habit is deleted.


### The repository pattern

Put all SQL in one class, often called a **repository**, with methods like `add_habit` and `check_in`. The rest of the program calls those methods. You can change the database later, or test with an in-memory database (`":memory:"`), without touching anything else.


### Foreign keys in SQLite

SQLite only enforces foreign keys after `PRAGMA foreign_keys = ON`, which must be run on each new connection. It's an easy step to forget.


## Exercises

1. Write the SQL to rename habit 2 to "Meditate".

<details><summary>Solution</summary>

```python
UPDATE habits SET name = 'Meditate' WHERE id = 2;
```

</details>

2. Write a query counting check-ins per habit, including habits with none.

<details><summary>Solution</summary>

```python
SELECT h.name, COUNT(c.id)
FROM habits h LEFT JOIN check_ins c ON c.habit_id = h.id
GROUP BY h.id;
```

</details>

3. What happens if you run `DELETE FROM habits` without a WHERE?

<details><summary>Solution</summary>

```python
# Every habit is deleted (and with ON DELETE CASCADE, every check-in too).
```

</details>

## Project: Habit tracker on SQLite

Track daily habits: create, rename and delete habits, check in for today, and see each habit's current streak and last-7-days grid. All SQL lives in a `HabitRepository` class; the menu code never sees SQL.

Files in this folder: `day59_habits.py`.

### Key lines explained

- `class HabitRepository:`: Every SQL statement lives here. The menu code calls readable methods like `repo.check_in(3)`.
- `UNIQUE (habit_id, day) ... except sqlite3.IntegrityError`: The database rejects a second check-in on the same day, and the method turns that into a simple True/False.
- `ON DELETE CASCADE + PRAGMA foreign_keys = ON`: Deleting a habit removes its check-ins automatically, but only because foreign keys were switched on.
- `cur.rowcount == 1`: UPDATE and DELETE report how many rows they changed. 0 means no habit had that id.
- `def current_streak(days, today=None):`: Pure logic with an optional `today`, kept outside the repository so it's easy to test with fixed dates.

### Stretch goals

- Add a "longest streak ever" column.
- Write pytest tests using `HabitRepository(":memory:")` so each test gets a fresh database.

## Test it

- [ ] Check in twice on the same day.
- [ ] Delete a habit, then check the `check_ins` table has no rows left for it.
- [ ] Rename to an existing name: what happens? Should the program catch it?
- [ ] In the interpreter, test `current_streak` with a set of fixed dates.
