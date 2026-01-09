"""
Test configuration and fixtures for TodoApp Backend API.

This module provides pytest fixtures and configuration for testing.
"""

import asyncio
from typing import AsyncGenerator, Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from src.database import get_session
from src.main import app


# Test database URL (use in-memory SQLite for tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """
    Create an event loop for the test session.

    Yields:
        Event loop for async tests
    """
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
async def test_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Create a test database session.

    Yields:
        AsyncSession: Test database session

    Note:
        This fixture creates a fresh database for each test function
        to ensure test isolation.
    """
    engine = create_async_engine(
        TEST_DATABASE_URL,
        echo=False,
        future=True,
    )

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

    async_session_maker = sessionmaker(
        engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )

    async with async_session_maker() as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)

    await engine.dispose()


@pytest.fixture(scope="function")
def client(test_db: AsyncSession) -> TestClient:
    """
    Create a test client with database session override.

    Args:
        test_db: Test database session

    Returns:
        TestClient: FastAPI test client

    Note:
        This fixture overrides the database session dependency
        to use the test database.
    """

    async def override_get_session() -> AsyncGenerator[AsyncSession, None]:
        yield test_db

    app.dependency_overrides[get_session] = override_get_session

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
