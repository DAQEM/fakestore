'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

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
export async function createProduct(prevState: object, formData: FormData) {
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
export async function updateProduct(id: number, prevState: object, formData: FormData) {
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

export async function login(prevState: object, formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }
  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(prevState: object, formData: FormData) {
  const origin = (await headers()).get('origin');
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { message: error.message };
  }
  
  // On successful sign-up, Supabase sends a confirmation email.
  // We can return a success message to the user.
  return { message: 'Check your email to continue signing up.' };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/');
}

/**
 * Finds the user's cart or creates a new one if it doesn't exist.
 * Throws an error if the user is not authenticated.
 * @param supabase - The Supabase client instance.
 * @returns The user's cart object with an 'id'.
 */
async function findOrCreateCart() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated. Cannot perform cart operation.');

    // Check if a cart already exists for the user.
    let { data: cart } = await supabase.from('carts').select('id').eq('user_id', user.id).single();

    // If no cart exists, create one.
    if (!cart) {
        const { data: newCart, error } = await supabase.from('carts').insert({ user_id: user.id }).select('id').single();
        if (error) {
            console.error('Supabase error creating cart:', error);
            throw new Error('Could not create a new cart.');
        }
        cart = newCart;
    }

    return cart;
}

/**
 * Adds a product to the cart or increments its quantity if it already exists.
 * @param productId - The ID of the product to add.
 */
export async function addItem(productId: number): Promise<{ message: string | null } | void> {
  try {
    const supabase = await createClient();
    const cart = await findOrCreateCart();

    // Check if the item is already in the cart.
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .single();

    if (existingItem) {
      // If it exists, increment the quantity.
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);

      if (error) throw error;
    } else {
      // If it's a new item, insert it with quantity 1.
      const { error } = await supabase
        .from('cart_items')
        .insert({ cart_id: cart.id, product_id: productId, quantity: 1 });

      if (error) throw error;
    }

    // Revalidate paths to update the UI, including the header cart count.
    revalidatePath('/cart');
    revalidatePath('/', 'layout');
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return { message: 'Could not add item to cart. Please try again.' };
  }
}

/**
 * Updates the quantity of a specific item in the cart.
 * If quantity drops to 0 or less, the item is removed.
 * @param itemId - The ID of the cart item.
 * @param quantity - The new quantity.
 */
export async function updateItemQuantity(itemId: number, quantity: number) {
    if (quantity < 1) {
        // If quantity is less than 1, remove the item instead.
        return removeItem(itemId);
    }

    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('id', itemId);
        
        if (error) throw error;

        revalidatePath('/cart');
        revalidatePath('/', 'layout');
    } catch (error) {
        console.error('Error updating item quantity:', error);
        return { message: 'Could not update item quantity.' };
    }
}

/**
 * Removes an item from the cart entirely.
 * @param itemId - The ID of the cart item to remove.
 */
export async function removeItem(itemId: number) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', itemId);
        
        if (error) throw error;
        
        revalidatePath('/cart');
        revalidatePath('/', 'layout');
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return { message: 'Could not remove item from cart.' };
    }
}