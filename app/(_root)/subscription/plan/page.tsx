import UpgradePlan from '@/components/subscription/upgrade-plan';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Sync | Subscription plans',
  description: 'Select the suite of plans serving your requirement',
};

async function SubscriptionPlan() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subscription/plan`, {
    credentials: 'include',
    headers: await headers(),
  });

  const body = await response.json();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const activeSubscription = await prisma.subscription.findUnique({
    where: {
      userId: session?.user.id,
      isActive: true,
    },
  });

  return (
    <div className="h-full">
      <UpgradePlan plans={body.plans} activeSubscription={activeSubscription} />
    </div>
  );
}

export default SubscriptionPlan;
