---
id: 001
title: Initial Constitution Ratification
stage: constitution
date: 2026-01-07
surface: agent
model: claude-sonnet-4-5
feature: none
branch: master
user: Zohaib Shah
command: /sp.constitution
labels: ["governance", "constitution", "project-setup", "principles"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A (governance document)
---

## Prompt

```text
/sp.constitution

Project Name:
Multi-User Todo Full-Stack Web Application

Development Mode:
Spec-Driven Development (Spec-Kit Plus + Claude Code)

Repository Type:
Monorepo (Frontend + Backend)

--------------------------------------------------
CORE OBJECTIVE
--------------------------------------------------
Build a production-ready, secure, multi-user Todo web application that implements all Basic-Level features using a modern full-stack architecture. The system must enforce strict user isolation, JWT-based authentication, and RESTful API standards.

--------------------------------------------------
NON-NEGOTIABLE PRINCIPLES
--------------------------------------------------
1. Spec is Law
No code may be written without an approved spec.

2. Security First
All API endpoints must require JWT authentication.

3. User Isolation
Users may only access their own tasks. Backend must verify ownership using JWT.

4. Stateless Backend
Authentication is JWT-only. No shared sessions.

5. Monorepo Discipline
Frontend and backend live in one repository with strict separation.

--------------------------------------------------
CORE FEATURES (MANDATORY)
--------------------------------------------------
1. JWT Authentication
- Signup & Signin via Better Auth (Next.js)
- JWT issued on login
- Shared secret: BETTER_AUTH_SECRET
- Token sent in Authorization: Bearer <token>

2. Full CRUD Tasks
- Create
- Read
- Update
- Delete
- Toggle completion

3. Task Enhancements
- Priority levels
- Due dates
- Completion status

4. Search & Filter
- By completion
- By priority
- By title/description

5. Responsive UI
- Mobile-first
- Dark / Light mode

--------------------------------------------------
TECHNOLOGY STACK (STRICT)
--------------------------------------------------
Frontend:
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth

Backend:
- FastAPI (Python)
- SQLModel ORM
- JWT verification middleware

Database:
- Neon Serverless PostgreSQL

Development:
- Claude Code
- GitHub Spec-Kit Plus

Deployment:
- Frontend: Vercel
- Backend: Koyeb

--------------------------------------------------
API CONTRACT (IMMUTABLE)
--------------------------------------------------
GET    /api/{user_id}/tasks
POST   /api/{user_id}/tasks
GET    /api/{user_id}/tasks/{id}
PUT    /api/{user_id}/tasks/{id}
DELETE /api/{user_id}/tasks/{id}
PATCH  /api/{user_id}/tasks/{id}/complete

Rule:
The user_id in the URL MUST match the authenticated user from JWT.

--------------------------------------------------
AUTHENTICATION RULES
--------------------------------------------------
- JWT required for every request
- Missing/invalid token → 401 Unauthorized
- User identity is extracted from JWT only

--------------------------------------------------
DATA OWNERSHIP RULES
--------------------------------------------------
- Every task has owner_id
- All queries must filter by owner_id
- Cross-user access is forbidden

--------------------------------------------------
ERROR HANDLING STANDARD
--------------------------------------------------
400 → Validation Error
401 → Unauthorized
403 → Forbidden
404 → Not Found
500 → Server Error

--------------------------------------------------
MONOREPO STRUCTURE
--------------------------------------------------
repo-root/
├── frontend/
├── backend/
├── specs/
├── sp.constitution
└── README.md

--------------------------------------------------
SUCCESS CRITERIA
--------------------------------------------------
- All Basic-Level features implemented
- JWT-secured REST API
- Complete user isolation
- Responsive UI
- Auth & ownership enforced at backend

--------------------------------------------------
FINAL RULE
--------------------------------------------------
If a feature or behavior is not defined in a spec, it MUST NOT be implemented.

This constitution is binding for all future specs and implementations.
```

## Response snapshot

Successfully created the project constitution at `.specify/memory/constitution.md` with version 1.0.0.

**Constitution Structure:**
- 6 Core Principles (Spec is Law, Security First, User Isolation, Stateless Backend, Monorepo Discipline, Test-Driven Development)
- Technology Stack (Immutable) - Full-stack specification with Next.js, FastAPI, Neon PostgreSQL
- API Contract (Immutable) - RESTful endpoints with JWT authentication
- Core Features (Mandatory) - JWT auth, CRUD operations, task attributes, search/filter, responsive UI
- Data Ownership Rules - Strict user isolation enforcement
- Monorepo Structure - Clear separation of frontend/backend/specs
- Success Criteria - 7 measurable outcomes
- Governance - Amendment process, versioning policy, compliance requirements

**Key Decisions:**
1. Adopted semantic versioning for constitution (1.0.0)
2. Established JWT-only authentication as non-negotiable
3. Defined strict API contract with user_id path parameter matching JWT claims
4. Mandated monorepo structure with clear boundaries
5. Made testing optional unless explicitly specified in feature specs

**Template Consistency:**
- ✅ plan-template.md: Constitution Check section aligns with principles
- ✅ spec-template.md: User story structure supports feature requirements
- ✅ tasks-template.md: Task organization supports monorepo and testing discipline

## Outcome

- ✅ Impact: Project governance established with 6 core principles, immutable technology stack, and strict API contract. All future development must comply with constitutional requirements.
- 🧪 Tests: N/A (governance document, not code)
- 📁 Files: Created `.specify/memory/constitution.md` (256 lines)
- 🔁 Next prompts: Ready for feature specification creation using `/sp.specify` command
- 🧠 Reflection: Constitution successfully maps user requirements to formal governance structure. All placeholders filled, no ambiguities remain. Templates verified for consistency.

## Evaluation notes (flywheel)

- Failure modes observed: None - template structure was clear and user input was comprehensive
- Graders run and results (PASS/FAIL): Manual validation PASS - no unresolved placeholders, all sections complete, version and dates properly formatted
- Prompt variant (if applicable): Standard constitution creation workflow
- Next experiment (smallest change to try): N/A - initial constitution ratification successful
