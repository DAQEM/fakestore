'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/admin', label: 'Products' },
  // Add other admin links here, e.g., Orders, Users
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-16 pt-6">
      <nav className="flex flex-col">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-colors ${
                isActive ? 'font-semibold text-blue-600 bg-gray-100' : ''
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}