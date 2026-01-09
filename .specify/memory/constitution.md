<!--
Sync Impact Report:
- Version: NEW → 1.0.0 (Initial constitution)
- Rationale: First ratification of project governance
- Modified principles: N/A (initial creation)
- Added sections: All sections (initial creation)
- Removed sections: None
- Templates requiring updates:
  ✅ plan-template.md (Constitution Check section aligns with principles)
  ✅ spec-template.md (User story structure supports feature requirements)
  ✅ tasks-template.md (Task organization supports monorepo and testing discipline)
- Follow-up TODOs: None
-->

# Multi-User Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec is Law

No code may be written without an approved specification. Every feature, enhancement, or modification MUST have a corresponding spec document that defines requirements, acceptance criteria, and success metrics before implementation begins. Specifications supersede all other documentation and serve as the single source of truth for what will be built.

**Rationale**: Prevents scope creep, ensures alignment between stakeholders and developers, and provides clear acceptance criteria for validation.

### II. Security First

All API endpoints MUST require JWT authentication. Every request to the backend must include a valid JWT token in the `Authorization: Bearer <token>` header. Missing or invalid tokens result in immediate 401 Unauthorized responses. Security is non-negotiable and cannot be deferred or treated as optional.

**Rationale**: Protects user data, prevents unauthorized access, and establishes security as a foundational requirement rather than an afterthought.

### III. User Isolation

Users may only access their own tasks. The backend MUST verify ownership using the authenticated user's identity extracted from the JWT token. Every database query MUST filter by `owner_id` matching the authenticated user. Cross-user access attempts are forbidden and result in 403 Forbidden responses.

**Rationale**: Ensures data privacy, prevents data leakage between users, and maintains trust in the multi-user system.

### IV. Stateless Backend

Authentication is JWT-only with no shared sessions or server-side state. The backend must remain stateless to enable horizontal scaling and simplify deployment. All user identity and authorization information is carried in the JWT token itself.

**Rationale**: Enables scalability, simplifies infrastructure, and aligns with modern cloud-native architecture patterns.

### V. Monorepo Discipline

Frontend and backend live in one repository with strict separation. The repository structure MUST maintain clear boundaries:
- `frontend/` contains all Next.js application code
- `backend/` contains all FastAPI application code
- `specs/` contains all feature specifications
- Shared configuration at root level only

No cross-contamination of dependencies or code between frontend and backend directories.

**Rationale**: Simplifies version control, enables atomic commits across full-stack changes, while maintaining clear architectural boundaries.

### VI. Test-Driven Development (When Specified)

Tests are written ONLY when explicitly requested in the feature specification. When tests are required, they MUST be written before implementation (Red-Green-Refactor cycle). Tests must fail initially, then pass after implementation. This principle is non-negotiable when testing is specified.

**Rationale**: Ensures code correctness, provides regression protection, and validates that implementation meets requirements when testing is deemed necessary.

## Technology Stack (Immutable)

The following technology choices are binding and MUST NOT be substituted without constitutional amendment:

**Frontend**:
- Next.js 16+ (App Router only)
- TypeScript (strict mode)
- Tailwind CSS for styling
- Better Auth for authentication

**Backend**:
- FastAPI (Python)
- SQLModel ORM for database operations
- JWT verification middleware
- Pydantic for validation

**Database**:
- Neon Serverless PostgreSQL

**Development Tools**:
- Claude Code for AI-assisted development
- GitHub for version control
- Spec-Kit Plus for specification management

**Deployment**:
- Frontend: Vercel
- Backend: Koyeb

**Rationale**: These technologies form a cohesive, modern stack with strong typing, excellent developer experience, and proven production reliability. Changes require careful evaluation of ecosystem impact.

## API Contract (Immutable)

All API endpoints MUST follow this exact structure:

```
GET    /api/{user_id}/tasks           # List all tasks for user
POST   /api/{user_id}/tasks           # Create new task
GET    /api/{user_id}/tasks/{id}      # Get specific task
PUT    /api/{user_id}/tasks/{id}      # Update task
DELETE /api/{user_id}/tasks/{id}      # Delete task
PATCH  /api/{user_id}/tasks/{id}/complete  # Toggle completion
```

**Enforcement Rules**:
1. The `user_id` in the URL path MUST match the authenticated user's ID from the JWT token
2. Mismatched user_id results in 403 Forbidden
3. All endpoints require valid JWT in `Authorization: Bearer <token>` header
4. Missing/invalid JWT results in 401 Unauthorized

**Error Response Standards**:
- `400 Bad Request` → Validation errors (malformed input)
- `401 Unauthorized` → Missing or invalid JWT token
- `403 Forbidden` → Valid token but insufficient permissions (user_id mismatch)
- `404 Not Found` → Resource does not exist or user doesn't own it
- `500 Internal Server Error` → Unexpected server errors

