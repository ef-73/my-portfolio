/**
 * LoaderSignalCanvas.tsx
 *
 * Signal stabilization loader - FIXED VERSION
 * Proper: Canvas is ALWAYS rendered, but visibility controlled by state
 */

"use client";

import { useEffect, useRef, useState } from "react";

// Simple Perlin noise implementation
class SimpleNoise {
  private permutation: number[] = [];
  private p: number[] = [];

  constructor(seed: number = 0) {
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }

    let random = this.seededRandom(seed);
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [this.permutation[i], this.permutation[j]] = [
        this.permutation[j],
        this.permutation[i],
      ];
    }

    this.p = [...this.permutation, ...this.permutation];
  }

  private seededRandom(seed: number) {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number): number {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = this.fade(xf);
    const v = this.fade(yf);

    const aa = this.p[this.p[xi] + yi];
    const ab = this.p[this.p[xi] + yi + 1];
    const ba = this.p[this.p[xi + 1] + yi];
    const bb = this.p[this.p[xi + 1] + yi + 1];

    const x1 = this.lerp(
      u,
      this.grad(aa, xf, yf),
      this.grad(ba, xf - 1, yf)
    );
    const x2 = this.lerp(
      u,
      this.grad(ab, xf, yf - 1),
      this.grad(bb, xf - 1, yf - 1)
    );

    return this.lerp(v, x1, x2);
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetX: number;
  targetY: number;
  life: number;
}

const DEBUG = process.env.NODE_ENV !== "production";

