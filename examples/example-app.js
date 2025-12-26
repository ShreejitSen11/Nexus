/**
 * Simple Example Application
 * Demonstrates how to use the Nexus GameFi Protocol
 */

import NexusGameSDK from '../src/sdk/game-integration/nexus-game-sdk.js';
import NexusPlayerSDK from '../src/sdk/player-sdk/nexus-player-sdk.js';

// Example 1: Game Developer Integration
async function gameExample() {
  console.log('\n🎮 Game Developer Example\n');
  console.log('='.repeat(50));

  // Initialize SDK
  const nexus = new NexusGameSDK({
    apiUrl: 'http://localhost:3000/api',
    gameId: 'demo-game-001',
    apiKey: 'demo-api-key',
    chain: 'polygon'
  });

  try {
    // 1. Register an in-game asset
    console.log('\n1️⃣ Registering a new asset...');
    const asset = await nexus.registerAsset({
      name: 'Legendary Sword of Light',
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      visualDataUri: 'ipfs://QmExampleHash',
      rarity: 4, // Legendary
      revenueShareBps: 1500 // 15% revenue share
    });
    console.log('✅ Asset registered:', asset.assetId);

    // 2. Track player events
    console.log('\n2️⃣ Tracking player events...');
    await nexus.trackEvent({
      eventType: 'level_completed',
      userAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      metadata: {
        level: 10,
        score: 1500,
        timeSpent: 300,
        assetsUsed: [asset.assetId]
      }
    });
    console.log('✅ Event tracked');

    // 3. Distribute rewards
    console.log('\n3️⃣ Distributing rewards...');
    await nexus.distributeReward(
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      100,
      'quest_completed'
    );
    console.log('✅ Rewards distributed');

    // 4. Get game statistics
    console.log('\n4️⃣ Getting game statistics...');
    const stats = await nexus.getGameStats();
    console.log('📊 Stats:', {
      totalAssets: stats.totalAssets,
      totalGames: stats.totalGames,
      totalRevenue: stats.totalRevenue
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Example 2: Player Integration
async function playerExample() {
  console.log('\n\n👤 Player Example\n');
  console.log('='.repeat(50));

  // Initialize SDK
  const nexus = new NexusPlayerSDK({
    apiUrl: 'http://localhost:3000/api',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    chain: 'polygon'
  });

  try {
    // 1. Get player's assets
    console.log('\n1️⃣ Fetching player assets...');
    const myAssets = await nexus.getMyAssets({ limit: 5 });
    console.log(`✅ Found ${myAssets.assets?.length || 0} assets`);
    
    if (myAssets.assets?.length > 0) {
      console.log('\nSample Asset:');
      const sample = myAssets.assets[0];
      console.log(`  Name: ${sample.name}`);
      console.log(`  Rarity: ${sample.rarity}`);
      console.log(`  Chain: ${sample.chain}`);
    }

    // 2. Browse marketplace
    console.log('\n2️⃣ Browsing marketplace...');
    const listings = await nexus.browseMarketplace({ 
      active: true,
      limit: 3 
    });
    console.log(`✅ Found ${listings.listings?.length || 0} active listings`);

    // 3. Get player statistics
    console.log('\n3️⃣ Getting player statistics...');
    const stats = await nexus.getPlayerStats();
    console.log('📊 Player Stats:', {
      gamesPlayed: stats.gamesPlayed,
      assetsOwned: stats.assetsOwned,
      totalEarned: stats.totalEarned
    });

    // 4. Get governance proposals
    console.log('\n4️⃣ Checking governance proposals...');
    const proposals = await nexus.getProposals();
    console.log(`✅ Found ${proposals.proposals?.length || 0} active proposals`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Example 3: Complete Asset Lifecycle
async function assetLifecycleExample() {
  console.log('\n\n🔄 Complete Asset Lifecycle Example\n');
  console.log('='.repeat(50));

  const gameSDK = new NexusGameSDK({
    apiUrl: 'http://localhost:3000/api',
    gameId: 'demo-game',
    chain: 'polygon'
  });

  const playerSDK = new NexusPlayerSDK({
    apiUrl: 'http://localhost:3000/api',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    chain: 'polygon'
  });

  try {
    // Step 1: Game creates an asset
    console.log('\n1️⃣ Game creates asset...');
    const asset = await gameSDK.registerAsset({
      name: 'Epic Battle Armor',
      creator: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      rarity: 3,
      revenueShareBps: 1000
    });
    console.log('✅ Asset created:', asset.assetId);

    // Step 2: Player lists on marketplace
    console.log('\n2️⃣ Player lists asset for sale...');
    const listing = await playerSDK.listAssetForSale(
      asset.assetId,
      '2500000000000000000' // 2.5 ETH in wei
    );
    console.log('✅ Listed for sale');

    // Step 3: Track marketplace activity
    console.log('\n3️⃣ Tracking marketplace activity...');
    await gameSDK.trackEvent({
      eventType: 'asset_listed',
      userAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
      assetId: asset.assetId,
      metadata: { price: '2.5', currency: 'ETH' }
    });
    console.log('✅ Activity tracked');

    // Step 4: Get asset with utility info
    console.log('\n4️⃣ Getting asset utility information...');
    const assetWithUtility = await playerSDK.getAssetWithUtility(asset.assetId);
    console.log('✅ Asset utilities:');
    assetWithUtility.utilities.forEach(util => {
      console.log(`   - ${util.game}: ${util.effect}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Example 4: Analytics and Optimization
async function analyticsExample() {
  console.log('\n\n📊 Analytics & Optimization Example\n');
  console.log('='.repeat(50));

  const nexus = new NexusGameSDK({
    apiUrl: 'http://localhost:3000/api',
    gameId: 'demo-game',
    chain: 'polygon'
  });

  try {
    // Track various events
    console.log('\n1️⃣ Tracking player behavior...');
    
    const events = [
      { type: 'session_start', metadata: { platform: 'web' } },
      { type: 'item_purchased', metadata: { itemId: 'sword-001', price: 9.99 } },
      { type: 'level_up', metadata: { level: 15, xp: 5000 } },
      { type: 'session_end', metadata: { duration: 3600 } }
    ];

    for (const event of events) {
      await nexus.trackEvent({
        eventType: event.type,
        userAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
        metadata: event.metadata
      });
    }
    console.log(`✅ Tracked ${events.length} events`);

    // Get optimization insights
    console.log('\n2️⃣ Getting AI optimization insights...');
    const insights = await nexus.getOptimizationInsights();
    console.log('💡 AI Recommendations:');
    if (insights.insights?.length > 0) {
      insights.insights.forEach((insight, i) => {
        console.log(`   ${i + 1}. ${insight.message} (${insight.impact})`);
      });
    } else {
      console.log('   No insights available yet');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run all examples
async function runAllExamples() {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║  Nexus GameFi Protocol - Example Application      ║');
  console.log('╚════════════════════════════════════════════════════╝');

  await gameExample();
  await playerExample();
  await assetLifecycleExample();
  await analyticsExample();

  console.log('\n\n✨ All examples completed!\n');
  console.log('For more information, see:');
  console.log('  - README.md: Getting started guide');
  console.log('  - INTEGRATION_GUIDE.md: Detailed integration examples');
  console.log('  - CONTRACTS.md: Smart contract documentation');
  console.log('\n');
}

// Run examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}

export {
  gameExample,
  playerExample,
  assetLifecycleExample,
  analyticsExample,
  runAllExamples
};
