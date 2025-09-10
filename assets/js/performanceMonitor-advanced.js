// ระบบตรวจสอบประสิทธิภาพแบบเรียลไทม์และขั้นสูง
class AdvancedPerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: {},
      userInteractions: [],
      networkRequests: [],
      memoryUsage: [],
      fps: [],
      coreWebVitals: {}
    };
    
    this.thresholds = {
      fcp: 1800,      // First Contentful Paint
      lcp: 2500,      // Largest Contentful Paint
      fid: 100,       // First Input Delay
      cls: 0.1,       // Cumulative Layout Shift
      ttfb: 600,      // Time to First Byte
      fps: 55         // Frames per Second
    };
    
    this.sessionStart = Date.now();
    this.isGitHubPages = window.location.hostname.includes('github.io');
    this.init();
  }

  init() {
    this.measurePageLoad();
    this.measureCoreWebVitals();
    this.measureUserInteractions();
    this.measureNetworkPerformance();
    this.measureMemoryUsage();
    this.measureFPS();
    this.setupErrorTracking();
    this.startRealTimeMonitoring();
  }

  // วัดประสิทธิภาพการโหลดหน้า
  measurePageLoad() {
    if (!window.performance) return;

    window.addEventListener('load', () => {
      const timing = performance.getEntriesByType('navigation')[0];
      
      this.metrics.pageLoad = {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        loadComplete: timing.loadEventEnd - timing.loadEventStart,
        domInteractive: timing.domInteractive - timing.navigationStart,
        pageLoadTime: timing.loadEventEnd - timing.navigationStart,
        ttfb: timing.responseStart - timing.requestStart,
        domParsing: timing.domComplete - timing.domLoading,
        resourceLoadTime: timing.loadEventEnd - timing.domContentLoadedEventEnd,
        timestamp: Date.now()
      };

      this.analyzePageLoadPerformance();
      
      if (!this.isGitHubPages) {
        console.log('🚀 Performance metrics:', this.metrics.pageLoad);
      }
    });
  }

  // วัด Core Web Vitals
  measureCoreWebVitals() {
    // First Contentful Paint
    if (window.PerformanceObserver) {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.coreWebVitals.fcp = entry.startTime;
            this.checkWebVitalThreshold('fcp', entry.startTime);
          }
        }
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        this.metrics.coreWebVitals.lcp = lastEntry.startTime;
        this.checkWebVitalThreshold('lcp', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          this.metrics.coreWebVitals.fid = entry.processingStart - entry.startTime;
          this.checkWebVitalThreshold('fid', entry.processingStart - entry.startTime);
        }
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let cumulativeLayoutShift = 0;
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
          }
        }
        
        this.metrics.coreWebVitals.cls = cumulativeLayoutShift;
        this.checkWebVitalThreshold('cls', cumulativeLayoutShift);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  // วัดการตอบสนองผู้ใช้
  measureUserInteractions() {
    const interactionTypes = ['click', 'scroll', 'keydown', 'touchstart'];
    
    interactionTypes.forEach(type => {
      document.addEventListener(type, (event) => {
        const startTime = performance.now();
        
        // วัด input delay
        requestAnimationFrame(() => {
          const inputDelay = performance.now() - startTime;
          
          this.metrics.userInteractions.push({
            type,
            target: event.target.tagName,
            delay: inputDelay,
            timestamp: Date.now(),
            x: event.clientX || 0,
            y: event.clientY || 0
          });

          // เก็บเฉพาะ 50 interaction ล่าสุด
          if (this.metrics.userInteractions.length > 50) {
            this.metrics.userInteractions.shift();
          }
        });
      }, { passive: true });
    });
  }

  // วัดประสิทธิภาพเครือข่าย
  measureNetworkPerformance() {
    if (!window.PerformanceObserver) return;

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
          this.metrics.networkRequests.push({
            url: entry.name,
            duration: entry.duration,
            size: entry.transferSize,
            cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
            timestamp: Date.now()
          });

          // เก็บเฉพาะ 30 request ล่าสุด
          if (this.metrics.networkRequests.length > 30) {
            this.metrics.networkRequests.shift();
          }
        }
      }
    }).observe({ entryTypes: ['resource'] });
  }

  // วัดการใช้หน่วยความจำ
  measureMemoryUsage() {
    if (!performance.memory) return;

    const measureMemory = () => {
      this.metrics.memoryUsage.push({
        used: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
        timestamp: Date.now()
      });

      // เก็บข้อมูลเฉพาะ 20 จุดล่าสุด
      if (this.metrics.memoryUsage.length > 20) {
        this.metrics.memoryUsage.shift();
      }
    };

    measureMemory();
    setInterval(measureMemory, 10000); // ทุก 10 วินาที
  }

  // วัดอัตราเฟรม (FPS)
  measureFPS() {
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFrame = (currentTime) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        this.metrics.fps.push({
          fps,
          timestamp: Date.now()
        });

        if (fps < this.thresholds.fps) {
          this.reportLowFPS(fps);
        }

        // เก็บข้อมูลเฉพาะ 30 วินาทีล่าสุด
        if (this.metrics.fps.length > 30) {
          this.metrics.fps.shift();
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFrame);
    };

    requestAnimationFrame(measureFrame);
  }

  // ติดตามข้อผิดพลาด
  setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.reportError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error ? event.error.stack : 'No stack trace'
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.reportError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }

  // เริ่มการตรวจสอบแบบเรียลไทม์
  startRealTimeMonitoring() {
    // ตรวจสอบทุก 30 วินาที
    setInterval(() => {
      this.generatePerformanceReport();
      this.checkPerformanceIssues();
    }, 30000);

    // ตรวจสอบทันทีเมื่อผู้ใช้จะออกจากหน้า
    window.addEventListener('beforeunload', () => {
      this.sendFinalReport();
    });
  }

  // ตรวจสอบเกณฑ์ Core Web Vitals
  checkWebVitalThreshold(metric, value) {
    const threshold = this.thresholds[metric];
    const status = value <= threshold ? 'ดี' : value <= threshold * 1.5 ? 'ต้องปรับปรุง' : 'แย่';
    
    if (status !== 'ดี' && !this.isGitHubPages) {
      this.showPerformanceWarning(metric, value, status);
    }
  }

  // แสดงคำเตือนประสิทธิภาพ
  showPerformanceWarning(metric, value, status) {
    const warnings = {
      fcp: 'การแสดงเนื้อหาครั้งแรกช้าเกินไป',
      lcp: 'การแสดงเนื้อหาหลักช้าเกินไป',
      fid: 'การตอบสนองการคลิกช้าเกินไป',
      cls: 'เลย์เอาต์เปลี่ยนแปลงมากเกินไป',
      ttfb: 'เซิร์ฟเวอร์ตอบสนองช้าเกินไป'
    };

    console.warn(`🚨 ประสิทธิภาพ ${status}: ${warnings[metric]} (${Math.round(value)}${metric === 'cls' ? '' : 'ms'})`);
    
    // แสดงการแจ้งเตือนสำหรับ developer mode
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.showDevNotification(`ประสิทธิภาพ ${metric.toUpperCase()}: ${status}`, `ค่า: ${Math.round(value)}${metric === 'cls' ? '' : 'ms'}`);
    }
  }

  // รายงาน FPS ต่ำ
  reportLowFPS(fps) {
    if (!this.isGitHubPages) {
      console.warn(`🎬 FPS ต่ำ: ${fps} fps (ควรอยู่ที่ ${this.thresholds.fps}+ fps)`);
    }
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      this.showDevNotification('FPS ต่ำ', `${fps} fps - อาจทำให้แอนิเมชั่นไม่ลื่น`);
    }
  }

  // รายงานข้อผิดพลาด
  reportError(type, details) {
    if (!this.isGitHubPages) {
      console.error(`🚨 ${type}:`, details);
    }
    
    // ส่งรายงานข้อผิดพลาดในโปรดักชั่น
    if (this.isGitHubPages) {
      this.sendErrorReport(type, details);
    }
  }

  // แสดงการแจ้งเตือนสำหรับ developer
  showDevNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'dev-notification fixed top-16 right-4 bg-yellow-500 text-black p-3 rounded-lg shadow-lg z-50 max-w-sm animate-slide-in-right';
    notification.innerHTML = `
      <div class="flex items-start space-x-2">
        <div class="text-yellow-800">⚠️</div>
        <div class="flex-1">
          <div class="font-bold text-xs">${title}</div>
          <div class="text-xs mt-1">${message}</div>
        </div>
        <button class="text-yellow-800 hover:text-yellow-900 close-dev-notification">
          <i class="fas fa-times text-xs"></i>
        </button>
      </div>
    `;

    notification.querySelector('.close-dev-notification').addEventListener('click', () => {
      notification.remove();
    });

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 5000);
  }

  // วิเคราะห์ประสิทธิภาพการโหลดหน้า
  analyzePageLoadPerformance() {
    const { pageLoadTime, ttfb, domParsing } = this.metrics.pageLoad;
    
    let recommendations = [];
    
    if (ttfb > this.thresholds.ttfb) {
      recommendations.push('🚀 ปรับปรุงเซิร์ฟเวอร์หรือใช้ CDN');
    }
    
    if (domParsing > 500) {
      recommendations.push('📝 ลดขนาด HTML หรือย้าย JavaScript ไปท้ายหน้า');
    }
    
    if (pageLoadTime > 3000) {
      recommendations.push('⚡ ปรับปรุงการโหลดทรัพยากรและลดขนาดไฟล์');
    }

    if (recommendations.length > 0 && !this.isGitHubPages) {
      console.log('💡 คำแนะนำการปรับปรุงประสิทธิภาพ:', recommendations);
    }
  }

  // ตรวจสอบปัญหาประสิทธิภาพ
  checkPerformanceIssues() {
    const currentMemory = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
    
    // ตรวจสอบการใช้หน่วยความจำ
    if (currentMemory && currentMemory.used > 100 && !this.isGitHubPages) {
      console.warn(`🧠 การใช้หน่วยความจำสูง: ${currentMemory.used}MB`);
    }

    // ตรวจสอบ Network requests ที่ช้า
    const slowRequests = this.metrics.networkRequests.filter(req => req.duration > 1000);
    if (slowRequests.length > 0 && !this.isGitHubPages) {
      console.warn(`🌐 Network requests ช้า: ${slowRequests.length} requests`);
    }

    // ตรวจสอบการตอบสนองที่ช้า
    const slowInteractions = this.metrics.userInteractions.filter(interaction => interaction.delay > 16);
    if (slowInteractions.length > 5 && !this.isGitHubPages) {
      console.warn(`👆 การตอบสนองช้า: ${slowInteractions.length} interactions`);
    }
  }

  // สร้างรายงานประสิทธิภาพ
  generatePerformanceReport() {
    const report = {
      timestamp: Date.now(),
      pageLoad: this.metrics.pageLoad,
      coreWebVitals: this.metrics.coreWebVitals,
      averageFPS: this.calculateAverageFPS(),
      memoryTrend: this.calculateMemoryTrend(),
      networkSummary: this.calculateNetworkSummary(),
      userEngagement: this.calculateUserEngagement()
    };

    // เก็บรายงานในฐานข้อมูลท้องถิ่น
    this.storeReport(report);

    return report;
  }

  // คำนวณ FPS เฉลี่ย
  calculateAverageFPS() {
    if (this.metrics.fps.length === 0) return 0;
    
    const sum = this.metrics.fps.reduce((total, frame) => total + frame.fps, 0);
    return Math.round(sum / this.metrics.fps.length);
  }

  // คำนวณแนวโน้มการใช้หน่วยความจำ
  calculateMemoryTrend() {
    if (this.metrics.memoryUsage.length < 2) return 'stable';
    
    const recent = this.metrics.memoryUsage.slice(-5);
    const trend = recent[recent.length - 1].used - recent[0].used;
    
    if (trend > 10) return 'increasing';
    if (trend < -10) return 'decreasing';
    return 'stable';
  }

  // คำนวณสรุปเครือข่าย
  calculateNetworkSummary() {
    if (this.metrics.networkRequests.length === 0) return {};

    const totalRequests = this.metrics.networkRequests.length;
    const totalDuration = this.metrics.networkRequests.reduce((sum, req) => sum + req.duration, 0);
    const cachedRequests = this.metrics.networkRequests.filter(req => req.cached).length;

    return {
      totalRequests,
      averageDuration: Math.round(totalDuration / totalRequests),
      cacheHitRate: Math.round((cachedRequests / totalRequests) * 100)
    };
  }

  // คำนวณการมีส่วนร่วมของผู้ใช้
  calculateUserEngagement() {
    const totalInteractions = this.metrics.userInteractions.length;
    const interactionTypes = {};
    
    this.metrics.userInteractions.forEach(interaction => {
      interactionTypes[interaction.type] = (interactionTypes[interaction.type] || 0) + 1;
    });

    return {
      totalInteractions,
      interactionTypes,
      averageDelay: this.metrics.userInteractions.length > 0 
        ? Math.round(this.metrics.userInteractions.reduce((sum, i) => sum + i.delay, 0) / this.metrics.userInteractions.length)
        : 0
    };
  }

  // เก็บรายงานในฐานข้อมูลท้องถิ่น
  storeReport(report) {
    try {
      const reports = JSON.parse(localStorage.getItem('performance-reports') || '[]');
      reports.push(report);
      
      // เก็บเฉพาะ 10 รายงานล่าสุด
      if (reports.length > 10) {
        reports.shift();
      }
      
      localStorage.setItem('performance-reports', JSON.stringify(reports));
    } catch (error) {
      if (!this.isGitHubPages) {
        console.error('ไม่สามารถเก็บรายงานประสิทธิภาพได้:', error);
      }
    }
  }

  // ส่งรายงานสุดท้าย
  sendFinalReport() {
    const finalReport = this.generatePerformanceReport();
    finalReport.sessionDuration = Date.now() - this.sessionStart;
    
    // ส่งรายงานด้วย sendBeacon เพื่อความน่าเชื่อถือ (สำหรับโปรดักชั่น)
    if (navigator.sendBeacon && this.isGitHubPages) {
      const reportData = JSON.stringify(finalReport);
      // navigator.sendBeacon('/api/performance', reportData);
    }
  }

  // ส่งรายงานข้อผิดพลาด
  sendErrorReport(type, details) {
    const errorReport = {
      type,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: Date.now()
    };

    if (navigator.sendBeacon && this.isGitHubPages) {
      const reportData = JSON.stringify(errorReport);
      // navigator.sendBeacon('/api/errors', reportData);
    }
  }

  // ดูรายงานประสิทธิภาพ (สำหรับ debugging)
  getReports() {
    try {
      return JSON.parse(localStorage.getItem('performance-reports') || '[]');
    } catch (error) {
      if (!this.isGitHubPages) {
        console.error('ไม่สามารถดึงรายงานประสิทธิภาพได้:', error);
      }
      return [];
    }
  }

  // ล้างรายงานทั้งหมด
  clearReports() {
    localStorage.removeItem('performance-reports');
    if (!this.isGitHubPages) {
      console.log('ล้างรายงานประสิทธิภาพทั้งหมดแล้ว');
    }
  }

  // Backward compatibility methods
  recordMetric(name, value) {
    if (!this.isGitHubPages) {
      console.log(`📊 Performance: ${name} = ${value.toFixed ? value.toFixed(2) : value}${typeof value === 'number' ? 'ms' : ''}`);
    }
  }

  checkWebVitals() {
    // Compatibility method for existing code
    if (!this.isGitHubPages) {
      console.log('🌐 Web Vitals monitoring active');
    }
  }

  monitorResources() {
    // Compatibility method for existing code
    if (!this.isGitHubPages) {
      console.log('📦 Resource monitoring active');
    }
  }

  generateReport() {
    return this.generatePerformanceReport();
  }
}

// เริ่มต้นระบบตรวจสอบประสิทธิภาพ
const performanceMonitor = new AdvancedPerformanceMonitor();

// Export สำหรับใช้ในส่วนอื่น
window.performanceMonitor = performanceMonitor;

// เพิ่มคำสั่งสำหรับ developer console
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.perf = {
    reports: () => performanceMonitor.getReports(),
    clear: () => performanceMonitor.clearReports(),
    current: () => performanceMonitor.metrics
  };
  
  console.log('🔧 Developer tools พร้อมใช้งาน:');
  console.log('- perf.reports() - ดูรายงานประสิทธิภาพ');
  console.log('- perf.clear() - ล้างรายงานทั้งหมด');
  console.log('- perf.current() - ดูข้อมูลปัจจุบัน');
}

// Helper functions
window.getPerformanceReport = () => window.sweetFrozenPerf.getReport();
window.checkMemory = () => window.sweetFrozenPerf.checkMemoryUsage();

export default PerformanceMonitor;
