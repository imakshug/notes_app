import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const SimpleAuthModal = () => {
  const { login, register, forgotPassword, resetPassword, isLoading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    resetToken: '',
    newPassword: ''
  });
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check for reset token in URL params on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setIsResetPassword(true);
      setIsLogin(false);
      setIsForgotPassword(false);
      setCredentials(prev => ({ ...prev, resetToken }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    
    try {
      if (isForgotPassword) {
        await forgotPassword(credentials.email);
        setSuccessMessage('If the email exists, a password reset link has been sent.');
      } else if (isResetPassword) {
        await resetPassword(credentials.resetToken, credentials.newPassword);
        setSuccessMessage('Password has been reset successfully. You can now log in.');
        setIsResetPassword(false);
        setIsForgotPassword(false);
        setIsLogin(true);
      } else if (isLogin) {
        await login({
          email: credentials.email,
          password: credentials.password
        });
      } else {
        await register({
          username: credentials.username || credentials.email.split('@')[0],
          email: credentials.email,
          password: credentials.password
        });
      }
      console.log('Authentication successful!');
    } catch (error) {
      console.error('Auth error:', error);
      setLocalError(`${isForgotPassword ? 'Password reset request' : isResetPassword ? 'Password reset' : isLogin ? 'Login' : 'Registration'} failed: ${error.message}`);
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPassword(true);
    setIsLogin(false);
    setLocalError('');
    setSuccessMessage('');
  };

  const handleBackToLogin = () => {
    setIsForgotPassword(false);
    setIsResetPassword(false);
    setIsLogin(true);
    setLocalError('');
    setSuccessMessage('');
  };

  const handleGoogleSignIn = async () => {
    try {
      // Placeholder for Google Sign-in integration
      // In a real app, you would integrate with Google OAuth
      setLocalError('Google Sign-in is currently unavailable. Please use email authentication.');
    } catch {
      setLocalError('Google Sign-in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-lavender-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Elements - Lavender Theme */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Lavender flowers */}
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🌸</div>
        <div className="absolute top-20 right-20 text-5xl opacity-25 animate-pulse delay-1000">💜</div>
        <div className="absolute top-3/4 left-1/3 text-3xl opacity-25 animate-bounce delay-1200">🌺</div>
        <div className="absolute top-16 right-1/4 text-4xl opacity-18 animate-pulse delay-800">🪻</div>
      </div>
      
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(147, 197, 253, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(196, 181, 253, 0.2) 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, rgba(167, 139, 250, 0.2) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-300/40 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-200 via-lavender-200 to-indigo-200 px-8 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent mb-2">
                My Notes
              </h1>
              <p className="text-purple-700 text-sm font-medium">
                Your moodboard for life's notes
              </p>
            </div>
          </div>

          {/* Content Area */}
          <div className="px-8 py-8">

            {/* Tab Switcher / Header */}
            {!isForgotPassword && !isResetPassword && (
              <div className="flex mb-6 bg-purple-50 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                    isLogin 
                      ? 'bg-gradient-to-r from-purple-300 to-indigo-300 text-indigo-900 shadow-sm' 
                      : 'text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                    !isLogin 
                      ? 'bg-gradient-to-r from-purple-300 to-indigo-300 text-indigo-900 shadow-sm' 
                      : 'text-purple-700 hover:bg-purple-100'
                  }`}
                >
                  Register
                </button>
              </div>
            )}

            {(isForgotPassword || isResetPassword) && (
              <div className="mb-6 text-center">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                  {isForgotPassword ? 'Reset Your Password' : 'Set New Password'}
                </h3>
                <p className="text-purple-600 text-sm">
                  {isForgotPassword 
                    ? 'Enter your email address and we\'ll send you a reset link.'
                    : 'Enter your new password below.'
                  }
                </p>
              </div>
            )}

            {/* Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full mb-4 py-3 px-4 bg-white border-2 border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center shadow-sm"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-indigo-200"></div>
              <span className="px-3 text-sm text-indigo-600 font-medium">or</span>
              <div className="flex-1 h-px bg-indigo-200"></div>
            </div>

            {/* Error/Success Messages */}
            {(localError || error || successMessage) && (
              <div className="mb-4">
                {(localError || error) && (
                  <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {localError || error}
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {successMessage}
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username field (register only) */}
              {!isLogin && !isForgotPassword && !isResetPassword && (
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-2">
                    Username (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={credentials.username}
                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    className="w-full px-4 py-3 bg-white/75 border-2 border-purple-200 rounded-lg focus:border-indigo-400 focus:outline-none transition-all duration-200 placeholder-purple-400"
                  />
                </div>
              )}

              {/* Email field (login, register, forgot password) */}
              {!isResetPassword && (
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    className="w-full px-4 py-3 bg-white/75 border-2 border-purple-200 rounded-lg focus:border-indigo-400 focus:outline-none transition-all duration-200 placeholder-purple-400"
                    required
                  />
                </div>
              )}

              {/* Password field (login, register) */}
              {!isForgotPassword && !isResetPassword && (
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="w-full px-4 py-3 bg-white/75 border-2 border-purple-200 rounded-lg focus:border-indigo-400 focus:outline-none transition-all duration-200 placeholder-purple-400"
                    required
                  />
                </div>
              )}

              {/* New Password field (reset password only) */}
              {isResetPassword && (
                <div>
                  <label className="block text-sm font-medium text-indigo-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter your new password"
                    value={credentials.newPassword}
                    onChange={(e) => setCredentials({...credentials, newPassword: e.target.value})}
                    className="w-full px-4 py-3 bg-white/75 border-2 border-purple-200 rounded-lg focus:border-indigo-400 focus:outline-none transition-all duration-200 placeholder-purple-400"
                    required
                  />
                </div>
              )}

              {/* Forgot Password Link */}
              {isLogin && !isForgotPassword && !isResetPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-gradient-to-r from-purple-300 via-indigo-300 to-violet-300 hover:from-purple-400 hover:via-indigo-400 hover:to-violet-400 text-indigo-900 shadow-sm hover:shadow-md'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isForgotPassword ? 'Sending reset link...' : isResetPassword ? 'Resetting password...' : isLogin ? 'Signing in...' : 'Creating account...'}
                  </span>
                ) : (
                  <span>
                    {isForgotPassword ? 'Send Reset Link' : isResetPassword ? 'Reset Password' : isLogin ? 'Sign In' : 'Create Account'}
                  </span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              {!isForgotPassword && !isResetPassword && (
                <p className="text-sm text-indigo-600">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
                  >
                    {isLogin ? 'Register here' : 'Sign in instead'}
                  </button>
                </p>
              )}
              
              {(isForgotPassword || isResetPassword) && (
                <p className="text-sm text-indigo-600">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="font-semibold text-indigo-700 hover:text-indigo-800 hover:underline"
                  >
                    ← Back to Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAuthModal;