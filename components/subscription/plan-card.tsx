import { cn } from '@/lib/utils';
import { PlanType, SyncSubscriptionPlan } from '@/types';
import { BillingCycle } from '@/utils/config/subscription-config';
import { formatOriginal, formatPrice } from '@/utils/format';
import { Check, Loader2 } from 'lucide-react';
import { memo, useCallback, useMemo, useState } from 'react';

interface PlanCardProps {
  plan: SyncSubscriptionPlan;
  cycle: BillingCycle;
  isActive: (id: string, plan: PlanType) => boolean;
}

function Card({ plan, cycle, isActive }: PlanCardProps) {
  const { amount, unit } = formatPrice(plan.price[cycle].amount, cycle);
  const original = formatOriginal(plan, cycle);
  const [loading, setLoading] = useState<boolean>(false);

  const isPlanActive = useMemo(
    () => isActive(plan.price[cycle].id!, plan.label.toUpperCase() as PlanType),
    [plan, cycle],
  );

  const initiateCheckout = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/subscription/checkout', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          priceId: plan.price[cycle].id,
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription/plan`,
          billing_cycle: cycle,
          plan: plan.type.toUpperCase(),
        }),
      });

      if (!response.ok) throw new Error('Error checking out plan');

      const body = await response.json();
      window.location.replace(body.redirectUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [cycle]);

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-[14px] border-[1.5px] p-7 transition-all duration-200',
        isPlanActive
          ? 'border-green-500/40 bg-green-50/50 dark:bg-green-950/20'
          : plan.popular
            ? 'border-primary bg-primary/5 shadow-[0_0_0_3px_rgba(109,113,240,0.12)]'
            : 'border-gray-500/40 bg-gray-50 dark:bg-gray-900/20',
      )}
    >
      {/* Badge */}
      {(plan.popular || isPlanActive) && (
        <div
          className={cn(
            'absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3.5 py-0.5 text-[11px] font-medium border',
            isPlanActive
              ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400'
              : 'bg-primary/10 text-primary border-primary/20',
          )}
        >
          {isPlanActive ? 'Active' : 'Popular'}
        </div>
      )}

      {/* Plan name & tagline */}
      <h3 className="text-[18px] font-semibold text-foreground mb-1">{plan.label}</h3>
      <p className="text-[12.5px] text-text-secondary leading-relaxed mb-5 min-h-9.5">
        {plan.planFor}
      </p>

      {/* Price */}
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-[32px] font-semibold leading-none text-foreground">{amount}</span>
        <span className="text-[13px] text-text-secondary">{unit}</span>
      </div>
      <div className="text-[12px] text-text-secondary line-through min-h-4 mb-5">
        {original || null}
      </div>

      {/* Meta */}
      <div className="flex flex-col gap-1 mb-5">
        <div className="flex items-center gap-2 text-[12px] text-text-secondary">
          <span className="w-1 h-1 rounded-full bg-border-secondary inline-block" />
          {plan.connectors} connectors
        </div>
        <div className="flex items-center gap-2 text-[12px] text-text-secondary">
          <span className="w-1 h-1 rounded-full bg-border-secondary inline-block" />
          {plan.dailyLimit} transfer limit
        </div>
      </div>

      <hr className="border-border mb-5" />

      {/* Features */}
      <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-text-secondary mb-3">
        {plan.featuresLabel ?? 'Includes'}
      </p>
      <ul className="flex flex-col gap-2.5 mb-6 flex-1">
        {plan.advantages.map((f) => (
          <li
            key={f.text}
            className="flex items-start gap-2.5 text-[13px] text-foreground leading-snug"
          >
            <span
              className={cn(
                'mt-0.5 shrink-0 w-3.75 h-3.75 rounded-full flex items-center justify-center',
                isPlanActive ? 'bg-green-500/10' : 'bg-primary/10',
              )}
            >
              <Check
                className={cn(
                  'w-2.25 h-2.25 stroke-[2.5]',
                  isPlanActive ? 'text-green-600 dark:text-green-400' : 'text-primary',
                )}
              />
            </span>
            <span>
              {f.text}
              {f.optional && (
                <span className="text-text-secondary text-[11.5px] ml-1">(optional)</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        disabled={isPlanActive || loading}
        onClick={initiateCheckout}
        className={cn(
          'flex w-full items-center justify-between rounded-[10px] px-4 py-2.5 text-[13.5px] font-medium transition-all duration-150',
          isPlanActive
            ? 'cursor-not-allowed bg-green-500/10 text-green-600 border-[1.5px] border-green-500/20 dark:text-green-400'
            : plan.cta.style === 'primary'
              ? 'bg-primary text-primary-foreground hover:opacity-90'
              : 'border-[1.5px] border-border-secondary bg-transparent text-foreground hover:border-primary hover:text-primary',
          loading && 'cursor-wait opacity-70',
        )}
      >
        {loading ? (
          <Loader2 className="animate-spin mx-auto" />
        ) : isPlanActive ? (
          <span className="mx-auto">Current Plan</span>
        ) : (
          <>
            {plan.cta.label}
            <span className="text-[15px]">→</span>
          </>
        )}
      </button>

      {plan.ctaSecondary && (
        <button className="mt-2 flex w-full items-center justify-between rounded-[10px] border-[1.5px] border-border bg-transparent px-4 py-2.5 text-[13px] text-text-secondary transition-all duration-150 hover:border-border-secondary hover:text-foreground">
          {plan.ctaSecondary}
          <span className="text-[15px]">→</span>
        </button>
      )}
    </div>
  );
}

export const PlanCard = memo(Card);
