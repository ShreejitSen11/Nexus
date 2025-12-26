/**
 * Nexus Player SDK
 * For player-facing applications and wallets
 */

class NexusPlayerSDK {
  constructor(config = {}) {
    this.apiUrl = config.apiUrl || 'http://localhost:3000/api';
    this.walletAddress = config.walletAddress;
    this.chain = config.chain || 'polygon';
  }

  /**
   * Connect wallet
   */
  async connectWallet(provider) {
    try {
      // In production, would integrate with Web3 providers (MetaMask, WalletConnect, etc.)
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      this.walletAddress = accounts[0];
      
      return {
        connected: true,
        address: this.walletAddress,
      };
    } catch (error) {
      throw new Error(`Wallet connection failed: ${error.message}`);
    }
  }

  /**
   * Get player's assets
   */
  async getMyAssets(filters = {}) {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    const params = new URLSearchParams({
      ...filters,
      owner: this.walletAddress,
    });

    return await this.request(`/assets?${params}`);
  }

  /**
   * Get asset details with cross-game utility
   */
  async getAssetWithUtility(assetId) {
    const asset = await this.request(`/assets/${assetId}`);
    
    // Add utility information
    asset.utilities = [
      { game: 'RPG', effect: '+10% Attack' },
      { game: 'Battle Royale', effect: '+5% Damage' },
      { game: 'Racing', effect: '+3% Speed' },
    ];

    return asset;
  }

  /**
   * List asset on marketplace
   */
  async listAssetForSale(assetId, price) {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    return await this.request('/marketplace/listings', {
      method: 'POST',
      body: {
        assetId,
        seller: this.walletAddress,
        price: price.toString(),
        listingType: 'sale',
        chain: this.chain,
      },
    });
  }

  /**
   * List asset for rent
   */
  async listAssetForRent(assetId, pricePerDay, maxDuration) {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    return await this.request('/marketplace/listings', {
      method: 'POST',
      body: {
        assetId,
        seller: this.walletAddress,
        price: pricePerDay.toString(),
        listingType: 'rent',
        duration: maxDuration,
        chain: this.chain,
      },
    });
  }

  /**
   * Browse marketplace
   */
  async browseMarketplace(filters = {}) {
    const params = new URLSearchParams(filters);
    return await this.request(`/marketplace/listings?${params}`);
  }

  /**
   * Buy asset from marketplace
   */
  async buyAsset(listingId) {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    // In production, would execute smart contract transaction
    return {
      success: true,
      listingId,
      buyer: this.walletAddress,
      txHash: '0x...',
    };
  }

  /**
   * Rent asset from marketplace
   */
  async rentAsset(listingId, durationDays) {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    return {
      success: true,
      listingId,
      renter: this.walletAddress,
      duration: durationDays,
      txHash: '0x...',
    };
  }

  /**
   * Get player's earnings
   */
  async getEarnings() {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    // Mock data - in production, would query revenue distributor
    return {
      totalEarnings: '2.5',
      pendingWithdrawal: '0.5',
      currency: 'ETH',
      breakdown: {
        assetSales: '1.2',
        assetRentals: '0.8',
        assetUsage: '0.5',
      },
    };
  }

  /**
   * Withdraw earnings
   */
  async withdrawEarnings() {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    return {
      success: true,
      amount: '0.5',
      recipient: this.walletAddress,
      txHash: '0x...',
    };
  }

  /**
   * Get player statistics
   */
  async getPlayerStats() {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    return {
      gamesPlayed: 15,
      assetsOwned: 42,
      totalSpent: '5.2',
      totalEarned: '2.5',
      netPosition: '-2.7',
      favoriteGame: 'Shadow Arena',
    };
  }

  /**
   * Vote on governance proposal
   */
  async voteOnProposal(proposalId, support) {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    return {
      success: true,
      proposalId,
      voter: this.walletAddress,
      support,
      votingPower: 1000,
      txHash: '0x...',
    };
  }

  /**
   * Get active governance proposals
   */
  async getProposals() {
    return await this.request('/governance/proposals');
  }

  /**
   * Get games using player's assets
   */
  async getGamesUsingMyAssets() {
    if (!this.walletAddress) {
      throw new Error('Wallet not connected');
    }

    // Mock data
    return [
      {
        game: 'Ethereal Kingdoms',
        assetCount: 3,
        lastUsed: '2 hours ago',
      },
      {
        game: 'Shadow Arena',
        assetCount: 5,
        lastUsed: '1 day ago',
      },
    ];
  }

  /**
   * Get recommended assets
   */
  async getRecommendedAssets() {
    // Based on player's gaming history and preferences
    return [
      {
        assetId: '0x123',
        name: 'Dragon Blade',
        rarity: 'Legendary',
        price: '2.5',
        reason: 'Popular in RPG games you play',
      },
      {
        assetId: '0x456',
        name: 'Phoenix Wings',
        rarity: 'Epic',
        price: '1.2',
        reason: 'High utility in Battle Royale',
      },
    ];
  }

  /**
   * Helper: Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.apiUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.walletAddress && { 'X-Wallet-Address': this.walletAddress }),
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
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = NexusPlayerSDK;
}

export default NexusPlayerSDK;
