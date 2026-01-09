# TodoApp Backend API

Multi-user Todo Application Backend built with FastAPI, SQLModel, and PostgreSQL.

## Features

- User authentication with JWT tokens
- Multi-user todo management
- RESTful API design
- Async database operations
- Type-safe with Pydantic v2
- Production-ready logging
- Health check endpoint
- CORS configuration
- Rate limiting

## Requirements

- Python 3.11+
- PostgreSQL 14+

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Run database migrations:**
   ```bash
   alembic upgrade head
   ```

4. **Start the development server:**
   ```bash
   uvicorn src.main:app --reload
   ```

## Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing (generate with `openssl rand -hex 32`)
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `PORT`: Server port (default: 8000)

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health Check: http://localhost:8000/health

## Deployment (Koyeb)

This application is ready for deployment on Koyeb:

1. Ensure all environment variables are set in Koyeb dashboard
2. The `Procfile` is configured for automatic deployment
3. Health check endpoint is available at `/health`
4. Port is configurable via `PORT` environment variable

## Project Structure

```
backend/
├── src/
│   ├── main.py           # FastAPI application entry point
│   ├── config.py         # Configuration management
│   ├── database.py       # Database connection and session
│   ├── models/           # SQLModel database models
│   ├── schemas/          # Pydantic request/response schemas
│   ├── api/              # API route handlers
│   ├── services/         # Business logic layer
│   └── middleware/       # Custom middleware
├── tests/                # Test suite
├── requirements.txt      # Python dependencies
├── pyproject.toml        # Project metadata and tool config
├── .env.example          # Example environment variables
└── Procfile              # Koyeb deployment configuration
```

## Security

- No secrets are hardcoded in the codebase
- All sensitive data comes from environment variables
- JWT tokens for authentication
- Password hashing with bcrypt
- Input validation with Pydantic
- CORS protection
- Rate limiting enabled

## Development

Run tests:
```bash
pytest
```

Type checking:
```bash
mypy src/
```

Code formatting:
```bash
black src/
```

Linting:
```bash
ruff check src/
```
