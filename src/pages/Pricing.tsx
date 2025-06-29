import React from 'react';
import { Gift, Clock, Check, Loader2, AlertTriangle } from 'lucide-react';
import { products } from '../stripe-config';
import { PricingCard } from '../components/pricing/PricingCard';
import { useSubscription } from '../hooks/useSubscription';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Link, useLocation } from 'react-router-dom';

export function Pricing() {
  const { subscription, loading, error } = useSubscription();
  const location = useLocation();
  
  // Check if we're in the authenticated area (with sidebar) or public area
  const isAuthenticatedRoute = location.pathname.startsWith('/pricing') && location.pathname !== '/pricing';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading pricing information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Subscription</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const renderContent = () => (
    <>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Select the perfect plan for your AI governance needs. All plans include our core features with different levels of support and capabilities.
        </p>
        
        {/* Free Trial Banner */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Gift className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">7-Day Free Trial</h3>
              </div>
              <p className="text-blue-800 mb-4">
                Try EthicGuard risk-free for 7 days. No payment required during trial period.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-blue-700">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Full feature access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {subscription && (
        <Card className="mb-8 p-6 bg-blue-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Current Subscription</h3>
            <p className="text-blue-800">
              You are currently subscribed to the{' '}
              <span className="font-medium">
                {products.find(p => p.priceId === subscription.price_id)?.name || 'Unknown'}
              </span>{' '}
              plan
              {subscription.subscription_status === 'trialing' && (
                <span className="ml-2">
                  <Badge variant="info" className="inline-flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Free Trial
                  </Badge>
                </span>
              )}
            </p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {products.map((product, index) => (
          <PricingCard
            key={product.id}
            product={product}
            isPopular={index === 0} // Make the first product (Pro) popular
            currentPriceId={subscription?.price_id}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-gray-100 rounded-lg p-6 max-w-2xl mx-auto mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens after the trial?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Your trial automatically converts to a paid subscription</p>
            <p>• You'll be charged the regular monthly rate</p>
            <p>• Cancel anytime during or after the trial period</p>
            <p>• No hidden fees or long-term commitments</p>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">
          Need a custom solution? Contact our sales team for enterprise pricing.
        </p>
        <a
          href="mailto:fitsumella90@gmail.com"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Contact Sales
        </a>
      </div>
    </>
  );

  // For the public route (no sidebar)
  if (location.pathname === '/pricing') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderContent()}
        </div>
      </div>
    );
  }

  // For the authenticated route (with sidebar)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing & Plans</h1>
          <p className="text-gray-600 mt-1">Choose the right plan for your organization</p>
        </div>
      </div>
      
      {renderContent()}
    </div>
  );
}