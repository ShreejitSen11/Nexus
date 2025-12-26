/**
 * REST API Routes
 * Exposes HTTP endpoints for the Nexus GameFi Protocol
 */

import express from 'express';
import assetRoutes from './assets.js';
import gameRoutes from './games.js';
import marketplaceRoutes from './marketplace.js';
import analyticsRoutes from './analytics.js';
import governanceRoutes from './governance.js';

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API info
router.get('/', (req, res) => {
  res.json({
    name: 'Nexus GameFi Protocol API',
    version: '1.0.0',
    description: 'Unified esports/gaming blockchain platform',
    endpoints: {
      assets: '/api/assets',
      games: '/api/games',
      marketplace: '/api/marketplace',
      analytics: '/api/analytics',
      governance: '/api/governance'
    }
  });
});

// Mount route modules
router.use('/assets', assetRoutes);
router.use('/games', gameRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/governance', governanceRoutes);

export default router;
