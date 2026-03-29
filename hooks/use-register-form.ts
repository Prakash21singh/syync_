import { authClient, signUp } from '@/lib/auth-client';
import { useCallback, useState } from 'react';

export const useRegisterForm = ({ redirectTo }: { redirectTo: string }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!name || !email || !password) throw new Error('InvalidCredential');
      if ([name, email, password].some((elem) => elem.trim() === ''))
        throw new Error('EmptyRequiredField');
      if (password.length < 6) throw new Error('PasswordStrength');

      await signUp.email(
        {
          email,
          name,
          password,
          callbackURL: redirectTo,
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
            console.log(err);
            setLoading(false);
            setError(err.error.message || 'An error occured while regitering user.');
          },
        },
      );
    } catch (error) {
      if (error instanceof Error) {
        error.message.includes('InvalidCredential')
          ? setError('Invalid credential format')
          : error.message.includes('PasswordStrength')
            ? setError('Password strength should be least 6 characters')
            : error.message.includes('EmptyRequiredField')
              ? setError('Fields cannot be empty')
              : setError('Something went wrong');
      }
    }
  }, []);

  return {
    name,
    email,
    password,
    showPassword,
    error,
    loading,
    togglePassword,
    setName,
    setPassword,
    setEmail,
    handleSubmit,
  };
};
