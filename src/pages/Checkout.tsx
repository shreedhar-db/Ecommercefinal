import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/types';
import EmptyState from '@/components/EmptyState';
import { Loader2, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { navigate } = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const [name, setName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <EmptyState
          title="Please sign in"
          message="You need an account to checkout."
          action={
            <button onClick={() => navigate('auth')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
              Sign In
            </button>
          }
        />
      </div>
    );
  }

  if (items.length === 0 && !success) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <EmptyState
          title="No items to checkout"
          message="Your cart is currently empty."
          action={
            <button onClick={() => navigate('shop')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
              Shop Now
            </button>
          }
        />
      </div>
    );
  }

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentMethod) return;
    setLoading(true);

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        shipping_address: address,
        payment_method: paymentMethod,
        subtotal,
        shipping_cost: shipping,
        total,
        status: 'confirmed',
      })
      .select()
      .single();

    if (orderError) {
      setLoading(false);
      return;
    }

    const orderItems = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      product_name: item.product?.name || '',
      product_image: item.product?.image_url || '',
      unit_price: item.product?.price || 0,
      qty: item.qty,
      line_total: (item.product?.price || 0) * item.qty,
    }));

    await supabase.from('order_items').insert(orderItems);
    await clearCart();
    setLoading(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <CheckCircle size={48} className="text-success mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your order has been placed!</h2>
          <p className="text-sm text-text-tertiary mb-6">Thank you for shopping with SHOPORA. Your order is confirmed.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('orders')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
              View Orders
            </button>
            <button onClick={() => navigate('shop')} className="bg-white border border-border rounded-md px-6 py-3 text-sm font-medium hover:bg-bg-light transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">Checkout</h1>
      <p className="text-sm text-text-tertiary mb-8">Complete your order.</p>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 lg:gap-8">
        {/* Form */}
        <div className="border border-border rounded-xl p-5 bg-white">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 border border-border rounded-md text-sm outline-none focus:border-primary-accent min-h-[44px]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full px-4 py-3 border border-border rounded-md text-sm outline-none focus:border-primary-accent min-h-[44px]"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
              className="w-full px-4 py-3 border border-border rounded-md text-sm outline-none focus:border-primary-accent min-h-[44px]"
            />
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Delivery Address"
              required
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-md text-sm outline-none focus:border-primary-accent resize-vertical"
            />
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full px-4 py-3 border border-border rounded-md text-sm outline-none focus:border-primary-accent min-h-[44px] bg-white cursor-pointer"
            >
              <option value="">Select Payment Method</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-black text-white rounded-md py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-primary-accent disabled:opacity-50"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="border border-border rounded-xl p-5 bg-white h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm gap-3">
                <span className="truncate">{item.product?.name} x {item.qty}</span>
                <span className="font-semibold flex-shrink-0">{formatPrice((item.product?.price || 0) * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm pt-3 border-t border-border">
            <span>Shipping</span>
            <span className="font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-3 mt-3 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-text-tertiary mt-4">This is a demo checkout. No real payment is processed.</p>
        </div>
      </form>
    </div>
  );
}
