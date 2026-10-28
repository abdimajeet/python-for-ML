# day56_weather.py
# Current weather and a 5-day forecast from Open-Meteo (no API key needed).

import requests

GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

# WMO weather codes used by Open-Meteo (simplified)
WEATHER = {
    0: "clear sky", 1: "mainly clear", 2: "partly cloudy", 3: "overcast",
    45: "fog", 48: "fog", 51: "light drizzle", 53: "drizzle", 55: "heavy drizzle",
    61: "light rain", 63: "rain", 65: "heavy rain", 71: "light snow", 73: "snow",
    75: "heavy snow", 80: "rain showers", 81: "rain showers", 82: "violent showers",
    95: "thunderstorm", 96: "thunderstorm with hail", 99: "thunderstorm with hail",
}


class WeatherError(Exception):
    """Raised when weather data can't be fetched."""


def get_json(url, params):
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.Timeout:
        raise WeatherError("The weather service took too long to answer.")
    except requests.RequestException as error:
        raise WeatherError(f"Network problem: {error}")


def find_city(name):
    data = get_json(GEOCODE_URL, {"name": name, "count": 1, "language": "en"})
    results = data.get("results")
    if not results:
        raise WeatherError(f"No place called '{name}' was found.")
    place = results[0]
    return place["name"], place.get("country", ""), place["latitude"], place["longitude"]


def get_forecast(lat, lon, days=5):
    return get_json(FORECAST_URL, {
        "latitude": lat,
        "longitude": lon,
        "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code",
        "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum",
        "timezone": "auto",
        "forecast_days": days,
    })


def describe(code):
    return WEATHER.get(code, f"code {code}")


def show(city, country, data):
    now = data["current"]
    units = data["current_units"]
    print(f"\n{city}, {country}")
    print(f"Now: {now['temperature_2m']}{units['temperature_2m']}, {describe(now['weather_code'])}, "
          f"humidity {now['relative_humidity_2m']}%, wind {now['wind_speed_10m']} {units['wind_speed_10m']}")

    daily = data["daily"]
    print(f"\n{'Day':<12}{'Weather':<22}{'Min':>6}{'Max':>6}{'Rain':>8}")
    rows = zip(daily["time"], daily["weather_code"], daily["temperature_2m_min"],
               daily["temperature_2m_max"], daily["precipitation_sum"])
    for day, code, low, high, rain in rows:
        print(f"{day:<12}{describe(code):<22}{low:>6.1f}{high:>6.1f}{rain:>6.1f}mm")


def main():
    while True:
        name = input("\nCity (blank to quit): ").strip()
        if not name:
            break
        try:
            city, country, lat, lon = find_city(name)
            show(city, country, get_forecast(lat, lon))
        except WeatherError as error:
            print(error)


if __name__ == "__main__":
    main()
