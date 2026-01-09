# Data Model: Multi-User Todo Application

**Feature**: 001-multi-user-todo
**Date**: 2026-01-07
**Purpose**: Define database schema and entity relationships

## Overview

This document defines the data model for the Multi-User Todo Application. The system has two primary entities: Users (managed by Better Auth) and Tasks (our core domain entity).

## Entity Definitions

### User Entity

**Purpose**: Represents a registered user of the system

**Managed By**: Better Auth (frontend authentication library)

**Schema**:
```
User {
  id: UUID (primary key)
  email: String (unique, indexed)
  password_hash: String
  created_at: Timestamp
  updated_at: Timestamp
}
```

**Field Specifications**:
- `id`: Universally unique identifier, generated on creation
- `email`: User's email address, must be unique across system, used for login
- `password_hash`: Bcrypt-hashed password, never stored in plain text
- `created_at`: Timestamp of account creation, auto-generated
- `updated_at`: Timestamp of last account update, auto-updated

**Validation Rules**:
- Email must be valid format (RFC 5322)
- Email must be unique (enforced by database constraint)
- Password must be minimum 8 characters (enforced at application layer)
- Password must be hashed with bcrypt before storage

**Notes**:
- User entity is managed by Better Auth on the frontend
- Backend only receives user_id from JWT token
- Backend does not directly manage user records
- User authentication and registration handled by Better Auth

---

### Task Entity

**Purpose**: Represents a single todo item owned by a user

**Managed By**: Backend (FastAPI + SQLModel)

**Schema**:
```
Task {
  id: UUID (primary key)
  owner_id: UUID (foreign key → User.id, indexed, not null)
  title: String (not null, max 200 chars)
  description: String (nullable, max 2000 chars)
  priority: Enum('low', 'medium', 'high') (nullable)
  due_date: Date (nullable)
  completed: Boolean (not null, default false)
  created_at: Timestamp (not null, auto-generated)
  updated_at: Timestamp (not null, auto-updated)
}
```

**Field Specifications**:

- `id`: UUID primary key, generated on creation
  - Format: UUID v4
  - Example: `550e8400-e29b-41d4-a716-446655440000`

- `owner_id`: Foreign key to User.id
  - **Critical for user isolation**
  - Indexed for query performance
  - Cannot be null
  - Set automatically from JWT user_id on creation
  - Never modifiable after creation

- `title`: Task title/summary
  - Required field (cannot be null or empty)
  - Maximum length: 200 characters
  - Validation: Must contain at least 1 non-whitespace character
  - Example: "Buy groceries"

- `description`: Detailed task description
  - Optional field (can be null or empty)
  - Maximum length: 2000 characters
  - Example: "Milk, eggs, bread, and vegetables for the week"

- `priority`: Task priority level
  - Optional field (can be null)
  - Enum values: 'low', 'medium', 'high'
  - Default: null (no priority assigned)
  - Used for filtering and sorting

- `due_date`: Task deadline
  - Optional field (can be null)
  - Format: ISO 8601 date (YYYY-MM-DD)
  - Example: "2026-01-15"
  - No time component (date only)
  - Can be in the past (system allows but may highlight)

- `completed`: Task completion status
  - Required field (cannot be null)
  - Boolean: true (completed) or false (incomplete)
  - Default: false
  - Toggled via PATCH endpoint

- `created_at`: Creation timestamp
  - Required field (cannot be null)
  - Auto-generated on insert
  - Format: ISO 8601 timestamp with timezone
  - Example: "2026-01-07T14:30:00Z"
  - Never modified after creation

- `updated_at`: Last modification timestamp
  - Required field (cannot be null)
  - Auto-generated on insert
  - Auto-updated on every update
  - Format: ISO 8601 timestamp with timezone
  - Example: "2026-01-07T15:45:00Z"

