# Research Document: Dashboard UI Upgrade

## Decision: API Base URL Configuration
**Rationale**: The API base URL is configured using the environment variable `NEXT_PUBLIC_API_URL` with a default value of `http://localhost:8000/api/v1`. This is used in the axios API client configuration.

## Decision: Current Dashboard Structure
**Rationale**: The current dashboard is located at `frontend/src/app/dashboard/page.tsx` and includes:
- User welcome message
- Dashboard statistics cards (Total Tasks, Completed, Overdue)
- Sample task list with mock data

## Decision: Task Data Model Structure
**Rationale**: The Task entity has the following structure based on `frontend/src/services/taskService.ts`:
- id: string
- owner_id: string
- title: string
- description: string | null
- priority: "low" | "medium" | "high"
- due_date: string | null
- completed: boolean
- created_at: string
- updated_at: string

## Decision: API Endpoint Patterns
**Rationale**: The API client in `frontend/src/lib/api.ts` shows that the backend API is mounted at `/api/v1`, and the service calls use relative paths that map to:
- GET `/api/v1/tasks` - List all tasks for user
- POST `/api/v1/tasks` - Create new task
- GET `/api/v1/tasks/{id}` - Get specific task
- PUT `/api/v1/tasks/{id}` - Update task
- DELETE `/api/v1/tasks/{id}` - Delete task
- PATCH `/api/v1/tasks/{id}` - Toggle completion

## Decision: Authentication Method
**Rationale**: Authentication is handled via JWT token stored in the cookie `better-auth.session_token` which is automatically attached to requests in the API client interceptor.

## Decision: Voice Recognition Implementation
**Rationale**: For voice commands, we'll use the Web Speech API (SpeechRecognition) which is supported in modern browsers. We'll implement graceful fallback for browsers that don't support it.

## Decision: Framer Motion Integration
**Rationale**: Framer Motion is already being used in the current dashboard (`frontend/src/app/dashboard/page.tsx`) with the `motion` component for animations.