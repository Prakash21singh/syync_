import UpgradePlan from '@/components/subscription/upgrade-plan';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Sync | Subscription plans',
  description: 'Select the suite of plans serving your requirement',
};

async function SubscriptionPlan() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/plan`, {
    credentials: 'include',
    headers: await headers(),
  });

  const body = await response.json();

  return (
    <div className="h-full">
      <UpgradePlan plans={body.plans} />
    </div>
  );
}

export default SubscriptionPlan;
