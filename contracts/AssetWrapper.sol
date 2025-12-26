// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AssetWrapper
 * @dev Wraps any NFT into UniversalAssets format for cross-game composability
 */
contract AssetWrapper is Ownable, ReentrancyGuard {
    struct WrappedAsset {
        address originalContract;
        uint256 originalTokenId;
        uint8 tokenType;           // 721 or 1155
        address wrapper;
        bytes32 universalAssetId;
        bool isWrapped;
        uint256 wrapTime;
    }
    
    // Mapping from wrapped asset ID to WrappedAsset
    mapping(bytes32 => WrappedAsset) public wrappedAssets;
    
    // Mapping from original NFT to wrapped asset ID
    mapping(address => mapping(uint256 => bytes32)) public nftToWrappedId;
    
    // Track all wrapped assets
    bytes32[] public allWrappedAssets;
    
    // Reference to the registry
    address public registryAddress;
    
    // Events
    event AssetWrapped(
        bytes32 indexed wrappedId,
        address indexed originalContract,
        uint256 indexed originalTokenId,
        address wrapper
    );
    
    event AssetUnwrapped(
        bytes32 indexed wrappedId,
        address indexed recipient
    );
    
    constructor(address _registryAddress) Ownable(msg.sender) {
        registryAddress = _registryAddress;
    }
    
    /**
     * @dev Wrap an ERC721 NFT
     */
    function wrapERC721(
        address nftContract,
        uint256 tokenId,
        bytes32 universalAssetId
    ) external nonReentrant returns (bytes32) {
        require(IERC721(nftContract).ownerOf(tokenId) == msg.sender, "Not NFT owner");
        
        // Transfer NFT to this contract
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        
        // Generate wrapped asset ID
        bytes32 wrappedId = keccak256(
            abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp)
        );
        
        // Create wrapped asset
        wrappedAssets[wrappedId] = WrappedAsset({
            originalContract: nftContract,
            originalTokenId: tokenId,
            tokenType: 721,
            wrapper: msg.sender,
            universalAssetId: universalAssetId,
            isWrapped: true,
            wrapTime: block.timestamp
        });
        
        nftToWrappedId[nftContract][tokenId] = wrappedId;
        allWrappedAssets.push(wrappedId);
        
        emit AssetWrapped(wrappedId, nftContract, tokenId, msg.sender);
        
        return wrappedId;
    }
    
    /**
     * @dev Wrap an ERC1155 NFT (single token)
     */
    function wrapERC1155(
        address nftContract,
        uint256 tokenId,
        bytes32 universalAssetId
    ) external nonReentrant returns (bytes32) {
        require(
            IERC1155(nftContract).balanceOf(msg.sender, tokenId) > 0,
            "No tokens owned"
        );
        
        // Transfer 1 token to this contract
        IERC1155(nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId,
            1,
            ""
        );
        
        // Generate wrapped asset ID
        bytes32 wrappedId = keccak256(
            abi.encodePacked(nftContract, tokenId, msg.sender, block.timestamp)
        );
        
        // Create wrapped asset
        wrappedAssets[wrappedId] = WrappedAsset({
            originalContract: nftContract,
            originalTokenId: tokenId,
            tokenType: 1155,
            wrapper: msg.sender,
            universalAssetId: universalAssetId,
            isWrapped: true,
            wrapTime: block.timestamp
        });
        
        nftToWrappedId[nftContract][tokenId] = wrappedId;
        allWrappedAssets.push(wrappedId);
        
        emit AssetWrapped(wrappedId, nftContract, tokenId, msg.sender);
        
        return wrappedId;
    }
    
    /**
     * @dev Unwrap asset and return original NFT
     */
    function unwrap(bytes32 wrappedId) external nonReentrant {
        WrappedAsset storage asset = wrappedAssets[wrappedId];
        require(asset.isWrapped, "Asset not wrapped");
        require(asset.wrapper == msg.sender, "Not wrapper");
        
        // Mark as unwrapped
        asset.isWrapped = false;
        
        // Return original NFT
        if (asset.tokenType == 721) {
            IERC721(asset.originalContract).transferFrom(
                address(this),
                msg.sender,
                asset.originalTokenId
            );
        } else if (asset.tokenType == 1155) {
            IERC1155(asset.originalContract).safeTransferFrom(
                address(this),
                msg.sender,
                asset.originalTokenId,
                1,
                ""
            );
        }
        
        emit AssetUnwrapped(wrappedId, msg.sender);
    }
    
    /**
     * @dev Get wrapped asset details
     */
    function getWrappedAsset(bytes32 wrappedId)
        external
        view
        returns (WrappedAsset memory)
    {
        return wrappedAssets[wrappedId];
    }
    
    /**
     * @dev Check if NFT is wrapped
     */
    function isNFTWrapped(address nftContract, uint256 tokenId)
        external
        view
        returns (bool)
    {
        bytes32 wrappedId = nftToWrappedId[nftContract][tokenId];
        return wrappedAssets[wrappedId].isWrapped;
    }
    
    /**
     * @dev Get total wrapped assets
     */
    function getTotalWrapped() external view returns (uint256) {
        return allWrappedAssets.length;
    }
    
    /**
     * @dev Update registry address
     */
    function setRegistryAddress(address _registryAddress) external onlyOwner {
        registryAddress = _registryAddress;
    }
    
    // Required for receiving ERC721
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
    // Required for receiving ERC1155
    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return this.onERC1155Received.selector;
    }
}
