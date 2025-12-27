import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Hono } from 'hono';
import Database from 'better-sqlite3';
import { join } from 'path';
import { unlinkSync, existsSync } from 'fs';
import { rpc } from '../rpc.js';
import type { CreateProductInput } from '../types.js';

// Create a test database path
const testDbPath = join(process.cwd(), 'data', 'test-products.db');

describe('Product API Business Logic', () => {
  let app: Hono;
  let testDb: Database.Database;

  beforeEach(async () => {
    // Clean up test database if it exists
    if (existsSync(testDbPath)) {
      unlinkSync(testDbPath);
    }
    
    // Create fresh test database
    testDb = new Database(testDbPath);
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
    
    app = new Hono().route('/rpc', rpc);
  });

  afterEach(() => {
    if (testDb) {
      testDb.close();
    }
    if (existsSync(testDbPath)) {
      try {
        unlinkSync(testDbPath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  });

  describe('POST /products - Create Product', () => {
    it('should create a product with valid data', async () => {
      const timestamp = Date.now();
      const productData: CreateProductInput = {
        title: 'Test Product',
        description: 'Test Description',
        category: 'test',
        price: 19.99,
        stock: 100,
        brand: 'Test Brand',
        sku: `TEST-${timestamp}`,
        weight: 1.5,
      };

      const req = new Request('http://localhost:3000/rpc/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(200);
      
      const product = await res.json();
      expect(product.title).toBe(productData.title);
      expect(product.sku).toBe(productData.sku);
      expect(product.id).toBeDefined();
    });

    it('should reject product with duplicate SKU', async () => {
      const timestamp = Date.now();
      const productData: CreateProductInput = {
        title: 'Test Product',
        description: 'Test Description',
        category: 'test',
        price: 19.99,
        stock: 100,
        brand: 'Test Brand',
        sku: `DUPLICATE-${timestamp}`,
        weight: 1.5,
      };

      // Create first product
      const req1 = new Request('http://localhost:3000/rpc/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      await app.fetch(req1);

      // Try to create duplicate
      const req2 = new Request('http://localhost:3000/rpc/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const res = await app.fetch(req2);
      expect(res.status).toBe(409);
      const error = await res.json();
      expect(error.error).toContain('SKU already exists');
    });

    it('should validate required fields', async () => {
      const timestamp = Date.now();
      const invalidData = {
        title: '', // Empty title should fail
        description: 'Test Description',
        category: 'test',
        price: 19.99,
        stock: 100,
        brand: 'Test Brand',
        sku: `TEST-VALIDATE-${timestamp}`,
        weight: 1.5,
      };

      const req = new Request('http://localhost:3000/rpc/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
      const error = await res.json();
      expect(error.error).toBe('Validation failed');
    });

    it('should validate price is positive', async () => {
      const timestamp = Date.now();
      const invalidData: CreateProductInput = {
        title: 'Test Product',
        description: 'Test Description',
        category: 'test',
        price: -10, // Negative price should fail
        stock: 100,
        brand: 'Test Brand',
        sku: `TEST-PRICE-${timestamp}`,
        weight: 1.5,
      };

      const req = new Request('http://localhost:3000/rpc/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidData),
      });

      const res = await app.fetch(req);
      expect(res.status).toBe(400);
    });
  });
});
