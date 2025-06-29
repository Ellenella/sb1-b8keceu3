import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Shield, 
  ChevronDown, 
  ChevronRight, 
  Book, 
  Code, 
  Settings, 
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  Brain,
  Zap,
  Globe,
  Lock,
  BarChart3,
  Database
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  items: DocItem[];
}

interface DocItem {
  id: string;
  title: string;
  content: string;
  codeExample?: string;
}

const documentationSections: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Book,
    items: [
      {
        id: 'quick-start',
        title: 'Quick Start Guide',
        content: `Welcome to EthicGuard! Get started with AI governance in minutes using our comprehensive platform.

**What is EthicGuard?**
EthicGuard is a complete AI governance platform that combines real-time AI detection, compliance management, and blockchain-powered audit trails. Our platform uses Claude 3 Sonnet and BERT models for industry-leading accuracy.

**Step 1: Create Your Account**
Sign up for a free EthicGuard account and verify your email address. Choose your role (Developer, Compliance Officer, Auditor, or Executive) to get a customized dashboard.

**Step 2: Register Your First Bot**
Navigate to Bot Management and register your AI application. Configure governance rules based on your organization's needs.

**Step 3: Install the SDK**
Install our lightweight Node.js SDK to start monitoring your AI systems in real-time.

**Step 4: Configure AI Detection**
Set up Claude 3 Sonnet for bias detection and BERT models for toxicity detection with custom thresholds.`,
        codeExample: `npm install @ethicguard/ai-firewall

# Verify installation
node -e "console.log(require('@ethicguard/ai-firewall').version)"`
      },
      {
        id: 'platform-overview',
        title: 'Platform Overview',
        content: `EthicGuard provides three integrated modules for comprehensive AI governance:

**🧠 AI Governance Module (EthicGuard 2.0)**
- Real-time AI firewall using Claude 3 Sonnet and BERT models
- Bias detection with 94.2% accuracy for gender, racial, age, and cultural bias
- Toxicity detection with 91.8% accuracy using unitary/toxic-bert
- Hallucination detection for AI response verification
- PII protection and exposure prevention
- Sub-100ms detection latency with edge infrastructure

**🔒 Privacy & Terms Autopilot**
- One-click GDPR/CCPA/COPPA-ready policy generator
- Auto-enforcement blocks non-compliant data flows
- NFT versioning mints every policy update on-chain
- Immutable legal proof for regulatory compliance

**⛓️ Blockchain-Powered Audit Trail**
- Algorand/Solana NFTs record each compliance decision
- Immutable audit trails for regulatory verification
- One-click compliance verification for authorities
- Comprehensive incident logging and reporting`,
        codeExample: `// Platform capabilities overview
const capabilities = {
  aiDetection: ['Claude 3 Sonnet', 'BERT Models', 'Custom Rules'],
  compliance: ['GDPR', 'CCPA', 'SOC 2', 'HIPAA'],
  blockchain: ['Algorand', 'Solana', 'Immutable Records'],
  accuracy: { bias: '94.2%', toxicity: '91.8%', pii: '96.5%' }
};`
      },
      {
        id: 'authentication',
        title: 'Authentication & Setup',
        content: `EthicGuard uses secure API key authentication with role-based access control.

**API Key Types:**
- **Development**: For testing and development environments
- **Production**: For live applications with full AI detection
- **Read-only**: For monitoring and analytics access only

**Role-Based Access:**
- **Developer**: Bot management, SDK integration, basic analytics
- **Compliance Officer**: Rule configuration, incident management, reporting
- **Auditor**: Full audit trail access, compliance verification
- **Executive**: High-level dashboards, strategic insights

**Security Best Practices:**
- Store API keys securely using environment variables
- Rotate keys regularly (recommended: every 90 days)
- Use different keys for different environments
- Monitor API key usage in the dashboard`,
        codeExample: `// Environment configuration
ETHICGUARD_API_KEY=eg_sk_live_your_production_key_here
ETHICGUARD_ENVIRONMENT=production

// SDK initialization
const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY,
  environment: process.env.ETHICGUARD_ENVIRONMENT || 'production'
});`
      }
    ]
  },
  {
    id: 'ai-detection',
    title: 'AI Detection Models',
    icon: Brain,
    items: [
      {
        id: 'claude-integration',
        title: 'Claude 3 Sonnet Integration',
        content: `EthicGuard integrates directly with Anthropic's Claude 3 Sonnet for sophisticated bias detection and content analysis.

**Bias Detection Capabilities:**
- Gender bias detection with contextual understanding
- Racial and ethnic bias identification
- Age discrimination detection
- Religious and cultural bias analysis
- Socioeconomic bias recognition
- Intersectional bias detection

**Advanced Features:**
- Natural language explanation of detected bias
- Confidence scoring (0-100%)
- Suggested alternative phrasings
- Context-aware analysis
- Multi-language support

**Performance Metrics:**
- 94.2% accuracy in bias detection
- Sub-50ms average response time
- 99.9% uptime with failover protection`,
        codeExample: `// Claude-powered bias detection
const biasResult = await firewall.detectBias(content, {
  types: ['gender', 'racial', 'age', 'religious'],
  includeExplanation: true,
  confidenceThreshold: 0.7
});

if (biasResult.detected) {
  console.log('Bias types:', biasResult.biasTypes);
  console.log('Confidence:', biasResult.confidence);
  console.log('Explanation:', biasResult.explanation);
  console.log('Suggestions:', biasResult.suggestions);
}`
      },
      {
        id: 'bert-models',
        title: 'BERT Model Integration',
        content: `EthicGuard uses state-of-the-art BERT models via Hugging Face for toxicity detection and content classification.

**Toxicity Detection:**
- Uses unitary/toxic-bert for high-accuracy classification
- 91.8% accuracy in toxicity detection
- Multi-category classification (hate speech, threats, harassment)
- Real-time processing with edge optimization

**PII Detection:**
- Named Entity Recognition (NER) for personal information
- Pattern matching for emails, phone numbers, SSNs
- 96.5% accuracy in PII identification
- GDPR/CCPA compliant data handling

**Content Classification:**
- Sentiment analysis and emotional tone detection
- Professional vs. inappropriate content classification
- Medical and financial advice detection
- Custom category training available`,
        codeExample: `// BERT-powered toxicity detection
const toxicityResult = await firewall.checkToxicity(content);

console.log('Is toxic:', toxicityResult.toxic);
console.log('Toxicity score:', toxicityResult.score);
console.log('Categories:', toxicityResult.categories);

// PII detection
const piiResult = await firewall.detectPII(content);

if (piiResult.detected) {
  console.log('PII types found:', piiResult.types);
  console.log('Locations:', piiResult.locations);
  console.log('Confidence:', piiResult.confidence);
}`
      },
      {
        id: 'custom-rules',
        title: 'Custom Rule Engine',
        content: `Create sophisticated custom rules that combine AI detection with business logic for your specific use case.

**Rule Types:**
- **Keyword Rules**: Block or flag specific terms and phrases
- **Regex Patterns**: Advanced pattern matching for complex scenarios
- **Threshold Rules**: Combine multiple AI scores with custom logic
- **Context Rules**: Rules that consider conversation history
- **Time-based Rules**: Different rules for different times/dates

**Rule Configuration:**
- Visual rule builder in the dashboard
- JSON-based rule definitions for developers
- A/B testing for rule effectiveness
- Real-time rule updates without deployment

**Advanced Features:**
- Rule precedence and conflict resolution
- Conditional logic with AND/OR operators
- Custom scoring algorithms
- Integration with external data sources`,
        codeExample: `// Custom rule configuration
const customRule = {
  name: "Financial Advice Filter",
  type: "custom",
  conditions: {
    and: [
      { toxicity: { threshold: 0.3 } },
      { keywords: ["investment", "financial advice", "guaranteed returns"] },
      { context: "financial_discussion" }
    ]
  },
  action: "block",
  severity: "high",
  message: "Unauthorized financial advice detected"
};

await firewall.configureRules({ financialAdvice: customRule });`
      }
    ]
  },
  {
    id: 'sdk-integration',
    title: 'SDK Integration',
    icon: Code,
    items: [
      {
        id: 'nodejs-sdk',
        title: 'Node.js SDK',
        content: `The EthicGuard Node.js SDK provides seamless integration with your JavaScript and TypeScript applications.

**Core Features:**
- Real-time content shielding with Claude and BERT
- Express.js middleware for automatic protection
- Comprehensive TypeScript support
- Fail-safe design with graceful degradation
- Built-in caching and performance optimization

**Supported Frameworks:**
- Express.js, Fastify, Koa
- Next.js, Nuxt.js
- Nest.js, Adonis.js
- Any Node.js application

**AI Provider Integrations:**
- OpenAI GPT-4/3.5 with governance wrapper
- Anthropic Claude with native bias detection
- Hugging Face models with toxicity filtering
- Custom model integration support`,
        codeExample: `import { EthicGuardFirewall } from '@ethicguard/ai-firewall';
import OpenAI from 'openai';

const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Protected AI interaction
async function protectedChat(prompt, userId) {
  // Shield the input with Claude + BERT
  const shieldResult = await firewall.shield({
    prompt,
    userId,
    applicationId: 'chat-app'
  });

  if (shieldResult.blocked) {
    return {
      blocked: true,
      reason: shieldResult.reason,
      suggestedResponse: shieldResult.suggestedResponse,
      riskScores: shieldResult.riskScores
    };
  }

  // Safe to proceed with OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });

  const response = completion.choices[0].message.content;

  // Log for compliance
  await firewall.logResponse({
    prompt,
    response,
    userId,
    applicationId: 'chat-app'
  });

  return {
    blocked: false,
    response,
    riskScores: shieldResult.riskScores
  };
}`
      },
      {
        id: 'express-middleware',
        title: 'Express.js Middleware',
        content: `Automatic protection for all your AI endpoints with zero configuration required.

**Middleware Features:**
- Automatic prompt analysis before AI processing
- Request blocking with detailed explanations
- Compliance logging for all interactions
- Custom response generation for blocked content
- Performance monitoring and analytics

**Configuration Options:**
- Custom blocking thresholds per endpoint
- Whitelist/blacklist for specific routes
- User-based rule customization
- Rate limiting integration
- Custom error handling`,
        codeExample: `const express = require('express');
const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

const app = express();
const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY
});

// Automatic protection for all AI endpoints
app.use('/api/ai', firewall.middleware({
  blockingThreshold: 0.7,
  enableLogging: true,
  customResponses: true
}));

app.post('/api/ai/chat', async (req, res) => {
  // Middleware already analyzed req.body.prompt
  // req.ethicguard contains analysis results
  
  if (req.ethicguard?.blocked) {
    return res.status(400).json({
      error: 'Content blocked by AI governance',
      reason: req.ethicguard.reason,
      severity: req.ethicguard.severity,
      suggestedResponse: req.ethicguard.suggestedResponse,
      requestId: req.ethicguard.requestId
    });
  }

  // Process AI request safely
  const aiResponse = await processAIRequest(req.body.prompt);
  
  // Log response for compliance
  await firewall.logResponse({
    prompt: req.body.prompt,
    response: aiResponse,
    userId: req.body.userId,
    metadata: { endpoint: '/api/ai/chat' }
  });

  res.json({
    response: aiResponse,
    complianceScore: req.ethicguard.riskScores,
    requestId: req.ethicguard.requestId
  });
});`
      },
      {
        id: 'ai-provider-integrations',
        title: 'AI Provider Integrations',
        content: `Pre-built integrations with major AI providers, including governance wrappers and compliance logging.

**OpenAI Integration:**
- GPT-4, GPT-3.5, and DALL-E support
- Automatic prompt and response analysis
- Token usage tracking and optimization
- Rate limiting and error handling

**Anthropic Claude Integration:**
- Claude 3 Sonnet, Haiku, and Opus support
- Native bias detection capabilities
- Constitutional AI alignment
- Advanced reasoning protection

**Hugging Face Integration:**
- 50+ pre-configured models
- Custom model deployment support
- Inference endpoint protection
- Model performance monitoring

**Universal Integration:**
- REST API wrapper for any AI service
- Custom provider configuration
- Webhook integration support
- Multi-provider orchestration`,
        codeExample: `// Multi-provider AI governance
const { ProtectedOpenAI } = require('@ethicguard/ai-firewall/openai');
const { ProtectedClaude } = require('@ethicguard/ai-firewall/anthropic');

const protectedOpenAI = new ProtectedOpenAI({
  ethicguardApiKey: process.env.ETHICGUARD_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY
});

const protectedClaude = new ProtectedClaude({
  ethicguardApiKey: process.env.ETHICGUARD_API_KEY,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY
});

// Use OpenAI with governance
const openaiResult = await protectedOpenAI.chat([
  { role: 'user', content: 'Help me with my project' }
], { userId: 'user-123' });

// Use Claude with governance
const claudeResult = await protectedClaude.complete(
  'Analyze this business proposal',
  { userId: 'user-123' }
);

// Both providers automatically include:
// - Real-time bias detection
// - Toxicity filtering
// - Compliance logging
// - Performance monitoring`
      }
    ]
  },
  {
    id: 'dashboard-features',
    title: 'Dashboard & Analytics',
    icon: BarChart3,
    items: [
      {
        id: 'real-time-monitoring',
        title: 'Real-Time Monitoring',
        content: `Monitor your AI systems in real-time with comprehensive dashboards and instant alerts.

**Live Metrics:**
- Real-time request processing and blocking statistics
- AI model performance and accuracy metrics
- User activity and engagement analytics
- System health and uptime monitoring

**Risk Score Tracking:**
- 24-hour trend analysis for bias, toxicity, and hallucination
- Interactive charts with drill-down capabilities
- Comparative analysis across different AI models
- Threshold breach notifications

**Incident Management:**
- Real-time incident detection and classification
- Automated severity assessment and escalation
- Incident response workflow automation
- Root cause analysis and prevention recommendations`,
        codeExample: `// Real-time monitoring API
const monitoring = await firewall.getMonitoringData({
  timeRange: 'last-24-hours',
  metrics: ['requests', 'blocks', 'risk-scores'],
  groupBy: 'hour'
});

// Subscribe to real-time updates
firewall.subscribeToMetrics((update) => {
  console.log('New metrics:', update);
  updateDashboard(update);
});

// Set up custom alerts
await firewall.configureAlerts({
  riskThreshold: 0.8,
  webhookUrl: 'https://your-app.com/alerts',
  emailNotifications: ['admin@company.com']
});`
      },
      {
        id: 'compliance-reporting',
        title: 'Compliance Reporting',
        content: `Generate comprehensive compliance reports for regulatory requirements and internal audits.

**Report Types:**
- SOC 2 Type II compliance reports
- GDPR data processing activity reports
- CCPA privacy impact assessments
- HIPAA security and privacy reports
- Custom regulatory framework reports

**Automated Generation:**
- Scheduled report generation (daily, weekly, monthly)
- Real-time compliance score calculation
- Automated regulatory submission preparation
- Executive summary dashboards

**Audit Trail Integration:**
- Blockchain-verified compliance records
- Immutable audit logs with cryptographic proof
- Regulatory authority verification portal
- One-click compliance verification for auditors`,
        codeExample: `// Generate compliance report
const report = await firewall.generateComplianceReport({
  framework: 'SOC2',
  period: 'last-quarter',
  includeRecommendations: true,
  format: 'pdf'
});

// Schedule automated reports
await firewall.scheduleReport({
  type: 'weekly-summary',
  recipients: ['compliance@company.com'],
  format: 'pdf',
  includeMetrics: ['violations', 'trends', 'recommendations']
});

// Get blockchain verification
const verification = await firewall.getBlockchainVerification({
  reportId: report.id,
  blockchain: 'algorand'
});`
      },
      {
        id: 'bot-management',
        title: 'Bot Management',
        content: `Centralized management for all your AI applications with granular control and monitoring.

**Bot Registration:**
- Simple bot registration with API key generation
- Role-based access control and permissions
- Custom rule configuration per bot
- Performance monitoring and analytics

**Governance Rules:**
- Bot-specific rule configuration
- Inheritance from organization-wide policies
- A/B testing for rule effectiveness
- Real-time rule updates without downtime

**Performance Analytics:**
- Request volume and processing time metrics
- Blocking rate and compliance score tracking
- User satisfaction and engagement metrics
- Cost optimization recommendations`,
        codeExample: `// Register a new bot
const bot = await firewall.registerBot({
  name: 'Customer Support Bot',
  description: 'Handles customer inquiries',
  rules: ['toxicity-detection', 'bias-filter', 'pii-protection'],
  thresholds: {
    toxicity: 0.7,
    bias: 0.6,
    pii: 0.8
  }
});

// Configure bot-specific rules
await firewall.configureBotRules(bot.id, {
  customRules: [
    {
      name: 'Customer Service Tone',
      type: 'sentiment',
      threshold: 0.3,
      action: 'flag'
    }
  ]
});

// Monitor bot performance
const analytics = await firewall.getBotAnalytics(bot.id, {
  timeRange: 'last-week',
  metrics: ['requests', 'blocks', 'satisfaction']
});`
      }
    ]
  },
  {
    id: 'blockchain-audit',
    title: 'Blockchain Audit Trail',
    icon: Database,
    items: [
      {
        id: 'immutable-records',
        title: 'Immutable Audit Records',
        content: `Every compliance decision is recorded on blockchain for permanent, tamper-proof audit trails.

**Blockchain Networks:**
- Algorand for high-speed, low-cost transactions
- Solana for scalable, enterprise-grade recording
- Cross-chain compatibility for maximum flexibility

**Record Types:**
- AI governance decisions and rule violations
- Privacy policy updates and user consent records
- Compliance rule changes and configuration updates
- Incident response actions and resolutions

**Verification Features:**
- Cryptographic proof of record integrity
- Public verification without exposing sensitive data
- Regulatory authority access portal
- Real-time blockchain explorer integration`,
        codeExample: `// Blockchain audit trail
const auditRecord = await firewall.createAuditRecord({
  type: 'ai-governance-decision',
  event: 'content-blocked',
  data: {
    ruleViolated: 'toxicity-detection',
    severity: 'high',
    confidence: 0.92
  },
  blockchain: 'algorand'
});

// Verify record on blockchain
const verification = await firewall.verifyAuditRecord({
  recordId: auditRecord.id,
  blockchain: 'algorand'
});

console.log('Blockchain verification:', verification);
// {
//   verified: true,
//   transactionHash: '0x...',
//   blockHeight: 15847392,
//   timestamp: '2024-01-15T10:30:00Z'
// }`
      },
      {
        id: 'regulatory-portal',
        title: 'Regulatory Verification Portal',
        content: `Dedicated portal for regulatory authorities to verify compliance records with one-click verification.

**Authority Access:**
- Secure, role-based access for regulatory bodies
- Real-time compliance status verification
- Historical audit trail browsing
- Automated compliance report generation

**Verification Features:**
- One-click record verification on blockchain
- Cryptographic proof of data integrity
- Cross-reference with multiple blockchain networks
- Export capabilities for regulatory submissions

**Privacy Protection:**
- Zero-knowledge proofs for sensitive data
- Selective disclosure of compliance information
- GDPR-compliant data handling
- Anonymized audit trails where required`,
        codeExample: `// Regulatory verification portal
const portalAccess = await firewall.createRegulatoryAccess({
  authority: 'EU-GDPR-Authority',
  permissions: ['view-compliance', 'verify-records'],
  timeframe: '2024-Q1'
});

// Generate verification report
const verificationReport = await firewall.generateVerificationReport({
  authority: 'EU-GDPR-Authority',
  scope: 'data-processing-activities',
  includeBlockchainProof: true
});

// One-click verification
const quickVerification = await firewall.quickVerify({
  complianceFramework: 'GDPR',
  timeRange: 'last-quarter'
});`
      }
    ]
  },
  {
    id: 'faq',
    title: 'FAQ & Support',
    icon: HelpCircle,
    items: [
      {
        id: 'common-questions',
        title: 'Common Questions',
        content: `**Q: How accurate are the AI detection models?**
A: Our Claude 3 Sonnet integration achieves 94.2% accuracy for bias detection, while our BERT models achieve 91.8% accuracy for toxicity detection. PII detection reaches 96.5% accuracy with our hybrid approach.

**Q: What's the performance impact on my AI applications?**
A: EthicGuard adds minimal latency (typically 10-50ms) to AI requests. Our edge infrastructure and intelligent caching ensure fast processing without impacting user experience.

**Q: Can I use EthicGuard with multiple AI providers?**
A: Yes! EthicGuard works with OpenAI, Anthropic, Google, Hugging Face, and any custom AI models. We provide pre-built integrations and universal API wrappers.

**Q: How does the blockchain audit trail work?**
A: Every compliance decision is recorded as an NFT on Algorand or Solana blockchains. This creates an immutable audit trail that regulatory authorities can verify independently.

**Q: Is my data secure with EthicGuard?**
A: Absolutely. We use content hashing (SHA-256) so your actual prompts and responses never leave your infrastructure. All data transmission uses HTTPS/TLS 1.3 encryption.

**Q: Can I customize the governance rules?**
A: Yes, you can create custom rules, modify existing ones, and set custom thresholds. Our visual rule builder makes it easy, or you can use JSON configuration for advanced scenarios.`,
      },
      {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        content: `**Common Issues and Solutions:**

**SDK Installation Issues:**
- Ensure you're using Node.js 16+ or Python 3.8+
- Clear npm cache: \`npm cache clean --force\`
- Try using yarn if npm fails: \`yarn add @ethicguard/ai-firewall\`

**Authentication Errors:**
- Verify your API key is correct and active in the dashboard
- Check that your key has the required permissions for your use case
- Ensure you're using the correct environment (development vs production)

**High Latency Issues:**
- Check your network connection to our edge infrastructure
- Verify you're using the nearest EthicGuard region
- Consider implementing request caching for repeated content
- Review your rule complexity and optimize if necessary

**Rule Configuration Problems:**
- Validate your rule syntax using our online validator
- Test rules in development before deploying to production
- Check rule precedence and resolve conflicts
- Monitor rule effectiveness in the dashboard

**Blockchain Verification Issues:**
- Ensure blockchain networks are operational (check status page)
- Verify your organization has blockchain recording enabled
- Check that sufficient credits are available for blockchain transactions
- Contact support for blockchain explorer integration issues`,
      },
      {
        id: 'support-contact',
        title: 'Contact Support',
        content: `Need additional help? Our support team is here to assist you with implementation, troubleshooting, and optimization.

**Support Channels:**
- **Email**: support@ethicguard.com (24-48 hour response)
- **Live Chat**: Available in your dashboard during business hours
- **Documentation**: Comprehensive guides and API reference
- **Community Forum**: Connect with other developers and share solutions

**Enterprise Support:**
- **Dedicated Support Engineer**: Assigned technical contact
- **24/7 Availability**: Critical issue response within 4 hours
- **Custom SLA Agreements**: Tailored to your business needs
- **On-site Training**: Implementation and best practices training
- **Custom Integration Support**: Help with complex integrations

**Developer Resources:**
- **GitHub Repository**: Source code, examples, and issue tracking
- **API Reference**: Complete documentation with interactive examples
- **SDK Examples**: Sample applications and integration patterns
- **Video Tutorials**: Step-by-step implementation guides

**Response Times:**
- **Free Tier**: 48 hours for general inquiries
- **Pro Tier**: 24 hours for technical support
- **Enterprise**: 4 hours for critical issues, 24 hours for standard

**Before Contacting Support:**
- Check our status page for known issues
- Review the troubleshooting guide above
- Gather relevant error messages and logs
- Include your SDK version and environment details`,
      }
    ]
  }
];

