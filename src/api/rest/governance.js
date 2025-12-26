/**
 * Governance API Routes
 */

import express from 'express';

const router = express.Router();

/**
 * GET /governance/proposals - List proposals
 */
router.get('/proposals', async (req, res) => {
  try {
    // Mock data for now
    res.json({
      proposals: [
        {
          id: 1,
          title: 'Reduce Platform Fee to 3%',
          status: 'active',
          votesFor: 892000,
          votesAgainst: 108000
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