export default function LoaderSignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // KEY FIX: Start with shouldShow = true, only decide to hide after mount
  const [shouldShow, setShouldShow] = useState(true);
  const [opacity, setOpacity] = useState(1);
  
  const noiseRef = useRef<SimpleNoise | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const DURATION = 1500; // ms
  const PARTICLE_COUNT = 1000;

  // PHASE 1: On mount, check if we should skip loader
  useEffect(() => {
    // Use sessionStorage for "first load only"
    const LOADER_KEY = "portfolio_loader_shown_session";
    const hasShownLoader = sessionStorage.getItem(LOADER_KEY);
    
    if (!hasShownLoader) {
      // First load - SHOW loader
      sessionStorage.setItem(LOADER_KEY, "true");
      setShouldShow(true);
      DEBUG && console.log("[LoaderSignalCanvas] ✓ First load - showing loader");
    } else {
      // Already shown - HIDE loader
      setShouldShow(false);
      DEBUG && console.log("[LoaderSignalCanvas] ✓ Already shown - hiding loader");
    }
  }, []);

  // PHASE 2: When shouldShow is true, render the animation
  useEffect(() => {
    if (!shouldShow) {
      DEBUG && console.log("[LoaderSignalCanvas] Loader hidden (shouldShow=false)");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      DEBUG && console.error("[LoaderSignalCanvas] Canvas ref is null!");
      return;
    }

    DEBUG && console.log("[LoaderSignalCanvas] Starting animation setup");

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      DEBUG && console.error("[LoaderSignalCanvas] Failed to get 2D context");
      return;
    }

    // Get proper DPI scaling
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect();
    
    if (!rect || rect.width === 0 || rect.height === 0) {
      DEBUG && console.error(
        `[LoaderSignalCanvas] Container zero dimensions: ${rect?.width}x${rect?.height}`
      );
      return;
    }

    // Set canvas size with DPI scaling
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    DEBUG && console.log(
      `[LoaderSignalCanvas] Canvas initialized: ${rect.width}x${rect.height} (DPR: ${dpr})`
    );

    // Initialize noise
    noiseRef.current = new SimpleNoise(Math.random() * 1000);

    // Create particles
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        targetX: 0,
        targetY: 0,
        life: Math.random(),
      });
    }
    particlesRef.current = particles;

    // Pre-create text masks
    const textMasks: Record<string, ImageData> = {};
    const createMask = (text: string) => {
      const textCanvas = document.createElement("canvas");
      textCanvas.width = rect.width;
      textCanvas.height = rect.height;
      const textCtx = textCanvas.getContext("2d");
      if (!textCtx) return;

      textCtx.fillStyle = "white";
      textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);
      textCtx.fillStyle = "black";
      textCtx.font = "bold 84px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui";
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";
      textCtx.fillText(text, rect.width / 2, rect.height / 2);

      const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);
      textMasks[text] = imageData;
    };

    createMask("Signal stabilizing...");
    createMask("Ethan Fung");

    startTimeRef.current = Date.now();

    const animate = () => {
      if (!canvas || !ctx || !startTimeRef.current) return;

      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      // Clear with white background
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, rect.width, rect.height);

      const noise = noiseRef.current!;

      // Determine which text to show
      let displayText = "Signal stabilizing…";
      if (progress > 0.65) {
        displayText = "Ethan Fung";
      }

      // Get pre-created text mask
      const textMask = textMasks[displayText];
      if (!textMask) return;

      const data = textMask.data;

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];

        // Find nearby black pixel (text)
        const searchRadius = 150;
        let foundPixel = false;

        for (let attempt = 0; attempt < 20 && !foundPixel; attempt++) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * searchRadius;
          const sampleX = particle.x + Math.cos(angle) * dist;
          const sampleY = particle.y + Math.sin(angle) * dist;

          if (
            sampleX >= 0 &&
            sampleX < rect.width &&
            sampleY >= 0 &&
            sampleY < rect.height
          ) {
            const idx =
              (Math.floor(sampleY) * Math.floor(rect.width) + Math.floor(sampleX)) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            if (r < 50 && g < 50 && b < 50) {
              particle.targetX = sampleX;
              particle.targetY = sampleY;
              foundPixel = true;
            }
          }
        }

        // Particle physics
        const noiseX = noise.noise(particle.x * 0.005 + elapsed * 0.00015, particle.y * 0.005);
        const noiseY = noise.noise(
          particle.x * 0.005 + 100 + elapsed * 0.00015,
          particle.y * 0.005 + 100
        );

        const noiseAmplitude = Math.pow(1 - progress, 2.2) * 5;
        const alignmentStrength = progress * progress * progress;

        particle.vx =
          noiseX * noiseAmplitude +
          (particle.targetX - particle.x) * alignmentStrength * 0.08;
        particle.vy =
          noiseY * noiseAmplitude +
          (particle.targetY - particle.y) * alignmentStrength * 0.08;

        particle.x += particle.vx * 0.85;
        particle.y += particle.vy * 0.85;

        // Bounds
        if (particle.x < 0) particle.x = rect.width;
        if (particle.x > rect.width) particle.x = 0;
        if (particle.y < 0) particle.y = rect.height;
        if (particle.y > rect.height) particle.y = 0;
      }

      // Render particles
      const particleOpacity = 0.6 + progress * 0.4;
      ctx.fillStyle = `rgba(0, 0, 0, ${particleOpacity})`;
      for (const particle of particles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 1.5 + progress * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, rect.width, rect.height);

        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("Click anywhere to continue", rect.width / 2, rect.height / 2 + 60);

        const handleClick = () => {
          let fadeProgress = 0;
          const fadeStart = Date.now();
          const fadeDuration = 300;

          const fadeOut = () => {
            fadeProgress = Math.min((Date.now() - fadeStart) / fadeDuration, 1);
            ctx.fillStyle = `rgba(255, 255, 255, ${1 - fadeProgress})`;
            ctx.fillRect(0, 0, rect.width, rect.height);

            if (fadeProgress < 1) {
              rafRef.current = requestAnimationFrame(fadeOut);
            } else {
              setShouldShow(false);
              setOpacity(0);
              canvas.removeEventListener("click", handleClick);
              DEBUG && console.log("[LoaderSignalCanvas] Fade complete - hiding loader");
            }
          };

          fadeOut();
        };

        canvas.addEventListener("click", handleClick, { once: true });
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    DEBUG && console.log("[LoaderSignalCanvas] Animation frame started");

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [shouldShow]);

  // Canvas is ALWAYS rendered when shouldShow is true
  if (!shouldShow) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
      style={{
        opacity,
        transition: opacity < 1 ? "opacity 0.3s ease-out" : "none",
        pointerEvents: shouldShow ? "auto" : "none",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{
          display: "block",
          margin: 0,
          padding: 0,
        }}
      />
    </div>
  );
}
