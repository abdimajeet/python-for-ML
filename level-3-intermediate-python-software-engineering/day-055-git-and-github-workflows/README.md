# Day 55: Git and GitHub workflows

**Level 3, Intermediate Python & Software Engineering.** Project: **Notes app developed on feature branches**

Git tracks every version of your code, and GitHub shares it. Today you learn the professional workflow: branches, commits, pull requests and merging. This is also when we set up your `python-100-days` repository.

## Lesson

### Core ideas

A **repository** (repo) is a project folder whose history Git tracks. A **commit** is a saved snapshot with a message. The **staging area** is where you choose what goes into the next commit. A **branch** is a separate line of work. **origin** is the copy of your repo on GitHub.


### Everyday commands

Install Git from **git-scm.com**, then set your name and email once. `git status` is the command you'll run most: it tells you what changed and what to do next.

```python
git config --global user.name "AbdyRahman"
git config --global user.email "you@example.com"

git init                      # start tracking this folder
git status                    # what changed?
git add notes.py              # stage a file
git commit -m "Add notes app" # save a snapshot
git log --oneline             # history
```

### Branches

Never build new features directly on `main`. Create a branch, work there, and merge when it's done and tested. If the experiment fails, just delete the branch.

```python
git switch -c feature/search   # create and move to a new branch
# ...edit, add, commit...
git switch main
git merge feature/search
git branch -d feature/search
```

### GitHub and pull requests

Create an empty repository on github.com, connect it, and push. A **pull request** (PR) asks to merge a branch into main. It shows the changes for review and is where teams discuss code. Even working alone, PRs give you a clean history of features.

```python
git remote add origin https://github.com/AbdyRahmann/python-100-days.git
git push -u origin main

git switch -c feature/tags
# ...work and commit...
git push -u origin feature/tags
# then open a pull request on github.com and merge it
```

### Good commit habits

Commit small, working steps. Write messages in the imperative, saying what the commit does: "Add search command", not "stuff". Keep secrets, data files and `.venv` out of Git with `.gitignore`. Pull before you start work: `git pull`.


## Exercises

1. Create a practice folder, run `git init`, commit a file, change it, and use `git diff` before committing again.

<details><summary>Solution</summary>

```python
mkdir git-practice && cd git-practice
git init
echo "print('v1')" > app.py
git add app.py
git commit -m "Add first version"
echo "print('v2')" > app.py
git diff
git commit -am "Update to v2"
git log --oneline
```

</details>

2. Make a branch, change a file there, switch back to main and see the change disappear, then merge it.

<details><summary>Solution</summary>

```python
git switch -c experiment
echo "print('experiment')" >> app.py
git commit -am "Try an experiment"
git switch main
cat app.py          # no experiment line
git merge experiment
cat app.py          # now it's there
```

</details>

3. Write a `.gitignore` for a Python project.

<details><summary>Solution</summary>

```python
.venv/
__pycache__/
*.pyc
.env
*.log
.pytest_cache/
.mypy_cache/
```

</details>

## Project: Notes app developed on feature branches

Build a command-line notes app in three features, each on its own branch with its own pull request: (1) add and list notes, (2) search, (3) tags. The terminal steps show the workflow; the code is the finished app after all three merges. When you're ready to create the GitHub repository, tell me and we'll do it together.

Files in this folder: `notes.py`.

**workflow (terminal)**

```bash
# One-time setup
mkdir day55_notes && cd day55_notes
git init
printf ".venv/\n__pycache__/\nnotes.json\n" > .gitignore
git add .gitignore
git commit -m "Add .gitignore"

# Feature 1: add and list
git switch -c feature/add-list
# ...write add and list commands in notes.py...
git add notes.py
git commit -m "Add add and list commands"
git push -u origin feature/add-list     # open a PR on GitHub, review, merge
git switch main
git pull

# Feature 2: search
git switch -c feature/search
git commit -am "Add search command"
git push -u origin feature/search       # PR, merge, pull

# Feature 3: tags
git switch -c feature/tags
git commit -am "Add tags and filter by tag"
git push -u origin feature/tags         # PR, merge, pull

git log --oneline --graph
```

### Key lines explained

- `git switch -c feature/add-list`: Each feature lives on its own branch until it works. `main` always holds working code.
- `notes.json in .gitignore`: Your personal notes are data, not code, so they stay out of the repository.
- `sub = parser.add_subparsers(...)`: argparse sub-commands give the app a `git`-like interface: `notes.py add`, `notes.py list`.
- `p.set_defaults(func=cmd_add)`: Each sub-command remembers which function handles it, so `main` just calls `args.func`. No if/elif chain.
- `max((n["id"] for n in notes), default=0) + 1`: `default=0` handles the empty list, so the first note gets id 1.

### Stretch goals

- Add an `edit` command on a new branch, using a pull request.
- Deliberately create a merge conflict: change the same line on two branches, merge, and resolve it.

## Test it

- [ ] `python notes.py add "Learn git" --tags study`, then `list`, `list --tag study`, `search git`, `delete 1`.
- [ ] `git log --oneline --graph` shows your three feature merges.
- [ ] Tell me when you want the GitHub repository created and we'll set it up together.
