'use client';

import { usePath } from '@/hooks/use-path';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const NAVIGATION_LINKS = [
  { label: 'Home', path: '/app' },
  { label: 'Migrations', path: '/app/migration' },
  { label: 'Subscription', path: '/subscription' },
  { label: 'Settings', path: '/setting' },
];

function NavigationPanel() {
  const { isActive } = usePath();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      router.replace('/auth/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sticky font-sarabun top-0 z-50 bg-background border-b border-border px-6 py-3">
      <div className="flex items-center justify-between">
        {/* LEFT: LOGO */}
        <Link href="/app" className="font-semibold text-lg tracking-tight">
          <Image src={'/logo.svg'} alt="Sync" width={40} height={40} />
        </Link>

        {/* CENTER: NAV LINKS */}
        <div className="flex items-center gap-x-6 text-sm text-gray-700/80">
          {NAVIGATION_LINKS.map((nav) => (
            <Link
              key={nav.path}
              href={nav.path}
              className={cn(
                'transition-colors hover:text-black',
                isActive(nav.path, { exact: true }) && 'text-black font-medium',
              )}
            >
              {nav.label}
            </Link>
          ))}
        </div>

        {/* RIGHT: LOGOUT */}
        <button
          onClick={handleLogout}
          disabled={loading}
          className={cn(
            'text-sm px-4 py-1.5 rounded-md border transition',
            'hover:bg-black hover:text-white',
            loading && 'opacity-50 cursor-not-allowed',
          )}
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
}

export default NavigationPanel;
