"""Loading and splitting the data."""

import pandas as pd
from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split

from wine_ml.config import DataConfig

FEATURES = list(load_wine().feature_names)
CLASS_NAMES = ["cultivar A", "cultivar B", "cultivar C"]


def load_data() -> tuple[pd.DataFrame, pd.Series]:
    data = load_wine(as_frame=True)
    return data.data, data.target


def split(X: pd.DataFrame, y: pd.Series, cfg: DataConfig):
    return train_test_split(X, y, test_size=cfg.test_size, random_state=cfg.seed, stratify=y)
