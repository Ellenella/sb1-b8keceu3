export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  interval?: 'month' | 'year';
  trialDays?: number;
  features: string[];
}

export const products: Product[] = [
  {
    id: 'prod_SaI4fEbOspysLy',
    priceId: 'price_1Rf7USQoPytk2OqzXloz4w8p',
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
    id: 'prod_SaI4482oKzRaW2',
    priceId: 'price_1Rf7U6QoPytk2OqzXkduMXwa',
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

export function getProductByPriceId(priceId: string): Product | undefined {
  return products.find(product => product.priceId === priceId);
}

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}