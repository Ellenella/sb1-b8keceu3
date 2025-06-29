import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');
const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
  };

  // For 204 No Content, don't include Content-Type or body
  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return corsResponse(null, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    // Check if Stripe is configured
    if (!stripeSecret) {
      console.error('Stripe secret key not configured');
      return corsResponse({ 
        error: 'Payment processing is not configured. Please contact support.',
        code: 'STRIPE_NOT_CONFIGURED'
      }, 500);
    }

    const stripe = new Stripe(stripeSecret, {
      appInfo: {
        name: 'EthicGuard Integration',
        version: '1.0.0',
      },
    });

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return corsResponse({ 
        error: 'Invalid request format',
        code: 'INVALID_REQUEST'
      }, 400);
    }

    const { price_id, success_url, cancel_url, mode, trial_days } = requestBody;

    // Validate required parameters
    const error = validateParameters(
      { price_id, success_url, cancel_url, mode },
      {
        cancel_url: 'string',
        price_id: 'string',
        success_url: 'string',
        mode: { values: ['payment', 'subscription'] },
      },
    );

    if (error) {
      return corsResponse({ error }, 400);
    }

    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return corsResponse({ error: 'Authorization header required' }, 401);
    }

    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError) {
      console.error('Failed to authenticate user:', getUserError);
      return corsResponse({ error: 'Failed to authenticate user' }, 401);
    }

    if (!user) {
      return corsResponse({ error: 'User not found' }, 404);
    }

    // Get or create Stripe customer
    const { data: customer, error: getCustomerError } = await supabase
      .from('stripe_customers')
      .select('customer_id')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .maybeSingle();

    if (getCustomerError) {
      console.error('Failed to fetch customer information from the database', getCustomerError);
      return corsResponse({ error: 'Failed to fetch customer information' }, 500);
    }

    let customerId;

    /**
     * In case we don't have a mapping yet, the customer does not exist and we need to create one.
     */
    if (!customer || !customer.customer_id) {
      try {
        const newCustomer = await stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });

        console.log(`Created new Stripe customer ${newCustomer.id} for user ${user.id}`);

        const { error: createCustomerError } = await supabase.from('stripe_customers').insert({
          user_id: user.id,
          customer_id: newCustomer.id,
        });

        if (createCustomerError) {
          console.error('Failed to save customer information in the database', createCustomerError);

          // Try to clean up the Stripe customer
          try {
            await stripe.customers.del(newCustomer.id);
          } catch (deleteError) {
            console.error('Failed to clean up Stripe customer:', deleteError);
          }

          return corsResponse({ error: 'Failed to create customer mapping' }, 500);
        }

        if (mode === 'subscription') {
          const { error: createSubscriptionError } = await supabase.from('stripe_subscriptions').insert({
            customer_id: newCustomer.id,
            status: 'not_started',
          });

          if (createSubscriptionError) {
            console.error('Failed to save subscription in the database', createSubscriptionError);

            // Try to clean up the Stripe customer
            try {
              await stripe.customers.del(newCustomer.id);
            } catch (deleteError) {
              console.error('Failed to delete Stripe customer after subscription creation error:', deleteError);
            }

            return corsResponse({ error: 'Unable to save the subscription in the database' }, 500);
          }
        }

        customerId = newCustomer.id;
        console.log(`Successfully set up new customer ${customerId} with subscription record`);
      } catch (stripeError) {
        console.error('Failed to create Stripe customer:', stripeError);
        return corsResponse({ 
          error: 'Failed to create customer account. Please try again.',
          code: 'STRIPE_CUSTOMER_ERROR'
        }, 500);
      }
    } else {
      customerId = customer.customer_id;

      if (mode === 'subscription') {
        // Verify subscription exists for existing customer
        const { data: subscription, error: getSubscriptionError } = await supabase
          .from('stripe_subscriptions')
          .select('status')
          .eq('customer_id', customerId)
          .maybeSingle();

        if (getSubscriptionError) {
          console.error('Failed to fetch subscription information from the database', getSubscriptionError);
          return corsResponse({ error: 'Failed to fetch subscription information' }, 500);
        }

        if (!subscription) {
          // Create subscription record for existing customer if missing
          const { error: createSubscriptionError } = await supabase.from('stripe_subscriptions').insert({
            customer_id: customerId,
            status: 'not_started',
          });

          if (createSubscriptionError) {
            console.error('Failed to create subscription record for existing customer', createSubscriptionError);
            return corsResponse({ error: 'Failed to create subscription record for existing customer' }, 500);
          }
        }
      }
    }

    // Check if customer has already used a trial
    let hasUsedTrial = false;
    if (mode === 'subscription' && trial_days && trial_days > 0) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: customerId,
          limit: 100,
        });

        // Check if any previous subscription had a trial
        hasUsedTrial = subscriptions.data.some(sub => sub.trial_start !== null);
      } catch (stripeError) {
        console.error('Failed to check trial history:', stripeError);
        // Continue without trial if we can't check history
        hasUsedTrial = true;
      }
    }

    // Prepare checkout session options
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode,
      success_url,
      cancel_url,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    };

    // Add trial period for subscriptions if applicable
    if (mode === 'subscription' && trial_days && trial_days > 0 && !hasUsedTrial) {
      sessionOptions.subscription_data = {
        trial_period_days: trial_days,
      };
    }

    // create Checkout Session
    try {
      const session = await stripe.checkout.sessions.create(sessionOptions);

      console.log(`Created checkout session ${session.id} for customer ${customerId}${
        sessionOptions.subscription_data?.trial_period_days ? ` with ${trial_days} day trial` : ''
      }`);

      return corsResponse({ 
        sessionId: session.id, 
        url: session.url,
        hasTrial: !hasUsedTrial && trial_days && trial_days > 0,
        trialDays: !hasUsedTrial ? trial_days : 0
      });
    } catch (stripeError: any) {
      console.error('Failed to create checkout session:', stripeError);
      return corsResponse({ 
        error: 'Failed to create checkout session. Please try again.',
        code: 'STRIPE_SESSION_ERROR',
        details: stripeError.message
      }, 500);
    }

  } catch (error: any) {
    console.error(`Checkout error: ${error.message}`);
    return corsResponse({ 
      error: 'An unexpected error occurred. Please try again.',
      code: 'UNEXPECTED_ERROR',
      details: error.message
    }, 500);
  }
});

type ExpectedType = 'string' | { values: string[] };
type Expectations<T> = { [K in keyof T]: ExpectedType };

function validateParameters<T extends Record<string, any>>(values: T, expected: Expectations<T>): string | undefined {
  for (const parameter in expected) {
    const expectation = expected[parameter];
    const value = values[parameter];

    if (expectation === 'string') {
      if (value == null) {
        return `Missing required parameter ${parameter}`;
      }
      if (typeof value !== 'string') {
        return `Expected parameter ${parameter} to be a string got ${JSON.stringify(value)}`;
      }
    } else {
      if (!expectation.values.includes(value)) {
        return `Expected parameter ${parameter} to be one of ${expectation.values.join(', ')}`;
      }
    }
  }

  return undefined;
}