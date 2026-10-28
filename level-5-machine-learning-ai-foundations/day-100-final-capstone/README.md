# Day 100: Final capstone

**Level 5, Machine Learning & AI Foundations.** Project: **End-to-end ML application**

Day 100. The final capstone brings the whole journey together: a real dataset, a well-evaluated model, an API with a small web page, tests, documentation and a polished GitHub repository. Give it a week, not a day. This is the project you'll show people.

## Lesson

### Choosing your capstone

The example below classifies penguin species, but the best capstone answers a question **you** care about. Good choices have a clear prediction target, at least a few hundred rows of real data, and a user who would benefit: exam scores at your school, house prices in your city, crop yields, football results, or text you collect. Write one sentence: "Given X, predict Y, so that Z can decide W."


### The end-to-end workflow

Every ML project follows the same path, and you've practised each step: **1** get and understand the data (Days 75–80); **2** set a baseline (Day 85); **3** build a pipeline and compare models with cross-validation (Days 87–92); **4** evaluate once on a held-out test set and study the errors; **5** save the model with its metadata (Day 99); **6** serve it through an API (Day 97); **7** test it; **8** document it.


### Model cards

A **model card** is a short document that travels with a model: what it predicts, what data it was trained on, how well it performs (overall and for important subgroups), and its limitations and risks. Writing one forces you to think about who could be harmed by mistakes, and it's what experienced reviewers look for first.


### A portfolio-quality repository

Recruiters and collaborators spend about a minute on a repository. Make it count: a README that opens with what the project does and a screenshot, how to run it in three commands, results in a small table, and what you'd do next. Keep data and large model files out of Git (`.gitignore`), pin dependencies in `requirements.txt`, and make sure the tests pass on a fresh clone.


### Deploying (optional)

To let anyone try it, deploy the API. Services such as Render, Railway and Hugging Face Spaces can run a FastAPI app from a GitHub repository, often for free at small scale. The usual start command is `uvicorn app:app --host 0.0.0.0 --port $PORT`. Train the model during the build step or include a small model file, and never put secrets in the repository.


## Exercises

1. Write the one-sentence problem statement for your own capstone idea.

<details><summary>Solution</summary>

```python
# Example: "Given a penguin's island, sex and body measurements, predict its species,
# so that field researchers can label observations quickly and flag unusual ones."
```

</details>

2. List three ways your model could be wrong in a way that matters, and who would be affected.

<details><summary>Solution</summary>

```python
# 1. A species that is rare in the training data gets misclassified more often.
# 2. Measurements taken differently (another team's equipment) shift the inputs.
# 3. A penguin from an island not in the data gets a confident but meaningless answer.
```

</details>

3. Write a `.gitignore` for an ML project.

<details><summary>Solution</summary>

```python
__pycache__/
.venv/
data/
*.joblib
*.pt
.env
.ipynb_checkpoints/
```

</details>

## Project: End-to-end ML application

Build a complete penguin species predictor: `train.py` loads and cleans the data, compares a baseline with two models by cross-validation, evaluates the winner on a test set, and saves the model, its metrics and a model card. `app.py` serves predictions through a FastAPI JSON endpoint and a simple web page with a form. `test_app.py` tests it, and `README.md` is a template for your portfolio write-up. Run `pip install -r requirements.txt`, `python train.py`, `pytest -v`, then `uvicorn app:app --reload` and open `http://127.0.0.1:8000`. When it's working, we'll set up its GitHub repository together.

Files in this folder: `requirements.txt`, `.gitignore`, `train.py`, `app.py`, `test_app.py`, `README.md`.

### Key lines explained

- `best_name = max(scores, key=scores.get)`: The model is chosen by cross-validation on the training set only. The test set is used once, afterwards, to report the final score.
- `SimpleImputer(strategy="constant", fill_value="unknown")`: A missing sex becomes its own category instead of a guess, so the model can still use the other features.
- `card = f"""# Model card ..."""`: The model card is generated from the real numbers on every training run, so it can never go out of date.
- `sex: Literal["Male", "Female"] | None = None`: Optional in the API too, matching how the model was trained.
- `probabilities = {species: ... for species, p in zip(model.classes_, proba)}`: `classes_` holds the species names in the same order as the probability columns.
- `fetch("/predict", {method: "POST", ...})`: The web page is just another client of your API: it sends the form as JSON and shows the answer.

### Stretch goals

- Replace penguins with your own dataset and problem: this is the real capstone.
- Deploy the app to Render or Hugging Face Spaces and put the link at the top of your README.
- Add a chart of the decision boundary (bill length against flipper length) to the README.
- Show the model's probabilities as bars on the web page.

## Test it

- [ ] `python train.py`, then `pytest -v`: 8 tests should pass.
- [ ] Open the web page, enter a penguin and check the answer against `MODEL_CARD.md`.
- [ ] Clone your finished repository into a new folder, follow only your README, and make sure everything works.
- [ ] Ask a friend to read your README for one minute, then tell you what the project does.
