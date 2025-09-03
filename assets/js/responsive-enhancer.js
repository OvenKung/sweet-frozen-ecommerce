// 🚀 Responsive Design Enhancements for Deployment

/**
 * Force responsive behavior and fix common deployment issues
 */
class ResponsiveEnhancer {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM and TailwindCSS to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.enhance());
    } else {
      this.enhance();
    }

    // Re-enhance on window resize
    window.addEventListener('resize', this.debounce(() => this.enhance(), 250));
  }

  enhance() {
    this.fixViewport();
    this.forceResponsiveGrid();
    this.enhanceMobileMenu();
    this.fixResponsiveImages();
    this.addTouchStyles();
  }

  /**
   * Fix viewport issues
   */
  fixViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes, viewport-fit=cover');
    }
  }

  /**
   * Force responsive grid behavior
   */
  forceResponsiveGrid() {
    const grids = document.querySelectorAll('#productGrid, .product-grid, [class*="grid-cols"]');
    
    grids.forEach(grid => {
      if (!grid) return;
      
      // Force grid display
      grid.style.display = 'grid';
      grid.style.gap = '1rem';
      
      // Apply responsive columns based on screen width
      const screenWidth = window.innerWidth;
      
      if (screenWidth < 640) {
        grid.style.gridTemplateColumns = 'repeat(1, minmax(0, 1fr))';
      } else if (screenWidth < 768) {
        grid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
        grid.style.gap = '1.5rem';
      } else if (screenWidth < 1024) {
        grid.style.gridTemplateColumns = 'repeat(3, minmax(0, 1fr))';
        grid.style.gap = '1.5rem';
      } else if (screenWidth < 1280) {
        grid.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
        grid.style.gap = '2rem';
      } else {
        grid.style.gridTemplateColumns = 'repeat(5, minmax(0, 1fr))';
        grid.style.gap = '2rem';
      }
    });
  }

  /**
   * Enhance mobile menu functionality
   */
  enhanceMobileMenu() {
    // Ensure mobile menu toggle works
    const mobileMenuBtn = document.querySelector('#mobileMenuToggle, [data-mobile-menu]');
    const mobileMenu = document.querySelector('#mobileMenu, .mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenu.classList.toggle('open');
        
        // Create/toggle overlay
        let overlay = document.querySelector('.mobile-overlay');
        if (!overlay) {
          overlay = document.createElement('div');
          overlay.className = 'mobile-overlay';
          document.body.appendChild(overlay);
          
          overlay.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            overlay.classList.remove('open');
          });
        }
        
        overlay.classList.toggle('open');
      });
    }
  }

  /**
   * Fix responsive images
   */
  fixResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.style.maxWidth) {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      }
    });
  }

  /**
   * Add touch-friendly styles
   */
  addTouchStyles() {
    // Make buttons touch-friendly
    const buttons = document.querySelectorAll('button, .btn, [role="button"]');
    buttons.forEach(btn => {
      if (!btn.style.minHeight) {
        btn.style.minHeight = '44px';
        btn.style.minWidth = '44px';
      }
    });

    // Fix iOS input zoom
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.type !== 'file' && input.type !== 'range') {
        const currentFontSize = window.getComputedStyle(input).fontSize;
        if (parseFloat(currentFontSize) < 16) {
          input.style.fontSize = '16px';
        }
      }
    });
  }

  /**
   * Debounce utility
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Force TailwindCSS responsive classes to work
   */
  forceTailwindResponsive() {
    // Create hidden elements with all responsive classes to force TailwindCSS to include them
    const hiddenDiv = document.createElement('div');
    hiddenDiv.style.display = 'none';
    hiddenDiv.className = `
      grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6
      text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl
      p-2 sm:p-4 md:p-6 lg:p-8 xl:p-10
      gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10
      hidden sm:block md:block lg:block xl:block
      flex-col sm:flex-row md:flex-row lg:flex-row
    `;
    document.body.appendChild(hiddenDiv);
    
    // Remove after forcing classes
    setTimeout(() => {
      document.body.removeChild(hiddenDiv);
    }, 100);
  }
}

// Initialize responsive enhancer
if (typeof window !== 'undefined') {
  new ResponsiveEnhancer();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResponsiveEnhancer;
}
