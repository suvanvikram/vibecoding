import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinance } from '@/store/FinanceContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Wallet, TrendingUp, ShieldCheck, PieChart, ArrowRight, CheckCircle2, Mail, Lock, User as UserIcon } from 'lucide-react';

export function LoginPage() {
  const { signIn, signUp } = useFinance();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error: err } = await signIn(email.trim(), password);
        if (err) {
          setLoading(false);
          setError(err);
          return;
        }
        setSuccess(true);
      } else {
        const { error: err } = await signUp(email.trim(), password, name.trim());
        if (err) {
          setLoading(false);
          setError(err);
          return;
        }
        setSuccess(true);
      }
    } catch {
      setLoading(false);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)' }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left: Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col gap-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-success to-success-soft flex items-center justify-center shadow-glow">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight">FINOVA</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight">
              Your money.<br />
              <span className="text-gradient-success">One intelligent dashboard.</span>
            </h1>
            <p className="text-text-secondary mt-4 text-lg max-w-md">
              Track income, expenses, investments, and net worth — all in one beautifully designed place.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: TrendingUp, label: 'Smart Analytics', desc: 'Real-time insights' },
              { icon: ShieldCheck, label: 'Secure & Private', desc: 'Your data is encrypted' },
              { icon: PieChart, label: 'Investment Tracking', desc: 'Portfolio overview' },
              { icon: Wallet, label: 'Budget Control', desc: 'Stay on track' },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-4"
              >
                <f.icon className="w-5 h-5 text-success mb-2" />
                <div className="text-sm font-medium text-text-primary">{f.label}</div>
                <div className="text-xs text-text-secondary mt-0.5">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Login/Signup card */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="glass-strong rounded-3xl p-8 shadow-elevated"
        >
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </motion.div>
                <p className="text-text-primary font-medium">
                  {mode === 'login' ? 'Welcome back!' : 'Account created!'}
                </p>
                {mode === 'signup' && (
                  <p className="text-text-secondary text-sm mt-2 text-center max-w-xs">
                    Please check your email to confirm your account, then sign in.
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success to-success-soft flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold">FINOVA</span>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-text-primary">
                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                  </h2>
                  <p className="text-sm text-text-secondary mt-1">
                    {mode === 'login' ? 'Take control of your finances.' : 'Start your financial journey today.'}
                  </p>
                </div>

                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Input
                      label="Full Name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      icon={<UserIcon className="w-4 h-4" />}
                      autoComplete="name"
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                    autoComplete="email"
                    ref={emailRef}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                </motion.div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-danger"
                  >
                    {error}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button type="submit" size="lg" className="w-full" loading={loading}>
                    {!loading && (
                      <>
                        {mode === 'login' ? 'Login' : 'Create Account'}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="text-center text-xs text-text-secondary">
                  {mode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setMode('signup'); setError(''); }}
                        className="text-success hover:text-success-soft transition-colors font-medium"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => { setMode('login'); setError(''); }}
                        className="text-success hover:text-success-soft transition-colors font-medium"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </div>

                <p className="text-center text-xs text-text-tertiary pt-2">
                  Personal finance dashboard · Secure cloud storage
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
