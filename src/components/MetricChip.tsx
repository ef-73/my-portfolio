/**
 * MetricChip.tsx
 *
 * Animated metric display with numeric counters
 * - Ticks up on reveal
 * - Contextual: only display metrics relevant to the project
 * - High-signal metrics only (IoU, NDCG@10, accuracy, rankings)
 */

"use client";

import { useEffect, useRef, useState } from "react";

interface MetricChipProps {
  label: string;
  value: string | number;
  unit?: string;
  animateOnRender?: boolean;
}

export default function MetricChip({
  label,
  value,
  unit,
  animateOnRender = true,
}: MetricChipProps) {
  const [displayValue, setDisplayValue] = useState<string | number>(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  useEffect(() => {
    if (!animateOnRender || typeof value !== "number" || prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }

    setIsAnimating(true);
    const startValue = 0;
    const targetValue = value;
    const duration = 600; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing: ease-out-cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + (targetValue - startValue) * easeProgress;

      // Format based on value type
      if (typeof targetValue === "number") {
        if (targetValue < 1) {
          // Decimal (IoU, NDCG)
          setDisplayValue(currentValue.toFixed(2));
        } else {
          // Integer (rankings)
          setDisplayValue(Math.round(currentValue));
        }
      }

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
        setIsAnimating(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, animateOnRender, prefersReducedMotion]);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </span>
      <span
        className={`text-sm font-semibold text-zinc-900 dark:text-zinc-100 transition-all ${
          isAnimating ? "opacity-80" : "opacity-100"
        }`}
      >
        {displayValue}
        {unit && <span className="text-xs font-normal ml-0.5">{unit}</span>}
      </span>
    </div>
  );
}
