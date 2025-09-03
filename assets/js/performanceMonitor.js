// Performance monitoring for GitHub Pages deployment
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.isGitHubPages = window.location.hostname.includes('github.io');
    this.startTime = performance.now();
    this.setupMonitoring();
  }

  setupMonitoring() {
    // Monitor page load
    window.addEventListener('load', () => {
      this.recordMetric('pageLoad', performance.now() - this.startTime);
      this.checkWebVitals();
    });

    // Monitor DOM content loaded
    document.addEventListener('DOMContentLoaded', () => {
      this.recordMetric('domContentLoaded', performance.now() - this.startTime);
    });

    // Monitor resource loading
    this.monitorResources();
  }

  recordMetric(name, value) {
    this.metrics[name] = value;
    
    if (!this.isGitHubPages) {
      console.log(`📊 Performance: ${name} = ${value.toFixed(2)}ms`);
    }
  }

  monitorResources() {
    // Check for slow loading resources
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 1000) { // Slow resource (>1s)
          this.recordMetric(`slow_${entry.name}`, entry.duration);
          console.warn(`🐌 Slow resource: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['navigation', 'resource'] });
    } catch (e) {
      // Performance Observer not supported
    }
  }

  checkWebVitals() {
    // Monitor Core Web Vitals if supported
    try {
      // First Input Delay (FID)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('firstInputDelay', entry.processingStart - entry.startTime);
        }
      }).observe({ type: 'first-input', buffered: true });

      // Largest Contentful Paint (LCP)
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('largestContentfulPaint', entry.startTime);
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.recordMetric('cumulativeLayoutShift', clsValue);
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });

    } catch (e) {
      // Web Vitals not supported
    }
  }

  // Check for performance issues
  diagnose() {
    const issues = [];

    if (this.metrics.pageLoad > 3000) {
      issues.push('Page load time > 3 seconds');
    }

    if (this.metrics.firstInputDelay > 100) {
      issues.push('First Input Delay > 100ms');
    }

    if (this.metrics.largestContentfulPaint > 2500) {
      issues.push('Largest Contentful Paint > 2.5 seconds');
    }

    if (this.metrics.cumulativeLayoutShift > 0.1) {
      issues.push('Cumulative Layout Shift > 0.1');
    }

    // Check for slow resources
    Object.keys(this.metrics).forEach(key => {
      if (key.startsWith('slow_')) {
        issues.push(`Slow resource: ${key.replace('slow_', '')}`);
      }
    });

    return issues;
  }

  getReport() {
    return {
      metrics: this.metrics,
      issues: this.diagnose(),
      environment: this.isGitHubPages ? 'GitHub Pages' : 'Local',
      timestamp: new Date().toISOString()
    };
  }

  // Memory usage monitoring
  checkMemoryUsage() {
    if ('memory' in performance) {
      const memory = performance.memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  }
}

// Create global instance
window.sweetFrozenPerf = new PerformanceMonitor();

// Helper functions
window.getPerformanceReport = () => window.sweetFrozenPerf.getReport();
window.checkMemory = () => window.sweetFrozenPerf.checkMemoryUsage();

export default PerformanceMonitor;
