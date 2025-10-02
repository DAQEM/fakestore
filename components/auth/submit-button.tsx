'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  text: string;
  pendingText: string;
}

export default function SubmitButton({ text, pendingText }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
    >
      {pending ? pendingText : text}
    </button>
  );
}