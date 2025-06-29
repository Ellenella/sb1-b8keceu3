import React, { useState } from 'react';
import { Check, Loader2, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Product } from '../../stripe-config';
import { stripeService } from '../../services/stripe';
import { useAuth } from '../../hooks/useAuth';

interface PricingCardProps {
  product: Product;
  isPopular?: boolean;
  currentPriceId?: string | null;
  onSuccess?: () => void;
}

export function PricingCard({ product, isPopular = false, currentPriceId, onSuccess }: PricingCardProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCurrentPlan = currentPriceId === product.priceId;

  const handleSubscribe = async () => {
    if (!user) {
      // Redirect to auth page
      window.location.href = '/auth';
      return;
    }

    if (isCurrentPlan) {
      return; // Already subscribed to this plan
    }

    try {
      setLoading(true);
      setError(null);

      console.log(`Starting checkout for product: ${product.name} (${product.priceId})`);

      const { url, hasTrial, trialDays } = await stripeService.createCheckoutSession({
        priceId: product.priceId,
        mode: product.mode,
        trialDays: product.trialDays,
      });

      if (url) {
        console.log(`Redirecting to checkout URL: ${url}`);
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout session';
      console.error('Checkout error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return 'Loading...';
    if (isCurrentPlan) return 'Current Plan';
    if (!user) return 'Sign Up';
    if (product.mode === 'subscription' && product.trialDays) {
      return `Start ${product.trialDays}-Day Free Trial`;
    }
    return product.mode === 'subscription' ? 'Subscribe' : 'Purchase';
  };

  const getButtonVariant = () => {
    if (isCurrentPlan) return 'outline';
    return isPopular ? 'primary' : 'outline';
  };

  return (
    <Card className={`relative ${isPopular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge variant="info">Most Popular</Badge>
        </div>
      )}
      
      <div className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-gray-900">
              {stripeService.formatPrice(product.price, product.currency)}
            </span>
            {product.interval && (
              <span className="text-gray-600 ml-2">/{product.interval}</span>
            )}
          </div>
          <p className="text-gray-600">{product.description}</p>
          
          {product.trialDays && product.mode === 'subscription' && !isCurrentPlan && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  {product.trialDays} days free trial
                </span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                No payment required during trial
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-600">{error}</p>
                <p className="text-xs text-red-500 mt-1">
                  If this problem persists, please contact support.
                </p>
              </div>
            </div>
          </div>
        )}

        <Button
          className="w-full mb-6"
          variant={getButtonVariant()}
          onClick={handleSubscribe}
          disabled={loading || isCurrentPlan}
          loading={loading}
          icon={loading ? Loader2 : undefined}
        >
          {getButtonText()}
        </Button>

        <div className="space-y-3">
          {product.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}