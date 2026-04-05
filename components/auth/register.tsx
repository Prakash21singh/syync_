'use client';

import React, { useCallback } from 'react';
import { useRegisterForm } from '@/hooks/use-register-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function RegisterForm() {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    togglePassword,
    error,
    loading,
    handleSubmit,
  } = useRegisterForm({ redirectTo: '/app' });

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
    [setName],
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    [setEmail],
  );

  const handlePasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
    [setPassword],
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">Create an account</h2>
        <p className="text-sm text-muted-foreground">Enter your details to get started.</p>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      {/* Name */}
      <div className="flex flex-col gap-2">
        <label htmlFor="register-name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <Input
          id="register-name"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={handleNameChange}
          required
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label htmlFor="register-email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          id="register-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label htmlFor="register-password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Min. 8 characters"
            value={password}
            onChange={handlePasswordChange}
            autoComplete="new-password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating account...' : 'Create account'}
      </Button>

      {/* Sign in link */}
      <p className="text-center text-sm text-muted-foreground">
        {'Already have an account? '}
        <Link
          href="/auth/login"
          className="text-foreground font-medium hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default React.memo(RegisterForm);
