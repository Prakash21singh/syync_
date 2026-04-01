'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Zap, Plug, ScrollText, Settings, ChevronRight } from 'lucide-react';

import { IconCubeSend, IconCurrencyDollar, IconFileExport } from '@tabler/icons-react';

type NavItem = {
  id: string;
  path: string;
  icon: React.ReactNode;
  label: string;
};

const navItems: NavItem[] = [
  { id: 'sync', path: '/app', icon: <IconCubeSend size={18} />, label: 'Home' },
  { id: 'migration', path: '/migration', icon: <IconFileExport size={18} />, label: 'Migration' },
  {
    id: 'subscription',
    path: '/subscription',
    icon: <IconCurrencyDollar size={18} />,
    label: 'Subscription',
  },
  { id: 'settings', path: '/settings', icon: <Settings size={18} />, label: 'Settings' },
];

type Props = {
  isLoggedIn: boolean;
  user:
    | {
        id: string;
        name: string;
        email: string;
        avatar?: string | null;
      }
    | undefined;
};

function NavigationPanel({ isLoggedIn, user }: Props) {
  const pathname = usePathname();
  const [tooltip, setTooltip] = useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="left-2 absolute top-1/2 -translate-y-1/2 h-[98%] w-[56px] bg-white border border-neutral-200 shadow-sm rounded-sm flex flex-col items-center py-3 gap-1 z-50">
      {/* Logo */}
      <div className="mb-3 flex items-center justify-center w-9 h-9">
        <Image src="/logo.svg" alt="Logo" width={58} height={58} />
      </div>

      {/* Divider */}
      <div className="w-7 h-px bg-neutral-300 mb-2" />

      {/* Nav Items */}
      <div className="flex flex-col items-center gap-1 flex-1 w-full px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <div key={item.id} className="relative w-full flex justify-center group">
              <a
                href={item.path}
                onMouseEnter={() => setTooltip(item.id)}
                onMouseLeave={() => setTooltip(null)}
                className={`
                  w-9 h-9 rounded-sm flex items-center justify-center transition-all duration-150
                  ${
                    active
                      ? 'bg-primary/30 border text-stone-700'
                      : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700'
                  }
                `}
              >
                {item.icon}

                {/* Active indicator dot */}
                {/* {active && (
                  <span className='absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-violet-500 rounded-r-full' />
                )} */}
              </a>

              {/* Tooltip */}
              {tooltip === item.id && (
                <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 pointer-events-none z-50">
                  <div className="relative bg-neutral-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg">
                    {item.label}
                    {/* Arrow */}
                    <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-7 h-px bg-neutral-100 mb-2" />

      {/* User Avatar */}
      <div className="relative group">
        <button
          onMouseEnter={() => setTooltip('user')}
          onMouseLeave={() => setTooltip(null)}
          className="w-8 h-8 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center hover:ring-2 hover:ring-violet-400 hover:ring-offset-1 transition-all duration-150"
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </button>

        {tooltip === 'user' && (
          <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 pointer-events-none z-50">
            <div className="relative bg-neutral-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md whitespace-nowrap shadow-lg">
              Account
              <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-neutral-900" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavigationPanel;
