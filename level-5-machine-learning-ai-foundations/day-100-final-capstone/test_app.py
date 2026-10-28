# test_app.py
# Run: pytest -v   (after python train.py)

import pytest
from fastapi.testclient import TestClient

from app import app

GENTOO = {"bill_length_mm": 47.5, "bill_depth_mm": 15.0, "flipper_length_mm": 217,
          "body_mass_g": 5100, "island": "Biscoe", "sex": "Male"}
ADELIE = {"bill_length_mm": 38.8, "bill_depth_mm": 18.3, "flipper_length_mm": 190,
          "body_mass_g": 3700, "island": "Torgersen", "sex": "Female"}
CHINSTRAP = {"bill_length_mm": 49.0, "bill_depth_mm": 18.5, "flipper_length_mm": 196,
             "body_mass_g": 3750, "island": "Dream", "sex": "Female"}


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_health(client):
    assert client.get("/health").json()["status"] == "ok"


def test_home_page_has_a_form(client):
    r = client.get("/")
    assert r.status_code == 200
    assert "<form" in r.text


@pytest.mark.parametrize("penguin, species", [(GENTOO, "Gentoo"), (ADELIE, "Adelie"), (CHINSTRAP, "Chinstrap")])
def test_typical_penguins(client, penguin, species):
    body = client.post("/predict", json=penguin).json()
    assert body["species"] == species
    assert body["confidence"] > 0.6


def test_probabilities_add_up_to_one(client):
    probs = client.post("/predict", json=GENTOO).json()["probabilities"]
    assert abs(sum(probs.values()) - 1) < 0.01


def test_sex_is_optional(client):
    penguin = {k: v for k, v in ADELIE.items() if k != "sex"}
    assert client.post("/predict", json=penguin).status_code == 200


def test_rejects_impossible_values(client):
    assert client.post("/predict", json={**GENTOO, "body_mass_g": 50}).status_code == 422
    assert client.post("/predict", json={**GENTOO, "island": "Mars"}).status_code == 422
