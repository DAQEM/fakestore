import { Product } from "@/lib/api/api";
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  showDescription?: boolean;
}

export default function ProductCard({ product, showDescription = false }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:bg-gray-50 transition-colors duration-300"
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
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.title}</h3>
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
  );
}