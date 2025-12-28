/**
 * Smooth Scrolling Utility Functions
 * Multiple methods to achieve smooth scrolling effects
 */

// ============================================
// Method 1: Native JavaScript scrollIntoView
// ============================================
export function scrollToElement(
  selector: string,
  options: {
    behavior?: ScrollBehavior;
    block?: ScrollLogicalPosition;
    inline?: ScrollLogicalPosition;
  } = {}
) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return;
  }

  element.scrollIntoView({
    behavior: options.behavior || "smooth",
    block: options.block || "start",
    inline: options.inline || "nearest",
  });
}

// ============================================
// Method 2: Native JavaScript window.scrollTo
// ============================================
export function scrollToPosition(
  position: number,
  options: {
    behavior?: ScrollBehavior;
    offset?: number;
  } = {}
) {
  const { behavior = "smooth", offset = 0 } = options;
  window.scrollTo({
    top: position - offset,
    left: 0,
    behavior,
  });
}

// ============================================
// Method 3: Scroll to element with offset
// ============================================
export function scrollToElementWithOffset(
  selector: string,
  offset: number = 0,
  behavior: ScrollBehavior = "smooth"
) {
  const element = document.querySelector(selector);
  if (!element) {
    console.warn(`Element not found: ${selector}`);
    return;
  }

  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior,
  });
}

// ============================================
// Method 4: Custom Smooth Scroll (No dependencies)
// ============================================
type EasingFunction = (t: number) => number;

// Easing functions
export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => {
    const u = 1 - t;
    return 1 - u * u * u;
  },
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => {
    const u = 1 - t;
    return 1 - u * u * u * u;
  },
  easeInOutQuart: (t: number) => {
    if (t < 0.5) {
      return 8 * t * t * t * t;
    } else {
      const u = 1 - t;
      return 1 - 8 * u * u * u * u;
    }
  },
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => {
    const u = 1 - t;
    return 1 - u * u * u * u * u;
  },
  easeInOutQuint: (t: number) => {
    if (t < 0.5) {
      return 16 * t * t * t * t * t;
    } else {
      const u = 1 - t;
      return 1 - 16 * u * u * u * u * u;
    }
  },
};

export function customSmoothScroll(
  target: string | number,
  options: {
    duration?: number;
    offset?: number;
    easing?: EasingFunction;
  } = {}
) {
  const {
    duration = 1000,
    offset = 0,
    easing = easingFunctions.easeInOutCubic,
  } = options;

  const start = window.pageYOffset;
  let targetY: number;

  if (typeof target === "string") {
    const element = document.querySelector(target);
    if (!element) {
      console.warn(`Element not found: ${target}`);
      return;
    }
    targetY =
      element.getBoundingClientRect().top + window.pageYOffset - offset;
  } else {
    targetY = target - offset;
  }

  const distance = targetY - start;
  const startTime = performance.now();

  function animate(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easing(progress);

    window.scrollTo(0, start + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  }

  requestAnimationFrame(animate);
}

// ============================================
// Method 5: GSAP Smooth Scroll (Advanced)
// ============================================
export async function gsapSmoothScroll(
  target: string | number,
  options: {
    duration?: number;
    offset?: number;
    ease?: string;
  } = {}
) {
  try {
    // Import GSAP
    const gsapModule = await import("gsap");
    const gsap = gsapModule.gsap || gsapModule.default || gsapModule;

    // Try to use ScrollToPlugin if available (premium plugin)
    let useScrollToPlugin = false;
    let ScrollToPlugin: any = null;
    
    try {
      const stp = await import("gsap/ScrollToPlugin");
      ScrollToPlugin = stp.ScrollToPlugin || stp.default || stp;
      if (ScrollToPlugin) {
        try {
          gsap.registerPlugin(ScrollToPlugin);
          useScrollToPlugin = true;
        } catch {
          // Plugin might already be registered
          useScrollToPlugin = true;
        }
      }
    } catch {
      // ScrollToPlugin not available, will use alternative method
    }

    const { duration = 1, offset = 0, ease = "power2.inOut" } = options;

    // Calculate target position
    let targetY: number;
    if (typeof target === "string") {
      const element = document.querySelector(target);
      if (!element) {
        console.warn(`Element not found: ${target}`);
        // Fallback to native scroll
        scrollToElementWithOffset(target, offset);
        return;
      }
      const rect = element.getBoundingClientRect();
      // Apply offset only for element selectors (to account for fixed headers)
      targetY = rect.top + window.pageYOffset - offset;
    } else {
      // For numeric targets (absolute positions), don't apply offset
      // Offset is only meaningful when scrolling to elements
      targetY = Math.max(0, target); // Ensure non-negative
    }

    // Method 1: Use ScrollToPlugin if available (premium)
    if (useScrollToPlugin && ScrollToPlugin) {
      gsap.to(window, {
        duration,
        scrollTo: { y: targetY, autoKill: false },
        ease,
        overwrite: "auto",
      });
    } else {
      // Method 2: Use GSAP core to animate scrollTop (works without premium plugin)
      const startY = window.pageYOffset;
      const distance = targetY - startY;
      
      // Create a temporary object to animate
      const scrollObj = { y: startY };
      
      gsap.to(scrollObj, {
        y: targetY,
        duration,
        ease,
        overwrite: "auto",
        onUpdate: () => {
          window.scrollTo(0, scrollObj.y);
        },
      });
    }
  } catch (error) {
    // Fallback to native smooth scroll if GSAP fails
    console.warn("GSAP scroll failed, using native scroll", error);
    const { offset = 0 } = options;
    if (typeof target === "string") {
      scrollToElementWithOffset(target, offset);
    } else {
      scrollToPosition(target, { offset });
    }
  }
}

// ============================================
// Method 6: Scroll to Top
// ============================================
export function scrollToTop(
  options: {
    behavior?: ScrollBehavior;
    duration?: number;
    easing?: EasingFunction;
  } = {}
) {
  const { behavior, duration, easing } = options;

  if (behavior === "smooth" || duration || easing) {
    if (duration || easing) {
      customSmoothScroll(0, { duration, easing });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

// ============================================
// Method 7: Scroll to Bottom
// ============================================
export function scrollToBottom(
  options: {
    behavior?: ScrollBehavior;
    duration?: number;
    easing?: EasingFunction;
  } = {}
) {
  const { behavior, duration, easing } = options;
  const bottom = document.documentElement.scrollHeight;

  if (behavior === "smooth" || duration || easing) {
    if (duration || easing) {
      customSmoothScroll(bottom, { duration, easing });
    } else {
      window.scrollTo({ top: bottom, behavior: "smooth" });
    }
  } else {
    window.scrollTo({ top: bottom, behavior: "smooth" });
  }
}

// ============================================
// Method 8: Scroll by amount (relative)
// ============================================
export function scrollBy(
  amount: number,
  options: {
    behavior?: ScrollBehavior;
    duration?: number;
    easing?: EasingFunction;
  } = {}
) {
  const { behavior, duration, easing } = options;
  const currentPosition = window.pageYOffset;
  const targetPosition = currentPosition + amount;

  if (duration || easing) {
    customSmoothScroll(targetPosition, { duration, easing });
  } else {
    window.scrollBy({ top: amount, behavior: behavior || "smooth" });
  }
}

