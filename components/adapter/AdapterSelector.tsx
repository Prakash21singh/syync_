'use client';
import Image from 'next/image';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { ADAPTERS } from '@/utils/config/adapter-config';
import { AccountSwitcher } from './AccountSwitcher';
import type { UseAdapterReturn } from '@/hooks/use-adap';
import type { AdapterRole, AdapterStatus } from '@/types/index';

// ─── Status Indicator ────────────────────────────────────────────────────────

const STATUS_STYLES: Record<AdapterStatus, string> = {
  idle: 'bg-gray-300',
  validating: 'bg-yellow-400 animate-pulse',
  valid: 'bg-green-500',
  requires_reauth: 'bg-red-500',
  error: 'bg-red-500',
};

function StatusDot({ status }: { status: AdapterStatus }) {
  if (status === 'idle') return null;
  return (
    <span
      title={status}
      className={cn('w-2 h-2 rounded-full flex-shrink-0', STATUS_STYLES[status])}
    />
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  role: AdapterRole;
  adapter: UseAdapterReturn;
  /** Adapter name that should be disabled (the other side's selection) */
  disabledAdapter?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdapterSelector({ role, adapter, disabledAdapter }: Props) {
  const label = role === 'source' ? 'Source' : 'Destination';

  const selectedMeta = ADAPTERS.find((a) => a.name === adapter.selectedAdapter);
  const hasAccounts = adapter.existingAdapters.length > 0;

  return (
    <div className="w-96 flex-shrink-0">
      {/* Label */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 rounded-full bg-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{label}</h3>
      </div>

      {/* Main Popover */}
      <Popover open={adapter.open} onOpenChange={adapter.setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={adapter.open}
            className="w-full justify-between h-16 py-3 px-4"
          >
            {selectedMeta ? (
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src={selectedMeta.icon}
                  alt={selectedMeta.name}
                  width={32}
                  height={32}
                  className="rounded-md object-cover flex-shrink-0"
                />
                <div className="text-left min-w-0">
                  <div className="font-medium text-foreground truncate">{selectedMeta.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{selectedMeta.type}</div>
                </div>

                {/* Validation status dot */}
                <StatusDot status={adapter.status} />

                {/* Account switcher — only when linked accounts exist */}
                {hasAccounts && (
                  <AccountSwitcher
                    adapters={adapter.existingAdapters}
                    selectedId={adapter.selectedExistingId}
                    selectedAdapter={adapter.selectedExisting}
                    open={adapter.extAdapOpen}
                    onOpenChange={adapter.setExtAdapOpen}
                    onSelect={adapter.setSelectedExistingId}
                    onAddAccount={adapter.addAccount}
                  />
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">Select {label.toLowerCase()} adapter...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[400px] bg-background p-0" align="start">
          <Command>
            <CommandInput placeholder="Search adapters..." />
            <CommandList>
              <CommandEmpty>No adapter found.</CommandEmpty>
              <CommandGroup>
                {ADAPTERS.map((a) => {
                  const isDisabled = a.isActive === false || a.name === disabledAdapter;
                  return (
                    <CommandItem
                      key={a.name}
                      value={a.name}
                      disabled={isDisabled}
                      onSelect={(value) => adapter.selectAdapter(value)}
                      className="hover:bg-surface transition-all"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          adapter.selectedAdapter === a.name ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <div className="flex items-center gap-3 flex-1">
                        <Image
                          src={a.icon}
                          alt={a.name}
                          width={32}
                          height={32}
                          className="rounded-md object-cover flex-shrink-0"
                        />
                        <div>
                          <div className="font-medium">{a.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {a.description}
                          </div>
                        </div>
                      </div>
                      {a.name === disabledAdapter && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({role === 'source' ? 'Destination' : 'Source'})
                        </span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Reauth CTA */}
      {adapter.status === 'requires_reauth' && (
        <p
          onClick={adapter.addAccount}
          className="mt-2 text-xs text-red-600 cursor-pointer underline underline-offset-2"
        >
          Session expired — click to re-authenticate
        </p>
      )}

      {/* Description */}
      <div className="h-12 mt-2">
        {selectedMeta && (
          <p className="text-xs text-muted-foreground line-clamp-2">{selectedMeta.description}</p>
        )}
      </div>
    </div>
  );
}
