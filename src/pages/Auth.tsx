import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { Eye, EyeOff, Loader2, Mail, Lock, User as UserIcon, SkipForward, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Auth({ onSkip }: { onSkip?: () => void }) {
  const { signIn, signUp } = useAuth();
  const { navigate } = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google-style modal state
  const [googleOpen, setGoogleOpen] = useState(false);
  const [googleStep, setGoogleStep] = useState<'email' | 'password' | 'name'>('email');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'signup') {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        navigate('home');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        navigate('home');
      }
    }
  };

  const openGoogle = () => {
    setGoogleOpen(true);
    setGoogleStep('email');
    setGoogleEmail('');
    setGooglePassword('');
    setGoogleName('');
    setGoogleError(null);
  };

  const closeGoogle = () => {
    setGoogleOpen(false);
    setGoogleError(null);
    setGoogleLoading(false);
  };

  // Step 1: user enters email — we try to sign in to detect if the account exists.
  // If sign-in fails with "Invalid login credentials", we move to the name/password
  // creation step. If it fails for any other reason (e.g. weak password), we show
  // the error. If sign-in succeeds, we're done.
  const googleEmailNext = async () => {
    setGoogleError(null);
    setGoogleLoading(true);
    const { error } = await signIn(googleEmail, googlePassword || '__probe__');
    setGoogleLoading(false);

    if (!error) {
      navigate('home');
      return;
    }

    // Invalid credentials means no account yet (or wrong password) → go to password step
    if (error.toLowerCase().includes('invalid login credentials')) {
      setGoogleStep('password');
    } else {
      setGoogleError(error);
    }
  };

  // Step 2 (existing user): enter password to sign in
  const googlePasswordSignIn = async () => {
    setGoogleError(null);
    setGoogleLoading(true);
    const { error } = await signIn(googleEmail, googlePassword);
    setGoogleLoading(false);
    if (error) {
      setGoogleError(error);
    } else {
      navigate('home');
    }
  };

  // Step 2 (new user): create account
  const googleCreateAccount = async () => {
    setGoogleError(null);
    setGoogleLoading(true);
    const { error } = await signUp(googleEmail, googlePassword, googleName);
    setGoogleLoading(false);
    if (error) {
      setGoogleError(error);
    } else {
      navigate('home');
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      navigate('home');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-light py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-border rounded-xl p-6 md:p-8 shadow-sm">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary-black text-white rounded-lg flex items-center justify-center font-bold">S</div>
            <span className="font-bold text-xl">SHOPORA</span>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-sm text-text-tertiary text-center mb-6">
            {mode === 'login' ? 'Sign in to your account to continue shopping' : 'Join SHOPORA to start your shopping journey'}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Google sign-in button */}
            <button
              type="button"
              onClick={openGoogle}
              disabled={loading}
              className="w-full bg-white border border-border rounded-md py-3 text-sm font-semibold text-primary-black transition-all hover:bg-bg-light disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-3 shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[11px] text-text-tertiary font-medium uppercase tracking-wide">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {mode === 'signup' && (
              <div className="relative">
                <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full pl-11 pr-4 py-3 border border-border rounded-md text-sm outline-none transition-colors focus:border-primary-accent min-h-[44px]"
                />
              </div>
            )}
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                required
                className="w-full pl-11 pr-4 py-3 border border-border rounded-md text-sm outline-none transition-colors focus:border-primary-accent min-h-[44px]"
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full pl-11 pr-11 py-3 border border-border rounded-md text-sm outline-none transition-colors focus:border-primary-accent min-h-[44px]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-primary-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div className="text-sm text-error bg-error/10 rounded-md px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-primary-black text-white rounded-md py-3 text-sm font-semibold transition-all hover:bg-primary-accent disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {mode === 'login' ? 'Login' : 'Register'}
            </button>

            {/* Register toggle button */}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError(null);
              }}
              className="bg-white border border-border rounded-md py-3 text-sm font-semibold text-primary-black transition-all hover:bg-bg-light min-h-[44px]"
            >
              {mode === 'login' ? 'Register' : 'Back to Login'}
            </button>

            {/* Skip button */}
            <button
              type="button"
              onClick={handleSkip}
              className="text-sm font-medium text-text-tertiary hover:text-primary-accent transition-colors flex items-center justify-center gap-2 py-2"
            >
              <SkipForward size={16} />
              Skip — Continue as Guest
            </button>
          </form>
        </div>
      </div>

      {/* Google-style account chooser modal */}
      {googleOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
          onClick={closeGoogle}
        >
          <div
            className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 pt-7 pb-2">
              <div className="flex items-center gap-2 mb-5">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-[13px] text-text-tertiary">Sign in with Google</span>
              </div>

              {googleStep === 'email' && (
                <>
                  <h2 className="text-2xl font-normal text-text-primary mb-1">Sign in</h2>
                  <p className="text-base text-text-secondary mb-6">
                    Use your Google Account
                  </p>
                  <div className="relative mb-4">
                    <input
                      type="email"
                      value={googleEmail}
                      autoFocus
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && googleEmail && googleEmailNext()}
                      placeholder="Email or phone"
                      className="w-full px-4 py-3.5 border-2 border-border rounded text-base outline-none transition-colors focus:border-primary-accent min-h-[48px]"
                    />
                  </div>
                  {googleError && (
                    <p className="text-sm text-error mb-3">{googleError}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <button
                      type="button"
                      onClick={() => { closeGoogle(); }}
                      className="text-sm font-medium text-primary-accent hover:bg-primary-accent/5 rounded px-3 py-2 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={googleEmailNext}
                      disabled={!googleEmail || googleLoading}
                      className="bg-[#1a73e8] text-white text-sm font-medium rounded px-6 py-2.5 transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
                    >
                      {googleLoading && <Loader2 size={16} className="animate-spin" />}
                      Next
                    </button>
                  </div>
                </>
              )}

              {googleStep === 'password' && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <button
                      type="button"
                      onClick={() => { setGoogleStep('email'); setGoogleError(null); }}
                      className="text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-bg-light flex items-center justify-center text-sm font-semibold text-text-secondary flex-shrink-0">
                      {googleEmail.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm text-text-secondary truncate">{googleEmail}</span>
                  </div>
                  <h2 className="text-2xl font-normal text-text-primary mb-1">Welcome back</h2>
                  <p className="text-base text-text-secondary mb-6">
                    Enter your password
                  </p>
                  <div className="relative mb-2">
                    <input
                      type="password"
                      value={googlePassword}
                      autoFocus
                      onChange={(e) => setGooglePassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && googlePassword && googlePasswordSignIn()}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3.5 border-2 border-border rounded text-base outline-none transition-colors focus:border-primary-accent min-h-[48px]"
                    />
                  </div>
                  {googleError && (
                    <p className="text-sm text-error mb-3 mt-2">{googleError}</p>
                  )}
                  <p className="text-sm text-primary-accent mb-4 mt-2 cursor-pointer hover:underline">
                    Forgot password?
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <button
                      type="button"
                      onClick={() => { setGoogleStep('name'); setGoogleError(null); setGooglePassword(''); }}
                      className="text-sm font-medium text-primary-accent hover:bg-primary-accent/5 rounded px-3 py-2 transition-colors"
                    >
                      Create account
                    </button>
                    <button
                      type="button"
                      onClick={googlePasswordSignIn}
                      disabled={!googlePassword || googleLoading}
                      className="bg-[#1a73e8] text-white text-sm font-medium rounded px-6 py-2.5 transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
                    >
                      {googleLoading && <Loader2 size={16} className="animate-spin" />}
                      Sign in
                    </button>
                  </div>
                </>
              )}

              {googleStep === 'name' && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <button
                      type="button"
                      onClick={() => { setGoogleStep('email'); setGoogleError(null); }}
                      className="text-text-tertiary hover:text-text-primary transition-colors"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <span className="text-sm text-text-secondary truncate">{googleEmail}</span>
                  </div>
                  <h2 className="text-2xl font-normal text-text-primary mb-1">Create account</h2>
                  <p className="text-base text-text-secondary mb-6">
                    Enter your name and a password
                  </p>
                  <div className="relative mb-3">
                    <input
                      type="text"
                      value={googleName}
                      autoFocus
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="Full name"
                      className="w-full px-4 py-3.5 border-2 border-border rounded text-base outline-none transition-colors focus:border-primary-accent min-h-[48px]"
                    />
                  </div>
                  <div className="relative mb-2">
                    <input
                      type="password"
                      value={googlePassword}
                      onChange={(e) => setGooglePassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && googleName && googlePassword && googleCreateAccount()}
                      placeholder="Password (min 6 characters)"
                      className="w-full px-4 py-3.5 border-2 border-border rounded text-base outline-none transition-colors focus:border-primary-accent min-h-[48px]"
                    />
                  </div>
                  {googleError && (
                    <p className="text-sm text-error mb-3 mt-2">{googleError}</p>
                  )}
                  <div className="flex items-center justify-end mt-4">
                    <button
                      type="button"
                      onClick={googleCreateAccount}
                      disabled={!googleName || !googlePassword || googleLoading}
                      className="bg-[#1a73e8] text-white text-sm font-medium rounded px-6 py-2.5 transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
                    >
                      {googleLoading && <Loader2 size={16} className="animate-spin" />}
                      Create account
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-4 mt-6 border-t border-border flex items-center justify-between text-[11px] text-text-tertiary">
              <select className="bg-transparent outline-none cursor-pointer text-text-tertiary">
                <option>English (United States)</option>
              </select>
              <div className="flex gap-4">
                <span className="cursor-pointer hover:text-text-primary transition-colors">Help</span>
                <span className="cursor-pointer hover:text-text-primary transition-colors">Privacy</span>
                <span className="cursor-pointer hover:text-text-primary transition-colors">Terms</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
