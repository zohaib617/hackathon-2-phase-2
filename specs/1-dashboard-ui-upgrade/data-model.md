# Data Model: Dashboard UI Upgrade

## Task Entity
- **id**: string (unique identifier)
- **owner_id**: string (references authenticated user)
- **title**: string (required task title)
- **description**: string | null (optional task description)
- **priority**: "low" | "medium" | "high" (task priority level)
- **due_date**: string | null (optional due date in ISO format)
- **completed**: boolean (completion status)
- **created_at**: string (timestamp when task was created)
- **updated_at**: string (timestamp when task was last updated)

## User Entity
- **id**: string (unique identifier)
- **name**: string (user's display name)
- **email**: string (user's email address)
- **avatar**: string | null (optional avatar URL)

## Validation Rules
- Task title must be 1-255 characters
- Task description must be 0-1000 characters if provided
- Priority must be one of: "low", "medium", "high"
- Due date must be in ISO 8601 format if provided
- Completed status must be boolean

## State Transitions
- Task creation: completed = false by default
- Task completion: completed = true when toggled
- Task reactivation: completed = false when toggled back
- Task deletion: permanent removal from user's task list