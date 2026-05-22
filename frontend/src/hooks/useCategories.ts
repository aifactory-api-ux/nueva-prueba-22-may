import { useState, useCallback } from 'react';
import { api, Category } from '../lib/api';

interface UseCategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

interface UseCategoriesActions {
  fetchCategories: () => Promise<void>;
  createCategory: (name: string, description: string) => Promise<void>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

export type UseCategories = UseCategoriesState & UseCategoriesActions;

export function useCategories(): UseCategories {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Category[]>('/api/categories');
      setCategories(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch categories';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (name: string, description: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const created = await api.post<Category>('/api/categories', { name, description });
        setCategories((prev) => [...prev, created]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create category';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCategory = useCallback(
    async (id: string, data: Partial<Category>): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await api.put<Category>(`/api/categories/${id}`, data);
        setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update category';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete category';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory };
}