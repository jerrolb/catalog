import { hc } from 'hono/client';
import type { AppType } from './rpc-types';
import type { CreateProductInput, Product } from '../types';

// Create type-safe RPC client
export const api = hc<AppType>('http://localhost:3000/rpc');

// Type-safe API functions
export async function createProduct(product: CreateProductInput): Promise<Product> {
  const res = await api.products.$post({ json: product });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create product');
  }
  return res.json();
}

export async function getProducts(limit = 30, offset = 0): Promise<Product[]> {
  const res = await api.products.$get({ query: { limit: limit.toString(), offset: offset.toString() } });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export async function getProduct(id: number): Promise<Product> {
  const res = await api.products[':id'].$get({ param: { id: id.toString() } });
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  return res.json();
}
