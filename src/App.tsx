import { RouterProvider, useRouter } from '@/lib/router';
import { AuthProvider, useAuth } from '@/lib/auth';
import { CartProvider } from '@/lib/cart';
import { WishlistProvider } from '@/lib/wishlist';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Wishlist from '@/pages/Wishlist';
import Checkout from '@/pages/Checkout';
import Account from '@/pages/Account';
import Orders from '@/pages/Orders';
import Categories from '@/pages/Categories';
import Deals from '@/pages/Deals';
import SearchPage from '@/pages/Search';
import About from '@/pages/About';
import Info from '@/pages/Info';
import { Loader2 } from 'lucide-react';

function Routes() {
  const { path } = useRouter();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <Loader2 size={32} className="animate-spin text-primary-accent" />
      </div>
    );
  }

  const parts = path.split('/').filter(Boolean);
  const route = parts[0] || 'home';

  switch (route) {
    case 'home':
      return <Home />;
    case 'auth':
      return <Auth />;
    case 'shop':
      return <Shop />;
    case 'category':
      return <Shop category={parts[1]} />;
    case 'categories':
      return <Categories />;
    case 'product':
      return <ProductDetail id={parts[1] || ''} />;
    case 'cart':
      return <Cart />;
    case 'wishlist':
      return <Wishlist />;
    case 'checkout':
      return <Checkout />;
    case 'account':
      return <Account />;
    case 'orders':
      return <Orders />;
    case 'deals':
      return <Deals />;
    case 'search':
      return <SearchPage query={decodeURIComponent(parts.slice(1).join('/'))} />;
    case 'about':
      return <About />;
    case 'info':
      return <Info type={parts[1] || ''} />;
    default:
      return <Home />;
  }
}

function AppShell() {
  const { path } = useRouter();
  const { user, loading } = useAuth();

  const parts = path.split('/').filter(Boolean);
  const route = parts[0] || 'home';
  const isOnAuthPage = route === 'auth';

  // Show login page first when:
  // - not still loading auth state
  // - user is not logged in
  // - user hasn't explicitly skipped (navigated to any non-auth page)
  const showLoginPage = !loading && !user && (route === 'home' && parts.length <= 1) && !isOnAuthPage;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <Loader2 size={32} className="animate-spin text-primary-accent" />
      </div>
    );
  }

  if (showLoginPage) {
    return <Auth />;
  }

  // If already logged in and on the auth page, go straight to home
  if (user && isOnAuthPage) {
    return <Home />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <Routes />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppShell />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
