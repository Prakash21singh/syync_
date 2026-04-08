import { withAuth } from '@/lib/with-auth';
import { SyncSubscriptionPlan } from '@/types';
import { NextResponse } from 'next/server';

export const PLANS: SyncSubscriptionPlan[] = [
  {
    id: 'sync-base-plan',
    type: 'BASE',
    label: 'Base',
    planFor: 'For testing, side projects & curious builders',
    price: {
      monthly: {
        amount: 0,
      },
      annually: {
        amount: 0,
      },
    },
    currency: 'INR',
    dailyLimit: '5 GB/day',
    connectors: 2,
    advantages: [
      { text: '2 cloud connectors' },
      { text: 'Basic cloud-to-cloud transfers' },
      { text: 'Limited daily usage' },
      { text: 'Standard transfer speed' },
      { text: 'API access', optional: true },
    ],
    cta: { label: 'Start for free', style: 'outline' },
    featuresLabel: 'Includes',
  },
  {
    id: 'sync-pro-plan',
    type: 'PRO',
    label: 'Pro',
    planFor: 'For serious developers & growing workflows',
    price: {
      monthly: {
        amount: 2999,
        id: process.env.STRIPE_MONTHLY_PRO_PLAN_ID,
      },
      annually: {
        amount: 29999,
        id: process.env.STRIPE_ANNUALLY_PRO_PLAN_ID,
      },
    },
    currency: 'INR',
    dailyLimit: '50 GB/day',
    connectors: 8,
    popular: true,
    advantages: [
      { text: 'Up to 8 cloud connectors' },
      { text: 'Higher daily limits' },
      { text: 'Priority job processing' },
      { text: 'Retry & failure handling' },
      { text: 'Email support' },
      { text: 'Webhook triggers', optional: true },
      { text: 'Custom scheduling', optional: true },
    ],
    cta: { label: 'Upgrade now', style: 'primary' },
    featuresLabel: 'All Base features, plus:',
  },
  {
    id: 'sync-business-plan',
    type: 'BUSINESS',
    label: 'Business',
    planFor: 'For teams, scale & mission-critical data',
    price: {
      monthly: {
        amount: 8999,
        id: process.env.STRIPE_MONTHLY_BUSSINESS_PLAN_ID,
      },
      annually: {
        amount: 89999,
        id: process.env.STRING_ANNUALLY_BUSSINESS_PLAN_ID,
      },
    },
    currency: 'INR',
    dailyLimit: '200 GB/day',
    connectors: 'Unlimited',
    advantages: [
      { text: 'Unlimited cloud connectors' },
      { text: 'Unlimited workflows' },
      { text: 'Dedicated queue priority' },
      { text: 'Advanced monitoring & logs' },
      { text: 'Priority support' },
    ],
    cta: { label: 'Upgrade now', style: 'primary' },
    featuresLabel: 'All Pro features, plus:',
  },
];

export const handler = async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return NextResponse.json({
      plans: PLANS,
    });
  } catch (error: any) {
    console.error('Error:', error);

    return NextResponse.json({
      message: error.message || 'Something went wrong while fetching the plan',
    });
  }
};

export const GET = withAuth(handler);
