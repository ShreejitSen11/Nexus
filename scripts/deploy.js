/**
 * Smart Contract Deployment Script
 * Deploys all Nexus protocol contracts
 */

async function main() {
  console.log('🚀 Starting Nexus Protocol Deployment...\n');

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log('Deploying contracts with account:', deployer.address);
  console.log('Account balance:', ethers.formatEther(await ethers.provider.getBalance(deployer.address)));
  console.log('Network:', network.name, 'Chain ID:', network.chainId.toString(), '\n');

  const deployedContracts = {};

  // 1. Deploy UniversalAssetRegistry
  console.log('📦 Deploying UniversalAssetRegistry...');
  const UniversalAssetRegistry = await ethers.getContractFactory('UniversalAssetRegistry');
  const assetRegistry = await UniversalAssetRegistry.deploy();
  await assetRegistry.waitForDeployment();
  const assetRegistryAddress = await assetRegistry.getAddress();
  console.log('✅ UniversalAssetRegistry deployed to:', assetRegistryAddress, '\n');
  deployedContracts.UniversalAssetRegistry = assetRegistryAddress;

  // 2. Deploy AssetWrapper
  console.log('📦 Deploying AssetWrapper...');
  const AssetWrapper = await ethers.getContractFactory('AssetWrapper');
  const assetWrapper = await AssetWrapper.deploy(assetRegistryAddress);
  await assetWrapper.waitForDeployment();
  const assetWrapperAddress = await assetWrapper.getAddress();
  console.log('✅ AssetWrapper deployed to:', assetWrapperAddress, '\n');
  deployedContracts.AssetWrapper = assetWrapperAddress;

  // 3. Deploy Treasury (for protocol fees)
  const treasuryAddress = deployer.address; // Use deployer as treasury for now

  // 4. Deploy RevenueDistributor
  console.log('📦 Deploying RevenueDistributor...');
  const RevenueDistributor = await ethers.getContractFactory('RevenueDistributor');
  const revenueDistributor = await RevenueDistributor.deploy(treasuryAddress);
  await revenueDistributor.waitForDeployment();
  const revenueDistributorAddress = await revenueDistributor.getAddress();
  console.log('✅ RevenueDistributor deployed to:', revenueDistributorAddress, '\n');
  deployedContracts.RevenueDistributor = revenueDistributorAddress;

  // 5. Deploy Marketplace
  console.log('📦 Deploying Marketplace...');
  const Marketplace = await ethers.getContractFactory('Marketplace');
  const marketplace = await Marketplace.deploy(assetRegistryAddress, treasuryAddress);
  await marketplace.waitForDeployment();
  const marketplaceAddress = await marketplace.getAddress();
  console.log('✅ Marketplace deployed to:', marketplaceAddress, '\n');
  deployedContracts.Marketplace = marketplaceAddress;

  // 6. Deploy GameToken (template)
  console.log('📦 Deploying GameToken template...');
  const GameToken = await ethers.getContractFactory('GameToken');
  const gameToken = await GameToken.deploy(
    'Nexus Game Token',
    'NGT',
    ethers.parseEther('1000000000'), // 1 billion max supply
    ethers.parseEther('100000000'),  // 100 million initial supply
    100 // emission rate
  );
  await gameToken.waitForDeployment();
  const gameTokenAddress = await gameToken.getAddress();
  console.log('✅ GameToken deployed to:', gameTokenAddress, '\n');
  deployedContracts.GameToken = gameTokenAddress;

  // 7. Deploy GameNFT (template)
  console.log('📦 Deploying GameNFT template...');
  const GameNFT = await ethers.getContractFactory('GameNFT');
  const gameNFT = await GameNFT.deploy(
    'Nexus Game NFT',
    'NGNFT',
    10000 // max supply
  );
  await gameNFT.waitForDeployment();
  const gameNFTAddress = await gameNFT.getAddress();
  console.log('✅ GameNFT deployed to:', gameNFTAddress, '\n');
  deployedContracts.GameNFT = gameNFTAddress;

  // 8. Deploy GovernanceDAO
  console.log('📦 Deploying GovernanceDAO...');
  const GovernanceDAO = await ethers.getContractFactory('GovernanceDAO');
  const governanceDAO = await GovernanceDAO.deploy(gameTokenAddress);
  await governanceDAO.waitForDeployment();
  const governanceDAOAddress = await governanceDAO.getAddress();
  console.log('✅ GovernanceDAO deployed to:', governanceDAOAddress, '\n');
  deployedContracts.GovernanceDAO = governanceDAOAddress;

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Deployment Complete!\n');
  console.log('Deployed Contracts:');
  console.log('='.repeat(60));
  
  for (const [name, address] of Object.entries(deployedContracts)) {
    console.log(`${name.padEnd(30)} ${address}`);
  }
  
  console.log('='.repeat(60));
  console.log('\n💾 Save these addresses for your configuration!\n');

  // Save to file
  const fs = require('fs');
  const deploymentData = {
    network: network.name,
    chainId: network.chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: deployedContracts,
  };

  const filename = `deployments/deployment-${network.chainId}-${Date.now()}.json`;
  fs.mkdirSync('deployments', { recursive: true });
  fs.writeFileSync(filename, JSON.stringify(deploymentData, null, 2));
  console.log(`📄 Deployment data saved to: ${filename}\n`);

  // Verify instructions
  console.log('🔍 To verify contracts on block explorer:');
  console.log(`npx hardhat verify --network ${network.name} ${assetRegistryAddress}`);
  console.log(`npx hardhat verify --network ${network.name} ${assetWrapperAddress} ${assetRegistryAddress}`);
  console.log(`npx hardhat verify --network ${network.name} ${revenueDistributorAddress} ${treasuryAddress}`);
  console.log(`npx hardhat verify --network ${network.name} ${marketplaceAddress} ${assetRegistryAddress} ${treasuryAddress}`);
  console.log('\n');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
