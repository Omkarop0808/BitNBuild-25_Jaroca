// controllers/analysisController.js
import { PythonShell } from 'python-shell';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from '../models/Product.js';
import { v4 as uuidv4 } from 'uuid';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AnalysisController {
  // Helper function to run Python scripts
  runPythonScript(scriptName, args) {
    return new Promise((resolve, reject) => {
      const options = {
        mode: 'text',
        pythonPath: 'python', // Changed from 'python3' to 'python' for Windows
        pythonOptions: ['-u'],
        scriptPath: path.join(__dirname, '..', 'python-scripts'),
        args: args
      };

      console.log(`Running Python script: ${scriptName} with args:`, args);
      console.log(`Script path: ${options.scriptPath}`);

      PythonShell.run(scriptName, options, (err, results) => {
        if (err) {
          console.error(`Python script error (${scriptName}):`, err);
          reject(err);
        } else {
          try {
            const output = results[results.length - 1];
            const parsedResult = JSON.parse(output);
            resolve(parsedResult);
          } catch (parseError) {
            console.error('Error parsing Python output:', parseError);
            console.log('Raw output:', results);
            reject(parseError);
          }
        }
      });
    });
  }

  // Main analysis function
  async analyzeProduct(req, res) {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ 
          success: false, 
          message: 'Product URL is required' 
        });
      }

      // Validate URL format
      try {
        new URL(url);
      } catch (urlError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid URL format'
        });
      }

      // Generate unique analysis ID
      const analysisId = uuidv4();
      
      // Create initial record
      const analysis = new Product({
        analysis_id: analysisId,
        'product.url': url,
        status: 'processing'
      });
      
      await analysis.save();

      // Return immediate response
      res.json({
        success: true,
        message: 'Analysis started',
        analysis_id: analysisId
      });

      // Continue processing in background
      this.processAnalysisInBackground(analysisId, url);

    } catch (error) {
      console.error('Analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start analysis',
        error: error.message
      });
    }
  }

  async processAnalysisInBackground(analysisId, url) {
    try {
      console.log(`🔄 Starting analysis for: ${url}`);
      
      // Update status
      await Product.findOneAndUpdate(
        { analysis_id: analysisId },
        { 
          status: 'processing',
          'scrape_info.notes': 'Starting product data scraping...'
        }
      );

      // Step 1: Scrape product data
      console.log('🔦 Step 1: Scraping product data...');
      const scrapedData = await this.runPythonScript('scraper.py', [url]);
      
      if (!scrapedData || !scrapedData.success) {
        throw new Error(`Scraping failed: ${scrapedData?.error || 'Unknown error'}`);
      }

      console.log(`✅ Scraped ${scrapedData.reviews?.length || 0} reviews`);

      // Update status
      await Product.findOneAndUpdate(
        { analysis_id: analysisId },
        { 
          'scrape_info.notes': 'Analyzing sentiment...'
        }
      );

      // Step 2: Analyze sentiment
      console.log('🧠 Step 2: Analyzing sentiment...');
      const sentimentData = await this.runPythonScript(
        'sentiment_analyzer.py', 
        [JSON.stringify(scrapedData.reviews)]
      );

      console.log('✅ Sentiment analysis complete');

      // Step 3: Process and structure data
      console.log('📊 Step 3: Processing data...');
      const processedData = this.processAnalysisData(
        scrapedData, 
        sentimentData, 
        url
      );

      // Step 4: Update database
      console.log('💾 Step 4: Saving to database...');
      await Product.findOneAndUpdate(
        { analysis_id: analysisId },
        {
          ...processedData,
          status: 'completed',
          updated_at: new Date()
        }
      );

      console.log('✅ Analysis complete!');

    } catch (error) {
      console.error('Background processing error:', error);
      
      // Update status to failed
      await Product.findOneAndUpdate(
        { analysis_id: analysisId },
        { 
          status: 'failed',
          'scrape_info.notes': `Error: ${error.message}`,
          updated_at: new Date()
        }
      );
    }
  }

  // Get analysis by ID
  async getAnalysis(req, res) {
    try {
      const { id } = req.params;
      
      const analysis = await Product.findOne({ analysis_id: id });
      
      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      }

      res.json({
        success: true,
        data: analysis,
        status: analysis.status
      });

    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analysis'
      });
    }
  }

  // Get recent analyses
  async getRecentAnalyses(req, res) {
    try {
      const analyses = await Product.find()
        .sort({ created_at: -1 })
        .limit(10)
        .select('analysis_id product.name product.url status created_at sentiment_summary');

      res.json({
        success: true,
        data: analyses
      });

    } catch (error) {
      console.error('Get recent analyses error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve recent analyses'
      });
    }
  }

  // Get analysis status
  async getAnalysisStatus(req, res) {
    try {
      const { id } = req.params;
      
      const analysis = await Product.findOne({ analysis_id: id })
        .select('status analysis_id created_at scrape_info');
      
      if (!analysis) {
        return res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      }

      res.json({
        success: true,
        analysis_id: analysis.analysis_id,
        status: analysis.status,
        created_at: analysis.created_at,
        notes: analysis.scrape_info?.notes || ''
      });

    } catch (error) {
      console.error('Get status error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve status'
      });
    }
  }
}

const analysisController = new AnalysisController();
export default analysisController;