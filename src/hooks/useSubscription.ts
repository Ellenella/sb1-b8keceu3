import { useState, useEffect } from 'react';
import { stripeService, SubscriptionData } from '../services/stripe';
import { useAuth } from './useAuth';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    } else {
      setSubscription(null);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if Supabase is configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.log('Supabase not configured, using demo mode for subscription');
        // In demo mode, simulate no subscription
        setSubscription(null);
        return;
      }
      
      const data = await stripeService.getUserSubscription();
      setSubscription(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch subscription';
      setError(errorMessage);
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (user) {
      fetchSubscription();
    }
  };

  return {
    subscription,
    loading,
    error,
    refetch,
    isActive: subscription ? stripeService.isSubscriptionActive(subscription.subscription_status) : false,
    isCanceled: subscription ? stripeService.isSubscriptionCanceled(subscription.subscription_status) : false,
  };
}