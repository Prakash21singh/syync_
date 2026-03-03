'use client';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Ready to Migrate</h3>
              <p className="text-sm text-muted-foreground">Review your migration path</p>
            </div>
          </div>

          {/* Path visualiser */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg mb-4 justify-center">
            <span className="font-medium text-foreground">{sourceAdapter}</span>
            <ArrowRight className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">{destinationAdapter}</span>
          </div>

          {/* CTA */}
          {!hasFiles ? (
            <Button onClick={onFetchFiles} disabled={isMigrating} className="w-full" size="lg">
              {isMigrating ? 'Fetching files...' : 'Fetch Files from Source'}
            </Button>
          ) : (
            <Button onClick={onMigrate} disabled={isMigrating} className="w-full" size="lg">
              {isMigrating ? 'Starting Migration...' : 'Start Migration'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
