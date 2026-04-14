export const DEFAULT_GOOGLE_DRIVE_PARAMS = {
  corpora: 'user',
  driveId: '',
  includeItemsFromAllDrives: 'false',
  supportsAllDrives: 'false',
  q: "'root' in parents and trashed=false",
  orderBy: 'createdTime desc',
  fields:
    'nextPageToken, files(id,name,mimeType,size,createdTime,modifiedTime,parents,webViewLink,iconLink,hasThumbnail,thumbnailLink)',
};

export const DEFAULT_DROPBOX_BODY = {
  include_deleted: false,
  include_has_explicit_shared_members: false,
  include_media_info: false,
  include_mounted_folders: true,
  include_non_downloadable_files: true,
  path: '',
  recursive: false,
};

export const STRIPE_EVENT_TYPES: Record<string, string> = {
  // Customer subscription events
  'customer.subscription.created': 'Fired when a subscription is created for the first time.',
  'customer.subscription.updated':
    'Fired when a subscription changes (e.g., switching from one plan to another, or switching from a trial to a paid subscription).',
  'customer.subscription.deleted':
    'Fired when a subscription ends. This can happen when a customer cancels their subscription, or when the subscription is canceled by Stripe (e.g., due to failed payments).',
  'customer.subscription.trial_will_end':
    'Fired three days before a trial period ends. This gives you an opportunity to notify customers that their trial is ending soon.',
  'customer.subscription.paused': 'Fired when a subscription is paused.',
  'customer.subscription.resumed': 'Fired when a paused subscription is resumed.',

  // Invoice events
  'invoice.created':
    'Fired when an invoice is created. This can happen when a subscription is created, or when a subscription is updated and a new billing cycle starts.',
  'invoice.finalized':
    'Fired when an invoice is finalized and ready to be paid. This is a good time to send the invoice to the customer.',
  'invoice.paid':
    "Fired when an invoice is successfully paid. This indicates that the customer's payment was successful and the subscription is active.",
  'invoice.payment_failed':
    'Fired when a payment attempt for an invoice fails. This can happen due to insufficient funds, expired card, or other payment issues. You may want to notify the customer and prompt them to update their payment information.',
  'invoice.payment_action_required':
    'Fired when a payment attempt for an invoice requires additional action from the customer (e.g., 3D Secure authentication). You should notify the customer to complete the required action to avoid subscription interruption.',
  'invoice.upcoming':
    'Fired a few days before an invoice is created for a subscription. This gives you an opportunity to notify customers about upcoming charges.',
  'invoice.voided':
    'Fired when an invoice is voided. This can happen if a subscription is canceled before the invoice is finalized, or if an invoice is manually voided in the Stripe Dashboard.',

  // Payment intent events
  'payment_intent.created':
    'Fired when a payment intent is created. This can happen when a customer initiates a payment, or when a subscription is created and the first payment is attempted.',
  'payment_intent.succeeded':
    "Fired when a payment intent is successfully completed. This indicates that the customer's payment was successful.",
  'payment_intent.payment_failed':
    'Fired when a payment intent fails. This can happen due to insufficient funds, expired card, or other payment issues. You may want to notify the customer and prompt them to update their payment information.',
  'payment_intent.requires_action':
    'Fired when a payment intent requires additional action from the customer (e.g., 3D Secure authentication). You should notify the customer to complete the required action to avoid subscription interruption.',

  // Other relevant events
  'customer.created':
    'Fired when a new customer is created in Stripe. This can happen when a customer signs up for your service and provides their payment information.',
  'customer.updated':
    "Fired when a customer's information is updated. This can include changes to their email, payment method, or other details.",
  'customer.deleted':
    'Fired when a customer is deleted from Stripe. This can happen if a customer cancels their account or if you manually delete a customer in the Stripe Dashboard.',
  'checkout.session.completed':
    'Fired when a Checkout Session is completed successfully. This indicates that the customer has completed the checkout process and the payment was successful. You can use this event to fulfill orders or activate subscriptions.',
};
