import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category


@pytest.fixture
async def category(db_session: AsyncSession):
    cat = Category(name="Cafe", slug="cafe", icon="☕")
    db_session.add(cat)
    await db_session.commit()
    return cat


@pytest.mark.asyncio
class TestCategories:
    async def test_list_categories(self, client: AsyncClient, category: Category):
        resp = await client.get("/api/v1/shops/categories")
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) >= 1
        assert data[0]["slug"] == "cafe"

    async def test_list_categories_empty(self, client: AsyncClient):
        resp = await client.get("/api/v1/shops/categories")
        assert resp.status_code == 200
        assert resp.json() == []


@pytest.mark.asyncio
class TestCreateShop:
    async def test_create_shop_success(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        payload = {
            "name": "Test Cafe",
            "category_slug": "cafe",
            "latitude": 9.03,
            "longitude": 38.74,
            "address": "Bole Road",
            "phone": "+251911111111",
        }
        resp = await client.post("/api/v1/shops", json=payload, headers=auth_headers)
        assert resp.status_code == 201
        data = resp.json()
        assert data["name"] == "Test Cafe"
        assert data["id"] is not None

    async def test_create_shop_no_auth(self, client: AsyncClient, category: Category):
        payload = {
            "name": "No Auth Shop",
            "category_slug": "cafe",
            "latitude": 9.0,
            "longitude": 38.7,
        }
        resp = await client.post("/api/v1/shops", json=payload)
        assert resp.status_code == 401

    async def test_create_shop_invalid_category(
        self, client: AsyncClient, auth_headers: dict
    ):
        payload = {
            "name": "Bad Cat",
            "category_slug": "nonexistent",
            "latitude": 9.0,
            "longitude": 38.7,
        }
        resp = await client.post("/api/v1/shops", json=payload)
        assert resp.status_code == 400
        assert "not found" in resp.json()["detail"].lower()


@pytest.mark.asyncio
class TestListShops:
    async def test_list_shops_empty(self, client: AsyncClient):
        resp = await client.get("/api/v1/shops")
        assert resp.status_code == 200
        data = resp.json()
        assert data["items"] == []
        assert data["total"] == 0

    async def test_list_shops_with_data(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        await client.post(
            "/api/v1/shops",
            json={
                "name": "Shop A",
                "category_slug": "cafe",
                "latitude": 9.01,
                "longitude": 38.71,
            },
            headers=auth_headers,
        )
        await client.post(
            "/api/v1/shops",
            json={
                "name": "Shop B",
                "category_slug": "cafe",
                "latitude": 9.02,
                "longitude": 38.72,
            },
            headers=auth_headers,
        )
        resp = await client.get("/api/v1/shops")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

    async def test_list_shops_pagination(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        for i in range(5):
            await client.post(
                "/api/v1/shops",
                json={
                    "name": f"Shop {i}",
                    "category_slug": "cafe",
                    "latitude": 9.0,
                    "longitude": 38.7,
                },
                headers=auth_headers,
            )
        resp = await client.get("/api/v1/shops", params={"page": 1, "page_size": 2})
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["items"]) == 2
        assert data["total"] == 5
        assert data["page"] == 1
        assert data["page_size"] == 2


@pytest.mark.asyncio
class TestGetShop:
    async def test_get_shop_success(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        create = await client.post(
            "/api/v1/shops",
            json={
                "name": "Target Shop",
                "category_slug": "cafe",
                "latitude": 9.03,
                "longitude": 38.74,
            },
            headers=auth_headers,
        )
        shop_id = create.json()["id"]
        resp = await client.get(f"/api/v1/shops/{shop_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["name"] == "Target Shop"
        assert data["latitude"] == 9.03
        assert data["category"] == "cafe"

    async def test_get_shop_not_found(self, client: AsyncClient):
        resp = await client.get("/api/v1/shops/99999")
        assert resp.status_code == 404


@pytest.mark.asyncio
class TestUpdateShop:
    async def test_update_shop(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        create = await client.post(
            "/api/v1/shops",
            json={
                "name": "Old Name",
                "category_slug": "cafe",
                "latitude": 9.0,
                "longitude": 38.7,
            },
            headers=auth_headers,
        )
        shop_id = create.json()["id"]
        resp = await client.put(
            f"/api/v1/shops/{shop_id}",
            json={"name": "New Name", "is_open": False},
            headers=auth_headers,
        )
        assert resp.status_code == 200
        assert resp.json()["name"] == "New Name"

        get = await client.get(f"/api/v1/shops/{shop_id}")
        assert get.json()["name"] == "New Name"

    async def test_update_shop_not_found(self, client: AsyncClient, auth_headers: dict):
        resp = await client.put(
            "/api/v1/shops/99999", json={"name": "Ghost"}, headers=auth_headers
        )
        assert resp.status_code == 404


@pytest.mark.asyncio
class TestDeleteShop:
    async def test_delete_shop_admin(
        self,
        client: AsyncClient,
        admin_headers: dict,
        auth_headers: dict,
        category: Category,
    ):
        create = await client.post(
            "/api/v1/shops",
            json={
                "name": "Delete Me",
                "category_slug": "cafe",
                "latitude": 9.0,
                "longitude": 38.7,
            },
            headers=auth_headers,
        )
        shop_id = create.json()["id"]
        resp = await client.delete(f"/api/v1/shops/{shop_id}", headers=admin_headers)
        assert resp.status_code == 204

        get = await client.get(f"/api/v1/shops/{shop_id}")
        assert get.status_code == 404

    async def test_delete_shop_not_admin(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        create = await client.post(
            "/api/v1/shops",
            json={
                "name": "Can't Delete",
                "category_slug": "cafe",
                "latitude": 9.0,
                "longitude": 38.7,
            },
            headers=auth_headers,
        )
        shop_id = create.json()["id"]
        resp = await client.delete(f"/api/v1/shops/{shop_id}", headers=auth_headers)
        assert resp.status_code == 403

    async def test_delete_shop_not_found(
        self, client: AsyncClient, admin_headers: dict
    ):
        resp = await client.delete("/api/v1/shops/99999", headers=admin_headers)
        assert resp.status_code == 404


@pytest.mark.asyncio
class TestNearbyShops:
    async def test_nearby_returns_nearby(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        await client.post(
            "/api/v1/shops",
            json={
                "name": "Near",
                "category_slug": "cafe",
                "latitude": 9.03,
                "longitude": 38.74,
            },
            headers=auth_headers,
        )
        await client.post(
            "/api/v1/shops",
            json={
                "name": "Far",
                "category_slug": "cafe",
                "latitude": 9.5,
                "longitude": 39.0,
            },
            headers=auth_headers,
        )
        resp = await client.get(
            "/api/v1/shops/nearby", params={"lat": 9.03, "lng": 38.74, "radius": 5.0}
        )
        assert resp.status_code == 200
        data = resp.json()
        names = [item["name"] for item in data["items"]]
        assert "Near" in names
        assert "Far" not in names

    async def test_nearby_sorted_by_distance(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        await client.post(
            "/api/v1/shops",
            json={
                "name": "Far Shop",
                "category_slug": "cafe",
                "latitude": 9.05,
                "longitude": 38.78,
            },
            headers=auth_headers,
        )
        await client.post(
            "/api/v1/shops",
            json={
                "name": "Close Shop",
                "category_slug": "cafe",
                "latitude": 9.031,
                "longitude": 38.741,
            },
            headers=auth_headers,
        )
        resp = await client.get(
            "/api/v1/shops/nearby", params={"lat": 9.03, "lng": 38.74, "radius": 10.0}
        )
        data = resp.json()
        distances = [item["distance"] for item in data["items"]]
        assert distances == sorted(distances)

    async def test_nearby_filter_by_category(
        self,
        client: AsyncClient,
        auth_headers: dict,
        category: Category,
        db_session: AsyncSession,
    ):
        cat2 = Category(name="Restaurant", slug="restaurant", icon="🍽️")
        db_session.add(cat2)
        await db_session.commit()
        await client.post(
            "/api/v1/shops",
            json={
                "name": "Cafe Shop",
                "category_slug": "cafe",
                "latitude": 9.03,
                "longitude": 38.74,
            },
            headers=auth_headers,
        )
        await client.post(
            "/api/v1/shops",
            json={
                "name": "Resto Shop",
                "category_slug": "restaurant",
                "latitude": 9.03,
                "longitude": 38.74,
            },
            headers=auth_headers,
        )
        resp = await client.get(
            "/api/v1/shops/nearby",
            params={"lat": 9.03, "lng": 38.74, "radius": 5.0, "category": "cafe"},
        )
        assert resp.status_code == 200
        names = [item["name"] for item in resp.json()["items"]]
        assert "Cafe Shop" in names
        assert "Resto Shop" not in names


@pytest.mark.asyncio
class TestFavorites:
    async def test_toggle_favorite_add(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        create = await client.post(
            "/api/v1/shops",
            json={
                "name": "Fav Shop",
                "category_slug": "cafe",
                "latitude": 9.0,
                "longitude": 38.7,
            },
            headers=auth_headers,
        )
        shop_id = create.json()["id"]
        resp = await client.post(
            f"/api/v1/shops/{shop_id}/favorite", headers=auth_headers
        )
        assert resp.status_code == 200
        assert resp.json()["favorited"] is True

    async def test_toggle_favorite_remove(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        create = await client.post(
            "/api/v1/shops",
            json={
                "name": "Unfav",
                "category_slug": "cafe",
                "latitude": 9.0,
                "longitude": 38.7,
            },
            headers=auth_headers,
        )
        shop_id = create.json()["id"]
        await client.post(f"/api/v1/shops/{shop_id}/favorite", headers=auth_headers)
        resp = await client.post(
            f"/api/v1/shops/{shop_id}/favorite", headers=auth_headers
        )
        assert resp.status_code == 200
        assert resp.json()["favorited"] is False

    async def test_favorite_shop_not_found(
        self, client: AsyncClient, auth_headers: dict
    ):
        resp = await client.post("/api/v1/shops/99999/favorite", headers=auth_headers)
        assert resp.status_code == 404

    async def test_get_favorites(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        create = await client.post(
            "/api/v1/shops",
            json={
                "name": "My Fav",
                "category_slug": "cafe",
                "latitude": 9.0,
                "longitude": 38.7,
            },
            headers=auth_headers,
        )
        shop_id = create.json()["id"]
        await client.post(f"/api/v1/shops/{shop_id}/favorite", headers=auth_headers)
        resp = await client.get("/api/v1/shops/favorites", headers=auth_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 1
        names = [item["name"] for item in data["items"]]
        assert "My Fav" in names


@pytest.mark.asyncio
class TestReviews:
    async def test_create_review(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        create = await client.post(
            "/api/v1/shops",
            json={
                "name": "Review Shop",
                "category_slug": "cafe",
                "latitude": 9.0,
                "longitude": 38.7,
            },
            headers=auth_headers,
        )
        shop_id = create.json()["id"]
        resp = await client.post(
            f"/api/v1/shops/{shop_id}/reviews",
            json={"rating": 5, "comment": "Great!"},
            headers=auth_headers,
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["rating"] == 5
        assert data["comment"] == "Great!"

    async def test_create_review_no_auth(self, client: AsyncClient, category: Category):
        resp = await client.post(
            "/api/v1/shops/1/reviews", json={"rating": 3, "comment": "Ok"}
        )
        assert resp.status_code == 401

    async def test_create_review_shop_not_found(
        self, client: AsyncClient, auth_headers: dict
    ):
        resp = await client.post(
            "/api/v1/shops/99999/reviews",
            json={"rating": 3, "comment": "Missing"},
            headers=auth_headers,
        )
        assert resp.status_code == 404

    async def test_list_reviews(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        create = await client.post(
            "/api/v1/shops",
            json={
                "name": "Reviewed Shop",
                "category_slug": "cafe",
                "latitude": 9.0,
                "longitude": 38.7,
            },
            headers=auth_headers,
        )
        shop_id = create.json()["id"]
        await client.post(
            f"/api/v1/shops/{shop_id}/reviews",
            json={"rating": 4, "comment": "Nice"},
            headers=auth_headers,
        )
        await client.post(
            f"/api/v1/shops/{shop_id}/reviews",
            json={"rating": 5, "comment": "Awesome"},
            headers=auth_headers,
        )
        resp = await client.get(f"/api/v1/shops/{shop_id}/reviews")
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 2
        assert len(data["items"]) == 2

    async def test_review_updates_shop_rating(
        self, client: AsyncClient, auth_headers: dict, category: Category
    ):
        create = await client.post(
            "/api/v1/shops",
            json={
                "name": "Rate Me",
                "category_slug": "cafe",
                "latitude": 9.0,
                "longitude": 38.7,
            },
            headers=auth_headers,
        )
        shop_id = create.json()["id"]
        await client.post(
            f"/api/v1/shops/{shop_id}/reviews", json={"rating": 3}, headers=auth_headers
        )
        await client.post(
            f"/api/v1/shops/{shop_id}/reviews", json={"rating": 5}, headers=auth_headers
        )
        resp = await client.get(f"/api/v1/shops/{shop_id}")
        assert resp.json()["rating"] == 4.0
        assert resp.json()["review_count"] == 2


@pytest.mark.asyncio
class TestUsers:
    async def test_admin_list_users(self, client: AsyncClient, admin_headers: dict):
        resp = await client.get("/api/v1/users", headers=admin_headers)
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 1

    async def test_non_admin_list_users(self, client: AsyncClient, auth_headers: dict):
        resp = await client.get("/api/v1/users", headers=auth_headers)
        assert resp.status_code == 403

    async def test_get_own_user(self, client: AsyncClient, auth_headers: dict):
        me = await client.get("/api/v1/auth/me", headers=auth_headers)
        my_id = me.json()["id"]
        resp = await client.get(f"/api/v1/users/{my_id}", headers=auth_headers)
        assert resp.status_code == 200
        assert resp.json()["email"] == "test@example.com"

    async def test_get_user_other_forbidden(
        self, client: AsyncClient, auth_headers: dict
    ):
        resp = await client.get("/api/v1/users/99999", headers=auth_headers)
        assert resp.status_code == 403

    async def test_admin_can_get_any_user(
        self, client: AsyncClient, admin_headers: dict
    ):
        me = await client.get("/api/v1/auth/me", headers=admin_headers)
        admin_id = me.json()["id"]
        resp = await client.get(f"/api/v1/users/{admin_id}", headers=admin_headers)
        assert resp.status_code == 200
        assert resp.json()["email"] == "admin@example.com"