export function Documentation() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState<string[]>(['getting-started']);
  const [selectedItem, setSelectedItem] = useState<string>('quick-start');
  const [copiedCode, setCopiedCode] = useState<string>('');

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const filteredSections = documentationSections.map(section => ({
    ...section,
    items: section.items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  const selectedItemData = documentationSections
    .flatMap(section => section.items)
    .find(item => item.id === selectedItem);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="ml-3 text-xl font-bold text-gray-900">EthicGuard</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
              <Link to="/auth" className="text-gray-600 hover:text-gray-900">Sign In</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-8">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Documentation</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search docs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <nav className="space-y-2">
                {filteredSections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <div className="flex items-center">
                        <section.icon className="h-4 w-4 mr-3" />
                        <span className="font-medium">{section.title}</span>
                      </div>
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections.includes(section.id) && (
                      <div className="ml-7 mt-1 space-y-1">
                        {section.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedItem(item.id)}
                            className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                              selectedItem === item.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {selectedItemData ? (
              <Card className="prose max-w-none">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  {selectedItemData.title}
                </h1>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line mb-8">
                  {selectedItemData.content}
                </div>
                {selectedItemData.codeExample && (
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <button
                      onClick={() => copyCode(selectedItemData.codeExample!)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCode === selectedItemData.codeExample ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{selectedItemData.codeExample}</code>
                    </pre>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="text-center py-12">
                <p className="text-gray-500">Select a topic from the sidebar to get started.</p>
              </Card>
            )}

            {/* Quick Links */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Detection Models</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Learn about our Claude 3 Sonnet and BERT integrations for industry-leading accuracy.
                </p>
                <Button variant="outline" icon={ExternalLink} onClick={() => setSelectedItem('claude-integration')}>
                  Explore AI Models
                </Button>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Code className="h-8 w-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">SDK Integration</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Get started with our Node.js SDK and pre-built AI provider integrations.
                </p>
                <Button variant="outline" icon={ExternalLink} onClick={() => setSelectedItem('nodejs-sdk')}>
                  View SDK Docs
                </Button>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Database className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Blockchain Audit Trail</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Understand how we create immutable compliance records on Algorand and Solana.
                </p>
                <Button variant="outline" icon={ExternalLink} onClick={() => setSelectedItem('immutable-records')}>
                  Learn About Blockchain
                </Button>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <HelpCircle className="h-8 w-8 text-orange-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Button variant="outline" icon={ExternalLink} onClick={() => setSelectedItem('support-contact')}>
                  Contact Support
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}