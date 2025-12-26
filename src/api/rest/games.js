/**
 * Games API Routes
 */

import express from 'express';
import db from '../../core/database/database-service.js';

const router = express.Router();

/**
 * GET /games - List all games
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, chain, status } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (chain) where.chain = chain;
    if (status) where.status = status;
    
    const games = db.findAll('games', where, parseInt(limit), parseInt(offset));
    const total = db.count('games', where);
    
    res.json({
      games,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /games/:id - Get game by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const game = db.findOne('games', { id: req.params.id });
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json({ game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /games - Register new game
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      creator,
      chain = 'polygon',
      contractAddress
    } = req.body;
    
    if (!name || !creator) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const gameId = `game-${Date.now()}`;
    
    db.insert('games', {
      id: gameId,
      name,
      creator: creator.toLowerCase(),
      chain,
      contract_address: contractAddress?.toLowerCase() || '',
      status: 'active',
      players_count: 0,
      revenue: '0'
    });
    
    res.status(201).json({
      gameId,
      message: 'Game registered successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /games/:id - Update game
 */
router.put('/:id', async (req, res) => {
  try {
    const { playersCount, revenue, status } = req.body;
    
    const updates = {};
    if (playersCount !== undefined) updates.players_count = playersCount;
    if (revenue !== undefined) updates.revenue = revenue;
    if (status) updates.status = status;
    
    db.update('games', updates, { id: req.params.id });
    
    res.json({ message: 'Game updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
