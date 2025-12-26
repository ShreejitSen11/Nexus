/**
 * Blockchain Interaction Layer
 * Provides abstraction for multi-chain operations using ethers.js
 */

import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

class BlockchainService {
  constructor() {
    this.providers = {};
    this.signers = {};
    this.initializeProviders();
  }

  /**
   * Initialize providers for all supported chains
   */
  initializeProviders() {
    const chains = {
      ethereum: process.env.ETHEREUM_RPC_URL,
      polygon: process.env.POLYGON_RPC_URL,
      arbitrum: process.env.ARBITRUM_RPC_URL,
      optimism: process.env.OPTIMISM_RPC_URL,
      base: process.env.BASE_RPC_URL,
    };

    for (const [chain, rpcUrl] of Object.entries(chains)) {
      if (rpcUrl) {
        this.providers[chain] = new ethers.JsonRpcProvider(rpcUrl);
        
        // Initialize signer if private key is available
        if (process.env.DEPLOYER_PRIVATE_KEY) {
          this.signers[chain] = new ethers.Wallet(
            process.env.DEPLOYER_PRIVATE_KEY,
            this.providers[chain]
          );
        }
      }
    }
  }

  /**
   * Get provider for a specific chain
   */
  getProvider(chain) {
    if (!this.providers[chain]) {
      throw new Error(`Provider not configured for chain: ${chain}`);
    }
    return this.providers[chain];
  }

  /**
   * Get signer for a specific chain
   */
  getSigner(chain) {
    if (!this.signers[chain]) {
      throw new Error(`Signer not configured for chain: ${chain}`);
    }
    return this.signers[chain];
  }

  /**
   * Get contract instance
   */
  getContract(address, abi, chain, useSigner = false) {
    const providerOrSigner = useSigner 
      ? this.getSigner(chain) 
      : this.getProvider(chain);
    
    return new ethers.Contract(address, abi, providerOrSigner);
  }

  /**
   * Get current block number
   */
  async getBlockNumber(chain) {
    const provider = this.getProvider(chain);
    return await provider.getBlockNumber();
  }

  /**
   * Get gas price
   */
  async getGasPrice(chain) {
    const provider = this.getProvider(chain);
    const feeData = await provider.getFeeData();
    return feeData.gasPrice;
  }

  /**
   * Get transaction receipt
   */
  async getTransactionReceipt(txHash, chain) {
    const provider = this.getProvider(chain);
    return await provider.getTransactionReceipt(txHash);
  }

  /**
   * Wait for transaction confirmation
   */
  async waitForTransaction(txHash, chain, confirmations = 1) {
    const provider = this.getProvider(chain);
    return await provider.waitForTransaction(txHash, confirmations);
  }

  /**
   * Estimate gas for transaction
   */
  async estimateGas(transaction, chain) {
    const provider = this.getProvider(chain);
    return await provider.estimateGas(transaction);
  }

  /**
   * Get balance of address
   */
  async getBalance(address, chain) {
    const provider = this.getProvider(chain);
    return await provider.getBalance(address);
  }

  /**
   * Send transaction
   */
  async sendTransaction(transaction, chain) {
    const signer = this.getSigner(chain);
    const tx = await signer.sendTransaction(transaction);
    return await tx.wait();
  }

  /**
   * Deploy contract
   */
  async deployContract(abi, bytecode, args, chain) {
    const signer = this.getSigner(chain);
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...args);
    await contract.waitForDeployment();
    return contract;
  }

  /**
   * Listen to contract events
   */
  listenToEvents(contract, eventName, callback) {
    contract.on(eventName, callback);
  }

  /**
   * Get past events
   */
  async getPastEvents(contract, eventName, fromBlock, toBlock) {
    // Validate event exists as a function
    if (typeof contract.filters[eventName] !== 'function') {
      throw new Error(`Event '${eventName}' not found in contract`);
    }
    
    const filter = contract.filters[eventName]();
    return await contract.queryFilter(filter, fromBlock, toBlock);
  }
}

export default new BlockchainService();
