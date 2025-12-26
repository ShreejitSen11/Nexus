/**
 * Analytics API Routes
 */

import express from 'express';
import db from '../../core/database/database-service.js';

const router = express.Router();

/**
 * POST /analytics/events - Track analytics event
 */
router.post('/events', async (req, res) => {
  try {
    const {
      eventType,
      userAddress,
      gameId,
      assetId,
      metadata
    } = req.body;
    
    db.insert('analytics_events', {
      event_type: eventType,
      user_address: userAddress?.toLowerCase() || null,
      game_id: gameId || null,
      asset_id: assetId || null,
      metadata: JSON.stringify(metadata || {}),
      timestamp: Math.floor(Date.now() / 1000)
    });
    
    res.status(201).json({ message: 'Event tracked' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /analytics/stats - Get analytics statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const totalAssets = db.count('assets');
    const totalGames = db.count('games');
    const totalListings = db.count('listings', { is_active: 1 });
    const totalRevenue = db.query(
      'SELECT SUM(CAST(amount AS REAL)) as total FROM revenue_records'
    )[0]?.total || 0;
    
    res.json({
      totalAssets,
      totalGames,
      totalListings,
      totalRevenue: totalRevenue.toString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
