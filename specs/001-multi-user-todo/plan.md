# Implementation Plan: Multi-User Todo Application

**Branch**: `001-multi-user-todo` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-multi-user-todo/spec.md`

## Summary

Build a secure, multi-user task management web application with JWT-based authentication, full CRUD operations, task organization features (priority, due dates, completion tracking), search/filter capabilities, and a responsive UI with theme support. The system enforces strict user isolation where users can only access their own tasks, with all API endpoints requiring JWT authentication and backend verification of ownership.

**Technical Approach**: Monorepo architecture with Next.js frontend (App Router, TypeScript, Tailwind CSS, Better Auth) and FastAPI backend (Python, SQLModel ORM, JWT middleware, Pydantic validation) connected to Neon Serverless PostgreSQL. Frontend handles authentication via Better Auth and issues JWTs; backend verifies tokens and enforces user isolation on all data operations.

## Technical Context

**Language/Version**:
- Frontend: TypeScript 5.x with Next.js 16+
- Backend: Python 3.11+

**Primary Dependencies**:
- Frontend: Next.js 16+ (App Router), Better Auth, Tailwind CSS 3.x, React 19+
- Backend: FastAPI 0.110+, SQLModel 0.0.14+, Pydantic 2.x, python-jose (JWT), passlib (password hashing)

**Storage**: Neon Serverless PostgreSQL (cloud-hosted, connection pooling enabled)

**Testing**:
- Frontend: Jest + React Testing Library (if tests specified)
- Backend: pytest + pytest-asyncio (if tests specified)
- Note: Tests are optional per constitution - only if explicitly requested in spec

**Target Platform**:
- Frontend: Web browsers (Chrome, Firefox, Safari, Edge - last 2 versions), deployed on Vercel
- Backend: Linux server environment, deployed on Koyeb

**Project Type**: Web application (monorepo with frontend + backend)

**Performance Goals**:
- API response time: <500ms under normal load (per spec SC-004)
- Task list load time: <2 seconds for up to 1000 tasks (per spec SC-012)
- Support 1000+ concurrent authenticated users (per spec SC-005)

**Constraints**:
- Stateless backend (no server-side sessions)
- JWT-only authentication
- All database queries MUST filter by owner_id
- User ID in URL path MUST match JWT user_id
- HTTPS/TLS required for token transmission

**Scale/Scope**:
- Expected: 1000+ concurrent users
- Task volume: Up to 1000 tasks per user
- 6 user stories (P1-P6)
- 56 functional requirements
- 3 pages (signup, login, dashboard)
- 6 API endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Spec is Law ✅
- **Status**: PASS
- **Evidence**: Complete specification exists at `specs/001-multi-user-todo/spec.md` with 6 user stories, 56 functional requirements, and 12 success criteria
- **Compliance**: All implementation will follow approved spec

### II. Security First ✅
- **Status**: PASS
- **Evidence**: Spec requires JWT authentication for all endpoints (FR-006, FR-007), token verification (FR-009), and proper error responses (FR-052, FR-053)
- **Compliance**: Backend will implement JWT middleware; all endpoints will require authentication

### III. User Isolation ✅
- **Status**: PASS
- **Evidence**: Spec mandates owner_id filtering (FR-008, FR-013, FR-018), prevents cross-user access (FR-009), and enforces ownership verification
- **Compliance**: All database queries will filter by owner_id; backend will verify JWT user_id matches URL user_id

### IV. Stateless Backend ✅
- **Status**: PASS
- **Evidence**: Spec requires JWT-only authentication (FR-005, FR-006), no session state mentioned
- **Compliance**: Backend will not maintain session state; all auth info carried in JWT

### V. Monorepo Discipline ✅
- **Status**: PASS
- **Evidence**: Constitution mandates frontend/ and backend/ separation; spec aligns with this structure
- **Compliance**: Will use monorepo structure with clear boundaries

### VI. Test-Driven Development (When Specified) ✅
- **Status**: PASS
- **Evidence**: Spec does not explicitly request tests; constitution states tests are optional unless specified
- **Compliance**: Tests will not be written unless explicitly requested

**Overall Gate Status**: ✅ PASS - All constitutional principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-multi-user-todo/
├── plan.md              # This file (/sp.plan command output)
├── spec.md              # Feature specification (already exists)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── api-spec.yaml    # OpenAPI specification
├── checklists/          # Quality validation
│   └── requirements.md  # Requirements checklist (already exists)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
TodoApp/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── (auth)/             # Auth route group
│   │   │   │   ├── signup/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── login/
│   │   │   │       └── page.tsx
│   │   │   ├── dashboard/          # Protected route
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx          # Root layout
│   │   │   └── page.tsx            # Home/redirect
│   │   ├── components/             # React components
│   │   │   ├── auth/
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── tasks/
│   │   │   │   ├── TaskList.tsx
│   │   │   │   ├── TaskItem.tsx
│   │   │   │   ├── TaskForm.tsx
│   │   │   │   ├── TaskFilters.tsx
│   │   │   │   └── TaskSearch.tsx
│   │   │   ├── ui/                 # Reusable UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   └── ThemeToggle.tsx
│   │   │   └── layout/
│   │   │       ├── Header.tsx
│   │   │       └── Footer.tsx
│   │   ├── lib/                    # Utilities and helpers
│   │   │   ├── auth.ts             # Better Auth configuration
│   │   │   ├── api-client.ts       # API client with JWT handling
│   │   │   └── utils.ts            # Helper functions
│   │   ├── types/                  # TypeScript types
│   │   │   ├── task.ts
│   │   │   └── user.ts
│   │   └── hooks/                  # Custom React hooks
│   │       ├── useAuth.ts
│   │       ├── useTasks.ts
│   │       └── useTheme.ts
│   ├── public/                     # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
│
├── backend/
│   ├── src/
│   │   ├── main.py                 # FastAPI app entry point
│   │   ├── config.py               # Configuration management
│   │   ├── database.py             # Database connection setup
│   │   ├── models/                 # SQLModel models
│   │   │   ├── __init__.py
│   │   │   ├── user.py             # User model
│   │   │   └── task.py             # Task model
│   │   ├── schemas/                # Pydantic schemas (request/response)
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   └── task.py
│   │   ├── api/                    # API routes
│   │   │   ├── __init__.py
│   │   │   ├── deps.py             # Dependencies (JWT verification)
│   │   │   └── routes/
│   │   │       ├── __init__.py
│   │   │       └── tasks.py        # Task endpoints
│   │   ├── services/               # Business logic
│   │   │   ├── __init__.py
│   │   │   └── task_service.py
│   │   └── middleware/             # Custom middleware
│   │       ├── __init__.py
│   │       └── auth.py             # JWT verification middleware
│   ├── tests/                      # Tests (if specified)
│   │   ├── __init__.py
│   │   ├── conftest.py
│   │   └── test_tasks.py
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── .env.example
│
├── specs/                          # Feature specifications
├── .specify/                       # Spec-Kit Plus templates
├── history/                        # Development history
├── .env.example                    # Environment template
├── .gitignore
└── README.md
```

