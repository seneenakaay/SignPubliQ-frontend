'use client';

import { useState } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader, Check, X } from 'lucide-react';
import Link from 'next/link';

interface SignupFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  otpCode: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    otpCode: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'form' | 'otp' | 'complete'>('form');
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Very Weak',
    color: 'bg-red-500',
  });

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengthLevels: PasswordStrength[] = [
      { score: 0, label: 'Very Weak', color: 'bg-red-500' },
      { score: 1, label: 'Weak', color: 'bg-orange-500' },
      { score: 2, label: 'Fair', color: 'bg-yellow-500' },
      { score: 3, label: 'Good', color: 'bg-lime-500' },
      { score: 4, label: 'Strong', color: 'bg-green-500' },
      { score: 5, label: 'Very Strong', color: 'bg-emerald-600' },
      { score: 6, label: 'Excellent', color: 'bg-emerald-700' },
    ];

    return strengthLevels[Math.min(score, 6)];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your first and last name');
      return false;
    }

    if (!formData.phoneNumber) {
      setError('Please enter your phone number');
      return false;
    }

    if (!/^\d{10,}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number');
      return false;
    }

    if (!formData.email) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setStep('otp');
      setSuccess('A verification code has been sent to your email');
      setLoading(false);
    }, 1000);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.otpCode) {
      setError('Please enter the OTP code');
      return;
    }

    if (formData.otpCode.length < 6) {
      setError('OTP code must be 6 digits');
      return;
    }

    setLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      setStep('complete');
      setSuccess('Account created successfully!');
      setLoading(false);
    }, 1000);
  };

  const handleOAuthSignup = (provider: 'google' | 'microsoft') => {
    setLoading(true);
    setError('');
    // Simulate OAuth signup
    setTimeout(() => {
      setSuccess(`Signing up with ${provider}...`);
      setLoading(false);
    }, 1000);
  };

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-6">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Account Created!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Your SignPubliQ account has been successfully created. You can now sign in.
            </p>

            <Link
              href="/login"
              className="inline-block w-full bg-[#3e95e5] hover:bg-[#2d7bc9] text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-6">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Verify Your Email
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                We've sent a verification code to <span className="font-semibold">{formData.email}</span>
              </p>
            </div>

            <form onSubmit={handleOTPSubmit} className="space-y-6">
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
                <label htmlFor="otpCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Verification Code
                </label>
                <input 
                  id="otpCode"
                  type="text"
                  name="otpCode"
                  value={formData.otpCode}
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
                  'Verify Email'
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full text-[#3e95e5] hover:text-[#2d7bc9] font-semibold py-2"
              >
                Back to Sign Up
              </button>
            </form>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
              Didn't receive the code?{' '}
              <button className="text-[#3e95e5] hover:text-[#2d7bc9] font-semibold">
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Create your free
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-[#3e95e5] mt-1">
              SignPubliQ account
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm md:text-base">
              Get started with digital signatures today
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

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4 mb-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e95e5] dark:bg-slate-700 dark:text-white transition"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="LastName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e95e5] dark:bg-slate-700 dark:text-white transition"
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e95e5] dark:bg-slate-700 dark:text-white transition"
                />
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      Password Strength
                    </span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.color === 'bg-red-500'
                        ? 'text-red-600'
                        : passwordStrength.color === 'bg-orange-500'
                        ? 'text-orange-600'
                        : passwordStrength.color === 'bg-yellow-500'
                        ? 'text-yellow-600'
                        : passwordStrength.color === 'bg-lime-500'
                        ? 'text-lime-600'
                        : passwordStrength.color === 'bg-green-500'
                        ? 'text-green-600'
                        : 'text-emerald-700'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{
                        width: `${(passwordStrength.score / 6) * 100}%`,
                      }}
                    ></div>
                  </div>

                  {/* Password Requirements */}
                  <div className="mt-3 space-y-1 text-xs">
                    <div className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-slate-500'}`}>
                      {formData.password.length >= 8 ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <X className="w-4 h-4 mr-1" />
                      )}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center ${/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-slate-500'}`}>
                      {/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password) ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <X className="w-4 h-4 mr-1" />
                      )}
                      Uppercase and lowercase letters
                    </div>
                    <div className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-slate-500'}`}>
                      {/[0-9]/.test(formData.password) ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <X className="w-4 h-4 mr-1" />
                      )}
                      At least one number
                    </div>
                    <div className={`flex items-center ${/[^a-zA-Z0-9]/.test(formData.password) ? 'text-green-600' : 'text-slate-500'}`}>
                      {/[^a-zA-Z0-9]/.test(formData.password) ? (
                        <Check className="w-4 h-4 mr-1" />
                      ) : (
                        <X className="w-4 h-4 mr-1" />
                      )}
                      At least one special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e95e5] dark:bg-slate-700 dark:text-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center text-sm">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-4 h-4 text-green-600 mr-1" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-600 mr-1" />
                      <span className="text-red-600">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3e95e5] hover:bg-[#2d7bc9] disabled:bg-slate-400 text-white font-semibold py-2.5 rounded-lg transition duration-200 flex items-center justify-center mt-6"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                Or sign up with
              </span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuthSignup('google')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#1f2937"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fbbc05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ea4335"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
                Google
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuthSignup('microsoft')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" fill="#0078d4"/>
              </svg>
              <span className="ml-2 text-sm font-medium text-slate-700 dark:text-slate-300 hidden sm:inline">
                Microsoft
              </span>
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-[#3e95e5] hover:text-[#2d7bc9] transition"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
