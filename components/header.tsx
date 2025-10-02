import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/lib/actions/actions';

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10 h-16 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Fake Store
        </Link>
        <nav className="flex space-x-6 items-center">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
            Products
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors">
            Cart
          </Link>
          
          {user && user.user_metadata.role === 'admin' && (
            <Link href="/admin" className="text-gray-600 hover:text-blue-600 transition-colors bg-gray-100 px-3 py-1 rounded-md">
              Admin
            </Link>
          )}

          {user ? (
            <form action={logout}>
              <button className="text-gray-600 hover:text-blue-600 transition-colors">
                Logout
              </button>
            </form>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link href="/signup" className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}