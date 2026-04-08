'use client';
import { usePath } from '@/hooks/use-path';
import { cn } from '@/lib/utils';
import {
  IconCubePlus,
  IconDeviceDesktopCog,
  IconReceipt2,
  IconTrendingUp,
} from '@tabler/icons-react';
import Link from 'next/link';

type Props = {};

export const SUBSCRIPTION_SIDEBAR_NAVIGATIONS = [
  {
    path: '/subscription',
    label: 'Home',
    icon: IconReceipt2,
  },
  {
    path: '/subscription/plan',
    label: 'Plans',
    icon: IconCubePlus,
  },
  {
    path: '/subscription/usage',
    label: 'Usage',
    icon: IconTrendingUp,
  },
  {
    path: '/subscription/activity',
    label: 'Activity',
    icon: IconDeviceDesktopCog,
  },
];

function SubscriptionSidebar({}: Props) {
  const { isActive } = usePath();
  return (
    <div className="w-full max-w-60 p-6 border-r h-full">
      <div className="flex flex-col gap-y-2">
        {SUBSCRIPTION_SIDEBAR_NAVIGATIONS.map((nav) => (
          <Link
            key={nav.path}
            href={nav.path}
            className={cn(
              'text-sm text-gray-700 flex items-center gap-x-2 transition-all hover:-translate-y-0.5',
              isActive(nav.path, { exact: true }) ? 'text-black' : 'hover:text-black font-light',
            )}
          >
            <nav.icon width={18} /> {nav.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionSidebar;
