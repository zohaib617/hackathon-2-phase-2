# Research: Multi-User Todo Application

**Feature**: 001-multi-user-todo
**Date**: 2026-01-07
**Purpose**: Document technology decisions and best practices for implementation

## Research Topics & Decisions

### 1. Better Auth Integration with Next.js 16 App Router

**Decision**: Use Better Auth with Next.js App Router for frontend authentication

**Research Findings**:
- Better Auth is designed for Next.js App Router and provides built-in JWT support
- Supports server-side and client-side authentication flows
- Provides hooks for auth state management (`useSession`, `useAuth`)
- JWT tokens are automatically managed and stored securely

**Implementation Approach**:
- Install Better Auth: `npm install better-auth`
- Configure in `src/lib/auth.ts` with JWT secret from environment
- Use server actions for signup/login operations
- Store JWT in httpOnly cookies for security (Better Auth default)
- Use `useSession()` hook for client-side auth state

**Rationale**: Better Auth is specifically built for Next.js App Router, provides secure defaults (httpOnly cookies), and handles token refresh automatically. This reduces custom implementation complexity while maintaining security.

**Alternatives Considered**:
- NextAuth.js: More mature but heavier; Better Auth is lighter and more modern
- Custom JWT implementation: More control but higher complexity and security risk
- Clerk/Auth0: Third-party services add cost and external dependencies

**References**:
- Better Auth documentation: https://better-auth.com
- Next.js App Router authentication patterns
- JWT best practices for web applications

---

### 2. FastAPI JWT Verification Best Practices

**Decision**: Implement JWT verification middleware using python-jose library

**Research Findings**:
- `python-jose` is the standard library for JWT handling in Python
- FastAPI dependency injection system perfect for JWT verification
- Middleware approach ensures all endpoints are protected by default
- Extract user_id from JWT claims for ownership verification

**Implementation Approach**:
```python
# In api/deps.py
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401)
        return user_id
    except JWTError:
        raise HTTPException(status_code=401)
```

**Rationale**: FastAPI's dependency injection makes JWT verification clean and reusable. Using `python-jose` aligns with FastAPI ecosystem standards.

**Alternatives Considered**:
- PyJWT: Similar functionality but python-jose has better FastAPI integration
- Custom middleware: More complex, reinventing the wheel
- Third-party auth services: Adds external dependencies

**Security Considerations**:
- Use HS256 algorithm (symmetric signing)
- Validate token expiry (`exp` claim)
- Validate issuer if needed (`iss` claim)
- Use strong secret key (minimum 32 characters, random)

---

### 3. SQLModel with Neon PostgreSQL

**Decision**: Use SQLModel ORM with async PostgreSQL driver for Neon

**Research Findings**:
- SQLModel combines SQLAlchemy and Pydantic for type-safe ORM
- Neon supports standard PostgreSQL protocol
- Use `asyncpg` driver for async operations
- Connection pooling essential for serverless environments

**Implementation Approach**:
```python
# In database.py
from sqlmodel import create_engine, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

DATABASE_URL = "postgresql+asyncpg://user:pass@host/db"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True  # Verify connections before use
)

async def get_session():
    async with AsyncSession(engine) as session:
        yield session
```

**Migration Strategy**:
- Use Alembic for database migrations
- Initialize: `alembic init migrations`
- Auto-generate migrations from SQLModel models
- Apply migrations before deployment

**UUID Generation**:
- Use PostgreSQL `gen_random_uuid()` function
- Or Python `uuid.uuid4()` in model defaults
- Ensure UUID extension enabled: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

**Timestamp Auto-Update**:
```python
from datetime import datetime
from sqlmodel import Field

class Task(SQLModel, table=True):
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
```

**Rationale**: SQLModel provides type safety and integrates seamlessly with Pydantic (used by FastAPI). Async operations are essential for performance under load.

**Alternatives Considered**:
- Raw SQL: More control but loses type safety and ORM benefits
- Django ORM: Not compatible with FastAPI
- Tortoise ORM: Less mature than SQLModel

---

### 4. Next.js API Client with JWT

**Decision**: Create custom API client with axios and JWT interceptor

**Research Findings**:
- Axios provides interceptor pattern for adding headers
- Better Auth exposes JWT token via `getSession()`
- Interceptors can handle token refresh automatically
- TypeScript types ensure type-safe API calls

