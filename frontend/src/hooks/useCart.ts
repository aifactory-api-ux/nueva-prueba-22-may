import { useState, useCallback, useEffect } from 'react';
import { api, Cart } from '../lib/api';

interface UseCartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

interface UseCartActions {
  fetchCart: () => Promise<void>;
  addCartItem: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeCartItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export type UseCart = UseCartState & UseCartActions;

export function useCart(): UseCart {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Cart>('/api/cart');
      setCart(data);
    } catch {
      // silently fail — user may not be authenticated
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addCartItem = useCallback(async (productId: string, quantity: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post<Cart>('/api/cart/items', { productId, quantity });
      setCart(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCartItem = useCallback(async (productId: string, quantity: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.put<Cart>(`/api/cart/items/${productId}`, { quantity });
      setCart(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update cart item';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCartItem = useCallback(async (productId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.delete<Cart>(`/api/cart/items/${productId}`);
      setCart(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove cart item';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCart = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (cart?.items.length) {
        for (const item of cart.items) {
          await api.delete(`/api/cart/items/${item.productId}`);
        }
      }
      setCart(cart ? { ...cart, items: [], updatedAt: new Date().toISOString() } : null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cart]);

  return { cart, loading, error, fetchCart, addCartItem, updateCartItem, removeCartItem, clearCart };
}
