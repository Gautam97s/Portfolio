/**
 * React Hook for Smooth Scrolling
 * Provides easy-to-use smooth scroll functions in React components
 */

import { useCallback } from "react";
import {
  scrollToElement,
  scrollToPosition,
  scrollToElementWithOffset,
  customSmoothScroll,
  gsapSmoothScroll,
  scrollToTop,
  scrollToBottom,
  scrollBy,
  easingFunctions,
} from "./smoothScroll";

export function useSmoothScroll() {
  // Method 1: Scroll to element using scrollIntoView
  const scrollTo = useCallback(
    (
      selector: string,
      options?: {
        behavior?: ScrollBehavior;
        block?: ScrollLogicalPosition;
        inline?: ScrollLogicalPosition;
      }
    ) => {
      scrollToElement(selector, options);
    },
    []
  );

  // Method 2: Scroll to position
  const scrollToY = useCallback(
    (
      position: number,
      options?: {
        behavior?: ScrollBehavior;
        offset?: number;
      }
    ) => {
      scrollToPosition(position, options);
    },
    []
  );

  // Method 3: Scroll to element with offset (useful for fixed headers)
  const scrollToWithOffset = useCallback(
    (
      selector: string,
      offset: number = 80,
      behavior: ScrollBehavior = "smooth"
    ) => {
      scrollToElementWithOffset(selector, offset, behavior);
    },
    []
  );

  // Method 4: Custom smooth scroll with easing
  const smoothScroll = useCallback(
    (
      target: string | number,
      options?: {
        duration?: number;
        offset?: number;
        easing?: (t: number) => number;
      }
    ) => {
      customSmoothScroll(target, options);
    },
    []
  );

  // Method 5: GSAP smooth scroll (advanced)
  const gsapScroll = useCallback(
    async (
      target: string | number,
      options?: {
        duration?: number;
        offset?: number;
        ease?: string;
      }
    ) => {
      await gsapSmoothScroll(target, options);
    },
    []
  );

  // Method 6: Scroll to top
  const toTop = useCallback(
    (options?: {
      behavior?: ScrollBehavior;
      duration?: number;
      easing?: (t: number) => number;
    }) => {
      scrollToTop(options);
    },
    []
  );

  // Method 7: Scroll to bottom
  const toBottom = useCallback(
    (options?: {
      behavior?: ScrollBehavior;
      duration?: number;
      easing?: (t: number) => number;
    }) => {
      scrollToBottom(options);
    },
    []
  );

  // Method 8: Scroll by amount
  const by = useCallback(
    (
      amount: number,
      options?: {
        behavior?: ScrollBehavior;
        duration?: number;
        easing?: (t: number) => number;
      }
    ) => {
      scrollBy(amount, options);
    },
    []
  );

  return {
    scrollTo, // Native scrollIntoView
    scrollToY, // Scroll to Y position
    scrollToWithOffset, // Scroll to element with offset
    smoothScroll, // Custom smooth scroll with easing
    gsapScroll, // GSAP smooth scroll (advanced)
    toTop, // Scroll to top
    toBottom, // Scroll to bottom
    by, // Scroll by amount
    easingFunctions, // Available easing functions
  };
}

