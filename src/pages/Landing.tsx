import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Users,
  Zap,
  Lock,
  Globe,
  Award,
  TrendingUp,
  Brain,
  FileText,
  Database
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const features = [
  {
    icon: Brain,
    title: 'AI Governance Module (EthicGuard 2.0)',
    description: 'AI Firewall blocks toxic/hallucinated outputs using NLP. Real-time bias detection for gender/racial bias. Generates SOC 2/GDPR-ready compliance reports.',
    badge: '1️⃣',
    color: 'bg-blue-100 text-blue-600',
    borderColor: 'border-l-blue-500',
  },
  {
    icon: FileText,
    title: 'Privacy & Terms Autopilot',
    description: 'One-click GDPR/CCPA/COPPA-ready policy generator. Auto-enforcement blocks non-compliant data flows. NFT versioning mints every policy update on-chain for legal proof.',
    badge: '2️⃣',
    color: 'bg-purple-100 text-purple-600',
    borderColor: 'border-l-purple-500',
  },
  {
    icon: Database,
    title: 'Blockchain-Powered Audit Trail',
    description: 'Algorand/Solana NFTs immutably record each compliance decision. Regulator Portal allows authorities to verify compliance in one click.',
    badge: '3️⃣',
    color: 'bg-orange-100 text-orange-600',
    borderColor: 'border-l-orange-500',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Chief Technology Officer',
    company: 'TechFlow Inc.',
    content: 'EthicGuard has transformed how we approach AI governance. The real-time monitoring caught issues we never would have seen.',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Compliance Director',
    company: 'FinanceAI Solutions',
    content: 'The audit trail features are exceptional. We passed our SOC 2 audit with flying colors thanks to EthicGuard.',
    rating: 5,
  },
  {
    name: 'Dr. Emily Watson',
    role: 'AI Ethics Lead',
    company: 'MedTech Innovations',
    content: 'Finally, a platform that makes AI ethics actionable. The bias detection has been a game-changer for our healthcare AI.',
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: 'Basic',
    price: '$49',
    period: 'per month',
    description: 'Perfect for small teams getting started with AI governance',
    features: [
      'Up to 5 users',
      '10,000 AI requests/month',
      'Real-time AI risk monitoring',
      'Basic compliance rules',
      'Email support',
      'Standard audit reports',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$149',
    period: 'per month',
    description: 'Advanced features for growing organizations',
    features: [
      'Up to 25 users',
      '100,000 AI requests/month',
      'Advanced rule management',
      'Incident logging & audit trails',
      'Priority support',
      'Custom compliance templates',
      'API access',
      'Advanced analytics',
    ],
    cta: 'Get Started',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'pricing',
    description: 'Tailored solutions for large enterprises',
    features: [
      'Unlimited users',
      'Unlimited AI requests',
      'Dedicated compliance officer access',
      'Custom integrations & SLAs',
      '24/7 dedicated support',
      'On-premise deployment',
      'Custom rule development',
      'Regulatory consulting',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const stats = [
  { label: 'AI Requests Monitored', value: '50M+' },
  { label: 'Compliance Violations Prevented', value: '125K+' },
  { label: 'Enterprise Customers', value: '500+' },
  { label: 'Uptime Guarantee', value: '99.9%' },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-3 text-xl font-bold text-gray-900">EthicGuard</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900 font-medium">Blog</Link>
              <Link to="/docs" className="text-gray-600 hover:text-gray-900 font-medium">Docs</Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Compliance Made
              <span className="text-blue-600"> Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Monitor, protect, and ensure compliance across all your AI systems with real-time risk detection, 
              automated governance, and comprehensive audit trails.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" icon={ArrowRight}>
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              No credit card required • 14-day free trial • Setup in minutes
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive AI & Compliance Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Three powerful modules working together to ensure your AI systems and data practices are safe, compliant, and trustworthy.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`relative overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 ${feature.borderColor}`}>
                <div className="absolute top-6 right-6">
                  <span className="text-3xl">{feature.badge}</span>
                </div>
                <div className="p-8">
                  <div className={`h-16 w-16 ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 pr-12">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Organizations
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers say about EthicGuard
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-blue-600">{testimonial.company}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that fits your organization's needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/auth" className="block">
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? 'primary' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Secure Your AI?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of organizations already using EthicGuard to ensure their AI systems are safe, compliant, and trustworthy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="ml-3 text-xl font-bold">EthicGuard</span>
              </div>
              <p className="text-gray-400">
                Making AI governance simple and accessible for organizations of all sizes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EthicGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}