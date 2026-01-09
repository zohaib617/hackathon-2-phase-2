# API Contracts: Dashboard UI Upgrade

## Task Management Endpoints

### GET /api/v1/tasks
**Purpose**: Retrieve all tasks for the authenticated user
- **Method**: GET
- **Authentication**: JWT token required in Authorization header
- **Parameters**:
  - page (optional, integer): Page number for pagination
  - page_size (optional, integer): Number of tasks per page
  - completed (optional, boolean): Filter by completion status
  - priority (optional, string): Filter by priority level (low, medium, high)
  - search (optional, string): Search by title or description
  - sort_by (optional, string): Sort by field (created_at, updated_at, due_date, priority)
  - sort_order (optional, string): Sort order (asc, desc)
- **Response**: TaskListResponse with array of Task objects
- **Success Code**: 200 OK

### POST /api/v1/tasks
**Purpose**: Create a new task for the authenticated user
- **Method**: POST
- **Authentication**: JWT token required in Authorization header
- **Body**: CreateTaskPayload with title (required), description, priority, due_date, completed
- **Response**: Created Task object
- **Success Code**: 201 Created

### GET /api/v1/tasks/{id}
**Purpose**: Retrieve a specific task by ID
- **Method**: GET
- **Authentication**: JWT token required in Authorization header
- **Path Parameter**: id (string) - Task ID
- **Response**: Task object
- **Success Code**: 200 OK

### PUT /api/v1/tasks/{id}
**Purpose**: Update an existing task completely
- **Method**: PUT
- **Authentication**: JWT token required in Authorization header
- **Path Parameter**: id (string) - Task ID
- **Body**: UpdateTaskPayload with optional fields
- **Response**: Updated Task object
- **Success Code**: 200 OK

### PATCH /api/v1/tasks/{id}
**Purpose**: Partially update a task (including completion toggle)
- **Method**: PATCH
- **Authentication**: JWT token required in Authorization header
- **Path Parameter**: id (string) - Task ID
- **Body**: UpdateTaskPayload with optional fields
- **Response**: Updated Task object
- **Success Code**: 200 OK

### DELETE /api/v1/tasks/{id}
**Purpose**: Delete a task
- **Method**: DELETE
- **Authentication**: JWT token required in Authorization header
- **Path Parameter**: id (string) - Task ID
- **Response**: Empty
- **Success Code**: 204 No Content

## Data Structures

### Task Object
```
{
  "id": "string",
  "owner_id": "string",
  "title": "string",
  "description": "string | null",
  "priority": "low | medium | high",
  "due_date": "string | null",
  "completed": "boolean",
  "created_at": "string (ISO timestamp)",
  "updated_at": "string (ISO timestamp)"
}
```

### TaskListResponse
```
{
  "tasks": "Task[]",
  "total": "integer",
  "page": "integer",
  "page_size": "integer",
  "total_pages": "integer"
}
```

### CreateTaskPayload
```
{
  "title": "string (required)",
  "description": "string (optional)",
  "priority": "low | medium | high (optional)",
  "due_date": "string (optional)",
  "completed": "boolean (optional)"
}
```

### UpdateTaskPayload
```
{
  "title": "string (optional)",
  "description": "string (optional)",
  "priority": "low | medium | high (optional)",
  "due_date": "string (optional)",
  "completed": "boolean (optional)"
}
```

## Authentication Contract
- All endpoints require JWT token in Authorization header: `Authorization: Bearer {token}`
- Token is extracted from Better Auth session cookie: `better-auth.session_token`
- Unauthorized requests return 401 Unauthorized
- Requests for non-owned resources return 403 Forbidden