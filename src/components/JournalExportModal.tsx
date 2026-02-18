import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Sparkles, Loader2, Copy, Check } from 'lucide-react'
import { analyzeNutritionData, AIAnalysisResult } from '@/services/ai'

interface ExportPayload {
  generatedAt: string
  demographics?: any
  program?: {
    name: string
    days: Array<{
      date: string
      calories: number
      protein: number
      carbs: number
      fat: number
      weight?: number
      water?: number
      foods: any[]
      workouts?: any[]
    }>
  }
  day?: {
    date: string
    calories: number
    protein: number
    carbs: number
    fat: number
    weight?: number
    water?: number
    foods: any[]
    workouts?: any[]
  }
}

export default function JournalExportModal({ 
  open, 
  onOpen, 
  payload 
}: { 
  open: boolean
  onOpen: (v: boolean) => void
  payload?: ExportPayload 
}) {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'data' | 'analysis'>('data')

  const runAIAnalysis = async () => {
    if (!payload) return
    
    setLoading(true)
    try {
      // Convert payload to nutrition data format
      let nutritionData: any[] = []
      
      if (payload.program?.days) {
        // Multiple days from program
        nutritionData = payload.program.days.map(day => ({
          date: day.date,
          calories: day.calories,
          protein: day.protein,
          carbs: day.carbs,
          fat: day.fat,
          weight: day.weight,
          water: day.water,
          foods: day.foods || []
        }))
      } else if (payload.day) {
        // Single day
        nutritionData = [{
          date: payload.day.date,
          calories: payload.day.calories,
          protein: payload.day.protein,
          carbs: payload.day.carbs,
          fat: payload.day.fat,
          weight: payload.day.weight,
          water: payload.day.water,
          foods: payload.day.foods || []
        }]
      }

      const result = await analyzeNutritionData(nutritionData)
      setAnalysis(result)
      setActiveTab('analysis')
    } catch (error) {
      console.error('AI Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!payload) return
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const openExternalAI = (url: string) => {
    if (!payload) return
    const text = JSON.stringify(payload, null, 2)
    navigator.clipboard.writeText(text)
    window.open(url, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Export & AI Analysis
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={activeTab === 'data' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('data')}
          >
            Raw Data
          </Button>
          <Button
            variant={activeTab === 'analysis' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('analysis')}
            disabled={!analysis && !loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                AI Analysis
              </>
            )}
          </Button>
        </div>

        {/* Raw Data Tab */}
        {activeTab === 'data' && (
          <div className="space-y-4">
            <div className="py-2">
              <textarea 
                className="w-full h-64 border rounded-lg p-3 font-mono text-xs bg-muted" 
                readOnly 
                value={payload ? JSON.stringify(payload, null, 2) : ''} 
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Nutrition Analysis
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                Get comprehensive insights including macro breakdown, weight trends, hydration status, and personalized recommendations.
              </p>
              <Button 
                onClick={runAIAnalysis} 
                disabled={loading || !payload}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing with Gemini AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze Nutrition Data
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* AI Analysis Tab */}
        {activeTab === 'analysis' && analysis && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-lg text-blue-900 mb-2">Summary</h3>
              <p className="text-blue-800">{analysis.summary}</p>
            </div>

            {/* Insights */}
            {analysis.insights.length > 0 && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  Key Insights
                </h3>
                <ul className="space-y-2">
                  {analysis.insights.map((insight, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-yellow-500 mt-0.5">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Macro Analysis */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Macro Analysis</h3>
              <p className="text-sm text-gray-700">{analysis.macroAnalysis}</p>
            </div>

            {/* Fiber & Sugar Analysis */}
            {analysis.fiberSugarAnalysis && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Fiber & Sugar Analysis</h3>
                <p className="text-sm text-gray-700">{analysis.fiberSugarAnalysis}</p>
              </div>
            )}

            {/* Sodium Analysis */}
            {analysis.sodiumAnalysis && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Sodium Analysis</h3>
                <p className="text-sm text-gray-700">{analysis.sodiumAnalysis}</p>
              </div>
            )}

            {/* Weight Trend */}
            {analysis.weightTrend && analysis.weightTrend !== "No weight data available" && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Weight Trend</h3>
                <p className="text-sm text-gray-700">{analysis.weightTrend}</p>
              </div>
            )}

            {/* Progress Rate */}
            {analysis.progressRate && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Progress Rate</h3>
                <p className="text-sm text-gray-700">{analysis.progressRate}</p>
              </div>
            )}

            {/* Hydration Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Hydration Status</h3>
              <p className="text-sm text-blue-800">{analysis.hydrationStatus}</p>
            </div>

            {/* Meal Frequency & Timing */}
            {analysis.mealFrequency && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Meal Frequency</h3>
                <p className="text-sm text-gray-700">{analysis.mealFrequency}</p>
              </div>
            )}

            {analysis.mealTiming && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Meal Patterns</h3>
                <p className="text-sm text-gray-700">{analysis.mealTiming}</p>
              </div>
            )}

            {/* Protein Distribution */}
            {analysis.proteinDistribution && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Protein Distribution</h3>
                <p className="text-sm text-gray-700">{analysis.proteinDistribution}</p>
              </div>
            )}

            {/* Food Variety Score */}
            {analysis.foodVarietyScore && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Food Variety Score</h3>
                <p className="text-sm text-gray-700">{analysis.foodVarietyScore}</p>
              </div>
            )}

            {/* Calorie Cycling */}
            {analysis.calorieCycling && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Calorie Cycling</h3>
                <p className="text-sm text-gray-700">{analysis.calorieCycling}</p>
              </div>
            )}

            {/* Weekend vs Weekday */}
            {analysis.weekendVsWeekday && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Weekend vs Weekday</h3>
                <p className="text-sm text-gray-700">{analysis.weekendVsWeekday}</p>
              </div>
            )}

            {/* Goal Adherence */}
            {analysis.goalAdherence && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Goal Adherence</h3>
                <p className="text-sm text-gray-700">{analysis.goalAdherence}</p>
              </div>
            )}

            {/* Binge/Restrict Patterns */}
            {analysis.bingeRestrictPatterns && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Binge/Restrict Patterns</h3>
                <p className="text-sm text-gray-700">{analysis.bingeRestrictPatterns}</p>
              </div>
            )}

            {/* TDEE Estimation */}
            {analysis.tdeeEstimation && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">TDEE Estimation</h3>
                <p className="text-sm text-gray-700">{analysis.tdeeEstimation}</p>
              </div>
            )}

            {/* Nutrient Timing */}
            {analysis.nutrientTiming && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Nutrient Timing</h3>
                <p className="text-sm text-gray-700">{analysis.nutrientTiming}</p>
              </div>
            )}

            {/* Exercise Correlation */}
            {analysis.exerciseCorrelation && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Exercise Correlation</h3>
                <p className="text-sm text-gray-700">{analysis.exerciseCorrelation}</p>
              </div>
            )}

            {/* Consistency Score */}
            {analysis.consistencyScore && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Consistency Score</h3>
                <p className="text-sm text-gray-700">{analysis.consistencyScore}</p>
              </div>
            )}

            {/* Deficiency Warnings */}
            {analysis.deficiencyWarnings && analysis.deficiencyWarnings.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Deficiency Warnings
                </h3>
                <ul className="space-y-2">
                  {analysis.deficiencyWarnings.map((warning, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                      <span className="text-red-600 mt-0.5">⚠</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weekly Comparison */}
            {analysis.weeklyComparison && (
              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Weekly Comparison</h3>
                <p className="text-sm text-gray-700">{analysis.weeklyComparison}</p>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Recommendations
                </h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                      <span className="text-green-600 mt-0.5">✓</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {analysis.improvements.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Areas to Improve
                </h3>
                <ul className="space-y-2">
                  {analysis.improvements.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-orange-800">
                      <span className="text-orange-600 mt-0.5">→</span>
                      {imp}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex-wrap gap-2">
          <Button variant="outline" onClick={() => onOpen(false)}>
            Close
          </Button>
          
          {activeTab === 'data' && (
            <>
              <Button 
                variant="outline" 
                onClick={copyToClipboard}
                className="gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Data'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => openExternalAI('https://chatgpt.com/')}
                className="gap-2"
              >
                Open ChatGPT
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => openExternalAI('https://claude.ai/')}
                className="gap-2"
              >
                Open Claude
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => openExternalAI('https://grok.com/')}
                className="gap-2"
              >
                Open Grok
              </Button>
            </>
          )}
          
          {activeTab === 'analysis' && analysis && (
            <Button 
              variant="outline" 
              onClick={() => {
                const text = `Nutrition Analysis Summary:\n\n${analysis.summary}\n\nInsights:\n${analysis.insights.join('\n')}\n\nRecommendations:\n${analysis.recommendations.join('\n')}`
                navigator.clipboard.writeText(text)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="gap-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Analysis'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
