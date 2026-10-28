# Day 66: Regular expressions II

**Level 4, Advanced Python & Data Science Foundations.** Project: **Web server log parser**

Today you go beyond finding text: capture groups pull out the parts of a match, so one regex can turn a messy log line into structured data.

## Lesson

### Capture groups

Parentheses capture part of a match. `m.group(1)` is the first group, and `m.groups()` returns them all. `findall` with groups returns tuples.

```python
import re
m = re.search(r"(\d{4})-(\d{2})-(\d{2})", "Due 2026-11-03")
print(m.group(1), m.groups())
```

Output:

```text
2026 ('2026', '11', '03')
```

### Named groups

`(?P<name>...)` names a group. `m.group("name")` or `m.groupdict()` give readable access. Parsing a line into a dict in one step is the main use.

```python
pattern = r"(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})"
print(re.search(pattern, "Due 2026-11-03").groupdict())
```

Output:

```text
{'year': '2026', 'month': '11', 'day': '03'}
```

### Backreferences and substitution

In a replacement, `\1` or `\g<name>` inserts a captured group, so you can rearrange text.

```python
print(re.sub(r"(\d{2})/(\d{2})/(\d{4})", r"\3-\2-\1", "Born 14/03/2001"))
```

Output:

```text
Born 2001-03-14
```

### Greedy and lazy

`.*` is **greedy**: it matches as much as possible. `.*?` is **lazy**: as little as possible. On `<b>one</b> <b>two</b>`, `<b>.*</b>` matches everything, but `<b>.*?</b>` matches each tag pair separately.


### Readable patterns with VERBOSE

`re.VERBOSE` ignores whitespace in the pattern and allows `#` comments, so complex patterns can be laid out over several lines and explained.

```python
PRICE = re.compile(r"""
    (?P<currency>[$€£])     # currency symbol
    (?P<amount>\d+(?:\.\d{2})?)  # whole number, optional cents
""", re.VERBOSE)
```

## Exercises

1. Swap "Lastname, Firstname" to "Firstname Lastname" with `re.sub`.

<details><summary>Solution</summary>

```python
print(re.sub(r"(\w+), (\w+)", r"\2 \1", "Hassan, Amina"))
```

</details>

2. Parse `"temp=21.5C humidity=40%"` into a dict with named groups.

<details><summary>Solution</summary>

```python
m = re.search(r"temp=(?P<temp>[\d.]+)C humidity=(?P<humidity>\d+)%", "temp=21.5C humidity=40%")
print(m.groupdict())
```

</details>

3. Extract the contents of every `<b>...</b>` tag using a lazy quantifier.

<details><summary>Solution</summary>

```python
print(re.findall(r"<b>(.*?)</b>", "<b>one</b> and <b>two</b>"))
```

</details>

## Project: Web server log parser

Parse web server access logs in the standard "combined" format used by Apache and Nginx into structured records with a verbose, named-group regex. Then report status codes, top pages, bandwidth, suspicious IPs and malformed lines.

Files in this folder: `day66_access_log.py`.

### Key lines explained

- `re.VERBOSE with # comments`: A long pattern becomes readable: one line per log field, each explained.
- `(?P\d{1,3}(?:\.\d{1,3}){3})`: Four groups of 1 to 3 digits separated by dots. The inner `(?:...)` repeats without creating an extra capture group.
- `\[(?P[^\]]+)\]`: Square brackets are special, so they're escaped. `[^\]]+` means "everything up to the closing bracket".
- `datetime.strptime(r["time"], "%d/%b/%Y:%H:%M:%S %z")`: Turns the log's date text into a real datetime, including the timezone (`%z`).
- `yield None, line`: Bad lines aren't silently ignored: they're reported, which matters when parsing real data.

### Stretch goals

- Read a real log file line by line (some hosting providers let you download one) instead of SAMPLE.
- Report requests per minute and the average response size per page.

## Test it

- [ ] The broken line is reported as malformed.
- [ ] The 304 response with size `-` is parsed as size 0.
- [ ] 10.0.0.5 is flagged for failed logins and 203.0.113.9 for probing.
