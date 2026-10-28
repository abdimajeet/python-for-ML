"""Building the model from the config."""

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from wine_ml.config import ModelConfig


def build_model(cfg: ModelConfig, seed: int) -> Pipeline:
    if cfg.kind == "random_forest":
        estimator = RandomForestClassifier(n_estimators=cfg.n_estimators, max_depth=cfg.max_depth,
                                           random_state=seed)
    elif cfg.kind == "logistic_regression":
        estimator = LogisticRegression(C=cfg.C, max_iter=5000)
    else:
        raise ValueError(f"Unknown model kind: {cfg.kind}")
    return Pipeline([("scale", StandardScaler()), ("model", estimator)])
