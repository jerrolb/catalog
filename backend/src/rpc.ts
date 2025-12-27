import { Hono } from 'hono';
import { z } from 'zod';
import { db } from './db/index.js';
import type { Product, CreateProductInput } from './types.js';

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

    const products = db.prepare(`
      SELECT * FROM products
      ORDER BY id DESC
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

    return c.json(result);
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
  });

export { rpc };
export type AppType = typeof rpc;

