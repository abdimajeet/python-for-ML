"""Load and validate settings from a TOML file."""

import tomllib
from dataclasses import asdict, dataclass
from pathlib import Path

MODEL_KINDS = ("random_forest", "logistic_regression")


@dataclass(frozen=True)
class DataConfig:
    test_size: float = 0.25
    seed: int = 0

    def __post_init__(self):
        if not 0 < self.test_size < 1:
            raise ValueError(f"data.test_size must be between 0 and 1, got {self.test_size}")


@dataclass(frozen=True)
class ModelConfig:
    kind: str = "random_forest"
    n_estimators: int = 100
    max_depth: int | None = None
    C: float = 1.0

    def __post_init__(self):
        if self.kind not in MODEL_KINDS:
            raise ValueError(f"model.kind must be one of {MODEL_KINDS}, got {self.kind!r}")


@dataclass(frozen=True)
class Config:
    data: DataConfig
    model: ModelConfig
    output_dir: Path

    def to_dict(self) -> dict:
        return {"data": asdict(self.data), "model": asdict(self.model), "output_dir": str(self.output_dir)}


def load_config(path: str | Path) -> Config:
    path = Path(path)
    with path.open("rb") as f:
        raw = tomllib.load(f)
    output_dir = Path(raw.get("output", {}).get("dir", "artifacts"))
    if not output_dir.is_absolute():
        output_dir = path.parent / output_dir          # relative to the config file
    return Config(
        data=DataConfig(**raw.get("data", {})),
        model=ModelConfig(**raw.get("model", {})),
        output_dir=output_dir,
    )
