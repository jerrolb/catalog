import { useState, useEffect, useCallback } from 'react';
import { getProducts, updateProduct, deleteProduct, createProduct, searchProducts } from './api/client';
import type { Product, CreateProductInput } from './types';
import ProductCard from './components/ProductCard';
import EditModal from './components/EditModal';
import DeleteModal from './components/DeleteModal';
import AddProductModal from './components/AddProductModal';
import Pagination from './components/Pagination';

const PRODUCTS_PER_PAGE = 30;

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchQuery]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
      
      let data;
      if (searchQuery.trim()) {
        data = await searchProducts(searchQuery.trim(), PRODUCTS_PER_PAGE, offset);
      } else {
        data = await getProducts(PRODUCTS_PER_PAGE, offset);
      }
      
      setProducts(data.products);
      setTotalProducts(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDelete = (product: Product) => {
    setDeletingProduct(product);
  };

  const handleUpdate = async (id: number, updates: Partial<CreateProductInput>) => {
    await updateProduct(id, updates);
    await loadProducts(); // Refresh the list
  };

  const handleDeleteConfirm = async (id: number) => {
    await deleteProduct(id);
    // If current page becomes empty, go to previous page
    if (products.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      await loadProducts(); // Refresh the list
    }
  };

  const handleCreate = async (product: CreateProductInput) => {
    await createProduct(product);
    // After creating, go to page 1 to see the new product (most recent)
    setCurrentPage(1);
    await loadProducts(); // Refresh the list
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
            <div className="flex-1 max-w-md mx-4">
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
            >
              Add Product
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-800 rounded-md">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found. Add your first product to get started.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {editingProduct && (
        <EditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deletingProduct && (
        <DeleteModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onDelete={handleDeleteConfirm}
        />
      )}

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}

export default App;
