import { supabase } from '../lib/supabase';
import { blockchainService } from './blockchainService';

export interface DetectionResult {
  blocked: boolean;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskScores: {
    toxicity: number;
    bias: number;
    hallucination: number;
    pii: number;
  };
  detectedIssues: string[];
  suggestedResponse?: string;
}

export interface BiasAnalysis {
  hasBias: boolean;
  biasTypes: string[];
  confidence: number;
  explanation: string;
}

export interface ToxicityAnalysis {
  isToxic: boolean;
  toxicityScore: number;
  categories: string[];
  explanation: string;
}

class AIDetectionService {
  private static instance: AIDetectionService;
  
  // Claude API configuration
  private claudeApiKey: string;
  private claudeBaseUrl = 'https://api.anthropic.com/v1';
  
  // BERT model configuration (via Hugging Face or custom endpoint)
  private bertApiKey: string;
  private bertBaseUrl = 'https://api-inference.huggingface.co/models';

  static getInstance(): AIDetectionService {
    if (!AIDetectionService.instance) {
      AIDetectionService.instance = new AIDetectionService();
    }
    return AIDetectionService.instance;
  }

  constructor() {
    this.claudeApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
    this.bertApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
  }

  /**
   * Main detection function that combines multiple AI models
   */
  async detectContent(prompt: string, response?: string): Promise<DetectionResult> {
    try {
      const [
        biasAnalysis,
        toxicityAnalysis,
        hallucinationCheck,
        piiDetection
      ] = await Promise.all([
        this.detectBiasWithClaude(prompt, response),
        this.detectToxicityWithBERT(prompt, response),
        this.detectHallucinationWithClaude(prompt, response),
        this.detectPIIWithBERT(prompt, response)
      ]);

      // Calculate overall risk scores
      const riskScores = {
        toxicity: toxicityAnalysis.toxicityScore,
        bias: biasAnalysis.confidence,
        hallucination: hallucinationCheck.confidence,
        pii: piiDetection.confidence
      };

      // Determine if content should be blocked
      const maxRisk = Math.max(...Object.values(riskScores));
      const blocked = maxRisk > 70; // Block if any risk > 70%

      // Collect detected issues
      const detectedIssues: string[] = [];
      if (biasAnalysis.hasBias) detectedIssues.push(`Bias: ${biasAnalysis.biasTypes.join(', ')}`);
      if (toxicityAnalysis.isToxic) detectedIssues.push(`Toxicity: ${toxicityAnalysis.categories.join(', ')}`);
      if (hallucinationCheck.detected) detectedIssues.push('Potential hallucination detected');
      if (piiDetection.detected) detectedIssues.push('PII exposure risk');

      // Determine severity
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (maxRisk > 90) severity = 'critical';
      else if (maxRisk > 75) severity = 'high';
      else if (maxRisk > 50) severity = 'medium';

      // Create blockchain record for significant detections
      if (blocked || severity === 'high' || severity === 'critical') {
        this.createBlockchainRecord(prompt, response, detectedIssues, severity, riskScores);
      }

      return {
        blocked,
        confidence: maxRisk,
        severity,
        riskScores,
        detectedIssues,
        suggestedResponse: blocked ? await this.generateSafeResponse(prompt) : undefined
      };

    } catch (error) {
      console.error('AI Detection Service error:', error);
      
      // Fail-safe: return conservative result
      return {
        blocked: false,
        confidence: 0,
        severity: 'low',
        riskScores: { toxicity: 0, bias: 0, hallucination: 0, pii: 0 },
        detectedIssues: ['Detection service unavailable']
      };
    }
  }

  /**
   * Create blockchain record for significant AI governance decisions
   */
  private async createBlockchainRecord(
    prompt: string, 
    response: string | undefined, 
    detectedIssues: string[], 
    severity: 'low' | 'medium' | 'high' | 'critical',
    riskScores: {
      toxicity: number;
      bias: number;
      hallucination: number;
      pii: number;
    }
  ): Promise<void> {
    try {
      // Get user ID if available
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      // Create a record on the blockchain
      await blockchainService.addRecord({
        type: 'ai_governance',
        event: 'AI Governance Decision',
        description: `AI content ${severity} risk detected: ${detectedIssues.join(', ')}`,
        blockchain: 'Algorand',
        timestamp: new Date().toISOString(),
        sourceModule: 'AI Governance',
        severity,
        metadata: {
          userId,
          complianceScore: 100 - Math.max(...Object.values(riskScores)),
          riskScores
        }
      });
    } catch (error) {
      console.error('Failed to create blockchain record for AI detection:', error);
      // Continue without blockchain record - non-critical failure
    }
  }

