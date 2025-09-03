// Enhanced error handling for GitHub Pages deployment
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.isProduction = window.location.hostname.includes('github.io');
    this.setupGlobalErrorHandling();
  }

  setupGlobalErrorHandling() {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
      event.preventDefault();
    });

    // Catch general JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });

    // Catch module loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.logError('Resource Loading Error', {
          type: event.target.tagName,
          source: event.target.src || event.target.href,
          message: 'Failed to load resource'
        });
      }
    }, true);
  }

  logError(type, details) {
    const error = {
      type,
      details,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errors.push(error);

    // Only show detailed errors in development
    if (!this.isProduction) {
      console.error(`🚨 ${type}:`, details);
    } else {
      console.warn('An error occurred. Check sweetFrozenErrors.getErrors() for details.');
    }

    // Store in localStorage for debugging
    try {
      const storedErrors = JSON.parse(localStorage.getItem('sweet_frozen_errors') || '[]');
      storedErrors.push(error);
      // Keep only last 10 errors
      const recentErrors = storedErrors.slice(-10);
      localStorage.setItem('sweet_frozen_errors', JSON.stringify(recentErrors));
    } catch (e) {
      // localStorage might be full or unavailable
    }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
    try {
      localStorage.removeItem('sweet_frozen_errors');
    } catch (e) {
      // Ignore if localStorage is unavailable
    }
  }

  // Graceful error recovery for common issues
  async handleDataLoadError(dataType, fallbackData) {
    this.logError('Data Load Error', { dataType });
    
    // Try to use localStorage backup
    try {
      const backupKey = `sweet_frozen_backup_${dataType}`;
      const backup = localStorage.getItem(backupKey);
      if (backup) {
        return JSON.parse(backup);
      }
    } catch (e) {
      // Backup failed, use provided fallback
    }

    return fallbackData;
  }

  // Handle fetch errors gracefully
  async safeFetch(url, options = {}) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
    } catch (error) {
      this.logError('Fetch Error', {
        url,
        error: error.message
      });
      throw error;
    }
  }

  // User-friendly error messages
  showUserError(message, type = 'error') {
    // Use existing toast function if available
    if (window.toast) {
      window.toast(message, type);
    } else {
      // Fallback alert
      alert(message);
    }
  }
}

// Create global instance
window.sweetFrozenErrors = new ErrorHandler();

// Helper functions
window.handleError = (type, details) => window.sweetFrozenErrors.logError(type, details);
window.safeFetchData = (url, options) => window.sweetFrozenErrors.safeFetch(url, options);

export default ErrorHandler;
