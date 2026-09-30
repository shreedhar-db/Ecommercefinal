import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import { Search, Loader2 } from 'lucide-react';

export default function Shop({ category }: { category?: string }) {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('products').select('*');
    if (category) {
      query = query.eq('category', category);
    }
    query.then(({ data, error }) => {
      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    });
  }, [category]);

  const filtered = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category_label.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const title = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'Shop';

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-text-tertiary">
          {category ? `Browse ${category} products available in SHOPORA.` : 'Explore the SHOPORA product catalog.'}
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex items-center bg-white border border-border rounded-md px-3 py-2.5 flex-1">
          <Search size={18} className="text-text-tertiary flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="bg-transparent border-none outline-none text-sm ml-2 w-full"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 border border-border rounded-md text-sm outline-none bg-white cursor-pointer"
        >
          <option value="default">Default Sort</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-bg-light rounded-xl aspect-[3/4] animate-pulse" />
          ))}
        </div>
      ) : sorted.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {sorted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No products found"
          message={searchQuery ? "Try another search term." : "No products in this category yet."}
          action={
            <button
              onClick={() => navigate('shop')}
              className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors"
            >
              View All Products
            </button>
          }
        />
      )}
    </div>
  );
}
