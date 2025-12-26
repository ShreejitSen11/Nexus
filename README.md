# Nexus GameFi Protocol

> **Unified Esports/Gaming Blockchain Platform** combining Cross-Game Asset Composability Protocol (UniversalAssets) and Decentralized Game Launcher (GameFi OS)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![Solidity](https://img.shields.io/badge/solidity-0.8.20-blue.svg)](https://soliditylang.org/)

## 🎯 Overview

Nexus is a production-ready, enterprise-grade blockchain platform that enables:

- **🎮 Cross-Game Asset Composability**: Use your assets across multiple games with automated revenue sharing
- **🚀 One-Click Game Deployment**: Deploy Web3 games with pre-audited smart contracts
- **🤖 AI Revenue Optimization**: Machine learning-powered revenue and engagement optimization
- **⚖️ Decentralized Governance**: Community-driven protocol upgrades and decision-making
- **💰 Multi-Chain Support**: Works on Ethereum, Polygon, Arbitrum, Optimism, Base, and more

## 🏗️ Architecture

### Smart Contracts (Solidity)

```
contracts/
├── UniversalAssetRegistry.sol    # Core asset registration & permissions
├── AssetWrapper.sol              # NFT wrapping for cross-game use
├── Marketplace.sol               # Trading, rental, and lending
├── RevenueDistributor.sol        # Automated revenue distribution
├── GameToken.sol                 # ERC-20 template for game economies
├── GameNFT.sol                   # ERC-721 template for in-game assets
└── GovernanceDAO.sol             # Decentralized governance
```

### Backend (Node.js + Express)

```
src/
├── core/
│   ├── blockchain/              # Multi-chain blockchain interaction (ethers.js)
│   ├── ipfs/                    # Decentralized storage
│   └── database/                # SQLite caching/indexing
├── universal-assets/
│   ├── registry/                # Asset registration system
│   ├── wrapper/                 # Asset wrapping logic
│   ├── marketplace/             # Trading & rental system
│   └── revenue/                 # Revenue tracking & distribution
├── gamefi-os/
│   ├── templates/               # Smart contract templates
│   ├── deployer/                # One-click deployment
│   ├── analytics/               # Player analytics
│   └── governance/              # DAO systems
└── api/
    └── rest/                    # RESTful API endpoints
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ShreejitSen11/Nexus.git
cd Nexus

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Configuration

Edit `.env` file with your settings:

```env
# Blockchain RPCs (use free tier from Alchemy/Infura)
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY

# IPFS (use free tier from Pinata)
PINATA_API_KEY=your_key
PINATA_SECRET_KEY=your_secret

# Database
DATABASE_PATH=./data/nexus.db

# API
PORT=3000
```

### Running the Platform

```bash
# Start the server
npm start

# Development mode with auto-reload
npm run dev

# Compile smart contracts
npm run compile-contracts
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Assets API

#### List Assets
```bash
GET /api/assets?page=1&limit=20&chain=polygon
```

#### Get Asset
```bash
GET /api/assets/:id
```

#### Register Asset
```bash
POST /api/assets
Content-Type: application/json

{
  "name": "Dragon Blade",
  "creator": "0x123...",
  "rarity": 4,
  "revenueShareBps": 1000,
  "chain": "polygon"
}
```

#### Wrap NFT
```bash
POST /api/assets/wrap
Content-Type: application/json

{
  "nftContract": "0x456...",
  "tokenId": "123",
  "universalAssetId": "0x789...",
  "tokenType": 721,
  "chain": "polygon"
}
```

### Games API

#### List Games
```bash
GET /api/games?page=1&limit=20
```

#### Register Game
```bash
POST /api/games
Content-Type: application/json

{
  "name": "Epic Battle Royale",
  "creator": "0x123...",
  "chain": "polygon"
}
```

### Marketplace API

#### List Listings
```bash
GET /api/marketplace/listings?type=sale&active=true
```

#### Create Listing
```bash
POST /api/marketplace/listings
Content-Type: application/json

{
  "assetId": "0x123...",
  "seller": "0x456...",
  "price": "1000000000000000000",
  "listingType": "sale",
  "chain": "polygon"
}
```

### Analytics API

#### Track Event
```bash
POST /api/analytics/events
Content-Type: application/json

{
  "eventType": "asset_used",
  "userAddress": "0x123...",
  "assetId": "0x456...",
  "metadata": {}
}
```

#### Get Statistics
```bash
GET /api/analytics/stats
```

## 🔧 Smart Contract Deployment

### Compile Contracts

```bash
npm run compile-contracts
```

### Deploy to Network

```bash
# Deploy to local Hardhat network
npx hardhat run scripts/deploy.js --network hardhat

# Deploy to Polygon testnet
npx hardhat run scripts/deploy.js --network polygon

# Deploy to Ethereum mainnet
npx hardhat run scripts/deploy.js --network ethereum
```

## 🎮 Features

### UniversalAssets Protocol

- ✅ **Asset Registry**: Register NFTs with cross-game compatibility
- ✅ **Asset Wrapper**: Wrap any ERC-721/ERC-1155 NFT
- ✅ **Cross-Game Utility**: Define how assets work across games
- ✅ **Marketplace**: Buy, sell, rent, and lend assets
- ✅ **Revenue Distribution**: Automated creator payments
- ✅ **Enterprise Licensing**: Bulk licensing for institutions

### GameFi OS

- ✅ **Smart Contract Templates**: Pre-audited ERC-20 and ERC-721 templates
- ✅ **One-Click Deployment**: Deploy games with minimal configuration
- ✅ **Multi-Chain Support**: Deploy to any EVM-compatible chain
- ✅ **Analytics Dashboard**: Track player engagement and revenue
- ✅ **AI Optimization**: ML-powered revenue recommendations
- ✅ **DAO Governance**: Community-driven protocol decisions

## 🧪 Testing

```bash
# Run tests
npm test

# Test smart contracts
npm run test-contracts

# Coverage report
npm run coverage
```

## 🛠️ Technology Stack

- **Runtime**: Node.js 18+
- **Language**: JavaScript (ES6+ modules)
- **Blockchain**: ethers.js v6
- **Smart Contracts**: Solidity 0.8.20 + OpenZeppelin
- **Storage**: IPFS (via Pinata/Infura)
- **Database**: SQLite (better-sqlite3)
- **API**: Express.js + RESTful
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest + Hardhat

## 🔒 Security

- ✅ All smart contracts use OpenZeppelin base contracts
- ✅ ReentrancyGuard on critical functions
- ✅ Access control with Ownable pattern
- ✅ Pausable contracts for emergency stops
- ✅ Input validation and sanitization
- ✅ Rate limiting on API endpoints
- ✅ Helmet.js for HTTP security headers

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 🔗 Links

- **Documentation**: Coming soon
- **Discord**: Coming soon
- **Twitter**: Coming soon
- **Website**: Coming soon

## 💡 Use Cases

### For Game Developers
- Deploy Web3 games without smart contract expertise
- Leverage cross-game assets for increased player engagement
- Automated revenue optimization with AI

### For Players
- Own and trade in-game assets across multiple games
- Rent out assets when not playing
- Earn from asset appreciation and utility

### For Enterprises
- License gaming IP for marketing campaigns
- Sponsor tournaments with asset licensing
- Create branded in-game items

## 🚧 Roadmap

- [x] Phase 1: Core Infrastructure
- [x] Phase 2: UniversalAssets Protocol
- [x] Phase 3: Smart Contracts
- [x] Phase 4: REST API
- [ ] Phase 5: GraphQL API
- [ ] Phase 6: WebSocket Real-time Updates
- [ ] Phase 7: AI Revenue Optimizer ML Models
- [ ] Phase 8: Unity/Unreal SDKs
- [ ] Phase 9: Frontend Dashboard
- [ ] Phase 10: Mainnet Deployment

---

**Built with ❤️ for the Web3 Gaming Community**
