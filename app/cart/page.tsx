import { getCart } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';
import CartItemControls from '@/components/cart/cart-item-controls';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function CartPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const cart = await getCart();

  const subtotal = cart?.items.reduce((total, item) => total + item.products.price * item.quantity, 0) ?? 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
      
      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-500 mt-2 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Link href="/products" className="mt-4 inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image 
                      src={item.products.image} 
                      alt={item.products.title}
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{item.products.title}</h3>
                    <p className="text-gray-600 mt-1">${item.products.price.toFixed(2)}</p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <CartItemControls item={item} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-xl font-bold text-blue-600">${subtotal.toFixed(2)}</span>
              </div>
              <button className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}