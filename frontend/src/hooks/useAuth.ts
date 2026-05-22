import { useState, useCallback } from 'react';
import { api, User, AuthToken } from '../lib/api';

interface UseAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface UseAuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

export type UseAuth = UseAuthState & UseAuthActions;

export function useAuth(): UseAuth {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      const userData = await api.get<User>('/api/auth/me');
      setUser(userData);
    } catch {
      setUser(null);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const authData = await api.post<AuthToken>('/api/auth/login', { email, password });
      localStorage.setItem('token', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);
      await fetchUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  const register = useCallback(async (email: string, password: string, fullName: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const authData = await api.post<AuthToken>('/api/auth/register', { email, password, fullName });
      localStorage.setItem('token', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);
      await fetchUser();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUser]);

  const logout = useCallback((): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setError(null);
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const authData = await api.post<AuthToken>('/api/auth/refresh', { refreshToken });
      localStorage.setItem('token', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);
      await fetchUser();
    } catch (err) {
      logout();
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUser, logout]);

  return { user, loading, error, login, register, logout, refresh };
}