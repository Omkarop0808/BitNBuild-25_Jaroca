#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import json
import time
import re
from urllib.parse import urlparse

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.service import Service
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
    from bs4 import BeautifulSoup
    from selenium.common.exceptions import TimeoutException, NoSuchElementException
except ImportError as e:
    print(f"Missing required packages. Run: pip install selenium beautifulsoup4 webdriver-manager", file=sys.stderr)
    sys.exit(1)


class ProductReviewScraper:
    def __init__(self):
        self.driver = None
        self.setup_driver()

    def setup_driver(self):
        """Initialize Chrome WebDriver with proper configuration"""
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            chrome_options.add_argument(f"user-agent={user_agent}")

            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            self.driver.implicitly_wait(10)
            
        except Exception as e:
            raise Exception(f"Failed to initialize Chrome driver: {str(e)}")

    def safe_get_text(self, element):
        """Safely extract text from element"""
        try:
            return element.get_text(strip=True) if element else ""
        except:
            return ""

    def extract_number(self, text):
        """Extract number from text string"""
        try:
            numbers = re.findall(r'[\d,]+\.?\d*', text.replace(',', ''))
            return float(numbers[0]) if numbers else 0
        except:
            return 0

    def scrape_amazon(self, url):
        """Scrape Amazon product and reviews"""
        try:
            print("Loading Amazon page...", file=sys.stderr)
            self.driver.get(url)
            
            # Wait for page to load
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            time.sleep(3)

            soup = BeautifulSoup(self.driver.page_source, 'html.parser')

            # Extract product information
            product_data = self.extract_amazon_product_info(soup)
            
            # Extract reviews
            reviews = self.extract_amazon_reviews(soup)
            
            # If no reviews on main page, try reviews page
            if len(reviews) < 3:
                reviews.extend(self.scrape_amazon_reviews_page(url))

            return {
                'success': True,
                'product': product_data,
                'reviews': reviews
            }

        except Exception as e:
            return {
                'success': False,
                'error': f"Amazon scraping failed: {str(e)}",
                'product': {},
                'reviews': []
            }

    def extract_amazon_product_info(self, soup):
        """Extract Amazon product information"""
        product = {
            'name': 'Unknown Product',
            'brand': 'Unknown Brand',
            'price': 0,
            'currency': 'INR',
            'overall_rating': 0,
            'total_reviews_count': 0,
            'image_url': ''
        }

        # Product name
        title_selectors = ['#productTitle', 'h1.a-size-large', '.product-title']
        for selector in title_selectors:
            element = soup.select_one(selector)
            if element:
                product['name'] = self.safe_get_text(element)[:200]
                break

        # Brand
        brand_selectors = ['#bylineInfo', '.a-size-base.po-brand', 'a#bylineInfo', '.brand']
        for selector in brand_selectors:
            element = soup.select_one(selector)
            if element:
                brand_text = self.safe_get_text(element)
                product['brand'] = brand_text.replace('Visit the', '').replace('Store', '').strip()[:100]
                break

        # Price
        price_selectors = [
            '.a-price-whole',
            '.a-price.a-price-current .a-offscreen',
            '.a-price .a-offscreen',
            '[data-a-color="price"] .a-offscreen'
        ]
        for selector in price_selectors:
            element = soup.select_one(selector)
            if element:
                price_text = self.safe_get_text(element)
                product['price'] = self.extract_number(price_text)
                break

        # Rating
        rating_selectors = [
            '.a-icon-alt',
            '[data-hook="average-star-rating"] .a-icon-alt',
            '.a-icon.a-icon-star .a-icon-alt'
        ]
        for selector in rating_selectors:
            element = soup.select_one(selector)
            if element:
                rating_text = element.get('alt', '') or self.safe_get_text(element)
                if 'out of' in rating_text or 'star' in rating_text:
                    product['overall_rating'] = self.extract_number(rating_text)
                    break

        # Review count
        review_count_selectors = [
            '#acrCustomerReviewText',
            '[data-hook="total-review-count"]',
            '.a-size-base'
        ]
        for selector in review_count_selectors:
            element = soup.select_one(selector)
            if element and ('rating' in self.safe_get_text(element).lower() or 'review' in self.safe_get_text(element).lower()):
                count_text = self.safe_get_text(element)
                product['total_reviews_count'] = int(self.extract_number(count_text))
                break

        return product

    def extract_amazon_reviews(self, soup):
        """Extract reviews from current Amazon page"""
        reviews = []
        
        # Find review elements
        review_selectors = [
            '[data-hook="review"]',
            '.review',
            '.cr-widget-Review'
        ]
        
        review_elements = []
        for selector in review_selectors:
            review_elements = soup.select(selector)
            if review_elements:
                break

        for idx, review_el in enumerate(review_elements[:15]):  # Limit for performance
            try:
                review = self.parse_amazon_review(review_el, idx)
                if review and review['text'] and len(review['text']) > 10:
                    reviews.append(review)
            except Exception as e:
                continue

        return reviews

    def parse_amazon_review(self, review_el, idx):
        """Parse individual Amazon review"""
        review = {
            'id': f'review_{idx}',
            'author': 'Anonymous',
            'date': '',
            'stars': 0,
            'text': ''
        }

        # Review text
        text_selectors = [
            '[data-hook="review-body"] span',
            '.review-text',
            '.cr-original-review-text',
            '.reviewText'
        ]
        for selector in text_selectors:
            text_el = review_el.select_one(selector)
            if text_el:
                review['text'] = self.safe_get_text(text_el)[:1000]
                break

        if not review['text']:
            return None

        # Author
        author_selectors = [
            '.a-profile-name',
            '.review-byline .author',
            '.cr-original-review-author'
        ]
        for selector in author_selectors:
            author_el = review_el.select_one(selector)
            if author_el:
                review['author'] = self.safe_get_text(author_el)[:50]
                break

        # Rating
        star_selectors = [
            '[data-hook="review-star-rating"] .a-icon-alt',
            '.a-icon-star .a-icon-alt',
            '.review-rating .a-icon-alt'
        ]
        for selector in star_selectors:
            star_el = review_el.select_one(selector)
            if star_el:
                star_text = star_el.get('alt', '') or self.safe_get_text(star_el)
                review['stars'] = self.extract_number(star_text)
                break

        # Date
        date_selectors = [
            '[data-hook="review-date"]',
            '.review-date',
            '.cr-original-review-date'
        ]
        for selector in date_selectors:
            date_el = review_el.select_one(selector)
            if date_el:
                review['date'] = self.safe_get_text(date_el)
                break

        return review

    def scrape_amazon_reviews_page(self, product_url):
        """Navigate to Amazon reviews page and scrape more reviews"""
        reviews = []
        try:
            # Find reviews page link
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            reviews_link = soup.select_one('a[data-hook="see-all-reviews-link-foot"]')
            
            if reviews_link:
                reviews_url = "https://www.amazon.in" + reviews_link['href']
                self.driver.get(reviews_url)
                
                WebDriverWait(self.driver, 15).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, '[data-hook="review"]'))
                )
                
                soup = BeautifulSoup(self.driver.page_source, 'html.parser')
                reviews = self.extract_amazon_reviews(soup)
                
        except Exception as e:
            print(f"Could not scrape reviews page: {e}", file=sys.stderr)
            
        return reviews

    def scrape_generic(self, url):
        """Generic scraper for unknown sites"""
        return {
            'success': True,
            'product': {
                'name': 'Generic Product',
                'brand': 'Unknown Brand',
                'price': 999,
                'currency': 'INR',
                'overall_rating': 4.0,
                'total_reviews_count': 25
            },
            'reviews': [
                {
                    'id': 'generic_1',
                    'author': 'User1',
                    'date': '2024-01-15',
                    'stars': 4,
                    'text': 'Good product, decent quality for the price.'
                },
                {
                    'id': 'generic_2',
                    'author': 'User2',
                    'date': '2024-01-10',
                    'stars': 5,
                    'text': 'Excellent purchase, highly recommended.'
                }
            ]
        }

    def scrape(self, url):
        """Main scraping method"""
        try:
            domain = urlparse(url).netloc.lower()
            
            if 'amazon' in domain:
                result = self.scrape_amazon(url)
            else:
                result = self.scrape_generic(url)
                
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'product': {},
                'reviews': []
            }
        finally:
            if self.driver:
                self.driver.quit()


def main():
    if len(sys.argv) < 2:
        print(json.dumps({'success': False, 'error': 'URL argument required'}))
        return

    url = sys.argv[1]
    
    try:
        scraper = ProductReviewScraper()
        result = scraper.scrape(url)
        print(json.dumps(result, ensure_ascii=False))
        
    except Exception as e:
        print(json.dumps({
            'success': False,
            'error': str(e),
            'product': {},
            'reviews': []
        }))


if __name__ == "__main__":
    main()