# Day 76: pandas manipulation

**Level 4, Advanced Python & Data Science Foundations.** Project: **Sales performance report**

Today you learn pandas' most powerful tools: grouping and aggregating, merging tables, pivot tables, and working with dates. These turn raw transactions into reports.

## Lesson

### groupby: split, apply, combine

`df.groupby("col")` splits rows into groups, an aggregation computes one value per group, and the results combine into a new table. `agg` computes several statistics at once, with readable names.

```python
sales.groupby("region")["amount"].sum()

sales.groupby(["region", "category"]).agg(
    revenue=("amount", "sum"),
    orders=("order_id", "count"),
    avg_order=("amount", "mean"),
)
```

### merge: joining tables

`pd.merge(left, right, on="key")` joins tables like SQL's JOIN (Day 58). `how="left"` keeps every left row even without a match. Check the row count afterwards: an unexpected increase usually means duplicate keys.

```python
orders = pd.merge(orders, products, on="product_id", how="left")
orders = orders.merge(customers, on="customer_id", how="left")
```

### Pivot tables

`pivot_table` builds a spreadsheet-style summary: one variable down the rows, another across the columns, and an aggregate in the cells.

```python
pd.pivot_table(sales, index="month", columns="region",
               values="amount", aggfunc="sum", fill_value=0)
```

### Dates

Convert text to dates with `pd.to_datetime`. The `.dt` accessor gives parts: `.dt.month`, `.dt.day_name()`, `.dt.to_period("M")` for months. `resample("W")` groups a date-indexed table by week.


## Exercises

1. Given a DataFrame of expenses with category and amount, find the total and average per category, sorted by total.

<details><summary>Solution</summary>

```python
(expenses.groupby("category")["amount"]
    .agg(["sum", "mean"])
    .sort_values("sum", ascending=False))
```

</details>

2. Merge a `students` table (id, name) with a `scores` table (student_id, subject, score), then compute each student's average.

<details><summary>Solution</summary>

```python
merged = scores.merge(students, left_on="student_id", right_on="id")
print(merged.groupby("name")["score"].mean())
```

</details>

3. Make a pivot table of average score with students as rows and subjects as columns.

<details><summary>Solution</summary>

```python
print(merged.pivot_table(index="name", columns="subject", values="score", aggfunc="mean"))
```

</details>

## Project: Sales performance report

Build a sales report for a fictional shop from three related tables (orders, products and stores): merge them, then answer business questions with groupby, pivot tables and dates. The data is generated with a seed. Needs `pip install pandas numpy`.

Files in this folder: `day76_sales_report.py`.

### Key lines explained

- `orders.merge(products, ...).merge(stores, ...)`: Method chaining in parentheses keeps a multi-step transformation readable, one step per line.
- `assert len(sales) == len(orders)`: A safety check: if a lookup table had duplicate keys, the merge would silently multiply rows.
- `sales["date"].dt.to_period("M")`: Turns each date into its month, perfect for monthly grouping.
- `groupby(...).agg(revenue=("revenue", "sum"), ...)`: **Named aggregation**: each new column states its source column and function.
- `monthly.sum(axis=1).pct_change()`: Totals each month across stores, then computes the percentage change from the previous month.

### Stretch goals

- Find the best-selling product in each store using `groupby` and `idxmax`.
- Add a customers table and find the top 10 customers by lifetime value.

## Test it

- [ ] The assert after merging must pass.
- [ ] Check that the store revenues add up to the headline revenue.
- [ ] Open the exported CSV files in a spreadsheet.
