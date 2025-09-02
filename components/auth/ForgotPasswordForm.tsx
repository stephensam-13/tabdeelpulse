
import React, { useState, FormEvent } from 'react';
import { EnvelopeIcon, PaperAirplaneIcon, XMarkIcon, CheckCircleIcon } from '../icons/Icons';

interface ForgotPasswordFormProps {
  onClose: () => void;
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onClose, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
      if (!email) {
        setError('Email address is required.');
        return false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Email address is invalid.');
        return false;
      }
      setError('');
      return true;
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log(`Password reset requested for: ${email}`);
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="relative bg-white dark:bg-dark-card rounded-lg shadow-xl p-8 max-w-md w-full">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <XMarkIcon className="h-6 w-6" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Forgot Password?</h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    No problem. Enter your email and we'll send you a reset link.
                </p>
            </div>
            <div>
              <label htmlFor="reset-email" className="sr-only">Email address</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                   <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`relative block w-full appearance-none rounded-md border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 px-3 py-3 pl-10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:z-10 focus:border-primary focus:outline-none focus:ring-primary sm:text-sm`}
                  placeholder="Enter your email address"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary py-3 px-4 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <PaperAirplaneIcon className="h-5 w-5 mr-2 -ml-1" />
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Check your email</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              We've sent a password reset link to <span className="font-medium text-gray-800 dark:text-gray-200">{email}</span>. Please follow the instructions in the email to reset your password.
            </p>
            <button
              onClick={onBackToLogin}
              className="mt-6 group relative flex w-full justify-center rounded-md border border-transparent bg-secondary py-3 px-4 text-sm font-semibold text-white hover:bg-secondary/90 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;