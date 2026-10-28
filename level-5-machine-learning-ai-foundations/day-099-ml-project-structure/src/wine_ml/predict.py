"""Load a trained model and make predictions."""

from pathlib import Path

import joblib
import pandas as pd

from wine_ml.data import CLASS_NAMES, FEATURES


def load_model(output_dir: Path):
    path = Path(output_dir) / "model.joblib"
    if not path.exists():
        raise FileNotFoundError(f"No model at {path}. Run 'wine-ml train' first.")
    return joblib.load(path)


def predict(model, rows: pd.DataFrame) -> pd.DataFrame:
    missing = set(FEATURES) - set(rows.columns)
    if missing:
        raise ValueError(f"Missing columns: {sorted(missing)}")
    proba = model.predict_proba(rows[FEATURES])
    best = proba.argmax(axis=1)
    return pd.DataFrame({
        "prediction": [CLASS_NAMES[i] for i in best],
        "confidence": proba.max(axis=1).round(3),
    })
