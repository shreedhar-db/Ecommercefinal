import { useRouter } from '@/lib/router';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  const { navigate } = useRouter();

  const shopLinks = [
    { label: 'All Products', path: 'shop' },
    { label: 'Best Sellers', path: 'shop' },
    { label: 'Deals', path: 'deals' },
    { label: 'Categories', path: 'categories' },
  ];

  const supportLinks = [
    { label: 'Shipping Information', path: 'info/shipping' },
    { label: 'Returns & Refunds', path: 'info/returns' },
    { label: 'FAQs', path: 'info/faqs' },
    { label: 'Help Center', path: 'info/help' },
  ];

  const companyLinks = [
    { label: 'About Us', path: 'about' },
    { label: 'Privacy Policy', path: 'info/privacy' },
    { label: 'Terms & Conditions', path: 'info/terms' },
  ];

  const payments = ['VISA', 'MC', 'UPI', 'Paypal', 'Apple', 'Google'];

  return (
    <footer className="bg-primary-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12 mb-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="font-bold text-lg mb-3">SHOPORA</div>
            <p className="text-sm text-white/70 leading-relaxed mb-4">
              Making online shopping simple, enjoyable, and accessible to everyone.
            </p>
            <div className="flex gap-2">
              {['f', 'X', 'IG', 'YT'].map((s) => (
                <div key={s} className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-xs font-bold hover:bg-primary-accent transition-colors cursor-pointer">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.path)} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4">Customer Support</h4>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.path)} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <button onClick={() => navigate(link.path)} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-4">Payment Methods</h4>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {payments.map((p) => (
                <div key={p} className="bg-white/10 rounded-md py-2.5 text-center text-[10px] lg:text-xs font-semibold">
                  {p}
                </div>
              ))}
            </div>
            <div className="bg-white/10 rounded-md px-3 py-3 flex items-center gap-2 text-xs">
              <ShieldCheck size={16} className="flex-shrink-0" />
              <span>Secure payments</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/70">
          <span>(c) 2026 SHOPORA. All rights reserved.</span>
          <div className="flex gap-5">
            <button onClick={() => navigate('info/privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => navigate('info/terms')} className="hover:text-white transition-colors">Terms of Service</button>
            <button onClick={() => navigate('info/sitemap')} className="hover:text-white transition-colors">Sitemap</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
