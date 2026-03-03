'use client';
import { cn } from '@/lib/utils';
import type { StatusMessage as StatusMessageType } from '@/types/index';

const STYLES = {
  error: { container: 'bg-red-50 border border-red-200', text: 'text-red-800' },
  success: { container: 'bg-green-50 border border-green-200', text: 'text-green-800' },
  info: { container: 'bg-blue-50 border border-blue-200', text: 'text-blue-800' },
  warning: { container: 'bg-yellow-50 border border-yellow-200', text: 'text-yellow-800' },
} as const;

interface Props {
  message: StatusMessageType | null;
  className?: string;
}

export function StatusMessage({ message, className }: Props) {
  if (!message) return null;
  const style = STYLES[message.type];

  return (
    <div className={cn('mt-6 p-4 rounded-md', style.container, className)}>
      <p className={cn('text-sm', style.text)}>{message.message}</p>
    </div>
  );
}
