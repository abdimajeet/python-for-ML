# test_app.py
# Run: pytest -v   (after python train_model.py)

from fastapi.testclient import TestClient

from app import app

FLAT = {"size_m2": 70, "rooms": 3, "year_built": 1985, "distance_km": 2.5,
        "neighbourhood": "Old Town", "house_type": "flat"}


def client():
    return TestClient(app)


def test_health():
    with client() as c:
        r = c.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_predict_returns_a_sensible_price():
    with client() as c:
        r = c.post("/predict", json=FLAT)
    assert r.status_code == 200
    body = r.json()
    assert 50_000 < body["price"] < 1_000_000
    assert body["known_neighbourhood"] is True


def test_bigger_house_costs_more():
    with client() as c:
        small = c.post("/predict", json=FLAT).json()["price"]
        big = c.post("/predict", json={**FLAT, "size_m2": 200, "rooms": 7}).json()["price"]
    assert big > small


def test_year_built_is_optional():
    house = {k: v for k, v in FLAT.items() if k != "year_built"}
    with client() as c:
        assert c.post("/predict", json=house).status_code == 200


def test_unknown_neighbourhood_is_flagged():
    with client() as c:
        body = c.post("/predict", json={**FLAT, "neighbourhood": "Moon Base"}).json()
    assert body["known_neighbourhood"] is False


def test_invalid_input_is_rejected():
    with client() as c:
        assert c.post("/predict", json={**FLAT, "size_m2": -5}).status_code == 422
        assert c.post("/predict", json={**FLAT, "house_type": "castle"}).status_code == 422
        missing = {k: v for k, v in FLAT.items() if k != "rooms"}
        assert c.post("/predict", json=missing).status_code == 422


def test_batch():
    with client() as c:
        r = c.post("/predict/batch", json=[FLAT, {**FLAT, "house_type": "detached"}])
        assert r.status_code == 200
        assert len(r.json()) == 2
        assert c.post("/predict/batch", json=[]).status_code == 400
