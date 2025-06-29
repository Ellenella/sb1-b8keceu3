# 🔧 Stripe Integration Setup Guide

This guide explains how to set up Stripe payment processing for the EthicGuard platform.

## 🚀 Quick Setup

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Navigate to the Stripe Dashboard

### 2. Get API Keys

1. In the Stripe Dashboard, go to **Developers** → **API keys**
2. Copy your **Publishable key** (starts with `pk_test_` for test mode)
3. Copy your **Secret key** (starts with `sk_test_` for test mode)

### 3. Create Products and Prices

1. Go to **Products** in the Stripe Dashboard
2. Click **Add product**

**For the "Pro" plan:**
- Product name: `Pro`
- Description: `for premium users`
- Pricing model: `Recurring`
- Price: `€149.00`
- Billing period: `Monthly`
- Copy the **Price ID** (starts with `price_`)

**For the "Start" plan:**
- Product name: `Start`
- Description: `for beginners`
- Pricing model: `Recurring`
- Price: `€100.00`
- Billing period: `Monthly`
- Copy the **Price ID** (starts with `price_`)

### 4. Configure Environment Variables

Update your `.env` file with the Stripe keys:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
```

### 5. Update Product Configuration

Update `src/stripe-config.ts` with your actual Price IDs:

```typescript
export const products: Product[] = [
  {
    id: 'prod_your_pro_product_id',
    priceId: 'price_your_actual_pro_price_id', // Replace with your actual Price ID
    name: 'Pro',
    description: 'for premium users',
    mode: 'subscription',
    price: 149.00,
    currency: 'EUR',
    interval: 'month',
    trialDays: 7,
    features: [
      'AI governance and compliance',
      'Real-time bias detection',
      'Toxicity filtering',
      'Compliance reporting',
      'Priority support',
      'Advanced analytics',
      'Custom rule configuration',
      'API access'
    ]
  },
  {
    id: 'prod_your_start_product_id',
    priceId: 'price_your_actual_start_price_id', // Replace with your actual Price ID
    name: 'Start',
    description: 'for beginners',
    mode: 'subscription',
    price: 100.00,
    currency: 'EUR',
    interval: 'month',
    trialDays: 7,
    features: [
      'AI governance and compliance',
      'Real-time bias detection',
      'Toxicity filtering',
      'Compliance reporting',
      'Email support',
      'Basic analytics'
    ]
  }
];
```

### 6. Set Up Webhooks (Optional but Recommended)

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-supabase-project.supabase.co/functions/v1/stripe-webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)
6. Add to your environment variables:

```bash
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
```

## 🧪 Testing

### Test Mode

Stripe starts in test mode by default. Use these test card numbers:

- **Successful payment**: `4242 4242 4242 4242`
- **Declined payment**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any postal code.

### Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to `/pricing`
3. Click "Start 7-Day Free Trial" on any plan
4. Use a test card number to complete the checkout
5. Verify the subscription appears in your Stripe Dashboard

## 🚀 Going Live

### 1. Activate Your Account

1. Complete Stripe account verification
2. Provide business information
3. Add bank account for payouts

### 2. Switch to Live Mode

1. In Stripe Dashboard, toggle from **Test mode** to **Live mode**
2. Get your live API keys (they start with `pk_live_` and `sk_live_`)
3. Update your production environment variables

### 3. Update Webhook Endpoint

1. Create a new webhook endpoint for production
2. Use your production Supabase URL
3. Update the webhook secret in production environment

## 🔧 Troubleshooting

### Common Issues

**"Failed to fetch" error:**
- Check that Supabase Edge Functions are deployed
- Verify API keys are correctly set in environment variables
- Ensure Stripe secret key is configured in Supabase

**Webhook not working:**
- Verify webhook URL is accessible
- Check webhook signing secret is correct
- Ensure selected events match what your code handles

**Test payments failing:**
- Use valid test card numbers from Stripe documentation
- Check that you're in test mode
- Verify API keys are for the correct mode (test vs live)

### Debug Steps

1. **Check Supabase Logs:**
   ```bash
   # View edge function logs
   npx supabase functions logs stripe-checkout
   ```

2. **Check Stripe Logs:**
   - Go to Stripe Dashboard → Developers → Logs
   - Look for failed API requests

3. **Verify Environment Variables:**
   ```bash
   # In your Supabase project settings
   echo $STRIPE_SECRET_KEY
   echo $STRIPE_WEBHOOK_SECRET
   ```

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Stripe and Supabase logs
3. Contact support with specific error messages
4. Include relevant configuration (without exposing secrets)

---

This setup enables secure payment processing with automatic trial management and subscription handling for the EthicGuard platform.