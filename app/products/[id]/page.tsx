import { getProductById } from "@/lib/api/fake-store-api";
import Image from 'next/image';
import Link from 'next/link';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Invalid product ID</div>;
  }

  const productResult = await getProductById(productId);

  if (!productResult.ok) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error loading product: {productResult.error}</div>;
  }

  const product = productResult.data;

  return (
    <div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/products" className="hover:text-blue-600">Products</Link> &gt; {product.title}
          </nav>
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
        </div>
      </header>

      {/* Product Details */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="relative h-96 w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <p className="text-sm text-gray-600 mb-2">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">{product.title}</h2>
              <p className="text-gray-700 mb-6">{product.description}</p>
              <div className="flex items-center mb-4">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-sm text-gray-600">{product.rating.rate} ({product.rating.count} reviews)</span>
              </div>
              <span className="text-3xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
              <div className="mt-6">
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}