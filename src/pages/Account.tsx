import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { OrderWithItems } from '@/lib/types';
import { formatPrice } from '@/lib/types';
import { User, Mail, Phone, LogOut, Package, Loader2, Save } from 'lucide-react';

export default function Account() {
  const { user, profile, updateProfile, signOut } = useAuth();
  const { navigate } = useRouter();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data, error }) => {
        if (!error && data) setOrders(data as OrderWithItems[]);
        setLoadingOrders(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
        <div className="text-center py-16 border border-dashed border-border rounded-xl">
          <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
          <p className="text-sm text-text-tertiary mb-6">You need an account to view your profile.</p>
          <button onClick={() => navigate('auth')} className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({ full_name: fullName, phone });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">Account</h1>
      <p className="text-sm text-text-tertiary mb-8">Manage your profile and view your orders.</p>

      <div className="grid lg:grid-cols-[180px_1fr] gap-6 lg:gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-bg-light to-bg-lighter border-4 border-white shadow-lg flex items-center justify-center text-5xl font-bold text-primary-black overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              (fullName || user.email || 'S').charAt(0).toUpperCase()
            )}
          </div>
          <span className="text-sm font-semibold text-center break-all">{fullName || 'Your Profile'}</span>
          <span className="text-xs text-text-tertiary text-center break-all">{user.email}</span>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Profile Form */}
          <div className="border border-border rounded-xl p-5 bg-white">
            <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
            <form onSubmit={handleSave} className="flex flex-col gap-3 max-w-md">
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-md text-sm outline-none focus:border-primary-accent min-h-[44px]"
                />
              </div>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-md text-sm outline-none bg-bg-light text-text-tertiary min-h-[44px]"
                />
              </div>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-md text-sm outline-none focus:border-primary-accent min-h-[44px]"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="bg-primary-black text-white rounded-md py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-primary-accent disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={16} />}
                {saved ? 'Saved!' : 'Save Profile'}
              </button>
            </form>
          </div>

          {/* Recent Orders */}
          <div className="border border-border rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Package size={20} />
                Recent Orders
              </h2>
              <button onClick={() => navigate('orders')} className="text-sm text-primary-accent font-semibold hover:underline">
                View All
              </button>
            </div>
            {loadingOrders ? (
              <div className="flex justify-center py-8">
                <Loader2 size={24} className="animate-spin text-text-tertiary" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-sm text-text-tertiary py-6 text-center">No orders yet. Start shopping!</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border border-border rounded-lg p-3">
                    <div>
                      <div className="text-sm font-semibold">Order #{order.id.slice(0, 8)}</div>
                      <div className="text-xs text-text-tertiary">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{formatPrice(order.total)}</div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sign Out */}
          <button
            onClick={() => signOut().then(() => navigate('auth'))}
            className="flex items-center gap-2 text-sm font-semibold text-error bg-error/[0.06] border border-error/20 rounded-md px-4 py-3 hover:bg-error/10 transition-colors w-fit"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
