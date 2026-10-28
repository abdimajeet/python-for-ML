# app.py
# Penguin species predictor: a JSON API plus a small web page.
# Run: uvicorn app:app --reload   then open http://127.0.0.1:8000

import json
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field

HERE = Path(__file__).parent
state = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not (HERE / "model.joblib").exists():
        raise RuntimeError("model.joblib not found. Run 'python train.py' first.")
    state["model"] = joblib.load(HERE / "model.joblib")
    state["meta"] = json.loads((HERE / "model_metadata.json").read_text(encoding="utf-8"))
    yield
    state.clear()


app = FastAPI(title="Penguin species predictor", version="1.0", lifespan=lifespan)


class Penguin(BaseModel):
    bill_length_mm: float = Field(gt=20, lt=80)
    bill_depth_mm: float = Field(gt=10, lt=30)
    flipper_length_mm: float = Field(gt=150, lt=260)
    body_mass_g: float = Field(gt=2000, lt=7000)
    island: Literal["Biscoe", "Dream", "Torgersen"]
    sex: Literal["Male", "Female"] | None = None


class Prediction(BaseModel):
    species: str
    confidence: float
    probabilities: dict[str, float]


@app.get("/health")
def health():
    meta = state["meta"]
    return {"status": "ok", "model": meta["model"], "test_accuracy": meta["test_accuracy"]}


@app.post("/predict", response_model=Prediction)
def predict(penguin: Penguin):
    row = pd.DataFrame([penguin.model_dump()])
    model = state["model"]
    proba = model.predict_proba(row)[0]
    probabilities = {species: round(float(p), 3) for species, p in zip(model.classes_, proba)}
    species = max(probabilities, key=probabilities.get)
    return Prediction(species=species, confidence=probabilities[species], probabilities=probabilities)


PAGE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Penguin predictor</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 34rem; margin: 2rem auto; padding: 0 1rem; }
  label { display: block; margin-top: .8rem; }
  input, select, button { font-size: 1rem; padding: .4rem; width: 100%; box-sizing: border-box; }
  button { margin-top: 1rem; cursor: pointer; }
  #result { margin-top: 1.2rem; font-size: 1.2rem; }
</style>
</head>
<body>
<h1>Which penguin is it?</h1>
<form id="form">
  <label>Bill length (mm) <input name="bill_length_mm" type="number" step="0.1" value="45"></label>
  <label>Bill depth (mm) <input name="bill_depth_mm" type="number" step="0.1" value="15"></label>
  <label>Flipper length (mm) <input name="flipper_length_mm" type="number" value="215"></label>
  <label>Body mass (g) <input name="body_mass_g" type="number" value="5000"></label>
  <label>Island <select name="island"><option>Biscoe</option><option>Dream</option><option>Torgersen</option></select></label>
  <label>Sex <select name="sex"><option value="">Unknown</option><option>Female</option><option>Male</option></select></label>
  <button>Predict</button>
</form>
<div id="result"></div>
<script>
document.getElementById("form").addEventListener("submit", async function (event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.target));
  for (const key of ["bill_length_mm", "bill_depth_mm", "flipper_length_mm", "body_mass_g"]) {
    data[key] = Number(data[key]);
  }
  if (!data.sex) delete data.sex;
  const response = await fetch("/predict", {
    method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(data)
  });
  const result = document.getElementById("result");
  if (!response.ok) { result.textContent = "Please check the values: they look out of range."; return; }
  const body = await response.json();
  result.textContent = body.species + " (" + Math.round(body.confidence * 100) + "% confident)";
});
</script>
</body>
</html>"""


@app.get("/", response_class=HTMLResponse)
def home():
    return PAGE
