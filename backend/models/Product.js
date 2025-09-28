// models/Product.js
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  id: String,
  author: String,
  date: String,
  stars: Number,
  text: String,
  sentiment_label: {
    type: String,
    enum: ['positive', 'negative', 'neutral', 'mixed']
  },
  sentiment_score: Number,
  extracted_keywords: [String],
  detected_attributes: [String]
});

const attributeSchema = new mongoose.Schema({
  key: String,
  displayName: String,
  score: Number,
  positive_count: Number,
  negative_count: Number,
  neutral_count: Number,
  top_positive_phrases: [String],
  top_negative_phrases: [String]
});

const productSchema = new mongoose.Schema({
  // Product basic info
  product: {
    id: String,
    name: String,
    brand: String,
    url: { type: String, required: true },
    source: String,
    scraped_at: { type: Date, default: Date.now },
    price: Number,
    currency: String,
    overall_rating: Number,
    total_reviews_count: Number,
    ratings_updated: String,
    image_url: String
  },
  
  // Sentiment summary
  sentiment_summary: {
    positive: {
      count: Number,
      percentage: Number
    },
    neutral: {
      count: Number,
      percentage: Number
    },
    negative: {
      count: Number,
      percentage: Number
    },
    updated_at: { type: Date, default: Date.now },
    classifier: {
      name: String,
      note: String
    }
  },
  
  // Rating distribution
  rating_distribution: [{
    stars: Number,
    count: Number,
    percentage: Number
  }],
  
  // Attributes analysis
  attributes: [attributeSchema],
  
  // Keywords insights
  keyword_insights: {
    positive_keywords: [{
      term: String,
      count: Number,
      weight: Number
    }],
    negative_keywords: [{
      term: String,
      count: Number,
      weight: Number
    }],
    method: String,
    top_k: Number
  },
  
  // Issues overview
  issues_overview: {
    most_mentioned: [{
      issue: String,
      mentions: Number,
      percent_of_negatives: Number
    }]
  },
  
  // Sample reviews
  scraped_reviews_sample: [reviewSchema],
  
  // Scraping metadata
  scrape_info: {
    pages_scanned: Number,
    reviews_extracted: Number,
    time_seconds: Number,
    user_agent: String,
    notes: String
  },
  
  // Areas for improvement
  areas_improvement: [{
    code: String,
    icon: String,
    title: String,
    subtitle: String
  }],
  
  // Dashboard hints
  dashboard_hints: {
    highlight_positive: String,
    highlight_negative: String,
    recommended_actions: [String]
  },
  
  // Analysis metadata
  analysis_id: { type: String, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
});

// Index for faster queries
productSchema.index({ 'product.url': 1 });
productSchema.index({ analysis_id: 1 });
productSchema.index({ created_at: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;  