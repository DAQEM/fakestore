'use client';

import { addItem } from '@/lib/actions/actions';
import { useTransition } from 'react';

export default function ProductCardAddToCart({ productId }: { productId: number }) {
  const [isPending, startTransition] = useTransition();

  // This handler prevents the parent <Link> component from navigating
  // when the button is clicked.
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    startTransition(() => {
      // Calls the server action to add the item to the cart.
      // In a real-world app, you might want to show a success toast here.
      addItem(productId);
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isPending}
      className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-wait"
    >
      {isPending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}