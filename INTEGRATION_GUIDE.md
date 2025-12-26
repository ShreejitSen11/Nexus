# Nexus GameFi Protocol - Integration Examples

This guide provides practical examples for integrating with the Nexus platform.

## Table of Contents
- [Game Developer Integration](#game-developer-integration)
- [Player Wallet Integration](#player-wallet-integration)
- [Cross-Game Asset Usage](#cross-game-asset-usage)
- [Marketplace Integration](#marketplace-integration)
- [Governance Integration](#governance-integration)

---

## Game Developer Integration

### 1. Initialize the SDK

```javascript
import NexusGameSDK from 'nexus-game-sdk';

const nexus = new NexusGameSDK({
  apiUrl: 'https://api.nexus.game',
  gameId: 'your-game-id',
  apiKey: 'your-api-key',
  chain: 'polygon'
});

await nexus.initialize();
```

### 2. Register In-Game Assets

```javascript
// Register a new asset
const asset = await nexus.registerAsset({
  name: 'Dragon Blade',
  creator: '0x123...', // Your contract address
  visualDataUri: 'ipfs://...',
  rarity: 4, // Legendary
  revenueShareBps: 1000 // 10% revenue share
});

console.log('Asset registered:', asset.assetId);
```

### 3. Check Asset Ownership

```javascript
// Check if player owns an asset
const ownership = await nexus.checkAssetOwnership(
  playerAddress,
  assetId
);

if (ownership.owns) {
  console.log('Player owns the asset!');
}
```

### 4. Apply Cross-Game Effects

```javascript
// Apply asset effects in your game
const effect = await nexus.applyAssetEffect(assetId, 'rpg');

// Use the effect in your game logic
playerStats.attack *= (1 + effect.multiplier);
console.log(`Applied effect: ${effect.effect}`);
```

### 5. Track Player Events

```javascript
// Track gameplay events
await nexus.trackEvent({
  eventType: 'level_completed',
  userAddress: playerAddress,
  metadata: {
    level: 10,
    score: 1500,
    timeSpent: 300
  }
});
```

### 6. Distribute Rewards

```javascript
// Reward player for achievements
await nexus.distributeReward(
  playerAddress,
  100, // 100 tokens
  'quest_completed'
);
```

---

## Player Wallet Integration

### 1. Connect Wallet

```javascript
import NexusPlayerSDK from 'nexus-player-sdk';

const nexus = new NexusPlayerSDK({
  apiUrl: 'https://api.nexus.game',
  chain: 'polygon'
});

// Connect with MetaMask
const connection = await nexus.connectWallet(window.ethereum);
console.log('Connected:', connection.address);
```

### 2. View My Assets

```javascript
// Get all assets owned by player
const myAssets = await nexus.getMyAssets({
  page: 1,
  limit: 20
});

myAssets.assets.forEach(asset => {
  console.log(`${asset.name} - Rarity: ${asset.rarity}`);
});
```

### 3. View Asset with Cross-Game Utility

```javascript
// Get detailed asset info with utilities
const asset = await nexus.getAssetWithUtility(assetId);

console.log(`${asset.name} can be used in:`);
asset.utilities.forEach(util => {
  console.log(`- ${util.game}: ${util.effect}`);
});
```

---

## Cross-Game Asset Usage

### Example: Using Asset in Multiple Games

```javascript
// Game A - RPG
const rpgEffect = await nexus.applyAssetEffect(assetId, 'rpg');
// Result: +10% attack power

// Game B - Battle Royale
const brEffect = await nexus.applyAssetEffect(assetId, 'battleRoyale');
// Result: +5% damage

// Game C - Racing
const racingEffect = await nexus.applyAssetEffect(assetId, 'racing');
// Result: +3% speed
```

### Asset Creator Revenue

```javascript
// When asset is used in another game, creator automatically receives revenue
// No additional code needed - handled by smart contracts
```

---

## Marketplace Integration

### 1. List Asset for Sale

```javascript
// List your asset on the marketplace
const listing = await nexus.listAssetForSale(
  assetId,
  ethers.parseEther('2.5') // 2.5 ETH
);

console.log('Listed for sale:', listing.listingId);
```

### 2. List Asset for Rent

```javascript
// Rent out your asset
const rental = await nexus.listAssetForRent(
  assetId,
  ethers.parseEther('0.1'), // 0.1 ETH per day
  30 // Max 30 days
);

console.log('Listed for rent:', rental.listingId);
```

### 3. Browse Marketplace

```javascript
// Browse available assets
const listings = await nexus.browseMarketplace({
  type: 'sale',
  page: 1,
  limit: 20
});

listings.listings.forEach(listing => {
  console.log(`${listing.name} - ${listing.price} ETH`);
});
```

### 4. Buy Asset

```javascript
// Purchase an asset
const purchase = await nexus.buyAsset(listingId);
console.log('Purchase successful:', purchase.txHash);
```

### 5. Rent Asset

```javascript
// Rent an asset for 7 days
const rental = await nexus.rentAsset(listingId, 7);
console.log('Rental successful:', rental.txHash);
```

---

## Governance Integration

### 1. View Proposals

```javascript
// Get active governance proposals
const proposals = await nexus.getProposals();

proposals.forEach(proposal => {
  console.log(`${proposal.id}: ${proposal.title}`);
  console.log(`Support: ${proposal.support}%`);
});
```

### 2. Vote on Proposal

```javascript
// Vote on a proposal
const vote = await nexus.voteOnProposal(
  proposalId,
  true // true = for, false = against
);

console.log('Vote cast:', vote.votingPower);
```

---

## Advanced Examples

### Batch Operations

```javascript
// Register multiple assets at once
const assets = [
  { name: 'Sword', rarity: 3 },
  { name: 'Shield', rarity: 3 },
  { name: 'Helmet', rarity: 2 }
];

const registered = await Promise.all(
  assets.map(asset => nexus.registerAsset({
    ...asset,
    creator: creatorAddress,
    revenueShareBps: 1000
  }))
);

console.log(`Registered ${registered.length} assets`);
```

### Asset Bundle Sale

```javascript
// Create a bundle of assets
const bundle = [assetId1, assetId2, assetId3];
const bundlePrice = ethers.parseEther('5.0');

// List bundle (custom implementation)
for (const assetId of bundle) {
  await nexus.listAssetForSale(assetId, bundlePrice / bundle.length);
}
```

### Real-Time Event Tracking

```javascript
// Set up event tracking for real-time analytics
const trackGameplay = async () => {
  // Track every 5 minutes
  setInterval(async () => {
    await nexus.trackEvent({
      eventType: 'gameplay_session',
      userAddress: playerAddress,
      metadata: {
        sessionLength: 300,
        assetsUsed: [assetId1, assetId2],
        actionsPerformed: 150
      }
    });
  }, 5 * 60 * 1000);
};

trackGameplay();
```

---

## Testing Integration

### Local Development

```javascript
// Use local API for testing
const nexus = new NexusGameSDK({
  apiUrl: 'http://localhost:3000/api',
  gameId: 'test-game',
  chain: 'hardhat' // Local network
});
```

### Testnet Deployment

```javascript
// Use testnet for staging
const nexus = new NexusGameSDK({
  apiUrl: 'https://testnet-api.nexus.game',
  gameId: 'your-game-id',
  chain: 'polygon-mumbai'
});
```

---

## Error Handling

```javascript
try {
  const asset = await nexus.registerAsset(assetData);
} catch (error) {
  if (error.message.includes('already registered')) {
    console.log('Asset already exists');
  } else if (error.message.includes('insufficient balance')) {
    console.log('Not enough funds for transaction');
  } else {
    console.error('Unexpected error:', error);
  }
}
```

---

## Best Practices

1. **Cache Asset Data**: Cache frequently accessed asset metadata
2. **Batch Operations**: Combine multiple operations when possible
3. **Error Recovery**: Implement retry logic for network failures
4. **Gas Optimization**: Use appropriate gas limits and prices
5. **Security**: Validate all user inputs and wallet signatures
6. **Analytics**: Track all important events for optimization

---

## Support

- Documentation: https://docs.nexus.game
- Discord: https://discord.gg/nexus
- GitHub: https://github.com/nexus-gamefi
- Email: support@nexus.game

---

**Happy Building! 🎮**
