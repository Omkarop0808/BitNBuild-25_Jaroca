// ProductSentimentCard.jsx
import React from "react";
import { Star, MessageSquare } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

/**
 * ratingData shape:
 * {
 *   overall: 4.4,
 *   totalReviews: 98,
 *   since: "May 24, 2017",
 *   topReviewerRating: 4.8, // optional
 *   distribution: [ { stars: 5, count: 46, percentage: 60 }, ... ],
 *   sentiment_breakdown: { positive: 85, neutral: 10, negative: 5 },
 *   top_positive_keywords: ["battery","fast","value"],
 *   top_negative_keywords: ["expensive","slow","battery"],
 * }
 */

const ProgressRow = ({ stars, percentage, count }) => (
  <div className="flex items-center mb-2">
    <div className="w-20 text-sm text-gray-600">{stars} stars</div>
    <div className="flex-1 h-3 bg-gray-200 rounded-full mx-3">
      <div className="h-3 bg-teal-600 rounded-full" style={{ width: `${percentage}%` }} />
    </div>
    <div className="w-12 text-sm text-gray-600 flex items-center justify-end">
      <span className="mr-2">{count}</span>
      <MessageSquare className="w-4 h-4 text-gray-400" />
    </div>
  </div>
);

const ProductSentimentCard = ({ ratingData }) => {
  // ratingData expected to follow sampleReviewData shape
  const product = ratingData.product || {};
  const breakdownObj = ratingData.sentiment_summary || {};
  const breakdown = {
    positive: breakdownObj.positive?.percentage ?? 0,
    neutral: breakdownObj.neutral?.percentage ?? 0,
    negative: breakdownObj.negative?.percentage ?? 0
  };

  const positiveKeywords = ratingData.keyword_insights?.positive_keywords || [];
  const negativeKeywords = ratingData.keyword_insights?.negative_keywords || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Customer Sentiment</h2>
          <p className="text-sm text-gray-500">Product reviews overview</p>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{product.overall_rating ?? '-'}</p>
            <div className="flex items-center justify-center mt-1">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-500 ml-2">based on {product.total_reviews_count ?? 0} reviews</span>
            </div>
          </div>

          <div className="text-center px-4">
            <p className="text-sm text-gray-500">Positive</p>
            <p className="text-2xl font-bold text-teal-600">{breakdown.positive}%</p>
          </div>

          <div className="text-center px-4">
            <p className="text-sm text-gray-500">Negative</p>
            <p className="text-2xl font-bold text-rose-500">{breakdown.negative}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Charts - sentiment pie + rating distribution */}
        <div className="col-span-1">
          <div className="p-4 rounded border bg-gray-50">
            <div className="w-full h-44">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Positive', value: breakdown.positive },
                      { name: 'Neutral', value: breakdown.neutral },
                      { name: 'Negative', value: breakdown.negative }
                    ]}
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    <Cell fill="#0F766E" />
                    <Cell fill="#F59E0B" />
                    <Cell fill="#EF4444" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3">
              <p className="text-sm text-gray-600">Rating distribution</p>
              <div className="w-full h-28 mt-2">
                <ResponsiveContainer>
                  <BarChart data={ratingData.rating_distribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stars" tickFormatter={(s) => `${s}★`} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#06B6D4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Middle: Attributes list */}
        <div className="col-span-1 md:col-span-1">
          <div className="p-4 rounded border">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Top attributes</h3>
            <div className="space-y-3">
              {ratingData.attributes?.slice(0, 5).map((attr) => (
                <div key={attr.key} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{attr.displayName}</div>
                    <div className="text-xs text-gray-500">+{attr.positive_count} / -{attr.negative_count}</div>
                  </div>
                  <div className="w-24">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full bg-teal-600" style={{ width: `${attr.score}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right: Keywords & recommended actions */}
        <div className="col-span-1">
          <div className="p-4 rounded border">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Top keywords</h3>
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Positive</p>
              <div className="flex flex-wrap gap-2">
                {positiveKeywords.slice(0, 6).map((k) => (
                  <span key={k.term} className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full text-xs">{k.term}</span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-2">Negative</p>
              <div className="flex flex-wrap gap-2">
                {negativeKeywords.slice(0, 6).map((k) => (
                  <span key={k.term} className="px-2 py-1 bg-rose-50 text-rose-700 rounded-full text-xs">{k.term}</span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium text-gray-900">Recommended</p>
              <ul className="list-disc list-inside text-sm text-gray-600 mt-2">
                {ratingData.dashboard_hints?.recommended_actions?.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Issues + sample reviews */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="p-4 bg-white rounded border">
            <h4 className="text-sm font-medium mb-3">Top Issues</h4>
            <div className="space-y-2 text-sm text-gray-700">
              {ratingData.issues_overview?.most_mentioned?.map((issue) => (
                <div key={issue.issue} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{issue.issue}</div>
                    <div className="text-xs text-gray-500">{issue.mentions} mentions • {issue.percent_of_negatives}% of negatives</div>
                  </div>
                  <div className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded">{issue.mentions}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="p-4 bg-white rounded border">
            <h4 className="text-sm font-medium mb-3">Sample Reviews</h4>
            <div className="space-y-3">
              {ratingData.scraped_reviews_sample?.slice(0, 6).map((r) => (
                <div key={r.id} className="border-b pb-2">
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <div className="font-medium">{r.author}</div>
                    <div className="text-xs text-gray-500">{r.date} • {r.stars}★</div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{r.text}</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {r.extracted_keywords?.map((k, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{k}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSentimentCard;
