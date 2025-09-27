import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, MessageSquare } from 'lucide-react';

const ItemRatingsCard = ({ data }) => {
  const [selectedAttr, setSelectedAttr] = useState(null);

  // attributes comes from sampleReviewData.attributes
  const attrs = data.attributes || [];

  const filteredReviews = useMemo(() => {
    if (!selectedAttr) return data.scraped_reviews_sample || [];
    return (data.scraped_reviews_sample || []).filter(r => r.detected_attributes?.includes(selectedAttr));
  }, [selectedAttr, data.scraped_reviews_sample]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Attribute ratings</h3>
        <span className="text-sm text-gray-500">Interactive — click an attribute to filter reviews</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="space-y-3">
            {attrs.map((attr) => (
              <div
                key={attr.key}
                onClick={() => setSelectedAttr(attr.key)}
                className={`p-3 rounded border cursor-pointer hover:bg-gray-50 flex items-center justify-between ${selectedAttr === attr.key ? 'bg-gray-100 border-gray-300' : ''}`}
              >
                <div>
                  <div className="text-sm font-medium">{attr.displayName}</div>
                  <div className="text-xs text-gray-500">+{attr.positive_count} / -{attr.negative_count}</div>
                </div>
                <div className="w-40">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-teal-600" style={{ width: `${attr.score}%` }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1 text-right">{attr.score}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="p-3 rounded border h-full">
            <h4 className="text-sm font-medium mb-3">Sample reviews{selectedAttr ? ` — ${selectedAttr}` : ''}</h4>
            <div className="space-y-3 max-h-72 overflow-auto">
              {filteredReviews.map((r) => (
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

export default ItemRatingsCard;