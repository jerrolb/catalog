import type { Product, CreateProductInput } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

export async function createProduct(product: CreateProductInput): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to create product' }));
    throw new Error(error.error || 'Failed to create product');
  }

  return response.json();
}

