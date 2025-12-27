import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import products from './routes/products.js';
import './db/index.js'; // Initialize database

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.route('/api/products', products);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok' });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

