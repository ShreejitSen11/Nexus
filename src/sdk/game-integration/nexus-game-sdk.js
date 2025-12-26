/**
 * Nexus Game Developer SDK
 * Easy integration for game developers
 */

class NexusGameSDK {
  constructor(config = {}) {
    this.apiUrl = config.apiUrl || 'http://localhost:3000/api';
    this.gameId = config.gameId;
    this.apiKey = config.apiKey;
    this.chain = config.chain || 'polygon';
  }

  /**
   * Initialize SDK
   */
  async initialize() {
    try {
      const response = await this.request('/health');
      return {
        initialized: true,
        version: response.version || '1.0.0',
      };
    } catch (error) {
      throw new Error(`SDK initialization failed: ${error.message}`);
    }
  }

  /**
   * Register a new asset
   */
  async registerAsset(assetData) {
    const {
      name,
      creator,
      visualDataUri,
      rarity = 1,
      revenueShareBps = 1000,
    } = assetData;

    return await this.request('/assets', {
      method: 'POST',
      body: {
        name,
        creator,
        visualDataUri,
        rarity,
        revenueShareBps,
        chain: this.chain,
      },
    });
  }

  /**
   * Get asset details
   */
  async getAsset(assetId) {
    return await this.request(`/assets/${assetId}`);
  }

  /**
   * Wrap an NFT for cross-game use
   */
  async wrapNFT(nftData) {
    const {
      nftContract,
      tokenId,
      universalAssetId,
      tokenType = 721,
    } = nftData;

    return await this.request('/assets/wrap', {
      method: 'POST',
      body: {
        nftContract,
        tokenId,
        universalAssetId,
        tokenType,
        chain: this.chain,
      },
    });
  }

  /**
   * Check if player owns an asset
   */
  async checkAssetOwnership(playerAddress, assetId) {
    // In production, this would query the blockchain
    return {
      owns: true,
      assetId,
      playerAddress,
    };
  }

  /**
   * Apply cross-game asset effects
   */
  async applyAssetEffect(assetId, gameType) {
    // Mock implementation - in production, would fetch from utility mapping
    return {
      assetId,
      gameType,
      effect: '+5% damage',
      multiplier: 0.05,
    };
  }

  /**
   * Track analytics event
   */
  async trackEvent(eventData) {
    const {
      eventType,
      userAddress,
      assetId,
      metadata = {},
    } = eventData;

    return await this.request('/analytics/events', {
      method: 'POST',
      body: {
        eventType,
        userAddress,
        gameId: this.gameId,
        assetId,
        metadata,
      },
    });
  }

  /**
   * Get game statistics
   */
  async getGameStats() {
    const stats = await this.request('/analytics/stats');
    return stats;
  }

  /**
   * Distribute rewards to player
   */
  async distributeReward(playerAddress, amount, reason = 'gameplay') {
    return await this.trackEvent({
      eventType: 'reward_distributed',
      userAddress: playerAddress,
      metadata: { amount, reason },
    });
  }

  /**
   * Create marketplace listing
   */
  async createListing(listingData) {
    const {
      assetId,
      seller,
      price,
      listingType = 'sale',
      duration = 0,
    } = listingData;

    return await this.request('/marketplace/listings', {
      method: 'POST',
      body: {
        assetId,
        seller,
        price,
        listingType,
        duration,
        chain: this.chain,
      },
    });
  }

  /**
   * Get marketplace listings
   */
  async getListings(filters = {}) {
    const params = new URLSearchParams(filters);
    return await this.request(`/marketplace/listings?${params}`);
  }

  /**
   * Get AI optimization insights
   */
  async getOptimizationInsights() {
    // Mock implementation
    return {
      insights: [
        {
          type: 'revenue',
          message: 'Consider adjusting item prices',
          impact: '+15%',
        },
      ],
    };
  }

  /**
   * Verify player wallet
   */
  async verifyWallet(address, signature, message) {
    // Mock verification - in production, would verify signature
    return {
      verified: true,
      address,
    };
  }

  /**
   * Helper: Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'X-API-Key': this.apiKey }),
    };

    const config = {
      method: options.method || 'GET',
      headers,
      ...(options.body && { body: JSON.stringify(options.body) }),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  /**
   * Get SDK version
   */
  getVersion() {
    return '1.0.0';
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    Object.assign(this, newConfig);
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NexusGameSDK;
}

export default NexusGameSDK;
