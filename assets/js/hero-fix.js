// 🎯 Specific fix for Hero section iPad layout
document.addEventListener('DOMContentLoaded', function() {
  function fixHeroSectionLayout() {
    const heroGrid = document.querySelector('main section:first-child .grid');
    
    if (heroGrid && window.innerWidth >= 768 && window.innerWidth < 1280) {
      // Force 2-column layout for iPad
      heroGrid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr)) !important';
      heroGrid.style.gap = '1.5rem !important';
      heroGrid.style.display = 'grid !important';
      
      // Ensure child elements take proper column spans
      const children = heroGrid.children;
      if (children.length >= 2) {
        children[0].style.gridColumn = 'span 1';
        children[1].style.gridColumn = 'span 1';
      }
      
      console.log('Hero section fixed for iPad:', window.innerWidth + 'px');
    }
  }
  
  // Apply fix on load and resize
  fixHeroSectionLayout();
  window.addEventListener('resize', fixHeroSectionLayout);
});
