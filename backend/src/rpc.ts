import { Hono } from 'hono';
import { z } from 'zod';
import { db } from './db/index.js';
import type { Product, CreateProductInput, UpdateProductInput } from './types.js';

// Create RPC app
const rpc = new Hono();

// Input validation schemas
const createProductSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  brand: z.string().min(1),
  sku: z.string().min(1),
  weight: z.number().nonnegative(),
});

// RPC route handlers with proper typing
rpc
  .post('/products', async (c) => {
    try {
      const body = await c.req.json<CreateProductInput>();

      // Validate input
      const validation = createProductSchema.safeParse(body);
      if (!validation.success) {
        return c.json({ error: 'Validation failed', details: validation.error.errors }, 400);
      }

      const now = new Date().toISOString();

      const stmt = db.prepare(`
        INSERT INTO products (title, description, category, price, stock, brand, sku, weight, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        body.title,
        body.description,
        body.category,
        body.price,
        body.stock,
        body.brand,
        body.sku,
        body.weight,
        now,
        now
      );

      // Fetch the created product
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid) as any;

      const response: Product = {
        id: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        brand: product.brand,
        sku: product.sku,
        weight: product.weight,
        meta: {
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      };

      return c.json(response);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return c.json({ error: 'Product with this SKU already exists' }, 409);
      }
      console.error('Error creating product:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })
  .get('/products', async (c) => {
    const limit = parseInt(c.req.query('limit') || '30');
    const offset = parseInt(c.req.query('offset') || '0');

    // Get total count
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };

    const products = db.prepare(`
      SELECT * FROM products
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset) as any[];

    const result: Product[] = products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      price: p.price,
      stock: p.stock,
      brand: p.brand,
      sku: p.sku,
      weight: p.weight,
      meta: {
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      },
    }));

    return c.json({ products: result, total: totalCount.count });
  })
  .get('/products/search', async (c) => {
    const query = c.req.query('q') || '';
    const limit = parseInt(c.req.query('limit') || '30');
    const offset = parseInt(c.req.query('offset') || '0');

    if (!query.trim()) {
      // If no query, return all products
      const totalCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
      const products = db.prepare(`
        SELECT * FROM products
        ORDER BY createdAt DESC
        LIMIT ? OFFSET ?
      `).all(limit, offset) as any[];

      const result: Product[] = products.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        price: p.price,
        stock: p.stock,
        brand: p.brand,
        sku: p.sku,
        weight: p.weight,
        meta: {
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        },
      }));

      return c.json({ products: result, total: totalCount.count });
    }

    // Search by title or description (case-insensitive substring match)
    const searchQuery = `%${query}%`;
    const totalCount = db.prepare(`
      SELECT COUNT(*) as count FROM products
      WHERE LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)
    `).get(searchQuery, searchQuery) as { count: number };

    const products = db.prepare(`
      SELECT * FROM products
      WHERE LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?)
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `).all(searchQuery, searchQuery, limit, offset) as any[];

    const result: Product[] = products.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      category: p.category,
      price: p.price,
      stock: p.stock,
      brand: p.brand,
      sku: p.sku,
      weight: p.weight,
      meta: {
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      },
    }));

    return c.json({ products: result, total: totalCount.count });
  })
  .get('/products/:id', async (c) => {
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: 'Invalid product ID' }, 400);
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;

    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }

    const result: Product = {
      id: product.id,
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      brand: product.brand,
      sku: product.sku,
      weight: product.weight,
      meta: {
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    };

    return c.json(result);
  })
  .put('/products/:id', async (c) => {
    try {
      const id = parseInt(c.req.param('id'));
      if (isNaN(id)) {
        return c.json({ error: 'Invalid product ID' }, 400);
      }

      const body = await c.req.json<UpdateProductInput>();

      // Check if product exists
      const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
      if (!existing) {
        return c.json({ error: 'Product not found' }, 404);
      }

      // Build update query dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];

      if (body.title !== undefined) {
        updates.push('title = ?');
        values.push(body.title);
      }
      if (body.description !== undefined) {
        updates.push('description = ?');
        values.push(body.description);
      }
      if (body.category !== undefined) {
        updates.push('category = ?');
        values.push(body.category);
      }
      if (body.price !== undefined) {
        updates.push('price = ?');
        values.push(body.price);
      }
      if (body.stock !== undefined) {
        updates.push('stock = ?');
        values.push(body.stock);
      }
      if (body.brand !== undefined) {
        updates.push('brand = ?');
        values.push(body.brand);
      }
      if (body.sku !== undefined) {
        updates.push('sku = ?');
        values.push(body.sku);
      }
      if (body.weight !== undefined) {
        updates.push('weight = ?');
        values.push(body.weight);
      }

      if (updates.length === 0) {
        return c.json({ error: 'No fields to update' }, 400);
      }

      updates.push('updatedAt = ?');
      values.push(new Date().toISOString());
      values.push(id);

      const stmt = db.prepare(`
        UPDATE products
        SET ${updates.join(', ')}
        WHERE id = ?
      `);

      stmt.run(...values);

      // Fetch updated product
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;

      const response: Product = {
        id: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        price: product.price,
        stock: product.stock,
        brand: product.brand,
        sku: product.sku,
        weight: product.weight,
        meta: {
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      };

      return c.json(response);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return c.json({ error: 'Product with this SKU already exists' }, 409);
      }
      console.error('Error updating product:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  })
  .delete('/products/:id', async (c) => {
    try {
      const id = parseInt(c.req.param('id'));
      if (isNaN(id)) {
        return c.json({ error: 'Invalid product ID' }, 400);
      }

      // Check if product exists
      const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
      if (!existing) {
        return c.json({ error: 'Product not found' }, 404);
      }

      // Delete product
      db.prepare('DELETE FROM products WHERE id = ?').run(id);

      return c.json({ message: 'Product deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  });

export { rpc };
export type AppType = typeof rpc;

