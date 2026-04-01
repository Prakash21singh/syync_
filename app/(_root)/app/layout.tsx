import NavigationPanel from '@/components/navigation-panel';
import { auth } from '@/lib/auth';
import { authClient } from '@/lib/auth-client';
import { headers } from 'next/headers';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

async function AppLayout({ children }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <NavigationPanel isLoggedIn={!!session?.user} user={session?.user} />
      {children}
    </>
  );
}

export default AppLayout;
