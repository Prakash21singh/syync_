'use client';

import { useState, useCallback } from 'react';
import { signIn } from '@/lib/auth-client';

type UseLoginFormOptions = {
  redirectTo?: string;
};

export function useLoginForm({ redirectTo = '/dashboard' }: UseLoginFormOptions = {}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleRememberMe = useCallback(() => {
    setRememberMe((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }

      await signIn.email(
        {
          email,
          password,
          callbackURL: redirectTo,
          rememberMe,
        },
        {
          onRequest: () => {
            setLoading(true);
            setError('');
          },
          onSuccess: () => {
            setLoading(false);
          },
          onError: (err) => {
            setLoading(false);
            setError(err.error.message || 'An error occurred while logging in.');
          },
        },
      );
    },
    [email, password, redirectTo, rememberMe],
  );

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePassword,
    error,
    loading,
    rememberMe,
    toggleRememberMe,
    handleSubmit,
  };
}
