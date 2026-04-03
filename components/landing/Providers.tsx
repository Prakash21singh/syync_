'use client';
import { memo, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import { ADAPTERS } from '@/utils/config/adapter-config';
import Badge from '../badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Check, ChevronDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';

function AdapterDices({ adapters }: { adapters: typeof ADAPTERS }) {
  return (
    <div
      className={cn(
        'absolute right-0 bottom-full',
        'border border-b-0 border-stone-600/30',
        'rounded-t-lg',
        'flex items-center px-3 py-1.5',
        'bg-background/95 backdrop-blur-sm',
      )}
    >
      <div className="flex items-center">
        {adapters.slice(0, 8).map((a, index) => (
          <div
            key={a.name}
            className="relative cursor-pointer transition-transform hover:scale-110 hover:z-10"
            style={{ marginLeft: index === 0 ? 0 : '-6px', zIndex: index }}
            title={a.name}
          >
            <div className="w-6 h-6 rounded-sm p-1 border border-stone-500/40 bg-background overflow-hidden shadow-sm">
              <Image
                src={a.icon}
                alt={a.name}
                width={24}
                height={24}
                className="w-full h-full object-cover "
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdapterSelection({
  label,
  adapters,
  selectedAdapter,
  onSelect,
  otherSelected,
}: {
  label: 'SOURCE' | 'DESTINATION';
  adapters: typeof ADAPTERS;
  selectedAdapter: string | null;
  onSelect: (value: string | null) => void;
  otherSelected: string | null;
}) {
  let [open, setOpen] = useState(false);

  const selected = useMemo(() => {
    return ADAPTERS.find((adapter) => adapter.name === selectedAdapter);
  }, [selectedAdapter]);

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          asChild
          className={cn(
            'rounded-sm cursor-pointer w-full rounded-br-none',
            label === 'SOURCE'
              ? 'bg-green-50 hover:bg-green-100 border-green-400'
              : 'bg-blue-50 hover:bg-blue-100 border-primary',
          )}
        >
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex-1 justify-between h-16 py-3 px-4"
          >
            <div className="flex items-center justify-between w-full">
              {selectedAdapter ? (
                <div className="flex items-center gap-3">
                  <Image
                    src={adapters.find((a) => a.name === selectedAdapter)?.icon || ''}
                    alt={selectedAdapter}
                    width={24}
                    height={24}
                    className="rounded-md object-cover"
                  />
                  <div className="text-left min-w-0">
                    <div className="font-medium text-foreground truncate">{selected?.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{selected?.type}</div>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground capitalize">
                  Select {label.toLowerCase()} adapter
                </span>
              )}
            </div>

            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-40" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] font-sarabun bg-background p-0" align="start">
          <Command>
            <CommandInput placeholder="Search adapters..." />
            <CommandList>
              <CommandEmpty>No adapter found.</CommandEmpty>
              <CommandGroup>
                {adapters.map((a) => {
                  const isDisabled = a.isActive === false || a.name === otherSelected;
                  return (
                    <CommandItem
                      key={a.name}
                      value={a.name}
                      disabled={isDisabled}
                      onSelect={(value) => {
                        onSelect(value === selectedAdapter ? null : value);
                        setOpen(false);
                      }}
                      className="hover:bg-surface transition-all"
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selectedAdapter === a.name ? 'opacity-100' : 'opacity-0',
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
                      {a.name === otherSelected && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({label === 'SOURCE' ? 'Destination' : 'Source'})
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
      {selected && <p className="text-xs tracking-wide mt-2">{selected.description}</p>}
      <AdapterDices adapters={adapters} />
    </div>
  );
}

const MemoizedAdapterSelection = memo(AdapterSelection);

function Providers() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

  const sourceAdapters = ADAPTERS;
  const destinationAdapters = ADAPTERS;

  return (
    <section className="w-full px-4 md:px-6  lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <Badge name="Supported Adapters" />
          <h2 className="h2 text-primary font-semibold mt-4 mb-1 text-pretty">
            Connect Your Favorite Cloud Services
          </h2>
          <p className="max-w-2xl mx-auto">
            Sync works seamlessly with a growing ecosystem of cloud providers. More integrations
            coming soon.
          </p>
        </div>

        <div className="w-full flex relative items-start  max-w-5xl mt-20 gap-x-6 mx-auto  justify-evenly">
          <MemoizedAdapterSelection
            label="SOURCE"
            adapters={sourceAdapters}
            selectedAdapter={selectedSource}
            onSelect={setSelectedSource}
            otherSelected={selectedDestination}
          />

          <MemoizedAdapterSelection
            label="DESTINATION"
            adapters={destinationAdapters}
            selectedAdapter={selectedDestination}
            onSelect={setSelectedDestination}
            otherSelected={selectedSource}
          />
        </div>
      </div>
    </section>
  );
}

export default Providers;
