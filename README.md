# 🎯 DevLens - Developer Talent Analyzer

A comprehensive full-stack platform that analyzes developer talent, visualizes skills across multiple dimensions, conducts real-time assessments, and provides intelligent career recommendations.

## 📋 Features

### Core Assessment System
- **Multi-dimensional Skill Analysis**: Backend, Frontend, DevOps, Cloud, ML/AI, Mobile, Security, Leadership
- **Real-time Coding Challenges**: Auto-graded programming tasks
- **Knowledge Quizzes**: Multi-choice assessments with instant feedback
- **Experience Tracking**: Years of experience, projects, certifications

### Advanced Visualization
- **3D Radar Charts**: Interactive skill profile visualization
- **Skill Matrix Heatmaps**: Compare skills across dimensions
- **Growth Timelines**: Track progress over time
- **Peer Benchmarking**: Anonymized comparison with similar developers

### Intelligence Engine
- **Talent Predictions**: ML-based skill trajectory forecasting
- **Role Recommendations**: AI-driven career path suggestions
- **Skill Gap Analysis**: Identify missing competencies
- **Team Matching**: Find ideal team compositions

### Analytics & Reporting
- **Personal Dashboard**: Individual talent profile
- **Team Analytics**: Aggregate skill distribution
- **Export Reports**: PDF, JSON, CSV formats
- **Historical Analytics**: Track improvement metrics

## 🏗️ Architecture

```
DevLens/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── api/            # REST & GraphQL endpoints
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database schemas
│   │   ├── middleware/     # Auth, validation
│   │   └── assessments/    # Grading engine
│   └── tests/
├── frontend/               # React web application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── visualizations/ # D3.js, Three.js charts
│   │   └── store/          # Redux state
│   └── public/
├── assessment-engine/      # Coding challenge evaluator
│   ├── graders/            # Language-specific graders
│   ├── tests/              # Test suites
│   └── sandboxes/          # Isolated execution
├── ml-service/             # Python ML recommendations
│   ├── models/             # Trained models
│   ├── pipelines/          # Data processing
│   └── api/                # FastAPI endpoints
├── database/               # PostgreSQL schemas
│   └── migrations/
└── docker-compose.yml      # Full stack orchestration
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+

### Setup

```bash
# Clone the repository
git clone https://github.com/shimmicute29-ops/DevLens.git
cd DevLens

# Start all services
docker-compose up -d

# Initialize database
docker exec devlens-backend npm run db:migrate

# Access applications
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- GraphQL Playground: http://localhost:5000/graphql
- ML API: http://localhost:8000
```

## 📊 Assessment Framework

### Skill Categories
1. **Backend Development** (Node, Python, Java, Go, Rust)
2. **Frontend Development** (React, Vue, Angular, Web APIs)
3. **DevOps & Infrastructure** (Docker, Kubernetes, CI/CD)
4. **Cloud Platforms** (AWS, GCP, Azure)
5. **Mobile Development** (iOS, Android, React Native)
6. **ML & Data Science** (TensorFlow, PyTorch, Data Analysis)
7. **Security & Compliance** (OWASP, Encryption, Best Practices)
8. **Leadership & Soft Skills** (Mentoring, Communication, Project Mgmt)

### Assessment Types
- **Code Challenges**: 30-min timed problems (Easy/Medium/Hard)
- **Knowledge Quizzes**: 15-20 multiple choice questions
- **Experience Survey**: Self-reported expertise levels
- **Project Portfolio**: GitHub integration and analysis
- **Peer Reviews**: 360-degree feedback mechanism

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new developer
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh token

### Assessments
- `GET /api/assessments` - List available assessments
- `POST /api/assessments/start` - Begin assessment
- `POST /api/assessments/{id}/submit` - Submit answers
- `GET /api/assessments/{id}/results` - Get results

### Talent Profiles
- `GET /api/developers/{id}` - Get developer profile
- `GET /api/developers/{id}/skills` - Get skill breakdown
- `GET /api/developers/{id}/recommendations` - Get recommendations
- `POST /api/developers/{id}/compare` - Compare with others

### Teams
- `GET /api/teams` - List teams
- `GET /api/teams/{id}/analytics` - Team skill distribution
- `POST /api/teams/suggest` - Get team composition suggestions

### Reports
- `GET /api/reports/{id}` - Generate report
- `POST /api/reports/{id}/export` - Export as PDF/JSON

## 🧠 ML Models

### Skill Prediction Model
Predicts skill trajectory based on historical assessments, projects, and learning patterns.

### Role Recommendation Engine
Matches developer profiles to ideal roles using collaborative filtering and skill alignment.

### Peer Comparison
Anonymized benchmarking against developers with similar experience levels.

## 📈 Performance Metrics

- **Skill Coverage**: % of dimensions assessed
- **Assessment Completion**: Progress tracking
- **Growth Rate**: Month-over-month improvement
- **Engagement Score**: Participation and activity metrics

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Data encryption at rest and in transit
- GDPR/CCPA compliant data handling
- Regular security audits

## 📝 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please see CONTRIBUTING.md

## 📞 Support

- Documentation: [Wiki](https://github.com/shimmicute29-ops/DevLens/wiki)
- Issues: [GitHub Issues](https://github.com/shimmicute29-ops/DevLens/issues)
- Discussions: [GitHub Discussions](https://github.com/shimmicute29-ops/DevLens/discussions)