**Validation Rules**:
- Title must not be empty (after trimming whitespace)
- Title length ≤ 200 characters
- Description length ≤ 2000 characters (if provided)
- Priority must be one of: 'low', 'medium', 'high', or null
- Due date must be valid ISO 8601 date (if provided)
- Owner_id must reference existing User.id
- Completed must be boolean

**Business Rules**:
- Tasks can only be created by authenticated users
- Tasks are automatically associated with creator (owner_id from JWT)
- Users can only access their own tasks (owner_id filtering)
- Tasks cannot be transferred between users
- Deleting a task is permanent (no soft delete)
- Completing a task does not prevent further edits

---

## Relationships

### User → Task (One-to-Many)

**Relationship**: One user owns zero or more tasks

**Cardinality**: 1:N

**Implementation**:
- Foreign key: `Task.owner_id` → `User.id`
- Cascade behavior: Not applicable (users managed by Better Auth)
- Orphan handling: Tasks remain if user deleted (edge case, not in MVP scope)

**Query Pattern**:
```sql
SELECT * FROM tasks WHERE owner_id = :user_id
```

**Constraints**:
- A user can have unlimited tasks (no hard limit in MVP)
- A user can have zero tasks (valid state)
- All tasks must have an owner (owner_id is required)

---

## Indexes

### Primary Indexes

1. **tasks.id** (Primary Key)
   - Type: B-tree
   - Purpose: Unique identification and fast lookups by ID
   - Automatically created by database

2. **users.id** (Primary Key)
   - Type: B-tree
   - Purpose: Unique identification
   - Managed by Better Auth

### Secondary Indexes

3. **tasks.owner_id** (Foreign Key Index)
   - Type: B-tree
   - Purpose: **Critical for user isolation queries**
   - Rationale: Every task query filters by owner_id
   - Expected usage: Very high (every task operation)
   - Performance impact: Essential for <500ms response time

4. **tasks.completed** (Filter Index)
   - Type: B-tree
   - Purpose: Optimize filtering by completion status
   - Rationale: Common filter operation (show completed/incomplete)
   - Expected usage: High
   - Performance impact: Improves filter query speed

5. **tasks.priority** (Filter Index)
   - Type: B-tree
   - Purpose: Optimize filtering by priority level
   - Rationale: Common filter operation (show high priority tasks)
   - Expected usage: Medium
   - Performance impact: Improves filter query speed

### Composite Indexes (Future Optimization)

Not implemented in MVP, but consider for future:
- `(owner_id, completed)` - Optimize "show my completed tasks"
- `(owner_id, priority)` - Optimize "show my high priority tasks"
- `(owner_id, due_date)` - Optimize "show my upcoming tasks"

---

## Database Constraints

### Primary Key Constraints
- `tasks.id` PRIMARY KEY
- `users.id` PRIMARY KEY

### Foreign Key Constraints
- `tasks.owner_id` REFERENCES `users.id`
  - Note: Enforcement depends on Better Auth user management

### Unique Constraints
- `users.email` UNIQUE

### Not Null Constraints
- `tasks.id` NOT NULL
- `tasks.owner_id` NOT NULL
- `tasks.title` NOT NULL
- `tasks.completed` NOT NULL
- `tasks.created_at` NOT NULL
- `tasks.updated_at` NOT NULL

### Check Constraints
- `tasks.title` length > 0 (after trim)
- `tasks.title` length ≤ 200
- `tasks.description` length ≤ 2000 (if not null)
- `tasks.priority` IN ('low', 'medium', 'high') OR NULL

---

## SQLModel Implementation

### Task Model (backend/src/models/task.py)

```python
from datetime import datetime, date
from typing import Optional
from uuid import UUID, uuid4
from enum import Enum
from sqlmodel import Field, SQLModel

class PriorityEnum(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    owner_id: UUID = Field(foreign_key="users.id", index=True, nullable=False)
    title: str = Field(max_length=200, nullable=False)
    description: Optional[str] = Field(default=None, max_length=2000)
    priority: Optional[PriorityEnum] = Field(default=None)
    due_date: Optional[date] = Field(default=None)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"onupdate": datetime.utcnow}
    )
```

