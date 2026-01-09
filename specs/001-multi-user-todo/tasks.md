# Tasks: Multi-User Todo Application

**Input**: Design documents from `/specs/001-multi-user-todo/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT required per constitution - spec does not explicitly request tests

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`
- Paths shown below follow monorepo structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create monorepo directory structure (frontend/, backend/, specs/)
- [ ] T002 [P] Initialize frontend Next.js 16+ project with TypeScript in frontend/
- [ ] T003 [P] Initialize backend FastAPI project with Python 3.11+ in backend/
- [ ] T004 [P] Configure Tailwind CSS 3.x in frontend/tailwind.config.ts
- [ ] T005 [P] Install Framer Motion in frontend/ for animations
- [ ] T006 [P] Install Better Auth in frontend/ for authentication
- [ ] T007 [P] Install FastAPI dependencies in backend/requirements.txt (FastAPI, SQLModel, python-jose, passlib)
- [ ] T008 [P] Create frontend/.env.example with NEXT_PUBLIC_API_URL and BETTER_AUTH_SECRET
- [ ] T009 [P] Create backend/.env.example with DATABASE_URL, JWT_SECRET, CORS_ORIGINS
- [ ] T010 [P] Configure TypeScript strict mode in frontend/tsconfig.json
- [ ] T011 [P] Setup ESLint and Prettier in frontend/
- [ ] T012 Create .gitignore for monorepo (node_modules, venv, .env, .next, __pycache__)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T013 Configure Neon PostgreSQL connection in backend/src/database.py with async engine
- [ ] T014 Create SQLModel base configuration in backend/src/database.py with connection pooling
- [ ] T015 Initialize Alembic for database migrations in backend/
- [ ] T016 Create Task model in backend/src/models/task.py with all fields (id, owner_id, title, description, priority, due_date, completed, timestamps)
- [ ] T017 Create PriorityEnum in backend/src/models/task.py (low, medium, high)
- [ ] T018 Create Pydantic schemas in backend/src/schemas/task.py (TaskCreate, TaskUpdate, TaskResponse)
- [ ] T019 Create JWT verification utility in backend/src/api/deps.py using python-jose
- [ ] T020 Create get_current_user dependency in backend/src/api/deps.py to extract user_id from JWT
- [ ] T021 Configure CORS middleware in backend/src/main.py for frontend origin
- [ ] T022 Create database migration for tasks table with indexes (owner_id, completed, priority)
- [ ] T023 Apply initial database migration using Alembic
- [ ] T024 Configure Better Auth provider in frontend/src/lib/auth.ts with JWT plugin
- [ ] T025 Create API client with Axios in frontend/src/lib/api-client.ts with JWT interceptor
- [ ] T026 Create TypeScript types in frontend/src/types/task.ts (Task, Priority, TaskCreate, TaskUpdate)
- [ ] T027 Create TypeScript types in frontend/src/types/user.ts (User, Session)
- [ ] T028 Configure next-themes provider in frontend/src/app/layout.tsx for dark mode
- [ ] T029 Create root layout in frontend/src/app/layout.tsx with ThemeProvider

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts, log in securely, and receive JWT tokens for authenticated access

**Independent Test**: Create a new account via signup page, log in with credentials, verify JWT token is issued and stored, access protected dashboard, log out successfully

### Implementation for User Story 1

