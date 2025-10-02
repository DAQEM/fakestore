'use client';

import { deleteProduct } from '@/lib/actions/actions';
import { useTransition } from 'react';

export default function DeleteProductButton({ productId }: { productId: number }) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      startTransition(() => {
        deleteProduct(productId);
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="ml-4 text-red-600 hover:text-red-900 disabled:text-gray-400"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}