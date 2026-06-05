import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_success(client: AsyncClient):
    payload = {
        "email": "new@example.com",
        "password": "secret123",
        "full_name": "New User",
    }
    resp = await client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "new@example.com"
    assert data["full_name"] == "New User"
    assert data["id"] is not None
    assert "hashed_password" not in data


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient, auth_headers: dict):
    payload = {"email": "test@example.com", "password": "secret123", "full_name": "Dup"}
    resp = await client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 409
    assert "already registered" in resp.json()["detail"].lower()


@pytest.mark.asyncio
async def test_register_missing_fields(client: AsyncClient):
    resp = await client.post("/api/v1/auth/register", json={"email": "only@email.com"})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@example.com",
            "password": "mypassword",
            "full_name": "Login User",
        },
    )
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": "login@example.com", "password": "mypassword"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post(
        "/api/v1/auth/register",
        json={
            "email": "wrongpw@example.com",
            "password": "correct",
            "full_name": "User",
        },
    )
    resp = await client.post(
        "/api/v1/auth/login", json={"email": "wrongpw@example.com", "password": "wrong"}
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_email(client: AsyncClient):
    resp = await client.post(
        "/api/v1/auth/login", json={"email": "noone@example.com", "password": "any"}
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_me_authenticated(client: AsyncClient, auth_headers: dict):
    resp = await client.get("/api/v1/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert data["full_name"] == "Test User"


@pytest.mark.asyncio
async def test_get_me_unauthenticated(client: AsyncClient):
    resp = await client.get("/api/v1/auth/me")
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_me_invalid_token(client: AsyncClient):
    resp = await client.get(
        "/api/v1/auth/me", headers={"Authorization": "Bearer invalidtoken"}
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_update_me(client: AsyncClient, auth_headers: dict):
    resp = await client.patch(
        "/api/v1/auth/me", json={"full_name": "Updated Name"}, headers=auth_headers
    )
    assert resp.status_code == 200
    assert resp.json()["full_name"] == "Updated Name"


@pytest.mark.asyncio
async def test_update_me_unauthenticated(client: AsyncClient):
    resp = await client.patch("/api/v1/auth/me", json={"full_name": "Hacker"})
    assert resp.status_code == 401
