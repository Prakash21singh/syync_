import { stripeClient } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const POST = async (req: NextRequest, res: NextResponse) => {
  // cus_UKobkZB3MvUM9i
  // cus_UKoa8HBSs4s9VH
  let event;

  if (endpointSecret) {
    const signature = req.headers.get('stripe-signature');

    try {
      if (!signature) throw new Error('InvalidStripeSignature');

      const body = (await req.text()) as string | Uint8Array;

      event = stripeClient.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (error) {
      console.error('Error:', error);

      return NextResponse.json({}, { status: 400 });
    }

    console.log(event);
    // Handling each event
    switch (event.type) {
      case 'payment_intent.created':
        await HandlePaymentIntent(event.data.object);
        break;
    }
  }

  return Response.json({ recieved: true });
};

async function HandlePaymentIntent(createdPaymentIntentPayload: any) {}
