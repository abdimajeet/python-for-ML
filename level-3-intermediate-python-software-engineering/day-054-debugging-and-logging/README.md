# Day 54: Debugging and logging

**Level 3, Intermediate Python & Software Engineering.** Project: **Add logging to the folder organiser**

Today you level up your debugging with VS Code's debugger, and replace scattered `print` calls with the `logging` module.

## Lesson

### The debugger

Click in the gutter left of a line number to set a **breakpoint** (a red dot). Press **F5** and choose "Python File". The program pauses at the breakpoint and you can see every variable. **F10** steps over a line, **F11** steps into a function call, **Shift+F11** steps out, and F5 continues. The **Debug Console** lets you run any expression in the paused program.


### breakpoint() and pdb

Calling `breakpoint()` anywhere in your code pauses it in the terminal debugger, pdb. Type `p name` to print a variable, `n` for the next line, `s` to step in, `c` to continue and `q` to quit. It works even without VS Code, for example on a server.


### Why logging instead of print

`print` debugging has to be deleted afterwards and can't be switched on or off. `logging` messages have **levels** (DEBUG, INFO, WARNING, ERROR, CRITICAL), include timestamps and source, and can go to the screen, a file or both. You choose how much detail to see without changing code.

```python
import logging

logging.basicConfig(level=logging.INFO,
                    format="%(asctime)s %(levelname)-8s %(name)s: %(message)s")
log = logging.getLogger(__name__)

log.debug("Hidden at INFO level")
log.info("Starting")
log.warning("Disk almost full")
log.error("Could not open file")
```

### Good logging habits

Create one logger per module with `logging.getLogger(__name__)`. Use `log.exception("...")` inside an `except` block to log the full traceback. Pass values as arguments, `log.info("Moved %s", name)`, rather than building f-strings, so the text is only built if the message is shown. Configure logging once, in `main()`, not in library modules.


## Exercises

1. Set a breakpoint inside the loop of your Day 36 bubble sort and watch the list change step by step in the debugger.

<details><summary>Solution</summary>

```python
# No code: use F5, then F10 repeatedly, and watch the Variables panel.
```

</details>

2. Configure logging to write to `app.log` and also show warnings on screen.

<details><summary>Solution</summary>

```python
import logging

file_handler = logging.FileHandler("app.log", encoding="utf-8")
file_handler.setLevel(logging.DEBUG)
screen_handler = logging.StreamHandler()
screen_handler.setLevel(logging.WARNING)
logging.basicConfig(level=logging.DEBUG, handlers=[file_handler, screen_handler])
```

</details>

3. Log a ZeroDivisionError with its traceback.

<details><summary>Solution</summary>

```python
try:
    1 / 0
except ZeroDivisionError:
    logging.exception("Calculation failed")
```

</details>

## Project: Add logging to the folder organiser

Upgrade the Day 30 organiser: replace prints with logging, write a detailed log file for every run, add a `--verbose` flag for DEBUG output on screen, and log failures with tracebacks while carrying on with the other files. Command-line flags use `argparse` from the standard library.

Files in this folder: `day54_organiser_logging.py`.

### Key lines explained

- `log = logging.getLogger("organiser")`: A named logger. Messages show where they came from, and you can tune each module's level separately.
- `screen.setLevel(...) / file.setLevel(logging.DEBUG)`: Two handlers with different levels: the screen stays quiet unless `--verbose`, while the file always keeps every detail.
- `log.info("Moved %s -> %s/", item.name, dest_folder.name)`: Values are passed separately; logging fills them in only if the message is actually shown.
- `except OSError: log.exception(...)`: Logs the full traceback to the file, counts the failure, and continues with the next file instead of stopping.
- `argparse.ArgumentParser`: Turns command-line text into `args.folder`, `args.apply` and `args.verbose`, and creates `--help` automatically.

### Stretch goals

- Use `logging.handlers.RotatingFileHandler` so the log never grows beyond 1 MB.
- Add logging to your Day 40 finance app's storage module.

## Test it

- [ ] `python day54_organiser_logging.py --help`
- [ ] Run on a test folder without `--apply`, then with it, then with `-v`.
- [ ] Open `organiser.log` and read the timestamps.
- [ ] Set a breakpoint in `organise` and step through one file in the debugger.
