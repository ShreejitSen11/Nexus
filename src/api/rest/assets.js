/**
 * Asset API Routes
 */

import express from 'express';
import db from '../../core/database/database-service.js';
import blockchainService from '../../core/blockchain/blockchain-service.js';
import ipfsService from '../../core/ipfs/ipfs-service.js';

const router = express.Router();

/**
 * GET /assets - List all assets
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, chain, creator } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (chain) where.chain = chain;
    if (creator) where.creator = creator.toLowerCase();
    
    const assets = db.findAll('assets', where, parseInt(limit), parseInt(offset));
    const total = db.count('assets', where);
    
    res.json({
      assets,
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
 * GET /assets/:id - Get asset by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const asset = db.findOne('assets', { id: req.params.id });
    
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    
    res.json({ asset });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /assets - Register new asset
 */
router.post('/', async (req, res) => {
  try {
    const {
      name,
      creator,
      visualDataUri,
      rarity,
      revenueShareBps,
      chain = 'polygon'
    } = req.body;
    
    // Validate input
    if (!name || !creator) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Generate asset ID
    const assetId = `0x${Buffer.from(`${name}-${creator}-${Date.now()}`).toString('hex')}`;
    
    // Store in database
    db.insert('assets', {
      id: assetId,
      name,
      creator: creator.toLowerCase(),
      visual_data_uri: visualDataUri || '',
      rarity: rarity || 1,
      revenue_share_bps: revenueShareBps || 1000,
      is_active: 1,
      chain,
      registration_time: Math.floor(Date.now() / 1000)
    });
    
    res.status(201).json({
      assetId,
      message: 'Asset registered successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /assets/:id/metadata - Upload asset metadata to IPFS
 */
router.post('/:id/metadata', async (req, res) => {
  try {
    const { name, description, image, attributes } = req.body;
    
    const result = await ipfsService.uploadAssetMetadata({
      name,
      description,
      image,
      attributes
    });
    
    // Update asset with IPFS CID
    db.update(
      'assets',
      { visual_data_uri: result.cid },
      { id: req.params.id }
    );
    
    res.json({
      cid: result.cid,
      url: result.url
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /assets/:id/wrapped - Check if asset is wrapped
 */
router.get('/:id/wrapped', async (req, res) => {
  try {
    const wrappedAsset = db.findOne('wrapped_assets', {
      universal_asset_id: req.params.id
    });
    
    res.json({
      isWrapped: !!wrappedAsset,
      wrappedAsset: wrappedAsset || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /assets/wrap - Wrap an NFT
 */
router.post('/wrap', async (req, res) => {
  try {
    const {
      nftContract,
      tokenId,
      universalAssetId,
      tokenType = 721,
      chain = 'polygon'
    } = req.body;
    
    // Generate wrapped ID
    const wrappedId = `0x${Buffer.from(`${nftContract}-${tokenId}-${Date.now()}`).toString('hex')}`;
    
    // Store in database
    db.insert('wrapped_assets', {
      id: wrappedId,
      original_contract: nftContract.toLowerCase(),
      original_token_id: tokenId.toString(),
      token_type: tokenType,
      wrapper: req.body.wrapper?.toLowerCase() || '',
      universal_asset_id: universalAssetId,
      is_wrapped: 1,
      chain,
      wrap_time: Math.floor(Date.now() / 1000)
    });
    
    res.status(201).json({
      wrappedId,
      message: 'NFT wrapped successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
