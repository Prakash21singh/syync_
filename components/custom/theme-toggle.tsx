'use client';
import { useTheme } from '@/provider/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Current: {actualTheme}
    </button>
  );
}
