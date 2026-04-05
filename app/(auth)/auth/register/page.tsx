import Register from '@/components/auth/register';
import AuthLayout from '@/components/layout/auth/auth-layout';
import { Metadata } from 'next';

type Props = {};

export const metadata: Metadata = {
  title: 'Sync | Register',
  description: 'Register into your account',
  keywords: ['Register', 'Create Account', 'New Account'],
};

function RegisterPage({}: Props) {
  return (
    <AuthLayout>
      <Register />
    </AuthLayout>
  );
}

export default RegisterPage;
