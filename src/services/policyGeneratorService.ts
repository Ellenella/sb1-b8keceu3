import { supabase } from '../lib/supabase';
import { blockchainService } from './blockchainService';
import CryptoJS from 'crypto-js';

export interface PolicyFormData {
  companyName: string;
  businessType: string;
  contactEmail: string;
  effectiveDate: string;
  complianceRequirements: string[];
  dataCollectionTypes: string[];
  retentionPeriod: string;
  childrenData: boolean;
  processPayments: boolean;
  useCookies: boolean;
  useAnalytics: boolean;
  sendMarketing: boolean;
}

export interface PolicySection {
  id: string;
  title: string;
  content: string;
  required: boolean;
  appliesTo: string[];
}

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  sections: PolicySection[];
}

export interface GeneratedPolicy {
  title: string;
  version: string;
  effectiveDate: string;
  markdown: string;
  html: string;
  json: Record<string, any>;
  complianceScore: number;
  complianceDetails: {
    framework: string;
    score: number;
    missingElements?: string[];
  }[];
}

class PolicyGeneratorService {
  private static instance: PolicyGeneratorService;
  
  static getInstance(): PolicyGeneratorService {
    if (!PolicyGeneratorService.instance) {
      PolicyGeneratorService.instance = new PolicyGeneratorService();
    }
    return PolicyGeneratorService.instance;
  }

  /**
   * Check if the current user has permission to manage policies
   * Modified to allow all users to manage policies for demo purposes
   * Also ensures user profile exists in the profiles table
   */
  private async checkUserPermissions(): Promise<{ hasPermission: boolean; userRole?: string; error?: string }> {
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user.user) {
        return { hasPermission: false, error: 'User not authenticated' };
      }

      // Get user profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.user.id)
        .maybeSingle();

      if (profileError) {
        console.log('Failed to fetch user profile, allowing access for demo purposes');
        return { hasPermission: true, userRole: 'demo_user' };
      }

