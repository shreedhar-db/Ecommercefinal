import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

export default function SearchPage({ query }: { query: string }) {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState(query);

  useEffect(() => {
    setSearchValue(query);
    setLoading(true);
    supabase
      .from('products')
      .select('*')
      .then(({ data, error }) => {
        if (!error && data) {
          const q = query.toLowerCase();
          const filtered = (data as Product[]).filter((p) =>
            !q ||
            p.name.toLowerCase().includes(q) ||
            p.category_label.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
          );
          setProducts(filtered);
        }
        setLoading(false);
      });
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate('search/' + encodeURIComponent(searchValue.trim()));
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">Search Results</h1>
      <p className="text-sm text-text-tertiary mb-6">
        {query ? `Results for "${query}"` : 'Search the SHOPORA catalog.'}
      </p>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="flex items-center bg-white border border-border rounded-md px-3 py-2.5 flex-1">
          <SearchIcon size={18} className="text-text-tertiary flex-shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search catalog..."
            className="bg-transparent border-none outline-none text-sm ml-2 w-full"
          />
        </div>
        <button type="submit" className="bg-primary-black text-white rounded-md px-6 py-2.5 text-sm font-medium hover:bg-primary-accent transition-colors">
          Search
        </button>
      </form>

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
          title="No products found"
          message="Try another product name or category."
        />
      )}
    </div>
  );
}
