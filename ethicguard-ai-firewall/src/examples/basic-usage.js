/**
 * Basic usage examples for EthicGuard AI Firewall
 */

const { EthicGuardFirewall } = require('../dist/index.js');

// Initialize the firewall
const firewall = new EthicGuardFirewall({
  apiKey: process.env.ETHICGUARD_API_KEY,
  environment: 'production'
});

async function basicExample() {
  try {
    // Example 1: Shield a user prompt
    console.log('🛡️  Example 1: Shielding user input');
    
    const userInput = "Can you help me write a professional email?";
    
    const shieldResult = await firewall.shield({
      prompt: userInput,
      userId: 'user-123',
      applicationId: 'demo-app'
    });
    
    if (shieldResult.blocked) {
      console.log('❌ Content blocked:', shieldResult.reason);
      console.log('💡 Suggested response:', shieldResult.suggestedResponse);
    } else {
      console.log('✅ Content approved');
      console.log('📊 Risk scores:', shieldResult.riskScores);
      
      // Simulate AI response
      const aiResponse = "I'd be happy to help you write a professional email. What's the purpose of the email?";
      
      // Log the interaction
      await firewall.logResponse({
        prompt: userInput,
        response: aiResponse,
        userId: 'user-123',
        applicationId: 'demo-app'
      });
      
      console.log('📝 Interaction logged for compliance');
    }
    
  } catch (error) {
    console.error('Error in basic example:', error);
  }
}

async function biasDetectionExample() {
  try {
    console.log('\n⚖️  Example 2: Bias detection');
    
    const content = "This job is perfect for a young man with strong technical skills.";
    
    const biasResult = await firewall.detectBias(content, {
      types: ['gender', 'age']
    });
    
    if (biasResult.detected) {
      console.log('⚠️  Bias detected:', biasResult.biasTypes);
      console.log('🎯 Confidence:', biasResult.confidence + '%');
      console.log('💡 Suggestions:', biasResult.suggestions);
    } else {
      console.log('✅ No bias detected');
    }
    
  } catch (error) {
    console.error('Error in bias detection example:', error);
  }
}

async function toxicityCheckExample() {
  try {
    console.log('\n🔍 Example 3: Toxicity check');
    
    const content = "This is a helpful and respectful message.";
    
    const toxicityResult = await firewall.checkToxicity(content);
    
    if (toxicityResult.toxic) {
      console.log('⚠️  Toxic content detected');
      console.log('📊 Toxicity score:', toxicityResult.score + '%');
      console.log('🏷️  Categories:', toxicityResult.categories);
    } else {
      console.log('✅ Content is safe');
      console.log('📊 Toxicity score:', toxicityResult.score + '%');
    }
    
  } catch (error) {
    console.error('Error in toxicity check example:', error);
  }
}

async function healthCheckExample() {
  try {
    console.log('\n🏥 Example 4: Health check');
    
    const health = await firewall.healthCheck();
    
    console.log('🔋 Status:', health.status);
    console.log('⚡ Latency:', health.latency + 'ms');
    console.log('🔧 Version:', health.version);
    console.log('🌐 Services:', health.services);
    
  } catch (error) {
    console.error('Error in health check example:', error);
  }
}

// Run all examples
async function runExamples() {
  console.log('🚀 EthicGuard AI Firewall - Basic Usage Examples\n');
  
  await basicExample();
  await biasDetectionExample();
  await toxicityCheckExample();
  await healthCheckExample();
  
  console.log('\n✨ All examples completed!');
}

// Run examples if this file is executed directly
if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  basicExample,
  biasDetectionExample,
  toxicityCheckExample,
  healthCheckExample
};