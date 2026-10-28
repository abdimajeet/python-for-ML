# day76_sales_report.py
# A sales report from three related tables using pandas.

# %% Build three related tables
import numpy as np
import pandas as pd

rng = np.random.default_rng(76)

products = pd.DataFrame({
    "product_id": range(1, 13),
    "product": ["Laptop", "Phone", "Tablet", "Headphones", "Charger", "Mouse",
                "Keyboard", "Monitor", "Desk", "Chair", "Lamp", "Backpack"],
    "category": ["Electronics"] * 8 + ["Furniture"] * 3 + ["Accessories"],
    "price": [850, 620, 330, 95, 25, 30, 55, 210, 240, 180, 45, 60],
    "unit_cost": [700, 480, 250, 50, 9, 12, 25, 160, 150, 110, 20, 28],
})
stores = pd.DataFrame({
    "store_id": [1, 2, 3, 4],
    "store": ["Hargeisa Central", "Mogadishu Mall", "Nairobi CBD", "Online"],
    "region": ["Somaliland", "Somalia", "Kenya", "Online"],
})
n = 5_000
orders = pd.DataFrame({
    "order_id": range(10_001, 10_001 + n),
    "date": pd.to_datetime("2026-01-01") + pd.to_timedelta(rng.integers(0, 273, n), unit="D"),
    "store_id": rng.choice([1, 2, 3, 4], size=n, p=[0.2, 0.25, 0.2, 0.35]),
    "product_id": rng.integers(1, 13, size=n),
    "qty": rng.choice([1, 1, 1, 2, 2, 3], size=n),
    "discount": rng.choice([0, 0, 0, 0.05, 0.1], size=n),
})

# %% Merge into one analysis table
sales = (orders
         .merge(products, on="product_id", how="left")
         .merge(stores, on="store_id", how="left"))
assert len(sales) == len(orders), "a merge must not duplicate orders"

sales["revenue"] = sales["qty"] * sales["price"] * (1 - sales["discount"])
sales["profit"] = sales["revenue"] - sales["qty"] * sales["unit_cost"]
sales["month"] = sales["date"].dt.to_period("M")
print(sales.head())

# %% Headline numbers
print(f"Revenue {sales['revenue'].sum():,.0f}   Profit {sales['profit'].sum():,.0f}   "
      f"Margin {sales['profit'].sum() / sales['revenue'].sum():.1%}   Orders {len(sales):,}")

# %% Performance by store
by_store = sales.groupby("store").agg(
    revenue=("revenue", "sum"),
    profit=("profit", "sum"),
    orders=("order_id", "count"),
    avg_order=("revenue", "mean"),
).sort_values("revenue", ascending=False)
by_store["margin"] = by_store["profit"] / by_store["revenue"]
print(by_store.round(2))

# %% Monthly revenue per store (pivot table)
monthly = sales.pivot_table(index="month", columns="store", values="revenue",
                            aggfunc="sum", fill_value=0)
print(monthly.round(0))
print("Month-on-month growth (all stores):")
print(monthly.sum(axis=1).pct_change().round(3).dropna())

# %% Best and worst products by profit
by_product = (sales.groupby(["category", "product"])["profit"].sum()
              .sort_values(ascending=False))
print(by_product.head(3))
print(by_product.tail(3))

# %% Do discounts pay off?
print(sales.groupby("discount").agg(orders=("order_id", "count"),
                                    avg_qty=("qty", "mean"),
                                    margin=("profit", "sum")).round(2))

# %% Weekday pattern
weekday = sales.groupby(sales["date"].dt.day_name())["revenue"].sum()
order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
print(weekday.reindex(order).round(0))

# %% Export for a spreadsheet
by_store.to_csv("report_by_store.csv")
monthly.to_csv("report_monthly.csv")
print("Saved report_by_store.csv and report_monthly.csv")
