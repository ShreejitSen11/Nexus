// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title RevenueDistributor
 * @dev Automated revenue distribution for cross-game asset usage
 */
contract RevenueDistributor is Ownable, ReentrancyGuard {
    struct RevenueShare {
        address recipient;
        uint256 shareBps;  // Basis points (100 = 1%)
    }
    
    struct RevenueRecord {
        bytes32 assetId;
        address payer;
        uint256 amount;
        uint256 timestamp;
        bool distributed;
    }
    
    // assetId => RevenueShare[]
    mapping(bytes32 => RevenueShare[]) public revenueShares;
    
    // Track all revenue records
    RevenueRecord[] public revenueRecords;
    
    // Total revenue distributed per asset
    mapping(bytes32 => uint256) public totalRevenueDistributed;
    
    // Pending withdrawals per address
    mapping(address => uint256) public pendingWithdrawals;
    
    // Protocol treasury
    address public treasury;
    uint256 public protocolFeeBps = 200; // 2%
    
    // Events
    event RevenueReceived(
        bytes32 indexed assetId,
        address indexed payer,
        uint256 amount,
        uint256 recordId
    );
    
    event RevenueDistributed(
        bytes32 indexed assetId,
        uint256 recordId,
        uint256 totalAmount
    );
    
    event PaymentWithdrawn(address indexed recipient, uint256 amount);
    
    constructor(address _treasury) Ownable(msg.sender) {
        treasury = _treasury;
    }
    
    /**
     * @dev Set revenue shares for an asset
     */
    function setRevenueShares(
        bytes32 assetId,
        address[] memory recipients,
        uint256[] memory shares
    ) external {
        require(recipients.length == shares.length, "Length mismatch");
        
        // Clear existing shares
        delete revenueShares[assetId];
        
        uint256 totalShares = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            require(shares[i] > 0, "Invalid share");
            totalShares += shares[i];
            
            revenueShares[assetId].push(RevenueShare({
                recipient: recipients[i],
                shareBps: shares[i]
            }));
        }
        
        require(totalShares <= 10000, "Shares exceed 100%");
    }
    
    /**
     * @dev Record revenue payment for asset usage
     */
    function recordRevenue(bytes32 assetId) external payable nonReentrant {
        require(msg.value > 0, "No payment");
        
        // Create revenue record
        uint256 recordId = revenueRecords.length;
        revenueRecords.push(RevenueRecord({
            assetId: assetId,
            payer: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            distributed: false
        }));
        
        emit RevenueReceived(assetId, msg.sender, msg.value, recordId);
        
        // Distribute immediately
        _distributeRevenue(recordId);
    }
    
    /**
     * @dev Internal function to distribute revenue
     */
    function _distributeRevenue(uint256 recordId) internal {
        RevenueRecord storage record = revenueRecords[recordId];
        require(!record.distributed, "Already distributed");
        
        uint256 amount = record.amount;
        bytes32 assetId = record.assetId;
        
        // Take protocol fee
        uint256 protocolFee = (amount * protocolFeeBps) / 10000;
        pendingWithdrawals[treasury] += protocolFee;
        
        uint256 remainingAmount = amount - protocolFee;
        
        // Distribute to revenue share recipients
        RevenueShare[] memory shares = revenueShares[assetId];
        for (uint256 i = 0; i < shares.length; i++) {
            uint256 shareAmount = (remainingAmount * shares[i].shareBps) / 10000;
            pendingWithdrawals[shares[i].recipient] += shareAmount;
        }
        
        record.distributed = true;
        totalRevenueDistributed[assetId] += amount;
        
        emit RevenueDistributed(assetId, recordId, amount);
    }
    
    /**
     * @dev Withdraw pending payments
     */
    function withdraw() external nonReentrant {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No pending withdrawal");
        
        pendingWithdrawals[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        
        emit PaymentWithdrawn(msg.sender, amount);
    }
    
    /**
     * @dev Get revenue shares for an asset
     */
    function getRevenueShares(bytes32 assetId) 
        external 
        view 
        returns (RevenueShare[] memory) 
    {
        return revenueShares[assetId];
    }
    
    /**
     * @dev Get total revenue records
     */
    function getTotalRevenueRecords() external view returns (uint256) {
        return revenueRecords.length;
    }
    
    /**
     * @dev Update protocol fee
     */
    function setProtocolFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 1000, "Fee too high"); // Max 10%
        protocolFeeBps = newFeeBps;
    }
    
    /**
     * @dev Update treasury
     */
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }
}
