'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/products`;

type ProductData = {
    title: string | null;
    price: number | null;
    description: string | null;
    category: string | null;
    image: string | null;
    rating_rate?: number;
    rating_count?: number;
};


// Helper function to handle API requests
async function makeApiRequest(method: 'post' | 'put' | 'delete', url: string, data?: ProductData) {
  try {
    const response = await axios[method](url, data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(`API Error: ${error.response.status}`, error.response.data);
      return { success: false, error: error.response.data.error || 'An unknown API error occurred' };
    }
    console.error('Request failed:', error);
    return { success: false, error: 'An unknown error occurred' };
  }
}

// CREATE Product Action
export async function createProduct(prevState: {}, formData: FormData) {
  const productData: ProductData = {
    title: formData.get('title')?.toString() || null,
    price: Number(formData.get('price')),
    description: formData.get('description')?.toString() || null,
    category: formData.get('category')?.toString() || null,
    image: formData.get('image')?.toString() || null,
    // Default rating for new products
    rating_rate: 0,
    rating_count: 0,
  };

  const result = await makeApiRequest('post', API_URL, productData);

  if (!result.success) {
    return { message: result.error };
  }

  revalidatePath('/admin');
  revalidatePath('/products');
  redirect('/admin');
}

// UPDATE Product Action
export async function updateProduct(id: number, prevState: {}, formData: FormData) {
  const productData: ProductData = {
    title: formData.get('title')?.toString() || null,
    price: Number(formData.get('price')),
    description: formData.get('description')?.toString() || null,
    category: formData.get('category')?.toString() || null,
    image: formData.get('image')?.toString() || null,
  };

  const result = await makeApiRequest('put', `${API_URL}/${id}`, productData);

  if (!result.success) {
    return { message: result.error };
  }

  revalidatePath('/admin');
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath(`/products/${id}`);
  revalidatePath('/products');
  redirect('/admin');
}

// DELETE Product Action
export async function deleteProduct(id: number) {
  const result = await makeApiRequest('delete', `${API_URL}/${id}`);
  
  if (!result.success) {
    // This error won't be visible on the client-side directly
    // but will be logged on the server.
    console.error('Failed to delete product:', result.error);
    return;
  }
  
  revalidatePath('/admin');
  revalidatePath('/products');
}