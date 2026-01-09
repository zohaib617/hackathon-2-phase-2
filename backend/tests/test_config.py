"""
Test configuration settings.

This module tests the configuration management to ensure
all settings are properly validated and loaded.
"""

import pytest
from pydantic import ValidationError

from src.config import Settings


def test_settings_validation_success() -> None:
    """
    Test that valid settings are accepted.

    Asserts:
        - Settings can be created with valid values
        - All required fields are present
    """
    settings = Settings(
        database_url="postgresql+asyncpg://user:pass@localhost:5432/testdb",
        jwt_secret="a" * 32,  # Minimum 32 characters
        cors_origins="http://localhost:3000,http://localhost:5173",
    )

    assert settings.app_name == "TodoApp API"
    assert settings.environment == "development"
    assert len(settings.cors_origins_list) == 2


def test_settings_jwt_secret_too_short() -> None:
    """
    Test that JWT secret validation fails for short secrets.

    Asserts:
        - ValidationError is raised for secrets shorter than 32 characters
    """
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            database_url="postgresql+asyncpg://user:pass@localhost:5432/testdb",
            jwt_secret="short",  # Too short
            cors_origins="http://localhost:3000",
        )

    errors = exc_info.value.errors()
    assert any(error["loc"] == ("jwt_secret",) for error in errors)


def test_settings_invalid_environment() -> None:
    """
    Test that invalid environment values are rejected.

    Asserts:
        - ValidationError is raised for invalid environment values
    """
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            database_url="postgresql+asyncpg://user:pass@localhost:5432/testdb",
            jwt_secret="a" * 32,
            cors_origins="http://localhost:3000",
            environment="invalid_env",
        )

    errors = exc_info.value.errors()
    assert any(error["loc"] == ("environment",) for error in errors)


def test_settings_cors_origins_parsing() -> None:
    """
    Test CORS origins parsing from comma-separated string.

    Asserts:
        - CORS origins are correctly parsed into a list
        - Whitespace is properly trimmed
    """
    settings = Settings(
        database_url="postgresql+asyncpg://user:pass@localhost:5432/testdb",
        jwt_secret="a" * 32,
        cors_origins="http://localhost:3000, http://localhost:5173 , http://example.com",
    )

    origins = settings.cors_origins_list
    assert len(origins) == 3
    assert "http://localhost:3000" in origins
    assert "http://localhost:5173" in origins
    assert "http://example.com" in origins


def test_settings_is_production() -> None:
    """
    Test production environment detection.

    Asserts:
        - is_production returns True for production environment
        - is_production returns False for other environments
    """
    prod_settings = Settings(
        database_url="postgresql+asyncpg://user:pass@localhost:5432/testdb",
        jwt_secret="a" * 32,
        cors_origins="http://localhost:3000",
        environment="production",
    )
    assert prod_settings.is_production is True

    dev_settings = Settings(
        database_url="postgresql+asyncpg://user:pass@localhost:5432/testdb",
        jwt_secret="a" * 32,
        cors_origins="http://localhost:3000",
        environment="development",
    )
    assert dev_settings.is_production is False
