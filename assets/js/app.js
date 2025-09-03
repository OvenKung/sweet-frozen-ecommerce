import { renderHeader, renderFooter, enableResetHotkey } from './ui.js';
import { currentUser } from './auth.js';

// Wait for DOM to be ready, then render UI components
document.addEventListener('DOMContentLoaded', () => {
  // Add delay to let page-specific scripts update navbar first
  setTimeout(() => {
    renderHeader(); 
    renderFooter(); 
    enableResetHotkey();
  }, 150);
});

// Also handle case where DOMContentLoaded already fired
if (document.readyState === 'loading') {
  // DOM is still loading, wait for DOMContentLoaded
} else {
  // DOM is already ready - add delay here too
  setTimeout(() => {
    renderHeader(); 
    renderFooter(); 
    enableResetHotkey();
  }, 150);
}
