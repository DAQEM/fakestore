'use client';

import { login, signup } from '@/lib/actions/actions';
import SubmitButton from './submit-button';
import Link from 'next/link';
import { useActionState } from 'react';

interface AuthFormProps {
  type: 'login' | 'signup';
}

export default function AuthForm({ type }: AuthFormProps) {
  const action = type === 'login' ? login : signup;
  const initialState = { message: '' };
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
      {state.message && (
        <p className="text-center p-2 mb-4 bg-red-100 text-red-600 rounded-md">
          {state.message}
        </p>
      )}
      
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <SubmitButton
        text={type === 'login' ? 'Login' : 'Sign Up'}
        pendingText={type === 'login' ? 'Logging in...' : 'Signing up...'}
      />

      <div className="mt-6 text-center">
        {type === 'login' ? (
          <p className="text-sm text-gray-600">
            Don't have an account? <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account? <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">Login</Link>
          </p>
        )}
      </div>
    </form>
  );
}