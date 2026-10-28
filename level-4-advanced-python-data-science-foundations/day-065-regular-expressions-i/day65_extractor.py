# day65_extractor.py
# Finds contact details in text with regular expressions.

import re
import sys
from pathlib import Path

SAMPLE = """
Contact Amina at Amina.Hassan@example.com or amina.hassan@EXAMPLE.com.
Sales: sales-team@shop.co.uk, phone +252 61 234 5678 or (061) 234-5678.
Omar's mobile is 0612345678; office line +44 20 7946 0958.
Website https://www.example.com/contact and http://shop.co.uk/sale?id=7.
Meeting on 2026-11-03, follow-up 15/11/2026. Invoice #4521 total 99.50.
"""

EMAIL = re.compile(r"\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b")
PHONE = re.compile(r"(?:\+\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s-]?\d{2,4}[\s-]?\d{3,4}(?:[\s-]?\d{3,4})?")
URL = re.compile(r"https?://[^\s,]+[^\s,.]")
DATE_ISO = re.compile(r"\b\d{4}-\d{2}-\d{2}\b")
DATE_DMY = re.compile(r"\b(\d{1,2})/(\d{1,2})/(\d{4})\b")


def unique(items):
    """Remove duplicates but keep the original order."""
    return list(dict.fromkeys(items))


def find_emails(text):
    return unique(m.lower() for m in EMAIL.findall(text))


def find_phones(text):
    phones = []
    for match in PHONE.findall(text):
        digits = re.sub(r"\D", "", match)
        if 9 <= len(digits) <= 15:
            phones.append(("+" if match.strip().startswith("+") else "") + digits)
    return unique(phones)


def find_urls(text):
    return unique(URL.findall(text))


def find_dates(text):
    dates = DATE_ISO.findall(text)
    dates += [f"{y}-{int(m):02d}-{int(d):02d}" for d, m, y in DATE_DMY.findall(text)]
    return unique(dates)


def redact(text):
    text = EMAIL.sub("[email]", text)
    text = URL.sub("[link]", text)
    return PHONE.sub(lambda m: "[phone]" if len(re.sub(r"\D", "", m.group())) >= 9 else m.group(), text)


def main():
    text = Path(sys.argv[1]).read_text(encoding="utf-8") if len(sys.argv) > 1 else SAMPLE

    for label, values in [("Emails", find_emails(text)), ("Phones", find_phones(text)),
                          ("URLs", find_urls(text)), ("Dates", find_dates(text))]:
        print(f"{label} ({len(values)}):")
        for v in values:
            print("  ", v)

    print("\nRedacted text:")
    print(redact(text).strip())


if __name__ == "__main__":
    main()
