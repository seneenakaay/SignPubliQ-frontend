'use client';

import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as AuthService from '../../services/auth.service';

interface LoginFormData {
  email: string;
  password: string;
  mfaEnabled: boolean;
  mfaCode: string;
}

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    mfaEnabled: false,
    mfaCode: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showMFA, setShowMFA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    setLoading(true);
    console.log('[Login] Attempting login for:', formData.email);

    try {
      await AuthService.login(formData.email, formData.password);
      console.log('[Login] Login successful, redirecting...');
      setSuccess('Login successful!');
      // Short delay to show success message
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  const handleMFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.mfaCode) {
      setError('Please enter MFA code');
      return;
    }

    if (formData.mfaCode.length < 6) {
      setError('MFA code must be at least 6 digits');
      return;
    }

    setLoading(true);

    // Simulate MFA verification
    setTimeout(() => {
      setSuccess('Login successful!');
      setLoading(false);
      // Here you would redirect to dashboard
    }, 1000);
  };

  // Forgot password: send reset link (simulated)
  const handleSendReset = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail) {
      setForgotError('Email is required');
      return;
    }

    if (!validateEmail(forgotEmail)) {
      setForgotError('Please enter a valid email address');
      return;
    }

    setForgotLoading(true);

    // Simulate sending reset email
    setTimeout(() => {
      setForgotSuccess('If this email is registered, a reset link has been sent.');
      setForgotLoading(false);
      setForgotEmail('');
      // Auto-close modal after a short delay
      setTimeout(() => setShowForgotModal(false), 1800);
    }, 1000);
  };

  // Close modal on Escape
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape' && showForgotModal) setShowForgotModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showForgotModal]);

  if (mfaRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-6">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Verify Your Identity
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Enter the code from your authenticator app or email
              </p>
            </div>

            <form onSubmit={handleMFASubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-400 text-sm">{success}</p>
                </div>
              )}

              <div>
                <label htmlFor="mfaCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  MFA Code
                </label>
                <input
                  id="mfaCode"
                  type="text"
                  name="mfaCode"
                  value={formData.mfaCode}
                  onChange={handleInputChange}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e95e5] dark:bg-slate-700 dark:text-white text-center text-lg tracking-widest"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3e95e5] hover:bg-[#2d7bc9] disabled:bg-slate-400 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </button>

              <button
                type="button"
                onClick={() => setMfaRequired(false)}
                className="w-full text-[#3e95e5] hover:text-[#2d7bc9] font-semibold py-2"
              >
                Back to Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-[#3e95e5] hover:text-[#2d7bc9] font-semibold transition"
          >
            ← Back to Home
          </Link>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Welcome back to
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3e95e5] mt-2">
              SignPubliQ
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm md:text-base">
              Sign in to your account to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5 mb-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e95e5] dark:bg-slate-700 dark:text-white transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#3e95e5] hover:text-[#2d7bc9] transition"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e95e5] dark:bg-slate-700 dark:text-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3e95e5] hover:bg-[#2d7bc9] disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center mt-6"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="font-semibold text-[#3e95e5] hover:text-[#2d7bc9] transition"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/40" onClick={() => setShowForgotModal(false)} />
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-md z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Forgot Password?</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Enter your registered email ID to receive the password reset link</p>
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {forgotError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-800 dark:text-red-400 text-sm">{forgotError}</p>
                </div>
              )}

              {forgotSuccess && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-400 text-sm">{forgotSuccess}</p>
                </div>
              )}

              <form onSubmit={handleSendReset} className="space-y-4">
                <div>
                  <label htmlFor="forgotEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Registered Email
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    name="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={`w-full px-4 py-2 border ${forgotError ? 'border-red-400 dark:border-red-700' : 'border-slate-300 dark:border-slate-600'} rounded-lg focus:outline-none focus:ring-2 ${forgotError ? 'focus:ring-red-400' : 'focus:ring-[#3e95e5]'} dark:bg-slate-700 dark:text-white transition`}
                  />
                </div>

                <div className="flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="bg-[#3e95e5] hover:bg-[#2d7bc9] disabled:bg-slate-400 text-white font-semibold px-4 py-2 rounded-lg transition"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin inline-block" />
                        Sending...
                      </>
                    ) : (
                      'Send reset link'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
