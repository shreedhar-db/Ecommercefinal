import { useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { formatPrice } from '@/lib/types';
import EmptyState from '@/components/EmptyState';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { navigate } = useRouter();
  const { items, subtotal, updateQty, removeFromCart, loading } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <EmptyState
          title="Please sign in"
          message="You need an account to view your cart."
          action={
            <button onClick={() => navigate('auth')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
              Sign In
            </button>
          }
        />
      </div>
    );
  }

  if (items.length === 0 && !loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <EmptyState
          title="Your cart is empty"
          message="Add a product to see it here."
          action={
            <button onClick={() => navigate('shop')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
              Continue Shopping
            </button>
          }
        />
      </div>
    );
  }

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">Cart</h1>
      <p className="text-sm text-text-tertiary mb-8">Review your selected products.</p>

      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 lg:gap-8">
        {/* Items */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 border border-border rounded-lg p-3 bg-white"
            >
              <img
                src={item.product?.image_url}
                alt={item.product?.name}
                className="w-18 h-18 w-[72px] h-[72px] object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-1">{item.product?.name}</h3>
                <p className="text-xs text-text-tertiary mb-2">{formatPrice(item.product?.price || 0)} each</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-9 h-9 border border-border rounded-md flex items-center justify-center hover:bg-bg-light transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="text-sm font-semibold min-w-[2rem] text-center">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-9 h-9 border border-border rounded-md flex items-center justify-center hover:bg-bg-light transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2 flex items-center gap-1.5 text-xs font-semibold text-error bg-error/[0.06] border border-error/20 rounded-md px-3 py-2 hover:bg-error/10 transition-colors"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
              <div className="font-bold text-sm flex-shrink-0">{formatPrice((item.product?.price || 0) * item.qty)}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="border border-border rounded-xl p-5 bg-white h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span className="font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="flex justify-between text-lg font-bold pt-4 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button
            onClick={() => navigate('checkout')}
            className="w-full bg-primary-black text-white rounded-md py-3.5 text-sm font-semibold mt-4 transition-colors hover:bg-primary-accent"
          >
            Proceed to Checkout
          </button>
          <button
            onClick={() => navigate('shop')}
            className="w-full bg-white border border-border rounded-md py-3.5 text-sm font-semibold mt-2 transition-colors hover:bg-bg-light"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
