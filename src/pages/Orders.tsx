import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { OrderWithItems } from '@/lib/types';
import { formatPrice } from '@/lib/types';
import EmptyState from '@/components/EmptyState';
import { Package, Loader2, ChevronRight } from 'lucide-react';

export default function Orders() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setOrders(data as OrderWithItems[]);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <EmptyState
          title="Please sign in"
          message="You need an account to view your orders."
          action={
            <button onClick={() => navigate('auth')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
              Sign In
            </button>
          }
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <div className="flex justify-center py-16">
          <Loader2 size={32} className="animate-spin text-text-tertiary" />
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <EmptyState
          title="No orders yet"
          message="Your order history will appear here once you make a purchase."
          action={
            <button onClick={() => navigate('shop')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
              Start Shopping
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">My Orders</h1>
      <p className="text-sm text-text-tertiary mb-8">View your complete order history.</p>

      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-border rounded-xl bg-white overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              className="w-full flex items-center justify-between p-4 lg:p-5 hover:bg-bg-light/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package size={20} className="text-primary-accent" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">Order #{order.id.slice(0, 8)}</div>
                  <div className="text-xs text-text-tertiary">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - {order.order_items.length} item(s)
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-bold">{formatPrice(order.total)}</div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">
                    {order.status}
                  </span>
                </div>
                <ChevronRight
                  size={20}
                  className={`text-text-tertiary transition-transform ${expandedId === order.id ? 'rotate-90' : ''}`}
                />
              </div>
            </button>

            {expandedId === order.id && (
              <div className="border-t border-border p-4 lg:p-5 bg-bg-light/30">
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-text-tertiary mb-2">Shipping Address</h4>
                    <p className="text-sm text-text-secondary">{order.customer_name}</p>
                    <p className="text-sm text-text-secondary">{order.shipping_address}</p>
                    <p className="text-sm text-text-secondary">{order.customer_phone}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-text-tertiary mb-2">Payment</h4>
                    <p className="text-sm text-text-secondary">{order.payment_method}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-tertiary">Subtotal</span>
                        <span>{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-tertiary">Shipping</span>
                        <span>{order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold">
                        <span>Total</span>
                        <span>{formatPrice(order.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-semibold uppercase text-text-tertiary mb-3">Items</h4>
                <div className="space-y-2">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-white border border-border rounded-lg p-3">
                      <img src={item.product_image} alt={item.product_name} className="w-12 h-12 object-cover rounded-md flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold truncate">{item.product_name}</div>
                        <div className="text-xs text-text-tertiary">{formatPrice(item.unit_price)} x {item.qty}</div>
                      </div>
                      <div className="text-sm font-bold flex-shrink-0">{formatPrice(item.line_total)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
