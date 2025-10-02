import 'server-only';
import { createClient } from '@/utils/supabase/server';
import { unstable_noStore as noStore } from 'next/cache';
import { Cart } from './types';

/**
 * Fetches the current user's cart with all its items and their product details.
 * Returns null if the user is not logged in or has no cart yet.
 */
export async function getCart(): Promise<Cart | null> {
  noStore();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: cart, error } = await supabase
    .from('carts')
    .select(`
      id,
      user_id,
      cart_items (
        id,
        product_id,
        quantity,
        products (
          id,
          title,
          price,
          image,
          description,
          category,
          rating_rate,
          rating_count
        )
      )
    `)
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means no rows were found, which is fine.
    console.error('Error fetching cart:', error);
    throw new Error('Failed to fetch cart data.');
  }

  if (cart) {
    // Rename 'cart_items' to 'items' for consistency with our Cart type definition.
    const transformedCart = {
      ...cart,
      items: cart.cart_items.map(item => ({
        ...item,
        // The product is nested inside 'products', let's lift it up.
        products: Array.isArray(item.products) ? item.products[0] : item.products,
      })),
    };
    delete (transformedCart as any).cart_items;
    return transformedCart;
  }

  return null;
}


/**
 * Fetches the total number of items in the user's cart.
 */
export async function getCartCount(): Promise<number> {
    noStore();
    const cart = await getCart();
    if (!cart) {
        return 0;
    }
    // Sum the quantities of all items in the cart.
    return cart.items.reduce((total, item) => total + item.quantity, 0);
}