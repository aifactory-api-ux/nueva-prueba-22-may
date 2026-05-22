import { useState, useCallback } from 'react';
import { api, Order, CartItem } from '../lib/api';

interface UseOrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

interface UseOrdersActions {
  fetchOrders: () => Promise<void>;
  createOrder: (items: CartItem[]) => Promise<Order>;
}

export type UseOrders = UseOrdersState & UseOrdersActions;

export function useOrders(): UseOrders {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Order[]>('/api/orders');
      setOrders(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch orders';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (items: CartItem[]): Promise<Order> => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post<Order>('/api/orders', { items });
      setOrders(prev => [...prev, data]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { orders, loading, error, fetchOrders, createOrder };
}