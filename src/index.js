/**
 * Nexus GameFi Protocol - Main Application
 * Entry point for the unified esports/gaming blockchain platform
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import apiRoutes from './api/rest/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Nexus GameFi Protocol',
    version: '1.0.0',
    description: 'Unified esports/gaming blockchain platform combining Cross-Game Asset Composability Protocol and Decentralized Game Launcher',
    features: [
      'Universal Assets Protocol - Cross-game asset composability',
      'Asset Wrapping & Interoperability System',
      'Cross-Game Item Utility Mapping',
      'Player-Driven Marketplace',
      'Institutional Licensing',
      'GameFi OS - Decentralized Game Launcher',
      'Smart Contract Templates',
      'One-Click Deployment System',
      'AI Revenue Optimization Engine',
      'Decentralized Governance'
    ],
    endpoints: {
      api: '/api',
      health: '/health',
      docs: '/docs'
    },
    license: 'MIT'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.url} not found`,
    availableRoutes: {
      root: '/',
      api: '/api',
      health: '/health'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║              NEXUS GAMEFI PROTOCOL - v1.0.0                  ║
║                                                               ║
║  Unified Esports/Gaming Blockchain Platform                  ║
║                                                               ║
║  Features:                                                    ║
║  ✓ Universal Assets Protocol                                 ║
║  ✓ Cross-Game Asset Composability                           ║
║  ✓ Decentralized Game Launcher                              ║
║  ✓ AI Revenue Optimization                                   ║
║  ✓ DAO Governance                                            ║
║                                                               ║
║  Server running on: http://localhost:${PORT}                  ║
║  API Endpoint: http://localhost:${PORT}/api                   ║
║  Environment: ${process.env.NODE_ENV || 'development'}                              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
