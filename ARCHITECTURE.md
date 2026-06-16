# Project Structure & Architecture Documentation

## Directory Overview

### `/backend` - Node.js/Express API Server
- **src/server.js** - Main Express server with Apollo GraphQL
- **src/api/routes/** - REST API endpoints
  - auth.js - Authentication (login/register)
  - assessments.js - Assessment management
  - developers.js - Developer profiles & skills
  - teams.js - Team management
  - reports.js - Report generation
- **src/config/** - Configuration files
  - database.js - PostgreSQL connection
  - redis.js - Redis cache setup
- **src/middleware/** - Express middleware
  - auth.js - JWT authentication

### `/frontend` - React.js Web Application
- **src/pages/** - Route pages
  - Dashboard.js - Main dashboard
  - SkillVisualization.js - 3D skill visualization
  - AssessmentList.js - Available assessments
  - AssessmentTaking.js - Take assessment
  - ProfilePage.js - User profile
  - Compare.js - Compare developers
  - Reports.js - View reports
  - Login.js/Register.js - Authentication
- **src/components/** - Reusable components
  - Navigation.js - Main navigation
  - SkillRadar3D.js - 3D skill radar chart
- **src/store.js** - Redux state management

### `/database` - PostgreSQL Migrations
- **migrations/** - SQL migration files
  - 001_initial_schema.sql - Core database schema
  - 002_seed_data.sql - Sample data

### `/ml-service` - Python FastAPI ML Service
- **src/main.py** - FastAPI application
  - /predict-skills - Skill trajectory prediction
  - /recommend-roles - Role recommendations
  - /suggest-team-composition - Team matching
  - /analytics/skill-trends - Global trends

### `/assessment-engine` - Code Execution & Grading
- **src/server.js** - Assessment engine server
- **src/grader.js** - Code execution & grading
  - Supports: JavaScript, Python, Java
  - Timeout protection
  - Test case validation

## Key Features Implemented

### 1. Authentication & Authorization
- JWT-based token authentication
- Secure password hashing with bcrypt
- Session management with Redis

### 2. Assessment System
- Multiple question types
- Auto-grading for objective questions
- Code execution sandbox
- Immediate feedback

### 3. Skill Management
- Multi-dimensional skill tracking
- Proficiency levels (0-100)
- Experience tracking
- Skill categorization

### 4. Analytics & Visualization
- 3D skill radar using Three.js
- Proficiency bar charts using Recharts
- Trend analysis
- Historical tracking

### 5. ML Intelligence
- Skill trajectory prediction
- Role recommendations
- Team composition suggestions
- Global skill trends

### 6. Team Management
- Team creation and membership
- Skill distribution analytics
- Collaborative assessments

## Database Schema

### Core Tables
- `users` - User accounts
- `developer_profiles` - Extended profile info
- `developer_skills` - Skills with proficiency
- `assessments` - Assessment templates
- `assessment_questions` - Quiz questions
- `assessment_sessions` - User assessment attempts
- `teams` - Team records
- `team_members` - Team membership
- `skill_recommendations` - AI recommendations
- `reports` - Generated reports

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`

### Assessments
- `GET /api/assessments` - List assessments
- `POST /api/assessments/start` - Start assessment
- `POST /api/assessments/submit` - Submit answers
- `GET /api/assessments/:sessionId/results` - Get results

### Developers
- `GET /api/developers/:userId` - Get profile
- `GET /api/developers/:userId/skills` - Get skills
- `POST /api/developers/:userId/skills` - Update skills
- `GET /api/developers/:userId/recommendations` - Get recommendations
- `POST /api/developers/:userId/compare` - Compare developers

### Teams
- `GET /api/teams` - List teams
- `GET /api/teams/:teamId/analytics` - Team analytics

### Reports
- `POST /api/reports` - Generate report
- `GET /api/reports/:reportId` - Get report

### GraphQL
- `POST /graphql` - GraphQL queries and mutations

## Technology Stack

### Backend
- Node.js 18
- Express.js 4.18
- Apollo Server (GraphQL)
- PostgreSQL 14
- Redis 7
- JWT Authentication

### Frontend
- React 18
- Redux state management
- React Router
- D3.js (charts)
- Three.js (3D visualization)
- TailwindCSS (styling)
- Recharts (data visualization)

### ML & Analytics
- Python 3.9+
- FastAPI
- NumPy, Pandas, SciPy
- Scikit-learn
- SQLAlchemy ORM

### DevOps
- Docker & Docker Compose
- nginx (reverse proxy)
- PostgreSQL containers
- Redis containers

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
DATABASE_URL=postgresql://devlens:password@postgres:5432/devlens_db
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
```

### ML Service (.env)
```
DATABASE_URL=postgresql://devlens:password@postgres:5432/devlens_db
PORT=8000
```

## Deployment

### Local Development
```bash
docker-compose up -d
```

### Production
1. Set secure environment variables
2. Use Docker Compose or Kubernetes
3. Configure SSL/TLS
4. Set up monitoring and logging
5. Configure CI/CD pipeline

## Future Enhancements

- [ ] Video assessment recordings
- [ ] Live coding interviews
- [ ] GitHub portfolio integration
- [ ] Advanced ML models (career prediction)
- [ ] Mobile app
- [ ] Slack/Teams integration
- [ ] Real-time collaboration features
- [ ] Advanced analytics dashboard
- [ ] Certification programs
- [ ] Mentorship matching
