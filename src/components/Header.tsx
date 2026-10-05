import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { useCart } from '@/lib/cart';
import { useWishlist } from '@/lib/wishlist';
import { useAuth } from '@/lib/auth';
import { Heart, ShoppingCart, Search, Menu, X } from 'lucide-react';

export default function Header() {
  const { navigate, path } = useRouter();
  const { count: cartCount } = useCart();
  const { count: wishCount } = useWishlist();
  const { user, profile } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMenuOpen(false);
  }, [path]);

  const go = (to: string) => {
    navigate(to);
    setMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      go('search/' + encodeURIComponent(searchQuery.trim()));
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'Home', path: 'home' },
    { label: 'Shop', path: 'shop' },
    { label: 'Categories', path: 'categories' },
    { label: 'Deals', path: 'deals' },
    { label: 'About', path: 'about' },
  ];

  const mobileLinks = [...navLinks, { label: 'Account', path: 'account' }, { label: 'Wishlist', path: 'wishlist' }, { label: 'Cart', path: 'cart' }];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="mx-auto max-w-[1400px] px-4 lg:px-12">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <button onClick={() => go('home')} className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-primary-black text-white rounded-lg flex items-center justify-center font-bold text-sm">S</div>
              <span className="font-bold text-base tracking-tight whitespace-nowrap">SHOPORA</span>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => go(link.path)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    path === link.path ? 'text-primary-accent' : 'text-primary-black hover:text-primary-accent'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search - desktop */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-bg-light rounded-lg px-3 py-2 w-48 xl:w-64">
                <Search size={16} className="text-text-tertiary flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search catalog..."
                  className="bg-transparent border-none outline-none text-sm ml-2 w-full min-w-0"
                />
              </form>

              {/* Wishlist */}
              <button onClick={() => go('wishlist')} className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-light transition-colors">
                <Heart size={20} className="text-primary-black" />
                {wishCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-accent text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {wishCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button onClick={() => go('cart')} className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-light transition-colors">
                <ShoppingCart size={20} className="text-primary-black" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary-accent text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Account */}
              <button onClick={() => go(user ? 'account' : 'auth')} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-bg-light transition-colors">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-black to-primary-accent flex items-center justify-center text-white text-xs font-bold">
                    {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'G'}
                  </div>
                )}
                <span className="hidden lg:inline text-sm font-medium">{user ? 'Account' : 'Sign In'}</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-bg-light transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="lg:hidden fixed top-16 left-0 right-0 bg-white border-b border-border shadow-lg z-40">
          <div className="px-4 py-2">
            <form onSubmit={handleSearch} className="flex items-center bg-bg-light rounded-lg px-3 py-2.5 mb-2">
              <Search size={16} className="text-text-tertiary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-full"
              />
            </form>
            {mobileLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => go(link.path)}
                className="w-full text-left px-4 py-3.5 text-sm font-medium border-b border-border last:border-b-0 hover:bg-bg-light transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
