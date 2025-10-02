import { getAllProducts, getCategories } from "@/lib/api/fake-store-api";
import ProductCard from '@/components/product-card';
import Link from 'next/link';

export default async function HomePage() {
  const productsResult = await getAllProducts();
  const categoriesResult = await getCategories();

  if (!productsResult.ok || !categoriesResult.ok) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error loading data</div>;
  }

  const products = productsResult.data;
  const categories = categoriesResult.data;

  // Select featured products, e.g., first 4
  const featuredProducts = products.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Fake Store</h1>
          <p className="text-xl mb-8">Discover amazing products at unbeatable prices</p>
          <Link href="/products" className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors font-semibold">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showDescription={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-12 border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/products?category=${encodeURIComponent(category)}`}
                className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Start Shopping?</h2>
          <p className="text-lg text-gray-600 mb-8">Browse our full collection and find your favorites today.</p>
          <Link href="/products" className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold">
            View All Products
          </Link>
        </div>
      </section>
    </div>
  );
}