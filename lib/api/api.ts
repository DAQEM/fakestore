import axios, { AxiosError } from 'axios';
import { Product } from '../types';

// The environment variable gives us the absolute path needed for server-side fetching.
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

// We construct the absolute base URL for our API endpoints.
const BASE_URL = `${APP_URL}/api`;

// Result type for successful data or error
type ApiResult<T> = { ok: true; data: T; error: null } | { ok: false; data: null; error: string };

// Create an Axios instance with a base URL.
const apiClient = axios.create({
  baseURL: BASE_URL,
});

/**
 * Fetches all products from the API.
 * @returns Promise resolving to an ApiResult with an array of Product objects.
 */
export async function getAllProducts(): Promise<ApiResult<Product[]>> {
  try {
    const response = await apiClient.get<Product[]>('/products');
    return { ok: true, data: response.data, error: null };
  } catch (err) {
    const errorMessage = err instanceof AxiosError ? err.message : 'Unknown error';
    console.error('Error fetching all products:', errorMessage);
    return { ok: false, data: null, error: errorMessage };
  }
}

/**
 * Fetches a single product by its ID.
 * @param id - The ID of the product to fetch.
 * @returns Promise resolving to an ApiResult with a Product object.
 */
export async function getProductById(id: number): Promise<ApiResult<Product>> {
  try {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return { ok: true, data: response.data, error: null };
  } catch (err) {
    const errorMessage = err instanceof AxiosError ? err.message : 'Unknown error';
    console.error(`Error fetching product ${id}:`, errorMessage);
    return { ok: false, data: null, error: errorMessage };
  }
}

/**
 * Fetches all product categories from the API.
 * @returns Promise resolving to an ApiResult with an array of category strings.
 */
export async function getCategories(): Promise<ApiResult<string[]>> {
  try {
    const response = await apiClient.get<string[]>('/categories');
    return { ok: true, data: response.data, error: null };
  } catch (err) {
    const errorMessage = err instanceof AxiosError ? err.message : 'Unknown error';
    console.error('Error fetching categories:', errorMessage);
    return { ok: false, data: null, error: errorMessage };
  }
}

/**
 * Fetches products in a specific category.
 * @param category - The category name to fetch products for.
 * @returns Promise resolving to an ApiResult with an array of Product objects.
 */
export async function getProductsByCategory(category: string): Promise<ApiResult<Product[]>> {
  try {
    const response = await apiClient.get<Product[]>(`/products/category/${encodeURIComponent(category)}`);
    return { ok: true, data: response.data, error: null };
  } catch (err) {
    const errorMessage = err instanceof AxiosError ? err.message : 'Unknown error';
    console.error(`Error fetching products in category "${category}":`, errorMessage);
    return { ok: false, data: null, error: errorMessage };
  }
}