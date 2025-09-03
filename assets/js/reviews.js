// Review System for Sweet Frozen E-commerce
import { Storage } from './storage.js';
import { currentUser } from './auth.js';

const REVIEWS_KEY = 'app.reviews.v1';

// Load reviews from JSON file with fallback
let REVIEWS_DATA = [];

export async function loadReviews() {
  try {
    const response = await fetch('./assets/data/reviews.json');
    if (response.ok) {
      REVIEWS_DATA = await response.json();
      
      // Also store in localStorage as backup
      Storage.set(REVIEWS_KEY, REVIEWS_DATA);
      return REVIEWS_DATA;
    }
  } catch (error) {
    console.warn('Could not load reviews.json, using localStorage fallback:', error);
  }
  
  // Fallback to localStorage
  REVIEWS_DATA = Storage.get(REVIEWS_KEY, []);
  return REVIEWS_DATA;
}

// Get reviews for a specific product
export function getProductReviews(productId) {
  return REVIEWS_DATA.filter(review => review.productId === productId);
}

// Get all reviews
export function getAllReviews() {
  return REVIEWS_DATA;
}

// Calculate average rating for a product
export function getProductRating(productId) {
  const reviews = getProductReviews(productId);
  if (reviews.length === 0) return 0;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10; // Round to 1 decimal place
}

// Get review statistics for a product
export function getProductReviewStats(productId) {
  const reviews = getProductReviews(productId);
  const totalReviews = reviews.length;
  
  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }
  
  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;
  
  reviews.forEach(review => {
    totalRating += review.rating;
    ratingDistribution[review.rating]++;
  });
  
  return {
    totalReviews,
    averageRating: Math.round((totalRating / totalReviews) * 10) / 10,
    ratingDistribution
  };
}

// Add a new review
export function addReview(productId, rating, title, comment) {
  const user = currentUser();
  if (!user) {
    throw new Error('ต้องเข้าสู่ระบบก่อนเขียนรีวิว');
  }
  
  // Check if user already reviewed this product
  const existingReview = REVIEWS_DATA.find(
    review => review.productId === productId && review.userId === user.id
  );
  
  if (existingReview) {
    throw new Error('คุณได้เขียนรีวิวสินค้านี้แล้ว');
  }
  
  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    userId: user.id,
    userName: user.name,
    rating: parseInt(rating),
    title: title.trim(),
    comment: comment.trim(),
    date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    helpful: 0,
    verified: true // Assume verified for demo
  };
  
  REVIEWS_DATA.unshift(newReview); // Add to beginning
  Storage.set(REVIEWS_KEY, REVIEWS_DATA);
  
  return newReview;
}

// Update helpful count for a review
export function markReviewHelpful(reviewId) {
  const review = REVIEWS_DATA.find(r => r.id === reviewId);
  if (review) {
    review.helpful = (review.helpful || 0) + 1;
    Storage.set(REVIEWS_KEY, REVIEWS_DATA);
    return review.helpful;
  }
  return 0;
}

// Generate star rating HTML
export function generateStarRating(rating, size = 'text-base') {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  let stars = '';
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars += `<span class="text-yellow-400 ${size}">⭐</span>`;
  }
  
  // Half star
  if (hasHalfStar) {
    stars += `<span class="text-yellow-400 ${size}">⭐</span>`;
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars += `<span class="text-gray-300 ${size}">⭐</span>`;
  }
  
  return stars;
}

// Generate interactive star rating for form
export function generateInteractiveStarRating(name = 'rating', currentRating = 0) {
  let html = '<div class="flex items-center gap-1" data-rating-input>';
  
  for (let i = 1; i <= 5; i++) {
    const isSelected = i <= currentRating;
    html += `
      <button type="button" 
              class="text-2xl transition-colors hover:text-yellow-400 ${isSelected ? 'text-yellow-400' : 'text-gray-300'}" 
              data-rating="${i}"
              onclick="setRating(${i})">⭐</button>
    `;
  }
  
  html += `<input type="hidden" name="${name}" value="${currentRating}" id="ratingInput">`;
  html += '</div>';
  
  return html;
}

// Format relative time
export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'วันนี้';
  if (diffInDays === 1) return 'เมื่อวาน';
  if (diffInDays <= 7) return `${diffInDays} วันที่แล้ว`;
  if (diffInDays <= 30) return `${Math.floor(diffInDays / 7)} สัปดาห์ที่แล้ว`;
  if (diffInDays <= 365) return `${Math.floor(diffInDays / 30)} เดือนที่แล้ว`;
  return `${Math.floor(diffInDays / 365)} ปีที่แล้ว`;
}

// Initialize reviews on page load
loadReviews();

// Global functions for rating interaction
window.setRating = function(rating) {
  const buttons = document.querySelectorAll('[data-rating-input] button');
  const input = document.getElementById('ratingInput');
  
  buttons.forEach((btn, index) => {
    if (index < rating) {
      btn.classList.remove('text-gray-300');
      btn.classList.add('text-yellow-400');
    } else {
      btn.classList.remove('text-yellow-400');
      btn.classList.add('text-gray-300');
    }
  });
  
  if (input) input.value = rating;
};

export { REVIEWS_DATA };
