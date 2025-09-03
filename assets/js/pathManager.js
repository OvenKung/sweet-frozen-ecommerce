// Path management utility for GitHub Pages deployment
class PathManager {
  constructor() {
    this.isGitHubPages = window.location.hostname.includes('github.io');
    this.basePath = this.isGitHubPages ? this.getBasePath() : './';
  }

  getBasePath() {
    const pathname = window.location.pathname;
    // For GitHub Pages, the base path is usually /repository-name/
    if (pathname.includes('/sweet-frozen-ecommerce/')) {
      return './';
    }
    return './';
  }

  // Get correct path for assets
  asset(path) {
    if (path.startsWith('./') || path.startsWith('../')) {
      return path;
    }
    if (path.startsWith('/')) {
      return '.' + path;
    }
    return './' + path;
  }

  // Get correct path for pages
  page(path) {
    if (path.startsWith('./') || path.startsWith('../')) {
      return path;
    }
    if (path.startsWith('/')) {
      return '.' + path;
    }
    return './' + path;
  }

  // Safe redirect function
  redirect(path) {
    const safePath = this.page(path);
    window.location.href = safePath;
  }

  // Safe fetch function
  async safeFetch(path, options = {}) {
    const safePath = this.asset(path);
    try {
      const response = await fetch(safePath, options);
      return response;
    } catch (error) {
      console.warn('Fetch failed for:', safePath, error);
      throw error;
    }
  }
}

// Create global instance
window.pathManager = new PathManager();

// Helper functions for global use
window.safeRedirect = (path) => window.pathManager.redirect(path);
window.safeFetch = (path, options) => window.pathManager.safeFetch(path, options);

// Log current environment
if (window.pathManager.isGitHubPages) {
  console.log('🚀 Running on GitHub Pages - using safe path management');
} else {
  console.log('💻 Running locally - using standard paths');
}

export default PathManager;
