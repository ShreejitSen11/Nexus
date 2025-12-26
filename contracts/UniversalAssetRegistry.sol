// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title UniversalAssetRegistry
 * @dev Core registry for cross-game asset composability
 * Allows game creators to register NFTs for interoperability
 */
contract UniversalAssetRegistry is Ownable, ReentrancyGuard, Pausable {
    struct AssetMetadata {
        string name;
        string visualDataURI;      // IPFS hash for art/3D models
        string[] traits;            // Asset traits/attributes
        uint256 rarity;             // 1=Common, 2=Rare, 3=Epic, 4=Legendary
        address creator;            // Original creator address
        uint256 revenueShareBps;    // Revenue share in basis points (100 = 1%)
        bool isActive;              // Asset status
        uint256 registrationTime;
    }

    struct GamePermissions {
        bool isWhitelisted;
        bool isBlacklisted;
        uint256 licenseFeeBps;      // Per-use fee in basis points
    }

    // assetId => AssetMetadata
    mapping(bytes32 => AssetMetadata) public assets;
    
    // assetId => gameAddress => GamePermissions
    mapping(bytes32 => mapping(address => GamePermissions)) public gamePermissions;
    
    // Track registered assets
    bytes32[] public registeredAssets;
    
    // Protocol fee (in basis points, 100 = 1%)
    uint256 public protocolFeeBps = 200; // 2%
    
    // Events
    event AssetRegistered(
        bytes32 indexed assetId,
        address indexed creator,
        string name,
        uint256 revenueShareBps
    );
    
    event AssetUpdated(bytes32 indexed assetId);
    event GameWhitelisted(bytes32 indexed assetId, address indexed gameAddress);
    event GameBlacklisted(bytes32 indexed assetId, address indexed gameAddress);
    event ProtocolFeeUpdated(uint256 newFeeBps);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Register a new asset for cross-game composability
     */
    function registerAsset(
        bytes32 assetId,
        string memory name,
        string memory visualDataURI,
        string[] memory traits,
        uint256 rarity,
        uint256 revenueShareBps
    ) external whenNotPaused {
        require(assets[assetId].creator == address(0), "Asset already registered");
        require(revenueShareBps <= 10000, "Invalid revenue share");
        require(rarity >= 1 && rarity <= 4, "Invalid rarity");
        
        assets[assetId] = AssetMetadata({
            name: name,
            visualDataURI: visualDataURI,
            traits: traits,
            rarity: rarity,
            creator: msg.sender,
            revenueShareBps: revenueShareBps,
            isActive: true,
            registrationTime: block.timestamp
        });
        
        registeredAssets.push(assetId);
        
        emit AssetRegistered(assetId, msg.sender, name, revenueShareBps);
    }
    
    /**
     * @dev Update asset metadata (only creator)
     */
    function updateAsset(
        bytes32 assetId,
        string memory visualDataURI,
        string[] memory traits
    ) external {
        AssetMetadata storage asset = assets[assetId];
        require(asset.creator == msg.sender, "Not asset creator");
        
        asset.visualDataURI = visualDataURI;
        asset.traits = traits;
        
        emit AssetUpdated(assetId);
    }
    
    /**
     * @dev Whitelist a game to use the asset
     */
    function whitelistGame(
        bytes32 assetId,
        address gameAddress,
        uint256 licenseFeeBps
    ) external {
        require(assets[assetId].creator == msg.sender, "Not asset creator");
        require(licenseFeeBps <= 10000, "Invalid fee");
        
        gamePermissions[assetId][gameAddress] = GamePermissions({
            isWhitelisted: true,
            isBlacklisted: false,
            licenseFeeBps: licenseFeeBps
        });
        
        emit GameWhitelisted(assetId, gameAddress);
    }
    
    /**
     * @dev Blacklist a game from using the asset
     */
    function blacklistGame(bytes32 assetId, address gameAddress) external {
        require(assets[assetId].creator == msg.sender, "Not asset creator");
        
        gamePermissions[assetId][gameAddress].isBlacklisted = true;
        
        emit GameBlacklisted(assetId, gameAddress);
    }
    
    /**
     * @dev Check if a game can use an asset
     */
    function canGameUseAsset(bytes32 assetId, address gameAddress) 
        external 
        view 
        returns (bool) 
    {
        if (!assets[assetId].isActive) return false;
        
        GamePermissions memory perms = gamePermissions[assetId][gameAddress];
        
        // Blacklisted games cannot use the asset
        if (perms.isBlacklisted) return false;
        
        // If game is explicitly whitelisted, allow
        if (perms.isWhitelisted) return true;
        
        // By default, allow all games (open access model)
        // Asset creators can restrict by whitelisting specific games
        return true;
    }
    
    /**
     * @dev Get asset metadata
     */
    function getAsset(bytes32 assetId) 
        external 
        view 
        returns (AssetMetadata memory) 
    {
        return assets[assetId];
    }
    
    /**
     * @dev Get total registered assets
     */
    function getTotalAssets() external view returns (uint256) {
        return registeredAssets.length;
    }
    
    /**
     * @dev Update protocol fee (owner only)
     */
    function setProtocolFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "Fee too high"); // Max 10%
        protocolFeeBps = newFeeBps;
        emit ProtocolFeeUpdated(newFeeBps);
    }
    
    /**
     * @dev Pause contract (emergency)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
