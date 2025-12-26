# Smart Contracts Documentation

## Overview

The Nexus GameFi Protocol consists of 7 core smart contracts that enable cross-game asset composability and decentralized game launching.

## Contracts

### 1. UniversalAssetRegistry.sol

**Purpose**: Core registry for cross-game asset composability

**Key Functions**:
- `registerAsset()`: Register a new asset with metadata
- `getAsset()`: Retrieve asset information
- `whitelistGame()`: Allow specific games to use the asset
- `blacklistGame()`: Prevent specific games from using the asset
- `canGameUseAsset()`: Check if a game has permission to use an asset

**Events**:
- `AssetRegistered`: Emitted when a new asset is registered
- `GameWhitelisted`: Emitted when a game is whitelisted
- `GameBlacklisted`: Emitted when a game is blacklisted

**Security Features**:
- ReentrancyGuard on critical functions
- Pausable for emergency stops
- Access control for asset creators

---

### 2. AssetWrapper.sol

**Purpose**: Wraps ERC-721 and ERC-1155 NFTs into UniversalAssets format

**Key Functions**:
- `wrapERC721()`: Wrap an ERC-721 NFT
- `wrapERC1155()`: Wrap an ERC-1155 NFT
- `unwrap()`: Return the original NFT to the wrapper
- `getWrappedAsset()`: Get details about a wrapped asset

**Events**:
- `AssetWrapped`: Emitted when an NFT is wrapped
- `AssetUnwrapped`: Emitted when an NFT is unwrapped

**Security Features**:
- Secure custody of original NFTs
- Only wrapper can unwrap assets
- Proper ERC-721/1155 receiver implementation

---

### 3. Marketplace.sol

**Purpose**: Cross-game marketplace for trading and renting assets

**Key Functions**:
- `listForSale()`: List an asset for sale
- `listForRent()`: List an asset for rent
- `buyAsset()`: Purchase a listed asset
- `rentAsset()`: Rent an asset for a duration
- `cancelListing()`: Cancel an active listing
- `endRental()`: End an expired rental

**Revenue Model**:
- Configurable marketplace fee (default 3%)
- Automatic fee distribution to treasury
- Refund excess payments

**Events**:
- `AssetListed`: New listing created
- `AssetSold`: Asset purchased
- `AssetRented`: Asset rented
- `RentalEnded`: Rental period ended

---

### 4. RevenueDistributor.sol

**Purpose**: Automated revenue distribution for cross-game asset usage

**Key Functions**:
- `setRevenueShares()`: Configure revenue shares for an asset
- `recordRevenue()`: Record revenue from asset usage
- `withdraw()`: Withdraw pending payments
- `getRevenueShares()`: View revenue share configuration

**Revenue Flow**:
1. Game pays for asset usage
2. Protocol fee deducted (default 2%)
3. Remaining amount distributed to revenue share recipients
4. Recipients can withdraw their shares

**Events**:
- `RevenueReceived`: Revenue payment recorded
- `RevenueDistributed`: Revenue distributed to recipients
- `PaymentWithdrawn`: Recipient withdrew their share

---

### 5. GameToken.sol

**Purpose**: ERC-20 template for game economies

**Key Functions**:
- `mint()`: Mint new tokens (authorized minters only)
- `addMinter()`: Add a new minter address
- `removeMinter()`: Remove a minter address
- `setEmissionRate()`: Update token emission rate

**Features**:
- Capped supply (defined at deployment)
- Configurable emission rate
- Multiple authorized minters
- Standard ERC-20 functionality

**Use Cases**:
- Play-to-earn rewards
- In-game currency
- Governance tokens

---

### 6. GameNFT.sol

**Purpose**: ERC-721 template for in-game assets

**Key Functions**:
- `mint()`: Mint a new NFT with metadata URI
- `batchMint()`: Mint multiple NFTs at once
- `addMinter()`: Add a new minter address
- `removeMinter()`: Remove a minter address

**Features**:
- Optional max supply cap
- Metadata URI storage
- Multiple authorized minters
- Standard ERC-721 functionality

**Use Cases**:
- In-game items
- Character skins
- Limited edition collectibles

---

### 7. GovernanceDAO.sol

**Purpose**: Decentralized governance for protocol decisions

**Key Functions**:
- `propose()`: Create a new proposal
- `castVote()`: Vote on a proposal
- `executeProposal()`: Execute a passed proposal
- `cancelProposal()`: Cancel a proposal

**Governance Parameters**:
- Voting period: 7 days (configurable)
- Quorum: 10% (configurable)
- Proposal threshold: 1000 tokens (configurable)

**Events**:
- `ProposalCreated`: New proposal created
- `VoteCast`: Vote cast on a proposal
- `ProposalExecuted`: Proposal executed

---

## Deployment

### Prerequisites

```bash
npm install
```

### Compile Contracts

```bash
npm run compile-contracts
```

### Deploy

```bash
# Local Hardhat network
npx hardhat run scripts/deploy.js --network hardhat

# Polygon Mumbai (testnet)
npx hardhat run scripts/deploy.js --network polygon-mumbai

# Polygon mainnet
npx hardhat run scripts/deploy.js --network polygon
```

### Verify on Block Explorer

```bash
npx hardhat verify --network polygon <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

---

## Gas Optimization

All contracts are optimized for gas efficiency:
- Solidity 0.8.20 with optimizer enabled (200 runs)
- Minimal storage operations
- Efficient data structures
- Batch operations where possible

---

## Security Considerations

1. **Access Control**: Only authorized addresses can perform critical operations
2. **Reentrancy Protection**: ReentrancyGuard on all payable functions
3. **Pausability**: Contracts can be paused in emergencies
4. **Input Validation**: All inputs are validated
5. **OpenZeppelin Base**: Built on battle-tested OpenZeppelin contracts

---

## Upgradeability

The current contracts are **non-upgradeable** for security and trust.

Future versions may implement:
- Transparent proxy pattern
- UUPS upgradeable pattern
- Beacon proxy for template contracts

---

## Testing

```bash
# Run all tests
npm run test-contracts

# Run with coverage
npm run coverage

# Run specific test file
npx hardhat test test/contracts/UniversalAssetRegistry.test.js
```

---

## Auditing

Before mainnet deployment:
1. Internal code review ✓
2. Static analysis (Slither, Mythril)
3. Professional audit (recommended)
4. Bug bounty program
5. Gradual rollout with limits

---

## Contract Addresses

### Polygon Mainnet (Production)
- Coming soon after audit

### Polygon Mumbai (Testnet)
- Coming soon

### Hardhat Local
- Run `npm run compile-contracts && npx hardhat run scripts/deploy.js`

---

## License

MIT License - See LICENSE file for details
