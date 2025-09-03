import { renderHeader, renderFooter, enableResetHotkey } from './ui.js';
import { currentUser } from './auth.js';

// Import enhanced systems for production safety
import './pathManager.js';
import './errorHandler.js';
import './performanceMonitor.js';

// Enhanced app initialization
async function initApp() {
  try {
    // Check if we're on GitHub Pages
    const isGitHubPages = window.location.hostname.includes('github.io');
    
    if (isGitHubPages) {
      console.log('🚀 Initializing Sweet Frozen on GitHub Pages...');
    } else {
      console.log('💻 Initializing Sweet Frozen locally...');
    }

    // Initialize UI components
    renderHeader(); 
    renderFooter(); 
    enableResetHotkey();
    
    // Log successful initialization
    console.log('✅ Sweet Frozen initialized successfully');
    
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    
    // Try fallback initialization
    setTimeout(() => {
      try {
        renderHeader(); 
        renderFooter(); 
        console.log('✅ Fallback initialization successful');
      } catch (fallbackError) {
        console.error('❌ Fallback initialization failed:', fallbackError);
      }
    }, 1000);
  }
}

// Wait for DOM to be ready, then initialize app
document.addEventListener('DOMContentLoaded', () => {
  // Add delay to let page-specific scripts load first
  setTimeout(initApp, 150);
});

// Also handle case where DOMContentLoaded already fired
if (document.readyState === 'loading') {
  // DOM is still loading, wait for DOMContentLoaded
} else {
  // DOM is already ready - initialize with delay
  setTimeout(initApp, 150);
}
