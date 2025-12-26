/**
 * Database Service
 * SQLite-based local storage for caching and indexing
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseService {
  constructor() {
    this.db = null;
    this.initialize();
  }

  /**
   * Initialize database connection
   */
  initialize() {
    const dbPath = process.env.DATABASE_PATH || './data/nexus.db';
    const dbDir = path.dirname(dbPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
    this.createTables();
  }

  /**
   * Create database tables
   */
  createTables() {
    // Assets table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        creator TEXT NOT NULL,
        visual_data_uri TEXT,
        rarity INTEGER,
        revenue_share_bps INTEGER,
        is_active BOOLEAN DEFAULT 1,
        chain TEXT,
        registration_time INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Wrapped assets table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS wrapped_assets (
        id TEXT PRIMARY KEY,
        original_contract TEXT NOT NULL,
        original_token_id TEXT NOT NULL,
        token_type INTEGER,
        wrapper TEXT NOT NULL,
        universal_asset_id TEXT,
        is_wrapped BOOLEAN DEFAULT 1,
        chain TEXT,
        wrap_time INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Marketplace listings table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS listings (
        id TEXT PRIMARY KEY,
        asset_id TEXT NOT NULL,
        seller TEXT NOT NULL,
        price TEXT,
        listing_type TEXT,
        duration INTEGER,
        is_active BOOLEAN DEFAULT 1,
        chain TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Games table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS games (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        creator TEXT NOT NULL,
        chain TEXT,
        contract_address TEXT,
        status TEXT DEFAULT 'active',
        players_count INTEGER DEFAULT 0,
        revenue TEXT DEFAULT '0',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Revenue records table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS revenue_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        asset_id TEXT NOT NULL,
        payer TEXT NOT NULL,
        amount TEXT,
        chain TEXT,
        tx_hash TEXT,
        distributed BOOLEAN DEFAULT 0,
        timestamp INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Analytics events table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        user_address TEXT,
        game_id TEXT,
        asset_id TEXT,
        metadata TEXT,
        timestamp INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_assets_creator ON assets(creator);
      CREATE INDEX IF NOT EXISTS idx_listings_asset ON listings(asset_id);
      CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller);
      CREATE INDEX IF NOT EXISTS idx_games_creator ON games(creator);
      CREATE INDEX IF NOT EXISTS idx_revenue_asset ON revenue_records(asset_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_user ON analytics_events(user_address);
      CREATE INDEX IF NOT EXISTS idx_analytics_game ON analytics_events(game_id);
    `);
  }

  /**
   * Insert record
   */
  insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const stmt = this.db.prepare(
      `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`
    );
    
    return stmt.run(...values);
  }

  /**
   * Update record
   */
  update(table, data, where) {
    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const whereClause = Object.keys(where)
      .map(key => `${key} = ?`)
      .join(' AND ');
    
    const stmt = this.db.prepare(
      `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`
    );
    
    return stmt.run(...Object.values(data), ...Object.values(where));
  }

  /**
   * Delete record
   */
  delete(table, where) {
    const whereClause = Object.keys(where)
      .map(key => `${key} = ?`)
      .join(' AND ');
    
    const stmt = this.db.prepare(`DELETE FROM ${table} WHERE ${whereClause}`);
    return stmt.run(...Object.values(where));
  }

  /**
   * Find one record
   */
  findOne(table, where) {
    const whereClause = Object.keys(where)
      .map(key => `${key} = ?`)
      .join(' AND ');
    
    const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE ${whereClause}`);
    return stmt.get(...Object.values(where));
  }

  /**
   * Find all records
   */
  findAll(table, where = {}, limit = 100, offset = 0) {
    let query = `SELECT * FROM ${table}`;
    const values = [];
    
    if (Object.keys(where).length > 0) {
      const whereClause = Object.keys(where)
        .map(key => `${key} = ?`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      values.push(...Object.values(where));
    }
    
    query += ` LIMIT ? OFFSET ?`;
    values.push(limit, offset);
    
    const stmt = this.db.prepare(query);
    return stmt.all(...values);
  }

  /**
   * Execute raw query
   */
  query(sql, params = []) {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }

  /**
   * Get table count
   */
  count(table, where = {}) {
    let query = `SELECT COUNT(*) as count FROM ${table}`;
    const values = [];
    
    if (Object.keys(where).length > 0) {
      const whereClause = Object.keys(where)
        .map(key => `${key} = ?`)
        .join(' AND ');
      query += ` WHERE ${whereClause}`;
      values.push(...Object.values(where));
    }
    
    const stmt = this.db.prepare(query);
    const result = stmt.get(...values);
    return result.count;
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

export default new DatabaseService();
