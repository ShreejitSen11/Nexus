// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title GameToken
 * @dev Template ERC-20 token for game economies
 */
contract GameToken is ERC20, Ownable {
    uint256 public immutable maxSupply;
    uint256 public emissionRate;
    
    mapping(address => bool) public minters;
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event EmissionRateUpdated(uint256 newRate);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        uint256 _initialSupply,
        uint256 _emissionRate
    ) ERC20(name, symbol) Ownable(msg.sender) {
        require(_maxSupply > 0, "Invalid max supply");
        maxSupply = _maxSupply;
        emissionRate = _emissionRate;
        
        if (_initialSupply > 0) {
            require(_initialSupply <= _maxSupply, "Initial > max");
            _mint(msg.sender, _initialSupply);
        }
    }
    
    /**
     * @dev Mint tokens (only minters)
     */
    function mint(address to, uint256 amount) external {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized");
        require(totalSupply() + amount <= maxSupply, "Exceeds max supply");
        _mint(to, amount);
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
    
    /**
     * @dev Update emission rate
     */
    function setEmissionRate(uint256 newRate) external onlyOwner {
        emissionRate = newRate;
        emit EmissionRateUpdated(newRate);
    }
}
