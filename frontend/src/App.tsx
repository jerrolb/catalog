import { useState } from 'react';
import { createProduct } from './api/client';
import type { CreateProductInput } from './types';

function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddProduct = async () => {
    setLoading(true);
    setMessage(null);

    const newProduct: CreateProductInput = {
      title: 'Test Product',
      description: 'This is a test product created from the UI',
      category: 'test',
      price: 19.99,
      stock: 100,
      brand: 'Test Brand',
      sku: `TEST-${Date.now()}`,
      weight: 1.5,
    };

    try {
      const product = await createProduct(newProduct);
      setMessage({ type: 'success', text: `Product "${product.title}" created successfully!` });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to create product' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Product</h2>
          
          <button
            onClick={handleAddProduct}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Creating...' : 'Add Product'}
          </button>

          {message && (
            <div
              className={`mt-4 p-4 rounded-md ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

