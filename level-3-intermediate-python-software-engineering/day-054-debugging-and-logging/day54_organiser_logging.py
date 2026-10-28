# day54_organiser_logging.py
# The Day 30 organiser with logging and command-line options.

import argparse
import logging
from pathlib import Path

log = logging.getLogger("organiser")

CATEGORIES = {
    "Images": {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"},
    "Documents": {".pdf", ".docx", ".doc", ".txt", ".md", ".pptx", ".xlsx", ".csv"},
    "Audio": {".mp3", ".wav", ".m4a"},
    "Video": {".mp4", ".mov", ".mkv"},
    "Archives": {".zip", ".rar", ".7z", ".tar", ".gz"},
    "Code": {".py", ".js", ".html", ".css", ".ipynb", ".json"},
}


def setup_logging(verbose, log_file):
    screen = logging.StreamHandler()
    screen.setLevel(logging.DEBUG if verbose else logging.INFO)
    screen.setFormatter(logging.Formatter("%(levelname)-7s %(message)s"))

    file = logging.FileHandler(log_file, encoding="utf-8")
    file.setLevel(logging.DEBUG)
    file.setFormatter(logging.Formatter("%(asctime)s %(levelname)-7s %(message)s"))

    logging.basicConfig(level=logging.DEBUG, handlers=[screen, file])


def category_for(path):
    suffix = path.suffix.lower()
    for name, suffixes in CATEGORIES.items():
        if suffix in suffixes:
            return name
    return "Other"


def safe_target(folder, filename):
    target = folder / filename
    counter = 1
    while target.exists():
        target = folder / f"{Path(filename).stem} ({counter}){Path(filename).suffix}"
        counter += 1
    return target


def organise(folder, dry_run=True):
    moved = failed = skipped = 0
    for item in sorted(folder.iterdir()):
        if not item.is_file() or item.name.startswith("."):
            log.debug("Skipping %s", item.name)
            skipped += 1
            continue

        dest_folder = folder / category_for(item)
        target = safe_target(dest_folder, item.name)
        if target.name != item.name:
            log.warning("%s already exists in %s; renaming to %s",
                        item.name, dest_folder.name, target.name)

        if dry_run:
            log.info("Would move %s -> %s/", item.name, dest_folder.name)
            continue
        try:
            dest_folder.mkdir(exist_ok=True)
            item.rename(target)
            log.info("Moved %s -> %s/", item.name, dest_folder.name)
            moved += 1
        except OSError:
            log.exception("Failed to move %s", item.name)
            failed += 1

    log.info("Done: %d moved, %d failed, %d skipped", moved, failed, skipped)
    return moved, failed


def main():
    parser = argparse.ArgumentParser(description="Sort files into folders by type.")
    parser.add_argument("folder", nargs="?", default=str(Path.home() / "Downloads"))
    parser.add_argument("--apply", action="store_true", help="actually move files")
    parser.add_argument("-v", "--verbose", action="store_true", help="show debug output")
    args = parser.parse_args()

    folder = Path(args.folder).expanduser()
    setup_logging(args.verbose, Path(__file__).parent / "organiser.log")
    log.debug("Arguments: %s", args)

    if not folder.is_dir():
        log.error("%s is not a folder", folder)
        return
    if not args.apply:
        log.info("Dry run. Add --apply to move files.")
    organise(folder, dry_run=not args.apply)


if __name__ == "__main__":
    main()
