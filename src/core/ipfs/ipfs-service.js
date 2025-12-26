/**
 * IPFS Service
 * Handles decentralized storage for asset metadata and media
 */

import { create } from 'ipfs-http-client';
import dotenv from 'dotenv';

dotenv.config();

class IPFSService {
  constructor() {
    this.client = null;
    this.gateway = process.env.IPFS_GATEWAY_URL || 'https://ipfs.io/ipfs/';
    this.initialize();
  }

  /**
   * Initialize IPFS client
   */
  initialize() {
    try {
      // Use Infura IPFS or local node
      const apiUrl = process.env.IPFS_API_URL || 'https://ipfs.infura.io:5001';
      
      this.client = create({
        url: apiUrl,
        headers: process.env.INFURA_PROJECT_ID ? {
          authorization: `Basic ${Buffer.from(
            `${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`
          ).toString('base64')}`
        } : undefined
      });
    } catch (error) {
      console.error('Failed to initialize IPFS client:', error);
    }
  }

  /**
   * Upload file to IPFS
   */
  async uploadFile(fileBuffer, options = {}) {
    try {
      const result = await this.client.add(fileBuffer, {
        progress: options.onProgress,
        pin: true,
      });
      
      return {
        cid: result.cid.toString(),
        path: result.path,
        size: result.size,
        url: this.getGatewayUrl(result.cid.toString()),
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error('Failed to upload to IPFS');
    }
  }

  /**
   * Upload JSON data to IPFS
   */
  async uploadJSON(data) {
    const buffer = Buffer.from(JSON.stringify(data));
    return await this.uploadFile(buffer);
  }

  /**
   * Upload asset metadata
   */
  async uploadAssetMetadata(metadata) {
    const {
      name,
      description,
      image,
      attributes,
      externalUrl,
      animationUrl,
    } = metadata;

    const assetMetadata = {
      name,
      description,
      image,
      attributes: attributes || [],
      external_url: externalUrl,
      animation_url: animationUrl,
    };

    return await this.uploadJSON(assetMetadata);
  }

  /**
   * Get content from IPFS
   */
  async getContent(cid) {
    try {
      const chunks = [];
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (error) {
      console.error('IPFS get error:', error);
      throw new Error('Failed to retrieve from IPFS');
    }
  }

  /**
   * Get JSON content from IPFS
   */
  async getJSON(cid) {
    const buffer = await this.getContent(cid);
    return JSON.parse(buffer.toString());
  }

  /**
   * Pin content to IPFS
   */
  async pin(cid) {
    try {
      await this.client.pin.add(cid);
      return true;
    } catch (error) {
      console.error('IPFS pin error:', error);
      return false;
    }
  }

  /**
   * Unpin content from IPFS
   */
  async unpin(cid) {
    try {
      await this.client.pin.rm(cid);
      return true;
    } catch (error) {
      console.error('IPFS unpin error:', error);
      return false;
    }
  }

  /**
   * List pinned content
   */
  async listPinned() {
    try {
      const pins = [];
      for await (const pin of this.client.pin.ls()) {
        pins.push(pin);
      }
      return pins;
    } catch (error) {
      console.error('IPFS list pinned error:', error);
      return [];
    }
  }

  /**
   * Get gateway URL for CID
   */
  getGatewayUrl(cid) {
    return `${this.gateway}${cid}`;
  }

  /**
   * Upload directory to IPFS
   */
  async uploadDirectory(files) {
    try {
      const results = [];
      for await (const result of this.client.addAll(files, { wrapWithDirectory: true })) {
        results.push({
          cid: result.cid.toString(),
          path: result.path,
          size: result.size,
        });
      }
      return results;
    } catch (error) {
      console.error('IPFS directory upload error:', error);
      throw new Error('Failed to upload directory to IPFS');
    }
  }

  /**
   * Check if content exists
   */
  async exists(cid) {
    try {
      await this.client.dag.get(cid);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new IPFSService();
