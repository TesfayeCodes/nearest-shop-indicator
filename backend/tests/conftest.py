import asyncio

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.deps import get_db
from app.core.security import create_access_token, hash_password
from app.db.base_class import Base
from app.main import app
from app.models.user import User

TEST_DATABASE_URL = (
    "postgresql+asyncpg://postgres:postgres@localhost:5432/nearshop_test"
)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session")
async def test_engine():
    engine = create_async_engine(TEST_DATABASE_URL)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture(autouse=True)
async def clean_data(test_engine):
    async with test_engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            await conn.execute(
                text(f"TRUNCATE TABLE {table.name} CASCADE RESTART IDENTITY")
            )


@pytest.fixture
async def db_session(test_engine):
    maker = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)
    async with maker() as session:
        yield session


@pytest.fixture
async def client(db_session):
    async def _get_db():
        yield db_session

    app.dependency_overrides[get_db] = _get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


@pytest.fixture
async def user_token(db_session):
    user = User(
        email="test@example.com",
        full_name="Test User",
        hashed_password=hash_password("testpassword123"),
    )
    db_session.add(user)
    await db_session.commit()
    return create_access_token(data={"sub": user.id})


@pytest.fixture
async def admin_token(db_session):
    user = User(
        email="admin@example.com",
        full_name="Admin User",
        hashed_password=hash_password("adminpassword123"),
        is_admin=True,
    )
    db_session.add(user)
    await db_session.commit()
    return create_access_token(data={"sub": user.id})


@pytest.fixture
def auth_headers(user_token):
    return {"Authorization": f"Bearer {user_token}"}


@pytest.fixture
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}
