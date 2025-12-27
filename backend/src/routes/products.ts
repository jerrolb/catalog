import { Hono } from 'hono';
import { db } from '../db/index.js';
import type { CreateProductInput } from '../types.js';

const products = new Hono();

// POST /api/products - Create a new product
products.post('/', async (c) => {
  try {
    const body = await c.req.json<CreateProductInput>();

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'price', 'stock', 'brand', 'sku', 'weight'];
    for (const field of requiredFields) {
      if (!(field in body) || (typeof body[field as keyof CreateProductInput] === 'string' && !body[field as keyof CreateProductInput])) {
        return c.json({ error: `Missing required field: ${field}` }, 400);
      }
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

    const response = {
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

    return c.json(response, 201);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return c.json({ error: 'Product with this SKU already exists' }, 409);
    }
    console.error('Error creating product:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default products;

