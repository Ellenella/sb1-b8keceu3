import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full">
        <Card className="text-center p-8">
          <div className="mb-6">
            <XCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Checkout Canceled
            </h1>
            <p className="text-gray-600">
              Your payment was canceled. No charges have been made to your account.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">What happened?</h3>
            <p className="text-sm text-gray-600">
              You canceled the checkout process before completing your payment. 
              You can try again at any time.
            </p>
          </div>

          <div className="space-y-3">
            <Link to="/pricing">
              <Button className="w-full" icon={RefreshCw}>
                Try Again
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full" icon={ArrowLeft}>
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
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