**Implementation Approach**:
```typescript
// In lib/api-client.ts
import axios from 'axios';
import { getSession } from './auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor to add JWT
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

**Token Storage**:
- Use httpOnly cookies (Better Auth default) - most secure
- Cookies automatically sent with requests
- Protected from XSS attacks
- CSRF protection via SameSite attribute

**Rationale**: Axios interceptors provide clean separation of concerns. httpOnly cookies are the most secure token storage method for web applications.

**Alternatives Considered**:
- localStorage: Vulnerable to XSS attacks
- sessionStorage: Lost on tab close, still XSS vulnerable
- Fetch API: No interceptor pattern, more boilerplate

---

### 5. Tailwind CSS Dark Mode Implementation

**Decision**: Use class-based dark mode with localStorage persistence

**Research Findings**:
- Tailwind supports both class-based and media query dark mode
- Class-based provides explicit user control
- `next-themes` library handles theme persistence and SSR
- Smooth transitions via CSS transitions

**Implementation Approach**:
```typescript
// tailwind.config.ts
export default {
  darkMode: 'class',
  // ... rest of config
}

// In app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// In components/ui/ThemeToggle.tsx
import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

**Styling Pattern**:
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  Content
</div>
```

**Rationale**: Class-based dark mode gives users explicit control. `next-themes` handles SSR hydration issues and localStorage persistence automatically.

**Alternatives Considered**:
- Media query only: No user control, follows system preference only
- Custom implementation: Reinventing the wheel, SSR complexity
- CSS variables: More complex, less Tailwind-idiomatic

---

### 6. Deployment Configuration

**Decision**: Deploy frontend to Vercel, backend to Koyeb, database on Neon

**Vercel Configuration**:
- Automatic deployments from git push
- Environment variables: `NEXT_PUBLIC_API_URL`, `BETTER_AUTH_SECRET`
- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 20.x

**Koyeb Configuration**:
- Deploy from GitHub repository or Docker image
- Environment variables: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn src.main:app --host 0.0.0.0 --port 8000`
- Health check: `GET /health`

**CORS Configuration**:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Database Connection**:
- Neon provides connection string in format: `postgresql://user:pass@host/db`
- Use connection pooling (configured in SQLModel setup)
- Enable SSL: `?sslmode=require` in connection string

**Environment Variables**:

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=https://api.example.com
BETTER_AUTH_SECRET=<strong-random-secret>
```

Backend (.env):
```
DATABASE_URL=postgresql+asyncpg://user:pass@host/db?sslmode=require
JWT_SECRET=<strong-random-secret>
CORS_ORIGINS=https://app.example.com
```

**Rationale**: Vercel is optimized for Next.js with zero-config deployments. Koyeb provides simple Python deployment with good performance. Neon offers serverless PostgreSQL with automatic scaling.

**Alternatives Considered**:
- Netlify: Similar to Vercel but less Next.js-optimized
- Railway: Good but Koyeb has better free tier
- AWS/GCP: More complex, overkill for MVP
- Self-hosted: Higher maintenance burden

---

## Summary of Key Decisions

| Area | Technology | Rationale |
|------|------------|-----------|
| Frontend Auth | Better Auth | Built for Next.js App Router, secure defaults |
| Backend Auth | python-jose + FastAPI deps | Standard FastAPI pattern, clean DI |
| Database ORM | SQLModel + asyncpg | Type-safe, async, Pydantic integration |
| API Client | Axios with interceptors | Clean token injection, error handling |
| Dark Mode | Tailwind class-based + next-themes | User control, SSR support, persistence |
| Frontend Deploy | Vercel | Zero-config Next.js deployment |
| Backend Deploy | Koyeb | Simple Python deployment, good free tier |
| Database | Neon PostgreSQL | Serverless, auto-scaling, managed |

## Implementation Risks & Mitigations

1. **Better Auth Learning Curve**
   - Risk: Team unfamiliar with Better Auth
   - Mitigation: Comprehensive documentation review, fallback to custom JWT if needed

2. **Async SQLModel Complexity**
   - Risk: Async/await patterns can be tricky
   - Mitigation: Use consistent patterns, thorough testing of database operations

3. **CORS Configuration**
   - Risk: Misconfigured CORS blocks frontend requests
   - Mitigation: Test CORS early, use environment-specific origins

4. **Connection Pool Exhaustion**
   - Risk: Neon connection limits under high load
   - Mitigation: Proper pool sizing, connection monitoring, upgrade plan if needed

## Next Steps

With research complete, proceed to Phase 1:
1. Create data-model.md with detailed entity schemas
2. Generate OpenAPI specification in contracts/api-spec.yaml
3. Write quickstart.md for local development setup
4. Update agent context with technology decisions
