import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth';
import type { Product } from './types';

interface WishlistContextType {
  productIds: string[];
  products: Product[];
  count: number;
  loading: boolean;
  toggle: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
  productIds: [],
  products: [],
  count: 0,
  loading: false,
  toggle: async () => {},
  has: () => false,
  refresh: async () => {},
});

export function useWishlist() {
  return useContext(WishlistContext);
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [productIds, setProductIds] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setProductIds([]);
      setProducts([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('wishlist_items')
      .select('product:products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      const prods = data.map((d: any) => d.product as Product).filter(Boolean);
      setProducts(prods);
      setProductIds(prods.map((p) => p.id));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(async (productId: string) => {
    if (!user) return;
    if (productIds.includes(productId)) {
      await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
    } else {
      await supabase
        .from('wishlist_items')
        .insert({ user_id: user.id, product_id: productId });
    }
    await refresh();
  }, [user, productIds, refresh]);

  const has = useCallback((productId: string) => productIds.includes(productId), [productIds]);

  return (
    <WishlistContext.Provider value={{ productIds, products, count: productIds.length, loading, toggle, has, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}
