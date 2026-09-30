import SectionHeader from '@/components/SectionHeader';
import { ShieldCheck, Tag, Truck, RotateCcw } from 'lucide-react';

export default function About() {
  const features = [
    { icon: ShieldCheck, title: 'Carefully Selected Products', desc: 'Every item is hand-picked by our team to ensure quality and value.' },
    { icon: Tag, title: 'Great Prices', desc: 'Competitive pricing without compromising on quality or service.' },
    { icon: Truck, title: 'Simple Shopping', desc: 'Intuitive interface and quick checkout for seamless purchasing.' },
    { icon: RotateCcw, title: 'Customer First', desc: '24/7 support and hassle-free returns for complete peace of mind.' },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 lg:px-12 py-8 lg:py-12">
      <SectionHeader label="About Us" title="About SHOPORA" description="Simple shopping, carefully selected products, and a straightforward checkout experience." center />

      <div className="grid md:grid-cols-2 gap-4 lg:gap-6 max-w-4xl mx-auto">
        <div className="border border-border rounded-xl p-5 lg:p-6 bg-white">
          <h2 className="text-lg font-semibold mb-2">Why Choose SHOPORA</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            SHOPORA is a clean online shopping experience with carefully selected products, competitive prices, simple shopping, and customer-first service.
          </p>
        </div>
        <div className="border border-border rounded-xl p-5 lg:p-6 bg-white">
          <h2 className="text-lg font-semibold mb-2">Customer First</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            We offer easy shopping, quick checkout, regular deals, and hassle-free returns. Your satisfaction is our priority.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mt-8 lg:mt-12">
        {features.map((f) => (
          <div key={f.title} className="text-center">
            <div className="w-12 h-12 bg-primary-accent/10 rounded-lg mx-auto mb-5 flex items-center justify-center">
              <f.icon size={24} className="text-primary-accent" />
            </div>
            <h3 className="text-sm lg:text-base font-semibold mb-3">{f.title}</h3>
            <p className="text-xs lg:text-sm text-text-tertiary leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
