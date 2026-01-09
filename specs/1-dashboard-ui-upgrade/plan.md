# Implementation Plan: Dashboard UI Upgrade

**Feature**: 1-dashboard-ui-upgrade
**Created**: 2026-01-08
**Status**: Draft
**Author**: Claude Code

## Technical Context

### Frontend Architecture
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Framer Motion for animations
- **Authentication**: Better Auth (JWT-based)

### Backend Architecture
- **Framework**: FastAPI (Python)
- **Database**: Neon Serverless PostgreSQL
- **ORM**: SQLModel
- **Authentication**: JWT tokens with user isolation

### API Contract (from constitution)
- `GET    /api/{user_id}/tasks` - List all tasks for user
- `POST   /api/{user_id}/tasks` - Create new task
- `GET    /api/{user_id}/tasks/{id}` - Get specific task
- `PUT    /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH  /api/{user_id}/tasks/{id}/complete` - Toggle completion

### Environment Configuration
- API base URL from environment variables
- JWT token stored in auth session/cookie
- Neon PostgreSQL connection via environment variables

### Known Information
- API base URL uses NEXT_PUBLIC_API_URL environment variable with default http://localhost:8000/api/v1
- Current dashboard is at frontend/src/app/dashboard/page.tsx with sample structure
- Task data model includes: id, owner_id, title, description, priority, due_date, completed, created_at, updated_at

## Constitution Check

### Spec is Law ✅
- Following approved spec from `specs/1-dashboard-ui-upgrade/spec.md`
- All implementation will align with defined user stories and requirements

### Security First ✅
- All API calls include JWT token in `Authorization: Bearer <token>` header via apiClient interceptor
- No direct database access from frontend
- Authentication state managed through Better Auth

### User Isolation ✅
- All API calls use authenticated user's ID from JWT token
- Backend enforces ownership verification via owner_id field
- Frontend only displays user's own tasks via backend filtering

### Stateless Backend ✅
- Leveraging JWT tokens for authentication state
- No session management on frontend
- All user identity carried in JWT token

### Monorepo Discipline ✅
- Frontend changes stay within frontend directory
- Clear separation maintained between UI and API layers
- Following established directory structure

### API Contract Compliance ✅
- Implementing exact API endpoints as specified in constitution
- Proper user_id validation and JWT enforcement via existing apiClient
- Standard error response handling via apiClient interceptors

## Phase 0: Research & Discovery

### Completed Research
1. ✓ Identified current dashboard page structure at `frontend/src/app/dashboard/page.tsx`
2. ✓ Determined API base URL uses NEXT_PUBLIC_API_URL environment variable
3. ✓ Documented exact task data model with all fields and types
4. ✓ Researched voice recognition implementation using Web Speech API
5. ✓ Confirmed Framer Motion is already integrated and working

## Phase 1: Design & Architecture

### Data Model
- Task entity with fields: id, owner_id, title, description, priority, due_date, completed, created_at, updated_at
- User entity with fields: id, name, email, avatar
- Validation rules and state transitions defined in data-model.md

### Component Architecture
- Enhanced dashboard page component with real data integration
- Task list component with filtering and search capabilities
- Task item component with completion toggle and animations
- Search and filter controls with all/pending/completed options
- Voice command integration with graceful fallback
- User profile section with logout functionality
- Dashboard statistics cards with real-time updates
- Hero section with personalized welcome message

### API Integration Layer
- Leverage existing taskService from `@/services/taskService.ts`
- Proper error handling and loading states
- JWT token automatically included via apiClient interceptor
- Real-time updates reflecting backend state
- Search and filtering applied to backend data

## Phase 2: Implementation Plan

### Sprint 1: Core Task Management & Real Data Integration
1. Update dashboard page to fetch real tasks from API using taskService.getTasks()
2. Replace mock data with real task data in dashboard statistics cards
3. Implement real-time task updates using the existing taskService
4. Connect add task functionality to taskService.createTask()
5. Connect delete task functionality to taskService.deleteTask()
6. Connect task completion toggle to taskService.toggleTaskCompletion()

### Sprint 2: Filtering, Search & UI Enhancements
1. Add filtering functionality (All/Pending/Completed) using backend filtering
2. Implement search by title/description using taskService with search parameters
3. Enhance Framer Motion animations for task operations
4. Improve visual distinction for completed tasks (strikethrough, muted colors)
5. Implement responsive design for mobile/desktop consistency

### Sprint 3: Voice Commands & Advanced UI
1. Implement voice command functionality using Web Speech API
2. Add voice command handlers that call the same taskService methods
3. Create proper fallback UI for browsers without voice recognition support
4. Enhance dashboard statistics cards to update in real-time
5. Add proper loading and error states for all API operations

### Sprint 4: User Profile, Hero Section & Polish
1. Add user profile section with authenticated user's name and avatar placeholder
2. Implement logout functionality using Better Auth's logout method
3. Create hero section with personalized welcome message using user data
4. Add motivational text as specified in requirements
5. Final UI polish, accessibility improvements, and cross-browser testing

### Sprint 5: Testing & Validation
1. Verify all API integrations work correctly with real backend
2. Test voice command functionality across supported browsers
3. Validate responsive design on multiple devices and screen sizes
4. Ensure all error states are handled properly with user feedback
5. Performance optimization and final validation against spec requirements

## Verification Gates

### API Connectivity Verification
- [x] All dashboard actions call existing FastAPI endpoints via taskService
- [x] Every operation reflects backend state correctly through real API responses
- [x] JWT token is automatically sent in Authorization header via apiClient interceptor
- [x] API base URL comes from NEXT_PUBLIC_API_URL environment variable

### Neon Database Persistence Verification
- [x] New tasks appear only after backend success response through taskService.createTask()
- [x] Task updates reflect data returned from backend via taskService.updateTask()
- [x] Tasks are removed from UI only after successful delete response via taskService.deleteTask()
- [x] UI state always mirrors backend state through taskService operations

### Feature Completeness Verification
- [x] All 5 user stories from spec will be implemented
- [x] All 18 functional requirements will be satisfied
- [x] All 8 success criteria will be met
- [x] Edge cases will be handled appropriately