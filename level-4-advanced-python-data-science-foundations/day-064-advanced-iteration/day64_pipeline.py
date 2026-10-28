# day64_pipeline.py
# A streaming event pipeline built from generators and itertools.

import random
from collections import Counter
from datetime import datetime, timedelta
from itertools import accumulate, chain, groupby, islice, pairwise

EVENTS = ["login", "view", "view", "view", "search", "add_to_cart", "checkout", "logout"]


def fake_source(server, n, seed):
    """Yield raw log lines like '2026-10-01T09:00:03|web-1|user7|view'."""
    rng = random.Random(seed)
    t = datetime(2026, 10, 1, 9, 0)
    for _ in range(n):
        t += timedelta(seconds=rng.randint(1, 20))
        yield f"{t.isoformat()}|{server}|user{rng.randint(1, 12)}|{rng.choice(EVENTS)}"


def parse(lines):
    for line in lines:
        time, server, user, event = line.split("|")
        yield {"time": datetime.fromisoformat(time), "server": server, "user": user, "event": event}


def sessions(events, gap=timedelta(minutes=5)):
    """Split each user's events into sessions separated by gaps of inactivity."""
    by_user = sorted(events, key=lambda e: (e["user"], e["time"]))
    for user, group in groupby(by_user, key=lambda e: e["user"]):
        session = []
        for event in group:
            if session and event["time"] - session[-1]["time"] > gap:
                yield user, session
                session = []
            session.append(event)
        if session:
            yield user, session


def busiest_minutes(events, top=3):
    per_minute = Counter(e["time"].replace(second=0) for e in events)
    return per_minute.most_common(top)


def main():
    sources = [fake_source("web-1", 400, 1), fake_source("web-2", 400, 2), fake_source("api", 200, 3)]
    events = list(parse(chain.from_iterable(sources)))
    print(f"Events: {len(events)} from {len({e['server'] for e in events})} servers")

    print("\nFirst three events:")
    for e in islice(events, 3):
        print(f"  {e['time']:%H:%M:%S} {e['server']:<6}{e['user']:<8}{e['event']}")

    print("\nBusiest minutes:")
    for minute, n in busiest_minutes(events):
        print(f"  {minute:%H:%M}  {n} events")

    all_sessions = list(sessions(events))
    lengths = [len(s) for _, s in all_sessions]
    durations = [(s[-1]["time"] - s[0]["time"]).total_seconds() / 60 for _, s in all_sessions]
    print(f"\nSessions: {len(all_sessions)}")
    print(f"  average events per session: {sum(lengths) / len(lengths):.1f}")
    print(f"  longest session: {max(durations):.1f} minutes")

    converted = sum(1 for _, s in all_sessions if any(e["event"] == "checkout" for e in s))
    print(f"  sessions with a checkout: {converted} ({converted / len(all_sessions):.0%})")

    print("\nMost common next event after 'search':")
    pairs = Counter((a["event"], b["event"]) for _, s in all_sessions for a, b in pairwise(s))
    after_search = {b: n for (a, b), n in pairs.items() if a == "search"}
    for event, n in sorted(after_search.items(), key=lambda kv: -kv[1])[:3]:
        print(f"  {event:<12}{n}")

    hourly = Counter(e["time"].hour for e in events)
    hours = sorted(hourly)
    running = list(accumulate(hourly[h] for h in hours))
    print("\nCumulative events by hour:", dict(zip(hours, running)))


if __name__ == "__main__":
    main()
