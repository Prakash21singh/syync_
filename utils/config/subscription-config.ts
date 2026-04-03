export type BillingCycle = 'monthly' | 'annually';

export interface Plan {
  id: string;
  type: 'BASE' | 'PRO' | 'BUSINESS';
  planFor: string;
  price: Record<BillingCycle, number>;
  currency: string;
  dailyLimit: number;
  connectors: number | 'unlimited';
  advantages: string[];
  popular?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: 'sync-base-plan',
    type: 'BASE',
    planFor: 'For testing, side projects & curious builders',
    price: {
      monthly: 0,
      annually: 0,
    },
    currency: 'INR',
    dailyLimit: 5 * 1024 * 1024 * 1024, // 5GB/day
    connectors: 2,
    advantages: [
      '2 cloud connectors',
      'Basic cloud-to-cloud transfers',
      'Limited daily usage',
      'Standard transfer speed',
      'Community support',
    ],
  },

  {
    id: 'sync-pro-plan',
    type: 'PRO',
    planFor: 'For serious developers & growing workflows',
    price: {
      monthly: 2999,
      annually: 29999,
    },
    currency: 'INR',
    dailyLimit: 50 * 1024 * 1024 * 1024, // 50GB/day
    connectors: 8,
    advantages: [
      'Up to 8 cloud connectors',
      'Higher daily limits',
      'Priority job processing',
      'Retry & failure handling',
      'Email support',
    ],
    popular: true,
  },

  {
    id: 'sync-business-plan',
    type: 'BUSINESS',
    planFor: 'For teams, scale & mission-critical data',
    price: {
      monthly: 8999,
      annually: 89999,
    },
    currency: 'INR',
    dailyLimit: 200 * 1024 * 1024 * 1024, // 200GB/day
    connectors: 'unlimited',
    advantages: [
      'Unlimited cloud connectors',
      'Unlimited workflows',
      'Dedicated queue priority',
      'Advanced monitoring & logs',
      'Priority support',
    ],
  },
];
