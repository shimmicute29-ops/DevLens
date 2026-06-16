# DevLens Deployment Guide

## Prerequisites

- Docker & Docker Compose
- SSL certificate (for production)
- Environment variables configured
- Database backup strategy
- Monitoring setup

## Local Development

### Quick Start

```bash
# Clone repository
git clone https://github.com/shimmicute29-ops/DevLens.git
cd DevLens

# Start all services
docker-compose up -d

# Initialize database
docker exec devlens-backend npm run db:migrate
docker exec devlens-backend npm run db:seed

# Access applications
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- GraphQL: http://localhost:5000/graphql
- ML API: http://localhost:8000
```

## Production Deployment

### 1. Environment Configuration

Create `.env.production` file:

```bash
# Node Backend
NODE_ENV=production
DATABASE_URL=postgresql://user:password@prod-db:5432/devlens_prod
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=generate-a-secure-random-key
PORT=5000
FRONTEND_URL=https://devlens.example.com

# Frontend
REACT_APP_API_URL=https://api.devlens.example.com
REACT_APP_WS_URL=wss://api.devlens.example.com

# ML Service
PYTHON_ENV=production
DATABASE_URL=postgresql://user:password@prod-db:5432/devlens_prod
PORT=8000
```

### 2. Database Setup

```bash
# Connect to PostgreSQL
psql -h prod-db.example.com -U postgres

# Create database and user
CREATE DATABASE devlens_prod;
CREATE USER devlens WITH PASSWORD 'strong-password';
GRANT ALL PRIVILEGES ON DATABASE devlens_prod TO devlens;

# Run migrations
psql -h prod-db.example.com -U devlens -d devlens_prod -f database/migrations/001_initial_schema.sql
psql -h prod-db.example.com -U devlens -d devlens_prod -f database/migrations/002_seed_data.sql
```

### 3. Docker Deployment

```bash
# Build production images
docker build -t devlens-backend:1.0.0 ./backend
docker build -t devlens-frontend:1.0.0 ./frontend
docker build -t devlens-ml:1.0.0 ./ml-service

# Push to registry
docker tag devlens-backend:1.0.0 registry.example.com/devlens-backend:1.0.0
docker push registry.example.com/devlens-backend:1.0.0
```

### 4. Kubernetes Deployment (Optional)

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devlens-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: devlens-backend
  template:
    metadata:
      labels:
        app: devlens-backend
    spec:
      containers:
      - name: backend
        image: registry.example.com/devlens-backend:1.0.0
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: devlens-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: devlens-secrets
              key: redis-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### 5. SSL/TLS Configuration

With nginx reverse proxy:

```nginx
server {
    listen 443 ssl http2;
    server_name api.devlens.example.com;

    ssl_certificate /etc/letsencrypt/live/api.devlens.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.devlens.example.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://devlens-backend:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. Monitoring & Logging

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'devlens-backend'
    static_configs:
      - targets: ['localhost:5000']

  - job_name: 'devlens-ml'
    static_configs:
      - targets: ['localhost:8000']
```

### 7. Backup Strategy

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/devlens"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
pg_dump -h prod-db.example.com -U devlens devlens_prod | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://devlens-backups/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

### 8. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy DevLens

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker images
        run: |
          docker build -t devlens-backend:${{ github.sha }} ./backend
          docker build -t devlens-frontend:${{ github.sha }} ./frontend
      
      - name: Push to registry
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push devlens-backend:${{ github.sha }}
          docker push devlens-frontend:${{ github.sha }}
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/devlens-backend \
            backend=registry.example.com/devlens-backend:${{ github.sha }}
```

### 9. Health Checks

```bash
# Check backend health
curl https://api.devlens.example.com/health

# Check database connectivity
curl https://api.devlens.example.com/api/assessments -H "Authorization: Bearer $TOKEN"

# Monitor logs
docker logs -f devlens-backend
```

## Scaling

### Horizontal Scaling

```bash
# Scale backend replicas
kubectl scale deployment devlens-backend --replicas=5

# Scale ML service
kubectl scale deployment devlens-ml --replicas=3
```

### Vertical Scaling

Increase resource limits in Kubernetes manifests based on monitoring data.

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL status
psql -h prod-db.example.com -U devlens -d devlens_prod -c "SELECT 1"

# Check connection pool
psql -h prod-db.example.com -U postgres -d postgres -c "SELECT datname, usename, count(*) FROM pg_stat_activity GROUP BY datname, usename"
```

### Memory Leaks

```bash
# Monitor container memory
docker stats devlens-backend

# Check Node.js memory usage
node --inspect=0.0.0.0:9229 src/server.js
```

## Rollback Procedure

```bash
# Rollback to previous version
kubectl rollout undo deployment/devlens-backend
kubectl rollout history deployment/devlens-backend
```

## Security Checklist

- [ ] JWT secrets are secure and rotated
- [ ] Database credentials stored in secrets
- [ ] SSL/TLS enabled
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens implemented
- [ ] Regular security audits
- [ ] Dependency updates
- [ ] Firewall rules configured

## Support

For deployment questions, see [CONTRIBUTING.md](CONTRIBUTING.md) or open an issue.
