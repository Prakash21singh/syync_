import prisma from '@/lib/prisma';
import { stripeClient } from '@/lib/stripe';
import { withAuth } from '@/lib/with-auth';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

const requestBodySchema = z.object({
  priceId: z.string(),
  success_url: z.url(),
});

async function createCheckoutSession(priceId: string, success_url: string, customerId?: string) {
  const session = await stripeClient.checkout.sessions.create({
    success_url,
    cancel_url: success_url,
    mode: 'subscription',
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    subscription_data: {
      billing_mode: {
        type: 'flexible',
      },
    },
  });

  return session;
}

async function getCustomerId(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) throw new Error('UserNotFound');

  if (!user.stripe_customer_id) {
    const customer = await stripeClient.customers.create({
      email: user.email,
      name: user.name || `User-${user.id}`,
      metadata: {
        userId,
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        stripe_customer_id: customer.id,
      },
    });

    return customer.id;
  }

  return user.stripe_customer_id;
}

const handler = async (
  req: NextRequest,
  session: {
    user: {
      id: string;
    };
  },
) => {
  try {
    const incomingBody = await req.json();

    const body = requestBodySchema.parse(incomingBody);

    const customerId = await getCustomerId(session.user.id);

    const portalSession = await createCheckoutSession(
      body.priceId,
      body.success_url,
      customerId || undefined,
    );

    return NextResponse.json({ redirectUrl: portalSession.url! });
  } catch (error: any) {
    console.error('StripeCheckoutSessionError', error);
    return NextResponse.json(
      {
        message: error.message || 'Error creating checkout session',
      },
      {
        status: 400,
      },
    );
  }
};

export const POST = withAuth(handler);
