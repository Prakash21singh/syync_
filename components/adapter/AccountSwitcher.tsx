'use client';
import Image from 'next/image';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { ExistingAdapter } from '@/types/index';

interface Props {
  adapters: ExistingAdapter[];
  selectedId: string;
  selectedAdapter: ExistingAdapter | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (id: string) => void;
  onAddAccount: () => void;
}

export function AccountSwitcher({
  adapters,
  selectedId,
  selectedAdapter,
  open,
  onOpenChange,
  onSelect,
  onAddAccount,
}: Props) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center gap-2 bg-muted px-3 py-2 rounded-sm border border-border cursor-pointer"
        >
          {selectedAdapter?.adapterAccountInfo?.avatar && (
            <Image
              src={selectedAdapter.adapterAccountInfo.avatar}
              alt={selectedAdapter.adapterAccountInfo.name ?? 'Account'}
              width={22}
              height={22}
              className="rounded-full object-cover flex-shrink-0"
            />
          )}
          <span className="text-xs text-foreground">
            {selectedAdapter?.adapterAccountInfo.email && selectedAdapter.adapterAccountInfo?.email?.slice(0, 10)  + '...'}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[320px] bg-background p-2"
        align="start"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="space-y-1">
          {adapters.map((adapter) => (
            <button
              key={adapter.id}
              type="button"
              onClick={() => {
                onSelect(adapter.id);
                onOpenChange(false);
              }}
              className={cn(
                'flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors',
                selectedId === adapter.id ? 'bg-muted' : 'hover:bg-muted/60',
              )}
            >
              {adapter.adapterAccountInfo?.avatar && (
                <Image
                  src={adapter.adapterAccountInfo.avatar}
                  alt={adapter.adapterAccountInfo.name ?? 'Account'}
                  width={24}
                  height={24}
                  className="rounded-full object-cover flex-shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {adapter.adapterAccountInfo?.name ?? 'Account'}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {adapter.adapterAccountInfo?.email}
                </div>
              </div>
              {selectedId === adapter.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}

          <div className="border-t border-border my-2" />

          <button
            type="button"
            onClick={onAddAccount}
            className="flex w-full items-center justify-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-muted"
          >
            <span className="text-lg leading-none">+</span>
            Add another account
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
