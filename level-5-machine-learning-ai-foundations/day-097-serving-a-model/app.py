# app.py
# A FastAPI service that serves house-price predictions.
# Run: uvicorn app:app --reload   then open http://127.0.0.1:8000/docs

import json
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

HERE = Path(__file__).parent
state = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model once when the server starts, not on every request."""
    model_path = HERE / "model.joblib"
    if not model_path.exists():
        raise RuntimeError("model.joblib not found. Run 'python train_model.py' first.")
    state["model"] = joblib.load(model_path)
    state["metadata"] = json.loads((HERE / "model_metadata.json").read_text(encoding="utf-8"))
    yield
    state.clear()


app = FastAPI(title="House price API", version="1.0", lifespan=lifespan)


class House(BaseModel):
    size_m2: float = Field(gt=10, le=1000, description="Floor area in square metres")
    rooms: int = Field(ge=1, le=20)
    year_built: int | None = Field(default=None, ge=1800, le=2030, description="Leave out if unknown")
    distance_km: float = Field(ge=0, le=100, description="Distance from the city centre")
    neighbourhood: str = Field(min_length=1, examples=["Old Town"])
    house_type: Literal["flat", "terraced", "detached"]


class Prediction(BaseModel):
    price: float
    model_test_mae: int
    known_neighbourhood: bool


def predict_prices(houses: list[House]) -> list[Prediction]:
    df = pd.DataFrame([h.model_dump() for h in houses])
    prices = state["model"].predict(df)
    known = state["metadata"]["neighbourhoods"]
    return [Prediction(price=round(float(p), -2),
                       model_test_mae=state["metadata"]["test_mae"],
                       known_neighbourhood=h.neighbourhood in known)
            for h, p in zip(houses, prices)]


@app.get("/health")
def health():
    return {"status": "ok", "model_trained_at": state["metadata"]["trained_at"]}


@app.get("/model")
def model_info():
    return state["metadata"]


@app.post("/predict", response_model=Prediction)
def predict(house: House):
    return predict_prices([house])[0]


@app.post("/predict/batch", response_model=list[Prediction])
def predict_batch(houses: list[House]):
    if not houses:
        raise HTTPException(status_code=400, detail="Send at least one house")
    if len(houses) > 1000:
        raise HTTPException(status_code=413, detail="At most 1000 houses per request")
    return predict_prices(houses)
