'use client';

import { getAuthToken } from './auth-client';

/**
 * Get the base API URL from environment variable
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_URI || 'http://127.0.0.1:8000/';
}

/**
 * Make an authenticated API request to FastAPI backend
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const apiUrl = getApiUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${apiUrl}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Include credentials for CORS
  });

  return response;
}

/**
 * Make an authenticated GET request
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'GET',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

/**
 * Make an authenticated POST request
 */
export async function apiPost<T>(endpoint: string, data?: unknown): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

/**
 * Make an authenticated PUT request
 */
export async function apiPut<T>(endpoint: string, data?: unknown): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}

/**
 * Make an authenticated DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }

  // Handle 204 No Content responses (empty body)
  if (response.status === 204) {
    return undefined as T;
  }

  // Try to parse JSON, but handle empty responses gracefully
  const text = await response.text();
  if (!text) {
    return undefined as T;
  }

  try {
    return JSON.parse(text);
  } catch {
    return undefined as T;
  }
}

/**
 * Make an authenticated request with FormData (for file uploads)
 * Note: Content-Type header is NOT set - browser will set it with boundary
 */
export async function apiRequestFormData(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST'
): Promise<Response> {
  const apiUrl = getApiUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${apiUrl}${endpoint}`;
  const token = getAuthToken();

  const headers: Record<string, string> = {};
  // Don't set Content-Type - browser will set it with boundary for FormData

  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: formData,
    credentials: 'include',
  });

  return response;
}

/**
 * Make a public request with FormData (no authentication required)
 * Used for public forms like member applications
 */
export async function apiPublicFormData(
  endpoint: string,
  formData: FormData,
  method: 'POST' | 'PUT' = 'POST'
): Promise<Response> {
  const apiUrl = getApiUrl();
  const url = endpoint.startsWith('http') ? endpoint : `${apiUrl}${endpoint}`;

  const response = await fetch(url, {
    method,
    body: formData,
    credentials: 'include',
  });

  return response;
}