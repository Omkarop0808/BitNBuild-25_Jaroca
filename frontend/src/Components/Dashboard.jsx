import  { useState } from 'react';
import sampleReviewData from './sampleReviewData';
import URLInputCard from './URLInputCard';
import ProductSentimentsCard from './ProductSentimentsCard';
import ItemRatingsCard from './ItemRatingsCard';
import AreasImprovementCard from './AreasImprovementCard';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(sampleReviewData);

  const handleAnalyze = async (url) => {
    setLoading(true);
    // Simulate API call (url is logged for now)
  console.log('Analyzing URL:', url);
    setTimeout(() => {
      setAnalysisData(sampleReviewData);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
  <URLInputCard onAnalyze={handleAnalyze} loading={loading} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main: Product Sentiment Overview (wider) */}
        <div className="lg:col-span-2">
          <ProductSentimentsCard ratingData={analysisData} />
        </div>

        {/* Side: Item Ratings & Areas of Improvement */}
        <div className="lg:col-span-1 space-y-6">
          <ItemRatingsCard data={analysisData} />
          <AreasImprovementCard data={analysisData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;