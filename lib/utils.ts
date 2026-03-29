import { Adapter } from '@/prisma/generated/prisma/client';
import { AdapterType } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shouldSkip(adapter_type: AdapterType) {
  if (adapter_type === 'AWS_S3') return true;
  return false;
}

export function isTokenExpiringSoon(expiresIn: Date, bufferMs: number = 2 * 60 * 1000): boolean {
  const expiresInMs = new Date(expiresIn).getTime();
  const nowWithBuffer = Date.now() + bufferMs;
  return expiresInMs <= nowWithBuffer;
}

export async function doesRequireTokenRotation(adapter: Partial<Adapter>): Promise<boolean> {
  if (shouldSkip(adapter.adapter_type!)) return false;
  if (!adapter.expires_in) return false;

  return isTokenExpiringSoon(adapter.expires_in);
}