### Pydantic Schemas (backend/src/schemas/task.py)

```python
from datetime import date
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field, validator

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    due_date: Optional[date] = None

    @validator('title')
    def title_not_empty(cls, v):
        if not v.strip():
            raise ValueError('Title cannot be empty')
        return v.strip()

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=2000)
    priority: Optional[str] = Field(None, pattern="^(low|medium|high)$")
    due_date: Optional[date] = None

class TaskResponse(BaseModel):
    id: UUID
    owner_id: UUID
    title: str
    description: Optional[str]
    priority: Optional[str]
    due_date: Optional[date]
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

---

## Migration Strategy

### Initial Migration (Alembic)

```sql
-- Create tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL CHECK (length(trim(title)) > 0),
    description VARCHAR(2000),
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_tasks_owner_id ON tasks(owner_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Query Patterns

### Common Queries

1. **List user's tasks**
```sql
SELECT * FROM tasks
WHERE owner_id = :user_id
ORDER BY created_at DESC;
```

2. **List user's tasks with filters**
```sql
SELECT * FROM tasks
WHERE owner_id = :user_id
  AND completed = :completed
  AND priority = :priority
  AND (title ILIKE :search OR description ILIKE :search)
ORDER BY created_at DESC;
```

3. **Get specific task (with ownership check)**
```sql
SELECT * FROM tasks
WHERE id = :task_id AND owner_id = :user_id;
```

4. **Create task**
```sql
INSERT INTO tasks (owner_id, title, description, priority, due_date)
VALUES (:owner_id, :title, :description, :priority, :due_date)
RETURNING *;
```

5. **Update task (with ownership check)**
```sql
UPDATE tasks
SET title = :title,
    description = :description,
    priority = :priority,
    due_date = :due_date
WHERE id = :task_id AND owner_id = :user_id
RETURNING *;
```

6. **Toggle completion (with ownership check)**
```sql
UPDATE tasks
SET completed = NOT completed
WHERE id = :task_id AND owner_id = :user_id
RETURNING *;
```

7. **Delete task (with ownership check)**
```sql
DELETE FROM tasks
WHERE id = :task_id AND owner_id = :user_id;
```

---

## Data Integrity

### User Isolation Enforcement

**Critical Requirement**: Every query MUST filter by owner_id

**Implementation**:
- All service methods accept user_id parameter (from JWT)
- All database queries include `WHERE owner_id = :user_id`
- Backend verifies URL user_id matches JWT user_id
- No query should ever return tasks from other users

**Verification**:
- Code review: Check all queries include owner_id filter
- Integration tests: Verify cross-user access is blocked
- Security audit: Attempt to access other users' tasks

### Data Validation

**Application Layer** (FastAPI + Pydantic):
- Title length and non-empty validation
- Description length validation
- Priority enum validation
- Due date format validation

**Database Layer** (PostgreSQL constraints):
- NOT NULL constraints
- CHECK constraints on lengths
- CHECK constraints on enum values
- Foreign key constraints

---

## Performance Considerations

### Expected Load
- 1000+ concurrent users
- Up to 1000 tasks per user
- <500ms API response time requirement

### Optimization Strategies
1. **Indexes**: owner_id, completed, priority indexes
2. **Connection Pooling**: Reuse database connections
3. **Async Queries**: Non-blocking I/O operations
4. **Query Optimization**: Select only needed columns
5. **Pagination**: Consider for users with >100 tasks (future)

### Monitoring
- Track query execution times
- Monitor index usage
- Watch for slow queries
- Alert on connection pool exhaustion

---

## Future Enhancements (Out of Scope for MVP)

- Task categories/tags
- Task attachments
- Task sharing between users
- Task history/audit log
- Soft delete with trash/archive
- Task templates
- Subtasks/task hierarchies
- Task comments
- Task reminders/notifications