      if (!profile) {
        // Profile doesn't exist, create one
        console.log('User profile not found, creating default profile');
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.user.id,
            email: user.user.email || 'unknown@example.com',
            full_name: user.user.user_metadata?.full_name || 'Demo User',
            role: 'developer' // Default role
          })
          .select('role')
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          // For demo purposes, still allow access even if profile creation fails
          return { hasPermission: true, userRole: 'demo_user', error: 'Profile creation failed, allowing access for demo' };
        }

        return { 
          hasPermission: true, 
          userRole: newProfile?.role || 'developer'
        };
      }

      // For demo purposes, allow all roles to manage policies
      return { 
        hasPermission: true, 
        userRole: profile.role
      };
    } catch (error) {
      console.error('Error checking user permissions:', error);
      // For demo purposes, allow access if there's an error
      return { hasPermission: true, userRole: 'demo_user', error: 'Error checking permissions, allowing access for demo' };
    }
  }

  /**
   * Generate a privacy policy based on form data
   */
  async generatePrivacyPolicy(formData: PolicyFormData): Promise<GeneratedPolicy> {
    try {
      // Generate policy version based on date
      const version = this.generateVersion();
      
      // Generate policy content
      const markdown = this.generatePrivacyPolicyMarkdown(formData);
      const html = this.markdownToHtml(markdown);
      const json = this.generatePrivacyPolicyJson(formData);
      
      // Calculate compliance score
      const complianceDetails = this.calculateComplianceScore(formData, json);
      const complianceScore = this.calculateOverallScore(complianceDetails);
      
      return {
        title: `${formData.companyName} Privacy Policy`,
        version,
        effectiveDate: formData.effectiveDate,
        markdown,
        html,
        json,
        complianceScore,
        complianceDetails
      };
    } catch (error) {
      console.error('Error generating privacy policy:', error);
      throw error;
    }
  }

  /**
   * Generate terms of service based on form data
   */
  async generateTermsOfService(formData: PolicyFormData): Promise<GeneratedPolicy> {
    try {
      // Generate policy version based on date
      const version = this.generateVersion();
      
      // Generate policy content
      const markdown = this.generateTermsOfServiceMarkdown(formData);
      const html = this.markdownToHtml(markdown);
      const json = this.generateTermsOfServiceJson(formData);
      
      // Calculate compliance score
      const complianceDetails = this.calculateComplianceScore(formData, json);
      const complianceScore = this.calculateOverallScore(complianceDetails);
      
      return {
        title: `${formData.companyName} Terms of Service`,
        version,
        effectiveDate: formData.effectiveDate,
        markdown,
        html,
        json,
        complianceScore,
        complianceDetails
      };
    } catch (error) {
      console.error('Error generating terms of service:', error);
      throw error;
    }
  }

  /**
   * Save a policy to the database
   */
  async savePolicy(
    policyType: 'privacy_policy' | 'terms_of_service',
    policy: GeneratedPolicy,
    formData: PolicyFormData,
    status: 'draft' | 'published' = 'draft'
  ): Promise<{ id: string; success: boolean; error?: string }> {
    try {
      // Check user permissions first - now always returns true for demo and ensures profile exists
      const permissionCheck = await this.checkUserPermissions();
      if (!permissionCheck.hasPermission) {
        return { 
          id: '', 
          success: false, 
          error: permissionCheck.error || 'Insufficient permissions to save policies' 
        };
      }

      // Get current user
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user.user) {
        return { id: '', success: false, error: 'User authentication failed' };
      }

      // Convert retention period to interval
      let retentionPeriod: string | null = null;
      if (formData.retentionPeriod) {
        const years = parseInt(formData.retentionPeriod);
        if (!isNaN(years) && years > 0) {
          retentionPeriod = `${years} years`;
        }
      }

      // Insert policy into database
      const { data, error } = await supabase
        .from('legal_policies')
        .insert({
          policy_type: policyType,
          version: policy.version,
          title: policy.title,
          effective_date: new Date(policy.effectiveDate),
          jurisdictions: formData.complianceRequirements,
          content_markdown: policy.markdown,
          content_json: policy.json,
          status,
          created_by: user.user.id,
          compliance_score: policy.complianceScore,
          data_categories: formData.dataCollectionTypes,
          retention_period: retentionPeriod,
          children_data: formData.childrenData,
          payment_processing: formData.processPayments,
          cookies_used: formData.useCookies,
          analytics_used: formData.useAnalytics,
          marketing_communications: formData.sendMarketing
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving policy:', error);
        return { id: '', success: false, error: error.message };
      }

      // If published, also create a policy version
      if (status === 'published' && data) {
        const { error: versionError } = await supabase
          .from('policy_versions')
          .insert({
            policy_id: data.id,
            version: policy.version,
            content_markdown: policy.markdown,
            content_json: policy.json,
            effective_date: new Date(policy.effectiveDate),
            created_by: user.user.id,
            compliance_score: policy.complianceScore
          });

        if (versionError) {
          console.error('Error saving policy version:', versionError);
          return { id: data.id, success: true, error: 'Policy saved but version history failed' };
        }
        
        // If published, automatically mint as NFT
        if (status === 'published') {
          try {
            await this.mintPolicyNFT(data.id, policyType);
          } catch (mintError) {
            console.error('Error auto-minting policy NFT:', mintError);
            return { id: data.id, success: true, error: 'Policy saved but NFT minting failed' };
          }
        }
      }

      return { id: data?.id || '', success: true };
    } catch (error) {
      console.error('Error in savePolicy:', error);
      return { id: '', success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Mint a policy as an NFT on Algorand
   */
  async mintPolicyNFT(
    policyId: string,
    policyType: 'privacy_policy' | 'terms_of_service'
  ): Promise<{ success: boolean; record?: any; error?: string }> {
    try {
      // Check user permissions first - now always returns true for demo
      const permissionCheck = await this.checkUserPermissions();
      if (!permissionCheck.hasPermission) {
        return { 
          success: false, 
          error: permissionCheck.error || 'Insufficient permissions to mint policy NFTs' 
        };
      }

      // Get policy from database
      const { data: policy, error } = await supabase
        .from('legal_policies')
        .select('*')
        .eq('id', policyId)
        .single();

      if (error || !policy) {
        console.error('Error fetching policy:', error);
        return { success: false, error: error?.message || 'Policy not found' };
      }

      // Generate policy hash
      const policyHash = this.hashContent(JSON.stringify({
        content: policy.content_markdown,
        metadata: {
          version: policy.version,
          effectiveDate: policy.effective_date,
          jurisdictions: policy.jurisdictions
        }
      }));

      // Prepare metadata for blockchain
      const metadata = {
        policyVersion: policy.version,
        timestamp: new Date().toISOString(),
        companyIdentifier: policy.title.split(' ')[0], // Extract company name from title
        jurisdiction: policy.jurisdictions.join(', '),
        complianceFrameworks: policy.jurisdictions,
        authorizedSigners: ['Legal Department', 'Data Protection Officer']
      };

      // Mint NFT on Algorand
      const record = await blockchainService.mintPolicyNFT(policy.content_markdown, metadata);

      // Update policy with blockchain information
      const { error: updateError } = await supabase
        .from('legal_policies')
        .update({
          blockchain_hash: policyHash,
          blockchain_tx_id: record.txHash,
          blockchain_asset_id: record.metadata.tokenId,
          ipfs_hash: record.metadata.ipfsHash
        })
        .eq('id', policyId);

      if (updateError) {
        console.error('Error updating policy with blockchain info:', updateError);
        return { success: true, record, error: 'NFT minted but policy update failed' };
      }

      // Also update the latest version
      const { error: versionUpdateError } = await supabase
        .from('policy_versions')
        .update({
          blockchain_hash: policyHash,
          blockchain_tx_id: record.txHash,
          blockchain_asset_id: record.metadata.tokenId,
          ipfs_hash: record.metadata.ipfsHash
        })
        .eq('policy_id', policyId)
        .eq('version', policy.version);

      if (versionUpdateError) {
        console.error('Error updating policy version with blockchain info:', versionUpdateError);
      }

      return { success: true, record };
    } catch (error) {
      console.error('Error minting policy NFT:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get all policies
   */
  async getPolicies(policyType?: 'privacy_policy' | 'terms_of_service'): Promise<any[]> {
    try {
      let query = supabase
        .from('legal_policies')
        .select('*')
        .order('created_at', { ascending: false });

      if (policyType) {
        query = query.eq('policy_type', policyType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching policies:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPolicies:', error);
      return [];
    }
  }

  /**
   * Get a specific policy by ID
   */
  async getPolicyById(policyId: string): Promise<any | null> {
    try {
      const { data, error } = await supabase
        .from('legal_policies')
        .select('*')
        .eq('id', policyId)
        .single();

      if (error) {
        console.error('Error fetching policy:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getPolicyById:', error);
      return null;
    }
  }

  /**
   * Get policy versions
   */
  async getPolicyVersions(policyId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('policy_versions')
        .select('*')
        .eq('policy_id', policyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching policy versions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPolicyVersions:', error);
      return [];
    }
  }

  /**
   * Record user consent to a policy
   */
  async recordConsent(
    policyId: string,
    policyVersion: string,
    ipAddress?: string,
    userAgent?: string,
    consentMethod: 'explicit' | 'implicit' = 'explicit'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from('policy_consents')
        .insert({
          user_id: user.user.id,
          policy_id: policyId,
          policy_version: policyVersion,
          ip_address: ipAddress,
          user_agent: userAgent,
          consent_method: consentMethod
        });

      if (error) {
        console.error('Error recording consent:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in recordConsent:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Verify user consent to a policy
   */
  async verifyConsent(policyId: string): Promise<{ consented: boolean; version?: string; date?: string }> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        return { consented: false };
      }

      const { data, error } = await supabase
        .from('policy_consents')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('policy_id', policyId)
        .order('consented_at', { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return { consented: false };
      }

      return {
        consented: true,
        version: data.policy_version,
        date: new Date(data.consented_at).toISOString()
      };
    } catch (error) {
      console.error('Error in verifyConsent:', error);
      return { consented: false };
    }
  }

  /**
   * Generate a version string based on date
   */
  private generateVersion(): string {
    const now = new Date();
    return `${now.getFullYear()}.${now.getMonth() + 1}.${now.getDate()}`;
  }

  /**
   * Convert markdown to HTML
   */
  private markdownToHtml(markdown: string): string {
    // Simple markdown to HTML conversion
    // In a real implementation, use a proper markdown parser
    return markdown
      .replace(/# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/### (.*?)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '$1<br>')
      .replace(/<br>$/, '');
  }

  /**
   * Generate privacy policy markdown
   */
  private generatePrivacyPolicyMarkdown(formData: PolicyFormData): string {
    const { 
      companyName, 
      contactEmail, 
      effectiveDate, 
      complianceRequirements,
      dataCollectionTypes,
      retentionPeriod,
      childrenData,
      processPayments,
      useCookies,
      useAnalytics,
      sendMarketing
    } = formData;

    // Format date
    const formattedDate = new Date(effectiveDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Build policy sections
    let policy = `# ${companyName} Privacy Policy\n\n`;
    
    // Introduction
    policy += `## 1. Introduction\n\n`;
    policy += `${companyName} ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.\n\n`;
    
    // Add compliance statement
    if (complianceRequirements.length > 0) {
      policy += `This Privacy Policy is designed to comply with the following regulations: ${complianceRequirements.join(', ')}.\n\n`;
    }

    // Information We Collect
    policy += `## 2. Information We Collect\n\n`;
    policy += `We collect the following types of information:\n\n`;

    // Data categories
    if (dataCollectionTypes.includes('Personal Identifiers')) {
      policy += `### 2.1 Personal Identifiers\n`;
      policy += `- Name, email address, phone number, and other similar identifiers\n\n`;
    }

    if (dataCollectionTypes.includes('Contact Information')) {
      policy += `### 2.2 Contact Information\n`;
      policy += `- Address, phone number, email address\n\n`;
    }

    if (dataCollectionTypes.includes('Usage Data')) {
      policy += `### 2.3 Usage Information\n`;
      policy += `- Website analytics, user behavior, interaction with our services\n\n`;
    }

    if (dataCollectionTypes.includes('Device Information')) {
      policy += `### 2.4 Device Information\n`;
      policy += `- Browser type, IP address, device type, operating system\n\n`;
    }

    if (dataCollectionTypes.includes('Location Data')) {
      policy += `### 2.5 Location Data\n`;
      policy += `- GPS coordinates, approximate location based on IP address\n\n`;
    }

    if (dataCollectionTypes.includes('Financial Information') || processPayments) {
      policy += `### 2.6 Financial Information\n`;
      policy += `- Payment details, billing information, transaction history\n\n`;
    }

    if (dataCollectionTypes.includes('Health Information')) {
      policy += `### 2.7 Health Information\n`;
      policy += `- Medical records, health data, fitness information\n\n`;
    }

    if (dataCollectionTypes.includes('Biometric Data')) {
      policy += `### 2.8 Biometric Data\n`;
      policy += `- Fingerprints, facial recognition data, voice patterns\n\n`;
    }

    if (dataCollectionTypes.includes('Commercial Information')) {
      policy += `### 2.9 Commercial Information\n`;
      policy += `- Purchase history, product preferences, customer records\n\n`;
    }

    if (dataCollectionTypes.includes('Internet Activity')) {
      policy += `### 2.10 Internet Activity\n`;
      policy += `- Browsing history, search history, interaction with websites and applications\n\n`;
    }

    // How We Use Your Information
    policy += `## 3. How We Use Your Information\n\n`;
    policy += `We use your information for the following purposes:\n\n`;
    policy += `- Providing and maintaining our services\n`;
    policy += `- Processing transactions\n`;
    policy += `- Sending service notifications\n`;
    policy += `- Improving our services\n`;
    policy += `- Compliance with legal obligations\n\n`;

    if (sendMarketing) {
      policy += `- Sending marketing communications (you can opt out at any time)\n\n`;
    }

    // Data Retention
    policy += `## 4. Data Retention\n\n`;
    if (retentionPeriod) {
      policy += `We retain your information for ${retentionPeriod} years, or as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements.\n\n`;
    } else {
      policy += `We retain your information as long as your account is active or as needed to provide services, comply with legal obligations, resolve disputes, and enforce agreements.\n\n`;
    }

    // Data Security
    policy += `## 5. Data Security\n\n`;
    policy += `We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.\n\n`;

    // Your Rights
    policy += `## 6. Your Rights\n\n`;
    policy += `Depending on your location, you may have rights regarding your personal information, including:\n\n`;
    policy += `- Access to your data\n`;
    policy += `- Correction of inaccurate data\n`;
    policy += `- Deletion of your data\n`;
    policy += `- Restriction of processing\n`;
    policy += `- Data portability\n`;
    policy += `- Objection to processing\n\n`;

    // GDPR-specific content
    if (complianceRequirements.includes('GDPR')) {
      policy += `### 6.1 European Union Residents (GDPR)\n\n`;
      policy += `If you are a resident of the European Union, you have the right to:\n\n`;
      policy += `- Access your personal data\n`;
      policy += `- Rectify inaccurate personal data\n`;
      policy += `- Request erasure of your personal data\n`;
      policy += `- Restrict processing of your personal data\n`;
      policy += `- Data portability\n`;
      policy += `- Object to processing of your personal data\n`;
      policy += `- Lodge a complaint with a supervisory authority\n\n`;
      policy += `To exercise these rights, please contact us at ${contactEmail}.\n\n`;
    }

    // CCPA-specific content
    if (complianceRequirements.includes('CCPA')) {
      policy += `### 6.2 California Residents (CCPA)\n\n`;
      policy += `If you are a California resident, you have the right to:\n\n`;
      policy += `- Know what personal information is being collected about you\n`;
      policy += `- Know whether your personal information is sold or disclosed and to whom\n`;
      policy += `- Say no to the sale of personal information\n`;
      policy += `- Access your personal information\n`;
      policy += `- Request deletion of your personal information\n`;
      policy += `- Equal service and price, even if you exercise your privacy rights\n\n`;
      policy += `To exercise these rights, please contact us at ${contactEmail}.\n\n`;
    }

    // International Transfers
    policy += `## 7. International Transfers\n\n`;
    policy += `Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.\n\n`;

    // Cookies and Tracking
    if (useCookies) {
      policy += `## 8. Cookies and Tracking Technologies\n\n`;
      policy += `We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.\n\n`;
      
      if (useAnalytics) {
        policy += `We use analytics cookies to understand how you interact with our website, which helps us improve our services.\n\n`;
      }
      
      policy += `You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.\n\n`;
    }

    // Children's Privacy
    if (childrenData || complianceRequirements.includes('COPPA')) {
      policy += `## 9. Children's Privacy\n\n`;
      
      if (childrenData) {
        policy += `Our service may collect information from children under 13 with verifiable parental consent. We comply with the Children's Online Privacy Protection Act (COPPA).\n\n`;
        policy += `Parents can review, delete, or refuse further collection of their child's information by contacting us at ${contactEmail}.\n\n`;
      } else {
        policy += `Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.\n\n`;
      }
    }

    // Changes to This Policy
    policy += `## 10. Changes to This Policy\n\n`;
    policy += `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.\n\n`;

    // Contact Us
    policy += `## 11. Contact Us\n\n`;
    policy += `If you have questions about this Privacy Policy, please contact us at:\n\n`;
    policy += `- Email: ${contactEmail}\n`;
    policy += `- Address: [Your Company Address]\n\n`;

    // Last Updated
    policy += `Last Updated: ${formattedDate}\n`;
    policy += `Version: ${this.generateVersion()}\n`;

    return policy;
  }

  /**
   * Generate terms of service markdown
   */
  private generateTermsOfServiceMarkdown(formData: PolicyFormData): string {
    const { 
      companyName, 
      contactEmail, 
      effectiveDate, 
      complianceRequirements,
      processPayments,
      useCookies
    } = formData;

    // Format date
    const formattedDate = new Date(effectiveDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Build terms sections
    let terms = `# ${companyName} Terms of Service\n\n`;
    
    // Introduction
    terms += `## 1. Introduction\n\n`;
    terms += `These Terms of Service ("Terms") govern your use of ${companyName}'s website, products, and services ("Services"). By accessing or using our Services, you agree to be bound by these Terms.\n\n`;
    
    // Add compliance statement
    if (complianceRequirements.length > 0) {
      terms += `These Terms are designed to comply with the following regulations: ${complianceRequirements.join(', ')}.\n\n`;
    }

    // User Accounts
    terms += `## 2. User Accounts\n\n`;
    terms += `When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account and for all activities that occur under your account.\n\n`;

    // Acceptable Use
    terms += `## 3. Acceptable Use\n\n`;
    terms += `You agree not to use our Services:\n\n`;
    terms += `- In any way that violates any applicable law or regulation\n`;
    terms += `- To transmit any material that is defamatory, offensive, or otherwise objectionable\n`;
    terms += `- To attempt to interfere with the proper working of our Services\n`;
    terms += `- To attempt to gain unauthorized access to our systems or user accounts\n\n`;

    // Intellectual Property
    terms += `## 4. Intellectual Property\n\n`;
    terms += `Our Services and their contents, features, and functionality are owned by ${companyName} and are protected by copyright, trademark, and other intellectual property laws.\n\n`;

    // Payment Terms
    if (processPayments) {
      terms += `## 5. Payment Terms\n\n`;
      terms += `If you choose to purchase any of our paid Services:\n\n`;
      terms += `- You agree to provide current, complete, and accurate purchase and account information\n`;
      terms += `- You agree to promptly update your account and payment information\n`;
      terms += `- You agree to pay all charges at the prices in effect when incurred\n`;
      terms += `- You agree to pay any applicable taxes related to your use of the Services\n\n`;
    }

    // Termination
    terms += `## 6. Termination\n\n`;
    terms += `We may terminate or suspend your account and access to our Services immediately, without prior notice or liability, for any reason, including if you breach these Terms.\n\n`;

    // Limitation of Liability
    terms += `## 7. Limitation of Liability\n\n`;
    terms += `To the maximum extent permitted by law, ${companyName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our Services.\n\n`;

    // Disclaimer of Warranties
    terms += `## 8. Disclaimer of Warranties\n\n`;
    terms += `Our Services are provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.\n\n`;

    // Governing Law
    terms += `## 9. Governing Law\n\n`;
    terms += `These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.\n\n`;

    // Changes to Terms
    terms += `## 10. Changes to Terms\n\n`;
    terms += `We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the updated Terms on this page and updating the "Last Updated" date.\n\n`;

    // Contact Information
    terms += `## 11. Contact Information\n\n`;
    terms += `If you have any questions about these Terms, please contact us at:\n\n`;
    terms += `- Email: ${contactEmail}\n`;
    terms += `- Address: [Your Company Address]\n\n`;

    // Last Updated
    terms += `Last Updated: ${formattedDate}\n`;
    terms += `Version: ${this.generateVersion()}\n`;

    return terms;
  }

  /**
   * Generate privacy policy JSON
   */
  private generatePrivacyPolicyJson(formData: PolicyFormData): Record<string, any> {
    const { 
      companyName, 
      businessType, 
      contactEmail, 
      effectiveDate, 
      complianceRequirements,
      dataCollectionTypes,
      retentionPeriod,
      childrenData,
      processPayments,
      useCookies,
      useAnalytics,
      sendMarketing
    } = formData;

    // Build structured JSON
    return {
      metadata: {
        policyType: 'privacy_policy',
        version: this.generateVersion(),
        companyName,
        businessType,
        contactEmail,
        effectiveDate,
        generatedAt: new Date().toISOString(),
        complianceFrameworks: complianceRequirements
      },
      dataCollection: {
        categories: dataCollectionTypes,
        purposes: [
          'Providing services',
          'Processing transactions',
          'Service improvement',
          'Communication',
          'Legal compliance',
          ...(sendMarketing ? ['Marketing'] : [])
        ],
        sources: [
          'Directly from users',
          'Automatically through website usage',
          ...(useAnalytics ? ['Analytics providers'] : [])
        ]
      },
      dataUse: {
        primaryPurposes: [
          'Providing and maintaining services',
          'Processing transactions',
          'Customer support',
          'Service improvement'
        ],
        secondaryPurposes: [
          ...(sendMarketing ? ['Marketing communications'] : []),
          ...(useAnalytics ? ['Analytics and research'] : [])
        ],
        legalBases: complianceRequirements.includes('GDPR') ? [
          'Consent',
          'Contractual necessity',
          'Legal obligation',
          'Legitimate interests'
        ] : undefined
      },
      dataSharing: {
        categories: [
          'Service providers',
          'Business partners',
          'Legal authorities when required'
        ],
        thirdParties: [
          ...(useAnalytics ? ['Analytics providers'] : []),
          ...(processPayments ? ['Payment processors'] : []),
          ...(useCookies ? ['Cookie providers'] : [])
        ],
        internationalTransfers: complianceRequirements.includes('GDPR') ? {
          occurs: true,
          safeguards: ['Standard Contractual Clauses', 'Adequacy decisions']
        } : undefined
      },
      dataRetention: {
        period: retentionPeriod ? `${retentionPeriod} years` : 'As long as necessary',
        criteria: [
          'Account activity',
          'Legal requirements',
          'Business needs'
        ]
      },
      userRights: {
        access: true,
        correction: true,
        deletion: true,
        portability: complianceRequirements.includes('GDPR'),
        optOut: complianceRequirements.includes('CCPA'),
        restriction: complianceRequirements.includes('GDPR'),
        objection: complianceRequirements.includes('GDPR')
      },
      security: {
        measures: [
          'Encryption',
          'Access controls',
          'Regular security assessments',
          'Employee training'
        ],
        breachNotification: true
      },
      cookies: useCookies ? {
        used: true,
        types: [
          'Essential',
          ...(useAnalytics ? ['Analytics'] : []),
          'Functionality',
          ...(sendMarketing ? ['Marketing'] : [])
        ],
        optOut: true
      } : { used: false },
      childrenPrivacy: {
        collectFromChildren: childrenData,
        parentalConsent: childrenData,
        complianceWithCOPPA: complianceRequirements.includes('COPPA') || childrenData
      },
      contactInformation: {
        email: contactEmail,
        address: '[Your Company Address]',
        dpo: complianceRequirements.includes('GDPR') ? {
          available: true,
          contact: contactEmail
        } : undefined
      },
      changeManagement: {
        notificationMethod: 'Website posting',
        effectiveDate: effectiveDate
      }
    };
  }

  /**
   * Generate terms of service JSON
   */
  private generateTermsOfServiceJson(formData: PolicyFormData): Record<string, any> {
    const { 
      companyName, 
      businessType, 
      contactEmail, 
      effectiveDate, 
      complianceRequirements,
      processPayments,
      useCookies
    } = formData;

    // Build structured JSON
    return {
      metadata: {
        policyType: 'terms_of_service',
        version: this.generateVersion(),
        companyName,
        businessType,
        contactEmail,
        effectiveDate,
        generatedAt: new Date().toISOString(),
        complianceFrameworks: complianceRequirements
      },
      agreement: {
        parties: {
          company: companyName,
          user: 'End User'
        },
        acceptance: {
          methods: ['Using the service', 'Creating an account'],
          impliedConsent: true
        }
      },
      userAccounts: {
        registrationRequirements: true,
        accountResponsibilities: [
          'Maintaining account security',
          'Providing accurate information',
          'Compliance with terms'
        ],
        terminationRights: {
          userInitiated: true,
          companyInitiated: true,
          grounds: [
            'Terms violation',
            'Illegal activity',
            'Extended inactivity'
          ]
        }
      },
      services: {
        description: 'AI governance and compliance platform',
        modifications: {
          right: true,
          notificationRequired: true
        },
        availability: {
          guarantees: false,
          disclaimers: [
            'No guarantee of continuous availability',
            'Right to suspend or terminate services'
          ]
        }
      },
      userConduct: {
        prohibitedActivities: [
          'Illegal use',
          'Unauthorized access',
          'Interference with service',
          'Content violations'
        ],
        contentRestrictions: [
          'Illegal content',
          'Harmful content',
          'Infringing content'
        ],
        enforcement: {
          monitoring: false,
          remedies: [
            'Content removal',
            'Account suspension',
            'Account termination'
          ]
        }
      },
      intellectualProperty: {
        ownership: {
          company: ['Service', 'Content', 'Trademarks'],
          user: ['User-generated content']
        },
        licenses: {
          toCompany: 'Limited license to use user content for service provision',
          toUser: 'Limited license to use service as intended'
        }
      },
      payment: processPayments ? {
        terms: {
          methods: ['Credit card', 'Other electronic payments'],
          billing: 'As specified during purchase',
          taxes: 'User responsibility'
        },
        refunds: {
          policy: 'As specified in refund policy',
          exceptions: ['Fraud', 'Terms violation']
        },
        subscriptions: {
          autoRenewal: true,
          cancellation: true,
          modifications: true
        }
      } : undefined,
      disclaimers: {
        warranties: 'AS IS, WITHOUT WARRANTIES',
        liabilities: 'LIMITED TO MAXIMUM EXTENT PERMITTED BY LAW'
      },
      disputeResolution: {
        governing: {
          law: '[Your Jurisdiction]',
          venue: '[Your Jurisdiction]'
        },
        process: {
          initialStep: 'Informal resolution',
          arbitration: false,
          classAction: false
        }
      },
      miscellaneous: {
        entireAgreement: true,
        severability: true,
        waiver: false,
        assignment: {
          byCompany: true,
          byUser: false
        },
        thirdPartyBeneficiaries: false
      },
      contact: {
        method: 'Email',
        address: contactEmail
      }
    };
  }

  /**
   * Calculate compliance score for each framework
   */
  private calculateComplianceScore(formData: PolicyFormData, policyJson: Record<string, any>): { framework: string; score: number; missingElements?: string[] }[] {
    const results: { framework: string; score: number; missingElements?: string[] }[] = [];
    
    // Check each framework
    for (const framework of formData.complianceRequirements) {
      switch (framework) {
        case 'GDPR':
          results.push(this.calculateGDPRScore(formData, policyJson));
          break;
        case 'CCPA':
          results.push(this.calculateCCPAScore(formData, policyJson));
          break;
        case 'COPPA':
          results.push(this.calculateCOPPAScore(formData, policyJson));
          break;
        case 'PIPEDA':
          results.push(this.calculatePIPEDAScore(formData, policyJson));
          break;
      }
    }
    
    return results;
  }

  /**
   * Calculate overall compliance score
   */
  private calculateOverallScore(scores: { framework: string; score: number }[]): number {
    if (scores.length === 0) return 0;
    
    const totalScore = scores.reduce((sum, item) => sum + item.score, 0);
    return Math.round(totalScore / scores.length);
  }

  /**
   * Calculate GDPR compliance score
   */
  private calculateGDPRScore(formData: PolicyFormData, policyJson: Record<string, any>): { framework: string; score: number; missingElements?: string[] } {
    const missingElements: string[] = [];
    let points = 0;
    const totalPoints = 10;
    
    // Check for required elements
    if (policyJson.dataCollection) points++;
    if (policyJson.dataUse?.legalBases) points++;
    if (policyJson.userRights?.access && policyJson.userRights?.correction && 
        policyJson.userRights?.deletion && policyJson.userRights?.portability) points++;
    if (policyJson.dataSharing) points++;
    if (policyJson.dataRetention) points++;
    if (policyJson.security) points++;
    if (policyJson.contactInformation?.dpo) points++;
    if (policyJson.dataSharing?.internationalTransfers) points++;
    if (policyJson.changeManagement) points++;
    
    // Check for breach notification
    if (policyJson.security?.breachNotification) points++;
    
    // Calculate missing elements
    if (!policyJson.dataCollection) missingElements.push('Data collection details');
    if (!policyJson.dataUse?.legalBases) missingElements.push('Legal bases for processing');
    if (!(policyJson.userRights?.access && policyJson.userRights?.correction && 
          policyJson.userRights?.deletion && policyJson.userRights?.portability)) {
      missingElements.push('Complete user rights (access, correction, deletion, portability)');
    }
    if (!policyJson.dataSharing) missingElements.push('Data sharing information');
    if (!policyJson.dataRetention) missingElements.push('Data retention policy');
    if (!policyJson.security) missingElements.push('Security measures');
    if (!policyJson.contactInformation?.dpo) missingElements.push('Data Protection Officer information');
    if (!policyJson.dataSharing?.internationalTransfers) missingElements.push('International transfer safeguards');
    if (!policyJson.changeManagement) missingElements.push('Policy update procedures');
    if (!policyJson.security?.breachNotification) missingElements.push('Breach notification procedures');
    
    const score = Math.round((points / totalPoints) * 100);
    
    return {
      framework: 'GDPR',
      score,
      missingElements: missingElements.length > 0 ? missingElements : undefined
    };
  }

  /**
   * Calculate CCPA compliance score
   */
  private calculateCCPAScore(formData: PolicyFormData, policyJson: Record<string, any>): { framework: string; score: number; missingElements?: string[] } {
    const missingElements: string[] = [];
    let points = 0;
    const totalPoints = 8;
    
    // Check for required elements
    if (policyJson.dataCollection?.categories) points++;
    if (policyJson.dataUse) points++;
    if (policyJson.userRights?.access && policyJson.userRights?.deletion) points++;
    if (policyJson.userRights?.optOut) points++;
    if (policyJson.dataSharing) points++;
    if (policyJson.dataCollection?.sources) points++;
    if (policyJson.contactInformation) points++;
    if (policyJson.changeManagement) points++;
    
    // Calculate missing elements
    if (!policyJson.dataCollection?.categories) missingElements.push('Categories of personal information collected');
    if (!policyJson.dataUse) missingElements.push('How personal information is used');
    if (!(policyJson.userRights?.access && policyJson.userRights?.deletion)) {
      missingElements.push('Right to access and delete personal information');
    }
    if (!policyJson.userRights?.optOut) missingElements.push('Right to opt-out of sale of personal information');
    if (!policyJson.dataSharing) missingElements.push('Categories of third parties with whom information is shared');
    if (!policyJson.dataCollection?.sources) missingElements.push('Sources of personal information');
    if (!policyJson.contactInformation) missingElements.push('Contact information for rights requests');
    if (!policyJson.changeManagement) missingElements.push('Policy update procedures');
    
    const score = Math.round((points / totalPoints) * 100);
    
    return {
      framework: 'CCPA',
      score,
      missingElements: missingElements.length > 0 ? missingElements : undefined
    };
  }

  /**
   * Calculate COPPA compliance score
   */
  private calculateCOPPAScore(formData: PolicyFormData, policyJson: Record<string, any>): { framework: string; score: number; missingElements?: string[] } {
    const missingElements: string[] = [];
    let points = 0;
    const totalPoints = 7;
    
    // Check for required elements
    if (policyJson.childrenPrivacy) points++;
    if (policyJson.childrenPrivacy?.collectFromChildren === formData.childrenData) points++;
    if (policyJson.childrenPrivacy?.parentalConsent) points++;
    if (policyJson.dataCollection) points++;
    if (policyJson.dataUse) points++;
    if (policyJson.dataSharing) points++;
    if (policyJson.contactInformation) points++;
    
    // Calculate missing elements
    if (!policyJson.childrenPrivacy) missingElements.push('Children\'s privacy section');
    if (policyJson.childrenPrivacy?.collectFromChildren !== formData.childrenData) {
      missingElements.push('Accurate statement about collection from children');
    }
    if (!policyJson.childrenPrivacy?.parentalConsent && formData.childrenData) {
      missingElements.push('Parental consent procedures');
    }
    if (!policyJson.dataCollection) missingElements.push('Information collected from children');
    if (!policyJson.dataUse) missingElements.push('How children\'s information is used');
    if (!policyJson.dataSharing) missingElements.push('Disclosure of children\'s information to third parties');
    if (!policyJson.contactInformation) missingElements.push('Contact information for parents');
    
    const score = Math.round((points / totalPoints) * 100);
    
    return {
      framework: 'COPPA',
      score,
      missingElements: missingElements.length > 0 ? missingElements : undefined
    };
  }

  /**
   * Calculate PIPEDA compliance score
   */
  private calculatePIPEDAScore(formData: PolicyFormData, policyJson: Record<string, any>): { framework: string; score: number; missingElements?: string[] } {
    const missingElements: string[] = [];
    let points = 0;
    const totalPoints = 8;
    
    // Check for required elements
    if (policyJson.dataCollection) points++;
    if (policyJson.dataUse) points++;
    if (policyJson.userRights?.access && policyJson.userRights?.correction) points++;
    if (policyJson.dataSharing) points++;
    if (policyJson.dataRetention) points++;
    if (policyJson.security) points++;
    if (policyJson.contactInformation) points++;
    if (policyJson.changeManagement) points++;
    
    // Calculate missing elements
    if (!policyJson.dataCollection) missingElements.push('Types of personal information collected');
    if (!policyJson.dataUse) missingElements.push('Purposes for collecting personal information');
    if (!(policyJson.userRights?.access && policyJson.userRights?.correction)) {
      missingElements.push('Right to access and correct personal information');
    }
    if (!policyJson.dataSharing) missingElements.push('Disclosure of personal information to third parties');
    if (!policyJson.dataRetention) missingElements.push('Retention of personal information');
    if (!policyJson.security) missingElements.push('Safeguards for personal information');
    if (!policyJson.contactInformation) missingElements.push('Contact information for privacy inquiries');
    if (!policyJson.changeManagement) missingElements.push('Policy update procedures');
    
    const score = Math.round((points / totalPoints) * 100);
    
    return {
      framework: 'PIPEDA',
      score,
      missingElements: missingElements.length > 0 ? missingElements : undefined
    };
  }

  /**
   * Hash content using CryptoJS
   */
  private hashContent(content: string): string {
    return CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex);
  }
}

export const policyGeneratorService = PolicyGeneratorService.getInstance();