- [ ] T030 [P] [US1] Create reusable Button component in frontend/src/components/ui/Button.tsx with Tailwind and Framer Motion hover effects
- [ ] T031 [P] [US1] Create reusable Input component in frontend/src/components/ui/Input.tsx with validation states
- [ ] T032 [P] [US1] Create signup page in frontend/src/app/(auth)/signup/page.tsx with responsive layout
- [ ] T033 [US1] Create SignupForm component in frontend/src/components/auth/SignupForm.tsx with email and password fields
- [ ] T034 [US1] Add Framer Motion animations to SignupForm (staggered inputs, card fade + slide)
- [ ] T035 [US1] Implement form validation in SignupForm (email format, password min 8 chars)
- [ ] T036 [US1] Integrate Better Auth signup in SignupForm with error handling
- [ ] T037 [US1] Add loading, error, and success UI states to SignupForm
- [ ] T038 [US1] Add accessibility features to SignupForm (labels, keyboard navigation, ARIA attributes)
- [ ] T039 [P] [US1] Create login page in frontend/src/app/(auth)/login/page.tsx with responsive layout
- [ ] T040 [US1] Create LoginForm component in frontend/src/components/auth/LoginForm.tsx with email and password fields
- [ ] T041 [US1] Add Framer Motion animations to LoginForm (page entrance, card fade + slide, button hover/tap)
- [ ] T042 [US1] Implement form validation in LoginForm
- [ ] T043 [US1] Integrate Better Auth login in LoginForm with JWT token handling
- [ ] T044 [US1] Store JWT securely (httpOnly cookies via Better Auth)
- [ ] T045 [US1] Add loading, error, and success UI states to LoginForm
- [ ] T046 [US1] Add accessibility features to LoginForm
- [ ] T047 [US1] Add link to signup page from LoginForm
- [ ] T048 [US1] Add link to login page from SignupForm
- [ ] T049 [US1] Create useAuth hook in frontend/src/hooks/useAuth.ts for auth state management
- [ ] T050 [US1] Implement automatic JWT attachment to API requests in api-client.ts interceptor
- [ ] T051 [US1] Implement 401 error handling in api-client.ts (redirect to login)
- [ ] T052 [US1] Create home page in frontend/src/app/page.tsx with redirect logic (authenticated → dashboard, unauthenticated → login)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can register, log in, and receive JWT tokens.

---

## Phase 4: User Story 2 - Task Management (CRUD Operations) (Priority: P2)

**Goal**: Enable authenticated users to create, view, update, and delete their personal tasks with full CRUD operations

**Independent Test**: Log in, create a new task with title and description, view task in list, edit task details, delete task, verify all operations only affect authenticated user's tasks

### Implementation for User Story 2

- [ ] T053 [P] [US2] Create protected dashboard layout in frontend/src/app/dashboard/layout.tsx with route protection
- [ ] T054 [P] [US2] Create Header component in frontend/src/components/layout/Header.tsx with user profile section and logout button
- [ ] T055 [US2] Add responsive navigation to Header (sidebar/topbar toggle for mobile)
- [ ] T056 [US2] Create dashboard page in frontend/src/app/dashboard/page.tsx
- [ ] T057 [US2] Create dashboard hero section with animated heading using Framer Motion
- [ ] T058 [US2] Add subtitle and background gradient/glassmorphism to hero section
- [ ] T059 [P] [US2] Create TaskService in backend/src/services/task_service.py with CRUD methods
- [ ] T060 [US2] Implement create_task method in TaskService with owner_id from JWT
- [ ] T061 [US2] Implement get_tasks method in TaskService with owner_id filtering
- [ ] T062 [US2] Implement get_task_by_id method in TaskService with ownership verification
- [ ] T063 [US2] Implement update_task method in TaskService with ownership verification
- [ ] T064 [US2] Implement delete_task method in TaskService with ownership verification
- [ ] T065 [P] [US2] Create task routes in backend/src/api/routes/tasks.py
- [ ] T066 [US2] Implement POST /api/{user_id}/tasks endpoint with JWT verification and owner_id enforcement
- [ ] T067 [US2] Implement GET /api/{user_id}/tasks endpoint with JWT verification and owner_id filtering
- [ ] T068 [US2] Implement GET /api/{user_id}/tasks/{id} endpoint with ownership check
- [ ] T069 [US2] Implement PUT /api/{user_id}/tasks/{id} endpoint with ownership check
- [ ] T070 [US2] Implement DELETE /api/{user_id}/tasks/{id} endpoint with ownership check (returns 204)
- [ ] T071 [US2] Verify user_id in URL matches JWT user_id for all endpoints (403 if mismatch)
- [ ] T072 [P] [US2] Create TaskList component in frontend/src/components/tasks/TaskList.tsx
- [ ] T073 [P] [US2] Create TaskItem component in frontend/src/components/tasks/TaskItem.tsx with card layout
- [ ] T074 [US2] Add Framer Motion hover animations to TaskItem
- [ ] T075 [US2] Display title, description preview, created date in TaskItem
- [ ] T076 [US2] Create TaskForm component in frontend/src/components/tasks/TaskForm.tsx for create/edit
- [ ] T077 [US2] Add title and description fields to TaskForm
- [ ] T078 [US2] Create modal wrapper for TaskForm with animated open/close (Framer Motion)
- [ ] T079 [US2] Implement "Add Task" button in dashboard with modal trigger
- [ ] T080 [US2] Implement task creation with API call and optimistic UI update
- [ ] T081 [US2] Create useTasks hook in frontend/src/hooks/useTasks.ts for task state management
- [ ] T082 [US2] Implement task list fetching in useTasks with loading states
- [ ] T083 [US2] Add edit functionality to TaskItem with modal
- [ ] T084 [US2] Implement task update with API call and optimistic UI update
- [ ] T085 [US2] Add delete button to TaskItem with confirmation dialog
- [ ] T086 [US2] Implement delete confirmation dialog with Framer Motion animation
- [ ] T087 [US2] Implement task deletion with API call and smooth list update
- [ ] T088 [US2] Add error handling for all CRUD operations with user-friendly messages

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can manage their tasks with full CRUD operations.

