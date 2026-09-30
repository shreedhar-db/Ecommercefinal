import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextType>({
  path: '',
  navigate: () => {},
});

export function useRouter() {
  return useContext(RouterContext);
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => parseHash());

  function parseHash(): string {
    const hash = window.location.hash.replace(/^#\/?/, '');
    return hash || 'home';
  }

  const navigate = useCallback((to: string) => {
    const clean = to.startsWith('#') ? to.slice(1) : to;
    const normalized = clean.startsWith('/') ? clean.slice(1) : clean;
    if (window.location.hash === '#' + (normalized.startsWith('/') ? normalized : '/' + normalized)) {
      setPath(normalized);
    } else {
      window.location.hash = '/' + normalized;
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setPath(parseHash());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}
