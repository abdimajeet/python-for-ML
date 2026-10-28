# Day 57: Working with API data

**Level 3, Intermediate Python & Software Engineering.** Project: **Currency converter**

Real APIs need more care: query parameters, pagination, rate limits, caching, and API keys that must never appear in your code. Today you build a currency converter on a free exchange-rate API.

## Lesson

### Query parameters and endpoints

An API usually has several **endpoints**: one URL for each kind of data, such as `/latest` for today's rates and `/currencies` for the list of codes. Parameters choose what you get. Always read the docs to learn the endpoints and their parameters.


### API keys stay out of code

Many APIs require a secret key. Never write it in your code or commit it to Git: anyone who sees the repo can use it. Store it in an **environment variable** and read it with `os.environ`. A `.env` file (listed in `.gitignore`) plus the `python-dotenv` package is a common way to load such variables.

```python
import os

api_key = os.environ.get("WEATHER_API_KEY")
if api_key is None:
    raise SystemExit("Set the WEATHER_API_KEY environment variable first.")

headers = {"Authorization": f"Bearer {api_key}"}
```

### Pagination

APIs that return many records send them in **pages**. You request page 1, then the next page, until there are no more. A generator (Day 48) is the perfect shape for this.

```python
def all_items(url):
    page = 1
    while True:
        data = requests.get(url, params={"page": page}, timeout=10).json()
        if not data["items"]:
            return
        yield from data["items"]
        page += 1
```

### Be polite: rate limits and caching

APIs limit how often you can call them; a 429 status means slow down. Don't request the same data repeatedly: cache it. Exchange rates change once a day, so saving them to a file with a timestamp and reusing them for a few hours is both faster and kinder to the service.


### Sessions

`requests.Session()` reuses one connection for many requests, which is faster, and lets you set headers once.


## Exercises

1. Set an environment variable in your terminal and read it from Python.

<details><summary>Solution</summary>

```python
# macOS/Linux:  export MY_NAME="Abdy"
# PowerShell:   $env:MY_NAME="Abdy"
import os
print(os.environ.get("MY_NAME", "not set"))
```

</details>

2. Open `https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR,GBP` in your browser and describe the JSON.

<details><summary>Solution</summary>

```python
# {"amount": 1.0, "base": "USD", "date": "2026-10-23", "rates": {"EUR": 0.92, "GBP": 0.79}}
```

</details>

3. Write a function that returns cached data if a JSON file is younger than one hour, otherwise None.

<details><summary>Solution</summary>

```python
import json, time
from pathlib import Path

def read_cache(path: Path, max_age=3600):
    if path.exists() and time.time() - path.stat().st_mtime < max_age:
        return json.loads(path.read_text())
    return None
```

</details>

## Project: Currency converter

Convert between currencies using the free Frankfurter API (European Central Bank rates, no key needed). It lists supported currencies, caches rates for a few hours, uses a session with a timeout, and shows a conversion table. Needs `pip install requests`.

Files in this folder: `day57_currency.py`.

### Key lines explained

- `self.session = requests.Session()`: One session reuses the connection for every call and carries the User-Agent header, which identifies your program politely.
- `def _get(self, endpoint, **params):`: All network access goes through one method, so errors are handled in exactly one place.
- `raise ConnectionError(...) from error`: `from error` keeps the original exception attached, so the full cause appears when debugging.
- `if entry and time.time() - entry["fetched"] < CACHE_HOURS * 3600:`: Rates are reused for 6 hours. Most conversions then need no network call at all.
- `rates_cache.json`: Generated data. Add it to `.gitignore`.

### Stretch goals

- Use the `/{date}` endpoint (e.g. `/2025-01-02`) to compare today's rate with a year ago.
- Add a `--offline` option that only uses the cache.

## Test it

- [ ] Convert `100 USD EUR` twice: the second time should be instant (cached).
- [ ] Try `100 USD XYZ` and `hundred USD EUR`.
- [ ] Delete the cache file and run again.
- [ ] Disconnect from the internet and check the error message.
