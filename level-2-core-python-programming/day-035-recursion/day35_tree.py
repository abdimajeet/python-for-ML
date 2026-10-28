# day35_tree.py
# Prints a folder as a tree using recursion.

from pathlib import Path

SKIP = {".git", "__pycache__", ".venv", "node_modules"}


def human_size(num_bytes):
    for unit in ("B", "KB", "MB", "GB"):
        if num_bytes < 1024:
            return f"{num_bytes:.0f} {unit}"
        num_bytes /= 1024
    return f"{num_bytes:.1f} TB"


def tree(folder, prefix="", depth=0, max_depth=3):
    """Print the contents of folder. Returns (files, folders, bytes)."""
    try:
        items = sorted(folder.iterdir(), key=lambda p: (p.is_file(), p.name.lower()))
    except PermissionError:
        print(prefix + "└── [permission denied]")
        return 0, 0, 0

    items = [p for p in items if p.name not in SKIP and not p.name.startswith(".")]
    files, folders, size = 0, 0, 0

    for index, item in enumerate(items):
        is_last = index == len(items) - 1
        branch = "└── " if is_last else "├── "

        if item.is_dir():
            folders += 1
            print(f"{prefix}{branch}{item.name}/")
            if depth + 1 < max_depth:
                extension = "    " if is_last else "│   "
                f, d, s = tree(item, prefix + extension, depth + 1, max_depth)
                files, folders, size = files + f, folders + d, size + s
        else:
            item_size = item.stat().st_size
            files += 1
            size += item_size
            print(f"{prefix}{branch}{item.name}  ({human_size(item_size)})")

    return files, folders, size


def main():
    answer = input("Folder (blank for this one): ").strip()
    root = Path(answer).expanduser() if answer else Path.cwd()
    if not root.is_dir():
        print("That isn't a folder.")
        return
    max_depth = int(input("How many levels deep? ") or 3)

    print(f"{root.name}/")
    files, folders, size = tree(root, max_depth=max_depth)
    print(f"\n{folders} folders, {files} files, {human_size(size)} shown")


if __name__ == "__main__":
    main()
