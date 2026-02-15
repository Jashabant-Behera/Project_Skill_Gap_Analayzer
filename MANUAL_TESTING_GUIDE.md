# Manual Testing Guide: SkillSync

This guide provides a comprehensive list of all API endpoints and manual UI testing scenarios for **SkillSync** (formerly Skill Gap Analyzer).

## Base URL
All requests should be prefixed with:
- **Local**: `http://localhost:8000/api/v1`
- **Deployed**: `https://project-skill-gap-analayzer.onrender.com/api/v1`

---

## 1. Authentication Flow

### 1.1 Register a New User
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

### 1.2 Login
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

## 2. UI / Experience Testing Scenarios (New Features)

### 2.1 Background Animations
*   **Scenario:** Verify floating geometric shapes on Landing Page.
*   **Step:** Open `http://localhost:3000/` or `https://project-skill-gap-analayzer.vercel.app/`.
*   **Expected:** You should see subtle, floating shapes (circles, squares, triangles) in the background with a parallax effect.

### 2.2 Question Card Auto-Save
*   **Scenario:** Verify that typed answers are saved locally.
*   **Step 1:** Start an assessment.
*   **Step 2:** Type an answer into the text area.
*   **Step 3:** Refresh the page.
*   **Expected:** A toast notification "Draft restored" should appear, and your typed text should remain in the input field.

### 2.3 Confidence Slider
*   **Scenario:** Adjust confidence level for a question.
*   **Step:** In the Question Card, locate the "How confident are you?" slider.
*   **Action:** Click on level 4 or 5.
*   **Expected:** The slider bar should fill up with the corresponding color (Cyan for high confidence) and the number should update.

### 2.4 Keyboard Shortcuts
*   **Scenario:** Submit answer using keyboard.
*   **Step:** Type an answer in the Question Card.
*   **Action:** Press `Ctrl + Enter` (or `Cmd + Enter` on Mac).
*   **Expected:** The answer should submit, and the UI should transition to the next question or loading state.

---

## 3. Master Data Endpoints
*No authentication required for these.*

### 3.1 List Roles
**Endpoint:** `GET /roles`

### 3.2 Get Role Details
**Endpoint:** `GET /roles/{role_id}`
*Example ID: `backend_developer`*

### 3.3 List Skills
**Endpoint:** `GET /skills`

---

## 4. User Profile Endpoints
*Requires Authentication.*

### 4.1 Get Current User Profile
**Endpoint:** `GET /auth/me`

### 4.2 Update Profile
**Endpoint:** `PUT /users/profile`

**Body:**
```json
{
  "current_role": "Backend Developer",
  "experience_years": 3
}
```

### 4.3 Add Skill to Profile
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

### 4.4 Check Profile Completion
**Endpoint:** `GET /users/profile/complete`

---

## 5. Assessment Flow
*Requires Authentication.*

### 5.1 List Assessments
**Endpoint:** `GET /assessments/list`

### 5.2 Create Assessment
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

### 5.3 Get Next Question
**Endpoint:** `GET /assessments/{assessment_id}/question`

### 5.4 Submit Answer
**Endpoint:** `POST /assessments/{assessment_id}/submit`

**Body:**
```json
{
  "question_id": "question-uuid...",
  "user_answer": "The answer depends on...",
  "confidence_score": 4,
  "time_taken_seconds": 45
}
```

### 5.5 Get Progress
**Endpoint:** `GET /assessments/progress/{assessment_id}`

### 5.6 Complete Assessment
**Endpoint:** `POST /assessments/{assessment_id}/complete`

### 5.7 Get Results
**Endpoint:** `GET /assessments/{assessment_id}/results`

---

## 6. Analytics Endpoints
*Requires Authentication.*

### 6.1 Assessment Dashboard
**Endpoint:** `GET /analytics/dashboard/{assessment_id}`

### 6.2 Skill Comparison
**Endpoint:** `GET /analytics/skill-comparison/{assessment_id}`

### 6.3 Progress Timeline
**Endpoint:** `GET /analytics/progress-timeline`

### 6.4 Export Results
**Endpoint:** `GET /analytics/export/{assessment_id}?format=csv`

---

## 7. Learning Roadmap Endpoints
*Requires Authentication.*

### 7.1 Generate Roadmap
**Endpoint:** `POST /roadmaps`

**Body:**
```json
{
  "assessment_id": "assessment-uuid...",
  "hours_per_week": 10
}
```

### 7.2 Get Roadmap
**Endpoint:** `GET /roadmaps/{roadmap_id}`

### 7.3 Get Roadmap Week Details
**Endpoint:** `GET /roadmaps/{roadmap_id}/week/1`

---

## Testing Tips
- **Toast Notifications:** Watch for the new glassmorphic toast notifications (Green for success, Red for errors) in the top-right corner.
- **Responsiveness:** Test UI features on both Desktop (1920x1080) and Mobile (375x667) viewports.
- **Keyboard Navigation:** Ensure you can navigate the assessment flow using Tab and Enter keys.
- **API Testing:** Use Postman or Insomnia to easily manage the `Authorization` header.
- **Backend:** Ensure the backend is running on `localhost:8000`.
