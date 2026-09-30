import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import { useRouter } from '@/lib/router';
import { Loader2 } from 'lucide-react';

export default function Deals() {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .gt('original_price', 0)
      .then(({ data, error }) => {
        if (!error && data) {
          setProducts((data as Product[]).filter((p) => p.original_price > p.price));
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">Deals</h1>
      <p className="text-sm text-text-tertiary mb-8">Limited-time offers and promotional products.</p>

      <div className="bg-bg-light rounded-lg px-4 py-3 mb-6 text-sm text-text-secondary">
        Flash Sale products are connected to the same product and cart data used throughout the store.
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-text-tertiary" />
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No deals available"
          message="Check back soon for exclusive offers and flash sales."
          action={
            <button onClick={() => navigate('shop')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
              Browse Products
            </button>
          }
        />
      )}
    </div>
  );
}
