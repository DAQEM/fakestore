import { Product } from "@/lib/types";
import Image from 'next/image';
import Link from 'next/link';
import ProductCardAddToCart from '@/components/cart/product-card-add-to-cart';

interface ProductCardProps {
  product: Product;
  showDescription?: boolean;
  isLoggedIn: boolean; // We'll pass the user's login status as a prop
}

export default function ProductCard({ product, showDescription = false, isLoggedIn }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
      {/* The main content of the card is a link to the product details page */}
      <Link
        href={`/products/${product.id}`}
        className="block"
      >
        <div className="relative h-48 w-full">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2" style={{ height: '3.5rem' }}>
            {product.title}
          </h3>
          {showDescription && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-3">{product.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
          </div>
          <div className="mt-2 flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="ml-1 text-sm text-gray-600">{product.rating_rate} ({product.rating_count} reviews)</span>
          </div>
        </div>
      </Link>
      
      {/* The action area at the bottom of the card */}
      <div className="p-4 pt-0">
        {isLoggedIn ? (
          // If the user is logged in, show the "Add to Cart" button
          <ProductCardAddToCart productId={product.id} />
        ) : (
          // Otherwise, show a link prompting them to log in
          <Link href="/login" className="block w-full text-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-300 transition-colors">
            Login to Add
          </Link>
        )}
      </div>
    </div>
  );
}