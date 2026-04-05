import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type MatchOptions = {
  exact?: boolean;
};

export const usePath = () => {
  const pathname = usePathname();

  const isActive = (path: string, options?: MatchOptions) => {
    const { exact = false } = options || {};

    return useMemo(() => {
      if (!pathname) return false;

      if (exact) {
        return pathname === path;
      }

      return pathname.startsWith(path);
    }, [pathname, path, exact]);
  };

  const segments = useMemo(() => {
    if (!pathname) return [];
    return pathname.split('/').filter(Boolean);
  }, [pathname]);

  const current = useMemo(() => {
    return pathname || '/';
  }, [pathname]);

  return {
    pathname: current,
    segments,
    isActive,
  };
};
