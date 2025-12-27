export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
  sku: string;
  weight: number;
  meta: {
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateProductInput {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
  sku: string;
  weight: number;
}

