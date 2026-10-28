# day66_access_log.py
# Parses Apache/Nginx "combined" access logs with named groups.

import re
from collections import Counter
from datetime import datetime

SAMPLE = r'''
192.168.1.10 - - [24/Oct/2026:13:55:36 +0000] "GET /index.html HTTP/1.1" 200 2326 "-" "Mozilla/5.0"
192.168.1.10 - - [24/Oct/2026:13:55:40 +0000] "GET /images/logo.png HTTP/1.1" 200 15400 "http://example.com/" "Mozilla/5.0"
10.0.0.5 - - [24/Oct/2026:13:56:02 +0000] "POST /login HTTP/1.1" 401 512 "-" "curl/8.4.0"
10.0.0.5 - - [24/Oct/2026:13:56:03 +0000] "POST /login HTTP/1.1" 401 512 "-" "curl/8.4.0"
10.0.0.5 - - [24/Oct/2026:13:56:04 +0000] "POST /login HTTP/1.1" 401 512 "-" "curl/8.4.0"
10.0.0.5 - - [24/Oct/2026:13:56:05 +0000] "POST /login HTTP/1.1" 401 512 "-" "curl/8.4.0"
172.16.0.3 - amina [24/Oct/2026:14:01:12 +0000] "GET /dashboard HTTP/1.1" 200 8812 "-" "Mozilla/5.0 (Windows NT 10.0)"
172.16.0.3 - amina [24/Oct/2026:14:01:30 +0000] "GET /api/orders?page=2 HTTP/1.1" 200 1290 "-" "Mozilla/5.0 (Windows NT 10.0)"
203.0.113.9 - - [24/Oct/2026:14:02:00 +0000] "GET /wp-admin HTTP/1.1" 404 196 "-" "BadBot/1.0"
203.0.113.9 - - [24/Oct/2026:14:02:01 +0000] "GET /.env HTTP/1.1" 404 196 "-" "BadBot/1.0"
this line is broken and should be reported
192.168.1.22 - - [24/Oct/2026:14:05:44 +0000] "GET /index.html HTTP/1.1" 304 - "-" "Mozilla/5.0"
192.168.1.22 - - [24/Oct/2026:14:06:10 +0000] "GET /checkout HTTP/1.1" 500 734 "-" "Mozilla/5.0"
'''

LINE = re.compile(r"""
    ^(?P<ip>\d{1,3}(?:\.\d{1,3}){3})          # client IP address
    \s\S+\s(?P<user>\S+)\s                     # identity (unused) and user
    \[(?P<time>[^\]]+)\]\s                     # [24/Oct/2026:13:55:36 +0000]
    "(?P<method>[A-Z]+)\s(?P<path>\S+)\s[^"]*"\s   # "GET /index.html HTTP/1.1"
    (?P<status>\d{3})\s(?P<size>\d+|-)         # status code and response size
    \s"(?P<referrer>[^"]*)"\s"(?P<agent>[^"]*)"$   # referrer and user agent
""", re.VERBOSE)


def parse(lines):
    """Yield (record, None) for good lines and (None, line) for bad ones."""
    for line in lines:
        line = line.strip()
        if not line:
            continue
        m = LINE.match(line)
        if not m:
            yield None, line
            continue
        r = m.groupdict()
        r["time"] = datetime.strptime(r["time"], "%d/%b/%Y:%H:%M:%S %z")
        r["status"] = int(r["status"])
        r["size"] = 0 if r["size"] == "-" else int(r["size"])
        r["path"] = re.sub(r"\?.*$", "", r["path"])       # drop the query string
        yield r, None


def main():
    records, bad = [], []
    for record, broken in parse(SAMPLE.splitlines()):
        if record:
            records.append(record)
        else:
            bad.append(broken)

    print(f"Parsed {len(records)} requests, {len(bad)} malformed line(s)")
    for line in bad:
        print("   malformed:", line[:60])

    statuses = Counter(r["status"] // 100 * 100 for r in records)
    print("\nStatus classes:", {f"{k // 100}xx": v for k, v in sorted(statuses.items())})

    print("\nTop pages:")
    for path, n in Counter(r["path"] for r in records).most_common(3):
        print(f"  {n}  {path}")

    total_kb = sum(r["size"] for r in records) / 1024
    print(f"\nBandwidth: {total_kb:.1f} KB")

    failed_logins = Counter(r["ip"] for r in records if r["path"] == "/login" and r["status"] == 401)
    probes = Counter(r["ip"] for r in records if re.search(r"wp-admin|\.env|phpmyadmin", r["path"]))
    print("\nSuspicious:")
    for ip, n in failed_logins.items():
        if n >= 3:
            print(f"  {ip}: {n} failed logins")
    for ip, n in probes.items():
        print(f"  {ip}: probing for sensitive files ({n} requests)")

    errors = [r for r in records if r["status"] >= 500]
    for r in errors:
        print(f"\nServer error at {r['time']:%H:%M:%S}: {r['method']} {r['path']}")


if __name__ == "__main__":
    main()
