const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ApolloServer } = require('apollo-server-express');
const WebSocket = require('ws');
const http = require('http');

const db = require('./config/database');
const redis = require('./config/redis');
const authRoutes = require('./api/routes/auth');
const assessmentRoutes = require('./api/routes/assessments');
const developerRoutes = require('./api/routes/developers');
const teamRoutes = require('./api/routes/teams');
const reportRoutes = require('./api/routes/reports');
const authMiddleware = require('./middleware/auth');
const graphqlSchema = require('./graphql/schema');

const app = express();
const server = http.createServer(app);

// Security
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', authMiddleware, assessmentRoutes);
app.use('/api/developers', authMiddleware, developerRoutes);
app.use('/api/teams', authMiddleware, teamRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);

// GraphQL Server
const startApolloServer = async () => {
  const apolloServer = new ApolloServer({
    schema: graphqlSchema,
    context: ({ req }) => ({ req, db, redis })
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
};

// WebSocket for real-time updates
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket connected');
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      // Handle real-time updates
      broadcast({ type: 'update', data });
    } catch (err) {
      console.error('WebSocket error:', err);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
  });
});

const broadcast = (message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Initialize database
    await db.connect();
    console.log('Database connected');

    // Initialize Redis
    await redis.connect();
    console.log('Redis connected');

    // Start Apollo Server
    await startApolloServer();

    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 GraphQL available at http://localhost:${PORT}/graphql`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();

module.exports = { app, server, wss };
