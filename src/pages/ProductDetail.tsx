import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { useAuth } from '@/lib/auth';
import type { Product } from '@/lib/types';
import { formatPrice } from '@/lib/types';
import { Star, Heart, ShoppingCart, ArrowLeft, Check, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

export default function ProductDetail({ id }: { id: string }) {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setProduct(data as Product);
        else setProduct(null);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('auth');
      return;
    }
    if (!product) return;
    await addToCart(product.id, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleWishlist = async () => {
    if (!user) {
      navigate('auth');
      return;
    }
    if (product) await toggle(product.id);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-bg-light rounded-xl aspect-square animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-bg-light rounded animate-pulse w-3/4" />
            <div className="h-6 bg-bg-light rounded animate-pulse w-1/2" />
            <div className="h-24 bg-bg-light rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Product unavailable</h2>
          <p className="text-sm text-text-tertiary mb-6">Try another product from the shop.</p>
          <button onClick={() => navigate('shop')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const wished = has(product.id);

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <button onClick={() => navigate('shop')} className="flex items-center gap-2 text-sm font-semibold mb-6 hover:text-primary-accent transition-colors">
        <ArrowLeft size={16} />
        Back to Shop
      </button>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div>
          <div className="w-full aspect-square bg-bg-light rounded-xl overflow-hidden">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Details */}
        <div>
          <span className="text-[11px] text-text-tertiary uppercase tracking-wider block mb-2">{product.category_label}</span>
          <h1 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">{product.name}</h1>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(product.rating) ? 'text-primary-accent fill-primary-accent' : 'text-border'}
                />
              ))}
            </div>
            <span className="text-xs text-text-tertiary">{product.rating} ({product.reviews_count} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.original_price > product.price && (
              <span className="text-base text-text-tertiary line-through">{formatPrice(product.original_price)}</span>
            )}
          </div>

          <p className="text-sm text-text-secondary leading-relaxed mb-6">{product.description}</p>

          {/* Quantity */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-bg-light transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-bg-light transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 min-w-[200px] bg-primary-black text-white rounded-md py-3.5 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-primary-accent"
            >
              {added ? <Check size={18} /> : <ShoppingCart size={18} />}
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              onClick={handleWishlist}
              className="bg-white border border-border rounded-md py-3.5 px-6 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-bg-light"
            >
              <Heart size={18} fill={wished ? 'currentColor' : 'none'} className={wished ? 'text-primary-accent' : ''} />
              {wished ? 'In Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck size={24} className="text-primary-accent" />
              <span className="text-[11px] text-text-tertiary">Free shipping over \u20B9999</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck size={24} className="text-primary-accent" />
              <span className="text-[11px] text-text-tertiary">Secure checkout</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw size={24} className="text-primary-accent" />
              <span className="text-[11px] text-text-tertiary">30-day returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
