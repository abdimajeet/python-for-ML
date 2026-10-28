# Day 99: ML project structure

**Level 5, Machine Learning & AI Foundations.** Project: **Refactor an ML project into a package**

A single script is fine for experiments, but real ML code needs to be reproducible, configurable, testable and installable. Today you'll turn a model into a proper Python package with a config file, a command-line interface and tests: the structure professional ML projects use.

## Lesson

### Why structure matters

A notebook that worked once is hard to rerun, review or share. Splitting code into modules with clear jobs (load data, build the model, train, predict) makes each part testable and reusable. A `src/` layout keeps your package separate from scripts and tests, so tests run against the installed package, as a user would.


### Reproducibility

Someone (including future you) should get the same results from the same code and data. Fix every random seed (`random_state`), record library versions, keep settings in a config file instead of scattered through the code, and save the config alongside each trained model and its metrics. Then any result can be traced back to exactly how it was produced.


### Config files with TOML

TOML is a simple, readable config format, and Python 3.11+ reads it with the built-in `tomllib`. Loading the config into dataclasses gives you attribute access, type hints and one place to validate it.

```python
import tomllib

text = """
[model]
kind = "random_forest"
n_estimators = 200
"""
config = tomllib.loads(text)
print(config["model"]["kind"], config["model"]["n_estimators"])
```

Output:

```text
random_forest 200
```

### pyproject.toml and installable packages

`pyproject.toml` describes your package: name, version, dependencies, and command-line entry points. `pip install -e .` installs it in **editable** mode, so code changes take effect immediately. A `[project.scripts]` entry like `wine-ml = "wine_ml.cli:main"` creates a real terminal command.


### Testing ML code

You can't assert an exact accuracy, but you can test a lot: the config loads and rejects bad values; the model builds for every supported kind; predictions have the right shape and valid labels; probabilities add up to 1; training twice with the same seed gives identical results; and accuracy stays above a sensible minimum. These tests catch most of the bugs that silently ruin ML projects.


## Exercises

1. Write a dataclass `TrainConfig` with `seed: int = 42` and `test_size: float = 0.2`, and a `__post_init__` that rejects a test_size outside 0 to 1.

<details><summary>Solution</summary>

```python
from dataclasses import dataclass

@dataclass
class TrainConfig:
    seed: int = 42
    test_size: float = 0.2

    def __post_init__(self):
        if not 0 < self.test_size < 1:
            raise ValueError("test_size must be between 0 and 1")
```

</details>

2. Write a pytest test that checks training twice with the same seed gives the same predictions.

<details><summary>Solution</summary>

```python
def test_reproducible():
    a = train_model(seed=1).predict(X_test)
    b = train_model(seed=1).predict(X_test)
    assert (a == b).all()
```

</details>

3. What's the difference between `pip install .` and `pip install -e .`?

<details><summary>Solution</summary>

```python
# pip install .     copies the package into site-packages; later code edits need a reinstall.
# pip install -e .  links to your source folder; edits take effect immediately (editable).
```

</details>

## Project: Refactor an ML project into a package

Turn a wine classifier into a small, professional package called `wine_ml`: settings in `config.toml`, separate modules for config, data, model, training and prediction, a `wine-ml` command with `train` and `predict` subcommands, saved artifacts with metrics and the config used, and a pytest suite. From the `day99_wine_ml` folder run `pip install -e ".[dev]"`, then `wine-ml train`, `wine-ml predict new_wines.csv` and `pytest -v`.

Files in this folder: `pyproject.toml`, `config.toml`, `new_wines.csv`, `src/wine_ml/__init__.py`, `src/wine_ml/__main__.py`, `src/wine_ml/config.py`, `src/wine_ml/data.py`, `src/wine_ml/model.py`, `src/wine_ml/train.py`, `src/wine_ml/predict.py`, `src/wine_ml/cli.py`, `tests/conftest.py`, `tests/test_config.py`, `tests/test_model.py`, `README.md`.

### Key lines explained

- `[project.scripts] wine-ml = "wine_ml.cli:main"`: After `pip install -e .`, typing `wine-ml` in the terminal calls `main()` in `cli.py`.
- `@dataclass(frozen=True)`: Config objects can't be changed after loading, so no code can quietly alter a setting halfway through a run.
- `output_dir = path.parent / output_dir`: Relative paths in the config are resolved next to the config file, so the command works from any folder.
- `record = {"metrics": ..., "config": ..., "versions": ...}`: Saving the config and library versions with every model is what makes a result reproducible months later.
- `def main(argv: list[str] | None = None) -> int:`: Taking `argv` as a parameter lets tests call `main(["train"])` directly; returning an exit code lets scripts detect failures.
- `def test_training_is_reproducible(cfg):`: Two runs with the same config must give identical metrics. If this test ever fails, some randomness isn't seeded.

### Stretch goals

- Add an `evaluate` subcommand that loads the saved model and prints a classification report.
- Add a third model kind (for example `knn`) with its settings in the config, plus a test.
- Add a GitHub Actions workflow that runs `pytest` on every push (Day 55 skills).

## Test it

- [ ] `pip install -e ".[dev]"`, then `pytest -v`: 14 tests should pass.
- [ ] `wine-ml train` then `wine-ml predict new_wines.csv`: the three rows should be cultivars A, B and C.
- [ ] Change `kind` to `logistic_regression` in `config.toml`, retrain, and compare `artifacts/metrics.json`.
- [ ] Set `kind = "magic"` and check you get a clear error instead of a traceback.
