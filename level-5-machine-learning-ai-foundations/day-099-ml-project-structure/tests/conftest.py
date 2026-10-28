from pathlib import Path

import pytest

from wine_ml.config import load_config

PROJECT = Path(__file__).parent.parent


@pytest.fixture
def cfg(tmp_path):
    """The real config, but writing artifacts to a temporary folder."""
    base = load_config(PROJECT / "config.toml")
    return type(base)(data=base.data, model=base.model, output_dir=tmp_path / "artifacts")
