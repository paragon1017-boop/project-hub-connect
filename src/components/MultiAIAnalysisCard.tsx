import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, AlertTriangle, CheckCircle, Zap, Brain, Cpu, ChevronDown, ChevronUp } from 'lucide-react';
import { MultiAIResult, ProviderResult } from '@/services/multiAI';
import { format, formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

interface MultiAIAnalysisCardProps {
  result: MultiAIResult | null;
  lastAnalysisTime: Date | null;
  nextAnalysisTime: Date | null;
  isAnalyzing: boolean;
  onRefresh: () => void;
}

const providerConfig = {
  gemini: { name: 'Gemini', icon: Sparkles, color: 'text-blue-600', bg: 'bg-blue-50' },
  groq: { name: 'Groq (Llama)', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
  mistral: { name: 'Mistral', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
};

function ProviderCard({ result, expanded }: { result: ProviderResult | null; expanded: boolean }) {
  if (!result) return null;
  
  const config = providerConfig[result.provider];
  const Icon = config.icon;
  
  return (
    <div className={`rounded-lg p-3 ${result.success ? config.bg : 'bg-gray-100'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${config.color}`} />
          <span className="font-medium text-sm">{config.name}</span>
        </div>
        <div className="flex items-center gap-2">
          {result.success ? (
            <>
              <Badge variant="outline" className="text-xs">
                {result.latency}ms
              </Badge>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </>
          ) : (
            <span className="text-xs text-red-500">{result.error || 'Failed'}</span>
          )}
        </div>
      </div>
      
      {result.success && expanded && (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-gray-700">{result.summary}</p>
          {result.insights.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Key Insights:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                {result.insights.slice(0, 2).map((insight, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="text-gray-400">•</span>
                    {insight.substring(0, 80)}{insight.length > 80 ? '...' : ''}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MultiAIAnalysisCard({
  result,
  lastAnalysisTime,
  nextAnalysisTime,
  isAnalyzing,
  onRefresh,
}: MultiAIAnalysisCardProps) {
  const [showAllProviders, setShowAllProviders] = useState(false);

  if (!result) {
    return (
      <Card className="mb-4 border-dashed border-2 border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex justify-center gap-2 mb-3">
              <Sparkles className="h-6 w-6 text-blue-400" />
              <Zap className="h-6 w-6 text-orange-400" />
              <Brain className="h-6 w-6 text-purple-400" />
            </div>
            <p className="text-sm text-blue-800 mb-3">
              3-AI Ensemble Analysis (Gemini + Groq + Mistral)
            </p>
            <Button 
              onClick={onRefresh}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running 3 AI models...
                </>
              ) : (
                <>
                  <Cpu className="h-4 w-4 mr-2" />
                  Run Multi-AI Analysis
                </>
              )}
            </Button>
            {isAnalyzing && (
              <p className="text-xs text-blue-600 mt-2 animate-pulse">
                Analyzing with Gemini, Groq & Mistral...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const successCount = [result.gemini, result.groq, result.mistral].filter(r => r?.success).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-900">
                3-AI Ensemble Analysis
              </CardTitle>
            </div>
            <Button 
              variant="default" 
              size="sm" 
              onClick={onRefresh}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <Badge variant="outline" className="text-xs">
              {successCount}/3 models succeeded • {result.totalLatency}ms
            </Badge>
            {lastAnalysisTime && (
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(lastAnalysisTime, { addSuffix: true })}
              </span>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Combined Summary */}
          <div className="bg-gradient-to-r from-blue-50 via-orange-50 to-purple-50 border rounded-lg p-4">
            <p className="text-gray-900 font-medium">{result.combined.combinedSummary}</p>
          </div>

          {/* Provider Status Cards */}
          <div className="grid grid-cols-3 gap-2">
            <ProviderCard result={result.gemini} expanded={showAllProviders} />
            <ProviderCard result={result.groq} expanded={showAllProviders} />
            <ProviderCard result={result.mistral} expanded={showAllProviders} />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllProviders(!showAllProviders)}
            className="w-full text-xs"
          >
            {showAllProviders ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
            {showAllProviders ? 'Show Less' : 'Show Individual AI Details'}
          </Button>

          {/* Consensus Insights */}
          {result.combined.consensusInsights.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">
                  AI Consensus ({result.combined.consensusInsights.length} agreed)
                </span>
              </div>
              <ul className="space-y-1">
                {result.combined.consensusInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-green-700">
                    <span className="text-green-500">✓</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Unique Insights by Provider */}
          {showAllProviders && (
            <div className="space-y-2">
              {result.combined.uniqueInsights.gemini.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <span className="text-xs font-semibold text-blue-800">Gemini Unique:</span>
                  <ul className="mt-1 space-y-1">
                    {result.combined.uniqueInsights.gemini.slice(0, 2).map((i, idx) => (
                      <li key={idx} className="text-xs text-blue-700">• {i.substring(0, 100)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.combined.uniqueInsights.groq.length > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <span className="text-xs font-semibold text-orange-800">Groq Unique:</span>
                  <ul className="mt-1 space-y-1">
                    {result.combined.uniqueInsights.groq.slice(0, 2).map((i, idx) => (
                      <li key={idx} className="text-xs text-orange-700">• {i.substring(0, 100)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {result.combined.uniqueInsights.mistral.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <span className="text-xs font-semibold text-purple-800">Mistral Unique:</span>
                  <ul className="mt-1 space-y-1">
                    {result.combined.uniqueInsights.mistral.slice(0, 2).map((i, idx) => (
                      <li key={idx} className="text-xs text-purple-700">• {i.substring(0, 100)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* All Recommendations */}
          {result.combined.allRecommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Combined Recommendations ({result.combined.allRecommendations.length})
              </h4>
              <ul className="space-y-1">
                {result.combined.allRecommendations.slice(0, 5).map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-0.5">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
