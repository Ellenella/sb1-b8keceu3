import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  readTime: string;
  featured: boolean;
  imageUrl: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The EU AI Act: What It Means for Your Organization',
    summary: 'A comprehensive guide to understanding the new EU AI Act and how to ensure compliance with the latest regulations.',
    content: `The European Union AI Act represents the world's first comprehensive AI regulation, setting a global precedent for AI governance. This landmark legislation, which came into effect in 2024, establishes a risk-based approach to AI regulation that will fundamentally change how organizations develop, deploy, and manage AI systems.

## Understanding the Risk Categories

The EU AI Act categorizes AI systems into four risk levels:

### Unacceptable Risk
AI systems that pose unacceptable risks are completely prohibited. These include:
- Social scoring systems by governments
- Real-time biometric identification in public spaces (with limited exceptions)
- AI systems that manipulate human behavior to circumvent free will
- AI systems that exploit vulnerabilities of specific groups

### High Risk
High-risk AI systems are subject to strict requirements before they can be placed on the market:
- Biometric identification and categorization systems
- AI systems used in critical infrastructure
- Educational and vocational training systems
- Employment and worker management systems
- Essential private and public services
- Law enforcement systems
- Migration, asylum, and border control management
- Administration of justice and democratic processes

### Limited Risk
These systems have specific transparency obligations:
- AI systems that interact with humans (chatbots)
- Emotion recognition systems
- Biometric categorization systems
- AI systems that generate or manipulate content (deepfakes)

### Minimal Risk
All other AI systems with minimal risk can be used freely but are encouraged to follow voluntary codes of conduct.

## Compliance Requirements for Organizations

Organizations using high-risk AI systems must:

1. **Implement Risk Management Systems**: Establish, implement, document, and maintain a risk management system throughout the AI system's lifecycle.

2. **Ensure Data Quality**: Use training, validation, and testing datasets that are relevant, representative, free of errors, and complete.

3. **Maintain Documentation**: Keep detailed documentation to ensure transparency and enable authorities to assess compliance.

4. **Enable Human Oversight**: Design systems to be effectively overseen by natural persons during their use.

5. **Achieve Accuracy and Robustness**: Ensure AI systems achieve appropriate levels of accuracy, robustness, and cybersecurity.

## Implementation Timeline

The EU AI Act follows a phased implementation approach:
- **February 2024**: Prohibitions on unacceptable risk AI systems take effect
- **August 2025**: Requirements for general-purpose AI models apply
- **August 2026**: Full compliance required for high-risk AI systems
- **August 2027**: Requirements for AI systems in regulated products

## Preparing Your Organization

To prepare for compliance:

1. **Conduct an AI Inventory**: Catalog all AI systems your organization uses or develops
2. **Assess Risk Levels**: Determine which category each AI system falls into
3. **Develop Governance Frameworks**: Establish policies and procedures for AI governance
4. **Implement Technical Measures**: Deploy monitoring, testing, and documentation systems
5. **Train Your Team**: Ensure staff understand their responsibilities under the Act
6. **Engage with Vendors**: Verify that AI vendors are compliant with the regulation

The EU AI Act represents a significant shift toward regulated AI development and deployment. Organizations that proactively address compliance requirements will be better positioned to leverage AI technologies while maintaining regulatory compliance and public trust.`,
    author: 'Dr. Sarah Chen',
    publishedDate: '2024-01-15',
    category: 'Regulation',
    readTime: '8 min read',
    featured: true,
    imageUrl: 'https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    title: 'Detecting and Preventing AI Bias in Hiring Systems',
    summary: 'Learn how to identify, measure, and mitigate bias in AI-powered recruitment tools to ensure fair hiring practices.',
    content: `AI bias in hiring systems has become a critical concern for organizations worldwide. As more companies adopt AI-powered recruitment tools, the risk of perpetuating or amplifying existing biases in hiring decisions has increased significantly.

## Understanding AI Bias in Recruitment

AI bias in hiring occurs when algorithms systematically favor or discriminate against certain groups of candidates based on protected characteristics such as gender, race, age, or other demographic factors. This bias can manifest in various ways:

### Types of Bias in Hiring AI

1. **Historical Bias**: When training data reflects past discriminatory practices
2. **Representation Bias**: When certain groups are underrepresented in training data
3. **Measurement Bias**: When evaluation metrics favor certain groups
4. **Aggregation Bias**: When models fail to account for relevant subgroups
5. **Evaluation Bias**: When different standards are applied to different groups

## Common Sources of Bias

### Resume Screening Algorithms
- May penalize candidates from certain schools or neighborhoods
- Can discriminate based on names that suggest gender or ethnicity
- May favor traditional career paths over non-linear ones

### Video Interview Analysis
- Facial recognition systems may perform poorly on certain ethnic groups
- Voice analysis may discriminate based on accents or speech patterns
- Background and lighting conditions may create unfair advantages

### Predictive Analytics
- Historical performance data may reflect past biases
- Success metrics may not account for systemic barriers
- Correlation vs. causation issues in predictive models

## Detection Strategies

### Statistical Analysis
- Monitor hiring outcomes by demographic groups
- Calculate adverse impact ratios
- Analyze conversion rates at each stage of the hiring process
- Track long-term employee performance by demographic groups

### Algorithmic Auditing
- Regular bias testing of AI models
- Fairness metrics evaluation (demographic parity, equalized odds, etc.)
- Intersectional analysis for multiple protected characteristics
- A/B testing with diverse candidate pools

### Continuous Monitoring
- Real-time bias detection systems
- Regular model retraining with updated data
- Feedback loops from hiring managers and candidates
- External audits by third-party organizations

## Mitigation Techniques

### Pre-processing Approaches
- Data augmentation to balance representation
- Synthetic data generation for underrepresented groups
- Feature selection to remove biased variables
- Anonymization of candidate information

### In-processing Methods
- Fairness constraints in model training
- Multi-objective optimization for accuracy and fairness
- Adversarial debiasing techniques
- Ensemble methods with diverse models

### Post-processing Solutions
- Threshold optimization for different groups
- Calibration across demographic groups
- Output adjustment based on fairness metrics
- Human-in-the-loop validation

## Best Practices for Fair AI Hiring

### Governance and Oversight
1. Establish diverse AI ethics committees
2. Implement regular bias audits
3. Create clear accountability structures
4. Develop incident response procedures

### Technical Implementation
1. Use diverse and representative training data
2. Implement multiple fairness metrics
3. Ensure model interpretability and explainability
4. Maintain human oversight in final decisions

### Legal and Compliance
1. Stay updated on relevant regulations (EEOC guidelines, EU AI Act)
2. Document all AI decision-making processes
3. Provide transparency to candidates about AI use
4. Enable appeals and recourse mechanisms

### Organizational Culture
1. Train hiring teams on bias awareness
2. Promote diversity in AI development teams
3. Encourage reporting of potential bias issues
4. Celebrate fair hiring achievements

## Tools and Technologies

Several tools can help organizations detect and prevent AI bias:

- **IBM AI Fairness 360**: Open-source toolkit for bias detection and mitigation
- **Google What-If Tool**: Interactive tool for model analysis
- **Microsoft Fairlearn**: Python package for fairness assessment
- **Aequitas**: Bias audit toolkit for machine learning models

## Measuring Success

Key metrics for evaluating bias reduction efforts:

- **Demographic Parity**: Equal selection rates across groups
- **Equalized Odds**: Equal true positive and false positive rates
- **Calibration**: Equal prediction accuracy across groups
- **Individual Fairness**: Similar individuals receive similar outcomes

## Future Considerations

As AI hiring tools continue to evolve, organizations must:

- Stay informed about emerging bias detection techniques
- Adapt to changing legal and regulatory requirements
- Invest in ongoing education and training
- Collaborate with industry peers on best practices

The goal is not just compliance but creating truly fair and inclusive hiring processes that benefit both organizations and candidates. By proactively addressing AI bias, companies can build more diverse teams while maintaining the efficiency benefits of AI-powered recruitment.`,
    author: 'Michael Rodriguez',
    publishedDate: '2024-01-12',
    category: 'Best Practices',
    readTime: '6 min read',
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    title: 'Building Trust Through AI Transparency',
    summary: 'Explore strategies for making AI decision-making processes more transparent and building user trust.',
    content: `Transparency in AI systems is crucial for building trust with users and stakeholders. As AI becomes more prevalent in decision-making processes, the need for explainable and interpretable AI has never been greater.

## The Importance of AI Transparency

AI transparency involves making AI systems' decision-making processes understandable to users, stakeholders, and regulators. This transparency is essential for:

### Building User Trust
- Users are more likely to adopt and rely on AI systems they understand
- Transparency helps users identify when AI recommendations align with their values
- Clear explanations enable users to make informed decisions about AI use

### Regulatory Compliance
- Many jurisdictions require explainable AI for certain applications
- Transparency helps demonstrate compliance with fairness and non-discrimination laws
- Audit trails become essential for regulatory reporting

### Improving AI Performance
- Understanding AI decisions helps identify potential biases or errors
- Transparency enables iterative improvement of AI models
- User feedback becomes more actionable when decisions are explainable

## Levels of AI Transparency

### Global Transparency
Understanding the overall behavior and capabilities of an AI system:
- What types of decisions the AI makes
- What data the AI was trained on
- What the AI's limitations and potential biases are
- How the AI fits into broader organizational processes

### Local Transparency
Understanding specific individual decisions:
- Why the AI made a particular recommendation
- Which factors were most important in the decision
- How changing inputs would affect the output
- What the confidence level of the decision is

### Temporal Transparency
Understanding how AI decisions change over time:
- How the AI model has evolved
- What updates or retraining have occurred
- How performance metrics have changed
- What new capabilities have been added

## Techniques for Achieving Transparency

### Model-Agnostic Methods

**LIME (Local Interpretable Model-agnostic Explanations)**
- Explains individual predictions by approximating the model locally
- Works with any machine learning model
- Provides feature importance for specific decisions

**SHAP (SHapley Additive exPlanations)**
- Assigns importance values to each feature for individual predictions
- Provides both local and global explanations
- Based on game theory principles for fair attribution

**Permutation Importance**
- Measures feature importance by observing prediction changes when features are shuffled
- Model-agnostic and easy to implement
- Helps identify which features the model relies on most

### Model-Specific Methods

**Decision Trees and Rule-Based Systems**
- Inherently interpretable with clear decision paths
- Easy to visualize and understand
- Limited in complexity but highly transparent

**Linear Models**
- Coefficients directly indicate feature importance
- Simple to interpret and explain
- May lack the complexity needed for some problems

**Attention Mechanisms**
- Show which parts of input the model focuses on
- Particularly useful for text and image analysis
- Provide intuitive explanations for neural network decisions

### Visualization Techniques

**Feature Importance Plots**
- Bar charts showing relative importance of different features
- Help users understand what drives AI decisions
- Can be generated for individual predictions or model-wide

**Partial Dependence Plots**
- Show how changing one feature affects predictions
- Help understand feature-target relationships
- Useful for identifying non-linear relationships

**Decision Boundary Visualization**
- Show how the model separates different classes
- Particularly useful for classification problems
- Help identify potential bias or overfitting

## Implementation Strategies

### Design for Transparency from the Start
1. Choose interpretable models when possible
2. Design data collection with explainability in mind
3. Plan for explanation generation in the system architecture
4. Consider user needs for different types of explanations

### Layered Explanation Approach
1. **Summary Level**: High-level explanation of the decision
2. **Detailed Level**: Feature-by-feature breakdown
3. **Technical Level**: Model internals for expert users
4. **Interactive Level**: Allow users to explore "what-if" scenarios

### User-Centered Design
1. Understand your audience's technical background
2. Test explanations with real users
3. Iterate based on user feedback
4. Provide multiple explanation formats

### Continuous Monitoring
1. Track explanation quality metrics
2. Monitor user satisfaction with explanations
3. Update explanation methods as models evolve
4. Maintain explanation accuracy over time

## Challenges and Limitations

### Technical Challenges
- **Complexity vs. Accuracy Trade-off**: More accurate models are often less interpretable
- **Explanation Fidelity**: Simplified explanations may not capture full model behavior
- **Computational Cost**: Generating explanations can be resource-intensive
- **Dynamic Models**: Explanations become outdated as models are retrained

### Human Factors
- **Cognitive Overload**: Too much information can overwhelm users
- **Confirmation Bias**: Users may only pay attention to explanations that confirm their beliefs
- **False Confidence**: Poor explanations may give users false confidence in AI decisions
- **Technical Literacy**: Users may not understand technical explanations

### Organizational Challenges
- **Resource Requirements**: Implementing transparency requires significant investment
- **Competitive Concerns**: Transparency may reveal proprietary methods
- **Legal Implications**: Explanations may create liability in some contexts
- **Change Management**: Organizations must adapt processes to incorporate transparency

## Best Practices

### For Developers
1. Document model development decisions and trade-offs
2. Implement multiple explanation methods for robustness
3. Test explanations with domain experts
4. Maintain explanation quality as models evolve

### For Organizations
1. Establish transparency requirements early in AI projects
2. Train staff on explanation interpretation
3. Create feedback mechanisms for explanation quality
4. Develop governance frameworks for AI transparency

### For Users
1. Ask questions about AI decisions that affect you
2. Seek multiple perspectives on AI explanations
3. Understand the limitations of AI explanations
4. Provide feedback on explanation quality

## Future Directions

The field of AI transparency continues to evolve with new research and techniques:

- **Causal Explanations**: Moving beyond correlation to understand causation
- **Counterfactual Explanations**: Showing what would need to change for different outcomes
- **Interactive Explanations**: Allowing users to explore AI decisions dynamically
- **Standardized Metrics**: Developing common measures for explanation quality

Building transparent AI systems is not just a technical challenge but a fundamental requirement for responsible AI deployment. By prioritizing transparency, organizations can build trust, ensure compliance, and create AI systems that truly serve their users' needs.`,
    author: 'Dr. Emily Watson',
    publishedDate: '2024-01-10',
    category: 'Ethics',
    readTime: '5 min read',
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '4',
    title: 'Real-time AI Monitoring: Best Practices and Tools',
    summary: 'Discover the essential practices and tools for implementing effective real-time AI monitoring in your organization.',
    content: `Real-time monitoring of AI systems is essential for maintaining performance and compliance in production environments. This comprehensive guide covers the best practices and tools for implementing effective AI monitoring.

## Why Real-time AI Monitoring Matters

AI systems in production face numerous challenges that can impact their performance and reliability:

### Performance Degradation
- Model drift due to changing data patterns
- Infrastructure issues affecting response times
- Resource constraints impacting throughput
- Integration problems with downstream systems

### Compliance and Governance
- Regulatory requirements for AI transparency
- Bias detection and fairness monitoring
- Audit trail maintenance
- Risk management and incident response

### Business Impact
- User experience degradation
- Revenue loss from poor recommendations
- Reputation damage from AI failures
- Operational inefficiencies

## Key Monitoring Dimensions

### Model Performance Metrics

**Accuracy Metrics**
- Precision, recall, and F1-score for classification
- Mean absolute error (MAE) and root mean square error (RMSE) for regression
- Area under the curve (AUC) for ranking problems
- Custom business metrics aligned with objectives

**Prediction Quality**
- Confidence score distributions
- Prediction uncertainty quantification
- Calibration metrics for probability estimates
- Consistency across similar inputs

**Drift Detection**
- Data drift monitoring for input features
- Concept drift detection for target relationships
- Population stability index (PSI) calculations
- Statistical tests for distribution changes

### System Performance Metrics

**Latency and Throughput**
- Response time percentiles (p50, p95, p99)
- Requests per second capacity
- Queue lengths and processing delays
- End-to-end transaction times

**Resource Utilization**
- CPU and memory usage patterns
- GPU utilization for deep learning models
- Storage and bandwidth consumption
- Cost per prediction metrics

**Availability and Reliability**
- Uptime and downtime tracking
- Error rates and failure modes
- Recovery time objectives (RTO)
- Service level agreement (SLA) compliance

### Business Impact Metrics

**User Engagement**
- Click-through rates for recommendations
- Conversion rates for predictions
- User satisfaction scores
- Abandonment rates

**Revenue Impact**
- Revenue per user influenced by AI
- Cost savings from automation
- Return on investment (ROI) metrics
- Business process efficiency gains

## Monitoring Architecture

### Data Collection Layer

**Instrumentation**
- Application performance monitoring (APM) integration
- Custom logging for AI-specific metrics
- Event streaming for real-time data capture
- Sampling strategies for high-volume systems

**Data Pipeline**
- Stream processing for real-time analysis
- Batch processing for historical trends
- Data quality validation and cleansing
- Schema evolution and versioning

### Processing and Analysis Layer

**Real-time Analytics**
- Stream processing frameworks (Apache Kafka, Apache Flink)
- Complex event processing (CEP) engines
- Time-series databases for metric storage
- Anomaly detection algorithms

**Machine Learning Operations (MLOps)**
- Model versioning and experiment tracking
- A/B testing frameworks for model comparison
- Feature store integration
- Automated retraining pipelines

### Alerting and Visualization Layer

**Dashboard Design**
- Executive dashboards for high-level metrics
- Operational dashboards for technical teams
- Real-time monitoring displays
- Mobile-responsive interfaces

**Alert Management**
- Threshold-based alerting for known issues
- Anomaly-based alerting for unknown problems
- Alert prioritization and escalation
- Integration with incident management systems

## Implementation Best Practices

### Establish Baseline Metrics
1. **Historical Analysis**: Analyze past performance to establish normal ranges
2. **Seasonal Patterns**: Account for cyclical variations in data and performance
3. **Business Context**: Align metrics with business objectives and user expectations
4. **Continuous Calibration**: Regularly update baselines as systems evolve

### Design for Observability
1. **Comprehensive Logging**: Log all relevant events and decisions
2. **Structured Data**: Use consistent formats for easy analysis
3. **Correlation IDs**: Track requests across distributed systems
4. **Metadata Capture**: Include context about model versions and configurations

### Implement Gradual Rollouts
1. **Canary Deployments**: Test new models with small user segments
2. **Blue-Green Deployments**: Maintain parallel environments for quick rollbacks
3. **Feature Flags**: Control model behavior without code deployments
4. **Shadow Mode**: Run new models alongside existing ones for comparison

### Automate Response Actions
1. **Circuit Breakers**: Automatically disable failing models
2. **Auto-scaling**: Adjust resources based on demand
3. **Fallback Mechanisms**: Switch to backup models or rule-based systems
4. **Self-healing**: Automatically restart failed components

## Essential Monitoring Tools

### Open Source Solutions

**Prometheus + Grafana**
- Time-series metrics collection and visualization
- Flexible alerting rules and notification channels
- Large ecosystem of exporters and integrations
- Suitable for infrastructure and application metrics

**ELK Stack (Elasticsearch, Logstash, Kibana)**
- Centralized logging and log analysis
- Full-text search capabilities
- Real-time data visualization
- Good for debugging and root cause analysis

**MLflow**
- Experiment tracking and model versioning
- Model registry for production deployments
- Integration with popular ML frameworks
- Suitable for ML lifecycle management

### Commercial Platforms

**DataDog**
- Comprehensive monitoring for applications and infrastructure
- AI-powered anomaly detection
- Distributed tracing capabilities
- Strong integration ecosystem

**New Relic**
- Application performance monitoring
- Real user monitoring (RUM)
- AI-powered insights and alerting
- Good for user experience monitoring

**Splunk**
- Enterprise-grade log analysis and SIEM
- Machine learning toolkit for anomaly detection
- Compliance and security monitoring
- Suitable for large-scale deployments

### Specialized AI Monitoring Tools

**Evidently AI**
- ML model monitoring and data drift detection
- Interactive reports and dashboards
- Integration with popular ML frameworks
- Focus on model performance and data quality

**Weights & Biases**
- Experiment tracking and model monitoring
- Collaborative ML development platform
- Hyperparameter optimization
- Strong visualization capabilities

**Arize AI**
- Production ML monitoring and observability
- Bias and fairness monitoring
- Root cause analysis for model issues
- Enterprise-focused features

## Monitoring Workflows

### Daily Operations
1. **Morning Health Checks**: Review overnight alerts and system status
2. **Performance Reviews**: Analyze key metrics and trends
3. **Incident Triage**: Prioritize and assign investigation tasks
4. **Capacity Planning**: Monitor resource utilization and forecast needs

### Weekly Analysis
1. **Trend Analysis**: Identify patterns in performance metrics
2. **Model Performance Reviews**: Assess accuracy and business impact
3. **Alert Tuning**: Adjust thresholds based on recent data
4. **Stakeholder Reporting**: Communicate status to business teams

### Monthly Assessments
1. **Comprehensive Model Audits**: Deep dive into model performance
2. **Business Impact Analysis**: Measure ROI and value delivery
3. **Tool and Process Improvements**: Optimize monitoring infrastructure
4. **Compliance Reviews**: Ensure regulatory requirements are met

## Common Pitfalls and Solutions

### Alert Fatigue
- **Problem**: Too many false positive alerts overwhelm teams
- **Solution**: Implement intelligent alerting with proper thresholds and correlation

### Metric Overload
- **Problem**: Tracking too many metrics without clear priorities
- **Solution**: Focus on key performance indicators (KPIs) aligned with business goals

### Reactive Monitoring
- **Problem**: Only detecting issues after they impact users
- **Solution**: Implement predictive monitoring and early warning systems

### Siloed Monitoring
- **Problem**: Different teams using incompatible monitoring tools
- **Solution**: Establish common monitoring standards and shared dashboards

## Future Trends

The field of AI monitoring continues to evolve with new technologies and approaches:

- **Automated Root Cause Analysis**: AI-powered systems that can identify and explain performance issues
- **Predictive Monitoring**: Systems that predict failures before they occur
- **Federated Monitoring**: Monitoring across distributed and edge AI deployments
- **Privacy-Preserving Monitoring**: Techniques for monitoring without exposing sensitive data

Real-time AI monitoring is not just about detecting problems—it's about ensuring that AI systems continue to deliver value while maintaining trust and compliance. By implementing comprehensive monitoring strategies, organizations can maximize the benefits of their AI investments while minimizing risks.`,
    author: 'Alex Thompson',
    publishedDate: '2024-01-08',
    category: 'Technology',
    readTime: '7 min read',
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/159888/pexels-photo-159888.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '5',
    title: 'The Cost of AI Incidents: A Financial Analysis',
    summary: 'Understanding the true financial impact of AI failures and how proper governance can prevent costly incidents.',
    content: `AI incidents can have significant financial implications for organizations. This analysis examines the true cost of AI failures and demonstrates how proper governance can prevent expensive incidents.

## The Hidden Costs of AI Incidents

When AI systems fail, the financial impact extends far beyond the immediate technical costs. Organizations must consider both direct and indirect costs when evaluating the true impact of AI incidents.

### Direct Costs

**Immediate Response Costs**
- Emergency technical support and overtime pay
- External consultant fees for incident resolution
- Infrastructure costs for scaling or replacing systems
- Legal fees for regulatory compliance issues

**System Downtime Costs**
- Lost revenue during service interruptions
- Productivity losses from internal system failures
- Customer compensation and service credits
- Opportunity costs from delayed business processes

**Remediation Costs**
- Code fixes and system patches
- Data recovery and cleanup operations
- Model retraining and redeployment
- Additional testing and validation

### Indirect Costs

**Reputation Damage**
- Customer churn and reduced lifetime value
- Negative media coverage and public relations costs
- Decreased brand value and market perception
- Difficulty attracting new customers

**Regulatory and Legal Consequences**
- Fines and penalties from regulatory bodies
- Legal settlements and litigation costs
- Increased compliance and audit requirements
- Mandatory third-party assessments

**Long-term Business Impact**
- Reduced investor confidence and valuation
- Increased insurance premiums
- Higher costs for future AI initiatives
- Competitive disadvantage in the market

## Case Studies: Real-World AI Incident Costs

### Case Study 1: Biased Hiring Algorithm

**Incident**: A major technology company's AI-powered hiring tool showed bias against women candidates.

**Direct Costs**:
- $3 million in system development and replacement
- $1.5 million in legal fees and settlements
- $500,000 in external audit and consulting fees

**Indirect Costs**:
- $10 million in estimated reputation damage
- $5 million in increased diversity and inclusion program costs
- $2 million in additional compliance and monitoring systems

**Total Estimated Cost**: $22 million

**Prevention Cost**: Proper bias testing and governance could have prevented this incident for approximately $500,000 in upfront investment.

### Case Study 2: Autonomous Vehicle Accident

**Incident**: Self-driving car involved in fatal accident due to sensor failure and inadequate safety protocols.

**Direct Costs**:
- $50 million in legal settlements
- $20 million in regulatory fines
- $15 million in system recalls and updates
- $10 million in emergency response and investigation

**Indirect Costs**:
- $200 million in lost market value
- $100 million in delayed product launches
- $50 million in increased insurance and liability costs
- $30 million in additional safety testing requirements

**Total Estimated Cost**: $475 million

**Prevention Cost**: Comprehensive safety testing and governance frameworks could have prevented this incident for approximately $10 million in additional development costs.

### Case Study 3: Financial Trading Algorithm Malfunction

**Incident**: High-frequency trading algorithm caused market disruption due to inadequate risk controls.

**Direct Costs**:
- $440 million in trading losses
- $10 million in regulatory fines
- $5 million in system fixes and improvements
- $2 million in legal and compliance costs

**Indirect Costs**:
- $100 million in lost business opportunities
- $50 million in increased regulatory scrutiny costs
- $20 million in reputation management
- $10 million in additional risk management systems

**Total Estimated Cost**: $637 million

**Prevention Cost**: Proper risk management and testing protocols could have prevented this incident for approximately $2 million in additional controls.

## Cost-Benefit Analysis of AI Governance

### Investment in AI Governance

**Upfront Costs**:
- Governance framework development: $500,000 - $2 million
- Staff training and certification: $200,000 - $500,000
- Monitoring and compliance tools: $300,000 - $1 million annually
- External audits and assessments: $100,000 - $300,000 annually

**Ongoing Costs**:
- Dedicated governance team: $1 million - $3 million annually
- Continuous monitoring and testing: $500,000 - $1.5 million annually
- Regular model audits and updates: $300,000 - $800,000 annually
- Compliance reporting and documentation: $200,000 - $500,000 annually

**Total Annual Investment**: $2.4 million - $6.8 million

### Return on Investment

Based on industry data and case studies:

**Risk Reduction**:
- 70-90% reduction in major AI incidents
- 50-80% reduction in incident severity
- 60-85% faster incident resolution
- 40-70% reduction in regulatory issues

**Financial Benefits**:
- Avoided incident costs: $10 million - $100 million annually
- Reduced insurance premiums: $500,000 - $2 million annually
- Improved operational efficiency: $1 million - $5 million annually
- Enhanced customer trust and retention: $2 million - $10 million annually

**ROI Calculation**:
- Investment: $2.4 million - $6.8 million annually
- Benefits: $13.5 million - $117 million annually
- ROI: 460% - 1,620%

## Industry-Specific Cost Patterns

### Healthcare
- **High-impact incidents**: Misdiagnosis, treatment recommendations
- **Average incident cost**: $5 million - $50 million
- **Primary cost drivers**: Patient safety, regulatory compliance, malpractice liability

### Financial Services
- **High-impact incidents**: Trading errors, credit decisions, fraud detection failures
- **Average incident cost**: $10 million - $500 million
- **Primary cost drivers**: Market impact, regulatory fines, customer losses

### Autonomous Vehicles
- **High-impact incidents**: Safety failures, accidents
- **Average incident cost**: $50 million - $1 billion
- **Primary cost drivers**: Human safety, product recalls, regulatory action

### Retail and E-commerce
- **High-impact incidents**: Recommendation failures, pricing errors
- **Average incident cost**: $1 million - $20 million
- **Primary cost drivers**: Revenue loss, customer experience, competitive impact

## Cost Prevention Strategies

### Proactive Risk Management

**Early Detection Systems**
- Implement continuous monitoring for model drift
- Use anomaly detection for unusual patterns
- Establish automated alerting for threshold breaches
- Regular stress testing and scenario analysis

**Governance Frameworks**
- Establish clear accountability and decision-making processes
- Implement model validation and approval workflows
- Create incident response and escalation procedures
- Maintain comprehensive documentation and audit trails

### Investment Prioritization

**Risk-Based Approach**
- Focus resources on highest-risk AI applications
- Prioritize systems with greatest business impact
- Consider regulatory and compliance requirements
- Balance prevention costs with potential incident costs

**Phased Implementation**
- Start with critical systems and expand gradually
- Build governance capabilities incrementally
- Learn from early implementations and iterate
- Scale successful practices across the organization

### Technology Solutions

**Automated Governance Tools**
- Model monitoring and drift detection platforms
- Bias and fairness testing frameworks
- Automated compliance reporting systems
- Integrated development and deployment pipelines

**Insurance and Risk Transfer**
- AI-specific insurance policies
- Vendor liability and indemnification clauses
- Risk-sharing partnerships with technology providers
- Captive insurance arrangements for large organizations

## Measuring Governance Effectiveness

### Key Performance Indicators

**Incident Metrics**
- Number and severity of AI incidents
- Time to detection and resolution
- Cost per incident and total incident costs
- Repeat incident rates

**Governance Metrics**
- Model approval cycle times
- Compliance audit results
- Staff training completion rates
- Governance framework maturity scores

**Business Impact Metrics**
- AI system uptime and availability
- Customer satisfaction with AI-powered services
- Revenue impact from AI initiatives
- Competitive advantage from AI capabilities

### Continuous Improvement

**Regular Assessments**
- Annual governance framework reviews
- Quarterly incident analysis and lessons learned
- Monthly performance metric reviews
- Weekly operational health checks

**Benchmarking**
- Industry peer comparisons
- Best practice identification and adoption
- Regulatory guidance alignment
- Technology vendor evaluations

## Future Considerations

As AI systems become more complex and pervasive, the potential costs of incidents will continue to grow. Organizations must:

- **Invest in Prevention**: The cost of prevention is always lower than the cost of incidents
- **Build Resilience**: Design systems that can gracefully handle failures
- **Maintain Vigilance**: Continuously monitor and improve governance practices
- **Stay Informed**: Keep up with evolving risks and best practices

The financial case for AI governance is clear: the cost of implementing proper governance frameworks is a fraction of the potential cost of major AI incidents. Organizations that invest in governance today will be better positioned to realize the benefits of AI while minimizing financial risks.`,
    author: 'Jennifer Park',
    publishedDate: '2024-01-05',
    category: 'Business',
    readTime: '9 min read',
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6',
    title: 'Implementing SOC 2 Compliance for AI Systems',
    summary: 'A step-by-step guide to achieving SOC 2 compliance for organizations using AI technologies.',
    content: `SOC 2 compliance is becoming increasingly important for AI-powered organizations. This comprehensive guide provides a step-by-step approach to achieving SOC 2 compliance for AI systems.

## Understanding SOC 2 for AI Systems

SOC 2 (Service Organization Control 2) is an auditing procedure that ensures service providers securely manage data to protect the interests of the organization and the privacy of its clients. For AI systems, SOC 2 compliance presents unique challenges and considerations.

### SOC 2 Trust Service Criteria

**Security**
- Protection against unauthorized access (both physical and logical)
- Network security and firewall configurations
- Access controls and authentication mechanisms
- Incident response and monitoring procedures

**Availability**
- System uptime and performance monitoring
- Disaster recovery and business continuity planning
- Capacity management and scalability
- Change management procedures

**Processing Integrity**
- Data processing accuracy and completeness
- Error detection and correction mechanisms
- Quality assurance and testing procedures
- Model validation and performance monitoring

**Confidentiality**
- Data encryption in transit and at rest
- Access controls and data classification
- Non-disclosure agreements and privacy policies
- Secure data disposal procedures

**Privacy**
- Personal information collection and use policies
- Consent management and user rights
- Data retention and deletion procedures
- Privacy impact assessments

## AI-Specific SOC 2 Considerations

### Model Governance and Validation

**Model Development Controls**
- Version control for model code and data
- Peer review processes for model changes
- Testing and validation procedures
- Documentation of model assumptions and limitations

**Model Deployment Controls**
- Approval workflows for production deployment
- Rollback procedures for failed deployments
- A/B testing and gradual rollout processes
- Performance monitoring and alerting

**Model Monitoring Controls**
- Continuous performance monitoring
- Drift detection and model degradation alerts
- Bias and fairness monitoring
- Regular model retraining and updates

### Data Management for AI

**Training Data Controls**
- Data lineage and provenance tracking
- Data quality validation and cleansing
- Bias detection in training datasets
- Secure data storage and access controls

**Data Processing Controls**
- Automated data processing pipelines
- Error handling and exception management
- Data transformation and feature engineering controls
- Audit trails for data processing activities

**Data Retention and Disposal**
- Automated data lifecycle management
- Secure deletion of expired data
- Compliance with data retention policies
- Documentation of data disposal activities

### AI System Security

**Access Controls**
- Role-based access control (RBAC) for AI systems
- Multi-factor authentication for sensitive operations
- Privileged access management (PAM)
- Regular access reviews and certifications

**Network Security**
- Segmentation of AI infrastructure
- Intrusion detection and prevention systems
- Secure API gateways and endpoints
- Regular vulnerability assessments

**Incident Response**
- AI-specific incident response procedures
- Automated threat detection and response
- Forensic capabilities for AI incidents
- Communication and escalation procedures

## Implementation Roadmap

### Phase 1: Assessment and Planning (Months 1-2)

**Current State Assessment**
1. Inventory all AI systems and components
2. Document existing controls and procedures
3. Identify gaps against SOC 2 requirements
4. Assess risk levels for different AI applications

**Scope Definition**
1. Define the scope of SOC 2 audit
2. Identify in-scope AI systems and processes
3. Determine applicable trust service criteria
4. Establish audit timeline and milestones

**Resource Planning**
1. Assign dedicated project team
2. Engage external SOC 2 consultants if needed
3. Allocate budget for compliance activities
4. Establish governance and oversight structure

### Phase 2: Control Design and Implementation (Months 3-8)

**Policy Development**
1. Create AI governance policies and procedures
2. Develop incident response plans for AI systems
3. Establish data management and retention policies
4. Create vendor management and third-party risk policies

**Technical Controls Implementation**
1. Implement access controls and authentication systems
2. Deploy monitoring and logging solutions
3. Establish backup and disaster recovery procedures
4. Implement encryption and data protection measures

**Process Controls Implementation**
1. Establish change management procedures
2. Implement model validation and testing processes
3. Create documentation and record-keeping procedures
4. Establish training and awareness programs

### Phase 3: Testing and Validation (Months 9-10)

**Internal Testing**
1. Test control effectiveness and operation
2. Validate documentation and procedures
3. Conduct mock audits and assessments
4. Address identified deficiencies and gaps

**External Validation**
1. Engage SOC 2 auditor for readiness assessment
2. Conduct pre-audit testing and validation
3. Address auditor feedback and recommendations
4. Finalize documentation and evidence collection

### Phase 4: SOC 2 Audit (Months 11-12)

**Type I Audit (Point-in-Time)**
1. Auditor reviews control design
2. Testing of control implementation
3. Documentation review and validation
4. Management letter and recommendations

**Type II Audit (Operating Effectiveness)**
1. Extended testing period (6-12 months)
2. Continuous monitoring and testing
3. Evidence collection and documentation
4. Final SOC 2 report issuance

## Key Controls for AI Systems

### Model Development and Deployment

**Control Objective**: Ensure AI models are developed, tested, and deployed following established procedures.

**Control Activities**:
- Model development follows documented procedures
- Code reviews are performed for all model changes
- Models are tested in non-production environments
- Deployment approvals are documented and authorized
- Rollback procedures are tested and documented

**Evidence**:
- Model development procedures and standards
- Code review documentation and approvals
- Test results and validation reports
- Deployment checklists and approvals
- Rollback test results and procedures

### Data Quality and Integrity

**Control Objective**: Ensure data used for AI model training and inference is accurate, complete, and properly managed.

**Control Activities**:
- Data quality checks are performed automatically
- Data lineage is tracked and documented
- Data access is restricted to authorized personnel
- Data retention policies are enforced automatically
- Data disposal is performed securely and documented

**Evidence**:
- Data quality monitoring reports
- Data lineage documentation
- Access control lists and reviews
- Data retention policy documentation
- Data disposal certificates and logs

### Model Performance Monitoring

**Control Objective**: Ensure AI models perform as expected and deviations are detected and addressed promptly.

**Control Activities**:
- Model performance is monitored continuously
- Alerts are generated for performance degradation
- Bias and fairness metrics are tracked
- Model drift is detected and addressed
- Performance reports are generated regularly

**Evidence**:
- Performance monitoring dashboards
- Alert configurations and notifications
- Bias and fairness monitoring reports
- Drift detection reports and remediation
- Regular performance review meetings

### Incident Response for AI Systems

**Control Objective**: Ensure AI-related incidents are detected, reported, and resolved in a timely manner.

**Control Activities**:
- AI incidents are detected automatically
- Incident response procedures are followed
- Incidents are escalated appropriately
- Root cause analysis is performed
- Lessons learned are documented and implemented

**Evidence**:
- Incident detection and alerting systems
- Incident response procedures and training
- Incident escalation matrix and contacts
- Root cause analysis reports
- Lessons learned documentation

## Common Challenges and Solutions

### Challenge: Model Explainability

**Problem**: SOC 2 auditors may require explanations of AI decision-making processes.

**Solution**:
- Implement explainable AI techniques (LIME, SHAP)
- Document model logic and decision criteria
- Provide business justification for model decisions
- Create model cards with detailed explanations

### Challenge: Data Lineage Tracking

**Problem**: Tracking data flow through complex AI pipelines can be difficult.

**Solution**:
- Implement automated data lineage tools
- Use metadata management systems
- Document data transformation processes
- Maintain data flow diagrams and documentation

### Challenge: Model Versioning and Change Control

**Problem**: Managing multiple model versions and tracking changes.

**Solution**:
- Implement MLOps platforms with version control
- Use automated deployment pipelines
- Maintain change logs and approval records
- Implement rollback and recovery procedures

### Challenge: Third-Party AI Services

**Problem**: Ensuring SOC 2 compliance when using external AI services.

**Solution**:
- Obtain SOC 2 reports from AI service providers
- Implement additional controls for third-party services
- Monitor third-party service performance
- Maintain vendor risk assessments

## Ongoing Compliance Management

### Continuous Monitoring

**Automated Monitoring**
- Real-time control monitoring and alerting
- Automated evidence collection and reporting
- Performance dashboards and metrics
- Exception reporting and investigation

**Regular Assessments**
- Quarterly control effectiveness reviews
- Annual risk assessments and updates
- Vendor assessments and reviews
- Policy and procedure updates

### Training and Awareness

**Staff Training**
- SOC 2 awareness training for all staff
- Role-specific training for control owners
- Regular updates on policy changes
- Incident response training and drills

**Documentation Maintenance**
- Regular policy and procedure reviews
- Documentation updates for system changes
- Version control for all documentation
- Approval workflows for document changes

### Audit Preparation

**Evidence Management**
- Centralized evidence repository
- Automated evidence collection where possible
- Regular evidence reviews and validation
- Audit trail maintenance and documentation

**Auditor Relationship Management**
- Regular communication with auditors
- Proactive issue identification and resolution
- Timely response to auditor requests
- Continuous improvement based on audit feedback

## Benefits of SOC 2 Compliance for AI Organizations

### Business Benefits

**Customer Trust**
- Demonstrates commitment to security and privacy
- Provides competitive advantage in sales processes
- Reduces customer due diligence requirements
- Enables access to enterprise customers

**Risk Management**
- Reduces risk of data breaches and incidents
- Improves operational resilience
- Enhances regulatory compliance posture
- Provides framework for continuous improvement

**Operational Excellence**
- Standardizes processes and procedures
- Improves documentation and knowledge management
- Enhances incident response capabilities
- Promotes culture of security and compliance

### Technical Benefits

**System Reliability**
- Improved monitoring and alerting
- Better change management processes
- Enhanced backup and recovery capabilities
- Reduced system downtime and incidents

**Data Protection**
- Stronger access controls and authentication
- Better data encryption and protection
- Improved data lifecycle management
- Enhanced privacy protection measures

**Model Governance**
- Better model development and deployment processes
- Improved model monitoring and validation
- Enhanced model documentation and explainability
- Stronger model risk management

SOC 2 compliance for AI systems requires careful planning, dedicated resources, and ongoing commitment. However, the benefits in terms of customer trust, risk reduction, and operational excellence make it a worthwhile investment for organizations serious about AI governance and security.`,
    author: 'David Kim',
    publishedDate: '2024-01-03',
    category: 'Compliance',
    readTime: '10 min read',
    featured: false,
    imageUrl: 'https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

