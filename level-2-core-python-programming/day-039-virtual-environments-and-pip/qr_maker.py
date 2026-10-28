# qr_maker.py
# Creates QR code images with the third-party qrcode package.

from pathlib import Path

import qrcode

OUTPUT = Path(__file__).parent / "codes"


def wifi_text(name, password, security="WPA"):
    """The standard text format phones understand for joining Wi-Fi."""
    return f"WIFI:T:{security};S:{name};P:{password};;"


def make_qr(data, filename):
    qr = qrcode.QRCode(border=2)
    qr.add_data(data)
    qr.make(fit=True)

    qr.print_ascii(invert=True)          # preview in the terminal

    OUTPUT.mkdir(exist_ok=True)
    path = OUTPUT / f"{filename}.png"
    qr.make_image(fill_color="black", back_color="white").save(path)
    return path


def main():
    print("1) Text or link  2) Wi-Fi login")
    choice = input("Choose: ").strip()
    if choice == "2":
        data = wifi_text(input("Network name: "), input("Password: "))
    else:
        data = input("Text or link: ").strip()

    if not data:
        print("Nothing to encode.")
        return

    name = input("File name (no extension): ").strip() or "qr"
    path = make_qr(data, name)
    print(f"Saved {path}")


if __name__ == "__main__":
    main()
