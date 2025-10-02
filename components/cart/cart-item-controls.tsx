'use client';

import { updateItemQuantity, removeItem } from '@/lib/actions/actions';
import type { CartItem } from '@/lib/types';
import { useTransition } from 'react';

export default function CartItemControls({ item }: { item: CartItem }) {
  const [isPending, startTransition] = useTransition();

  const handleQuantityChange = (newQuantity: number) => {
    startTransition(() => {
      updateItemQuantity(item.id, newQuantity);
    });
  };

  const handleRemove = () => {
    startTransition(() => {
      removeItem(item.id);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
      <div className="flex items-center border border-gray-300 rounded-md">
        <button 
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={isPending}
          className="px-3 py-1 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="px-4 py-1 text-center min-w-[50px]">{isPending ? '...' : item.quantity}</span>
        <button 
          onClick={() => handleQuantityChange(item.quantity + 1)}
          disabled={isPending}
          className="px-3 py-1 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button 
        onClick={handleRemove}
        disabled={isPending}
        className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
      >
        Remove
      </button>
    </div>
  );
}