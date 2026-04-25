import FormattedText from './FormattedText';
import type { PdfAnalysis } from '../types';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';

interface AnswerBoxProps {
  answer: string;
  analysis: PdfAnalysis | null;
}

export default function AnswerBox({ answer, analysis }: AnswerBoxProps) {

  const percentageColors = ['#2563eb', '#7c3aed', '#14b8a6', '#f59e0b'];
  const formatPercent = (value: unknown) => `${Number(value ?? 0).toFixed(2)}%`;

  const metrics = analysis ? [
    { label: 'Summary Coverage', value: `${analysis.summary_coverage_percent}%` },
    { label: 'Compression', value: `${analysis.compression_percent}%` },
    { label: 'Legal Relevance', value: `${analysis.legal_relevance_percent}%` },
  ] : [];

  const coveragePieData = analysis ? [
    { name: 'Summary Coverage', value: Number(analysis.summary_coverage_percent.toFixed(2)) },
    { name: 'Compressed Content', value: Number(analysis.compression_percent.toFixed(2)) },
  ] : [];

  const factorsBarData = analysis
    ? analysis.important_factors.map((factor) => ({
      name: factor.name,
      score: Number(factor.score_percent.toFixed(2)),
    }))
    : [];

  const radialMetricData = analysis
    ? [
      {
        name: 'Legal Relevance',
        value: Number(analysis.legal_relevance_percent.toFixed(2)),
        fill: '#0d9488',
      },
    ]
    : [];

  return (
    <div className="w-full flex justify-center">
      <div className="w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-lg dark:shadow-black/30 space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <span className="text-2xl animate-pulse">✅</span>
          <h2 className="text-gray-900 dark:text-white font-semibold text-lg">Legal Analysis Result</h2>
        </div>

        <div className="space-y-4">
          {analysis && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-blue-200 dark:border-cyan-800 bg-blue-50/70 dark:bg-cyan-900/20 p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-300">{metric.label}</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-cyan-300">{metric.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Visual Analytics</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Coverage vs Compressed (Pie Chart)</p>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={coveragePieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={74}
                            label={(entry) => `${entry.value}%`}
                          >
                            {coveragePieData.map((entry, index) => (
                              <Cell key={entry.name} fill={percentageColors[index % percentageColors.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatPercent(value)} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3">
                    <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Legal Relevance (Radial Chart)</p>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          innerRadius="55%"
                          outerRadius="95%"
                          data={radialMetricData}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                          <RadialBar
                            background
                            dataKey="value"
                            cornerRadius={8}
                            label={{ position: 'insideStart', fill: '#fff', formatter: (value) => formatPercent(value) }}
                          />
                          <Legend />
                          <Tooltip formatter={(value) => formatPercent(value)} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-3 mt-4">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Important Factors Comparison (Bar Chart)</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={factorsBarData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => formatPercent(value)} />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                          {factorsBarData.map((entry, index) => (
                            <Cell key={`factor-${entry.name}`} fill={percentageColors[index % percentageColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Word Count</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.document_stats.word_count}</p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Character Count</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.document_stats.character_count}</p>
                </div>
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-xs text-gray-600 dark:text-gray-300">Estimated Read Time</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{analysis.document_stats.estimated_reading_minutes} min</p>
                </div>
              </div>

              <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Important Project Factors</p>
                <div className="space-y-2">
                  {analysis.important_factors.map((factor) => (
                    <div key={factor.name} className="rounded-md bg-gray-50 dark:bg-gray-800 px-3 py-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{factor.name}: {factor.score_percent}%</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.top_keywords.length > 0 && (
                <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Top Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.top_keywords.map((word) => (
                      <span key={word} className="text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-200 px-2 py-1 rounded-full">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <FormattedText text={answer} />
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm sticky bottom-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <span>💡</span>
          <p>Analysis complete</p>
        </div>
      </div>
    </div>
  );
}