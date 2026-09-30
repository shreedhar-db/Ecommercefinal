/*
# SHOPORA — Full E-Commerce Schema with Authentication

## Overview
This migration creates the complete database backend for SHOPORA, an online shopping
app. It supports user authentication, product catalog, categories, cart, wishlist,
orders, user profiles, and newsletter subscriptions.

## New Tables
1. `profiles` — Extended user profile data linked to auth.users (name, avatar image).
2. `categories` — Product categories (Electronics, Fashion, Beauty, etc.).
3. `products` — Full product catalog with pricing, images, ratings, badges, stock.
4. `cart_items` — Per-user shopping cart items (qty, product reference).
5. `wishlist_items` — Per-user wishlist (product references).
6. `orders` — Order header (customer info, totals, status, payment method).
7. `order_items` — Line items within an order (product snapshot, qty, price).
8. `newsletter_subscribers` — Email newsletter signups.

## Security
- RLS enabled on ALL tables.
- `profiles`: user can read/update only their own profile. INSERT on signup via trigger.
- `categories` + `products`: public read (anon + authenticated), no public writes.
- `cart_items`, `wishlist_items`: owner-scoped CRUD (user sees only their own).
- `orders`: user can read their own orders and insert new ones.
- `order_items`: readable if the parent order belongs to the user.
- `newsletter_subscribers`: public insert (anyone can subscribe), no public reads.

## Important Notes
- Owner columns default to `auth.uid()` so client inserts omitting user_id still work.
- A trigger auto-creates a profile row when a new auth user signs up.
- Product data is seeded so the storefront is populated immediately.
*/

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  email text DEFAULT '',
  avatar_url text DEFAULT '',
  phone text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT ''
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "categories_read_all" ON categories;
CREATE POLICY "categories_read_all" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text REFERENCES categories(id),
  category_label text DEFAULT '',
  price integer NOT NULL,
  original_price integer DEFAULT 0,
  rating numeric(2,1) DEFAULT 5.0,
  reviews_count integer DEFAULT 0,
  badge text DEFAULT '',
  image_url text DEFAULT '',
  description text DEFAULT '',
  stock integer DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_read_all" ON products;
CREATE POLICY "products_read_all" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- CART ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  qty integer NOT NULL DEFAULT 1 CHECK (qty > 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cart_select_own" ON cart_items;
CREATE POLICY "cart_select_own" ON cart_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_insert_own" ON cart_items;
CREATE POLICY "cart_insert_own" ON cart_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_update_own" ON cart_items;
CREATE POLICY "cart_update_own" ON cart_items FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "cart_delete_own" ON cart_items;
CREATE POLICY "cart_delete_own" ON cart_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- WISHLIST ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "wishlist_select_own" ON wishlist_items;
CREATE POLICY "wishlist_select_own" ON wishlist_items FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlist_insert_own" ON wishlist_items;
CREATE POLICY "wishlist_insert_own" ON wishlist_items FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlist_delete_own" ON wishlist_items;
CREATE POLICY "wishlist_delete_own" ON wishlist_items FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text DEFAULT '',
  shipping_address text NOT NULL,
  payment_method text NOT NULL,
  subtotal integer NOT NULL DEFAULT 0,
  shipping_cost integer NOT NULL DEFAULT 0,
  total integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "orders_select_own" ON orders;
CREATE POLICY "orders_select_own" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "orders_insert_own" ON orders;
CREATE POLICY "orders_insert_own" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  product_image text DEFAULT '',
  unit_price integer NOT NULL,
  qty integer NOT NULL,
  line_total integer NOT NULL
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "order_items_select_own" ON order_items;
CREATE POLICY "order_items_select_own" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(email)
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "newsletter_insert_any" ON newsletter_subscribers;
CREATE POLICY "newsletter_insert_any" ON newsletter_subscribers FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- ============================================================
-- SEED: CATEGORIES
-- ============================================================
INSERT INTO categories (id, name, description, image_url) VALUES
  ('electronics', 'Electronics', 'Gadgets & Accessories', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=338&fit=crop'),
  ('fashion', 'Fashion', 'Clothes & Footwear', 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&h=338&fit=crop'),
  ('beauty', 'Beauty', 'Skincare & Cosmetics', 'https://images.unsplash.com/photo-1535585209827-a7c75f004070?w=600&h=338&fit=crop')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SEED: PRODUCTS
-- ============================================================
INSERT INTO products (id, name, category, category_label, price, original_price, rating, reviews_count, badge, image_url, description) VALUES
  ('wireless-headphones', 'Wireless Headphones', 'electronics', 'Audio', 4999, 5999, 4.9, 385, 'Best Seller', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 'Premium wireless headphones with rich sound, comfortable ear cushions, and reliable everyday battery life.'),
  ('classic-sneakers', 'Classic Sneakers', 'fashion', 'Footwear', 3499, 4499, 4.7, 291, 'Hot Deal', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop', 'Classic everyday sneakers designed for comfortable walking and versatile casual styling.'),
  ('smart-watch-series-4', 'Smart Watch Series 4', 'electronics', 'Wearables', 12999, 15999, 4.8, 412, 'Premium', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', 'A premium smartwatch for everyday activity tracking, notifications, and convenient wrist controls.'),
  ('minimal-backpack', 'Minimal Backpack', 'fashion', 'Bags', 2999, 3999, 4.6, 156, 'New', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop', 'A clean, practical backpack with a minimal design for college, work, and everyday travel.'),
  ('limited-edition-watch', 'Limited Edition Watch', 'electronics', 'Watches', 9999, 18999, 4.8, 124, 'Flash Sale', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', 'Limited edition premium watch offered as part of the SHOPORA flash sale.')
ON CONFLICT (id) DO NOTHING;