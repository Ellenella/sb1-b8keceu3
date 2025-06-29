import { supabase } from '../lib/supabase';

export interface CheckoutSessionRequest {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl?: string;
  cancelUrl?: string;
  trialDays?: number;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
  hasTrial?: boolean;
  trialDays?: number;
}

export interface SubscriptionData {
  customer_id: string;
  subscription_id: string | null;
  subscription_status: string;
  price_id: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export interface OrderData {
  customer_id: string;
  order_id: number;
  checkout_session_id: string;
  payment_intent_id: string;
  amount_subtotal: number;
  amount_total: number;
  currency: string;
  payment_status: string;
  order_status: string;
  order_date: string;
}

class StripeService {
  private static instance: StripeService;

  static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  async createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
    // Check if Supabase is configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase is not configured. Please check your environment variables.');
    }

    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.access_token) {
      throw new Error('User not authenticated. Please sign in to continue.');
    }

    const baseUrl = window.location.origin;
    const successUrl = request.successUrl || `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = request.cancelUrl || `${baseUrl}/checkout/cancel`;

    try {
      console.log('Creating checkout session with:', {
        price_id: request.priceId,
        mode: request.mode,
        trial_days: request.trialDays
      });

      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: request.priceId,
          mode: request.mode,
          success_url: successUrl,
          cancel_url: cancelUrl,
          trial_days: request.trialDays,
        }),
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          console.error('Checkout error response:', errorData);
          
          if (errorData.error) {
            errorMessage = errorData.error;
          }
          
          // Handle specific error codes
          if (errorData.code === 'STRIPE_NOT_CONFIGURED') {
            errorMessage = 'Payment processing is temporarily unavailable. Please try again later or contact support.';
          } else if (errorData.code === 'STRIPE_CUSTOMER_ERROR') {
            errorMessage = 'Failed to set up your account. Please try again.';
          } else if (errorData.code === 'STRIPE_SESSION_ERROR') {
            errorMessage = 'Failed to start checkout. Please try again.';
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Checkout session created:', data);
      return data;
    } catch (fetchError: any) {
      console.error('Fetch error:', fetchError);
      
      // Check if it's a network error
      if (fetchError instanceof TypeError && 
          (fetchError.message.includes('fetch') || 
           fetchError.message.includes('network') ||
           fetchError.message.includes('Failed to fetch'))) {
        throw new Error('Network error. Please check your internet connection and try again.\n\nIf this problem persists, please contact support');
      }
      
      throw fetchError;
    }
  }

  async getUserSubscription(): Promise<SubscriptionData | null> {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getUserSubscription:', error);
      return null;
    }
  }

  async getUserOrders(): Promise<OrderData[]> {
    try {
      const { data, error } = await supabase
        .from('stripe_user_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      return [];
    }
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    // In a real implementation, you would use Stripe.js to redirect
    // For now, we'll use the URL from the session response
    const { data: checkoutData } = await this.createCheckoutSession({
      priceId: sessionId, // This would be passed differently in real implementation
      mode: 'subscription'
    });
    
    if (checkoutData.url) {
      window.location.href = checkoutData.url;
    }
  }

  formatPrice(amount: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }

  isSubscriptionActive(status: string): boolean {
    return ['active', 'trialing'].includes(status);
  }

  isSubscriptionCanceled(status: string): boolean {
    return ['canceled', 'unpaid', 'incomplete_expired'].includes(status);
  }

  isSubscriptionTrialing(status: string): boolean {
    return status === 'trialing';
  }

  getSubscriptionStatusColor(status: string): 'success' | 'warning' | 'error' | 'info' | 'neutral' {
    switch (status) {
      case 'active':
        return 'success';
      case 'trialing':
        return 'info';
      case 'past_due':
      case 'incomplete':
        return 'warning';
      case 'canceled':
      case 'unpaid':
      case 'incomplete_expired':
        return 'error';
      case 'paused':
        return 'info';
      default:
        return 'neutral';
    }
  }

  getSubscriptionStatusText(status: string): string {
    switch (status) {
      case 'trialing':
        return 'Free Trial';
      case 'active':
        return 'Active';
      case 'past_due':
        return 'Past Due';
      case 'canceled':
        return 'Canceled';
      case 'incomplete':
        return 'Incomplete';
      case 'incomplete_expired':
        return 'Expired';
      case 'unpaid':
        return 'Unpaid';
      case 'paused':
        return 'Paused';
      default:
        return status.replace('_', ' ');
    }
  }
}

export const stripeService = StripeService.getInstance();