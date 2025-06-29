# EthicGuard AI Firewall - Node.js SDK

[![npm version](https://badge.fury.io/js/%40ethicguard%2Fai-firewall.svg)](https://badge.fury.io/js/%40ethicguard%2Fai-firewall)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Real-time AI governance and compliance for Node.js applications. Protect your AI systems from toxic content, bias, hallucinations, and compliance violations.

## Features

- 🛡️ **AI Firewall**: Block toxic and hallucinated AI outputs using advanced NLP
- ⚖️ **Bias Detection**: Real-time detection of gender, racial, and other biases  
- 📊 **Compliance Reports**: Generate SOC 2/GDPR-ready compliance documentation
- 🔍 **Real-time Monitoring**: Track AI performance and governance metrics
- 🚀 **Easy Integration**: Simple SDK with Express.js middleware support
- 🔐 **Privacy First**: Content hashing ensures data privacy

## Installation

```bash
npm install @ethicguard/ai-firewall
```

## Quick Start

### 1. Get Your API Key

1. Sign up at [EthicGuard Dashboard](https://dashboard.ethicguard.com)
2. Register your bot and get an API key
3. Configure governance rules and thresholds

### 2. Basic Usage

```javascript
const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

const firewall = new EthicGuardFirewall({
  apiKey: 'your-api-key-here',
  environment: 'production'
});

// Shield AI prompts before processing
const result = await firewall.shield({
  prompt: userInput,
  userId: 'user-123',
  sessionId: 'session-456'
});

if (result.blocked) {
  console.log('Request blocked:', result.reason);
  return result.suggestedResponse;
}

// Proceed with your AI call
const aiResponse = await yourAIProvider.generate(userInput);

// Log the response for monitoring
await firewall.logResponse({
  prompt: userInput,
  response: aiResponse,
  userId: 'user-123'
});
```

### 3. Express.js Middleware

```javascript
const express = require('express');
const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

const app = express();
const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY
});

// Automatic protection for all AI endpoints
app.use('/api/ai', firewall.middleware());

app.post('/api/ai/chat', async (req, res) => {
  // Middleware already checked req.body.prompt
  // req.ethicguard contains shield results
  
  const aiResponse = await generateResponse(req.body.prompt);
  
  await firewall.logResponse({
    prompt: req.body.prompt,
    response: aiResponse,
    userId: req.body.userId
  });
  
  res.json({ response: aiResponse });
});
```

## Integration Examples

### OpenAI Integration

```javascript
const OpenAI = require('openai');
const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const firewall = new EthicGuardFirewall({ apiKey: process.env.ETHICGUARD_API_KEY });

async function protectedChat(messages, userId) {
  const userMessage = messages[messages.length - 1].content;
  
  // Shield the input
  const shieldResult = await firewall.shield({
    prompt: userMessage,
    userId,
    applicationId: 'openai-chat'
  });
  
  if (shieldResult.blocked) {
    return {
      blocked: true,
      reason: shieldResult.reason,
      suggestedResponse: shieldResult.suggestedResponse
    };
  }
  
  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: messages
  });
  
  const response = completion.choices[0].message.content;
  
  // Log for compliance
  await firewall.logResponse({
    prompt: userMessage,
    response: response,
    userId,
    applicationId: 'openai-chat'
  });
  
  return {
    blocked: false,
    response: response,
    riskScores: shieldResult.riskScores
  };
}
```

### Anthropic Claude Integration

```javascript
const Anthropic = require('@anthropic-ai/sdk');
const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const firewall = new EthicGuardFirewall({ apiKey: process.env.ETHICGUARD_API_KEY });

async function protectedClaude(prompt, userId) {
  // Shield the prompt
  const shieldResult = await firewall.shield({
    prompt,
    userId,
    applicationId: 'claude-chat'
  });
  
  if (shieldResult.blocked) {
    return { blocked: true, reason: shieldResult.reason };
  }
  
  // Call Claude
  const message = await anthropic.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  });
  
  const response = message.content[0].text;
  
  // Log for monitoring
  await firewall.logResponse({
    prompt,
    response,
    userId,
    applicationId: 'claude-chat'
  });
  
  return { blocked: false, response, riskScores: shieldResult.riskScores };
}
```

## API Reference

### EthicGuardFirewall

#### Constructor

```javascript
new EthicGuardFirewall(config)
```

**Config Options:**
- `apiKey` (string, required): Your EthicGuard API key
- `baseUrl` (string, optional): API base URL (default: https://api.ethicguard.com/v1)
- `environment` (string, optional): 'development' | 'staging' | 'production'
- `timeout` (number, optional): Request timeout in milliseconds (default: 30000)

#### Methods

##### shield(request)

Shield an AI prompt before processing.

```javascript
const result = await firewall.shield({
  prompt: 'User input text',
  userId: 'user-123',
  sessionId: 'session-456',
  applicationId: 'my-app',
  metadata: { custom: 'data' }
});
```

**Returns:** `ShieldResponse`
- `blocked` (boolean): Whether the content was blocked
- `reason` (string): Reason for blocking (if blocked)
- `severity` ('low' | 'medium' | 'high' | 'critical'): Violation severity
- `confidence` (number): Detection confidence (0-100)
- `ruleViolated` (string): Name of the violated rule
- `suggestedResponse` (string): Alternative response suggestion
- `requestId` (string): Unique request identifier
- `riskScores` (object): Risk scores for different categories

##### logResponse(request)

Log AI response for monitoring and compliance.

```javascript
const result = await firewall.logResponse({
  prompt: 'Original prompt',
  response: 'AI response',
  userId: 'user-123',
  sessionId: 'session-456',
  applicationId: 'my-app',
  metadata: { custom: 'data' }
});
```

**Returns:** `LogResponse`
- `logged` (boolean): Whether logging was successful
- `requestId` (string): Unique request identifier
- `complianceScore` (number): Overall compliance score
- `violations` (array): List of detected violations

##### detectBias(content, options)

Detect bias in content.

```javascript
const result = await firewall.detectBias(content, {
  types: ['gender', 'racial', 'age', 'religious']
});
```

##### checkToxicity(content)

Check content toxicity.

```javascript
const result = await firewall.checkToxicity(content);
```

##### getComplianceReport(startDate, endDate, applicationId)

Generate compliance report.

```javascript
const report = await firewall.getComplianceReport(
  '2024-01-01',
  '2024-01-31',
  'my-app'
);
```

##### middleware()

Express.js middleware for automatic protection.

```javascript
app.use('/api/ai', firewall.middleware());
```

##### healthCheck()

Check API health and connectivity.

```javascript
const health = await firewall.healthCheck();
```

## Configuration

### Environment Variables

```bash
# Required
ETHICGUARD_API_KEY=your_api_key_here

# Optional
ETHICGUARD_BASE_URL=https://api.ethicguard.com/v1
ETHICGUARD_ENVIRONMENT=production
ETHICGUARD_TIMEOUT=30000
```

### Governance Rules

Configure rules in the EthicGuard Dashboard:

- **Toxicity Detection**: Block harmful or offensive content
- **Bias Detection**: Detect gender, racial, age, and other biases
- **PII Protection**: Prevent exposure of personal information
- **Profanity Filter**: Block explicit language
- **Medical Advice Filter**: Prevent unauthorized medical advice
- **Financial Advice Filter**: Block unlicensed financial guidance

### Thresholds

Set custom thresholds for each rule:

```javascript
// Example: Block if toxicity > 0.8 (80%)
{
  "rule": "toxicity_detection",
  "threshold": 0.8,
  "action": "block"
}
```

## Error Handling

The SDK includes comprehensive error handling:

```javascript
try {
  const result = await firewall.shield({ prompt: userInput });
  
  if (result.blocked) {
    // Handle blocked content
    return result.suggestedResponse;
  }
  
  // Proceed with AI call
} catch (error) {
  console.error('EthicGuard error:', error);
  // Fail-safe: continue with caution
}
```

## Rate Limits

- **Free Tier**: 1,000 requests/hour
- **Pro Tier**: 10,000 requests/hour  
- **Enterprise**: Custom limits

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Request limit per hour
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (Unix timestamp)

## Privacy & Security

- **Content Hashing**: Prompts are hashed (SHA-256) before transmission
- **No Data Storage**: Original content is not stored on our servers
- **Encryption**: All data transmitted via HTTPS/TLS 1.3
- **Compliance**: SOC 2 Type II, GDPR, CCPA compliant

## Support

- **Documentation**: [https://docs.ethicguard.com](https://docs.ethicguard.com)
- **Dashboard**: [https://dashboard.ethicguard.com](https://dashboard.ethicguard.com)
- **Support**: support@ethicguard.com
- **GitHub**: [https://github.com/ethicguard/ai-firewall-nodejs](https://github.com/ethicguard/ai-firewall-nodejs)

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

**EthicGuard** - Making AI governance simple and accessible for organizations of all sizes.