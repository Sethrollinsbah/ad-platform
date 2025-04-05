/**
 * Smoothly scrolls to a target element on the page
 * @param targetId - The ID of the element to scroll to (without the # prefix)
 * @param duration - The duration of the scroll animation in milliseconds
 * @param offset - Optional offset from the top of the target element (useful for fixed headers)
 */
export function smoothScrollTo(targetId: string, duration = 800, offset = 0) {
  // Prevent default anchor click behavior
  
  // Find the target element by ID
  const targetElement = document.getElementById(targetId);
  
  if (!targetElement) {
    console.warn(`Element with ID "${targetId}" not found.`);
    return;
  }
  
  // Get the current scroll position
  const startPosition = window.scrollY;
  
  // Calculate the distance to scroll (accounting for any offset)
  const targetPosition = targetElement.getBoundingClientRect().top + startPosition - offset;
  
  // Keep track of animation timing
  const startTime = performance.now();
  
  // Animation function
  function animateScroll(currentTime: number) {
    const elapsedTime = currentTime - startTime;
    
    // Calculate progress (0 to 1)
    const progress = Math.min(elapsedTime / duration, 1);
    
    // Apply easing function (easeInOutQuad) for smoother animation
    const easing = easeInOutQuad(progress);
    
    // Calculate current scroll position
    const currentPosition = startPosition + (targetPosition - startPosition) * easing;
    
    // Set the scroll position
    window.scrollTo(0, currentPosition);
    
    // Continue animation if not finished
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  
  // Start the animation
  requestAnimationFrame(animateScroll);
}

/**
 * Easing function for smoother animation
 * Creates an ease-in-out effect that starts slow, speeds up, then slows down at the end
 */
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Creates a navigation click handler with smooth scrolling
 * @param offset - Optional offset from the target (useful for fixed headers)
 */
export function createSmoothScrollHandler(offsetA = 0) {
  const offset = 120
  return (e: MouseEvent) => {
    // Get the target from the clicked element
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute('href');
    
    // Check if the href is a valid section ID (starts with #)
    if (href && href.startsWith('#')) {
      e.preventDefault();
      // Remove the # and pass to smooth scroll function
      const targetId = href.substring(1);
      smoothScrollTo(targetId, 800, offset);
    }
  };
}

