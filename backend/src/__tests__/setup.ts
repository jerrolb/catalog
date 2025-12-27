import Database from 'better-sqlite3';
import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';

// Create test database before tests
const testDbPath = join(process.cwd(), 'data', 'test-products.db');

export function setupTestDb() {
  if (existsSync(testDbPath)) {
    unlinkSync(testDbPath);
  }
  
  const testDb = new Database(testDbPath);
  testDb.exec(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL,
      brand TEXT NOT NULL,
      sku TEXT NOT NULL UNIQUE,
      weight REAL NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
  
  return testDb;
}

export function cleanupTestDb() {
  if (existsSync(testDbPath)) {
    unlinkSync(testDbPath);
  }
}