---

## Phase 5: User Story 3 - Task Organization (Priority, Due Dates, Completion) (Priority: P3)

**Goal**: Enable users to organize tasks by setting priority levels, assigning due dates, and marking tasks as complete/incomplete

**Independent Test**: Create tasks with different priorities (low, medium, high), assign due dates, mark tasks as complete, toggle completion status, verify visual distinction between completed and incomplete tasks

### Implementation for User Story 3

- [ ] T089 [P] [US3] Create Select component in frontend/src/components/ui/Select.tsx for priority dropdown
- [ ] T090 [P] [US3] Add priority field to TaskForm with Select component (low, medium, high options)
- [ ] T091 [P] [US3] Add due date field to TaskForm with date input
- [ ] T092 [US3] Update TaskCreate schema validation to include priority and due_date
- [ ] T093 [US3] Update create_task endpoint to accept priority and due_date
- [ ] T094 [US3] Update update_task endpoint to accept priority and due_date
- [ ] T095 [P] [US3] Create priority badge component for TaskItem with color coding (low=green, medium=yellow, high=red)
- [ ] T096 [US3] Display priority badge in TaskItem if priority is set
- [ ] T097 [US3] Display due date in TaskItem with formatting (e.g., "Due: Jan 15, 2026")
- [ ] T098 [US3] Add visual indicator for overdue tasks (past due date)
- [ ] T099 [US3] Implement toggle_completion method in TaskService
- [ ] T100 [US3] Implement PATCH /api/{user_id}/tasks/{id}/complete endpoint
- [ ] T101 [US3] Add completion checkbox/toggle to TaskItem
- [ ] T102 [US3] Add Framer Motion animation for completion state change
- [ ] T103 [US3] Implement completion toggle with API call
- [ ] T104 [US3] Add visual distinction for completed tasks (strikethrough, opacity, different color)
- [ ] T105 [US3] Update TaskItem to show completed vs pending states clearly

**Checkpoint**: All user stories 1-3 should now be independently functional. Users can organize and track their task progress.

---

## Phase 6: User Story 4 - Search and Filter Tasks (Priority: P4)

**Goal**: Enable users to find specific tasks quickly by searching keywords and filtering by completion status or priority level

**Independent Test**: Create multiple tasks with different attributes, search for keywords in titles/descriptions, filter by completion status, filter by priority, combine multiple filters, clear filters to show all tasks

### Implementation for User Story 4

- [ ] T106 [P] [US4] Create TaskSearch component in frontend/src/components/tasks/TaskSearch.tsx with debounced input
- [ ] T107 [US4] Add Framer Motion animation for search results update
- [ ] T108 [US4] Implement search functionality in useTasks hook (client-side filtering)
- [ ] T109 [P] [US4] Create TaskFilters component in frontend/src/components/tasks/TaskFilters.tsx
- [ ] T110 [US4] Add completion status filter (All, Completed, Incomplete) with dropdown/pill UI
- [ ] T111 [US4] Add priority filter (All, Low, Medium, High) with dropdown/pill UI
- [ ] T112 [US4] Add smooth transitions for filter changes (Framer Motion)
- [ ] T113 [US4] Implement filter functionality in useTasks hook
- [ ] T114 [US4] Add "Clear Filters" button to reset all filters
- [ ] T115 [US4] Update GET /api/{user_id}/tasks endpoint to support query parameters (completed, priority, search)
- [ ] T116 [US4] Implement server-side filtering in get_tasks method with efficient SQL queries
- [ ] T117 [US4] Add search query parameter support (ILIKE for title and description)
- [ ] T118 [US4] Integrate TaskSearch and TaskFilters into dashboard page
- [ ] T119 [US4] Update useTasks to use server-side filtering when available
- [ ] T120 [US4] Add loading state during filter/search operations

