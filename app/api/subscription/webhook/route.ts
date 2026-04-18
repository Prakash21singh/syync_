import { stripeClient } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { PlanType } from '@/types';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const POST = async (req: NextRequest, res: NextResponse) => {
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

    // Handling each event
    switch (event.type) {
      case 'checkout.session.completed':
      case 'invoice.paid':
        await HandlePaymentSucceeded(event);
      case 'invoice.payment_succeeded':
      case 'invoice.finalized':
      case 'invoice.created':
      case 'invoice_payment.paid':
      case 'payment_intent.created':
      case 'payment_intent.succeeded':
    }
  }

  return Response.json({ recieved: true });
};

async function HandlePaymentSucceeded(event: Stripe.Event) {
  if (event.type !== 'invoice.paid') return;

  const data = event.data.object as Stripe.Invoice;
  const customerId = data.customer;
  // Will be used to send email to.
  // Take set of emails for inhouse user and user doing the payment.
  const customerEmail = data.customer_email;
  const customerName = data.customer_name;
  const subscriptionId = data.parent?.subscription_details?.subscription as string;
  const lineItem = data.lines.data[0];
  const priceId = lineItem.pricing?.price_details?.price as string;
  const productId = lineItem.pricing?.price_details?.product;
  const amountPaid = data.amount_paid;
  const currency = data.currency;
  // Billing reason will help me type of pay 'subscription_create' | 'subscription_cycle' | 'subscription_update'
  const billingReason = data.billing_reason;
  const planStartsAt = new Date(lineItem.period.start * 1000);
  const planEndsAt = new Date(lineItem.period.end * 1000);
  const paidAt = new Date(data.status_transitions.paid_at! * 1000);
  const invoiceId = lineItem.invoice;
  const hostedInvoiceUrl = data.hosted_invoice_url;
  const invoicePdf = data.invoice_pdf;
  const metadata = data.parent?.subscription_details?.metadata as {
    userId: string;
    plan: PlanType;
  };
  const userId = metadata.userId;
  const plan = metadata.plan;

  const customer = await prisma.user.findUnique({
    where: {
      id: userId,
      stripe_customer_id: customerId as string,
    },
  });

  if (!customer) throw new Error('CustomerNotFound');

  const subscription = await prisma.subscription.create({
    data: {
      currency,
      productId,
      type: plan,
      isActive: true,
      status: 'ACTIVE',
      priceId: priceId,
      userId: customer.id,
      amount: Number(amountPaid),
      currentPeriodEnd: planEndsAt,
      subscriptionId: subscriptionId,
      currentPeriodStart: planStartsAt,
      customerId: customer?.stripe_customer_id!,
      paidAt,
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      userId: customer.id,
      invoicePdf: invoicePdf,
      stripeInvoiceId: invoiceId!,
      subscriptionId: subscription.id,
      hostedInvoiceUrl: hostedInvoiceUrl,
      customerId: subscription.customerId,
    },
  });
}
