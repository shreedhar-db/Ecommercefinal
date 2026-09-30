import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from '@/lib/router';
import type { Category } from '@/lib/types';
import SectionHeader from '@/components/SectionHeader';
import { Loader2 } from 'lucide-react';

export default function Categories() {
  const { navigate } = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data, error }) => {
      if (!error && data) setCategories(data as Category[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <SectionHeader label="Categories" title="Shop by Category" description="Explore our curated collections across all departments" />
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-text-tertiary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate('category/' + cat.id)}
              className="group bg-white border border-border rounded-xl overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[16/9] bg-bg-light overflow-hidden">
                <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 lg:p-6">
                <h3 className="text-lg font-semibold mb-1">{cat.name}</h3>
                <p className="text-xs text-text-tertiary">{cat.description}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
