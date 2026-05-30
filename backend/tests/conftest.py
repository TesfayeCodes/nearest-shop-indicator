import pytest


@pytest.fixture
async def db_session():
    yield
