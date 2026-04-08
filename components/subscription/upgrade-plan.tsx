'use client';
import { PlanCard } from './plan-card';
import { useState } from 'react';
import { SyncSubscriptionPlan } from '@/types';
import { BillingToggle } from './billing-toggle';
import { BillingCycle } from '@/utils/config/subscription-config';

export default function PricingPlans({ plans }: { plans: SyncSubscriptionPlan[] }) {
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-8">
      <BillingToggle cycle={cycle} onChange={setCycle} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} />
        ))}
      </div>
    </section>
  );
}