  /**
   * Use Claude for sophisticated bias detection
   */
  private async detectBiasWithClaude(prompt: string, response?: string): Promise<BiasAnalysis> {
    if (!this.claudeApiKey) {
      return { hasBias: false, biasTypes: [], confidence: 0, explanation: 'Claude API not configured' };
    }

    try {
      const analysisPrompt = `
Analyze the following text for bias. Look for:
- Gender bias
- Racial bias  
- Age bias
- Religious bias
- Socioeconomic bias
- Cultural bias

Text to analyze:
"${prompt}"
${response ? `\nResponse: "${response}"` : ''}

Respond with a JSON object containing:
{
  "hasBias": boolean,
  "biasTypes": ["type1", "type2"],
  "confidence": number (0-100),
  "explanation": "detailed explanation"
}
`;

      const claudeResponse = await fetch(`${this.claudeBaseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: analysisPrompt
          }]
        })
      });

      if (!claudeResponse.ok) {
        throw new Error(`Claude API error: ${claudeResponse.status}`);
      }

      const data = await claudeResponse.json();
      const analysisText = data.content[0].text;
      
      // Parse JSON response from Claude
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          hasBias: analysis.hasBias,
          biasTypes: analysis.biasTypes || [],
          confidence: analysis.confidence || 0,
          explanation: analysis.explanation || ''
        };
      }

      return { hasBias: false, biasTypes: [], confidence: 0, explanation: 'Failed to parse Claude response' };

    } catch (error) {
      console.error('Claude bias detection error:', error);
      return { hasBias: false, biasTypes: [], confidence: 0, explanation: 'Claude detection failed' };
    }
  }

  /**
   * Use BERT for toxicity detection via Hugging Face
   */
  private async detectToxicityWithBERT(prompt: string, response?: string): Promise<ToxicityAnalysis> {
    if (!this.bertApiKey) {
      return { isToxic: false, toxicityScore: 0, categories: [], explanation: 'BERT API not configured' };
    }

    try {
      const textToAnalyze = response ? `${prompt} ${response}` : prompt;
      
      // Use Hugging Face's toxicity classification model
      const bertResponse = await fetch(`${this.bertBaseUrl}/unitary/toxic-bert`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.bertApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: textToAnalyze
        })
      });

      if (!bertResponse.ok) {
        throw new Error(`BERT API error: ${bertResponse.status}`);
      }

      const data = await bertResponse.json();
      
      // Process BERT response
      const toxicityScore = data[0]?.find((item: any) => item.label === 'TOXIC')?.score * 100 || 0;
      const isToxic = toxicityScore > 50;
      
      // Additional category detection
      const categories: string[] = [];
      if (toxicityScore > 70) categories.push('High toxicity');
      if (toxicityScore > 50) categories.push('Moderate toxicity');
      if (textToAnalyze.toLowerCase().includes('hate')) categories.push('Hate speech');
      if (textToAnalyze.toLowerCase().includes('threat')) categories.push('Threatening language');

      return {
        isToxic,
        toxicityScore: Math.round(toxicityScore),
        categories,
        explanation: `BERT toxicity score: ${Math.round(toxicityScore)}%`
      };

    } catch (error) {
      console.error('BERT toxicity detection error:', error);
      return { isToxic: false, toxicityScore: 0, categories: [], explanation: 'BERT detection failed' };
    }
  }

  /**
   * Use Claude for hallucination detection
   */
  private async detectHallucinationWithClaude(prompt: string, response?: string): Promise<{detected: boolean, confidence: number, explanation: string}> {
    if (!this.claudeApiKey || !response) {
      return { detected: false, confidence: 0, explanation: 'No response to analyze or Claude not configured' };
    }

    try {
      const hallucinationPrompt = `
Analyze if this AI response contains hallucinations (false or fabricated information):

Original prompt: "${prompt}"
AI response: "${response}"

Look for:
- Factual inaccuracies
- Made-up statistics or data
- False claims about people, places, or events
- Inconsistent information
- Overly confident statements about uncertain topics

Respond with JSON:
{
  "detected": boolean,
  "confidence": number (0-100),
  "explanation": "detailed explanation"
}
`;

      const claudeResponse = await fetch(`${this.claudeBaseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: hallucinationPrompt
          }]
        })
      });

      const data = await claudeResponse.json();
      const analysisText = data.content[0].text;
      
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          detected: analysis.detected,
          confidence: analysis.confidence || 0,
          explanation: analysis.explanation || ''
        };
      }

      return { detected: false, confidence: 0, explanation: 'Failed to parse hallucination analysis' };

    } catch (error) {
      console.error('Claude hallucination detection error:', error);
      return { detected: false, confidence: 0, explanation: 'Hallucination detection failed' };
    }
  }

  /**
   * Use BERT for PII detection
   */
  private async detectPIIWithBERT(prompt: string, response?: string): Promise<{detected: boolean, confidence: number, types: string[]}> {
    try {
      const textToAnalyze = response ? `${prompt} ${response}` : prompt;
      
      // Simple regex-based PII detection (can be enhanced with BERT NER models)
      const piiPatterns = {
        email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
        ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
        creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
        address: /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi
      };

      const detectedTypes: string[] = [];
      let totalMatches = 0;

      for (const [type, pattern] of Object.entries(piiPatterns)) {
        const matches = textToAnalyze.match(pattern);
        if (matches && matches.length > 0) {
          detectedTypes.push(type);
          totalMatches += matches.length;
        }
      }

      const detected = detectedTypes.length > 0;
      const confidence = detected ? Math.min(100, totalMatches * 30) : 0;

      return { detected, confidence, types: detectedTypes };

    } catch (error) {
      console.error('PII detection error:', error);
      return { detected: false, confidence: 0, types: [] };
    }
  }

  /**
   * Generate safe alternative response using Claude
   */
  private async generateSafeResponse(originalPrompt: string): Promise<string> {
    if (!this.claudeApiKey) {
      return "I can't help with that request. Please try asking something else.";
    }

    try {
      const safeResponsePrompt = `
The user asked: "${originalPrompt}"

This request was flagged for potential issues. Generate a polite, helpful response that:
1. Acknowledges their request
2. Explains you can't fulfill it as stated
3. Offers an alternative or suggests a different approach
4. Remains professional and supportive

Keep it concise and friendly.
`;

      const claudeResponse = await fetch(`${this.claudeBaseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.claudeApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 200,
          messages: [{
            role: 'user',
            content: safeResponsePrompt
          }]
        })
      });

      const data = await claudeResponse.json();
      return data.content[0].text || "I can't help with that request. Please try asking something else.";

    } catch (error) {
      console.error('Safe response generation error:', error);
      return "I can't help with that request. Please try asking something else.";
    }
  }
}

export const aiDetectionService = AIDetectionService.getInstance();