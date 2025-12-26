/**
 * AI Revenue Optimization Service
 * ML-powered insights for game monetization
 */

class AIOptimizerService {
  constructor() {
    this.insights = [];
    this.predictions = new Map();
  }

  /**
   * Analyze player spending patterns
   */
  analyzeSpendingPatterns(playerData) {
    const {
      totalSpent = 0,
      purchaseCount = 0,
      avgSessionTime = 0,
      lastPurchase = null,
      level = 1,
    } = playerData;

    const avgPurchaseValue = purchaseCount > 0 ? totalSpent / purchaseCount : 0;
    const daysSinceLastPurchase = lastPurchase 
      ? Math.floor((Date.now() - new Date(lastPurchase).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    // Classify player type
    let playerType = 'casual';
    if (totalSpent > 100) {
      playerType = 'whale';
    } else if (totalSpent > 20) {
      playerType = 'payer';
    } else if (purchaseCount > 0) {
      playerType = 'minnow';
    }

    // Calculate engagement score (0-100)
    const engagementScore = Math.min(100, 
      (avgSessionTime / 60) * 10 + // Session time contribution
      (purchaseCount * 5) + // Purchase frequency
      (level * 2) // Progress contribution
    );

    return {
      playerType,
      avgPurchaseValue,
      engagementScore,
      daysSinceLastPurchase,
      recommendations: this.generatePlayerRecommendations(playerType, engagementScore, daysSinceLastPurchase),
    };
  }

  /**
   * Generate recommendations for player type
   */
  generatePlayerRecommendations(playerType, engagementScore, daysSinceLastPurchase) {
    const recommendations = [];

    // Whale recommendations
    if (playerType === 'whale') {
      recommendations.push({
        action: 'exclusive_offer',
        message: 'Offer exclusive premium items',
        expectedImpact: '+$50/month',
        confidence: 92,
      });
      recommendations.push({
        action: 'vip_program',
        message: 'Invite to VIP program with special perks',
        expectedImpact: '+$75/month',
        confidence: 88,
      });
    }

    // Payer recommendations
    if (playerType === 'payer') {
      recommendations.push({
        action: 'bundle_offer',
        message: 'Present value bundles at 20% discount',
        expectedImpact: '+$15/month',
        confidence: 85,
      });
    }

    // Casual/Minnow recommendations
    if (playerType === 'casual' || playerType === 'minnow') {
      recommendations.push({
        action: 'starter_pack',
        message: 'Show limited-time starter pack ($4.99)',
        expectedImpact: '+$5/month',
        confidence: 78,
      });
    }

    // Re-engagement for inactive players
    if (daysSinceLastPurchase > 14) {
      recommendations.push({
        action: 'comeback_bonus',
        message: 'Send comeback bonus with free items',
        expectedImpact: '+$8/month',
        confidence: 82,
      });
    }

    // Low engagement
    if (engagementScore < 30) {
      recommendations.push({
        action: 'tutorial_rewards',
        message: 'Improve onboarding with better rewards',
        expectedImpact: '+15% retention',
        confidence: 86,
      });
    }

    return recommendations;
  }

  /**
   * Predict churn probability
   */
  predictChurn(playerData) {
    const {
      daysSinceLastLogin = 0,
      avgSessionTime = 0,
      totalSessions = 0,
      purchaseCount = 0,
      level = 1,
    } = playerData;

    // Simple scoring model (in production, use ML model)
    let churnScore = 0;

    // Days since last login (most important)
    if (daysSinceLastLogin > 14) churnScore += 40;
    else if (daysSinceLastLogin > 7) churnScore += 25;
    else if (daysSinceLastLogin > 3) churnScore += 10;

    // Session time
    if (avgSessionTime < 300) churnScore += 20; // < 5 minutes
    else if (avgSessionTime < 600) churnScore += 10; // < 10 minutes

    // Engagement
    if (totalSessions < 5) churnScore += 15;
    if (purchaseCount === 0) churnScore += 10;
    if (level < 5) churnScore += 15;

    const churnProbability = Math.min(100, churnScore);
    const risk = churnProbability > 70 ? 'high' : churnProbability > 40 ? 'medium' : 'low';

    return {
      churnProbability,
      risk,
      factors: this.identifyChurnFactors(playerData),
      interventions: this.suggestInterventions(churnProbability, playerData),
    };
  }

  /**
   * Identify churn risk factors
   */
  identifyChurnFactors(playerData) {
    const factors = [];

    if (playerData.daysSinceLastLogin > 7) {
      factors.push({ factor: 'inactivity', weight: 'high' });
    }
    if (playerData.avgSessionTime < 300) {
      factors.push({ factor: 'low_engagement', weight: 'medium' });
    }
    if (playerData.purchaseCount === 0) {
      factors.push({ factor: 'no_monetization', weight: 'low' });
    }
    if (playerData.level < 5) {
      factors.push({ factor: 'early_stage', weight: 'medium' });
    }

    return factors;
  }

  /**
   * Suggest churn prevention interventions
   */
  suggestInterventions(churnProbability, playerData) {
    const interventions = [];

    if (churnProbability > 70) {
      interventions.push({
        action: 'urgent_push_notification',
        message: 'Send personalized message with exclusive reward',
        timing: 'immediate',
        expectedEffect: '-25% churn risk',
      });
    }

    if (churnProbability > 50) {
      interventions.push({
        action: 'special_event',
        message: 'Invite to limited-time event with unique rewards',
        timing: '24 hours',
        expectedEffect: '-15% churn risk',
      });
    }

    if (playerData.level < 10) {
      interventions.push({
        action: 'progression_boost',
        message: 'Provide progression boost to reach next milestone',
        timing: 'next login',
        expectedEffect: '-10% churn risk',
      });
    }

    return interventions;
  }

  /**
   * Optimize pricing strategy
   */
  optimizePricing(itemData, marketData) {
    const {
      currentPrice = 0,
      purchaseCount = 0,
      viewCount = 0,
      rarity = 'common',
    } = itemData;

    const conversionRate = viewCount > 0 ? (purchaseCount / viewCount) * 100 : 0;

    // Price elasticity analysis
    let recommendedPrice = currentPrice;
    let reasoning = '';

    if (conversionRate < 2) {
      // Low conversion - price may be too high
      recommendedPrice = currentPrice * 0.85;
      reasoning = 'Low conversion rate suggests price is too high. Consider 15% reduction.';
    } else if (conversionRate > 10) {
      // High conversion - can increase price
      recommendedPrice = currentPrice * 1.15;
      reasoning = 'High conversion rate suggests room for price increase of 15%.';
    } else {
      // Optimal range
      recommendedPrice = currentPrice;
      reasoning = 'Current price is in optimal range.';
    }

    // Rarity adjustment
    const rarityMultipliers = {
      common: 1.0,
      rare: 1.5,
      epic: 2.0,
      legendary: 3.0,
    };

    const rarityAdjustedPrice = recommendedPrice * (rarityMultipliers[rarity] || 1.0);

    return {
      currentPrice,
      recommendedPrice: parseFloat(rarityAdjustedPrice.toFixed(2)),
      priceChange: ((rarityAdjustedPrice - currentPrice) / currentPrice * 100).toFixed(1),
      reasoning,
      conversionRate: conversionRate.toFixed(2),
      estimatedRevenueLift: this.calculateRevenueLift(currentPrice, rarityAdjustedPrice, purchaseCount),
    };
  }

  /**
   * Calculate revenue lift from price optimization
   */
  calculateRevenueLift(oldPrice, newPrice, volume) {
    // Assume 5% volume decrease per 10% price increase (price elasticity)
    const priceChange = (newPrice - oldPrice) / oldPrice;
    const volumeChange = -0.5 * priceChange; // Elasticity factor
    const newVolume = volume * (1 + volumeChange);

    const oldRevenue = oldPrice * volume;
    const newRevenue = newPrice * newVolume;
    const lift = newRevenue - oldRevenue;

    return {
      oldRevenue: oldRevenue.toFixed(2),
      newRevenue: newRevenue.toFixed(2),
      lift: lift.toFixed(2),
      liftPercentage: ((lift / oldRevenue) * 100).toFixed(1),
    };
  }

  /**
   * Generate token emission schedule
   */
  optimizeTokenEmission(gameData) {
    const {
      totalSupply = 1000000000,
      currentCirculation = 0,
      dailyActiveUsers = 1000,
      avgSessionTime = 1800, // 30 minutes
    } = gameData;

    // Calculate optimal emission rate
    const dailyPlayTime = dailyActiveUsers * (avgSessionTime / 3600); // in hours
    const tokensPerHour = 100; // base rate
    const dailyEmission = dailyPlayTime * tokensPerHour;

    // Calculate emission schedule over 5 years
    const schedule = [];
    let remaining = totalSupply - currentCirculation;
    let rate = tokensPerHour;
    const decayRate = 0.95; // 5% decay per epoch (monthly)

    for (let month = 1; month <= 60; month++) {
      const monthlyEmission = rate * dailyPlayTime * 30;
      
      if (monthlyEmission > remaining) {
        schedule.push({
          month,
          rate: rate.toFixed(2),
          emission: remaining.toFixed(0),
          remaining: 0,
        });
        break;
      }

      schedule.push({
        month,
        rate: rate.toFixed(2),
        emission: monthlyEmission.toFixed(0),
        remaining: (remaining - monthlyEmission).toFixed(0),
      });

      remaining -= monthlyEmission;
      rate *= decayRate; // Apply decay
    }

    return {
      totalSupply,
      currentCirculation,
      dailyEmission: dailyEmission.toFixed(0),
      schedule: schedule.slice(0, 12), // First 12 months
      fullSchedule: schedule,
    };
  }

  /**
   * A/B test recommendation
   */
  recommendABTest(metric, variants) {
    const recommendations = [
      {
        test: 'pricing_tiers',
        variants: ['$4.99', '$7.99', '$9.99'],
        metric: 'revenue',
        duration: '14 days',
        sampleSize: 1000,
      },
      {
        test: 'reward_frequency',
        variants: ['every_level', 'every_3_levels', 'every_5_levels'],
        metric: 'retention',
        duration: '21 days',
        sampleSize: 1500,
      },
      {
        test: 'ui_color_scheme',
        variants: ['blue', 'green', 'purple'],
        metric: 'engagement',
        duration: '7 days',
        sampleSize: 2000,
      },
    ];

    return recommendations;
  }

  /**
   * Get optimization insights
   */
  getInsights(gameId) {
    // Mock insights for demonstration
    return [
      {
        type: 'revenue',
        message: 'Increase item drop rates by 15% to boost retention',
        impact: '+$45K/mo',
        confidence: 89,
        actionable: true,
      },
      {
        type: 'churn',
        message: 'Players leaving at level 23 - add bonus rewards',
        impact: '-12% churn',
        confidence: 94,
        actionable: true,
      },
      {
        type: 'pricing',
        message: 'Premium items priced 20% too high',
        impact: '+$28K/mo',
        confidence: 86,
        actionable: true,
      },
      {
        type: 'engagement',
        message: 'Weekend events drive 3x more transactions',
        impact: '+$67K/mo',
        confidence: 91,
        actionable: true,
      },
    ];
  }
}

export default new AIOptimizerService();
