import { useState, useCallback } from 'react';
import { api, Product } from '../lib/api';

interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

interface UseProductsActions {
  fetchProducts: (categoryId?: string) => Promise<void>;
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export type UseProducts = UseProductsState & UseProductsActions;

export function useProducts(): UseProducts {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (categoryId?: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const path = categoryId ? `/api/products?categoryId=${categoryId}` : '/api/products';
      const data = await api.get<Product[]>(path);
      setProducts(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(
    async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.post<Product>('/api/products', product);
        setProducts((prev) => [...prev, created]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create product';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateProduct = useCallback(
    async (id: string, product: Partial<Product>): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.put<Product>(`/api/products/${id}`, product);
        setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update product';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete product';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { products, loading, error, fetchProducts, createProduct, updateProduct, deleteProduct };
}