import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth';
import type { CartItemWithProduct, Product } from './types';

interface CartContextType {
  items: CartItemWithProduct[];
  count: number;
  subtotal: number;
  loading: boolean;
  addToCart: (productId: string, qty?: number) => Promise<void>;
  updateQty: (cartItemId: string, qty: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  subtotal: 0,
  loading: false,
  addToCart: async () => {},
  updateQty: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
});

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setItems(data as unknown as CartItemWithProduct[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(async (productId: string, qty = 1) => {
    if (!user) return;
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      await supabase
        .from('cart_items')
        .update({ qty: existing.qty + qty })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('cart_items')
        .insert({ user_id: user.id, product_id: productId, qty });
    }
    await refreshCart();
  }, [user, items, refreshCart]);

  const updateQty = useCallback(async (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      await supabase.from('cart_items').delete().eq('id', cartItemId);
    } else {
      await supabase.from('cart_items').update({ qty }).eq('id', cartItemId);
    }
    await refreshCart();
  }, [refreshCart]);

  const removeFromCart = useCallback(async (cartItemId: string) => {
    await supabase.from('cart_items').delete().eq('id', cartItemId);
    await refreshCart();
  }, [refreshCart]);

  const clearCart = useCallback(async () => {
    if (!user) return;
    await supabase.from('cart_items').delete().eq('user_id', user.id);
    await refreshCart();
  }, [user, refreshCart]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, count, subtotal, loading, addToCart, updateQty, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}
