import { getCategories } from '@/lib/api/api';
import ProductForm from '@/components/admin/product-form';
import { createProduct } from '@/lib/actions/actions';

export default async function NewProductPage() {
  const categoriesResult = await getCategories();

  if (!categoriesResult.ok) {
    return <div className="text-red-600">Error loading categories: {categoriesResult.error}</div>;
  }
  const categories = categoriesResult.data;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Product</h1>
      <ProductForm
        categories={categories}
        action={createProduct}
        buttonText="Create Product"
      />
    </div>
  );
}