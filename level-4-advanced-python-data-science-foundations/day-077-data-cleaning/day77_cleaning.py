# day77_cleaning.py
# A repeatable cleaning pipeline for a messy dataset.

import io

import numpy as np
import pandas as pd

RAW_CSV = """customer_id,name,email,country,signup_date,age,plan,monthly_fee
1001,Amina Hassan,amina@example.com,Somalia,2026-01-15,24,premium,$12.99
1002, omar ali ,OMAR@EXAMPLE.COM,somalia,15/02/2026,31,Basic,4.99
1003,Sara Noor,sara@example.com,Kenya ,2026-03-01,,basic,4.99
1004,Yusuf Ahmed,,KENYA,2026/03/09,45,Premium,12.99
1005,Hodan Abdi,hodan@example.com,Ethiopia,2026-03-12,250,premium,"$1,299"
1002, omar ali ,OMAR@EXAMPLE.COM,somalia,15/02/2026,31,Basic,4.99
1006,Bilal Warsame,bilal@example,Djibouti,not a date,19,free,0
1007,Faisal Musa,faisal@example.com,somaliland,2026-04-02,-3,basic,4.99
1008,Layla Yusuf,layla@example.com,,2026-04-18,28,PREMIUM,12.99
1009,Khadar Omar,khadar@example.com,Kenya,2026-05-05,38,enterprise,49.00
1010,Nimco Jama,nimco@example.com,Somalia,2026-05-20,22,basic,
"""

COUNTRY_FIX = {"Somaliland": "Somalia"}          # a business decision, documented here
VALID_PLANS = {"free", "basic", "premium", "enterprise"}


def report(step, before, after):
    print(f"{step:<34} rows {len(before):>3} -> {len(after):>3}")
    return after


def clean_text(df):
    df = df.copy()
    df["name"] = df["name"].str.strip().str.title()
    df["email"] = df["email"].str.strip().str.lower()
    df["country"] = df["country"].str.strip().str.title().replace(COUNTRY_FIX)
    df["plan"] = df["plan"].str.strip().str.lower()
    return df


def drop_duplicates(df):
    return df.drop_duplicates(subset=["customer_id"], keep="first")


def fix_dates(df):
    df = df.copy()
    text = df["signup_date"].astype(str).str.replace("/", "-")
    iso = pd.to_datetime(text, format="%Y-%m-%d", errors="coerce")
    dmy = pd.to_datetime(text, format="%d-%m-%Y", errors="coerce")
    df["signup_date"] = iso.fillna(dmy)
    return df


def fix_numbers(df):
    df = df.copy()
    fee_text = df["monthly_fee"].astype(str).str.replace(r"[$,]", "", regex=True)
    df["monthly_fee"] = pd.to_numeric(fee_text, errors="coerce")
    df["age"] = pd.to_numeric(df["age"], errors="coerce")
    df.loc[~df["age"].between(13, 110), "age"] = np.nan          # impossible ages
    return df


def fill_missing(df):
    df = df.copy()
    df["age"] = df["age"].fillna(df["age"].median()).round().astype(int)
    df["country"] = df["country"].fillna("Unknown")
    typical_fee = df.groupby("plan")["monthly_fee"].transform("median")
    df["monthly_fee"] = df["monthly_fee"].fillna(typical_fee)
    # A fee far above the plan's usual price is treated as a typing error.
    too_high = df["monthly_fee"] > typical_fee * 10
    df.loc[too_high, "monthly_fee"] = typical_fee[too_high]
    return df


def flag_bad_rows(df):
    df = df.copy()
    valid_email = df["email"].str.fullmatch(r"[\w.+-]+@[\w-]+\.[\w.]+", na=False)
    df["needs_review"] = ~valid_email | df["signup_date"].isna() | ~df["plan"].isin(VALID_PLANS)
    return df


def validate(df):
    assert df["customer_id"].is_unique
    assert df["age"].between(13, 110).all()
    assert (df["monthly_fee"] >= 0).all()
    assert df["plan"].isin(VALID_PLANS).all()
    assert df["country"].notna().all()
    print("All validation checks passed.")


def main():
    raw = pd.read_csv(io.StringIO(RAW_CSV))
    print("Missing values in the raw data:")
    print(raw.isna().sum()[raw.isna().sum() > 0].to_dict(), "\n")

    df = raw
    for step in (clean_text, drop_duplicates, fix_dates, fix_numbers, fill_missing, flag_bad_rows):
        df = report(step.__name__, df, step(df))

    print()
    print(df.to_string(index=False))
    print(f"\n{df['needs_review'].sum()} row(s) flagged for a human to review:")
    print(df.loc[df["needs_review"], ["customer_id", "email", "signup_date"]].to_string(index=False))
    validate(df)
    df.to_csv("customers_clean.csv", index=False)


if __name__ == "__main__":
    main()
