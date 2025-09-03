// Production health monitoring
class ProductionMonitor {
  constructor() {
    this.healthChecks = [];
    this.errorLog = [];
    this.performanceLog = [];
    this.isProduction = window.location.hostname.includes('github.io');
    
    if (this.isProduction) {
      this.init();
    }
  }

  init() {
    this.startHealthChecks();
    this.monitorNetworkErrors();
    this.trackUserExperience();
    this.setupPeriodicReports();
  }

  // Real-time health monitoring
  startHealthChecks() {
    setInterval(() => {
      this.checkAPIHealth();
      this.checkResourceLoading();
      this.checkUserInteractions();
      this.reportHealth();
    }, 30000); // Every 30 seconds
  }

  checkAPIHealth() {
    const checks = [
      this.testDataLoading(),
      this.testAuthentication(),
      this.testCartFunctionality()
    ];

    Promise.allSettled(checks).then(results => {
      const failed = results.filter(r => r.status === 'rejected');
      if (failed.length > 0) {
        this.logError('API Health', `${failed.length} API checks failed`);
      }
    });
  }

  async testDataLoading() {
    try {
      const response = await fetch('./assets/data/ice-creams.json');
      if (!response.ok) throw new Error('Data loading failed');
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data structure');
      }
      return true;
    } catch (error) {
      throw new Error(`Data loading: ${error.message}`);
    }
  }

  async testAuthentication() {
    try {
      // Test if authentication system is working
      const users = localStorage.getItem('users');
      const currentUser = localStorage.getItem('currentUser');
      
      if (!users) {
        // Trigger fallback data loading
        if (window.AuthManager && window.AuthManager.loadFallbackUsers) {
          window.AuthManager.loadFallbackUsers();
        }
      }
      return true;
    } catch (error) {
      throw new Error(`Auth system: ${error.message}`);
    }
  }

  async testCartFunctionality() {
    try {
      // Test cart operations
      const cart = localStorage.getItem('cart');
      if (cart) {
        const parsedCart = JSON.parse(cart);
        if (!Array.isArray(parsedCart)) {
          throw new Error('Invalid cart structure');
        }
      }
      return true;
    } catch (error) {
      throw new Error(`Cart system: ${error.message}`);
    }
  }

  checkResourceLoading() {
    const resources = performance.getEntriesByType('resource');
    const failed = resources.filter(r => r.transferSize === 0 && r.decodedBodySize === 0);
    
    if (failed.length > 0) {
      this.logError('Resource Loading', `${failed.length} resources failed to load`);
    }
  }

  checkUserInteractions() {
    // Monitor if key UI elements are responding
    const criticalElements = [
      '#navbar',
      '#main-content', 
      '.product-grid',
      '#cart-count'
    ];

    criticalElements.forEach(selector => {
      const element = document.querySelector(selector);
      if (!element) {
        this.logError('UI Health', `Critical element missing: ${selector}`);
      }
    });
  }

  monitorNetworkErrors() {
    // Monitor fetch failures
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch.apply(this, args);
        if (!response.ok) {
          this.logError('Network', `Fetch failed: ${args[0]} (${response.status})`);
        }
        return response;
      } catch (error) {
        this.logError('Network', `Fetch error: ${args[0]} - ${error.message}`);
        throw error;
      }
    };
  }

  trackUserExperience() {
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        
        this.performanceLog.push({
          timestamp: Date.now(),
          metric: 'pageLoad',
          value: loadTime,
          page: window.location.pathname
        });

        if (loadTime > 3000) {
          this.logError('Performance', `Slow page load: ${loadTime}ms`);
        }
      }, 1000);
    });

    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError('JavaScript', `${event.message} at ${event.filename}:${event.lineno}`);
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Promise', event.reason);
    });
  }

  setupPeriodicReports() {
    // Send health report every 5 minutes
    setInterval(() => {
      this.generateHealthReport();
    }, 300000);

    // Send error summary on page unload
    window.addEventListener('beforeunload', () => {
      this.sendFinalReport();
    });
  }

  logError(category, message) {
    const error = {
      timestamp: Date.now(),
      category,
      message,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errorLog.push(error);
    
    // Store in localStorage for persistence
    const storedErrors = JSON.parse(localStorage.getItem('productionErrors') || '[]');
    storedErrors.push(error);
    
    // Keep only last 50 errors
    if (storedErrors.length > 50) {
      storedErrors.splice(0, storedErrors.length - 50);
    }
    
    localStorage.setItem('productionErrors', JSON.stringify(storedErrors));

    // Critical errors - show user notification
    if (category === 'JavaScript' || category === 'API Health') {
      this.showErrorNotification(message);
    }
  }

  showErrorNotification(message) {
    // Show user-friendly error notification
    if (window.UIManager && window.UIManager.showToast) {
      window.UIManager.showToast(
        'เกิดข้อผิดพลาดชั่วคราว กรุณาลองใหม่อีกครั้ง',
        'error'
      );
    }
  }

  reportHealth() {
    const healthStatus = {
      timestamp: Date.now(),
      errors: this.errorLog.length,
      performance: this.getAveragePerformance(),
      uptime: Date.now() - this.startTime,
      page: window.location.pathname
    };

    // Store health status
    localStorage.setItem('healthStatus', JSON.stringify(healthStatus));
  }

  getAveragePerformance() {
    if (this.performanceLog.length === 0) return 0;
    
    const total = this.performanceLog.reduce((sum, log) => sum + log.value, 0);
    return total / this.performanceLog.length;
  }

  generateHealthReport() {
    const report = {
      timestamp: Date.now(),
      totalErrors: this.errorLog.length,
      errorsByCategory: this.groupErrorsByCategory(),
      averagePerformance: this.getAveragePerformance(),
      criticalIssues: this.getCriticalIssues(),
      recommendations: this.getRecommendations()
    };

    console.log('🏥 Production Health Report:', report);
    
    // Store report for admin dashboard
    localStorage.setItem('healthReport', JSON.stringify(report));
  }

  groupErrorsByCategory() {
    const grouped = {};
    this.errorLog.forEach(error => {
      grouped[error.category] = (grouped[error.category] || 0) + 1;
    });
    return grouped;
  }

  getCriticalIssues() {
    return this.errorLog.filter(error => 
      error.category === 'JavaScript' || 
      error.category === 'API Health' ||
      error.category === 'Network'
    ).slice(-5); // Last 5 critical issues
  }

  getRecommendations() {
    const recommendations = [];
    const errorsByCategory = this.groupErrorsByCategory();

    if (errorsByCategory['Network'] > 5) {
      recommendations.push('Check internet connection and server status');
    }

    if (errorsByCategory['JavaScript'] > 3) {
      recommendations.push('Review recent code changes for JavaScript errors');
    }

    if (this.getAveragePerformance() > 3000) {
      recommendations.push('Optimize page loading performance');
    }

    return recommendations;
  }

  sendFinalReport() {
    const finalReport = {
      sessionDuration: Date.now() - this.startTime,
      totalErrors: this.errorLog.length,
      finalHealth: this.generateHealthReport(),
      userBehavior: this.getUserBehaviorSummary()
    };

    // Store final session report
    localStorage.setItem('sessionReport', JSON.stringify(finalReport));
  }

  getUserBehaviorSummary() {
    return {
      pagesVisited: this.performanceLog.map(log => log.page),
      timeSpent: Date.now() - this.startTime,
      errorsEncountered: this.errorLog.length
    };
  }

  // Public method to get current health status
  getHealthStatus() {
    return {
      isHealthy: this.errorLog.length < 10,
      errorCount: this.errorLog.length,
      avgPerformance: this.getAveragePerformance(),
      lastCheck: Date.now()
    };
  }

  // Public method to get error summary
  getErrorSummary() {
    return {
      total: this.errorLog.length,
      byCategory: this.groupErrorsByCategory(),
      recent: this.errorLog.slice(-5)
    };
  }
}

// Initialize production monitoring
if (typeof window !== 'undefined') {
  window.ProductionMonitor = new ProductionMonitor();
  
  // Expose health check methods globally
  window.getProductionHealth = () => window.ProductionMonitor.getHealthStatus();
  window.getProductionErrors = () => window.ProductionMonitor.getErrorSummary();
}

export default ProductionMonitor;
