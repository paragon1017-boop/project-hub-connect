import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, RefreshCw, AlertTriangle, CheckCircle, TrendingUp, Droplets, Utensils, Dumbbell, Apple, Coffee, Zap, Brain } from 'lucide-react';
import { AIAnalysisResult } from '@/services/ai';
import { format, formatDistanceToNow } from 'date-fns';

interface AutoAIAnalysisCardProps {
  analysis: AIAnalysisResult | null;
  lastAnalysisTime: Date | null;
  nextAnalysisTime: Date | null;
  isAnalyzing: boolean;
  onRefresh: () => void;
  compact?: boolean;
  provider?: 'gemini' | 'groq' | 'mistral';
}

const providerConfig = {
  gemini: { name: 'Gemini', icon: Sparkles, color: 'blue', borderColor: 'border-blue-200', bgColor: 'bg-blue-50/50' },
  groq: { name: 'Groq', icon: Zap, color: 'orange', borderColor: 'border-orange-200', bgColor: 'bg-orange-50/50' },
  mistral: { name: 'Mistral', icon: Brain, color: 'purple', borderColor: 'border-purple-200', bgColor: 'bg-purple-50/50' },
};

export default function AutoAIAnalysisCard({
  analysis,
  lastAnalysisTime,
  nextAnalysisTime,
  isAnalyzing,
  onRefresh,
  compact = false,
  provider = 'gemini'
}: AutoAIAnalysisCardProps) {
  const config = providerConfig[provider];
  const ProviderIcon = config.icon;
  const colorClass = `text-${config.color}-600`;
  const borderClass = config.borderColor;
  const bgClass = config.bgColor;

  if (!analysis) {
    return (
      <Card className={`mb-4 border-dashed border-2 ${borderClass} ${bgClass}`}>
        <CardContent className="pt-6">
          <div className="text-center">
            <ProviderIcon className={`h-8 w-8 mx-auto mb-2 ${colorClass}`} />
            <p className="text-sm text-gray-700 mb-3">
              {config.name} AI will analyze your nutrition and workout data
            </p>
            <Button 
              onClick={() => {
                console.log('Analyze Now clicked');
                onRefresh();
              }}
              disabled={isAnalyzing}
              className={`bg-${config.color}-600 hover:bg-${config.color}-700`}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <ProviderIcon className="h-4 w-4 mr-2" />
                  Analyze with {config.name}
                </>
              )}
            </Button>
            {isAnalyzing && (
              <p className={`text-xs ${colorClass} mt-2 animate-pulse`}>
                This may take 10-20 seconds...
              </p>
            )}
            {nextAnalysisTime && (
              <p className={`text-xs ${colorClass} mt-3`}>
                Next auto-analysis: {format(nextAnalysisTime, 'h:mm a')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={`mb-4 ${borderClass} bg-gradient-to-r from-${config.color}-50 to-indigo-50`}>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ProviderIcon className={`h-5 w-5 ${colorClass}`} />
              <div>
                <p className="font-semibold text-sm">{config.name} Analysis Updated</p>
                <p className="text-xs text-gray-600">
                  {lastAnalysisTime && formatDistanceToNow(lastAnalysisTime, { addSuffix: true })}
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Analyze
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-3 p-3 bg-white/70 rounded-lg">
            <p className="text-sm text-gray-800 line-clamp-2">{analysis.summary}</p>
          </div>

          {analysis.deficiencyWarnings && analysis.deficiencyWarnings.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-xs text-amber-700">
                {analysis.deficiencyWarnings.length} warning{analysis.deficiencyWarnings.length > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`mb-6 ${borderClass}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ProviderIcon className={`h-5 w-5 ${colorClass}`} />
            <CardTitle className={`text-lg ${colorClass}`}>{config.name} Analysis</CardTitle>
          </div>
          <Button 
            variant="default" 
            size="sm" 
            onClick={onRefresh}
            disabled={isAnalyzing}
            className={`bg-${config.color}-600 hover:bg-${config.color}-700`}
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <ProviderIcon className="h-4 w-4 mr-1" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          {lastAnalysisTime && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Last: {formatDistanceToNow(lastAnalysisTime, { addSuffix: true })}
            </Badge>
          )}
          {nextAnalysisTime && (
            <p className={`text-xs ${colorClass}`}>
              Next auto: {format(nextAnalysisTime, 'h:mm a')}
            </p>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-900 font-medium">{analysis.summary}</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {analysis.macroAnalysis && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Utensils className="h-4 w-4 text-gray-600" />
                <span className="text-xs font-semibold text-gray-700">Macros</span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{analysis.macroAnalysis}</p>
            </div>
          )}
          
          {analysis.hydrationStatus && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-semibold text-blue-700">Hydration</span>
              </div>
              <p className="text-xs text-blue-600 line-clamp-2">{analysis.hydrationStatus}</p>
            </div>
          )}
          
          {analysis.consistencyScore && (
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs font-semibold text-green-700">Consistency</span>
              </div>
              <p className="text-xs text-green-600">{analysis.consistencyScore}</p>
            </div>
          )}
          
          {analysis.weightTrend && analysis.weightTrend !== "No weight data available" && (
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="text-xs font-semibold text-purple-700">Weight</span>
              </div>
              <p className="text-xs text-purple-600 line-clamp-2">{analysis.weightTrend}</p>
            </div>
          )}
        </div>

        {/* Warnings */}
        {analysis.deficiencyWarnings && analysis.deficiencyWarnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">Attention Needed</span>
            </div>
            <ul className="space-y-1">
              {analysis.deficiencyWarnings.slice(0, 2).map((warning, i) => (
                <li key={i} className="text-xs text-amber-700">{warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Top Recommendations */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Top Recommendations</h4>
            <ul className="space-y-1">
              {analysis.recommendations.slice(0, 3).map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-600 mt-0.5">✓</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Insights Preview */}
        {analysis.insights && analysis.insights.length > 0 && (
          <div className="pt-3 border-t">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Insights</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.insights.slice(0, 3).map((insight, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {insight.substring(0, 50)}{insight.length > 50 ? '...' : ''}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Workout Review */}
        {analysis.workoutReview && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Dumbbell className="h-4 w-4 text-orange-600" />
              <h4 className="text-sm font-semibold text-gray-900">Workout Review</h4>
            </div>
            <p className="text-sm text-gray-700 mb-2">{analysis.workoutReview}</p>
            
            {analysis.workoutStrengths && analysis.workoutStrengths.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-green-700 mb-1">Strengths</p>
                <ul className="space-y-1">
                  {analysis.workoutStrengths.filter(s => s && s !== 'N/A').slice(0, 2).map((strength, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-green-600">+</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {analysis.workoutImprovements && analysis.workoutImprovements.length > 0 && (
              <div>
                <p className="text-xs font-medium text-amber-700 mb-1">Areas to Improve</p>
                <ul className="space-y-1">
                  {analysis.workoutImprovements.filter(s => s && s !== 'N/A').slice(0, 2).map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-amber-600">→</span>
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Meal Suggestions */}
        {analysis.mealSuggestions && analysis.mealSuggestions.length > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Utensils className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-semibold text-gray-900">Meal Ideas</h4>
            </div>
            <ul className="space-y-1">
              {analysis.mealSuggestions.slice(0, 3).map((meal, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                  <Apple className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />
                  {meal}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Pre/Post Workout Meals */}
        {(analysis.preWorkoutMeals?.length > 0 || analysis.postWorkoutMeals?.length > 0) && (
          <div className="pt-3 border-t">
            <div className="grid grid-cols-2 gap-3">
              {analysis.preWorkoutMeals && analysis.preWorkoutMeals.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-2">
                    <Coffee className="h-3 w-3 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-800">Pre-Workout</span>
                  </div>
                  <ul className="space-y-1">
                    {analysis.preWorkoutMeals.slice(0, 2).map((meal, i) => (
                      <li key={i} className="text-xs text-amber-700">{meal}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {analysis.postWorkoutMeals && analysis.postWorkoutMeals.length > 0 && (
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-2">
                    <Utensils className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-semibold text-green-800">Post-Workout</span>
                  </div>
                  <ul className="space-y-1">
                    {analysis.postWorkoutMeals.slice(0, 2).map((meal, i) => (
                      <li key={i} className="text-xs text-green-700">{meal}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
