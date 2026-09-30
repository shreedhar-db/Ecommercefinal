export interface Category {
  id: string;
  name: string;
  description: string;
  image_url: string;
}

export interface Product {
  id: string;
  name: string;
  category: string | null;
  category_label: string;
  price: number;
  original_price: number;
  rating: number;
  reviews_count: number;
  badge: string;
  image_url: string;
  description: string;
  stock: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  qty: number;
  created_at: string;
}

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  unit_price: number;
  qty: number;
  line_total: number;
}

export interface OrderWithItems extends Order {
  order_items: OrderItem[];
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export function formatPrice(n: number): string {
  return '\u20B9' + Number(n).toLocaleString('en-IN');
}
