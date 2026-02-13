# Manual API Testing Guide

This guide provides a comprehensive list of all API endpoints for the Skill Assessment Platform and instructions on how to test them manually using tools like `curl` or Postman.

## Base URL
All requests should be prefixed with:
`http://localhost:8000/api/v1`

## Authentication Flow

### 1. Register a New User
**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "email": "testuser@example.com",
  "password": "StrongPassword123!",
  "full_name": "Test User",
  "current_role": "Junior Developer",
  "experience_years": 2
}
```

### 2. Login
**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "testuser@example.com",
  "password": "StrongPassword123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG...",
  "user": { ... }
}
```
*Note: Copy the `accessToken` for subsequent requests. Usage: `Authorization: Bearer <token>`.*

---

## Master Data Endpoints
*No authentication required for these.*

### 3. List Roles
**Endpoint:** `GET /roles`

### 4. Get Role Details
**Endpoint:** `GET /roles/{role_id}`
*Example ID: `backend_developer`*

### 5. List Skills
**Endpoint:** `GET /skills`

---

## User Profile Endpoints
*Requires Authentication.*

### 6. Get Current User Profile
**Endpoint:** `GET /auth/me`

### 7. Update Profile
**Endpoint:** `PUT /users/profile`

**Body:**
```json
{
  "current_role": "Backend Developer",
  "experience_years": 3
}
```

### 8. Add Skill to Profile
**Endpoint:** `POST /users/skills`

**Body:**
```json
{
  "skill_id": "python",
  "skill_name": "Python",
  "proficiency_level": "intermediate",
  "years_of_experience": 2
}
```

### 9. Check Profile Completion
**Endpoint:** `GET /users/profile/complete`

---

## Assessment Flow
*Requires Authentication.*

### 10. List Assessments
**Endpoint:** `GET /assessments/list`

### 11. Create Assessment
**Endpoint:** `POST /assessments/create`

**Body:**
```json
{
  "target_role_id": "backend_developer",
  "focus_areas": ["python", "fastapi"],
  "additional_skills_to_learn": ["docker"]
}
```

**Response:**
```json
{
  "assessment_id": "uuid-string...",
  ...
}
```

### 12. Get Next Question
**Endpoint:** `GET /assessments/{assessment_id}/question`

### 13. Submit Answer
**Endpoint:** `POST /assessments/{assessment_id}/submit`

**Body:**
```json
{
  "question_id": "question-uuid...",
  "user_answer": "The answer depends on..."
}
```

### 14. Get Progress
**Endpoint:** `GET /assessments/progress/{assessment_id}`

### 15. Complete Assessment
**Endpoint:** `POST /assessments/{assessment_id}/complete`

### 16. Get Results
**Endpoint:** `GET /assessments/{assessment_id}/results`

---

## Analytics Endpoints
*Requires Authentication.*

### 17. Assessment Dashboard
**Endpoint:** `GET /analytics/dashboard/{assessment_id}`

### 18. Skill Comparison
**Endpoint:** `GET /analytics/skill-comparison/{assessment_id}`

### 19. Progress Timeline
**Endpoint:** `GET /analytics/progress-timeline`

### 20. Export Results
**Endpoint:** `GET /analytics/export/{assessment_id}?format=csv`

---

## Learning Roadmap Endpoints
*Requires Authentication.*

### 21. Generate Roadmap
**Endpoint:** `POST /roadmaps`

**Body:**
```json
{
  "assessment_id": "assessment-uuid...",
  "hours_per_week": 10
}
```

### 22. Get Roadmap
**Endpoint:** `GET /roadmaps/{roadmap_id}`

### 23. Get Roadmap Week Details
**Endpoint:** `GET /roadmaps/{roadmap_id}/week/1`

## Testing Tips
- Use Postman or Insomnia to easily manage the `Authorization` header.
- For `curl`, use the flag `-H "Authorization: Bearer <your_token>"`
- Ensure the backend is running on `localhost:8000`.
