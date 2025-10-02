'use client';

import { addItem } from '@/lib/actions/actions';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center disabled:bg-blue-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}

export default function AddToCartForm({ productId }: { productId: number }) {
  const initialState = { message: null };
  const addItemWithId = addItem.bind(null, productId);
  const [state, dispatch] = useActionState(addItemWithId, initialState);

  return (
    <form action={dispatch}>
        <AddButton />
        {state?.message && <p aria-live="polite" className="text-red-500 mt-2 text-sm">{state.message}</p>}
    </form>
  );
}