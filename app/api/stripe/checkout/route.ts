import { stripeClient } from '@/lib/stripe';
import { withAuth } from '@/lib/with-auth';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

const requestBodySchema = z.object({
  priceId: z.string(),
  success_url: z.string(),
  billing_cycle: z.enum(['monthly', 'annually']),
});

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

    const portalSession = await stripeClient.checkout.sessions.create({
      success_url: body.success_url,
      mode: 'subscription',
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        billing_mode: {
          type: 'flexible',
        },
      },
    });

    if (!portalSession) {
      throw new Error('SessionNotFound');
    }

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
