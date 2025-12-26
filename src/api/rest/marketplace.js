/**
 * Marketplace API Routes
 */

import express from 'express';
import db from '../../core/database/database-service.js';

const router = express.Router();

/**
 * GET /marketplace/listings - Get all listings
 */
router.get('/listings', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, active = 'true' } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (type) where.listing_type = type;
    if (active === 'true') where.is_active = 1;
    
    const listings = db.findAll('listings', where, parseInt(limit), parseInt(offset));
    const total = db.count('listings', where);
    
    res.json({
      listings,
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
 * POST /marketplace/listings - Create listing
 */
router.post('/listings', async (req, res) => {
  try {
    const {
      assetId,
      seller,
      price,
      listingType,
      duration,
      chain = 'polygon'
    } = req.body;
    
    const listingId = `listing-${Date.now()}`;
    
    db.insert('listings', {
      id: listingId,
      asset_id: assetId,
      seller: seller.toLowerCase(),
      price: price.toString(),
      listing_type: listingType,
      duration: duration || 0,
      is_active: 1,
      chain
    });
    
    res.status(201).json({
      listingId,
      message: 'Listing created successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /marketplace/listings/:id - Cancel listing
 */
router.delete('/listings/:id', async (req, res) => {
  try {
    db.update('listings', { is_active: 0 }, { id: req.params.id });
    res.json({ message: 'Listing cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
