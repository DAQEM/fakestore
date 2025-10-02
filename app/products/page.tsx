import { getAllProducts, getCategories, getProductsByCategory } from "@/lib/api/api";
import ProductCard from '@/components/product-card';
import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const categoryFilter = (await searchParams).category;
  const productsResult = categoryFilter ? await getProductsByCategory(categoryFilter) : await getAllProducts();
  const categoriesResult = await getCategories();

  if (!productsResult.ok) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error loading products: {productsResult.error}</div>;
  }

  if (!categoriesResult.ok) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error loading categories: {categoriesResult.error}</div>;
  }

  const products = productsResult.data;
  const categories = categoriesResult.data;

  return (
    <div>
      {/* Header */}
      <header className="bg-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
          <p className="mt-2 text-gray-600">Discover our wide range of high-quality products</p>
        </div>
      </header>

      {/* Categories Bar */}
      <nav className="bg-white border-t border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <ul className="flex flex-wrap gap-4 md:gap-6 justify-center md:justify-start">
            <li>
              <Link
                href="/products"
                className={`text-blue-600 hover:text-blue-800 transition-colors ${!categoryFilter ? 'font-bold' : ''}`}
              >
                All Categories
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category}>
                <Link
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className={`text-blue-600 hover:text-blue-800 transition-colors ${categoryFilter === category ? 'font-bold' : ''}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              showDescription={true} 
              isLoggedIn={!!user}
            />
          ))}
        </div>
      </main>
    </div>
  );
}