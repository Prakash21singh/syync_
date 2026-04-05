import NavigationPanel from '@/components/navigation-panel';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

async function AppLayout({ children }: Props) {
  return (
    <>
      <NavigationPanel />
      {children}
    </>
  );
}

export default AppLayout;
