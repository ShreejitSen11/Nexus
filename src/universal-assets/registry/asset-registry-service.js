/**
 * Asset Registry Service
 * Manages asset registration and metadata
 */

import blockchainService from '../../core/blockchain/blockchain-service.js';
import db from '../../core/database/database-service.js';
import ipfsService from '../../core/ipfs/ipfs-service.js';

class AssetRegistryService {
  constructor() {
    this.contractAddress = null;
    this.contractABI = null; // Would be loaded from compiled artifacts
  }

  /**
   * Initialize service with contract details
   */
  initialize(contractAddress, contractABI, chain = 'polygon') {
    this.contractAddress = contractAddress;
    this.contractABI = contractABI;
    this.chain = chain;
  }

  /**
   * Register an asset on-chain
   */
  async registerAsset(assetData) {
    const {
      assetId,
      name,
      visualDataURI,
      traits = [],
      rarity = 1,
      revenueShareBps = 1000,
    } = assetData;

    try {
      // Get contract instance
      const contract = blockchainService.getContract(
        this.contractAddress,
        this.contractABI,
        this.chain,
        true
      );

      // Call smart contract
      const tx = await contract.registerAsset(
        assetId,
        name,
        visualDataURI,
        traits,
        rarity,
        revenueShareBps
      );

      const receipt = await tx.wait();

      // Store in database for quick access
      db.insert('assets', {
        id: assetId,
        name,
        creator: receipt.from.toLowerCase(),
        visual_data_uri: visualDataURI,
        rarity,
        revenue_share_bps: revenueShareBps,
        is_active: 1,
        chain: this.chain,
        registration_time: Math.floor(Date.now() / 1000),
      });

      return {
        success: true,
        assetId,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      };
    } catch (error) {
      console.error('Asset registration error:', error);
      throw new Error(`Failed to register asset: ${error.message}`);
    }
  }

  /**
   * Get asset details from contract
   */
  async getAsset(assetId) {
    try {
      // Try database first
      const cachedAsset = db.findOne('assets', { id: assetId });
      if (cachedAsset) {
        return cachedAsset;
      }

      // Fallback to contract
      const contract = blockchainService.getContract(
        this.contractAddress,
        this.contractABI,
        this.chain
      );

      const asset = await contract.getAsset(assetId);

      return {
        id: assetId,
        name: asset.name,
        creator: asset.creator,
        visualDataURI: asset.visualDataURI,
        traits: asset.traits,
        rarity: asset.rarity.toString(),
        revenueShareBps: asset.revenueShareBps.toString(),
        isActive: asset.isActive,
        registrationTime: asset.registrationTime.toString(),
      };
    } catch (error) {
      throw new Error(`Failed to get asset: ${error.message}`);
    }
  }

  /**
   * Whitelist a game for asset usage
   */
  async whitelistGame(assetId, gameAddress, licenseFeeBps) {
    try {
      const contract = blockchainService.getContract(
        this.contractAddress,
        this.contractABI,
        this.chain,
        true
      );

      const tx = await contract.whitelistGame(assetId, gameAddress, licenseFeeBps);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
      };
    } catch (error) {
      throw new Error(`Failed to whitelist game: ${error.message}`);
    }
  }

  /**
   * Check if a game can use an asset
   */
  async canGameUseAsset(assetId, gameAddress) {
    try {
      const contract = blockchainService.getContract(
        this.contractAddress,
        this.contractABI,
        this.chain
      );

      return await contract.canGameUseAsset(assetId, gameAddress);
    } catch (error) {
      throw new Error(`Failed to check game permissions: ${error.message}`);
    }
  }

  /**
   * Get total registered assets
   */
  async getTotalAssets() {
    try {
      const contract = blockchainService.getContract(
        this.contractAddress,
        this.contractABI,
        this.chain
      );

      const total = await contract.getTotalAssets();
      return total.toString();
    } catch (error) {
      // Fallback to database
      return db.count('assets');
    }
  }

  /**
   * Upload asset metadata to IPFS
   */
  async uploadMetadata(metadata) {
    try {
      return await ipfsService.uploadAssetMetadata(metadata);
    } catch (error) {
      throw new Error(`Failed to upload metadata: ${error.message}`);
    }
  }

  /**
   * Sync on-chain events to database
   */
  async syncEvents(fromBlock, toBlock) {
    try {
      const contract = blockchainService.getContract(
        this.contractAddress,
        this.contractABI,
        this.chain
      );

      const events = await blockchainService.getPastEvents(
        contract,
        'AssetRegistered',
        fromBlock,
        toBlock
      );

      for (const event of events) {
        const { assetId, creator, name, revenueShareBps } = event.args;

        // Check if already synced
        const exists = db.findOne('assets', { id: assetId });
        if (!exists) {
          db.insert('assets', {
            id: assetId,
            name,
            creator: creator.toLowerCase(),
            revenue_share_bps: revenueShareBps.toString(),
            is_active: 1,
            chain: this.chain,
            registration_time: Math.floor(Date.now() / 1000),
          });
        }
      }

      return {
        synced: events.length,
        fromBlock,
        toBlock,
      };
    } catch (error) {
      console.error('Event sync error:', error);
      return { synced: 0, error: error.message };
    }
  }
}

export default new AssetRegistryService();
