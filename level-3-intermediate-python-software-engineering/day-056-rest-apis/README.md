# Day 56: REST APIs

**Level 3, Intermediate Python & Software Engineering.** Project: **Weather CLI using a free public API**

Web APIs let your programs talk to services on the internet. Today you learn how HTTP works and use the `requests` library to fetch live weather data.

## Lesson

### HTTP in one minute

Your program (the **client**) sends a **request** to a URL. The **server** sends back a **response** with a **status code** and a body. A **REST API** is a set of URLs that return data (usually JSON) instead of web pages. The main methods are GET (read), POST (create), PUT/PATCH (update) and DELETE.


### Status codes

2xx means success (200 OK, 201 Created). 3xx is a redirect. 4xx means you made a mistake (400 bad request, 401 not logged in, 404 not found, 429 too many requests). 5xx means the server failed.


### requests

Install with `pip install requests`. `requests.get(url, params=...)` builds the query string for you. Always set a `timeout` so a slow server can't freeze your program. `raise_for_status()` turns 4xx/5xx responses into exceptions. `.json()` parses the body.

```python
import requests

response = requests.get(
    "https://api.open-meteo.com/v1/forecast",
    params={"latitude": 9.56, "longitude": 44.06, "current": "temperature_2m"},
    timeout=10,
)
response.raise_for_status()
data = response.json()
print(response.status_code, data["current"]["temperature_2m"])
```

### Read the documentation

Every API documents its URLs, parameters and the shape of its JSON. Open-Meteo (**open-meteo.com**) is free and needs no account, which makes it perfect for learning. Print the JSON (or open the URL in a browser) and explore it before writing code.


### Handle failures

Networks fail. Catch `requests.RequestException` (the parent of timeouts, connection errors and HTTP errors) and show a helpful message. Your Day 49 `@retry` decorator fits here nicely.


## Exercises

1. Open this URL in your browser and look at the JSON: `https://geocoding-api.open-meteo.com/v1/search?name=Nairobi&count=1`

<details><summary>Solution</summary>

```python
# You'll see {"results": [{"name": "Nairobi", "latitude": -1.28, "longitude": 36.82,
#   "country": "Kenya", ...}], ...}
```

</details>

2. Fetch the same URL with requests and print the country and coordinates.

<details><summary>Solution</summary>

```python
import requests
r = requests.get("https://geocoding-api.open-meteo.com/v1/search",
                 params={"name": "Nairobi", "count": 1}, timeout=10)
place = r.json()["results"][0]
print(place["country"], place["latitude"], place["longitude"])
```

</details>

3. Request a city that doesn't exist. What does the JSON look like? How should your code handle it?

<details><summary>Solution</summary>

```python
# The "results" key is missing entirely, so use data.get("results") and check for None.
```

</details>

## Project: Weather CLI using a free public API

Type a city name to get the current weather and a 5-day forecast. The program first converts the city to coordinates with Open-Meteo's geocoding API, then fetches the forecast. Network errors and unknown cities are handled cleanly. Needs `pip install requests`.

Files in this folder: `day56_weather.py`.

Sample output:

```text
City (blank to quit): Hargeisa

Hargeisa, Somalia
Now: 24.3°C, partly cloudy, humidity 41%, wind 18.2 km/h

Day         Weather                  Min   Max    Rain
2026-10-24  partly cloudy           15.2  27.9   0.0mm
...
```

### Key lines explained

- `class WeatherError(Exception):`: A custom exception for this program. Low-level network errors are translated into one friendly error type the menu can catch.
- `requests.get(url, params=params, timeout=10)`: `params` builds the `?latitude=...&longitude=...` part safely, and the timeout stops the program waiting forever.
- `results = data.get("results")`: The geocoding API leaves out `results` entirely for unknown places. `.get` avoids a KeyError.
- `"timezone": "auto"`: Daily values are calculated in the city's own timezone, not yours.
- `zip(daily["time"], daily["weather_code"], ...)`: The API returns one list per field. `zip` turns them back into one row per day, the same trick as Day 25.

### Stretch goals

- Remember the last city in a JSON file and offer it as the default.
- Add the `@retry` decorator from Day 49 to `get_json`.

## Test it

- [ ] Try your own city and two others.
- [ ] Try a made-up city name.
- [ ] Turn off Wi-Fi and run it: you should get the network message, not a traceback.
