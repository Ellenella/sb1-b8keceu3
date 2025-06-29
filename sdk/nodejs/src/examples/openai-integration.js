const OpenAI = require('openai');
const { EthicGuardFirewall } = require('@ethicguard/ai-firewall');

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY,
  environment: 'production'
});

class ProtectedOpenAI {
  constructor() {
    this.openai = openai;
    this.firewall = firewall;
  }

  async chat(messages, options = {}) {
    try {
      // Extract the latest user message for shielding
      const userMessage = messages[messages.length - 1];
      if (userMessage.role !== 'user') {
        throw new Error('Last message must be from user');
      }

      // Shield the user input
      const shieldResult = await this.firewall.shield({
        prompt: userMessage.content,
        userId: options.userId,
        sessionId: options.sessionId,
        applicationId: 'openai-chat'
      });

      if (shieldResult.blocked) {
        return {
          blocked: true,
          reason: shieldResult.reason,
          severity: shieldResult.severity,
          suggestedResponse: shieldResult.suggestedResponse || 
            "I can't help with that request. Please try asking something else.",
          requestId: shieldResult.requestId
        };
      }

      // Proceed with OpenAI call
      const completion = await this.openai.chat.completions.create({
        model: options.model || 'gpt-4',
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
        ...options.openaiOptions
      });

      const response = completion.choices[0].message.content;

      // Log the interaction for compliance
      await this.firewall.logResponse({
        prompt: userMessage.content,
        response: response,
        userId: options.userId,
        sessionId: options.sessionId,
        applicationId: 'openai-chat',
        metadata: {
          model: options.model || 'gpt-4',
          tokens: completion.usage?.total_tokens,
          requestId: shieldResult.requestId
        }
      });

      return {
        blocked: false,
        response: response,
        usage: completion.usage,
        requestId: shieldResult.requestId,
        riskScores: shieldResult.riskScores
      };

    } catch (error) {
      console.error('Protected OpenAI chat error:', error);
      throw error;
    }
  }

  async completion(prompt, options = {}) {
    try {
      // Shield the prompt
      const shieldResult = await this.firewall.shield({
        prompt,
        userId: options.userId,
        sessionId: options.sessionId,
        applicationId: 'openai-completion'
      });

      if (shieldResult.blocked) {
        return {
          blocked: true,
          reason: shieldResult.reason,
          severity: shieldResult.severity,
          suggestedResponse: shieldResult.suggestedResponse,
          requestId: shieldResult.requestId
        };
      }

      // Generate completion
      const completion = await this.openai.completions.create({
        model: options.model || 'gpt-3.5-turbo-instruct',
        prompt: prompt,
        max_tokens: options.maxTokens || 500,
        temperature: options.temperature || 0.7,
        ...options.openaiOptions
      });

      const response = completion.choices[0].text;

      // Log for compliance
      await this.firewall.logResponse({
        prompt,
        response,
        userId: options.userId,
        sessionId: options.sessionId,
        applicationId: 'openai-completion',
        metadata: {
          model: options.model || 'gpt-3.5-turbo-instruct',
          tokens: completion.usage?.total_tokens
        }
      });

      return {
        blocked: false,
        response: response,
        usage: completion.usage,
        requestId: shieldResult.requestId,
        riskScores: shieldResult.riskScores
      };

    } catch (error) {
      console.error('Protected OpenAI completion error:', error);
      throw error;
    }
  }

  // Wrapper for image generation with content policy checks
  async generateImage(prompt, options = {}) {
    try {
      // Check prompt for inappropriate content
      const shieldResult = await this.firewall.shield({
        prompt,
        userId: options.userId,
        applicationId: 'openai-image'
      });

      if (shieldResult.blocked) {
        return {
          blocked: true,
          reason: shieldResult.reason,
          severity: shieldResult.severity,
          requestId: shieldResult.requestId
        };
      }

      // Generate image
      const image = await this.openai.images.generate({
        prompt: prompt,
        n: options.n || 1,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        ...options.openaiOptions
      });

      // Log the generation
      await this.firewall.logResponse({
        prompt,
        response: `Generated ${image.data.length} image(s)`,
        userId: options.userId,
        applicationId: 'openai-image',
        metadata: {
          imageCount: image.data.length,
          size: options.size || '1024x1024'
        }
      });

      return {
        blocked: false,
        images: image.data,
        requestId: shieldResult.requestId,
        riskScores: shieldResult.riskScores
      };

    } catch (error) {
      console.error('Protected image generation error:', error);
      throw error;
    }
  }
}

// Usage examples
async function examples() {
  const protectedAI = new ProtectedOpenAI();

  // Example 1: Protected chat
  try {
    const chatResult = await protectedAI.chat([
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Help me write a professional email.' }
    ], {
      userId: 'user-123',
      sessionId: 'session-456'
    });

    if (chatResult.blocked) {
      console.log('Chat blocked:', chatResult.reason);
    } else {
      console.log('Chat response:', chatResult.response);
      console.log('Risk scores:', chatResult.riskScores);
    }
  } catch (error) {
    console.error('Chat example error:', error);
  }

  // Example 2: Protected completion
  try {
    const completionResult = await protectedAI.completion(
      'Write a summary of renewable energy benefits:',
      {
        userId: 'user-123',
        maxTokens: 200
      }
    );

    if (completionResult.blocked) {
      console.log('Completion blocked:', completionResult.reason);
    } else {
      console.log('Completion:', completionResult.response);
    }
  } catch (error) {
    console.error('Completion example error:', error);
  }

  // Example 3: Protected image generation
  try {
    const imageResult = await protectedAI.generateImage(
      'A peaceful landscape with mountains and a lake',
      {
        userId: 'user-123',
        size: '512x512'
      }
    );

    if (imageResult.blocked) {
      console.log('Image generation blocked:', imageResult.reason);
    } else {
      console.log('Generated images:', imageResult.images.length);
    }
  } catch (error) {
    console.error('Image generation example error:', error);
  }
}

module.exports = { ProtectedOpenAI };

// Run examples if this file is executed directly
if (require.main === module) {
  examples();
}