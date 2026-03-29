'use client';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { memo } from 'react';

interface Props {
  sourceAdapter: string;
  destinationAdapter: string;
  canMigrate: boolean;
  isMigrating: boolean;
  hasFiles: boolean;
  onFetchFiles: () => void;
  onMigrate: () => void;
}

export function MigrationSummary({
  sourceAdapter,
  destinationAdapter,
  canMigrate,
  isMigrating,
  hasFiles,
  onFetchFiles,
  onMigrate,
}: Props) {
  return (
    <div className="mt-8 w-full">
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          canMigrate ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden',
        )}
      >
        <div className="pt-6 border-t border-border">
          {/* Header */}
          <div className="mb-4">
            <h3 className="font-semibold text-foreground mb-0.5">Ready to Migrate</h3>
            <p className="text-sm text-muted-foreground">Review your migration path</p>
          </div>

          {/* Path visualiser */}
          <div className="flex items-center justify-center gap-3 px-6 py-4 bg-muted/40 border border-border/60 rounded-sm mb-3">
            <span className="text-sm font-medium text-foreground">{sourceAdapter}</span>
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
              <ArrowRight className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{destinationAdapter}</span>
          </div>

          {/* CTA */}
          {!hasFiles ? (
            <button
              onClick={onFetchFiles}
              disabled={isMigrating}
              className={cn(
                'w-full h-11 rounded-sm text-sm font-semibold text-white tracking-wide',
                'bg-primary hover:bg-primary/90 active:scale-[0.99]',
                'transition-all duration-150',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2',
              )}
            >
              {isMigrating ? 'Fetching files…' : 'Fetch Files from Source'}
            </button>
          ) : (
            <button
              onClick={onMigrate}
              disabled={isMigrating}
              className={cn(
                'w-full h-11 rounded-sm text-sm font-semibold text-white tracking-wide',
                'bg-primary hover:bg-primary/90 active:scale-[0.99]',
                'transition-all duration-150',
                'disabled:opacity-60 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2',
              )}
            >
              {isMigrating ? 'Starting Migration…' : 'Start Migration'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
