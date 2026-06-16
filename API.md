# DevLens API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}

Response 200:
{
  "token": "eyJhbGc...",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response 200:
{
  "token": "eyJhbGc...",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe"
}
```

## Assessment Endpoints

### Get All Assessments
```http
GET /assessments
Authorization: Bearer <token>

Query Parameters:
- category: Backend, Frontend, DevOps, Cloud, ML
- difficulty: Easy, Medium, Hard

Response 200:
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Backend Fundamentals",
    "description": "Test your backend development knowledge",
    "category": "Backend",
    "difficulty": "Easy",
    "duration_minutes": 30,
    "is_active": true
  }
]
```

### Start Assessment
```http
POST /assessments/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "assessmentId": "550e8400-e29b-41d4-a716-446655440000"
}

Response 200:
{
  "sessionId": "650e8400-e29b-41d4-a716-446655440010",
  "questions": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440000",
      "question": "What is a RESTful API?",
      "options": ["A style of API using HTTP methods", ...],
      "category": "Backend"
    }
  ]
}
```

### Submit Assessment
```http
POST /assessments/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "sessionId": "650e8400-e29b-41d4-a716-446655440010",
  "answers": [
    {
      "questionId": "650e8400-e29b-41d4-a716-446655440000",
      "selected": "A style of API using HTTP methods"
    }
  ]
}

Response 200:
{
  "score": 85,
  "totalPoints": 100,
  "percentage": 85.0,
  "feedback": {
    "650e8400-e29b-41d4-a716-446655440000": {
      "correct": true
    }
  }
}
```

### Get Assessment Results
```http
GET /assessments/{sessionId}/results
Authorization: Bearer <token>

Response 200:
{
  "id": "650e8400-e29b-41d4-a716-446655440010",
  "score": 85,
  "percentage": 85.0,
  "completed_at": "2026-06-16T13:30:00Z",
  "feedback": {...}
}
```

## Developer Endpoints

### Get Developer Profile
```http
GET /developers/{userId}
Authorization: Bearer <token>

Response 200:
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "name": "John Doe",
  "current_role": "Backend Engineer",
  "company": "Tech Corp",
  "location": "San Francisco"
}
```

### Get Developer Skills
```http
GET /developers/{userId}/skills
Authorization: Bearer <token>

Response 200:
[
  {
    "id": 1,
    "skill_name": "Node.js",
    "skill_category": "Backend",
    "proficiency": 85,
    "years_of_experience": 5.0
  }
]
```

### Update Developer Skills
```http
POST /developers/{userId}/skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "skills": [
    {
      "name": "Node.js",
      "category": "Backend",
      "proficiency": 85,
      "yearsOfExperience": 5.0
    }
  ]
}

Response 200:
{
  "success": true
}
```

### Get Recommendations
```http
GET /developers/{userId}/recommendations
Authorization: Bearer <token>

Response 200:
[
  {
    "id": 1,
    "skill_name": "GraphQL",
    "skill_category": "Backend",
    "confidence": 0.85,
    "reason": "Based on your Node.js expertise"
  }
]
```

### Compare Developers
```http
POST /developers/{userId}/compare
Authorization: Bearer <token>
Content-Type: application/json

{
  "compareWithUserIds": [
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002"
  ]
}

Response 200:
[
  {
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "skills1": [...],
    "skills2": [...]
  }
]
```

## Team Endpoints

### Get Teams
```http
GET /teams
Authorization: Bearer <token>

Response 200:
[
  {
    "id": "750e8400-e29b-41d4-a716-446655440000",
    "name": "Backend Team",
    "description": "Main backend development team"
  }
]
```

### Get Team Analytics
```http
GET /teams/{teamId}/analytics
Authorization: Bearer <token>

Response 200:
{
  "teamSize": 5,
  "skillDistribution": [
    {
      "skill_category": "Backend",
      "avg_proficiency": 82.5,
      "count": 5
    }
  ]
}
```

## Reports Endpoints

### Generate Report
```http
POST /reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "reportType": "comprehensive"
}

Response 200:
{
  "reportId": "850e8400-e29b-41d4-a716-446655440000",
  "status": "generated"
}
```

### Get Report
```http
GET /reports/{reportId}
Authorization: Bearer <token>

Response 200:
{
  "id": "850e8400-e29b-41d4-a716-446655440000",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "report_type": "comprehensive",
  "data": {...},
  "created_at": "2026-06-16T13:30:00Z"
}
```

## GraphQL Endpoint

```http
POST /graphql
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "{
    developer(id: \"550e8400-e29b-41d4-a716-446655440000\") {
      id
      name
      email
      skills {
        name
        proficiency
      }
    }
  }"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input",
  "details": [...]
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Server error",
  "details": "..."
}
```

## Rate Limiting

- Assessments: 5 per minute
- General API: 60 per minute
- Reports: 10 per hour

## Pagination

Use `limit` and `offset` query parameters:

```
GET /developers?limit=10&offset=20
```

## Examples

### cURL Example: Register and Login

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

### JavaScript/Node.js Example

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get developer profile
const profile = await api.get(`/developers/${userId}`);
console.log(profile.data);

// Update skills
const skills = await api.post(`/developers/${userId}/skills`, {
  skills: [
    {
      name: 'Node.js',
      category: 'Backend',
      proficiency: 85,
      yearsOfExperience: 5
    }
  ]
});
```

## Webhooks (Planned)

Future versions will support webhooks for:
- Assessment completion
- Skill updates
- Recommendation generation

## Changelog

### v1.0.0 (Current)
- Core API endpoints
- Authentication system
- Assessment system
- Skill management
- ML recommendations
- Team management
- Report generation
