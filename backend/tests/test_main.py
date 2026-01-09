"""
Test cases for health check and root endpoints.

This module tests the basic application endpoints to ensure
the API is running correctly.
"""

from fastapi import status
from fastapi.testclient import TestClient


def test_health_check(client: TestClient) -> None:
    """
    Test the health check endpoint.

    Args:
        client: FastAPI test client

    Asserts:
        - Response status code is 200
        - Response contains status and version fields
        - Status is "healthy"
    """
    response = client.get("/health")

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "status" in data
    assert "version" in data
    assert data["status"] == "healthy"


def test_root_endpoint(client: TestClient) -> None:
    """
    Test the root endpoint.

    Args:
        client: FastAPI test client

    Asserts:
        - Response status code is 200
        - Response contains message, version, and docs fields
    """
    response = client.get("/")

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert "docs" in data
