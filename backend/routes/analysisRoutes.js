import express from 'express';
import analysisController from '../controllers/analysisController.js';

const router = express.Router();

// POST /api/analyze - Start new analysis
router.post('/analyze', (req, res) => {
  analysisController.analyzeProduct(req, res);
});

// GET /api/analysis/:id - Get specific analysis
router.get('/analysis/:id', (req, res) => {
  analysisController.getAnalysis(req, res);
});

// GET /api/analysis/:id/status - Get analysis status
router.get('/analysis/:id/status', (req, res) => {
  analysisController.getAnalysisStatus(req, res);
});

// GET /api/analyses/recent - Get recent analyses
router.get('/analyses/recent', (req, res) => {
  analysisController.getRecentAnalyses(req, res);
});

export default router;
