import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Database, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Play, 
  Pause, 
  Eye, 
  Filter,
  Search,
  RefreshCw,
  FileJson,
  FileSpreadsheet,
  Trash2,
  Info,
  X,
  ArrowLeft
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

interface AnalysisResult {
  id: string;
  originalText: string;
  riskScores: {
    toxicity: number;
    bias: number;
    hallucination: number;
    pii: number;
  };
  violations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
  confidence: number;
  suggestedFix?: string;
}

interface DatasetAnalysis {
  id: string;
  fileName: string;
  uploadTime: string;
  totalRecords: number;
  processedRecords: number;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  results: AnalysisResult[];
  summary: {
    totalViolations: number;
    blockedContent: number;
    avgRiskScore: number;
    topViolations: { type: string; count: number }[];
  };
}

export function BatchAnalysis() {
  const [uploadedDatasets, setUploadedDatasets] = useState<DatasetAnalysis[]>([
    {
      id: 'dataset_001',
      fileName: 'customer_support_logs.csv',
      uploadTime: '2024-01-15T14:30:00Z',
      totalRecords: 1250,
      processedRecords: 1250,
      status: 'completed',
      results: [],
      summary: {
        totalViolations: 89,
        blockedContent: 34,
        avgRiskScore: 23,
        topViolations: [
          { type: 'Toxic Content', count: 45 },
          { type: 'PII Exposure', count: 28 },
          { type: 'Bias Detection', count: 16 }
        ]
      }
    },
    {
      id: 'dataset_002',
      fileName: 'chatbot_responses.json',
      uploadTime: '2024-01-15T10:15:00Z',
      totalRecords: 856,
      processedRecords: 856,
      status: 'completed',
      results: [],
      summary: {
        totalViolations: 156,
        blockedContent: 67,
        avgRiskScore: 31,
        topViolations: [
          { type: 'Bias Detection', count: 78 },
          { type: 'Toxic Content', count: 45 },
          { type: 'Medical Advice', count: 33 }
        ]
      }
    }
  ]);
  const [currentDataset, setCurrentDataset] = useState<DatasetAnalysis | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState<AnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock analysis function - in production this would call the AI detection service
  const analyzeContent = (text: string): AnalysisResult => {
    const toxicity = Math.random() * 100;
    const bias = Math.random() * 100;
    const hallucination = Math.random() * 100;
    const pii = Math.random() * 100;
    
    const violations = [];
    if (toxicity > 70) violations.push('Toxic Content');
    if (bias > 60) violations.push('Bias Detection');
    if (hallucination > 65) violations.push('Hallucination');
    if (pii > 80) violations.push('PII Exposure');
    
    const maxRisk = Math.max(toxicity, bias, hallucination, pii);
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (maxRisk > 90) severity = 'critical';
    else if (maxRisk > 75) severity = 'high';
    else if (maxRisk > 50) severity = 'medium';
    
    return {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      originalText: text,
      riskScores: {
        toxicity: Math.round(toxicity),
        bias: Math.round(bias),
        hallucination: Math.round(hallucination),
        pii: Math.round(pii)
      },
      violations,
      severity,
      blocked: maxRisk > 70,
      confidence: Math.round(80 + Math.random() * 15),
      suggestedFix: violations.length > 0 ? 'Consider revising content to address detected issues.' : undefined
    };
  };

  const processFile = async (file: File) => {
    try {
      setUploadProgress(0);
      setIsProcessing(true);

      const text = await file.text();
      let data: any[] = [];

      // Parse file based on type
      if (file.name.toLowerCase().endsWith('.json')) {
        try {
          const jsonData = JSON.parse(text);
          data = Array.isArray(jsonData) ? jsonData : [jsonData];
        } catch (error) {
          throw new Error('Invalid JSON format');
        }
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          throw new Error('CSV file must have at least a header and one data row');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        data = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] || '';
          });
          return obj;
        });
      } else {
        throw new Error('Unsupported file format. Please upload CSV or JSON files.');
      }

      if (data.length === 0) {
        throw new Error('No data found in file');
      }

      // Create new dataset
      const newDataset: DatasetAnalysis = {
        id: `dataset_${Date.now()}`,
        fileName: file.name,
        uploadTime: new Date().toISOString(),
        totalRecords: data.length,
        processedRecords: 0,
        status: 'processing',
        results: [],
        summary: {
          totalViolations: 0,
          blockedContent: 0,
          avgRiskScore: 0,
          topViolations: []
        }
      };

      setCurrentDataset(newDataset);

      // Process data in batches
      const batchSize = 5;
      const results: AnalysisResult[] = [];
      
      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        
        for (const item of batch) {
          // Extract text content from various possible fields
          const textContent = item.text || item.content || item.response || item.output || 
                             item.message || item.prompt || item.description || 
                             Object.values(item).find(val => typeof val === 'string' && val.length > 10) ||
                             JSON.stringify(item);
          
          if (textContent && typeof textContent === 'string' && textContent.trim().length > 0) {
            const result = analyzeContent(textContent.trim());
            results.push(result);
          }
          
          // Update progress
          const processed = Math.min(results.length, data.length);
          const progressPercent = (processed / data.length) * 100;
          setUploadProgress(progressPercent);
          
          // Update dataset
          setCurrentDataset(prev => prev ? {
            ...prev,
            processedRecords: processed,
            results: [...results]
          } : null);
        }
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Calculate summary
      const violations = results.reduce((sum, r) => sum + r.violations.length, 0);
      const blocked = results.filter(r => r.blocked).length;
      const avgRisk = results.length > 0 ? results.reduce((sum, r) => {
        const maxRisk = Math.max(...Object.values(r.riskScores));
        return sum + maxRisk;
      }, 0) / results.length : 0;

      const violationCounts: { [key: string]: number } = {};
      results.forEach(r => {
        r.violations.forEach(v => {
          violationCounts[v] = (violationCounts[v] || 0) + 1;
        });
      });

      const topViolations = Object.entries(violationCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Final update
      const completedDataset = {
        ...newDataset,
        status: 'completed' as const,
        results,
        summary: {
          totalViolations: violations,
          blockedContent: blocked,
          avgRiskScore: Math.round(avgRisk),
          topViolations
        }
      };

      setCurrentDataset(completedDataset);
      
      // Add to uploaded datasets list
      setUploadedDatasets(prev => [completedDataset, ...prev]);

      setIsProcessing(false);
      setUploadProgress(100);

    } catch (error) {
      console.error('Error processing file:', error);
      setIsProcessing(false);
      setCurrentDataset(prev => prev ? { ...prev, status: 'failed' } : null);
      alert(`Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv') && !file.name.toLowerCase().endsWith('.json')) {
      alert('Please select a CSV or JSON file');
      return;
    }

    processFile(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, []);

  const handleResultClick = (result: AnalysisResult) => {
    setSelectedResult(result);
    setShowResultModal(true);
  };

  const handleDeleteDataset = (datasetId: string) => {
    setUploadedDatasets(prev => prev.filter(d => d.id !== datasetId));
    if (currentDataset?.id === datasetId) {
      setCurrentDataset(null);
    }
  };

  const exportResults = (dataset: DatasetAnalysis) => {
    const exportData = {
      dataset: {
        fileName: dataset.fileName,
        uploadTime: dataset.uploadTime,
        totalRecords: dataset.totalRecords,
        summary: dataset.summary
      },
      results: dataset.results.map(r => ({
        originalText: r.originalText.substring(0, 100) + '...', // Truncate for privacy
        riskScores: r.riskScores,
        violations: r.violations,
        severity: r.severity,
        blocked: r.blocked,
        confidence: r.confidence
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analysis-results-${dataset.fileName}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearCurrentDataset = () => {
    setCurrentDataset(null);
    setUploadProgress(0);
    setIsProcessing(false);
    setFilterSeverity('all');
    setSearchTerm('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'failed': return 'error';
      default: return 'neutral';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'neutral';
      default: return 'neutral';
    }
  };

  const filteredResults = currentDataset?.results.filter(result => {
    const matchesSeverity = filterSeverity === 'all' || result.severity === filterSeverity;
    const matchesSearch = searchTerm === '' || 
      result.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.violations.some(v => v.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSeverity && matchesSearch;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Analysis Dashboard</h1>
          <p className="text-gray-600 mt-1">Upload and analyze CSV/JSON datasets for AI compliance violations</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => window.location.href = '/ai-governance'} icon={ArrowLeft}>
            Back to AI Governance
          </Button>
        </div>
      </div>

      {/* Uploaded Datasets List */}
      {uploadedDatasets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Datasets ({uploadedDatasets.length})</CardTitle>
            <p className="text-sm text-gray-600">Previously uploaded and analyzed datasets</p>
          </CardHeader>
          <div className="space-y-3">
            {uploadedDatasets.map((dataset) => (
              <div key={dataset.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Database className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{dataset.fileName}</p>
                    <p className="text-sm text-gray-600">
                      {dataset.totalRecords.toLocaleString()} records • {dataset.summary.totalViolations} violations • {new Date(dataset.uploadTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <Badge variant={getStatusColor(dataset.status) as any} size="sm">
                      {dataset.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {dataset.summary.blockedContent} blocked • {dataset.summary.avgRiskScore}% avg risk
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCurrentDataset(dataset)} icon={Eye}>
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportResults(dataset)} icon={Download}>
                    Export
                  </Button>
                  <button
                    onClick={() => handleDeleteDataset(dataset.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete dataset"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Upload Area */}
      {!currentDataset && (
        <Card>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload New Dataset for Analysis
            </h3>
            <p className="text-gray-600 mb-6">
              Drag and drop your CSV or JSON file here, or click to browse
            </p>
            <div className="flex justify-center space-x-4 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>CSV Files</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FileJson className="h-4 w-4 text-blue-600" />
                <span>JSON Files</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              disabled={isProcessing}
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              icon={Upload}
            >
              {isProcessing ? 'Processing...' : 'Choose File'}
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: CSV, JSON • Max file size: 10MB
            </p>
          </div>
        </Card>
      )}

      {/* Upload Progress */}
      {isProcessing && currentDataset && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Processing Dataset</h3>
                <p className="text-sm text-gray-600">{currentDataset.fileName}</p>
              </div>
              <Badge variant={getStatusColor(currentDataset.status) as any}>
                {currentDataset.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Analyzing records: {currentDataset.processedRecords}/{currentDataset.totalRecords}
              </span>
              <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        </Card>
      )}

      {/* Current Dataset Analysis Results */}
      {currentDataset && currentDataset.status === 'completed' && (
        <div className="space-y-6">
          {/* Dataset Header */}
          <Card>
            <div className="flex items-center justify-between p-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{currentDataset.fileName}</h2>
                <p className="text-gray-600">
                  Uploaded {new Date(currentDataset.uploadTime).toLocaleString()} • {currentDataset.totalRecords.toLocaleString()} records analyzed
                </p>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => exportResults(currentDataset)} icon={Download}>
                  Export Results
                </Button>
                <Button variant="outline" onClick={clearCurrentDataset} icon={X}>
                  Close Analysis
                </Button>
              </div>
            </div>
          </Card>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-gray-900">
                {currentDataset.totalRecords}
              </div>
              <div className="text-sm text-gray-600">Total Records</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-red-600">
                {currentDataset.summary.totalViolations}
              </div>
              <div className="text-sm text-gray-600">Violations</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-orange-600">
                {currentDataset.summary.blockedContent}
              </div>
              <div className="text-sm text-gray-600">Blocked</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">
                {currentDataset.summary.avgRiskScore}%
              </div>
              <div className="text-sm text-gray-600">Avg Risk</div>
            </Card>
          </div>

          {/* Top Violations */}
          {currentDataset.summary.topViolations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Violations</CardTitle>
              </CardHeader>
              <div className="space-y-2">
                {currentDataset.summary.topViolations.map((violation, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{violation.type}</span>
                    <Badge variant="warning">{violation.count} occurrences</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Filters and Search */}
          <Card>
            <div className="flex flex-col sm:flex-row gap-4 p-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </Card>

          {/* Results List */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results ({filteredResults.length})</CardTitle>
            </CardHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredResults.map((result) => (
                <div 
                  key={result.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                        {result.originalText.substring(0, 150)}...
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {result.violations.map((violation, index) => (
                          <Badge key={index} variant="warning" size="sm">
                            {violation}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Badge variant={getSeverityColor(result.severity) as any}>
                        {result.severity}
                      </Badge>
                      <Badge variant={result.blocked ? 'error' : 'info'}>
                        {result.blocked ? 'Blocked' : 'Flagged'}
                      </Badge>
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Confidence: {result.confidence}%</span>
                    <span>
                      Risk: {Math.max(...Object.values(result.riskScores))}%
                    </span>
                  </div>
                </div>
              ))}
              
              {filteredResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No results match your filters</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Failed State */}
      {currentDataset && currentDataset.status === 'failed' && (
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing Failed</h3>
            <p className="text-gray-600 mb-4">
              There was an error processing your dataset. Please check the file format and try again.
            </p>
            <Button onClick={clearCurrentDataset} variant="outline">
              Try Again
            </Button>
          </div>
        </Card>
      )}

      {/* Result Detail Modal */}
      {showResultModal && selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Analysis Result Details</h2>
              <button
                onClick={() => setShowResultModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Original Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Original Content</h3>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedResult.originalText}</p>
                </div>
              </div>

              {/* Risk Scores */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Scores</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(selectedResult.riskScores).map(([type, score]) => (
                    <div key={type} className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900">{score}%</div>
                      <div className="text-sm text-gray-600 capitalize">{type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Violations */}
              {selectedResult.violations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Detected Violations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedResult.violations.map((violation, index) => (
                      <Badge key={index} variant="warning">
                        {violation}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action and Suggestions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Action Taken</h4>
                  <div className={`p-3 rounded-lg ${selectedResult.blocked ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <p className="text-sm">
                      Content was {selectedResult.blocked ? 'blocked' : 'flagged'} due to policy violations.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Confidence</h4>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm">Detection confidence: {selectedResult.confidence}%</p>
                  </div>
                </div>
              </div>

              {selectedResult.suggestedFix && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Suggested Fix</h4>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm">{selectedResult.suggestedFix}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setShowResultModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}