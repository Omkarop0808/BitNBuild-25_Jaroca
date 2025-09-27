// src/data/sampleReviewData.js
// Sample data formatted for "Review Radar: Product Sentiment Analyzer"
// Use this as mock data for UI, testing scraping & visualization flows.

const sampleReviewData = {
  product: {
    id: "iphone-14-pro-max-in-2024-mock",
    name: "iPhone 14 Pro Max",
    brand: "Apple",
    url: "https://amazon.in/iphone-14-pro-max",
    source: "amazon.in",
    scraped_at: "2024-05-24T10:12:00+05:30", // ISO timestamp when reviews were scraped
    price: 139900, // mock price in INR (optional)
    currency: "INR",
    overall_rating: 4.4,
    total_reviews_count: 2847,
    ratings_updated: "May 24, 2024"
  },

  // High-level sentiment summary (for pie / metric)
  sentiment_summary: {
    positive: { count: 2420, percentage: 85.0 },
    neutral:  { count: 214,  percentage: 7.5 },
    negative: { count: 213,  percentage: 7.5 },
    updated_at: "2024-05-24T10:12:00+05:30",
    classifier: {
      name: "distilbert-base-uncased-finetuned-sst-2-english",
      note: "example pre-trained classifier used for labeling in this mock dataset"
    }
  },

  // Stars distribution (keeps original structure)
  rating_distribution: [
    { stars: 5, count: 1698, percentage: 59.7 },
    { stars: 4, count: 569,  percentage: 20.0 },
    { stars: 3, count: 285,  percentage: 10.0 },
    { stars: 2, count: 171,  percentage: 6.0 },
    { stars: 1, count: 114,  percentage: 4.0 }
  ],

  // Attribute-level aggregated sentiment (useful for radar / bars)
  attributes: [
    {
      key: "camera",
      displayName: "Camera Quality",
      score: 98, // normalized 0-100
      positive_count: 423,
      negative_count: 12,
      neutral_count: 5,
      top_positive_phrases: ["excellent photos", "night mode", "detail", "video quality"],
      top_negative_phrases: ["overexposed in some scenes", "focus hunts occasionally"]
    },
    {
      key: "display",
      displayName: "Display",
      score: 96,
      positive_count: 389,
      negative_count: 8,
      neutral_count: 4,
      top_positive_phrases: ["bright screen", "smooth scrolling", "true tone"],
      top_negative_phrases: ["reflective under sun"]
    },
    {
      key: "battery",
      displayName: "Battery Life",
      score: 80,
      positive_count: 356,
      negative_count: 45,
      neutral_count: 12,
      top_positive_phrases: ["all day battery", "fast charging"],
      top_negative_phrases: ["drains fast with games", "heats while charging"]
    },
    {
      key: "build",
      displayName: "Build Quality",
      score: 70,
      positive_count: 234,
      negative_count: 89,
      neutral_count: 10,
      top_positive_phrases: ["premium feel", "solid"],
      top_negative_phrases: ["fingerprint magnet", "slippery without case"]
    },
    {
      key: "value",
      displayName: "Price Value",
      score: 54,
      positive_count: 178,
      negative_count: 134,
      neutral_count: 5,
      top_positive_phrases: ["worth premium for camera"],
      top_negative_phrases: ["expensive", "not worth upgrade"]
    },
    {
      key: "ios",
      displayName: "iOS Experience",
      score: 35,
      positive_count: 98,
      negative_count: 267,
      neutral_count: 25,
      top_positive_phrases: ["smooth animations", "timely updates"],
      top_negative_phrases: ["learning curve", "restrictions on customization"]
    },
    {
      key: "storage",
      displayName: "Storage Options",
      score: 30,
      positive_count: 87,
      negative_count: 245,
      neutral_count: 7,
      top_positive_phrases: ["enough for many users (512GB)"],
      top_negative_phrases: ["no expansion", "too expensive upgrade tiers"]
    }
  ],

  // Extracted keywords/topics aggregated from positive and negative reviews
  keyword_insights: {
    positive_keywords: [
      { term: "camera", count: 1580, weight: 0.22 },
      { term: "display", count: 980, weight: 0.14 },
      { term: "battery", count: 780, weight: 0.11 },
      { term: "performance", count: 640, weight: 0.09 },
      { term: "design", count: 512, weight: 0.07 }
    ],
    negative_keywords: [
      { term: "price", count: 720, weight: 0.18 },
      { term: "storage", count: 532, weight: 0.13 },
      { term: "ios restrictions", count: 310, weight: 0.07 },
      { term: "heat", count: 198, weight: 0.05 },
      { term: "fingerprint", count: 145, weight: 0.03 }
    ],
    method: "tf-idf + RAKE (example hybrid)",
    top_k: 10
  },

  // Quick "issues overview" converted from your original example (mapped to product context)
  issues_overview: {
    most_mentioned: [
      { issue: "price", mentions: 720, percent_of_negatives: 34 },
      { issue: "storage limitation", mentions: 532, percent_of_negatives: 25 },
      { issue: "heating", mentions: 198, percent_of_negatives: 9 },
      { issue: "fingerprint attraction", mentions: 145, percent_of_negatives: 7 }
    ]
  },

  // Example set of individual scraped reviews (trimmed). Each review includes:
  // - id (short), text, star rating (if available), sentiment_label, sentiment_score,
  // - extracted_keywords (small list), detected_attributes (which attributes mentioned)
  // Use these for timeline, list views, or sampling in the UI.
  scraped_reviews_sample: [
    {
      id: "r_1001",
      author: "Anita K.",
      date: "2024-05-20",
      stars: 5,
      text: "Camera is insane — low light shots are unbelievable. Battery easily lasts a day for me. Worth the upgrade.",
      sentiment_label: "positive",
      sentiment_score: 0.98,
      extracted_keywords: ["camera", "low light", "battery", "upgrade"],
      detected_attributes: ["camera", "battery"]
    },
    {
      id: "r_1002",
      author: "Ravi S.",
      date: "2024-05-21",
      stars: 4,
      text: "Brilliant display and performance. But the phone gets very warm while gaming.",
      sentiment_label: "mixed",
      sentiment_score: 0.55,
      extracted_keywords: ["display", "performance", "warm", "gaming"],
      detected_attributes: ["display", "performance", "battery"]
    },
    {
      id: "r_1003",
      author: "Priya M.",
      date: "2024-05-22",
      stars: 2,
      text: "Expensive and the base storage is insufficient. Forced to pay extra for higher storage tiers.",
      sentiment_label: "negative",
      sentiment_score: 0.12,
      extracted_keywords: ["expensive", "storage", "price"],
      detected_attributes: ["value", "storage"]
    },
    {
      id: "r_1004",
      author: "Karan P.",
      date: "2024-05-23",
      stars: 5,
      text: "Loving the display and camera. Face ID is super fast. Battery life could be better but still solid.",
      sentiment_label: "positive",
      sentiment_score: 0.92,
      extracted_keywords: ["display", "camera", "face id", "battery"],
      detected_attributes: ["display", "camera", "battery"]
    },
    {
      id: "r_1005",
      author: "Sonia R.",
      date: "2024-05-19",
      stars: 1,
      text: "iOS feels restrictive — can't customize launcher, apps forced into strict layouts. Not a fan.",
      sentiment_label: "negative",
      sentiment_score: 0.08,
      extracted_keywords: ["ios", "restrictive", "customization"],
      detected_attributes: ["ios"]
    },
    {
      id: "r_1006",
      author: "Vipul D.",
      date: "2024-05-18",
      stars: 4,
      text: "Gorgeous screen and very snappy. The price is harsh but you get flagship hardware.",
      sentiment_label: "positive",
      sentiment_score: 0.77,
      extracted_keywords: ["screen", "snappy", "price", "flagship"],
      detected_attributes: ["display", "value", "performance"]
    },
    {
      id: "r_1007",
      author: "Meera L.",
      date: "2024-05-15",
      stars: 3,
      text: "Good phone but overpriced for what you get. Also would love expandable storage.",
      sentiment_label: "mixed",
      sentiment_score: 0.42,
      extracted_keywords: ["overpriced", "expandable storage", "value"],
      detected_attributes: ["value", "storage"]
    },
    {
      id: "r_1008",
      author: "Arjun T.",
      date: "2024-05-10",
      stars: 5,
      text: "Best camera on a phone I have used. Video stabilization is top-notch.",
      sentiment_label: "positive",
      sentiment_score: 0.99,
      extracted_keywords: ["camera", "video stabilization"],
      detected_attributes: ["camera"]
    },
    {
      id: "r_1009",
      author: "Neha G.",
      date: "2024-04-30",
      stars: 2,
      text: "Phone heats quickly during navigation and games. Also, felt overpriced for improvements.",
      sentiment_label: "negative",
      sentiment_score: 0.15,
      extracted_keywords: ["heats", "navigation", "price"],
      detected_attributes: ["battery", "value"]
    },
    {
      id: "r_1010",
      author: "Siddharth V.",
      date: "2024-04-28",
      stars: 4,
      text: "Smooth experience, displays colors beautifully. You'll need a case — slippery.",
      sentiment_label: "positive",
      sentiment_score: 0.81,
      extracted_keywords: ["smooth", "display", "slippery", "case"],
      detected_attributes: ["display", "build"]
    }
  ],

  // Scrape + processing metadata (useful for diagnostics)
  scrape_info: {
    pages_scanned: 12,
    reviews_extracted: 2847,
    time_seconds: 48.2,
    user_agent: "ReviewRadarBot/1.2 (+https://example.org)",
    notes: "This is synthetic/mock data for demo purposes. In production, 'scraped_at' and 'scrape_info' are set per run."
  },

  // Areas of improvement hints for UX or automated actions (friendly strings for the dashboard)
  areas_improvement: [
    {
      code: "missing_accessories",
      icon: "📦",
      title: "Missing Accessories",
      subtitle: "Double-check what's included in the box — some users reported missing chargers/cables."
    },
    {
      code: "delivery_time",
      icon: "⏱️",
      title: "Delivery Time",
      subtitle: "Track orders closely; a subset of reviews mention delayed delivery."
    }
  ],

  // Small helper: top recommended dashboard hints (derived heuristics)
  dashboard_hints: {
    highlight_positive: "Camera & Display — consistently praised; call out examples.",
    highlight_negative: "Price & Storage — surface these to shoppers as top concerns.",
    recommended_actions: [
      "Show 'Top 3 pros' and 'Top 3 cons' on product page",
      "Surface sample negative reviews about storage/pricing in a collapsible panel",
      "Offer quick filter: 'Camera-focused' or 'Battery-focused' reviews"
    ]
  }
};

export default sampleReviewData;