**Checkpoint**: All user stories 1-4 should now be independently functional. Users can efficiently find and filter their tasks.

---

## Phase 7: User Story 5 - Responsive UI with Theme Support (Priority: P5)

**Goal**: Ensure application works seamlessly across all devices (mobile, tablet, desktop) with dark and light theme support

**Independent Test**: Access application on mobile device (375px), tablet (768px), and desktop (1920px), verify full functionality on all sizes, toggle between dark and light modes, verify theme persists across sessions

### Implementation for User Story 5

- [ ] T121 [P] [US5] Create ThemeToggle component in frontend/src/components/ui/ThemeToggle.tsx
- [ ] T122 [US5] Implement theme toggle functionality using next-themes (useTheme hook)
- [ ] T123 [US5] Add sun/moon icon with smooth transition animation
- [ ] T124 [US5] Add ThemeToggle to Header component
- [ ] T125 [P] [US5] Configure Tailwind dark mode classes for all components
- [ ] T126 [US5] Add dark mode styles to Button component (dark:bg-*, dark:text-*, dark:hover:*)
- [ ] T127 [US5] Add dark mode styles to Input component
- [ ] T128 [US5] Add dark mode styles to TaskItem component
- [ ] T129 [US5] Add dark mode styles to TaskForm component
- [ ] T130 [US5] Add dark mode styles to Header component
- [ ] T131 [US5] Add dark mode styles to dashboard hero section
- [ ] T132 [US5] Add dark mode styles to all UI components (Select, modals, dialogs)
- [ ] T133 [P] [US5] Test and fix mobile responsiveness for signup page (375px+)
- [ ] T134 [P] [US5] Test and fix mobile responsiveness for login page (375px+)
- [ ] T135 [P] [US5] Test and fix mobile responsiveness for dashboard (375px+)
- [ ] T136 [US5] Ensure TaskList is responsive with proper grid/flex layout
- [ ] T137 [US5] Ensure TaskItem cards stack properly on mobile
- [ ] T138 [US5] Ensure TaskForm modal is responsive on mobile
- [ ] T139 [US5] Test tablet responsiveness (768px-1024px) for all pages
- [ ] T140 [US5] Test desktop responsiveness (1920px+) for all pages
- [ ] T141 [US5] Add responsive navigation (hamburger menu for mobile)
- [ ] T142 [US5] Verify theme preference persists across page reloads (localStorage)
- [ ] T143 [US5] Add smooth CSS transitions for theme switching

**Checkpoint**: All user stories 1-5 should now be independently functional. Application works on all devices with theme support.

---

## Phase 8: User Story 6 - Voice-to-Task Input (Priority: P6) *(Optional)*

**Goal**: Enable users to create tasks using voice input via browser Speech API

**Independent Test**: Click voice input button, speak a task description, review transcribed text, edit if needed, confirm to create task, verify task is created with spoken title

### Implementation for User Story 6

- [ ] T144 [P] [US6] Check browser Speech API support in frontend
- [ ] T145 [P] [US6] Create VoiceInput component in frontend/src/components/tasks/VoiceInput.tsx
- [ ] T146 [US6] Implement Speech Recognition API integration in VoiceInput
- [ ] T147 [US6] Add microphone button with Framer Motion pulse animation during recording
- [ ] T148 [US6] Display real-time transcription preview
- [ ] T149 [US6] Add "Confirm" and "Cancel" buttons for transcribed text
- [ ] T150 [US6] Allow editing of transcribed text before confirmation
- [ ] T151 [US6] Integrate VoiceInput into TaskForm as alternative input method
- [ ] T152 [US6] Handle speech recognition errors gracefully (unclear speech, no permission)
- [ ] T153 [US6] Hide VoiceInput component if browser doesn't support Speech API
- [ ] T154 [US6] Add visual feedback during voice recording (animated waveform or pulsing icon)
- [ ] T155 [US6] Implement voice input for task title only (description remains text input)

**Checkpoint**: All 6 user stories should now be independently functional. Voice input provides alternative task creation method.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final production readiness

