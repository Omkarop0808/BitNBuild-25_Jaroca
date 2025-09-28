// Dashboard.jsx - Updated version with better error handling
import { useState, useEffect } from 'react';
import sampleReviewData from './sampleReviewData';
import URLInputCard from './URLInputCard';
import ProductSentimentsCard from './ProductSentimentsCard';
import ItemRatingsCard from './ItemRatingsCard';
import AreasImprovementCard from './AreasImprovementCard';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState(sampleReviewData);
  const [analysisId, setAnalysisId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [backendConnected, setBackendConnected] = useState(false);
  
  // Backend URL - Update this if your backend runs on a different port
  const BACKEND_URL = 'http://localhost:5000';

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`, {
        method: 'GET',
        timeout: 5000
      });
      if (response.ok) {
        setBackendConnected(true);
        setStatusMessage('Backend connected successfully');
      }
    } catch (error) {
      setBackendConnected(false);
      setStatusMessage('Backend not connected - using sample data');
    }
  };

  // Poll for analysis results
  useEffect(() => {
    if (analysisId && loading && backendConnected) {
      console.log(`Starting polling for analysis ID: ${analysisId}`);
      const interval = setInterval(async () => {
        try {
          console.log(`Polling for analysis: ${analysisId}`);
          const response = await fetch(`${BACKEND_URL}/api/analysis/${analysisId}`);
          const result = await response.json();
          
          console.log('Polling result:', result);
          
          if (result.success && result.status === 'completed') {
            console.log('Analysis completed, updating data:', result.data);
            setAnalysisData(result.data);
            setLoading(false);
            setStatusMessage('Analysis complete! 🎉');
            setAnalysisId(null);
          } else if (result.status === 'failed') {
            console.log('Analysis failed');
            setLoading(false);
            setStatusMessage(`Analysis failed: ${result.data?.scrape_info?.notes || 'Unknown error'}`);
            setAnalysisId(null);
          } else {
            console.log(`Analysis still processing: ${result.status}`);
            setStatusMessage(`Processing... ${result.data?.scrape_info?.notes || 'This may take a minute.'}`);
          }
        } catch (error) {
          console.error('Polling error:', error);
          setLoading(false);
          setStatusMessage(`Connection lost during analysis: ${error.message}`);
          setAnalysisId(null);
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [analysisId, loading, BACKEND_URL, backendConnected]);

  const handleAnalyze = async (url) => {
    if (!backendConnected) {
      setStatusMessage('Backend not connected - please start the server on port 5000');
      return;
    }

    setLoading(true);
    setStatusMessage('Starting analysis...');
    
    try {
      // Call backend API to start analysis
      const response = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      const result = await response.json();
      
      if (result.success) {
        setAnalysisId(result.analysis_id);
        setStatusMessage('Scraping reviews and analyzing sentiment...');
      } else {
        setLoading(false);
        setStatusMessage(`Failed to start analysis: ${result.message}`);
        console.error('Analysis failed:', result.message);
      }
    } catch (error) {
      console.error('Error calling backend:', error);
      setLoading(false);
      setStatusMessage(`Connection error: ${error.message}. Please check if backend is running on port 5000.`);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-6">
      <URLInputCard onAnalyze={handleAnalyze} loading={loading} />
      
      {/* Connection Status */}
      <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
        backendConnected 
          ? 'bg-green-100 text-green-700' 
          : 'bg-yellow-100 text-yellow-700'
      }`}>
        <div className={`w-3 h-3 rounded-full ${
          backendConnected ? 'bg-green-500' : 'bg-yellow-500'
        }`} />
        <span className="text-sm">
          {backendConnected ? 'Backend connected' : 'Backend disconnected - using sample data'}
        </span>
        {!backendConnected && (
          <button 
            onClick={checkBackendConnection}
            className="text-xs underline hover:no-underline ml-2"
          >
            Retry connection
          </button>
        )}
      </div>
      
      {/* Status Message */}
      {statusMessage && (
        <div className={`mb-4 p-4 rounded-lg ${
          statusMessage.includes('error') || statusMessage.includes('failed') 
            ? 'bg-red-100 text-red-700' 
            : statusMessage.includes('complete')
            ? 'bg-green-100 text-green-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {statusMessage}
        </div>
      )}
      
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