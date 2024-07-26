export function preventZoom() {
    document.addEventListener('gesturestart', function (e) {
      e.preventDefault();
    });
  
    document.addEventListener('touchmove', function (e) {
      if (e.scale !== 1) {
        e.preventDefault();
      }
    }, { passive: false });
  
    document.addEventListener('wheel', function (e) {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    }, { passive: false });
    
  }