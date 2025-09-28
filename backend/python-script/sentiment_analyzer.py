#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import json
import warnings
import re
from collections import Counter

warnings.filterwarnings('ignore')

# Import required packages with error handling
try:
    from transformers import pipeline
    TRANSFORMERS_AVAILABLE = True
except ImportError:
    TRANSFORMERS_AVAILABLE = False

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

try:
    import nltk
    from nltk.corpus import stopwords
    NLTK_AVAILABLE = True
    
    # Download required NLTK data
    for resource in ['punkt', 'stopwords']:
        try:
            nltk.data.find(f'tokenizers/{resource}' if resource == 'punkt' else f'corpora/{resource}')
        except LookupError:
            nltk.download(resource, quiet=True)
            
except ImportError:
    NLTK_AVAILABLE = False


class SentimentAnalyzer:
    def __init__(self):
        self.sentiment_pipeline = None
        self.setup_sentiment_model()
        self.setup_stopwords()
        self.setup_product_attributes()

    def setup_sentiment_model(self):
        """Initialize Hugging Face sentiment analysis model"""
        if not TRANSFORMERS_AVAILABLE:
            print("Transformers not available. Install with: pip install transformers torch", file=sys.stderr)
            return

        try:
            print("Loading Hugging Face sentiment model...", file=sys.stderr)
            # Using a robust sentiment model
            self.sentiment_pipeline = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest",
                device=-1,  # Use CPU
                truncation=True,
                max_length=512
            )
            print("Sentiment model loaded successfully", file=sys.stderr)
            
        except Exception as e:
            print(f"Failed to load Hugging Face model: {e}", file=sys.stderr)
            print("Falling back to rule-based sentiment analysis", file=sys.stderr)
            self.sentiment_pipeline = None

    def setup_stopwords(self):
        """Setup stop words for text processing"""
        if NLTK_AVAILABLE:
            try:
                self.stop_words = set(stopwords.words('english'))
            except:
                self.stop_words = self.get_basic_stopwords()
        else:
            self.stop_words = self.get_basic_stopwords()

    def setup_product_attributes(self):
        """Define product attributes for analysis"""
        self.product_attributes = {
            'quality': ['quality', 'build', 'construction', 'material', 'durable', 'sturdy', 'solid', 'cheap', 'flimsy', 'poor'],
            'price': ['price', 'cost', 'expensive', 'cheap', 'value', 'money', 'affordable', 'overpriced', 'budget', 'costly'],
            'delivery': ['delivery', 'shipping', 'package', 'arrived', 'fast', 'slow', 'damaged', 'packaging', 'courier'],
            'performance': ['performance', 'speed', 'fast', 'slow', 'efficient', 'lag', 'smooth', 'responsive', 'quick'],
            'design': ['design', 'look', 'appearance', 'color', 'style', 'beautiful', 'ugly', 'attractive', 'aesthetic'],
            'battery': ['battery', 'charge', 'power', 'drain', 'last', 'life', 'backup', 'charging'],
            'camera': ['camera', 'photo', 'picture', 'video', 'image', 'blur', 'clear', 'focus', 'lens'],
            'display': ['display', 'screen', 'bright', 'dim', 'resolution', 'clear', 'crisp', 'sharp', 'color'],
            'size': ['size', 'big', 'small', 'compact', 'large', 'fit', 'portable', 'heavy', 'light'],
            'service': ['service', 'support', 'help', 'response', 'staff', 'rude', 'helpful', 'customer', 'care']
        }

    def get_basic_stopwords(self):
        """Basic English stop words"""
        return {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
            'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
            'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
            'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
            'his', 'her', 'its', 'our', 'their'
        }

    def analyze_sentiment_huggingface(self, texts):
        """Analyze sentiment using Hugging Face transformers"""
        if not self.sentiment_pipeline:
            return self.analyze_sentiment_rules(texts)

        results = []
        batch_size = 8  # Process in small batches
        
        try:
            for i in range(0, len(texts), batch_size):
                batch = texts[i:i + batch_size]
                batch_results = self.sentiment_pipeline(batch)
                
                for result in batch_results:
                    # Convert Hugging Face output to our format
                    label = result['label'].lower()
                    score = result['score']
                    
                    # Map different model outputs to standard labels
                    if label in ['positive', 'pos', 'label_2']:
                        sentiment_label = 'positive'
                    elif label in ['negative', 'neg', 'label_0']:
                        sentiment_label = 'negative'
                    else:
                        sentiment_label = 'neutral'
                    
                    results.append({
                        'label': sentiment_label,
                        'score': round(score, 3)
                    })
                    
            return results
            
        except Exception as e:
            print(f"Hugging Face analysis failed: {e}, using rule-based fallback", file=sys.stderr)
            return self.analyze_sentiment_rules(texts)

    def analyze_sentiment_rules(self, texts):
        """Rule-based sentiment analysis fallback"""
        positive_words = {
            'good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 'wonderful', 'perfect',
            'love', 'like', 'best', 'brilliant', 'outstanding', 'superb', 'impressive', 'satisfied',
            'happy', 'pleased', 'recommend', 'beautiful', 'quality', 'fast', 'easy', 'comfortable'
        }
        
        negative_words = {
            'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disappointing', 'poor',
            'useless', 'waste', 'expensive', 'slow', 'difficult', 'problem', 'issue', 'broken',
            'defective', 'damaged', 'regret', 'disappointed', 'angry', 'frustrated', 'annoying'
        }
        
        results = []
        for text in texts:
            words = re.findall(r'\b\w+\b', text.lower())
            
            pos_score = sum(1 for word in words if word in positive_words)
            neg_score = sum(1 for word in words if word in negative_words)
            total_words = len(words)
            
            if total_words == 0:
                results.append({'label': 'neutral', 'score': 0.5})
                continue
            
            if pos_score > neg_score:
                confidence = min(0.9, 0.6 + (pos_score / total_words) * 2)
                results.append({'label': 'positive', 'score': confidence})
            elif neg_score > pos_score:
                confidence = min(0.9, 0.6 + (neg_score / total_words) * 2)
                results.append({'label': 'negative', 'score': confidence})
            else:
                results.append({'label': 'neutral', 'score': 0.5})
                
        return results

    def extract_keywords_tfidf(self, texts):
        """Extract keywords using TF-IDF"""
        if not texts or not SKLEARN_AVAILABLE:
            return self.extract_keywords_simple(texts)
        
        try:
            vectorizer = TfidfVectorizer(
                max_features=15,
                stop_words='english',
                ngram_range=(1, 2),
                min_df=1,
                max_df=0.8
            )
            
            tfidf_matrix = vectorizer.fit_transform(texts)
            feature_names = vectorizer.get_feature_names_out()
            
            # Get average TF-IDF scores
            mean_scores = tfidf_matrix.mean(axis=0).A1
            keyword_scores = list(zip(feature_names, mean_scores))
            keyword_scores.sort(key=lambda x: x[1], reverse=True)
            
            return [keyword for keyword, score in keyword_scores]
            
        except Exception as e:
            print(f"TF-IDF extraction failed: {e}", file=sys.stderr)
            return self.extract_keywords_simple(texts)

    def extract_keywords_simple(self, texts):
        """Simple keyword extraction using word frequency"""
        if not texts:
            return []
        
        all_words = []
        for text in texts:
            words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
            words = [word for word in words if word not in self.stop_words]
            all_words.extend(words)
        
        word_counts = Counter(all_words)
        return [word for word, count in word_counts.most_common(15)]

    def detect_attributes(self, text):
        """Detect product attributes mentioned in text"""
        text_lower = text.lower()
        detected = set()
        
        for attribute, keywords in self.product_attributes.items():
            for keyword in keywords:
                if keyword in text_lower:
                    detected.add(attribute)
                    break
        
        return list(detected)

    def calculate_attribute_scores(self, analyzed_reviews):
        """Calculate scores for each product attribute"""
        attribute_stats = {}
        
        for review in analyzed_reviews:
            attributes = review.get('detected_attributes', [])
            sentiment = review.get('sentiment_label', 'neutral')
            
            for attr in attributes:
                if attr not in attribute_stats:
                    attribute_stats[attr] = {'positive': 0, 'negative': 0, 'neutral': 0}
                attribute_stats[attr][sentiment] += 1
        
        # Convert to score format
        attributes_analysis = []
        for attr, stats in attribute_stats.items():
            total = sum(stats.values())
            if total > 0:
                score = (stats['positive'] * 100 + stats['neutral'] * 50) / total
                attributes_analysis.append({
                    'key': attr,
                    'displayName': attr.replace('_', ' ').title(),
                    'score': round(score, 1),
                    'positive_count': stats['positive'],
                    'negative_count': stats['negative'],
                    'neutral_count': stats['neutral']
                })
        
        # Sort by score
        attributes_analysis.sort(key=lambda x: x['score'], reverse=True)
        return attributes_analysis

    def generate_keyword_insights(self, analyzed_reviews):
        """Generate keyword insights from analyzed reviews"""
        positive_texts = [r['text'] for r in analyzed_reviews if r.get('sentiment_label') == 'positive' and r.get('text')]
        negative_texts = [r['text'] for r in analyzed_reviews if r.get('sentiment_label') == 'negative' and r.get('text')]
        
        positive_keywords = self.extract_keywords_tfidf(positive_texts) if positive_texts else []
        negative_keywords = self.extract_keywords_tfidf(negative_texts) if negative_texts else []
        
        # Add counts and weights
        pos_keywords_with_stats = []
        for keyword in positive_keywords[:10]:
            count = sum(1 for text in positive_texts if keyword.lower() in text.lower())
            weight = count / len(positive_texts) if positive_texts else 0
            pos_keywords_with_stats.append({
                'term': keyword,
                'count': count,
                'weight': round(weight, 3)
            })
        
        neg_keywords_with_stats = []
        for keyword in negative_keywords[:10]:
            count = sum(1 for text in negative_texts if keyword.lower() in text.lower())
            weight = count / len(negative_texts) if negative_texts else 0
            neg_keywords_with_stats.append({
                'term': keyword,
                'count': count,
                'weight': round(weight, 3)
            })
        
        return {
            'positive_keywords': pos_keywords_with_stats,
            'negative_keywords': neg_keywords_with_stats
        }

    def analyze_reviews(self, reviews):
        """Main method to analyze reviews"""
        if not reviews:
            return self.get_empty_analysis()
        
        print(f"Analyzing {len(reviews)} reviews...", file=sys.stderr)
        
        # Extract texts and perform sentiment analysis
        review_texts = [review.get('text', '') for review in reviews if review.get('text')]
        
        if not review_texts:
            return self.get_empty_analysis()
        
        # Perform sentiment analysis
        sentiment_results = self.analyze_sentiment_huggingface(review_texts)
        
        # Process each review
        analyzed_reviews = []
        sentiments = []
        
        for i, review in enumerate(reviews):
            if i < len(sentiment_results):
                sentiment = sentiment_results[i]
            else:
                sentiment = {'label': 'neutral', 'score': 0.5}
            
            # Extract keywords and attributes for this review
            review_text = review.get('text', '')
            keywords = self.extract_keywords_simple([review_text])[:5]
            attributes = self.detect_attributes(review_text)
            
            analyzed_review = {
                **review,
                'sentiment_label': sentiment['label'],
                'sentiment_score': sentiment['score'],
                'extracted_keywords': keywords,
                'detected_attributes': attributes
            }
            
            analyzed_reviews.append(analyzed_review)
            sentiments.append(sentiment['label'])
        
        # Calculate sentiment summary
        total_reviews = len(sentiments)
        sentiment_summary = {
            'positive': {
                'count': sentiments.count('positive'),
                'percentage': round(sentiments.count('positive') / total_reviews * 100, 1) if total_reviews > 0 else 0
            },
            'negative': {
                'count': sentiments.count('negative'),
                'percentage': round(sentiments.count('negative') / total_reviews * 100, 1) if total_reviews > 0 else 0
            },
            'neutral': {
                'count': sentiments.count('neutral'),
                'percentage': round(sentiments.count('neutral') / total_reviews * 100, 1) if total_reviews > 0 else 0
            }
        }
        
        # Generate insights
        keyword_insights = self.generate_keyword_insights(analyzed_reviews)
        attributes = self.calculate_attribute_scores(analyzed_reviews)
        
        # Generate top issues
        negative_keywords = keyword_insights['negative_keywords']
        issues = []
        for i, keyword_data in enumerate(negative_keywords[:5]):
            issues.append({
                'issue': keyword_data['term'],
                'mentions': keyword_data['count'],
                'percent_of_negatives': round(keyword_data['weight'] * 100, 1)
            })
        
        return {
            'analyzed_reviews': analyzed_reviews,
            'sentiment_summary': sentiment_summary,
            'keyword_insights': keyword_insights,
            'attributes': attributes,
            'issues_overview': {
                'most_mentioned': issues
            }
        }

    def get_empty_analysis(self):
        """Return empty analysis structure"""
        return {
            'analyzed_reviews': [],
            'sentiment_summary': {
                'positive': {'count': 0, 'percentage': 0},
                'negative': {'count': 0, 'percentage': 0},
                'neutral': {'count': 0, 'percentage': 0}
            },
            'keyword_insights': {
                'positive_keywords': [],
                'negative_keywords': []
            },
            'attributes': [],
            'issues_overview': {'most_mentioned': []}
        }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'error': 'Reviews data required'}))
        return

    try:
        reviews_data = json.loads(sys.argv[1])
        analyzer = SentimentAnalyzer()
        result = analyzer.analyze_reviews(reviews_data)
        print(json.dumps(result, ensure_ascii=False))
        
    except json.JSONDecodeError as e:
        print(json.dumps({'error': f'Invalid JSON input: {str(e)}'}))
    except Exception as e:
        print(json.dumps({'error': f'Analysis failed: {str(e)}'}))


if __name__ == "__main__":
    main()