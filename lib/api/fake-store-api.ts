const BASE_URL = 'https://fakestoreapi.com';

// Interface for a Product object
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

// Result type for successful data or error
type ApiResult<T> = { ok: true; data: T; error: null } | { ok: false; data: null; error: string };

/**
 * Fetches all products from the API.
 * @returns Promise resolving to an ApiResult with an array of Product objects.
 */
export async function getAllProducts(): Promise<ApiResult<Product[]>> {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      return { ok: false, data: null, error: `Failed to fetch products: ${response.status} ${response.statusText}` };
    }
    const data: Product[] = await response.json();
    return { ok: true, data, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
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
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      return { ok: false, data: null, error: `Failed to fetch product ${id}: ${response.status} ${response.statusText}` };
    }
    const data: Product = await response.json();
    return { ok: true, data, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
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
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      return { ok: false, data: null, error: `Failed to fetch categories: ${response.status} ${response.statusText}` };
    }
    const data: string[] = await response.json();
    return { ok: true, data, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
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
    const response = await fetch(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      return { ok: false, data: null, error: `Failed to fetch products in category "${category}": ${response.status} ${response.statusText}` };
    }
    const data: Product[] = await response.json();
    return { ok: true, data, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Error fetching products in category "${category}":`, errorMessage);
    return { ok: false, data: null, error: errorMessage };
  }
}