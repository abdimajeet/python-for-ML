# Day 97: Serving a model

**Level 5, Machine Learning & AI Foundations.** Project: **Prediction API**

A model on your laptop helps nobody else. Today you'll serve one as a web API with FastAPI, so any app, website or colleague can send data and get predictions back, and you'll test the API automatically.

## Lesson

### Saving and loading models

Train once, save, load many times. `joblib.dump(pipeline, "model.joblib")` saves a scikit-learn pipeline, including all preprocessing. Load it with `joblib.load` in the same library versions it was trained with, so record those versions (in `requirements.txt` or a metadata file). Only load model files you trust: loading can run code.


### What an API is

A web API is a program that answers HTTP requests. A client sends a `POST` request to `/predict` with a JSON body like `{"size_m2": 80, ...}`, and the server replies with JSON like `{"price": 215000}`. You used APIs as a client on Days 56 and 70; now you're building the server.


### FastAPI basics

Install with `pip install fastapi uvicorn`. You create an `app = FastAPI()` and decorate functions with the path they answer: `@app.get("/health")`. Run it with `uvicorn app:app --reload` and visit `http://127.0.0.1:8000/docs` for free interactive documentation where you can try every endpoint.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/hello/{name}")
def hello(name: str):
    return {"message": f"Hello {name}"}
```

### Validating input with Pydantic

Define the expected input as a **Pydantic** model, a class with type hints. FastAPI checks every request against it and automatically returns a clear 422 error for bad data (a missing field, text where a number should be, a value out of range). `Field(gt=0, le=1000)` adds limits and `Literal["flat", "terraced"]` restricts choices. Your prediction code only ever sees clean data.


### Testing an API

`fastapi.testclient.TestClient(app)` lets pytest call your API without starting a server: `client.post("/predict", json={...})` returns a response with `.status_code` and `.json()`. Test the happy path, invalid input, and edge cases, just as you did on Day 52.


## Exercises

1. Add a `GET /add` endpoint that takes query parameters `a` and `b` (numbers) and returns their sum.

<details><summary>Solution</summary>

```python
@app.get("/add")
def add(a: float, b: float):
    return {"sum": a + b}
# visit /add?a=2&b=3
```

</details>

2. Write a Pydantic model `Student` with a name and an age between 5 and 120.

<details><summary>Solution</summary>

```python
from pydantic import BaseModel, Field

class Student(BaseModel):
    name: str
    age: int = Field(ge=5, le=120)
```

</details>

3. What status code does FastAPI return when the request body fails validation?

<details><summary>Solution</summary>

```python
# 422 Unprocessable Content, with a JSON explanation of which field failed and why.
```

</details>

## Project: Prediction API

Serve a house-price model over HTTP. `train_model.py` trains a pipeline (like Day 88's) and saves it with its metadata. `app.py` is a FastAPI service with health, single-prediction and batch-prediction endpoints and strict input validation. `test_app.py` checks it with pytest. Run `python train_model.py`, then `uvicorn app:app --reload`, and open `/docs`.

Files in this folder: `requirements.txt`, `train_model.py`, `app.py`, `test_app.py`.

### Key lines explained

- `@asynccontextmanager async def lifespan(app)`: Code before `yield` runs once at start-up, code after it at shutdown. Loading the model here means each request is fast.
- `year_built: int | None = Field(default=None, ...)`: An optional field: clients may leave it out, and the pipeline's imputer fills the gap with the training median.
- `house_type: Literal["flat", "terraced", "detached"]`: Only these three strings are accepted. Anything else is rejected with a 422 before your code runs.
- `pd.DataFrame([h.model_dump() for h in houses])`: `model_dump()` turns each validated Pydantic object into a dict; a list of dicts becomes a DataFrame with the column names the pipeline expects.
- `@app.post("/predict", response_model=Prediction)`: `response_model` documents and checks the shape of the reply, so clients know exactly what they'll get.
- `with TestClient(app) as c:`: Using the client as a context manager runs the lifespan, so the model is loaded during the tests just as in production.

### Stretch goals

- Call your running API from another script with `requests.post` (Day 56 skills).
- Add a `/predict/explain` endpoint that returns how the price changes if the house were 10 m² bigger.
- Write a `Dockerfile` so the API runs anywhere with `docker run`.

## Test it

- [ ] Run `python train_model.py`, then `pytest -v`: 7 tests should pass.
- [ ] Start the server and try `/predict` from the `/docs` page.
- [ ] Send a house with `size_m2: "big"` and read the 422 error message.
- [ ] Add `model.joblib` to `.gitignore` and note in your README how to recreate it.
