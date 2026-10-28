# Day 39: Virtual environments and pip

**Level 2, Core Python Programming.** Project: **QR code generator**

Python's real power comes from the hundreds of thousands of third-party packages on PyPI. Today you learn to install them safely in a virtual environment.

## Lesson

### Why virtual environments

Different projects need different packages and versions. A **virtual environment** (venv) is a private folder of packages for one project, so installing something for one project can't break another. Every serious Python project, especially ML projects, uses one.


### Create and activate

From your project folder, create a venv called `.venv`, then activate it. Your prompt shows `(.venv)` when it's active. `deactivate` turns it off. In VS Code, run **Python: Select Interpreter** and choose the `.venv` one.

```python
python -m venv .venv

# Windows (PowerShell)
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

### pip

With the venv active, `pip` installs into it. `pip list` shows what's installed, and `pip show qrcode` gives details. Packages come from **pypi.org**; check a package's page before installing, because anyone can publish there.

```python
pip install "qrcode[pil]"
pip list
pip install --upgrade qrcode
pip uninstall qrcode
```

### requirements.txt

`pip freeze > requirements.txt` records the exact versions you installed. Anyone (including future you) can recreate the environment with `pip install -r requirements.txt`. Commit `requirements.txt` to Git, but never the `.venv` folder: add `.venv/` to `.gitignore`.

```python
pip freeze > requirements.txt
pip install -r requirements.txt
```

## Exercises

1. Create a venv in a new folder `day39`, activate it, and run `pip list`. How many packages are there?

<details><summary>Solution</summary>

```python
# Only pip itself (and maybe setuptools): a fresh environment is nearly empty.
```

</details>

2. Install the `rich` package and print a coloured message with it.

<details><summary>Solution</summary>

```python
# pip install rich
from rich import print
print("[bold green]Day 39 complete![/bold green]")
```

</details>

3. Create `requirements.txt` and a `.gitignore` that ignores `.venv/`.

<details><summary>Solution</summary>

```python
pip freeze > requirements.txt
echo ".venv/" > .gitignore
```

</details>

## Project: QR code generator

Use the third-party `qrcode` package to turn text, links or Wi-Fi details into QR code images, and preview the code right in the terminal. Set it up properly with a venv and `requirements.txt`.

Files in this folder: `qr_maker.py`.

**setup (terminal)**

```bash
mkdir day39_qr
cd day39_qr
python -m venv .venv
# activate it (see the lesson), then:
pip install "qrcode[pil]"
pip freeze > requirements.txt
echo ".venv/" > .gitignore
```

### Key lines explained

- `import qrcode`: Third-party imports go after standard-library imports, separated by a blank line. This only works when the venv with qrcode installed is active.
- `qrcode.QRCode(border=2)`: Creating an object and then calling its methods (`add_data`, `make`) is how many libraries work. You'll build your own classes on Day 41.
- `qr.print_ascii(invert=True)`: Draws the code with text blocks so you can scan it straight from the terminal.
- `"WIFI:T:WPA;S:...;P:...;;"`: A real standard: scanning this with a phone camera offers to join the network.
- `requirements.txt`: Lists qrcode and its dependency (Pillow) with exact versions.

### Stretch goals

- Read a list of links from a text file and create one QR image per line.
- Add a coloured version using `fill_color="darkblue"`.

## Test it

- [ ] Scan the terminal preview and the PNG with your phone.
- [ ] Deactivate the venv and run the script: read the `ModuleNotFoundError`, then reactivate.
- [ ] Delete `.venv`, recreate it, and reinstall with `pip install -r requirements.txt`.
