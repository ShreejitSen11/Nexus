// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title GovernanceDAO
 * @dev Decentralized governance for protocol decisions
 */
contract GovernanceDAO is Ownable, ReentrancyGuard {
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool cancelled;
        mapping(address => bool) hasVoted;
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    
    uint256 public votingPeriod = 7 days;
    uint256 public quorumPercentage = 10; // 10%
    uint256 public proposalThreshold = 1000 ether; // Tokens needed to propose
    
    address public governanceToken;
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        bool support,
        uint256 weight
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    
    constructor(address _governanceToken) Ownable(msg.sender) {
        governanceToken = _governanceToken;
    }
    
    /**
     * @dev Create a new proposal
     */
    function propose(
        string memory title,
        string memory description
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Empty title");
        
        uint256 proposalId = proposalCount++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + votingPeriod;
        
        emit ProposalCreated(proposalId, msg.sender, title);
        
        return proposalId;
    }
    
    /**
     * @dev Cast vote on proposal
     */
    function castVote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        // For simplicity, using 1 vote per address
        // In production, weight by token balance
        uint256 weight = 1;
        
        if (support) {
            proposal.forVotes += weight;
        } else {
            proposal.againstVotes += weight;
        }
        
        proposal.hasVoted[msg.sender] = true;
        
        emit VoteCast(proposalId, msg.sender, support, weight);
    }
    
    /**
     * @dev Execute proposal
     */
    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp > proposal.endTime, "Voting not ended");
        require(!proposal.executed, "Already executed");
        require(!proposal.cancelled, "Proposal cancelled");
        require(proposal.forVotes > proposal.againstVotes, "Not passed");
        
        proposal.executed = true;
        
        emit ProposalExecuted(proposalId);
    }
    
    /**
     * @dev Cancel proposal
     */
    function cancelProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(
            msg.sender == proposal.proposer || msg.sender == owner(),
            "Not authorized"
        );
        require(!proposal.executed, "Already executed");
        
        proposal.cancelled = true;
        
        emit ProposalCancelled(proposalId);
    }
    
    /**
     * @dev Get proposal state
     */
    function getProposal(uint256 proposalId)
        external
        view
        returns (
            uint256 id,
            address proposer,
            string memory title,
            string memory description,
            uint256 forVotes,
            uint256 againstVotes,
            uint256 startTime,
            uint256 endTime,
            bool executed,
            bool cancelled
        )
    {
        Proposal storage p = proposals[proposalId];
        return (
            p.id,
            p.proposer,
            p.title,
            p.description,
            p.forVotes,
            p.againstVotes,
            p.startTime,
            p.endTime,
            p.executed,
            p.cancelled
        );
    }
    
    /**
     * @dev Update voting period
     */
    function setVotingPeriod(uint256 newPeriod) external onlyOwner {
        votingPeriod = newPeriod;
    }
    
    /**
     * @dev Update quorum percentage
     */
    function setQuorumPercentage(uint256 newPercentage) external onlyOwner {
        require(newPercentage <= 100, "Invalid percentage");
        quorumPercentage = newPercentage;
    }
}
