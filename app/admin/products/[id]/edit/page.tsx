import { getProductById, getCategories } from '@/lib/api/api';
import ProductForm from '@/components/admin/product-form';
import { updateProduct } from '@/lib/actions/actions';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id, 10);
  if (isNaN(productId)) {
    return <div className="text-red-600">Invalid product ID</div>;
  }

  const [productResult, categoriesResult] = await Promise.all([
    getProductById(productId),
    getCategories(),
  ]);

  if (!productResult.ok) {
    return <div className="text-red-600">Error loading product: {productResult.error}</div>;
  }

  if (!categoriesResult.ok) {
    return <div className="text-red-600">Error loading categories: {categoriesResult.error}</div>;
  }

  const product = productResult.data;
  const categories = categoriesResult.data;

  // Bind the product ID to the server action
  const updateProductWithId = updateProduct.bind(null, product.id);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Product</h1>
      <ProductForm
        product={product}
        categories={categories}
        action={updateProductWithId}
        buttonText="Update Product"
      />
    </div>
  );
}