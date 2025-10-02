export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating_rate: number;
  rating_count: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  products: Product;
}

export interface Cart {
  id: number;
  user_id: string;
  items: CartItem[];
}