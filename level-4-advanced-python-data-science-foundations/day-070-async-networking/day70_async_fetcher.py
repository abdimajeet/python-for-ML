# day70_async_fetcher.py
# Fetches country data concurrently with httpx and asyncio.

import asyncio
import sys
import time

import httpx

API = "https://restcountries.com/v3.1/alpha/{code}"
FIELDS = "name,capital,population,region,area,currencies"
CODES = ["SO", "KE", "ET", "DJ", "UG", "TZ", "EG", "NG", "ZA", "GH",
         "MA", "GB", "DE", "JP", "BR", "IN", "US", "CA", "AU", "XX"]
MAX_CONCURRENT = 5
RETRIES = 2


async def fetch_country(client: httpx.AsyncClient, code: str, limit: asyncio.Semaphore) -> dict:
    url = API.format(code=code)
    for attempt in range(RETRIES + 1):
        try:
            async with limit:
                r = await client.get(url, params={"fields": FIELDS})
            if r.status_code == 404:
                return {"code": code, "error": "not found"}
            r.raise_for_status()
            data = r.json()
            return {
                "code": code,
                "name": data["name"]["common"],
                "capital": (data.get("capital") or ["-"])[0],
                "region": data["region"],
                "population": data["population"],
                "area": data["area"],
                "currencies": ", ".join(data.get("currencies", {})),
            }
        except (httpx.TransportError, httpx.HTTPStatusError) as error:
            if attempt == RETRIES:
                return {"code": code, "error": type(error).__name__}
            await asyncio.sleep(0.5 * 2 ** attempt)        # back off before retrying
    return {"code": code, "error": "unknown"}


async def fetch_all(codes: list[str], concurrent: bool) -> list[dict]:
    limit = asyncio.Semaphore(MAX_CONCURRENT if concurrent else 1)
    async with httpx.AsyncClient(timeout=10) as client:
        return await asyncio.gather(*(fetch_country(client, c, limit) for c in codes))


def report(results: list[dict]) -> None:
    good = [r for r in results if "error" not in r]
    bad = [r for r in results if "error" in r]
    print(f"\n{'Country':<16}{'Capital':<14}{'Region':<10}{'Population':>14}{'per km²':>9}  Currency")
    for r in sorted(good, key=lambda r: r["population"], reverse=True):
        density = r["population"] / r["area"] if r["area"] else 0
        print(f"{r['name'][:15]:<16}{r['capital'][:13]:<14}{r['region']:<10}"
              f"{r['population']:>14,}{density:>9.0f}  {r['currencies']}")
    for r in bad:
        print(f"  {r['code']}: {r['error']}")

    by_region: dict[str, int] = {}
    for r in good:
        by_region[r["region"]] = by_region.get(r["region"], 0) + r["population"]
    print("\nPopulation by region:", {k: f"{v / 1e6:.0f}M" for k, v in by_region.items()})


def main() -> None:
    concurrent = "--sequential" not in sys.argv
    start = time.perf_counter()
    results = asyncio.run(fetch_all(CODES, concurrent))
    elapsed = time.perf_counter() - start
    report(results)
    mode = f"concurrently (max {MAX_CONCURRENT} at once)" if concurrent else "one at a time"
    print(f"\nFetched {len(results)} countries {mode} in {elapsed:.2f}s")


if __name__ == "__main__":
    main()