**Structure Decision**: Selected Option 2 (Web application) with monorepo structure. Frontend and backend are completely separated with their own dependency management, following constitutional Monorepo Discipline principle. This structure supports:
- Independent deployment (Vercel for frontend, Koyeb for backend)
- Clear separation of concerns
- Atomic commits across full-stack changes
- No dependency cross-contamination

## Complexity Tracking

> **No violations detected** - All constitutional principles are satisfied by the planned architecture.

## Phase 0: Research & Technology Decisions

### Research Topics

1. **Better Auth Integration with Next.js 16 App Router**
   - Research how Better Auth works with Next.js App Router
   - JWT token generation and storage strategy
   - Token refresh mechanisms
   - Client-side auth state management

2. **FastAPI JWT Verification Best Practices**
   - JWT verification middleware implementation
   - Token validation and expiry handling
   - User extraction from JWT claims
   - Error handling for invalid/expired tokens

3. **SQLModel with Neon PostgreSQL**
   - Connection pooling configuration for serverless
   - Migration strategy (Alembic integration)
   - UUID primary key generation
   - Timestamp auto-update patterns

4. **Next.js API Client with JWT**
   - Interceptor pattern for adding Authorization header
   - Token storage (httpOnly cookies vs localStorage)
   - Error handling and token refresh
   - Type-safe API client implementation

5. **Tailwind CSS Dark Mode Implementation**
   - Dark mode strategy (class-based vs media query)
   - Theme persistence across sessions
   - Smooth theme transitions
   - Component styling patterns

6. **Deployment Configuration**
   - Vercel environment variables for frontend
   - Koyeb environment variables for backend
   - CORS configuration for cross-origin requests
   - Database connection string management

### Research Outcomes

*These will be documented in detail in `research.md` after research phase completes.*

## Phase 1: Design Artifacts

### Data Model (`data-model.md`)

**Entities**:
1. **User** (managed by Better Auth, not directly in our backend)
   - id: UUID (primary key)
   - email: string (unique)
   - password_hash: string
   - created_at: timestamp
   - updated_at: timestamp

2. **Task** (our primary entity)
   - id: UUID (primary key)
   - owner_id: UUID (foreign key to User, indexed)
   - title: string (required, max 200 chars)
   - description: string (optional, max 2000 chars)
   - priority: enum (low, medium, high) - optional
   - due_date: date (optional)
   - completed: boolean (default false)
   - created_at: timestamp (auto)
   - updated_at: timestamp (auto)

**Relationships**:
- User → Task: One-to-Many (one user owns many tasks)
- Task → User: Many-to-One (each task belongs to one user)

**Indexes**:
- tasks.owner_id (critical for user isolation queries)
- tasks.completed (for filter performance)
- tasks.priority (for filter performance)

### API Contracts (`contracts/api-spec.yaml`)

**Base URL**: `https://api.example.com` (backend)

