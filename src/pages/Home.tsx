import { useEffect, useState } from 'react';
import { useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { Product, Category } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import Newsletter from '@/components/Newsletter';
import SectionHeader from '@/components/SectionHeader';
import { Star, Users, Sparkles, Tag, ShoppingBag, HeadphonesIcon, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

export default function Home() {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('products').select('*').limit(4),
      supabase.from('categories').select('*'),
    ]).then(([prodRes, catRes]) => {
      if (prodRes.data) setProducts(prodRes.data as Product[]);
      if (catRes.data) setCategories(catRes.data as Category[]);
      setLoading(false);
    });
  }, []);

  const trustItems = [
    { icon: Sparkles, title: 'Carefully Selected Products', desc: 'We hand-pick every item to ensure quality and value for your money.' },
    { icon: Tag, title: 'Great Prices', desc: 'Competitive pricing with regular discounts and exclusive deals.' },
    { icon: ShoppingBag, title: 'Simple Shopping', desc: 'Easy-to-use website and hassle-free checkout experience.' },
    { icon: HeadphonesIcon, title: 'Customer First', desc: '24/7 support and satisfaction guaranteed on every purchase.' },
  ];

  const features = [
    { icon: ShieldCheck, title: 'Carefully Selected Products', desc: 'Every item is hand-picked by our team to ensure quality and value.' },
    { icon: Tag, title: 'Great Prices', desc: 'Competitive pricing without compromising on quality or service.' },
    { icon: Truck, title: 'Simple Shopping', desc: 'Intuitive interface and quick checkout for seamless purchasing.' },
    { icon: RotateCcw, title: 'Customer First', desc: '24/7 support and hassle-free returns for complete peace of mind.' },
  ];

  const testimonials = [
    { name: 'Aarav Sharma', text: 'The shopping experience is incredibly simple. I found what I wanted quickly and the delivery was smooth.' },
    { name: 'Priya Desai', text: 'Great product quality and the prices are really competitive. I\'ll definitely shop here again.' },
    { name: 'Rohit Gupta', text: 'The website is easy to use and checkout was super quick.' },
  ];

  const flashProduct = products.find((p) => p.badge === 'Flash Sale');

  return (
    <div>
      {/* Hero */}
      <section className="py-6 px-4 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-bg-lighter px-4 py-1.5 rounded-full mb-4">
              <div className="w-2 h-2 bg-primary-accent rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-wider">New Collection 2026</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 lg:mb-5">
              Everything You Love. <span className="text-primary-accent">All in One Place.</span>
            </h1>
            <p className="text-sm md:text-base text-text-secondary mb-5 leading-relaxed max-w-lg">
              Discover quality products, exclusive deals, and everyday essentials carefully selected to make your shopping experience simple and enjoyable.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <button
                onClick={() => navigate('shop')}
                className="bg-primary-black text-white rounded-md px-6 py-3.5 md:px-10 text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate('categories')}
                className="bg-white text-primary-black border border-border rounded-md px-6 py-3.5 md:px-10 text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition-all hover:bg-bg-light"
              >
                Explore Collection
              </button>
            </div>

          </div>

          <div className="relative w-full aspect-[3/2] lg:h-[464px] bg-bg-light rounded-xl overflow-hidden shadow-lg lg:shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&h=500&fit=crop"
              alt="Featured products"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2.5 md:px-4 md:py-3 shadow-lg flex gap-2 items-start">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-primary-accent/15 rounded-full flex items-center justify-center flex-shrink-0">
                <Star size={16} className="text-primary-accent fill-primary-accent" />
              </div>
              <div>
                <h4 className="text-sm md:text-lg font-semibold leading-none mb-1">4.9 / 5.0</h4>
                <p className="text-[10px] md:text-[11px] text-text-tertiary">12,400+ Genuine Reviews</p>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2.5 md:px-4 md:py-3 shadow-lg flex gap-2 items-start">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-primary-accent/15 rounded-full flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-primary-accent" />
              </div>
              <div>
                <h4 className="text-sm md:text-lg font-semibold leading-none mb-1">10K+ Happy Shoppers</h4>
                <p className="text-[10px] md:text-[11px] text-text-tertiary">Active orders fulfilled this month</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-y border-border py-6 px-4 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {trustItems.map((item) => (
            <div key={item.title} className="flex gap-3 lg:gap-4 items-start">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon size={20} className="text-primary-accent" />
              </div>
              <div>
                <h4 className="text-xs lg:text-sm font-semibold mb-1">{item.title}</h4>
                <p className="text-[11px] lg:text-xs text-text-tertiary leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-4 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeader
            label="Categories"
            title="Shop by Category"
            description="Explore our curated collections across all departments"
          />
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
                  <h3 className="text-base lg:text-lg font-semibold mb-1">{cat.name}</h3>
                  <p className="text-[11px] lg:text-xs text-text-tertiary">{cat.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-6 px-4 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeader label="Bestsellers" title="Featured Products" description="Hand-picked products loved by our customers" />
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-bg-light rounded-xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
          <div className="text-center mt-8 lg:mt-10">
            <button
              onClick={() => navigate('shop')}
              className="bg-primary-black text-white rounded-md px-8 py-3.5 text-xs md:text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      {flashProduct && (
        <section className="py-6 px-4 lg:px-12 lg:py-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="relative bg-gradient-to-br from-bg-light to-bg-light/70 rounded-xl p-6 md:p-10 lg:p-14 grid lg:grid-cols-2 gap-6 lg:gap-12 overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] lg:w-[384px] lg:h-[384px] bg-primary-accent/[0.08] rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-full mb-4 w-fit text-[11px] font-semibold">
                  Limited Time Offer
                </div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-3 lg:mb-4">Flash Sale on Premium Collection</h2>
                <p className="text-sm md:text-base text-text-secondary mb-4 lg:mb-5 leading-relaxed">
                  Get up to 50% off on selected premium items. Hurry, stock is limited!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <button
                    onClick={() => navigate('deals')}
                    className="bg-primary-black text-white rounded-md px-6 py-3 text-xs md:text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Shop Flash Sale
                  </button>
                  <span className="text-xs text-text-tertiary py-3">Only today until 11:59 PM</span>
                </div>
              </div>
              <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-5 shadow-lg">
                <img
                  src={flashProduct.image_url}
                  alt={flashProduct.name}
                  className="w-full aspect-[4/3] object-cover rounded-lg mb-4"
                />
                <div className="flex justify-between gap-3 mb-3">
                  <div>
                    <h4 className="text-sm md:text-base font-semibold mb-1">{flashProduct.name}</h4>
                    <p className="text-[11px] md:text-xs text-text-tertiary">Ultra-premium collection</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-text-tertiary line-through">\u20B9{flashProduct.original_price.toLocaleString('en-IN')}</div>
                    <div className="text-lg md:text-xl font-bold text-primary-accent">\u20B9{flashProduct.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <div className="h-1.5 bg-border rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-primary-accent" style={{ width: '78%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-text-tertiary mb-3">
                  <span>78 Sold Out</span>
                  <span>22 Remaining</span>
                </div>
                <button
                  onClick={() => navigate('product/' + flashProduct.id)}
                  className="w-full bg-primary-black text-white rounded-md py-2.5 md:py-3 text-xs md:text-sm font-semibold transition-colors hover:bg-primary-accent"
                >
                  Get This Deal
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-6 px-4 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeader label="About Us" title="Why Choose SHOPORA" description="We're committed to delivering the best shopping experience" center />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {features.map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-11 h-11 lg:w-12 lg:h-12 bg-primary-accent/10 rounded-lg mx-auto mb-3 lg:mb-5 flex items-center justify-center">
                  <f.icon size={24} className="text-primary-accent" />
                </div>
                <h3 className="text-sm lg:text-base font-semibold mb-2 lg:mb-3">{f.title}</h3>
                <p className="text-xs lg:text-sm text-text-tertiary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-6 px-4 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-[1400px]">
          <SectionHeader label="Reviews" title="What Our Customers Say" description="Join thousands of satisfied shoppers who trust us" center />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-border rounded-xl p-4 lg:p-6">
                <div className="flex gap-1 mb-3 lg:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-primary-accent fill-primary-accent" />
                  ))}
                </div>
                <p className="text-xs lg:text-sm text-text-secondary leading-relaxed mb-3 lg:mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-10 lg:w-10 lg:h-10 bg-bg-light rounded-full flex items-center justify-center font-semibold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs lg:text-sm font-semibold">{t.name}</div>
                    <div className="text-[10px] lg:text-[11px] text-text-tertiary">Verified Purchase</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </div>
  );
}
