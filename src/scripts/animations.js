/**
 * Animation Module - Handles CSS animations and transitions
 */
export class AnimationModule {
  /**
   * Apply a fade-in animation to an element
   * @param {HTMLElement} element - The element to animate
   * @param {number} duration - Duration in milliseconds (default: 500)
   */
  fadeIn(element, duration = 500) {
    element.style.animation = `fadeIn ${duration}ms ease forwards`;
  }

  /**
   * Apply a fade-out animation to an element
   * @param {HTMLElement} element - The element to animate
   * @param {number} duration - Duration in milliseconds (default: 500)
   */
  fadeOut(element, duration = 500) {
    element.style.animation = `fadeOut ${duration}ms ease forwards`;
  }

  /**
   * Apply a slide-in animation from the right
   * @param {HTMLElement} element - The element to animate
   * @param {number} duration - Duration in milliseconds (default: 500)
   */
  slideInFromRight(element, duration = 500) {
    element.style.animation = `slideInFromRight ${duration}ms ease forwards`;
  }

  /**
   * Apply a slide-out animation to the left
   * @param {HTMLElement} element - The element to animate
   * @param {number} duration - Duration in milliseconds (default: 500)
   */
  slideOutToLeft(element, duration = 500) {
    element.style.animation = `slideOutToLeft ${duration}ms ease forwards`;
  }

  /**
   * Apply a pulse animation to an element
   * @param {HTMLElement} element - The element to animate
   * @param {number} duration - Duration in milliseconds (default: 2000)
   */
  pulse(element, duration = 2000) {
    element.style.animation = `pulse ${duration}ms infinite`;
  }

  /**
   * Stop all animations on an element
   * @param {HTMLElement} element - The element to stop animating
   */
  stopAnimation(element) {
    element.style.animation = 'none';
  }
}
