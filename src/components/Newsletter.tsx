import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function Newsletter() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ name, email, phone });
    if (error) {
      if (error.code === '23505') {
        setStatus('success');
        setName('');
        setEmail('');
        setPhone('');
      } else {
        setStatus('error');
      }
    } else {
      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-bg-light to-bg-light/70 py-16 lg:py-24 text-center overflow-hidden">
      <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-20">
        <Mail size={48} />
      </div>
      <div className="mx-auto max-w-[600px] px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">Stay Updated with Exclusive Offers</h2>
        <p className="text-sm md:text-base text-text-secondary mb-8 leading-relaxed">
          Subscribe to our newsletter and get early access to new products, special deals, and insider tips delivered straight to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-[500px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              className="px-4 py-3 border border-border rounded-md text-sm outline-none transition-colors focus:border-primary-accent min-h-[44px]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="px-4 py-3 border border-border rounded-md text-sm outline-none transition-colors focus:border-primary-accent min-h-[44px]"
            />
          </div>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number (Optional)"
            className="px-4 py-3 border border-border rounded-md text-sm outline-none transition-colors focus:border-primary-accent min-h-[44px]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-primary-black text-white rounded-md py-3 text-sm font-semibold transition-colors hover:bg-primary-accent disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2"
          >
            {status === 'loading' && <Loader2 size={16} className="animate-spin" />}
            {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
          </button>
        </form>

        {status === 'success' && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-success">
            <CheckCircle size={16} />
            Thank you! We'll send you exclusive offers soon.
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-error">
            <XCircle size={16} />
            Please fill in Name and Email fields.
          </div>
        )}

        <p className="text-[11px] md:text-xs text-text-tertiary mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
