from fastapi.testclient import TestClient
from main import app
from database import Base, engine

client = TestClient(app)

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    Base.metadata.drop_all(bind=engine)

def test_register_user():
    response = client.post(
        "/api/auth/register",
        json={"username": "testadmin", "email": "admin@test.com", "password": "password123", "role": "admin"}
    )
    assert response.status_code == 200
    assert response.json()["username"] == "testadmin"

def test_login_user():
    response = client.post(
        "/api/auth/token",
        data={"username": "testadmin", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()