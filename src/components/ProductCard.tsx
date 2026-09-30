import { useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { useAuth } from '@/lib/auth';
import { formatPrice, Product } from '@/lib/types';
import { Heart, ShoppingCart, Star } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const { navigate } = useRouter();
  const { addToCart } = useCart();
  const { has, toggle } = useWishlist();
  const { user } = useAuth();
  const wished = has(product.id);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('auth');
      return;
    }
    await addToCart(product.id, 1);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('auth');
      return;
    }
    await toggle(product.id);
  };

  return (
    <div
      onClick={() => navigate('product/' + product.id)}
      className="group bg-white border border-border rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-transparent hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative aspect-square bg-bg-light overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-[10px] font-semibold z-10 shadow-sm">
            {product.badge}
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm transition-all hover:bg-primary-accent hover:text-white z-10"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={wished ? 'currentColor' : 'none'} className={wished ? 'text-primary-accent hover:text-white' : ''} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 md:p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <span className="text-[10px] md:text-[11px] text-text-tertiary">{product.category_label}</span>
          <span className="flex items-center gap-1 text-[10px] md:text-[11px] text-text-tertiary">
            <Star size={11} className="fill-primary-accent text-primary-accent" />
            {product.rating} ({product.reviews_count})
          </span>
        </div>
        <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-3 line-clamp-2 leading-snug">{product.name}</h3>
        <div className="flex justify-between items-center gap-2">
          <span className="text-base md:text-lg font-semibold">{formatPrice(product.price)}</span>
          <button
            onClick={handleAddToCart}
            className="flex-1 max-w-[120px] bg-primary-black text-white rounded-md py-2 px-2 md:px-3 text-[11px] md:text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors hover:bg-primary-accent"
          >
            <ShoppingCart size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
