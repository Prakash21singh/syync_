'use client';
import { PlanCard } from './plan-card';
import { useState } from 'react';
import { PlanType, SyncSubscriptionPlan } from '@/types';
import { BillingToggle } from './billing-toggle';
import { BillingCycle } from '@/utils/config/subscription-config';
import { Subscription } from '@/prisma/generated/prisma/client';

interface Props {
  plans: SyncSubscriptionPlan[];
  activeSubscription: Subscription | null;
}

export default function PricingPlans({ plans, activeSubscription }: Props) {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  function isActive(priceId: string, plan: PlanType) {
    if (!activeSubscription) return false;
    if (priceId === activeSubscription.priceId && plan === activeSubscription.type) {
      return true;
    }

    return false;
  }

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-8">
      <BillingToggle cycle={cycle} onChange={setCycle} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} isActive={isActive} />
        ))}
      </div>
    </section>
  );
}