const categories = ['All', 'Regulation', 'Best Practices', 'Ethics', 'Technology', 'Business', 'Compliance'];

export function Blog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showFullPost, setShowFullPost] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    
    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setSubscriptionStatus('loading');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      setSubscriptionStatus('success');
      setEmail('');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle');
      }, 3000);
    } catch (error) {
      setSubscriptionStatus('error');
      setEmailError('Failed to subscribe. Please try again.');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubscriptionStatus('idle');
      }, 3000);
    }
  };

  const handleReadMore = (post: BlogPost) => {
    setSelectedPost(post);
    setShowFullPost(true);
  };

  const closeFullPost = () => {
    setShowFullPost(false);
    setSelectedPost(null);
  };

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
              <Link to="/docs" className="text-gray-600 hover:text-gray-900">Docs</Link>
              <Link to="/auth" className="text-gray-600 hover:text-gray-900">Sign In</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">EthicGuard Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Insights, best practices, and the latest developments in AI governance and ethics
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && selectedCategory === 'All' && !searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Article</h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-4">
                    <Badge variant="info">{featuredPost.category}</Badge>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{featuredPost.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{featuredPost.title}</h3>
                  <p className="text-gray-600 mb-6">{featuredPost.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-2" />
                      <span>{featuredPost.author}</span>
                      <Calendar className="h-4 w-4 ml-4 mr-2" />
                      <span>{new Date(featuredPost.publishedDate).toLocaleDateString()}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      icon={ArrowRight}
                      onClick={() => handleReadMore(featuredPost)}
                    >
                      Read More
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Badge variant="info" size="sm">{post.category}</Badge>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-xs text-gray-500">{post.readTime}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.summary}</p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="h-3 w-3 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(post.publishedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  icon={ArrowRight}
                  onClick={() => handleReadMore(post)}
                >
                  Read Article
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or category filter.</p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16">
          <Card className="bg-blue-50 border-blue-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-gray-600 mb-6">
                Get the latest insights on AI governance, compliance, and ethics delivered to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        emailError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={subscriptionStatus === 'loading'}
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1 text-left">{emailError}</p>
                    )}
                  </div>
                  <Button 
                    type="submit"
                    loading={subscriptionStatus === 'loading'}
                    disabled={subscriptionStatus === 'loading'}
                  >
                    {subscriptionStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>
                {subscriptionStatus === 'success' && (
                  <div className="mt-4 flex items-center justify-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">Successfully subscribed! Thank you for joining our newsletter.</span>
                  </div>
                )}
                {subscriptionStatus === 'error' && (
                  <div className="mt-4 flex items-center justify-center text-red-600">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm">Failed to subscribe. Please try again.</span>
                  </div>
                )}
              </form>
            </div>
          </Card>
        </div>
      </div>

      {/* Full Post Modal */}
      {showFullPost && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <Badge variant="info">{selectedPost.category}</Badge>
                <span className="text-sm text-gray-500">{selectedPost.readTime}</span>
              </div>
              <button
                onClick={closeFullPost}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowRight className="h-6 w-6 transform rotate-180" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-64 object-cover"
              />
              
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedPost.title}</h1>
                
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <User className="h-4 w-4 mr-2" />
                  <span>{selectedPost.author}</span>
                  <Calendar className="h-4 w-4 ml-4 mr-2" />
                  <span>{new Date(selectedPost.publishedDate).toLocaleDateString()}</span>
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {selectedPost.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('## ')) {
                      return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
                    } else if (paragraph.startsWith('### ')) {
                      return <h3 key={index} className="text-xl font-semibold text-gray-900 mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
                    } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return <p key={index} className="font-semibold text-gray-900 mt-4 mb-2">{paragraph.replace(/\*\*/g, '')}</p>;
                    } else if (paragraph.trim() === '') {
                      return null;
                    } else {
                      return <p key={index} className="text-gray-700 mb-4 leading-relaxed">{paragraph}</p>;
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}