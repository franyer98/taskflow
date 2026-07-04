from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _auth_headers():
    client.post(
        "/auth/register",
        json={"email": "test@taskflow.dev", "name": "Tester", "password": "secret123"},
    )
    res = client.post(
        "/auth/login", data={"username": "test@taskflow.dev", "password": "secret123"}
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_full_flow():
    headers = _auth_headers()

    # Crear tablero (con columnas por defecto)
    res = client.post("/boards", json={"title": "Mi proyecto"}, headers=headers)
    assert res.status_code == 201
    board = res.json()
    assert len(board["columns"]) == 3

    # Crear tarea
    col_id = board["columns"][0]["id"]
    res = client.post(
        "/tasks",
        json={"title": "Primera tarea", "column_id": col_id, "priority": "alta"},
        headers=headers,
    )
    assert res.status_code == 201
    task = res.json()

    # Mover tarea a otra columna
    res = client.patch(
        f"/tasks/{task['id']}",
        json={"column_id": board["columns"][1]["id"], "position": 1.0},
        headers=headers,
    )
    assert res.status_code == 200
    assert res.json()["column_id"] == board["columns"][1]["id"]

    # Sin token → 401
    assert client.get("/boards").status_code == 401


def test_wrong_password():
    res = client.post(
        "/auth/login", data={"username": "test@taskflow.dev", "password": "mala"}
    )
    assert res.status_code == 401
