'use client';
import React, { memo, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { PLANS, type Plan as PlanInterface } from '@/utils/config/subscription-config';
import { Button } from '../ui/button';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import Link from 'next/link';

type Props = {};

function BillingCycle({
  billingCycle,
  setBillingCycle,
}: {
  billingCycle: 'monthly' | 'annually';
  setBillingCycle: (cycle: 'monthly' | 'annually') => void;
}) {
  return (
    <div className="relative rounded-full p-1 bg-gray-100 flex items-center w-fit">
      {/* Monthly */}
      <button
        onClick={() => setBillingCycle('monthly')}
        className={cn(
          'relative px-4 py-1.5 rounded-full z-10 text-sm font-medium transition-all',
          billingCycle === 'monthly' ? 'bg-white text-black shadow-sm' : 'text-muted-foreground',
        )}
      >
        Monthly
      </button>

      <button
        onClick={() => setBillingCycle('annually')}
        className={cn(
          'relative px-4 py-1.5 rounded-full z-10 text-sm font-medium transition-all',
          billingCycle === 'annually' ? 'bg-white text-black shadow-sm' : 'text-muted-foreground',
        )}
      >
        Annually
      </button>
    </div>
  );
}

const MemoizedPlanExecution = memo(BillingCycle);

function Plan({
  id,
  advantages,
  connectors,
  currency,
  dailyLimit,
  planFor,
  price,
  type,
  popular,
  billingCycle,
}: Omit<PlanInterface, 'price'> & {
  price: number;
  billingCycle: 'monthly' | 'annually';
}) {
  return (
    <div
      className={cn(
        'rounded-4xl  flex-shrink-0 p-6 border-border',
        type === 'PRO' ? 'bg-primary' : 'bg-surface',
      )}
    >
      <div
        className="
        w-full
        p-4
        rounded-4xl
        shadow
        border 
        bg-background
        border-foreground/10
        flex 
        flex-col
        items-start
        justify-between
        my-4
      "
      >
        <div className="flex items-center justify-between w-full mb-8">
          <div className="text-lg">
            {type.charAt(0).toUpperCase() + type.toLowerCase().slice(1)}
          </div>
          {popular && (
            <Button className="rounded-full bg-secondary hover:bg-secondary/80 text-black">
              Popular
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-mont font-medium">
            {new Intl.NumberFormat('en-In', {
              currency: currency,
              style: 'currency',
              maximumFractionDigits: 0,
            }).format(price)}
          </h1>
          <sub>per {billingCycle === 'annually' ? 'Year' : 'Month'}</sub>
        </div>
        <p className="text-xs">{dailyLimit / 1024 / 1024 / 1024}GB transfer/day</p>
        <p className="text-xs mt-1">{planFor}</p>
      </div>
      <div
        className="
          w-full
          p-4
          flex 
          flex-col
          items-start
          justify-between
          gap-y-3
          my-4  
        "
      >
        {advantages.map((advantage) => (
          <span className="flex items-center gap-x-3" key={advantage}>
            <IconCircleCheckFilled className={cn(popular ? 'text-white' : 'text-secondary')} />
            <p className={cn(popular && 'text-white')}>{advantage}</p>
          </span>
        ))}
      </div>

      <Button className="w-full cursor-pointer py-7 my-7 rounded-full bg-black hover:bg-black/90">
        <Link href={`/subscription?type=${type.toLowerCase()}`} target="_blank">
          Select Plan
        </Link>
      </Button>
    </div>
  );
}

function PlanExecution({}: Props) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  return (
    <div
      className="
      w-full
      max-w-6xl
      mx-auto
      flex 
      flex-col
      items-center
      justify-center
    "
    >
      <MemoizedPlanExecution billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
      <div className="w-full flex flex-wrap lg:flex-row items-center justify-center lg:justify-between gap-4 mt-10">
        {PLANS.map((plan) => (
          <Plan
            advantages={plan.advantages}
            connectors={plan.connectors}
            currency={plan.currency}
            dailyLimit={plan.dailyLimit}
            id={plan.id}
            planFor={plan.planFor}
            price={plan.price[billingCycle]}
            type={plan.type}
            key={plan.id}
            popular={plan.popular}
            billingCycle={billingCycle}
          />
        ))}
      </div>
    </div>
  );
}

export default PlanExecution;
