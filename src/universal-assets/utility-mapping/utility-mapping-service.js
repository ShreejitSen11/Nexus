/**
 * Cross-Game Utility Mapping Engine
 * Defines how assets work across different games
 */

class UtilityMappingService {
  constructor() {
    this.utilityMappings = new Map();
    this.initializeDefaultMappings();
  }

  /**
   * Initialize default utility mappings
   */
  initializeDefaultMappings() {
    // Example mappings for different asset types
    this.utilityMappings.set('weapon', {
      rpg: { stat: 'attack', multiplier: 1.0 },
      battleRoyale: { stat: 'damage', multiplier: 0.05 },
      racing: { stat: 'speed', multiplier: 0.03 },
      strategy: { stat: 'power', multiplier: 0.1 },
    });

    this.utilityMappings.set('armor', {
      rpg: { stat: 'defense', multiplier: 1.0 },
      battleRoyale: { stat: 'health', multiplier: 0.05 },
      strategy: { stat: 'defense', multiplier: 0.08 },
    });

    this.utilityMappings.set('accessory', {
      rpg: { stat: 'speed', multiplier: 0.1 },
      racing: { stat: 'acceleration', multiplier: 0.1 },
      battleRoyale: { stat: 'movement', multiplier: 0.05 },
    });

    this.utilityMappings.set('legendary', {
      rpg: { stat: 'all_stats', multiplier: 0.15 },
      battleRoyale: { stat: 'all_stats', multiplier: 0.08 },
      racing: { stat: 'all_stats', multiplier: 0.06 },
      strategy: { stat: 'all_stats', multiplier: 0.12 },
    });
  }

  /**
   * Define utility mapping for an asset
   */
  defineUtility(assetId, assetType, gameType, effects) {
    const key = `${assetId}_${gameType}`;
    
    const utility = {
      assetId,
      assetType,
      gameType,
      effects,
      createdAt: Date.now(),
    };

    this.utilityMappings.set(key, utility);
    return utility;
  }

  /**
   * Get utility mapping for an asset in a specific game
   */
  getUtility(assetId, gameType) {
    const key = `${assetId}_${gameType}`;
    return this.utilityMappings.get(key);
  }

  /**
   * Get all utilities for an asset
   */
  getAllUtilities(assetId) {
    const utilities = [];
    
    for (const [key, value] of this.utilityMappings.entries()) {
      if (key.startsWith(assetId)) {
        utilities.push(value);
      }
    }

    return utilities;
  }

  /**
   * Calculate cross-game effect
   */
  calculateEffect(assetData, gameType) {
    const { rarity, type, baseStats = {} } = assetData;

    // Get base mapping for asset type
    const baseMapping = this.utilityMappings.get(type);
    if (!baseMapping || !baseMapping[gameType]) {
      return null;
    }

    const mapping = baseMapping[gameType];

    // Apply rarity multiplier
    const rarityMultipliers = {
      1: 1.0,   // Common
      2: 1.5,   // Rare
      3: 2.0,   // Epic
      4: 3.0,   // Legendary
    };

    const rarityMult = rarityMultipliers[rarity] || 1.0;
    const effectMultiplier = mapping.multiplier * rarityMult;

    return {
      stat: mapping.stat,
      effect: `+${(effectMultiplier * 100).toFixed(1)}%`,
      multiplier: effectMultiplier,
      description: this.generateEffectDescription(mapping.stat, effectMultiplier, gameType),
    };
  }

  /**
   * Generate human-readable effect description
   */
  generateEffectDescription(stat, multiplier, gameType) {
    const percentage = (multiplier * 100).toFixed(1);
    
    const descriptions = {
      attack: `Increases attack power by ${percentage}% in ${gameType}`,
      damage: `Boosts damage output by ${percentage}% in ${gameType}`,
      defense: `Enhances defense by ${percentage}% in ${gameType}`,
      speed: `Improves movement speed by ${percentage}% in ${gameType}`,
      health: `Increases maximum health by ${percentage}% in ${gameType}`,
      power: `Increases overall power by ${percentage}% in ${gameType}`,
      all_stats: `Boosts all stats by ${percentage}% in ${gameType}`,
      acceleration: `Improves acceleration by ${percentage}% in ${gameType}`,
      movement: `Enhances movement by ${percentage}% in ${gameType}`,
    };

    return descriptions[stat] || `Provides ${percentage}% bonus in ${gameType}`;
  }

  /**
   * Get compatible games for an asset
   */
  getCompatibleGames(assetType) {
    const mapping = this.utilityMappings.get(assetType);
    if (!mapping) {
      return [];
    }

    return Object.keys(mapping).map(gameType => ({
      gameType,
      effects: mapping[gameType],
    }));
  }

  /**
   * Calculate per-use fee for asset
   */
  calculateUsageFee(assetData, gameType) {
    const baseEffect = this.calculateEffect(assetData, gameType);
    if (!baseEffect) {
      return 0;
    }

    // Base fee: 0.0001 USDC per 1% effect
    const baseFeePerPercent = 0.0001;
    const effectPercentage = baseEffect.multiplier * 100;
    
    return baseFeePerPercent * effectPercentage;
  }

  /**
   * Validate utility mapping
   */
  validateMapping(mapping) {
    const required = ['assetId', 'gameType', 'effects'];
    
    for (const field of required) {
      if (!mapping[field]) {
        return {
          valid: false,
          error: `Missing required field: ${field}`,
        };
      }
    }

    if (!mapping.effects.stat || !mapping.effects.multiplier) {
      return {
        valid: false,
        error: 'Effects must include stat and multiplier',
      };
    }

    if (mapping.effects.multiplier < 0 || mapping.effects.multiplier > 1) {
      return {
        valid: false,
        error: 'Multiplier must be between 0 and 1',
      };
    }

    return { valid: true };
  }

  /**
   * Export all mappings
   */
  exportMappings() {
    const mappings = {};
    
    for (const [key, value] of this.utilityMappings.entries()) {
      mappings[key] = value;
    }

    return mappings;
  }

  /**
   * Import mappings
   */
  importMappings(mappings) {
    for (const [key, value] of Object.entries(mappings)) {
      this.utilityMappings.set(key, value);
    }
  }
}

export default new UtilityMappingService();
