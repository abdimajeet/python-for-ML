# day57_currency.py
# Currency conversion with the Frankfurter API, with caching.

import json
import time
from pathlib import Path

import requests

API = "https://api.frankfurter.dev/v1"
CACHE_FILE = Path(__file__).parent / "rates_cache.json"
CACHE_HOURS = 6


class RatesClient:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers["User-Agent"] = "python-100-days currency converter"

    def _get(self, endpoint, **params):
        try:
            r = self.session.get(f"{API}/{endpoint}", params=params, timeout=10)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as error:
            raise ConnectionError(f"Could not reach the rates service: {error}") from error

    def currencies(self):
        return self._get("currencies")

    def latest(self, base):
        cache = self._read_cache()
        entry = cache.get(base)
        if entry and time.time() - entry["fetched"] < CACHE_HOURS * 3600:
            return entry["data"]

        data = self._get("latest", base=base)
        cache[base] = {"fetched": time.time(), "data": data}
        CACHE_FILE.write_text(json.dumps(cache, indent=2), encoding="utf-8")
        return data

    def _read_cache(self):
        try:
            return json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        except (FileNotFoundError, json.JSONDecodeError):
            return {}


def convert(amount, base, target, client):
    if base == target:
        return amount, 1.0, None
    data = client.latest(base)
    rate = data["rates"].get(target)
    if rate is None:
        raise ValueError(f"No rate for {target}")
    return amount * rate, rate, data["date"]


def main():
    client = RatesClient()
    try:
        names = client.currencies()
    except ConnectionError as error:
        print(error)
        return

    print("Supported:", ", ".join(sorted(names)))
    while True:
        text = input("\nConvert (e.g. 100 USD EUR), or q: ").strip().upper()
        if text == "Q":
            break
        try:
            amount_text, base, target = text.split()
            amount = float(amount_text)
            if base not in names or target not in names:
                raise ValueError("Unknown currency code")
            result, rate, day = convert(amount, base, target, client)
        except ValueError as error:
            print("Please type: amount FROM TO, e.g. 50 GBP JPY.", error)
            continue
        except ConnectionError as error:
            print(error)
            continue

        print(f"{amount:,.2f} {names[base]} = {result:,.2f} {names[target]}")
        print(f"Rate 1 {base} = {rate:.4f} {target}" + (f" (ECB rate for {day})" if day else ""))

        print(f"\n{base:>10} {target:>12}")
        for x in (1, 5, 10, 50, 100, 500, 1000):
            print(f"{x:>10,} {x * rate:>12,.2f}")


if __name__ == "__main__":
    main()
