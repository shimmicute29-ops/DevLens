#!/bin/bash

echo "🚀 DevLens Setup Script"
echo "========================"

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env files
echo "
🔧 Creating environment files..."

if [ ! -f backend/.env ]; then
    cat > backend/.env << EOF
NODE_ENV=development
DATABASE_URL=postgresql://devlens:devlens_secure_password@postgres:5432/devlens_db
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret_key_change_in_production
PORT=5000
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Created backend/.env"
fi

if [ ! -f frontend/.env ]; then
    cat > frontend/.env << EOF
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:5000
EOF
    echo "✅ Created frontend/.env"
fi

# Start Docker services
echo "
🐳 Starting Docker services..."
docker-compose up -d

echo "✅ Services started"

# Wait for services to be ready
echo "
⏳ Waiting for services to be ready..."
sleep 10

# Run migrations
echo "
🗄️  Running database migrations..."
docker exec devlens-backend npm run db:migrate 2>/dev/null || echo "Database may already be initialized"

# Display access information
echo "
✨ DevLens is ready! Access the following:"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo "GraphQL: http://localhost:5000/graphql"
echo "ML API: http://localhost:8000"
echo ""
echo "📚 Next steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Register a new account"
echo "3. Start taking assessments"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
