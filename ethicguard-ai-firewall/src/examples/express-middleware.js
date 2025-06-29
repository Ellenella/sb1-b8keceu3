/**
 * Express.js middleware integration example
 */

const express = require('express');
const { EthicGuardFirewall } = require('../dist/index.js');

const app = express();
app.use(express.json());

// Initialize EthicGuard Firewall
const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY || 'demo-key',
  environment: 'development'
});

// Use middleware for automatic protection
app.use('/api/ai', firewall.middleware());

// Example: Protected AI chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    console.log('💬 Processing chat request for user:', userId);

    // The middleware already checked the prompt
    // req.ethicguard contains the shield result
    
    if (req.ethicguard?.blocked) {
      console.log('❌ Request blocked by middleware:', req.ethicguard.reason);
      return res.status(400).json({
        error: 'Content blocked',
        reason: req.ethicguard.reason,
        severity: req.ethicguard.severity,
        suggestedResponse: req.ethicguard.suggestedResponse
      });
    }

    // Simulate AI response (replace with your AI provider)
    const aiResponse = await generateAIResponse(message);

    console.log('📝 Logging response for compliance...');

    // Log the response for compliance monitoring
    await firewall.logResponse({
      prompt: message,
      response: aiResponse,
      userId: userId,
      applicationId: 'chat-app'
    });

    res.json({
      response: aiResponse,
      requestId: req.ethicguard?.requestId,
      riskScores: req.ethicguard?.riskScores
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example: Manual protection for specific endpoints
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, userId } = req.body;

    console.log('🛡️  Manual shield check for generation request...');

    // Manual shield check
    const shieldResult = await firewall.shield({
      prompt,
      userId,
      applicationId: 'content-generator'
    });

    if (shieldResult.blocked) {
      console.log('❌ Content blocked:', shieldResult.reason);
      return res.status(400).json({
        error: 'Content blocked',
        reason: shieldResult.reason,
        severity: shieldResult.severity,
        suggestedResponse: shieldResult.suggestedResponse
      });
    }

    console.log('✅ Content approved, generating...');

    // Generate AI content
    const generatedContent = await generateContent(prompt);

    console.log('📝 Logging for monitoring...');

    // Log for monitoring
    await firewall.logResponse({
      prompt,
      response: generatedContent,
      userId,
      applicationId: 'content-generator'
    });

    res.json({
      content: generatedContent,
      complianceScore: shieldResult.riskScores
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example: Bias detection endpoint
app.post('/api/analyze/bias', async (req, res) => {
  try {
    const { content } = req.body;

    console.log('⚖️  Analyzing content for bias...');

    const biasResult = await firewall.detectBias(content, {
      types: ['gender', 'racial', 'age']
    });

    console.log('📊 Bias analysis completed');

    res.json(biasResult);
  } catch (error) {
    console.error('Bias detection error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Example: Compliance reporting endpoint
app.get('/api/reports/compliance', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    console.log('📊 Generating compliance report...');

    const report = await firewall.getComplianceReport(
      startDate,
      endDate,
      'chat-app'
    );

    console.log('✅ Compliance report generated');

    res.json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Report generation failed' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    console.log('🏥 Performing health check...');
    
    const health = await firewall.healthCheck();
    
    console.log('✅ Health check completed:', health.status);
    
    res.json(health);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Mock AI functions (replace with your actual AI providers)
async function generateAIResponse(message) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Replace with OpenAI, Anthropic, or your AI provider
  return `AI response to: ${message}`;
}

async function generateContent(prompt) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Replace with your content generation logic
  return `Generated content based on: ${prompt}`;
}

// Start server
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('🚀 Express server with EthicGuard protection started');
    console.log(`📡 Server running on port ${PORT}`);
    console.log('🛡️  EthicGuard AI Firewall protection enabled');
    console.log('\n📋 Available endpoints:');
    console.log('  POST /api/ai/chat - Protected chat endpoint');
    console.log('  POST /api/ai/generate - Manual protection example');
    console.log('  POST /api/analyze/bias - Bias detection');
    console.log('  GET  /api/reports/compliance - Compliance reports');
    console.log('  GET  /health - Health check');
  });
}

module.exports = app;