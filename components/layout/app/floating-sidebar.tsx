'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function FloatingSidebar({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClickOutside() {
    setIsOpen(false);
  }

  return (
    <div className="absolute right-4 top-4">
      <Button
        onClick={() => setIsOpen(true)}
        className="cursor-pointer bg-surface hover:bg-foreground/10"
        variant={'secondary'}
      >
        <Menu className="w-8 h-8" />
      </Button>

      {isOpen && (
        <>
          {isLoggedIn ? (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg z-50">
              <a
                href="/dashboard"
                className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/10"
              >
                Dashboard
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/10"
              >
                Settings
              </a>
              <a
                href="/logout"
                className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/10"
              >
                Logout
              </a>
            </div>
          ) : (
            <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg z-50">
              <a
                href="/login"
                className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/10"
              >
                Login
              </a>
              <a
                href="/register"
                className="block px-4 py-2 text-sm text-foreground hover:bg-foreground/10"
              >
                Register
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
