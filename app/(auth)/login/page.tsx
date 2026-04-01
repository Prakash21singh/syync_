import Login from '@/components/auth/login';
import AuthLayout from '@/components/layout/auth/auth-layout';
import { constructMetadata } from '@/utils/functions/construct-metadata';

type Props = {};

export const metadata = constructMetadata({
  title: 'Login',
  description: 'Login to your account',
  keywords: ['login', 'authentication', 'account'],
});

function LoginPage({}: Props) {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}

export default LoginPage;
