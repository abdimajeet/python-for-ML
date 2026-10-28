from pathlib import Path

import pytest

from wine_ml.config import DataConfig, ModelConfig, load_config

PROJECT = Path(__file__).parent.parent


def test_project_config_loads():
    cfg = load_config(PROJECT / "config.toml")
    assert cfg.model.kind == "random_forest"
    assert 0 < cfg.data.test_size < 1


def test_rejects_unknown_model_kind():
    with pytest.raises(ValueError, match="model.kind"):
        ModelConfig(kind="magic")


@pytest.mark.parametrize("size", [0, 1, 1.5, -0.2])
def test_rejects_bad_test_size(size):
    with pytest.raises(ValueError):
        DataConfig(test_size=size)


def test_reads_toml_file(tmp_path):
    path = tmp_path / "c.toml"
    path.write_text('[model]\nkind = "logistic_regression"\nC = 0.5\n')
    cfg = load_config(path)
    assert cfg.model.kind == "logistic_regression"
    assert cfg.model.C == 0.5
    assert cfg.output_dir == tmp_path / "artifacts"