- [ ] T156 [P] Create empty state component for TaskList when no tasks exist
- [ ] T157 [US2] Add animated empty state with Framer Motion (friendly illustration and message)
- [ ] T158 [P] Create error state component for API failures
- [ ] T159 Add animated error UI with retry button
- [ ] T160 [P] Create loading skeleton for TaskList during data fetch
- [ ] T161 [P] Add loading spinner component with Framer Motion animation
- [ ] T162 Implement logout functionality in Header
- [ ] T163 Add logout confirmation dialog
- [ ] T164 Clear auth state on logout (Better Auth signOut)
- [ ] T165 Redirect to login page after logout with smooth transition
- [ ] T166 [P] Add user profile dropdown in Header with email display
- [ ] T167 Add avatar placeholder (optional) to profile dropdown
- [ ] T168 [P] Implement comprehensive error handling in backend with consistent error response format
- [ ] T169 [P] Add logging to backend (INFO for requests, ERROR for failures)
- [ ] T170 [P] Add request/response logging middleware in backend
- [ ] T171 Verify all API endpoints return correct HTTP status codes (400, 401, 403, 404, 500)
- [ ] T172 Add input validation error messages to all forms
- [ ] T173 Ensure all Framer Motion animations are consistent across the app
- [ ] T174 Add page transition animations between routes
- [ ] T175 Optimize TaskList rendering with React.memo for TaskItem
- [ ] T176 Add pagination consideration for large task lists (>100 tasks) - document for future
- [ ] T177 [P] Review and fix any accessibility issues (ARIA labels, keyboard navigation, focus states)
- [ ] T178 [P] Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] T179 Verify all environment variables are documented in .env.example files
- [ ] T180 Create production build of frontend (npm run build)
- [ ] T181 Test production build locally
- [ ] T182 Verify backend performance under load (basic stress test)
- [ ] T183 Document deployment steps in quickstart.md (if not already done)
- [ ] T184 Deploy frontend to Vercel with environment variables
- [ ] T185 Deploy backend to Koyeb with environment variables
- [ ] T186 Verify production deployment works end-to-end
- [ ] T187 Test production app with real users (create account, manage tasks)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5 → P6)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Requires US1 for authentication but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Builds on US2 but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Enhances US2/US3 but independently testable
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - Cross-cutting UI improvements, independently testable
- **User Story 6 (P6)**: Can start after Foundational (Phase 2) - Optional enhancement, independently testable

### Within Each User Story

- Models before services (if applicable)
- Services before endpoints
- Backend endpoints before frontend integration
- Core implementation before polish
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within each user story, tasks marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch backend and frontend tasks together:
Task: "Create TaskService in backend/src/services/task_service.py"
Task: "Create TaskList component in frontend/src/components/tasks/TaskList.tsx"
Task: "Create TaskItem component in frontend/src/components/tasks/TaskItem.tsx"
Task: "Create task routes in backend/src/api/routes/tasks.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Authentication)
4. Complete Phase 4: User Story 2 (CRUD Operations)
5. **STOP and VALIDATE**: Test US1 and US2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Auth MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Core MVP!)
4. Add User Story 3 → Test independently → Deploy/Demo (Organization features!)
5. Add User Story 4 → Test independently → Deploy/Demo (Search/Filter!)
6. Add User Story 5 → Test independently → Deploy/Demo (Responsive + Themes!)
7. Add User Story 6 → Test independently → Deploy/Demo (Voice input!)
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Authentication)
   - Developer B: User Story 2 (CRUD) - can start backend while A works on auth UI
   - Developer C: User Story 5 (Responsive UI) - can work on base components
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Tests are NOT included per constitution (spec doesn't request them)
- Framer Motion animations are integrated throughout for professional UI/UX
- Better Auth handles frontend authentication, backend verifies JWT
- Voice input (US6) is optional and can be skipped if not needed

---

## Task Summary

**Total Tasks**: 187
**Setup Phase**: 12 tasks
**Foundational Phase**: 17 tasks
**User Story 1 (Auth)**: 23 tasks
**User Story 2 (CRUD)**: 36 tasks
**User Story 3 (Organization)**: 17 tasks
**User Story 4 (Search/Filter)**: 15 tasks
**User Story 5 (Responsive UI)**: 23 tasks
**User Story 6 (Voice Input)**: 12 tasks
**Polish Phase**: 32 tasks

**Parallel Opportunities**: 47 tasks marked [P] can run in parallel
**Independent Stories**: All 6 user stories can be tested independently
**MVP Scope**: User Stories 1 + 2 (55 tasks after Setup + Foundational)
