import { useRouter } from '@/lib/router';
import { useWishlist } from '@/lib/wishlist';
import { useAuth } from '@/lib/auth';
import ProductCard from '@/components/ProductCard';
import EmptyState from '@/components/EmptyState';

export default function Wishlist() {
  const { navigate } = useRouter();
  const { products, loading } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <EmptyState
          title="Please sign in"
          message="You need an account to view your wishlist."
          action={
            <button onClick={() => navigate('auth')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
              Sign In
            </button>
          }
        />
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <EmptyState
          title="Your wishlist is empty"
          message="Add products with the heart button and they will appear here."
          action={
            <button onClick={() => navigate('shop')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
              Browse Products
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">Wishlist</h1>
      <p className="text-sm text-text-tertiary mb-8">Products you saved for later.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
