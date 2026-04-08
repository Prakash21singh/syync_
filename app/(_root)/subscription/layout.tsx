import SubscriptionSidebar from '@/components/subscription/sidebar';
import SubscriptionTopbar from '@/components/subscription/topbar';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function SubscriptionLayout({ children }: Props) {
  return (
    <div
      className="
            font-sarabun flex flex-col h-screen
        "
    >
      <SubscriptionTopbar />
      <div className="flex flex-1 w-full min-h-0 border">
        <SubscriptionSidebar />
        <div className="p-4 w-full flex-1 h-full overflow-auto">{children}</div>
      </div>
    </div>
  );
}
