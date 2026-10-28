import json

import numpy as np
import pytest

from wine_ml.config import ModelConfig
from wine_ml.data import FEATURES, load_data
from wine_ml.model import build_model
from wine_ml.predict import load_model, predict
from wine_ml.train import train


@pytest.mark.parametrize("kind", ["random_forest", "logistic_regression"])
def test_every_kind_trains_and_predicts(kind):
    X, y = load_data()
    model = build_model(ModelConfig(kind=kind), seed=0).fit(X, y)
    proba = model.predict_proba(X.head(10))
    assert proba.shape == (10, 3)
    assert np.allclose(proba.sum(axis=1), 1)


def test_training_is_reproducible(cfg):
    assert train(cfg) == train(cfg)


def test_accuracy_is_good_enough(cfg):
    assert train(cfg)["test_accuracy"] >= 0.9


def test_artifacts_are_saved(cfg):
    train(cfg)
    record = json.loads((cfg.output_dir / "metrics.json").read_text())
    assert record["config"]["model"]["kind"] == cfg.model.kind
    assert "sklearn" in record["versions"]


def test_predict_from_saved_model(cfg):
    train(cfg)
    X, _ = load_data()
    result = predict(load_model(cfg.output_dir), X.head(5))
    assert len(result) == 5
    assert result["confidence"].between(0, 1).all()


def test_predict_rejects_missing_columns(cfg):
    train(cfg)
    X, _ = load_data()
    with pytest.raises(ValueError, match="Missing columns"):
        predict(load_model(cfg.output_dir), X.drop(columns=FEATURES[0]).head(2))
