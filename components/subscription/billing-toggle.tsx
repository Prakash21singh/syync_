import { cn } from '@/lib/utils';
import { BillingCycle } from '@/utils/config/subscription-config';

export function BillingToggle({
  cycle,
  onChange,
}: {
  cycle: BillingCycle;
  onChange: (c: BillingCycle) => void;
}) {
  const isAnnually = cycle === 'annually';

  return (
    <div className="flex items-center justify-center gap-3 mb-10">
      <span
        className={cn(
          'text-[13px] cursor-pointer transition-colors',
          !isAnnually ? 'text-foreground font-medium' : 'text-text-secondary',
        )}
        onClick={() => onChange('monthly')}
      >
        Monthly
      </span>

      <button
        role="switch"
        aria-checked={isAnnually}
        onClick={() => onChange(isAnnually ? 'monthly' : 'annually')}
        className={cn(
          'relative h-6 w-11 rounded-full border-[1.5px] transition-all duration-200',
          isAnnually ? 'bg-primary border-primary' : 'bg-muted border-border-secondary',
        )}
      >
        <span
          className={cn(
            'absolute top-[2px] left-[2px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
            isAnnually && 'translate-x-5',
          )}
        />
      </button>

      <span
        className={cn(
          'text-[13px] cursor-pointer transition-colors',
          isAnnually ? 'text-foreground font-medium' : 'text-text-secondary',
        )}
        onClick={() => onChange('annually')}
      >
        Annually
      </span>

      <span
        className={cn(
          'rounded-full border px-2 py-0.5 text-[11px] font-medium transition-opacity duration-200',
          'bg-[#fef9ec] text-[#92620a] border-[#fde9a2]',
          isAnnually ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        Save ~17%
      </span>
    </div>
  );
}
