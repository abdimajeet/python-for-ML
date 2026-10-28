# day30_organiser.py
# Sorts files into subfolders by type, with a dry run first.

from pathlib import Path

CATEGORIES = {
    "Images": {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"},
    "Documents": {".pdf", ".docx", ".doc", ".txt", ".md", ".pptx", ".xlsx", ".csv"},
    "Audio": {".mp3", ".wav", ".m4a"},
    "Video": {".mp4", ".mov", ".mkv"},
    "Archives": {".zip", ".rar", ".7z", ".tar", ".gz"},
    "Code": {".py", ".js", ".html", ".css", ".ipynb", ".json"},
}


def category_for(path):
    suffix = path.suffix.lower()
    for name, suffixes in CATEGORIES.items():
        if suffix in suffixes:
            return name
    return "Other"


def safe_target(folder, filename):
    """Return a path in folder that doesn't exist yet, adding (1), (2)..."""
    target = folder / filename
    counter = 1
    while target.exists():
        target = folder / f"{Path(filename).stem} ({counter}){Path(filename).suffix}"
        counter += 1
    return target


def plan_moves(folder):
    moves = []
    for item in sorted(folder.iterdir()):
        if item.is_file() and not item.name.startswith("."):
            moves.append((item, folder / category_for(item)))
    return moves


def main():
    answer = input("Folder to organise (blank for Downloads): ").strip()
    folder = Path(answer).expanduser() if answer else Path.home() / "Downloads"

    if not folder.is_dir():
        print(f"{folder} is not a folder.")
        return

    moves = plan_moves(folder)
    if not moves:
        print("Nothing to organise.")
        return

    print(f"\nDry run: {len(moves)} file(s) would be moved:")
    for source, dest_folder in moves:
        print(f"  {source.name:<40} → {dest_folder.name}/")

    if input("\nType yes to move them: ").strip().lower() != "yes":
        print("Nothing was moved.")
        return

    for source, dest_folder in moves:
        dest_folder.mkdir(exist_ok=True)
        source.rename(safe_target(dest_folder, source.name))
    print(f"Moved {len(moves)} file(s).")


main()
