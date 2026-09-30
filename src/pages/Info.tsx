import { useRouter } from '@/lib/router';

const infoPages: Record<string, { title: string; description: string }> = {
  contact: { title: 'Contact Us', description: 'Reach SHOPORA through the contact information configured for your store.' },
  shipping: { title: 'Shipping Information', description: 'Free shipping is shown on orders over \u20B9999. Other shipping charges are calculated in the cart.' },
  returns: { title: 'Returns & Refunds', description: 'We offer a 30-day money-back guarantee. Contact support to process your return.' },
  faqs: { title: 'FAQs', description: 'Common shopping actions are available through Shop, Product Details, Cart, Wishlist, Account, and Checkout.' },
  help: { title: 'Help Center', description: 'Use the navigation and product actions to browse, save products, manage your cart, and complete checkout.' },
  privacy: { title: 'Privacy Policy', description: 'This page is provided as a navigation destination. A complete legal privacy policy should be configured for your store.' },
  terms: { title: 'Terms & Conditions', description: 'This page is provided as a navigation destination. Complete legal terms should be configured for your store.' },
  sitemap: { title: 'Sitemap', description: 'Use Home, Shop, Categories, Deals, Wishlist, Account, Cart, and Checkout to navigate SHOPORA.' },
};

export default function Info({ type }: { type: string }) {
  const { navigate } = useRouter();
  const info = infoPages[type] || { title: 'SHOPORA', description: 'Information page.' };

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <h1 className="text-3xl lg:text-4xl font-bold mb-2">{info.title}</h1>
      <div className="border border-border rounded-xl p-5 lg:p-6 bg-white max-w-2xl mt-6">
        <p className="text-sm text-text-secondary leading-relaxed mb-4">{info.description}</p>
        <button
          onClick={() => navigate('home')}
          className="bg-primary-black text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-primary-accent transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
