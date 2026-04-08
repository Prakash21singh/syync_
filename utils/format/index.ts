import { SyncSubscriptionPlan } from '@/types';
import { BillingCycle } from '../config/subscription-config';

export function formatPrice(price: number, cycle: BillingCycle) {
  if (price === 0) return { amount: 'Free', unit: '' };
  const monthly = cycle === 'monthly' ? price : Math.round(price);
  return {
    amount:
      '₹' +
      monthly.toLocaleString('en-IN', {
        currency: 'INR',
      }),
    unit: '/mo',
  };
}

export function formatOriginal(plan: SyncSubscriptionPlan, cycle: BillingCycle): string {
  if (cycle !== 'annually' || plan.price[cycle].amount === 0) return '';
  const monthlyTotal = plan.price[cycle].amount * 12;
  return 'vs ₹' + monthlyTotal.toLocaleString('en-IN') + ' billed monthly';
}
