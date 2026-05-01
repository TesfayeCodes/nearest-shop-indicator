import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.db import Base, get_db
from app.main import app
from app.models.shop import Shop

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


class TestNearestShopsEndpoint:
    def test_missing_parameters(self):
        response = client.get("/shops/nearest")
        assert response.status_code == 422

    def test_invalid_latitude(self):
        response = client.get("/shops/nearest", params={"lat": 100, "lng": 38})
        assert response.status_code == 422

    def test_invalid_longitude(self):
        response = client.get("/shops/nearest", params={"lat": 9, "lng": 200})
        assert response.status_code == 422

    def test_no_shops_in_database(self):
        response = client.get("/shops/nearest", params={"lat": 9.0192, "lng": 38.7525})
        assert response.status_code == 200
        data = response.json()
        assert data["total_found"] == 0
        assert data["shops"] == []

    def test_nearest_shop_found(self):
        db = TestingSessionLocal()
        shop = Shop(
            name="Test Shop",
            latitude=9.0192,
            longitude=38.7525,
            shop_type="grocery",
            is_open=True,
        )
        db.add(shop)
        db.commit()

        response = client.get("/shops/nearest", params={"lat": 9.0200, "lng": 38.7530})
        assert response.status_code == 200
        data = response.json()
        assert data["total_found"] == 1
        assert data["shops"][0]["name"] == "Test Shop"
        assert data["shops"][0]["distance_km"] > 0

        db.close()

    def test_shops_sorted_by_distance(self):
        db = TestingSessionLocal()
        shops = [
            Shop(name="Far Shop", latitude=9.1, longitude=38.8, is_open=True),
            Shop(name="Near Shop", latitude=9.02, longitude=38.75, is_open=True),
            Shop(name="Medium Shop", latitude=9.05, longitude=38.78, is_open=True),
        ]
        db.add_all(shops)
        db.commit()

        response = client.get("/shops/nearest", params={"lat": 9.0192, "lng": 38.7525})
        assert response.status_code == 200
        data = response.json()
        assert data["total_found"] == 3
        assert data["shops"][0]["name"] == "Near Shop"
        assert data["shops"][1]["name"] == "Medium Shop"
        assert data["shops"][2]["name"] == "Far Shop"

        db.close()

    def test_radius_filter(self):
        db = TestingSessionLocal()
        db.add_all(
            [
                Shop(name="Close", latitude=9.02, longitude=38.75, is_open=True),
                Shop(name="Far Away", latitude=15.0, longitude=45.0, is_open=True),
            ]
        )
        db.commit()

        response = client.get(
            "/shops/nearest", params={"lat": 9.0192, "lng": 38.7525, "radius": 10}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total_found"] == 1
        assert data["shops"][0]["name"] == "Close"

        db.close()

    def test_closed_shops_excluded(self):
        db = TestingSessionLocal()
        db.add_all(
            [
                Shop(name="Open Shop", latitude=9.02, longitude=38.75, is_open=True),
                Shop(name="Closed Shop", latitude=9.03, longitude=38.76, is_open=False),
            ]
        )
        db.commit()

        response = client.get("/shops/nearest", params={"lat": 9.0192, "lng": 38.7525})
        assert response.status_code == 200
        data = response.json()
        assert data["total_found"] == 1
        assert data["shops"][0]["name"] == "Open Shop"

        db.close()

    def test_limit_parameter(self):
        db = TestingSessionLocal()
        for i in range(10):
            db.add(
                Shop(
                    name=f"Shop {i}",
                    latitude=9.01 + (i * 0.001),
                    longitude=38.75 + (i * 0.001),
                    is_open=True,
                )
            )
        db.commit()

        response = client.get(
            "/shops/nearest", params={"lat": 9.0192, "lng": 38.7525, "limit": 3}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total_found"] == 3

        db.close()


class TestHealthEndpoint:
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"

    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        assert "message" in response.json()
