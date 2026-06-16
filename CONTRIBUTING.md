# Contributing to DevLens

Thank you for your interest in contributing to DevLens! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Report issues responsibly
- Follow best practices and coding standards

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Docker & Docker Compose
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/shimmicute29-ops/DevLens.git
   cd DevLens
   ```

2. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   
   # ML Service
   cd ../ml-service && pip install -r requirements.txt
   ```

4. **Initialize database**
   ```bash
   docker exec devlens-backend npm run db:migrate
   docker exec devlens-backend npm run db:seed
   ```

5. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend && npm run dev
   
   # Frontend (Terminal 2)
   cd frontend && npm start
   
   # ML Service (Terminal 3)
   cd ml-service && python -m uvicorn main:app --reload
   ```

## Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Commit Messages

Follow conventional commit format:

```
type(scope): subject

body (optional)
footer (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(assessments): add code execution sandbox

Implement secure code execution environment for programming challenges.
Supports JavaScript, Python, and Java.

Closes #123
```

### Code Style

- **Backend**: Use ESLint + Prettier
  ```bash
  npm run lint
  npm run format
  ```

- **Frontend**: Follow React best practices
  - Use functional components and hooks
  - Props validation with PropTypes
  - Consistent naming conventions

- **Python**: Follow PEP 8
  ```bash
  pip install flake8
  flake8 src/
  ```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### ML Service Tests
```bash
cd ml-service
pytest
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Use descriptive title and description
   - Reference related issues
   - Include screenshots for UI changes
   - Ensure all tests pass

4. **Code Review**
   - Address reviewer comments
   - Keep commits clean and meaningful
   - Re-request review after changes

## Issues & Bugs

### Reporting Issues

1. Check existing issues first
2. Provide detailed description
3. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages/logs
   - Environment details

### Working on Issues

1. Comment on issue to claim it
2. Link your PR to the issue
3. Keep communication clear

## Documentation

- Update README.md for user-facing changes
- Update ARCHITECTURE.md for structural changes
- Add inline comments for complex logic
- Keep docs in sync with code

## Performance Considerations

- Optimize database queries
- Use caching appropriately
- Minimize API calls
- Profile before and after changes

## Security

- Never commit secrets or credentials
- Use environment variables
- Validate and sanitize inputs
- Follow OWASP guidelines
- Review security implications

## Release Process

1. Merge feature branches to main
2. Update version numbers
3. Update CHANGELOG.md
4. Create release tag
5. Deploy to production

## Getting Help

- Check [Documentation](./ARCHITECTURE.md)
- Review [Issues](https://github.com/shimmicute29-ops/DevLens/issues)
- Start a [Discussion](https://github.com/shimmicute29-ops/DevLens/discussions)
- Contact maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to DevLens! 🚀
