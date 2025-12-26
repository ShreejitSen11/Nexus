// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title Marketplace
 * @dev Cross-game marketplace for asset trading, rental, and lending
 */
contract Marketplace is Ownable, ReentrancyGuard, Pausable {
    enum ListingType { SALE, RENT, LEND, AUCTION }
    
    struct Listing {
        bytes32 assetId;
        address seller;
        uint256 price;
        ListingType listingType;
        uint256 duration;        // For rentals/lending (in seconds)
        bool isActive;
        uint256 createdAt;
        uint256 expiresAt;
    }
    
    struct Rental {
        bytes32 assetId;
        address renter;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
    }
    
    // listingId => Listing
    mapping(bytes32 => Listing) public listings;
    
    // rentalId => Rental
    mapping(bytes32 => Rental) public rentals;
    
    // Asset registry reference
    address public registryAddress;
    
    // Marketplace fee (in basis points)
    uint256 public marketplaceFeeBps = 300; // 3%
    
    // Protocol treasury
    address public treasury;
    
    // Events
    event AssetListed(
        bytes32 indexed listingId,
        bytes32 indexed assetId,
        address indexed seller,
        uint256 price,
        ListingType listingType
    );
    
    event AssetSold(
        bytes32 indexed listingId,
        address indexed buyer,
        uint256 price
    );
    
    event AssetRented(
        bytes32 indexed rentalId,
        bytes32 indexed assetId,
        address indexed renter,
        uint256 duration
    );
    
    event RentalEnded(bytes32 indexed rentalId);
    event ListingCancelled(bytes32 indexed listingId);
    
    constructor(address _registryAddress, address _treasury) Ownable(msg.sender) {
        registryAddress = _registryAddress;
        treasury = _treasury;
    }
    
    /**
     * @dev List asset for sale
     */
    function listForSale(
        bytes32 assetId,
        uint256 price
    ) external whenNotPaused returns (bytes32) {
        require(price > 0, "Invalid price");
        
        bytes32 listingId = keccak256(
            abi.encodePacked(assetId, msg.sender, block.timestamp)
        );
        
        listings[listingId] = Listing({
            assetId: assetId,
            seller: msg.sender,
            price: price,
            listingType: ListingType.SALE,
            duration: 0,
            isActive: true,
            createdAt: block.timestamp,
            expiresAt: 0
        });
        
        emit AssetListed(listingId, assetId, msg.sender, price, ListingType.SALE);
        
        return listingId;
    }
    
    /**
     * @dev List asset for rent
     */
    function listForRent(
        bytes32 assetId,
        uint256 pricePerDay,
        uint256 maxDuration
    ) external whenNotPaused returns (bytes32) {
        require(pricePerDay > 0, "Invalid price");
        require(maxDuration > 0, "Invalid duration");
        
        bytes32 listingId = keccak256(
            abi.encodePacked(assetId, msg.sender, block.timestamp)
        );
        
        listings[listingId] = Listing({
            assetId: assetId,
            seller: msg.sender,
            price: pricePerDay,
            listingType: ListingType.RENT,
            duration: maxDuration,
            isActive: true,
            createdAt: block.timestamp,
            expiresAt: 0
        });
        
        emit AssetListed(listingId, assetId, msg.sender, pricePerDay, ListingType.RENT);
        
        return listingId;
    }
    
    /**
     * @dev Buy listed asset
     */
    function buyAsset(bytes32 listingId) external payable nonReentrant whenNotPaused {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(listing.listingType == ListingType.SALE, "Not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        
        // Calculate fees
        uint256 fee = (listing.price * marketplaceFeeBps) / 10000;
        uint256 sellerAmount = listing.price - fee;
        
        // Mark as sold
        listing.isActive = false;
        
        // Transfer funds
        payable(treasury).transfer(fee);
        payable(listing.seller).transfer(sellerAmount);
        
        // Refund excess
        if (msg.value > listing.price) {
            payable(msg.sender).transfer(msg.value - listing.price);
        }
        
        emit AssetSold(listingId, msg.sender, listing.price);
    }
    
    /**
     * @dev Rent asset
     */
    function rentAsset(
        bytes32 listingId,
        uint256 durationDays
    ) external payable nonReentrant whenNotPaused returns (bytes32) {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing not active");
        require(listing.listingType == ListingType.RENT, "Not for rent");
        require(durationDays > 0 && durationDays <= listing.duration, "Invalid duration");
        
        uint256 totalPrice = listing.price * durationDays;
        require(msg.value >= totalPrice, "Insufficient payment");
        
        // Calculate fees
        uint256 fee = (totalPrice * marketplaceFeeBps) / 10000;
        uint256 ownerAmount = totalPrice - fee;
        
        // Create rental
        bytes32 rentalId = keccak256(
            abi.encodePacked(listing.assetId, msg.sender, block.timestamp)
        );
        
        uint256 duration = durationDays * 1 days;
        rentals[rentalId] = Rental({
            assetId: listing.assetId,
            renter: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            isActive: true
        });
        
        // Transfer funds
        payable(treasury).transfer(fee);
        payable(listing.seller).transfer(ownerAmount);
        
        // Refund excess
        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        
        emit AssetRented(rentalId, listing.assetId, msg.sender, duration);
        
        return rentalId;
    }
    
    /**
     * @dev Cancel listing
     */
    function cancelListing(bytes32 listingId) external {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.isActive, "Listing not active");
        
        listing.isActive = false;
        
        emit ListingCancelled(listingId);
    }
    
    /**
     * @dev End rental (anyone can call after expiry)
     */
    function endRental(bytes32 rentalId) external {
        Rental storage rental = rentals[rentalId];
        require(rental.isActive, "Rental not active");
        require(block.timestamp >= rental.endTime, "Rental not expired");
        
        rental.isActive = false;
        
        emit RentalEnded(rentalId);
    }
    
    /**
     * @dev Get listing details
     */
    function getListing(bytes32 listingId) external view returns (Listing memory) {
        return listings[listingId];
    }
    
    /**
     * @dev Get rental details
     */
    function getRental(bytes32 rentalId) external view returns (Rental memory) {
        return rentals[rentalId];
    }
    
    /**
     * @dev Update marketplace fee
     */
    function setMarketplaceFee(uint256 newFeeBps) external onlyOwner {
        require(newFeeBps <= 500, "Fee too high"); // Max 5%
        marketplaceFeeBps = newFeeBps;
    }
    
    /**
     * @dev Update treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }
    
    /**
     * @dev Pause marketplace
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause marketplace
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
