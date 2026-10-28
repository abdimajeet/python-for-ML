"""Train, evaluate and save a model with everything needed to reproduce it."""

import json
import logging
import platform

import joblib
import sklearn
from sklearn.metrics import accuracy_score, f1_score
from sklearn.model_selection import cross_val_score

from wine_ml import __version__
from wine_ml.config import Config
from wine_ml.data import load_data, split
from wine_ml.model import build_model

log = logging.getLogger(__name__)


def train(cfg: Config) -> dict:
    X, y = load_data()
    X_train, X_test, y_train, y_test = split(X, y, cfg.data)
    model = build_model(cfg.model, seed=cfg.data.seed)

    cv_scores = cross_val_score(model, X_train, y_train, cv=5)
    log.info("Cross-validated accuracy %.3f ± %.3f", cv_scores.mean(), cv_scores.std())
    model.fit(X_train, y_train)
    pred = model.predict(X_test)

    metrics = {
        "cv_accuracy": round(float(cv_scores.mean()), 4),
        "test_accuracy": round(float(accuracy_score(y_test, pred)), 4),
        "test_f1_macro": round(float(f1_score(y_test, pred, average="macro")), 4),
        "n_train": len(X_train),
        "n_test": len(X_test),
    }
    cfg.output_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, cfg.output_dir / "model.joblib")
    record = {
        "metrics": metrics,
        "config": cfg.to_dict(),
        "versions": {"wine_ml": __version__, "sklearn": sklearn.__version__,
                     "python": platform.python_version()},
    }
    (cfg.output_dir / "metrics.json").write_text(json.dumps(record, indent=2), encoding="utf-8")
    log.info("Saved model and metrics to %s", cfg.output_dir)
    return metrics
