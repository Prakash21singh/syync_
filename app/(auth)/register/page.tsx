'use client';
import { signUp } from '@/lib/auth-client';
import React, { useState } from 'react';

type Props = {};

function RegisterPage({}: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <form
        action=""
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await signUp.email(
              {
                email,
                password,
                name: email.split('@')[0],
              },
              {
                onRequest: () => {
                  console.log('Requesting sign up...');
                },
                onSuccess: (data) => {
                  console.log('Sign up successful:', data);
                },
                onError: (error) => {
                  console.log('Sign up error:', error);
                  if (error && error.error) {
                    setError(error.error.message);
                  }
                },
              },
            );
          } catch (error) {
            console.error(error);
          }
        }}
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