**Authentication**: All endpoints require `Authorization: Bearer <jwt_token>` header

**Endpoints**:

1. `GET /api/{user_id}/tasks`
   - Query params: completed (bool), priority (enum), search (string)
   - Response: Array of Task objects
   - Errors: 401, 403, 500

2. `POST /api/{user_id}/tasks`
   - Body: { title, description?, priority?, due_date? }
   - Response: Created Task object
   - Errors: 400, 401, 403, 500

3. `GET /api/{user_id}/tasks/{id}`
   - Response: Task object
   - Errors: 401, 403, 404, 500

4. `PUT /api/{user_id}/tasks/{id}`
   - Body: { title, description?, priority?, due_date? }
   - Response: Updated Task object
   - Errors: 400, 401, 403, 404, 500

5. `DELETE /api/{user_id}/tasks/{id}`
   - Response: 204 No Content
   - Errors: 401, 403, 404, 500

6. `PATCH /api/{user_id}/tasks/{id}/complete`
   - Response: Updated Task object with toggled completion
   - Errors: 401, 403, 404, 500

### Quickstart Guide (`quickstart.md`)

**Purpose**: Enable developers to set up and run the application locally

**Sections**:
1. Prerequisites (Node.js, Python, PostgreSQL)
2. Environment setup (.env configuration)
3. Database setup (Neon connection, migrations)
4. Frontend setup (npm install, dev server)
5. Backend setup (pip install, uvicorn dev server)
6. Testing the application (create account, create task)
7. Deployment instructions (Vercel + Koyeb)

## Phase 2: Task Generation

*This phase is handled by the `/sp.tasks` command and is NOT part of `/sp.plan` output.*

The tasks will be organized by user story priority (P1 → P6) with:
- Phase 1: Setup (project initialization)
- Phase 2: Foundational (database, auth middleware)
- Phase 3-8: User Stories 1-6 (independent implementation)
- Phase 9: Polish & Cross-cutting concerns

## Implementation Notes

### Critical Path
1. **P1 - Authentication** must be complete before any other user story
2. **P2 - CRUD Operations** is the core value proposition
3. **P3 - Task Organization** builds on P2
4. **P4 - Search/Filter** enhances usability
5. **P5 - Responsive UI** ensures accessibility
6. **P6 - Voice Input** is optional enhancement

### Security Considerations
- JWT secret must be strong and environment-specific
- Password hashing with bcrypt (via passlib)
- HTTPS required in production
- CORS properly configured for frontend origin
- SQL injection prevented by SQLModel parameterization
- XSS prevented by React's default escaping

### Performance Optimizations
- Database indexes on owner_id, completed, priority
- Connection pooling for Neon PostgreSQL
- Frontend: React.memo for task list items
- Backend: Async/await for all I/O operations
- Pagination consideration for large task lists (future enhancement)

### Error Handling Strategy
- Backend: Consistent error response format with status codes
- Frontend: User-friendly error messages, loading states
- Network errors: Retry logic with exponential backoff
- Token expiry: Automatic redirect to login

### Deployment Strategy
- Frontend: Vercel (automatic deployments from git)
- Backend: Koyeb (Docker container or direct Python deployment)
- Database: Neon (managed PostgreSQL, no manual setup)
- Environment variables: Separate for dev/staging/prod
- Secrets management: Platform-specific (Vercel secrets, Koyeb env vars)

## Next Steps

After this plan is approved:
1. Run `/sp.tasks` to generate detailed task breakdown
2. Review and approve tasks
3. Run `/sp.implement` to execute tasks
4. Use `/sp.git.commit_pr` to commit and create PR when ready

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Better Auth integration complexity | High | Research phase will validate integration approach; fallback to custom JWT implementation if needed |
| Neon PostgreSQL connection limits | Medium | Use connection pooling; monitor connection usage; upgrade plan if needed |
| JWT token size with user data | Low | Keep JWT claims minimal (user_id, email only); avoid embedding large data |
| Cross-origin issues in development | Low | Configure CORS properly; use proxy in development if needed |
| Theme preference not persisting | Low | Store in localStorage; sync with backend user preferences in future iteration |

## Success Metrics Alignment

This plan directly addresses all 12 success criteria from the specification:
- **SC-001**: Simple registration flow → <2 min
- **SC-002**: Optimized task creation form → <30 sec
- **SC-003**: Efficient search implementation → <10 sec
- **SC-004**: Async operations, optimized queries → <500ms
- **SC-005**: Stateless backend, connection pooling → 1000+ users
- **SC-006**: Clear UI, validation feedback → 95% success rate
- **SC-007**: Owner_id filtering, JWT verification → Zero incidents
- **SC-008**: Tailwind responsive design → 375px+ support
- **SC-009**: Tailwind responsive design → 1920px support
- **SC-010**: CSS transitions, instant toggle → Immediate feedback
- **SC-011**: JWT middleware on all endpoints → 100% enforcement
- **SC-012**: Indexed queries, efficient rendering → <2 sec for 1000 tasks
