import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2, Gift, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useSubscription } from '../hooks/useSubscription';
import { stripeService } from '../services/stripe';
import { products } from '../stripe-config';

export function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const { subscription, loading, refetch } = useSubscription();
  const [isRefetching, setIsRefetching] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Refetch subscription data after successful checkout
    const refetchData = async () => {
      setIsRefetching(true);
      // Wait a moment for webhook to process
      await new Promise(resolve => setTimeout(resolve, 2000));
      await refetch();
      setIsRefetching(false);
    };

    if (sessionId) {
      refetchData();
    }
  }, [sessionId, refetch]);

  if (loading || isRefetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Processing your subscription...</p>
        </div>
      </div>
    );
  }

  const currentProduct = subscription ? products.find(p => p.priceId === subscription.price_id) : null;
  const isTrialing = subscription ? stripeService.isSubscriptionTrialing(subscription.subscription_status) : false;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full">
        <Card className="text-center p-8">
          <div className="mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {isTrialing ? 'Free Trial Started!' : 'Payment Successful!'}
            </h1>
            <p className="text-gray-600">
              {isTrialing 
                ? 'Your 7-day free trial has begun. Enjoy full access to EthicGuard features.'
                : 'Thank you for subscribing to EthicGuard. Your account has been activated.'
              }
            </p>
          </div>

          {subscription && (
            <div className={`${isTrialing ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border rounded-lg p-4 mb-6`}>
              <h3 className={`font-semibold ${isTrialing ? 'text-blue-900' : 'text-green-900'} mb-2`}>
                {isTrialing ? 'Trial Details' : 'Subscription Details'}
              </h3>
              <div className={`text-sm ${isTrialing ? 'text-blue-800' : 'text-green-800'} space-y-1`}>
                <p>Plan: <span className="font-medium">{currentProduct?.name || 'Premium'}</span></p>
                <p>
                  Status: 
                  <Badge 
                    variant={stripeService.getSubscriptionStatusColor(subscription.subscription_status)} 
                    className="ml-2"
                  >
                    {stripeService.getSubscriptionStatusText(subscription.subscription_status)}
                  </Badge>
                </p>
                {subscription.current_period_end && (
                  <p>
                    {isTrialing ? 'Trial ends' : 'Next billing'}: <span className="font-medium">
                      {stripeService.formatDate(subscription.current_period_end)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {isTrialing && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Gift className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-yellow-900">Free Trial Information</p>
                  <p className="text-sm text-yellow-800 mt-1">
                    You won't be charged during your trial period. After the trial ends, 
                    you'll be automatically billed {currentProduct ? stripeService.formatPrice(currentProduct.price, currentProduct.currency) : ''} monthly.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link to="/dashboard">
              <Button className="w-full" icon={ArrowRight}>
                Go to Dashboard
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Questions? Contact our support team at{' '}
              <a href="mailto:support@ethicguard.com" className="text-blue-600 hover:text-blue-700">
                support@ethicguard.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}