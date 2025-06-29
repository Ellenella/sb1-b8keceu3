# 📦 How to Publish and Use the EthicGuard AI Firewall NPM Package

This guide explains how to publish the EthicGuard AI Firewall SDK to NPM and how users can install and use it.

## 🚀 Publishing to NPM

### Prerequisites

1. **NPM Account**: Create an account at [npmjs.com](https://www.npmjs.com)
2. **NPM CLI**: Install npm (comes with Node.js)
3. **Organization**: Create an NPM organization named `ethicguard` (optional but recommended)

### Step 1: Prepare the Package

```bash
# Navigate to the SDK directory
cd ethicguard-ai-firewall

# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Run tests to ensure everything works
npm test

# Lint the code
npm run lint
```

### Step 2: Login to NPM

```bash
# Login to your NPM account
npm login

# Verify you're logged in
npm whoami
```

### Step 3: Publish the Package

```bash
# First time publishing
npm publish

# For subsequent versions, update version first
npm version patch  # or minor/major
npm publish
```

### Step 4: Verify Publication

```bash
# Check if package is published
npm view @ethicguard/ai-firewall

# Visit the NPM page
# https://www.npmjs.com/package/@ethicguard/ai-firewall
```

## 📥 Installing and Using the Package

### Installation

Users can install the package using any Node.js package manager:

```bash
# Using npm
npm install @ethicguard/ai-firewall

# Using yarn
yarn add @ethicguard/ai-firewall

# Using pnpm
pnpm add @ethicguard/ai-firewall
```

### Basic Usage

```javascript
const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

// Initialize the firewall
const firewall = new EthicGuardFirewall({
  apiKey: 'your-api-key-here',
  environment: 'production'
});

// Use the firewall to protect AI content
async function protectAI() {
  const result = await firewall.shield({
    prompt: 'User input to analyze',
    userId: 'user-123'
  });

  if (result.blocked) {
    console.log('Content blocked:', result.reason);
    return result.suggestedResponse;
  }

  console.log('Content approved with risk scores:', result.riskScores);
  return 'Content is safe to process';
}

protectAI().catch(console.error);
```

### TypeScript Usage

```typescript
import { EthicGuardFirewall, ShieldResponse } from '@ethicguard/ai-firewall';

const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY!,
  environment: 'production'
});

async function analyzeContent(prompt: string): Promise<ShieldResponse> {
  return await firewall.shield({
    prompt,
    userId: 'user-123',
    applicationId: 'my-app'
  });
}
```

### Express.js Integration

```javascript
const express = require('express');
const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

const app = express();
const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY
});

// Use middleware for automatic protection
app.use('/api/ai', firewall.middleware());

app.post('/api/ai/chat', async (req, res) => {
  // Middleware already checked the content
  if (req.ethicguard?.blocked) {
    return res.status(400).json({
      error: 'Content blocked',
      reason: req.ethicguard.reason
    });
  }

  // Process the AI request safely
  const response = await processAIRequest(req.body.prompt);
  res.json({ response });
});

app.listen(3000, () => {
  console.log('Server running with EthicGuard protection');
});
```

## 🔧 Package Management

### Version Updates

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major

# Publish the new version
npm publish
```

### Package Information

```bash
# View package info
npm view @ethicguard/ai-firewall

# View all versions
npm view @ethicguard/ai-firewall versions --json

# View download statistics
npm view @ethicguard/ai-firewall --json
```

### Unpublishing (Use with Caution)

```bash
# Unpublish a specific version (only within 72 hours)
npm unpublish @ethicguard/ai-firewall@1.0.0

# Unpublish entire package (only within 72 hours)
npm unpublish @ethicguard/ai-firewall --force
```

## 📊 Package Statistics

After publishing, you can track:

- **Download counts**: Via NPM website or `npm view`
- **GitHub stars**: If linked to GitHub repository
- **Issues and feedback**: Through GitHub issues
- **Usage analytics**: Via NPM insights

## 🔐 Security Best Practices

1. **Use 2FA**: Enable two-factor authentication on your NPM account
2. **Scoped packages**: Use `@ethicguard/` scope for organization
3. **Version pinning**: Users should pin to specific versions in production
4. **Security audits**: Run `npm audit` regularly
5. **Access tokens**: Use automation tokens for CI/CD

## 📝 Documentation

The package includes:

- **README.md**: Comprehensive usage guide
- **TypeScript definitions**: Full type support
- **Examples**: Integration examples for popular frameworks
- **API documentation**: Complete method reference

## 🆘 Support

For users of the package:

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides and examples
- **Email Support**: support@ethicguard.com
- **Community**: Discord/Slack channels (if available)

## 🎯 Next Steps

1. **Publish the package** following the steps above
2. **Create GitHub repository** for source code and issues
3. **Set up CI/CD** for automated testing and publishing
4. **Monitor usage** and gather user feedback
5. **Iterate and improve** based on community needs

---

This package provides a complete SDK for AI governance and compliance, making it easy for developers to integrate ethical AI practices into their applications.