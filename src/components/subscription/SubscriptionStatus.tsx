import React from 'react';
import { Crown, Calendar, CreditCard, AlertTriangle, Clock, Gift, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useSubscription } from '../../hooks/useSubscription';
import { stripeService } from '../../services/stripe';
import { products } from '../../stripe-config';

export function SubscriptionStatus() {
  const { subscription, loading, error, isActive, isCanceled } = useSubscription();

  if (loading) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-900">Loading subscription...</h3>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Subscription Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-gray-400" />
            No Active Subscription
          </CardTitle>
        </CardHeader>
        <div className="px-6 pb-6">
          <p className="text-gray-600 mb-4">
            You don't have an active subscription. Subscribe to access premium features.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Free Trial Available</span>
            </div>
            <p className="text-sm text-blue-800">
              Start with a 7-day free trial. No payment required during trial period.
            </p>
          </div>
          
          <Button onClick={() => window.location.href = '/pricing'}>
            Start Free Trial
          </Button>
        </div>
      </Card>
    );
  }

  const currentProduct = products.find(p => p.priceId === subscription.price_id);
  const statusColor = stripeService.getSubscriptionStatusColor(subscription.subscription_status);
  const statusText = stripeService.getSubscriptionStatusText(subscription.subscription_status);
  const isTrialing = stripeService.isSubscriptionTrialing(subscription.subscription_status);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-blue-600" />
            Subscription Status
          </div>
          <Badge variant={statusColor}>
            {statusText}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <div className="px-6 pb-6 space-y-4">
        {currentProduct && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Current Plan</h4>
            <p className="text-2xl font-bold text-blue-600">{currentProduct.name}</p>
            <p className="text-sm text-gray-600">{currentProduct.description}</p>
          </div>
        )}

        {isTrialing && subscription.current_period_end && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Free Trial Active</p>
                <p className="text-sm text-blue-800">
                  Your free trial ends on {stripeService.formatDate(subscription.current_period_end)}. 
                  You'll be charged {currentProduct ? stripeService.formatPrice(currentProduct.price, currentProduct.currency) : ''} after the trial period.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subscription.current_period_end && (
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {isTrialing ? 'Trial ends' : subscription.cancel_at_period_end ? 'Expires' : 'Next billing'}
                </p>
                <p className="text-sm text-gray-600">
                  {stripeService.formatDate(subscription.current_period_end)}
                </p>
              </div>
            </div>
          )}

          {subscription.payment_method_last4 && !isTrialing && (
            <div className="flex items-center space-x-3">
              <CreditCard className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Payment method</p>
                <p className="text-sm text-gray-600">
                  {subscription.payment_method_brand?.toUpperCase()} •••• {subscription.payment_method_last4}
                </p>
              </div>
            </div>
          )}
        </div>

        {subscription.cancel_at_period_end && !isTrialing && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Subscription Ending</p>
                <p className="text-sm text-yellow-800">
                  Your subscription will end on {stripeService.formatDate(subscription.current_period_end!)}. 
                  You'll lose access to premium features after this date.
                </p>
              </div>
            </div>
          </div>
        )}

        {!isActive && !isCanceled && !isTrialing && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900">Payment Issue</p>
                <p className="text-sm text-red-800">
                  There's an issue with your subscription. Please update your payment method.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
            {isTrialing ? 'Upgrade Plan' : 'Change Plan'}
          </Button>
          {(isActive || isTrialing) && (
            <Button variant="outline">
              Manage Billing
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}