'use client';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Get the current authenticated user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return null;
    }

    const user = JSON.parse(userStr) as User;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Get the auth token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return token !== null;
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.is_admin === true;
}

/**
 * Clear authentication data (logout)
 */
export function clearAuth(): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

/**
 * Set authentication data (login)
 */
export function setAuth(token: string, user: User): void {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem('auth_token', token);
  localStorage.setItem('user', JSON.stringify(user));
}
