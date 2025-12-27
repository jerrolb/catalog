import { hc } from 'hono/client';
import type { AppType } from './rpc-types';
import type { CreateProductInput, Product } from '../types';

// Create type-safe RPC client
const client = hc<AppType>('http://localhost:3000/rpc');
export const api = client;

// Type-safe API functions
export async function createProduct(product: CreateProductInput): Promise<Product> {
  // @ts-expect-error - Hono RPC type inference issue, but works at runtime
  const res = await api.products.$post({ json: product });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create product');
  }
  return res.json();
}

export async function getProducts(limit = 30, offset = 0): Promise<{ products: Product[]; total: number }> {
  // @ts-expect-error - Hono RPC type inference issue, but works at runtime
  const res = await api.products.$get({ query: { limit: limit.toString(), offset: offset.toString() } });
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export async function getProduct(id: number): Promise<Product> {
  // @ts-expect-error - Hono RPC type inference issue, but works at runtime
  const res = await api.products[':id'].$get({ param: { id: id.toString() } });
  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }
  return res.json();
}

export async function updateProduct(id: number, updates: Partial<CreateProductInput>): Promise<Product> {
  // @ts-expect-error - Hono RPC type inference issue, but works at runtime
  const res = await api.products[':id'].$put({ param: { id: id.toString() }, json: updates });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update product');
  }
  return res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  // @ts-expect-error - Hono RPC type inference issue, but works at runtime
  const res = await api.products[':id'].$delete({ param: { id: id.toString() } });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to delete product');
  }
}
