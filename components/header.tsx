import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-10 h-16 flex items-center">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Fake Store
        </Link>
        <nav className="flex space-x-6">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/products" className="text-gray-600 hover:text-blue-600 transition-colors">
            Products
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-blue-600 transition-colors">
            Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}