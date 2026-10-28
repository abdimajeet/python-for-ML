# Day 30: Files and folders

**Level 2, Core Python Programming.** Project: **Downloads folder organiser**

Programs often need to work with folders full of files. Today you learn `pathlib`, the modern way to handle paths, and you build a tool that tidies a folder.

## Lesson

### Path objects

`from pathlib import Path`. A `Path` represents a location on disk. Join parts with `/`, which works on Windows and macOS alike. `Path.home()` is your home folder and `Path.cwd()` the current one.

```python
from pathlib import Path

downloads = Path.home() / "Downloads"
report = downloads / "report.pdf"
print(report)
print(report.name, report.stem, report.suffix)
```

Output:

```text
/home/abdy/Downloads/report.pdf
report.pdf report .pdf
```

### Asking questions

`exists()`, `is_file()`, `is_dir()`, `stat().st_size` (size in bytes). `Path(__file__).parent` is the folder the script itself is in, which fixes yesterday's working-directory problem.


### Listing a folder

`folder.iterdir()` gives every item directly inside. `folder.glob("*.txt")` matches a pattern; `rglob` also searches subfolders.

```python
for item in Path.cwd().iterdir():
    kind = "folder" if item.is_dir() else "file"
    print(f"{kind:<7}{item.name}")

python_files = list(Path.cwd().glob("*.py"))
```

### Making, moving and reading

`mkdir(parents=True, exist_ok=True)` creates a folder and doesn't fail if it already exists. `path.rename(new_path)` moves or renames. `path.read_text(encoding="utf-8")` and `write_text()` are shortcuts for small files.


### Be careful with real files

Code that moves or deletes files can do damage quickly. Professional tools offer a **dry run**: print what would happen, and only act after confirmation. Always test on a copy of a folder first.


## Exercises

1. Print the name and size in KB of every file in your current folder.

<details><summary>Solution</summary>

```python
from pathlib import Path
for p in Path.cwd().iterdir():
    if p.is_file():
        print(f"{p.name:<30}{p.stat().st_size / 1024:>8.1f} KB")
```

</details>

2. Create a folder `practice/2026/october` in one line.

<details><summary>Solution</summary>

```python
Path("practice/2026/october").mkdir(parents=True, exist_ok=True)
```

</details>

3. Count how many `.py` files are in your course folder, including subfolders.

<details><summary>Solution</summary>

```python
print(len(list(Path.cwd().rglob("*.py"))))
```

</details>

## Project: Downloads folder organiser

Sort the files in a folder into subfolders by type (Images, Documents, Audio, and so on). It starts in dry-run mode and shows the plan; it only moves files after you type `yes`. Files with the same name are never overwritten.

Files in this folder: `day30_organiser.py`.

### Key lines explained

- `CATEGORIES = {"Images": {".jpg", ...}}`: A dict of sets. The rules are data, so adding a category means adding one line.
- `path.suffix.lower()`: Makes `.JPG` and `.jpg` match the same rule.
- `def safe_target(...)`: If `photo.jpg` already exists in Images, the file becomes `photo (1).jpg`. Without this, `rename` could overwrite a file on some systems.
- `plan_moves then confirm`: The program separates **deciding** what to do from **doing** it. That makes the dry run possible and the logic easy to test.
- `not item.name.startswith(".")`: Skips hidden system files like `.DS_Store`.

### Stretch goals

- Add an undo log: write each move to a text file and add an option to reverse it.
- Sort Images further by year using the file's modification time.

## Test it

- [ ] Make a test folder with a few empty files of different types (create them with `Path("test/a.pdf").touch()`). Never test on your real Downloads first.
- [ ] Answer `no`: nothing should move.
- [ ] Run it twice with a duplicate file name.
- [ ] Give a folder path that doesn't exist.
