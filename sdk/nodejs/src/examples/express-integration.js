const express = require('express');
const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

const app = express();
app.use(express.json());

// Initialize EthicGuard Firewall
const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY,
  environment: 'production'
});

// Use middleware for automatic protection
app.use('/api/ai', firewall.middleware());

// Example: Protected AI chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;

    // The middleware already checked the prompt
    // req.ethicguard contains the shield result
    
    // Simulate AI response (replace with your AI provider)
    const aiResponse = await generateAIResponse(message);

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

    // Manual shield check
    const shieldResult = await firewall.shield({
      prompt,
      userId,
      applicationId: 'content-generator'
    });

    if (shieldResult.blocked) {
      return res.status(400).json({
        error: 'Content blocked',
        reason: shieldResult.reason,
        severity: shieldResult.severity,
        suggestedResponse: shieldResult.suggestedResponse
      });
    }

    // Generate AI content
    const generatedContent = await generateContent(prompt);

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

    const biasResult = await firewall.detectBias(content, {
      types: ['gender', 'racial', 'age']
    });

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

    const report = await firewall.getComplianceReport(
      startDate,
      endDate,
      'chat-app'
    );

    res.json(report);
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Report generation failed' });
  }
});

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const health = await firewall.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Mock AI functions (replace with your actual AI providers)
async function generateAIResponse(message) {
  // Replace with OpenAI, Anthropic, or your AI provider
  return `AI response to: ${message}`;
}

async function generateContent(prompt) {
  // Replace with your content generation logic
  return `Generated content based on: ${prompt}`;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('EthicGuard AI Firewall protection enabled');
});