import stripe from 'stripe';

export const stripeClient = new stripe(process.env.STRIPE_KEY!);
