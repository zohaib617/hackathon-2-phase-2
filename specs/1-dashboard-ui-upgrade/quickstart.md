# Quickstart Guide: Dashboard UI Upgrade

## Prerequisites
- Node.js 18+ installed
- Access to the backend API (FastAPI server)
- Environment variables configured (NEXT_PUBLIC_API_URL)

## Setup Instructions

### 1. Clone and Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```

Update the `NEXT_PUBLIC_API_URL` to point to your backend API:
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1  # Or your deployed backend URL
```

### 3. Start the Development Server
```bash
npm run dev
```

## Development Workflow

### Running the Dashboard
The dashboard is accessible at:
- Local: `http://localhost:3000/dashboard`
- The page is located at `frontend/src/app/dashboard/page.tsx`

### API Integration
All API calls use the configured `apiClient` from `@/lib/api`:
- Automatically attaches JWT token from Better Auth session
- Handles error responses and redirects
- Uses environment-configured base URL

### Key Components Used
- `taskService` from `@/services/taskService.ts` for all task operations
- `AuthProvider` from `@/context/AuthProvider` for authentication state
- `Framer Motion` components for animations
- UI components from `@/components/ui/`

## Testing API Connectivity

### Verify API Connection
1. Ensure your backend API is running
2. Check that `NEXT_PUBLIC_API_URL` points to the correct endpoint
3. Log in to the application
4. Navigate to the dashboard page

### Expected Behavior
- Dashboard should fetch user's tasks from the API
- Task operations (add, update, delete, complete) should update the backend
- Real-time updates should reflect backend state

## Troubleshooting

### Common Issues
1. **API Connection Errors**: Verify `NEXT_PUBLIC_API_URL` is correct
2. **Authentication Issues**: Ensure Better Auth is properly configured
3. **CORS Issues**: Backend must allow requests from frontend origin

### Debugging API Calls
Check browser network tab for:
- Successful API requests with 200 status
- Proper Authorization header with JWT token
- Correct request/response data structure

## Voice Command Setup
Voice recognition uses the Web Speech API, which is available in Chrome and Edge browsers. For other browsers, a fallback UI will be displayed.