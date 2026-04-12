import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Animates a number from 0 to `target` over `duration` ms.
 *
 * Returns { ref, count }:
 *   - ref: attach to the container element so animation starts on scroll visibility
 *   - count: the current animated number
 *
 * The animation triggers once when the element enters the viewport.
 */
export default function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current || !target) return;
    hasAnimated.current = true;

    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad for a smooth deceleration
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [animate]);

  return { ref, count };
}
