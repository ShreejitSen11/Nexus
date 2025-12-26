// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameNFT
 * @dev Template ERC-721 NFT for in-game assets
 */
contract GameNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public maxSupply;
    
    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply
    ) ERC721(name, symbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;
    }
    
    /**
     * @dev Mint NFT with metadata URI
     */
    function mint(address to, string memory uri) external returns (uint256) {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized");
        require(maxSupply == 0 || _nextTokenId < maxSupply, "Max supply reached");
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        return tokenId;
    }
    
    /**
     * @dev Batch mint NFTs
     */
    function batchMint(
        address[] memory recipients,
        string[] memory uris
    ) external returns (uint256[] memory) {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized");
        require(recipients.length == uris.length, "Length mismatch");
        
        uint256[] memory tokenIds = new uint256[](recipients.length);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(maxSupply == 0 || _nextTokenId < maxSupply, "Max supply reached");
            uint256 tokenId = _nextTokenId++;
            _safeMint(recipients[i], tokenId);
            _setTokenURI(tokenId, uris[i]);
            tokenIds[i] = tokenId;
        }
        
        return tokenIds;
    }
    
    /**
     * @dev Add minter
     */
    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }
    
    /**
     * @dev Remove minter
     */
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }
    
    // Required overrides
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