**Rationale**: Consistent API structure improves developer experience, simplifies client implementation, and makes security verification straightforward.

## Core Features (Mandatory)

The following features define the minimum viable product and MUST be implemented:

1. **JWT Authentication**
   - User signup and signin via Better Auth
   - JWT token issued on successful login
   - Shared secret: `BETTER_AUTH_SECRET` environment variable
   - Token included in all API requests

2. **Full CRUD Operations**
   - Create new tasks
   - Read task list and individual tasks
   - Update existing tasks
   - Delete tasks
   - Toggle task completion status

3. **Task Attributes**
   - Title (required)
   - Description (optional)
   - Priority levels (low, medium, high)
   - Due dates
   - Completion status (boolean)
   - Owner ID (automatically set from JWT)

4. **Search and Filter**
   - Filter by completion status (completed/incomplete)
   - Filter by priority level
   - Search by title or description text

5. **Responsive UI**
   - Mobile-first design approach
   - Dark mode and light mode support
   - Accessible on all device sizes

**Rationale**: These features represent the core value proposition and must work correctly before any enhancements are considered.

## Data Ownership Rules

Every task record MUST include an `owner_id` field that references the user who created it. The following rules are non-negotiable:

1. **Creation**: When a task is created, `owner_id` is automatically set to the authenticated user's ID from JWT (never from request body)
2. **Queries**: All database queries MUST include `WHERE owner_id = <authenticated_user_id>`
3. **Updates**: Users can only update tasks where `owner_id` matches their authenticated ID
4. **Deletion**: Users can only delete tasks where `owner_id` matches their authenticated ID
5. **Validation**: Backend MUST verify ownership before any operation; never trust client-provided user IDs

**Rationale**: Prevents privilege escalation, ensures data isolation, and maintains the integrity of the multi-user system.

## Monorepo Structure

The repository MUST maintain this exact structure:

```
TodoApp/
├── frontend/              # Next.js application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── backend/               # FastAPI application
│   ├── src/
│   ├── tests/
│   ├── requirements.txt
│   └── pyproject.toml
├── specs/                 # Feature specifications
│   └── [###-feature-name]/
│       ├── spec.md
│       ├── plan.md
│       └── tasks.md
├── .specify/              # Spec-Kit Plus templates
│   ├── memory/
│   │   └── constitution.md  # This file
│   ├── templates/
│   └── scripts/
├── history/               # Development history
│   ├── prompts/
│   └── adr/
├── .env.example           # Environment template
├── README.md
└── .gitignore
```

**Rules**:
- Frontend dependencies stay in `frontend/package.json`
- Backend dependencies stay in `backend/requirements.txt`
- No shared code between frontend and backend (communicate via API only)
- Specifications live in `specs/` with feature-specific subdirectories

**Rationale**: Clear separation prevents dependency conflicts, simplifies deployment, and maintains architectural boundaries.

## Success Criteria

The project is considered successful when ALL of the following are met:

1. **Functional Completeness**: All mandatory core features are implemented and working
2. **Security Compliance**: JWT authentication enforced on all endpoints, user isolation verified
3. **API Conformance**: All endpoints match the API contract exactly
4. **Responsive Design**: UI works correctly on mobile, tablet, and desktop
5. **Data Integrity**: No user can access another user's tasks under any circumstance
6. **Error Handling**: All error cases return appropriate HTTP status codes
7. **Deployment Ready**: Both frontend and backend deploy successfully to their respective platforms

**Validation Method**: Each criterion must be independently testable and verifiable through automated tests or manual verification procedures.

## Governance

### Amendment Process

1. **Proposal**: Any team member may propose a constitutional amendment
2. **Documentation**: Proposed changes must be documented with rationale and impact analysis
3. **Review**: All stakeholders must review and approve changes
4. **Migration Plan**: If amendment affects existing code, a migration plan is required
5. **Version Bump**: Constitution version must be incremented according to semantic versioning

### Versioning Policy

- **MAJOR** (X.0.0): Backward-incompatible changes (principle removal, technology stack changes)
- **MINOR** (x.Y.0): New principles added, new mandatory sections, expanded guidance
- **PATCH** (x.y.Z): Clarifications, wording improvements, typo fixes

### Compliance

- All pull requests MUST verify compliance with this constitution
- Spec documents MUST reference relevant constitutional principles
- Any complexity or deviation MUST be explicitly justified in planning documents
- Constitution supersedes all other project documentation in case of conflict

### Final Rule

**If a feature or behavior is not defined in an approved specification, it MUST NOT be implemented.**

This prevents scope creep, ensures all work is intentional and documented, and maintains the integrity of the spec-driven development process.

---

**Version**: 1.0.0 | **Ratified**: 2026-01-07 | **Last Amended**: 2026-01-07
